"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authService } from "../../lib/auth";
import { RegisterData } from "../../types/auth";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<RegisterData>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "firstName":
        if (!value.trim()) return "First name is required.";
        if (value.trim().length < 2)
          return "First name must be at least 2 characters.";
        return "";
      case "lastName":
        if (!value.trim()) return "Last name is required.";
        if (value.trim().length < 2)
          return "Last name must be at least 2 characters.";
        return "";
      case "username":
        if (!value.trim()) return "Username is required.";
        if (value.length < 4)
          return "Username must be at least 4 characters long.";
        if (!/^[a-zA-Z0-9_]+$/.test(value))
          return "Username can only contain letters, numbers, and underscores.";
        return "";
      case "email":
        if (!value) return "Email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Invalid email address.";
        return "";
      case "password":
        if (!value) return "Password is required.";
        if (value.length < 8)
          return "Password must be at least 8 characters long.";
        if (!/(?=.*\d)/.test(value))
          return "Password must contain at least one number.";
        if (!/(?=.*[@$!%*?&#])/.test(value))
          return "Password must contain at least one special character.";
        if (!/(?=.*[a-z])/.test(value))
          return "Password must contain at least one lowercase letter.";
        if (!/(?=.*[A-Z])/.test(value))
          return "Password must contain at least one uppercase letter.";
        return "";
      case "confirmPassword":
        if (!value) return "Please confirm your password.";
        if (value !== formData.password) return "Passwords do not match.";
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

    // Also validate confirm password when password changes
    if (name === "password" && formData.confirmPassword) {
      const confirmError = validateField(
        "confirmPassword",
        formData.confirmPassword
      );
      if (confirmError && value !== formData.confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match.",
        }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate all fields
    const newErrors: { [key: string]: string } = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof RegisterData]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setIsLoading(false);
      return;
    }

    try {
      console.log('📤 Sending verification code to email:', formData.email); // Debug log
      
      // Store form data in sessionStorage for verification page
      sessionStorage.setItem('registrationData', JSON.stringify(formData));
      
      const result = await authService.sendVerificationCode(formData.email, 'registration');

      console.log('📥 Send verification code result:', result); // Debug log

      if (result.success) {
        toast.success("Verification Code Sent", {
          description: "Please check your email for the verification code",
        });

        // Redirect to verification page with slight delay to prevent race condition
        setTimeout(() => {
          router.push("/verify-email");
        }, 150);
      } else {
        toast.error("Failed to Send Code", {
          description: result.message || "Failed to send verification code. Please try again.",
        });
      }
    } catch (error) {
      console.error('💥 Unexpected error sending verification code:', error); // Debug log
      toast.error("Error", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
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
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-6xl flex items-center gap-8">
          {/* Left Side - Illustration */}
          <div className="hidden lg:flex flex-1 justify-center">
            <div className="w-full max-w-lg">
              <Image
                src="/signup-illustration.png"
                alt="Sign up illustration"
                width={500}
                height={400}
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="flex-1 max-w-md mx-auto">
            <div className="text-center mb-6">
              <h1
                className="text-4xl font-bold text-purple-400 mb-2"
                style={{ fontFamily: "Bagel Fat One, sans-serif" }}
              >
                Sign Up
              </h1>
            </div>

            <div className="bg-black/45 backdrop-blur-lg rounded-3xl border border-gray-700/30 p-8 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-white text-sm font-medium mb-1"
                    >
                      First name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 bg-purple-500/20 text-white rounded-md border-0 placeholder-gray-300/70 focus:outline-none focus:ring-2 focus:ring-white transition-all text-sm ${
                        errors.firstName ? "ring-2 ring-red-500" : ""
                      }`}
                      disabled={isLoading}
                    />
                    {errors.firstName && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-white text-sm font-medium mb-1"
                    >
                      Last name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 bg-purple-500/20 text-white rounded-md border-0 placeholder-gray-300/70 focus:outline-none focus:ring-2 focus:ring-white transition-all text-sm ${
                        errors.lastName ? "ring-2 ring-red-500" : ""
                      }`}
                      disabled={isLoading}
                    />
                    {errors.lastName && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Username Field */}
                <div>
                  <label
                    htmlFor="username"
                    className="block text-white text-sm font-medium mb-1"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 bg-purple-500/20 text-white rounded-md border-0 placeholder-gray-300/70 focus:outline-none focus:ring-2 focus:ring-white transition-all text-sm ${
                      errors.username ? "ring-2 ring-red-500" : ""
                    }`}
                    disabled={isLoading}
                  />
                  {errors.username && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.username}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-white text-sm font-medium mb-1"
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
                    className={`w-full px-3 py-2 bg-purple-500/20 text-white rounded-md border-0 placeholder-gray-300/70 focus:outline-none focus:ring-2 focus:ring-white transition-all text-sm ${
                      errors.email ? "ring-2 ring-red-500" : ""
                    }`}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-white text-sm font-medium mb-1"
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
                    className={`w-full px-3 py-2 bg-purple-500/20 text-white rounded-md border-0 placeholder-gray-300/70 focus:outline-none focus:ring-2 focus:ring-white transition-all text-sm ${
                      errors.password ? "ring-2 ring-red-500" : ""
                    }`}
                    disabled={isLoading}
                  />
                  {errors.password && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-white text-sm font-medium mb-1"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 bg-purple-500/20 text-white rounded-md border-0 placeholder-gray-300/70 focus:outline-none focus:ring-2 focus:ring-white transition-all text-sm ${
                      errors.confirmPassword ? "ring-2 ring-red-500" : ""
                    }`}
                    disabled={isLoading}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Terms */}
                <p className="text-white text-xs pt-2 font-medium">
                  By creating an account, you agree to the{" "}
                  <span className="text-purple-400">Terms of Service</span>.
                  We'll occasionally send you account-related emails.
                </p>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white text-black font-medium text-xl py-3 rounded-xl hover:bg-purple-500 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  {isLoading ? "Creating Account..." : "Sign up"}
                </button>

                {/* Login Link */}
                <p className="text-white text-center pt-2">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-purple-400 font-bold hover:underline"
                  >
                    Login
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
