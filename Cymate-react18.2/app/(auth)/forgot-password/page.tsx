"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authService } from "../../lib/auth";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string): string => {
    if (!email) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Invalid email address.";
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setIsLoading(true);

    try {
      console.log('📤 Sending password reset code to:', email); // Debug log
      
      // Store email in sessionStorage for reset password verification page
      sessionStorage.setItem('resetPasswordEmail', email);
      
      const result = await authService.sendVerificationCode(email, 'password_reset');

      console.log('📥 Send password reset code result:', result); // Debug log

      if (result.success) {
        toast.success("Reset Code Sent", {
          description: "Please check your email for the password reset code",
        });

        // Redirect to password reset verification page
        router.push("/reset-password");
      } else {
        setError(result.message || "Failed to send reset code. Please try again.");
      }
    } catch (error) {
      console.error('💥 Unexpected error sending reset code:', error); // Debug log
      setError("An unexpected error occurred. Please try again.");
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
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="w-full max-w-6xl flex items-center gap-8">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex flex-1 justify-center">
          <div className="w-full max-w-lg">
            <Image
              src="/forget-password-illustration.png" // Update with your actual illustration path
              alt="Forgot password illustration"
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
              Forgot Password
            </h1>
            <p className="text-white/80 text-sm">
              Enter your email address and we'll send you a code to reset your password
            </p>
          </div>

          <div className="bg-black/45 backdrop-blur-lg rounded-3xl border border-gray-700/30 p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-white text-lg font-medium mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="name@email.com"
                  value={email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-purple-500/20 text-white rounded-md border-0 placeholder-gray-300/70 focus:outline-none focus:ring-2 focus:ring-white transition-all ${
                    error ? "ring-2 ring-red-500" : ""
                  }`}
                  disabled={isLoading}
                />
                {error && (
                  <p className="text-red-400 text-sm mt-1">
                    {error}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full bg-white text-black font-medium text-xl py-3 rounded-xl hover:bg-purple-500 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending Code..." : "Send Reset Code"}
              </button>

              {/* Login Link */}
              <div className="text-center pt-4 border-t border-gray-700/30">
                <p className="text-white/80 text-sm mb-2">
                  Remember your password?
                </p>
                <Link
                  href="/login"
                  className="text-purple-400 font-medium hover:underline"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
);
} 