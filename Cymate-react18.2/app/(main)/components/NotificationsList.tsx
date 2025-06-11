"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, Bell } from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  type: string
  timestamp: string
}

const NotificationsList: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Blog Post",
      message: "Check out the latest blog post in the community space!",
      type: "community",
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      title: "Event Reminder",
      message: "Don't forget about the upcoming cybersecurity webinar!",
      type: "event",
      timestamp: "1 day ago",
    },
    {
      id: "3",
      title: "New Tool Added",
      message: "A new vulnerability scanner has been added to the toolkit.",
      type: "tool",
      timestamp: "3 days ago",
    },
    {
      id: "4",
      title: "Comment on Your Post",
      message: "Someone commented on your recent post about network security.",
      type: "interaction",
      timestamp: "4 days ago",
    },
    {
      id: "5",
      title: "Scan Results Ready",
      message: "Your recent network scan results are now available.",
      type: "toolkit",
      timestamp: "1 week ago",
    },
    {
      id: "6",
      title: "Content Milestone",
      message: "Your post has reached 10,000 views!",
      type: "milestone",
      timestamp: "2 weeks ago",
    },
    {
      id: "7",
      title: "Thunder Spotlight",
      message: "Your post is trending and will be featured in Thunder Spotlight!",
      type: "feature",
      timestamp: "3 weeks ago",
    },
    {
      id: "8",
      title: "Verification Update",
      message: "Your account verification has been approved!",
      type: "account",
      timestamp: "1 month ago",
    },
  ])

  const notificationListRef = useRef<HTMLDivElement>(null)

  const handleNotificationClick = (notification: Notification) => {
    console.log("Clicked notification:", notification)
    // Implement navigation to the source of the notification
  }

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <Bell className="w-6 h-6 text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Notifications</h2>
      </div>

      <div ref={notificationListRef} className="overflow-y-auto max-h-96 space-y-2 pr-2">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md flex justify-between items-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 group"
              onClick={() => handleNotificationClick(notification)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">{notification.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{notification.message}</p>
                <span className="text-xs text-gray-500 dark:text-gray-400">{notification.timestamp}</span>
              </div>
              <button
                className="text-red-500 hover:text-red-700 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(notification.id)
                }}
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default NotificationsList
