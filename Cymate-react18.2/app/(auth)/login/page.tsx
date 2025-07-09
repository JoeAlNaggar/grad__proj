"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LoginCredentials } from "../../types/auth";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "email":
        if (!value) return "Email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Please provide a valid email.";
        return "";
      case "password":
        if (!value) return "Password is required.";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate all fields
    const newErrors: { [key: string]: string } = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof LoginCredentials]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(formData.email, formData.password);
      if (result) {
        toast.success("Login Successful", {
          description: "Welcome back!",
        });
        // Let RouteGuard handle the redirect to prevent race conditions
      }
    } catch (error) {
      toast.error("Login Failed", {
        description: "please check your credentials and try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = () => {
    router.push("/forgot-password");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-purple-600 flex flex-col">
      {/* Header */}
      <div className="p-5">
        <div className="w-40 h-20 relative">
          <Image
            src="/logo.svg"
            alt="CyMate Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-6xl flex items-center gap-8">
          {/* Left Side - Illustration */}
          <div className="hidden lg:flex flex-1 justify-center">
            <div className="w-full max-w-lg">
              <Image
                src="/login-illustration.png"
                alt="Login illustration"
                width={500}
                height={400}
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="flex-1 max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1
                className="text-4xl font-bold text-purple-400 mb-2"
                style={{ fontFamily: "Bagel Fat One, sans-serif" }}
              >
                Login
              </h1>
            </div>

            <div className="bg-black/45 backdrop-blur-lg rounded-3xl border border-gray-700/30 p-8 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-white text-lg font-medium mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="name@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-purple-500/20 text-white rounded-md border-0 placeholder-gray-300/70 focus:outline-none focus:ring-2 focus:ring-white transition-all ${
                      errors.email ? "ring-2 ring-red-500" : ""
                    }`}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-white text-lg font-medium mb-2"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-purple-500/20 text-white rounded-md border-0 placeholder-gray-300/70 focus:outline-none focus:ring-2 focus:ring-white transition-all ${
                      errors.password ? "ring-2 ring-red-500" : ""
                    }`}
                    disabled={isLoading}
                  />
                  {errors.password && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white text-black font-medium text-xl py-3 rounded-xl hover:bg-purple-500 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>

                {/* Forgot Password Link */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    className="text-purple-400 font-medium hover:underline text-sm"
                  >
                    Forgot your password?
                  </button>
                </div>

                {/* Sign Up Link */}
                <p className="text-white text-center">
                  Don't have an account?{" "}
                  <Link
                    href="/register"
                    className="text-purple-400 font-bold hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
