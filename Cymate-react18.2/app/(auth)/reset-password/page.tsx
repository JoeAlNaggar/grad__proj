"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authService } from "../../lib/auth";
import { toast } from "sonner";


export default function ResetPasswordPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [step, setStep] = useState<'verify' | 'reset'>('verify');
  const [resetToken, setResetToken] = useState<string | null>(null);

  useEffect(() => {
    // Get email from sessionStorage
    const storedEmail = sessionStorage.getItem('resetPasswordEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // If no email, redirect to forgot password
      router.push("/forgot-password");
    }
  }, [router]);

  const validatePassword = (password: string): string => {
    if (!password) return "Password is required.";
    if (password.length < 8)
      return "Password must be at least 8 characters long.";
    if (!/(?=.*\d)/.test(password))
      return "Password must contain at least one number.";
    if (!/(?=.*[@$!%*?&#])/.test(password))
      return "Password must contain at least one special character.";
    if (!/(?=.*[a-z])/.test(password))
      return "Password must contain at least one lowercase letter.";
    if (!/(?=.*[A-Z])/.test(password))
      return "Password must contain at least one uppercase letter.";
    return "";
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setCode(value);
      if (errors.code) {
        setErrors(prev => ({ ...prev, code: "" }));
      }
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'newPassword') {
      setNewPassword(value);
      if (errors.newPassword) {
        setErrors(prev => ({ ...prev, newPassword: "" }));
      }
      // Also validate confirm password if it exists
      if (confirmPassword && value !== confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match." }));
      } else if (confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: "" }));
      }
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
      if (errors.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.length !== 6) {
      setErrors({ code: "Please enter a 6-digit verification code" });
      return;
    }

    setIsLoading(true);

    try {
      console.log('📤 Verifying reset code:', code); // Debug log
      
      const result = await authService.verifyCode(email, code, 'password_reset');
      console.log(result)

      if (result.success && result.token) {
        setResetToken(result.token);
        setStep('reset');
        toast.success("Code Verified", {
          description: "Please enter your new password",
        });
      } else {
        setErrors({ code: result.message || "Invalid or expired verification code" });
      }
    } catch (error) {
      console.error('💥 Unexpected verification error:', error); // Debug log
      setErrors({ code: "An unexpected error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setErrors({ newPassword: passwordError });
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match." });
      return;
    }

    if (!resetToken) {
      setErrors({ general: "Reset token not found. Please verify your code again." });
      return;
    }

    setIsLoading(true);

    try {
      console.log('📤 Resetting password with token'); // Debug log
      
      const result = await authService.resetPasswordWithToken(email, resetToken, newPassword);

      if (result.success) {
        // Clear stored email
        sessionStorage.removeItem('resetPasswordEmail');
        
        toast.success("Password Reset Successful", {
          description: "Your password has been reset. Please log in with your new password.",
        });

        // Redirect to login with slight delay to prevent race condition
        setTimeout(() => {
          router.push("/login");
        }, 150);
      } else {
        setErrors({ general: result.message || "Password reset failed. Please try again." });
      }
    } catch (error) {
      console.error('💥 Unexpected password reset error:', error); // Debug log
      setErrors({ general: "An unexpected error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) return;

    setIsResending(true);
    try {
      const result = await authService.sendVerificationCode(email, 'password_reset');
      
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

  if (!email) {
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
              src="/reset-password-illustration.png" // Update with your illustration path
              alt="Reset password illustration"
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
              {step === 'verify' ? 'Verify Code' : 'Reset Password'}
            </h1>
            {step === 'verify' ? (
              <>
                <p className="text-white/80 text-sm">
                  We've sent a 6-digit code to
                </p>
                <p className="text-purple-400 font-medium text-sm">{email}</p>
              </>
            ) : (
              <p className="text-white/80 text-sm">
                Enter your new password below
              </p>
            )}
          </div>

          <div className="bg-black/45 backdrop-blur-lg rounded-3xl border border-gray-700/30 p-8 shadow-2xl">
            {step === 'verify' ? (
              <form onSubmit={handleVerifyCode} className="space-y-6">
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
                    onChange={handleCodeChange}
                    className={`w-full px-4 py-3 bg-purple-500/20 text-white rounded-md border-0 placeholder-gray-300/70 focus:outline-none focus:ring-2 focus:ring-white transition-all text-center text-2xl font-mono tracking-widest ${
                      errors.code ? "ring-2 ring-red-500" : ""
                    }`}
                    disabled={isLoading}
                    maxLength={6}
                  />
                  {errors.code && (
                    <p className="text-red-400 text-sm mt-2 text-center">
                      {errors.code}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || code.length !== 6}
                  className="w-full bg-white text-black font-medium text-xl py-3 rounded-xl hover:bg-purple-500 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Verifying..." : "Verify Code"}
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
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-6">
                {/* New Password Field */}
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-white text-lg font-medium mb-2"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-4 py-3 bg-purple-500/20 text-white rounded-md border-0 placeholder-gray-300/70 focus:outline-none focus:ring-2 focus:ring-white transition-all ${
                      errors.newPassword ? "ring-2 ring-red-500" : ""
                    }`}
                    disabled={isLoading}
                  />
                  {errors.newPassword && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-white text-lg font-medium mb-2"
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-4 py-3 bg-purple-500/20 text-white rounded-md border-0 placeholder-gray-300/70 focus:outline-none focus:ring-2 focus:ring-white transition-all ${
                      errors.confirmPassword ? "ring-2 ring-red-500" : ""
                    }`}
                    disabled={isLoading}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* General Error */}
                {errors.general && (
                  <p className="text-red-400 text-sm text-center">
                    {errors.general}
                  </p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !newPassword || !confirmPassword}
                  className="w-full bg-white text-black font-medium text-xl py-3 rounded-xl hover:bg-purple-500 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}

            {/* Back Link */}
            <div className="text-center pt-4 border-t border-gray-700/30 mt-6">
              <Link
                href={step === 'verify' ? "/forgot-password" : "/login"}
                className="text-purple-400 font-medium hover:underline text-sm"
              >
                ← {step === 'verify' ? 'Back to Forgot Password' : 'Back to Login'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
} 