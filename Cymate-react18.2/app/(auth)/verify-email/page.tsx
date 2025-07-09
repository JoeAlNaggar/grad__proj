"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authService } from "../../lib/auth";
import { RegisterData } from "../../types/auth";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const router = useRouter();
  
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [registrationData, setRegistrationData] = useState<RegisterData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get registration data from sessionStorage
    const storedData = sessionStorage.getItem('registrationData');
    if (storedData) {
      const data = JSON.parse(storedData);
      setRegistrationData(data);
      setEmail(data.email);
    } else {
      // If no registration data, redirect to register
      router.push("/register");
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setCode(value);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registrationData) {
      toast.error("Error", {
        description: "Registration data not found. Please start registration again.",
      });
      router.push("/register");
      return;
    }

    if (code.length !== 6) {
      setError("Please enter a 6-digit verification code");
      return;
    }

    setIsLoading(true);

    try {
      console.log('📤 Verifying code:', code); // Debug log
      
      // First verify the code
    //   const verifyResult = await authService.verifyCode(email, code, 'registration');

      if (code) {
        // If code is valid, proceed with enhanced registration
        const registrationResult = await authService.enhancedRegistration(registrationData, code);

        if (registrationResult.success) {
          // Clear stored registration data
          sessionStorage.removeItem('registrationData');
          
          toast.success("Registration Successful", {
            description: "Your account has been verified! Please log in.",
          });

          // Redirect to login with slight delay to prevent race condition
          setTimeout(() => {
            router.push("/login");
          }, 150);
        } else {
          // Handle registration errors
          if (registrationResult.message) {
            setError(registrationResult.message);
          } else {
            setError("Registration failed. Please try again.");
          }
        }
      } else {
        setError("Invalid or expired verification code");
      }
    } catch (error) {
      console.error('💥 Unexpected verification error:', error); // Debug log
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) return;

    setIsResending(true);
    try {
      const result = await authService.sendVerificationCode(email, 'registration');
      
      if (result.success) {
        toast.success("Code Resent", {
          description: "A new verification code has been sent to your email",
        });
      } else {
        toast.error("Failed to Resend", {
          description: result.message || "Failed to resend verification code",
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to resend verification code",
      });
    } finally {
      setIsResending(false);
    }
  };

  if (!registrationData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-purple-600 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

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
                src="/verify-email-illustration.png" // Update with your illustration path
                alt="Verify email illustration"
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
                Verify Email
              </h1>
              <p className="text-white/80 text-sm">
                We've sent a 6-digit code to
              </p>
              <p className="text-purple-400 font-medium text-sm">{email}</p>
            </div>
  
            <div className="bg-black/45 backdrop-blur-lg rounded-3xl border border-gray-700/30 p-8 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Code Input */}
                <div>
                  <label
                    htmlFor="code"
                    className="block text-white text-lg font-medium mb-3 text-center"
                  >
                    Enter Verification Code
                  </label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    placeholder="123456"
                    value={code}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-purple-500/20 text-white rounded-md border-0 placeholder-gray-300/70 focus:outline-none focus:ring-2 focus:ring-white transition-all text-center text-2xl font-mono tracking-widest ${
                      error ? "ring-2 ring-red-500" : ""
                    }`}
                    disabled={isLoading}
                    maxLength={6}
                  />
                  {error && (
                    <p className="text-red-400 text-sm mt-2 text-center">
                      {error}
                    </p>
                  )}
                </div>
  
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || code.length !== 6}
                  className="w-full bg-white text-black font-medium text-xl py-3 rounded-xl hover:bg-purple-500 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Verifying..." : "Verify & Create Account"}
                </button>
  
                {/* Resend Code */}
                <div className="text-center">
                  <p className="text-white/80 text-sm mb-2">
                    Didn't receive the code?
                  </p>
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={isResending}
                    className="text-purple-400 font-medium hover:underline disabled:opacity-50 text-sm"
                  >
                    {isResending ? "Resending..." : "Resend Code"}
                  </button>
                </div>
  
                {/* Back to Register Link */}
                <div className="text-center pt-4 border-t border-gray-700/30 mt-6">
                  <Link
                    href="/register"
                    className="text-purple-400 font-medium hover:underline text-sm"
                  >
                    ← Back to Registration
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