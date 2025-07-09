"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authService } from "@/app/lib/auth"
import { toast } from "sonner"

export default function SecurityManagement() {
  const router = useRouter()
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handlePasswordChange = async () => {
    // Validation
    if (!oldPassword.trim()) {
      toast.error("Please enter your current password")
      return
    }

    if (!newPassword.trim()) {
      toast.error("Please enter a new password")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long")
      return
    }

    setIsLoading(true)

    try {
      const result = await authService.changePassword(oldPassword, newPassword)
      
      if (result.success) {
        toast.success("Password changed successfully")
        // Clear form
        setOldPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        toast.error(result.message || "Failed to change password")
      }
    } catch (error: any) {
      console.error("Password change error:", error)
      toast.error("An error occurred while changing password")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const result = await authService.logout()
      if (result.success) {
        toast.success("Logged out successfully")
        // Redirect to login page
        router.push("/login")
      } else {
        toast.error(result.message || "Logout failed")
      }
    } catch (error: any) {
      console.error("Logout error:", error)
      toast.error("An error occurred during logout")
    }
  }

  return (
    <div className="space-y-8">
      {/* Password Change Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Change Password</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Update your account password</p>
        </div>
        
        <div className="space-y-4 max-w-[100rem]">
          <div>
            <Label htmlFor="old-password">Current Password</Label>
            <Input
              id="old-password"
              type="password"
              placeholder="Enter your current password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="my-2 bg-gray-50 dark:bg-slate-700 dark:text-gray-300 dark:border-slate-600"
              style={{ boxShadow: 'none' }}
              disabled={isLoading}
            />
          </div>
          
          <div>
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="my-2 bg-gray-50 dark:bg-slate-700 dark:text-gray-300 dark:border-slate-600"
              style={{ boxShadow: 'none' }}
              disabled={isLoading}
            />
          </div>
          
          <div>
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="my-2 bg-gray-50 dark:bg-slate-700 dark:text-gray-300 dark:border-slate-600"
              style={{ boxShadow: 'none' }}
              disabled={isLoading}
            />
          </div>
          
          <Button 
            onClick={handlePasswordChange} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Changing Password..." : "Change Password"}
          </Button>
        </div>
      </div>

      {/* Logout Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Sign Out</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Sign out of your account</p>
        </div>
        
        <div className="max-w-[100rem]">
          <Button 
            onClick={handleLogout}
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 text-white w-full"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}
