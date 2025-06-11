"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ClipboardCheck, Search, CheckCircle, XCircle, Eye, FileText, User, Shield } from "lucide-react"

export const VerificationCenterSection = () => {
  const [selectedTab, setSelectedTab] = useState<"profiles" | "tools">("profiles")
  const [usernameInput, setUsernameInput] = useState("")
  const [showVerifyActions, setShowVerifyActions] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [showRejectionInput, setShowRejectionInput] = useState(false)
  const [notification, setNotification] = useState<{ message: string; type: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null)
  const [currentToolId, setCurrentToolId] = useState<string | null>(null)

  // Mock profiles data
  const [profiles, setProfiles] = useState([
    {
      id: "1",
      username: "johndoe",
      email: "john.doe@example.com",
      fullName: "John Doe",
      frontIdUrl: "/placeholder.svg?height=300&width=500",
      backIdUrl: "/placeholder.svg?height=300&width=500",
      selfieUrl: "/placeholder.svg?height=300&width=300",
      status: "pending",
    },
    {
      id: "2",
      username: "janedoe",
      email: "jane.doe@example.com",
      fullName: "Jane Doe",
      frontIdUrl: "/placeholder.svg?height=300&width=500",
      backIdUrl: "/placeholder.svg?height=300&width=500",
      selfieUrl: "/placeholder.svg?height=300&width=300",
      status: "pending",
    },
    {
      id: "3",
      username: "alexsmith",
      email: "alex.smith@example.com",
      fullName: "Alex Smith",
      frontIdUrl: "/placeholder.svg?height=300&width=500",
      backIdUrl: "/placeholder.svg?height=300&width=500",
      selfieUrl: "/placeholder.svg?height=300&width=300",
      status: "pending",
    },
  ])

  // Mock tools data
  const [tools, setTools] = useState([
    {
      id: "1",
      name: "Network Scanner Pro",
      tags: ["security", "network", "scanning"],
      pdfUrl: "#",
      link: "https://example.com/network-scanner",
      description: "Advanced network scanning tool with vulnerability detection capabilities.",
      status: "premium",
      username: "securitydev",
      pending: true,
    },
    {
      id: "2",
      name: "Password Strength Analyzer",
      tags: ["security", "password", "analysis"],
      pdfUrl: "#",
      link: "https://example.com/password-analyzer",
      description: "Tool to analyze password strength and suggest improvements.",
      status: "free",
      username: "johndoe",
      pending: true,
    },
    {
      id: "3",
      name: "Encryption Toolkit",
      tags: ["security", "encryption", "privacy"],
      pdfUrl: "#",
      link: "https://example.com/encryption-toolkit",
      description: "Comprehensive toolkit for file and message encryption.",
      status: "freemium",
      username: "cryptoexpert",
      pending: true,
    },
  ])

  // Handle username input for verification
  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (usernameInput.trim()) {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        setShowVerifyActions(true)
        setIsLoading(false)
      }, 600)
    }
  }

  // Handle profile verification
  const handleVerifyProfile = (profileId: string) => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setProfiles(profiles.map((profile) => (profile.id === profileId ? { ...profile, status: "verified" } : profile)))

      setNotification({
        message: `Profile has been verified successfully. User has been notified.`,
        type: "success",
      })

      setIsLoading(false)
      setShowVerifyActions(false)
      setUsernameInput("")

      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }, 800)
  }

  // Handle profile rejection
  const handleRejectProfile = (profileId: string) => {
    setCurrentProfileId(profileId)
    setShowRejectionInput(true)
  }

  // Submit profile rejection
  const submitProfileRejection = () => {
    if (!rejectionReason.trim()) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setProfiles(
        profiles.map((profile) => (profile.id === currentProfileId ? { ...profile, status: "rejected" } : profile)),
      )

      setNotification({
        message: `Profile has been rejected. User has been notified with the reason.`,
        type: "warning",
      })

      setIsLoading(false)
      setShowRejectionInput(false)
      setRejectionReason("")
      setCurrentProfileId(null)
      setShowVerifyActions(false)
      setUsernameInput("")

      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }, 800)
  }

  // Handle tool publication
  const handlePublishTool = (toolId: string) => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setTools(tools.map((tool) => (tool.id === toolId ? { ...tool, pending: false } : tool)))

      setNotification({
        message: `Tool has been published successfully to the Tool Station.`,
        type: "success",
      })

      setIsLoading(false)

      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }, 800)
  }

  // Handle tool rejection
  const handleRejectTool = (toolId: string) => {
    setCurrentToolId(toolId)
    setShowRejectionInput(true)
  }

  // Submit tool rejection
  const submitToolRejection = (sendAlert: boolean) => {
    if (!rejectionReason.trim()) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setTools(tools.filter((tool) => tool.id !== currentToolId))

      setNotification({
        message: sendAlert
          ? `Tool has been rejected and user has been alerted about unsafe content.`
          : `Tool has been rejected. User has been notified with the reason.`,
        type: sendAlert ? "error" : "warning",
      })

      setIsLoading(false)
      setShowRejectionInput(false)
      setRejectionReason("")
      setCurrentToolId(null)

      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }, 800)
  }

  // View profile details
  const viewProfile = (profileId: string) => {
    const profile = profiles.find((p) => p.id === profileId)
    if (profile) {
      alert(`Viewing profile: ${profile.fullName}\nUsername: ${profile.username}\nEmail: ${profile.email}`)
    }
  }

  // View user content
  const viewUserContent = (username: string) => {
    alert(`Viewing content shared by user: ${username}`)
  }

  return (
    <>
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
              notification.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : notification.type === "error"
                  ? "bg-red-100 text-red-800 border border-red-200"
                  : notification.type === "warning"
                    ? "bg-amber-100 text-amber-800 border border-amber-200"
                    : "bg-blue-100 text-blue-800 border border-blue-200"
            }`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rejection Reason Modal */}
      <AnimatePresence>
        {showRejectionInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-semibold mb-4">
                {currentProfileId ? "Reject Profile Verification" : "Reject Tool Publication"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Please provide a reason for rejection. This will be sent to the user.
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white mb-4"
                rows={4}
                placeholder="Enter rejection reason..."
              ></textarea>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowRejectionInput(false)
                    setRejectionReason("")
                    setCurrentProfileId(null)
                    setCurrentToolId(null)
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors"
                >
                  Cancel
                </button>
                {currentToolId ? (
                  <>
                    <button
                      onClick={() => submitToolRejection(false)}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md transition-colors"
                    >
                      Reject Tool
                    </button>
                    <button
                      onClick={() => submitToolRejection(true)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                    >
                      Reject & Alert
                    </button>
                  </>
                ) : (
                  <button
                    onClick={submitProfileRejection}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                  >
                    Reject Profile
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
            <ClipboardCheck className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold">Verification Center</h2>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            className={`px-4 py-2 border-b-2 ${
              selectedTab === "profiles"
                ? "border-blue-500 text-blue-500"
                : "border-transparent text-gray-500 dark:text-gray-400"
            } font-medium transition-colors`}
            onClick={() => setSelectedTab("profiles")}
          >
            Profile Verification
          </button>
          <button
            className={`px-4 py-2 border-b-2 ${
              selectedTab === "tools"
                ? "border-blue-500 text-blue-500"
                : "border-transparent text-gray-500 dark:text-gray-400"
            } font-medium transition-colors`}
            onClick={() => setSelectedTab("tools")}
          >
            Tool Verification
          </button>
        </div>

        {/* Profile Verification Tab */}
        {selectedTab === "profiles" && (
          <div>
            {/* Search Form */}
            <form onSubmit={handleUsernameSubmit} className="mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="username"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter username to verify"
                    />
                  </div>
                </div>
                <div className="self-end">
                  <button
                    type="submit"
                    disabled={!usernameInput.trim() || isLoading}
                    className={`px-4 py-2 rounded-md text-white font-medium ${
                      !usernameInput.trim() || isLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Loading...
                      </div>
                    ) : (
                      "Find User"
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Verification Actions */}
            {showVerifyActions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-800 dark:text-blue-300">User Found</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      User <strong>{usernameInput}</strong> has submitted verification documents including front and
                      back of national ID card and a selfie with ID. Please review and take action.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium mb-2">Front ID</h4>
                    <img
                      src="/placeholder.svg?height=150&width=250"
                      alt="Front ID"
                      className="w-full h-auto rounded-md"
                    />
                    <button className="mt-2 w-full py-1 px-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-sm transition-colors">
                      View Full Size
                    </button>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium mb-2">Back ID</h4>
                    <img
                      src="/placeholder.svg?height=150&width=250"
                      alt="Back ID"
                      className="w-full h-auto rounded-md"
                    />
                    <button className="mt-2 w-full py-1 px-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-sm transition-colors">
                      View Full Size
                    </button>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium mb-2">Selfie with ID</h4>
                    <img
                      src="/placeholder.svg?height=150&width=150"
                      alt="Selfie"
                      className="w-full h-auto rounded-md"
                    />
                    <button className="mt-2 w-full py-1 px-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-sm transition-colors">
                      View Full Size
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 justify-end">
                  <button
                    onClick={() => viewUserContent(usernameInput)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View User Content
                  </button>
                  <button
                    onClick={() => handleRejectProfile("1")}
                    className="px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-md transition-colors flex items-center gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject Verification
                  </button>
                  <button
                    onClick={() => handleVerifyProfile("1")}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve Verification
                  </button>
                </div>
              </motion.div>
            )}

            {/* Pending Profiles */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">
                Pending Verification ({profiles.filter((p) => p.status === "pending").length})
              </h3>
              <div className="space-y-4">
                {profiles
                  .filter((profile) => profile.status === "pending")
                  .map((profile) => (
                    <div
                      key={profile.id}
                      className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300">
                              {profile.fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <h4 className="font-medium">{profile.fullName}</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">@{profile.username}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{profile.email}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => viewProfile(profile.id)}
                              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors flex items-center gap-1 text-sm"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </button>
                            <button
                              onClick={() => handleRejectProfile(profile.id)}
                              className="px-3 py-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-md transition-colors flex items-center gap-1 text-sm"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              Reject
                            </button>
                            <button
                              onClick={() => handleVerifyProfile(profile.id)}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center gap-1 text-sm"
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                              Approve
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            <h4 className="text-xs font-medium mb-2 text-gray-500 dark:text-gray-400">Front ID</h4>
                            <img
                              src={profile.frontIdUrl || "/placeholder.svg"}
                              alt="Front ID"
                              className="w-full h-auto rounded-md border border-gray-200 dark:border-gray-600"
                            />
                            <button
                              onClick={() => window.open(profile.frontIdUrl, "_blank")}
                              className="mt-2 w-full py-1 px-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 rounded text-xs transition-colors"
                            >
                              View Full Size
                            </button>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            <h4 className="text-xs font-medium mb-2 text-gray-500 dark:text-gray-400">Back ID</h4>
                            <img
                              src={profile.backIdUrl || "/placeholder.svg"}
                              alt="Back ID"
                              className="w-full h-auto rounded-md border border-gray-200 dark:border-gray-600"
                            />
                            <button
                              onClick={() => window.open(profile.backIdUrl, "_blank")}
                              className="mt-2 w-full py-1 px-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 rounded text-xs transition-colors"
                            >
                              View Full Size
                            </button>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            <h4 className="text-xs font-medium mb-2 text-gray-500 dark:text-gray-400">
                              Selfie with ID
                            </h4>
                            <img
                              src={profile.selfieUrl || "/placeholder.svg"}
                              alt="Selfie with ID"
                              className="w-full h-auto rounded-md border border-gray-200 dark:border-gray-600"
                            />
                            <button
                              onClick={() => window.open(profile.selfieUrl, "_blank")}
                              className="mt-2 w-full py-1 px-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 rounded text-xs transition-colors"
                            >
                              View Full Size
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                {profiles.filter((p) => p.status === "pending").length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>No pending profile verifications</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recently Verified Profiles */}
            <div>
              <h3 className="text-lg font-medium mb-4">Recently Verified</h3>
              <div className="space-y-4">
                {profiles
                  .filter((profile) => profile.status === "verified")
                  .map((profile) => (
                    <div
                      key={profile.id}
                      className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 dark:text-green-300">
                            {profile.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{profile.fullName}</h4>
                              <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Verified
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">@{profile.username}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{profile.email}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => viewProfile(profile.id)}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors flex items-center gap-1 text-sm"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                {profiles.filter((p) => p.status === "verified").length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>No verified profiles yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tool Verification Tab */}
        {selectedTab === "tools" && (
          <div>
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-800 dark:text-blue-300">Tool Verification Guidelines</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Before approving tools, ensure they meet our security standards and do not contain malicious code.
                    Review the tool documentation and test functionality when possible.
                  </p>
                </div>
              </div>
            </div>

            {/* Pending Tools */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Pending Tools ({tools.filter((t) => t.pending).length})</h3>
              <div className="space-y-4">
                {tools
                  .filter((tool) => tool.pending)
                  .map((tool) => (
                    <div
                      key={tool.id}
                      className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col gap-4">
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{tool.name}</h4>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                tool.status === "premium"
                                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                                  : tool.status === "freemium"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                    : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              }`}
                            >
                              {tool.status.charAt(0).toUpperCase() + tool.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{tool.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {tool.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            Submitted by: @{tool.username}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-end">
                          <a
                            href={tool.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors flex items-center gap-1 text-sm"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View Tool
                          </a>
                          <a
                            href={tool.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors flex items-center gap-1 text-sm"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            Documentation
                          </a>
                          <button
                            onClick={() => handleRejectTool(tool.id)}
                            className="px-3 py-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-md transition-colors flex items-center gap-1 text-sm"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Reject
                          </button>
                          <button
                            onClick={() => handlePublishTool(tool.id)}
                            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center gap-1 text-sm"
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                            Publish
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                {tools.filter((t) => t.pending).length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>No pending tools to verify</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recently Published Tools */}
            <div>
              <h3 className="text-lg font-medium mb-4">Recently Published</h3>
              <div className="space-y-4">
                {tools
                  .filter((tool) => !tool.pending)
                  .map((tool) => (
                    <div
                      key={tool.id}
                      className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col gap-4">
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{tool.name}</h4>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                tool.status === "premium"
                                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                                  : tool.status === "freemium"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                    : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              }`}
                            >
                              {tool.status.charAt(0).toUpperCase() + tool.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{tool.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {tool.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Submitted by: @{tool.username}</p>
                            <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Published
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-end">
                          <a
                            href={tool.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors flex items-center gap-1 text-sm"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View Tool
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}

                {tools.filter((t) => !t.pending).length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>No published tools yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
