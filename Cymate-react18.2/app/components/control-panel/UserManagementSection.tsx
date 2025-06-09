"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, XCircle, CheckCircle, Lock, Mail, Zap, Users } from "lucide-react"

export const UserManagementSection = () => {
  const [username, setUsername] = useState("")
  const [showActions, setShowActions] = useState(false)
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [notification, setNotification] = useState<{ message: string; type: string } | null>(null)
  const [userContent, setUserContent] = useState<any[]>([])
  const [filteredContent, setFilteredContent] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Mock user content data
  useEffect(() => {
    setUserContent([
      {
        id: "1",
        username: "johndoe",
        title: "Network Security Best Practices",
        description: "A comprehensive guide to securing your network infrastructure.",
        tags: ["security", "network", "firewall"],
        date: "2025-03-15",
        type: "article",
      },
      {
        id: "2",
        username: "johndoe",
        title: "Malware Detection Techniques",
        description: "Learn how to identify and remove malware from your systems.",
        tags: ["malware", "security", "antivirus"],
        date: "2025-03-10",
        type: "tutorial",
      },
      {
        id: "3",
        username: "janedoe",
        title: "Cloud Security Architecture",
        description: "Building secure cloud infrastructure for enterprise applications.",
        tags: ["cloud", "security", "architecture"],
        date: "2025-03-05",
        type: "whitepaper",
      },
      {
        id: "4",
        username: "johndoe",
        title: "Phishing Attack Prevention",
        description: "Strategies to protect your organization from phishing attempts.",
        tags: ["phishing", "security", "awareness"],
        date: "2025-02-28",
        type: "guide",
      },
      {
        id: "5",
        username: "alexsmith",
        title: "Zero Trust Security Model",
        description: "Implementing zero trust architecture in modern networks.",
        tags: ["zero-trust", "security", "architecture"],
        date: "2025-02-20",
        type: "article",
      },
    ])
  }, [])

  // Handle username submission
  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        setShowActions(true)
        setIsLoading(false)
      }, 800)
    }
  }

  // Handle tag addition
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim().toLowerCase())) {
        setTags([...tags, tagInput.trim().toLowerCase()])
      }
      setTagInput("")
    }
  }

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  // Filter content based on username and tags
  useEffect(() => {
    if (username && tags.length >= 3) {
      const filtered = userContent.filter(
        (content) => content.username === username && tags.every((tag) => content.tags.includes(tag)),
      )
      setFilteredContent(filtered)
    } else {
      setFilteredContent([])
    }
  }, [username, tags, userContent])

  // Handle user actions
  const handleUserAction = (action: string) => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)

      // Show notification
      setNotification({
        message: `${action} action was successful for user ${username}`,
        type: "success",
      })

      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }, 1000)
  }

  // Remove content
  const removeContent = (contentId: string) => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setUserContent(userContent.filter((content) => content.id !== contentId))
      setFilteredContent(filteredContent.filter((content) => content.id !== contentId))

      setNotification({
        message: `Content has been removed successfully`,
        type: "success",
      })

      setIsLoading(false)

      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }, 800)
  }

  // View content details
  const viewContent = (contentId: string) => {
    const content = userContent.find((c) => c.id === contentId)
    if (content) {
      alert(
        `Viewing content: ${content.title}\n\nDescription: ${content.description}\n\nType: ${content.type}\n\nTags: ${content.tags.join(", ")}`,
      )
    }
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
                  : "bg-blue-100 text-blue-800 border border-blue-200"
            }`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Management Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
            <Users className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold">User Management</h2>
        </div>

        {/* Username Form */}
        <form onSubmit={handleUsernameSubmit} className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter username"
              />
            </div>
            <div className="self-end">
              <button
                type="submit"
                disabled={!username.trim() || isLoading}
                className={`px-4 py-2 rounded-md text-white font-medium ${
                  !username.trim() || isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
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

        {/* User Actions */}
        {showActions && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-6">
            <h3 className="text-lg font-medium mb-3">User Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <button
                onClick={() => handleUserAction("Alert")}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors"
                disabled={isLoading}
              >
                <AlertTriangle className="h-4 w-4" />
                Alert User
              </button>
              <button
                onClick={() => handleUserAction("Ban")}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
                disabled={isLoading}
              >
                <XCircle className="h-4 w-4" />
                Ban User
              </button>
              <button
                onClick={() => handleUserAction("Unban")}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors"
                disabled={isLoading}
              >
                <CheckCircle className="h-4 w-4" />
                Unban User
              </button>
              <button
                onClick={() => handleUserAction("Reset Password")}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors"
                disabled={isLoading}
              >
                <Lock className="h-4 w-4" />
                Reset Password
              </button>
              <button
                onClick={() => handleUserAction("Change Email")}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200 transition-colors"
                disabled={isLoading}
              >
                <Mail className="h-4 w-4" />
                Change Email
              </button>
              <button
                onClick={() => handleUserAction("Change Phone")}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-800 rounded-md hover:bg-indigo-200 transition-colors"
                disabled={isLoading}
              >
                <Zap className="h-4 w-4" />
                Change Phone
              </button>
            </div>
          </motion.div>
        )}

        {/* Tags Input */}
        {showActions && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-6">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Content Tags (add at least 3 to filter content)
            </label>
            <div className="flex flex-wrap gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded-md mb-2">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center gap-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 px-2 py-1 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-100"
                  >
                    <XCircle className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <input
                type="text"
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="flex-1 min-w-[120px] outline-none border-none bg-transparent"
                placeholder={tags.length === 0 ? "Type tags and press Enter" : ""}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {tags.length < 3
                ? `Add ${3 - tags.length} more tag${3 - tags.length !== 1 ? "s" : ""} to filter content`
                : "Tags added. Content will be filtered based on these tags."}
            </p>
          </motion.div>
        )}

        {/* Filtered Content */}
        {filteredContent.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6">
            <h3 className="text-lg font-medium mb-3">User Content with Selected Tags</h3>
            <div className="space-y-4">
              {filteredContent.map((content) => (
                <div key={content.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium">{content.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{content.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {content.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              tags.includes(tag)
                                ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                                : "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {content.type} • {content.date}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => viewContent(content.id)}
                        className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-800 text-sm"
                      >
                        View
                      </button>
                      <button
                        onClick={() => removeContent(content.id)}
                        className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* No Content Found */}
        {username && tags.length >= 3 && filteredContent.length === 0 && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
            <p className="text-gray-600 dark:text-gray-300">
              No content found matching the selected username and tags.
            </p>
          </div>
        )}
      </div>
    </>
  )
}
