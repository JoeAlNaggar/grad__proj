"use client"

import { useState } from "react"
import { Bell, AlertTriangle, Trash2, Download, Mail } from "lucide-react"
import { AlertCard, type Alert, AlertChart, CriticalAlertCard } from "./AlertComponents"

// Types
interface Notification {
  id: string
  title: string
  message: string
  source: string
  timestamp: string
  read: boolean
}

interface InboxMessage {
  id: string
  title: string
  content: string
  sender: string
  date: string
  read: boolean
}

// Notification Item Component
const NotificationItem = ({
  notification,
  onRemove,
  onClick,
}: {
  notification: Notification
  onRemove: () => void
  onClick: () => void
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 p-3 rounded-md flex justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group mb-2 ${
        !notification.read && "border-l-4 border-blue-500"
      }`}
    >
      <div>
        <h3 className="font-semibold text-gray-800 dark:text-white">{notification.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">{notification.message}</p>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>{notification.source}</span>
          <span className="mx-1">•</span>
          <span>{notification.timestamp}</span>
        </div>
      </div>
      <button
        className="text-red-500 hover:text-red-700 transition-colors duration-200 opacity-0 group-hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
      >
        <Trash2 size={18} />
      </button>
    </div>
  )
}

// Inbox Item Component
const InboxItem = ({
  message,
  onRemove,
  onClick,
}: {
  message: InboxMessage
  onRemove: () => void
  onClick: () => void
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 p-4 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group mb-3 ${
        !message.read && "border-l-4 border-purple-500"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800 dark:text-white">{message.title}</h3>
        <button
          className="text-red-500 hover:text-red-700 transition-colors duration-200 opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
        >
          <Trash2 size={18} />
        </button>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{message.content}</p>
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span>From: {message.sender}</span>
        <span>{message.date}</span>
      </div>
    </div>
  )
}

export const NotificationCenterSection = () => {
  const [showWeeklyChart, setShowWeeklyChart] = useState(true)
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      title: "Suspicious Login Attempt",
      description: "Multiple failed login attempts detected from IP 192.168.1.105",
      timestamp: "10 minutes ago",
      type: "critical",
      status: "active",
    },
    {
      id: "2",
      title: "Firewall Rule Violation",
      description: "Outbound connection attempt blocked to known malicious domain",
      timestamp: "25 minutes ago",
      type: "warning",
      status: "active",
    },
    {
      id: "3",
      title: "System Update Required",
      description: "Critical security patch available for your system",
      timestamp: "1 hour ago",
      type: "info",
      status: "active",
    },
    {
      id: "4",
      title: "Data Exfiltration Attempt",
      description: "Unusual data transfer detected to external IP 203.45.67.89",
      timestamp: "2 hours ago",
      type: "critical",
      status: "active",
    },
    {
      id: "5",
      title: "Malware Detection",
      description: "Potential malware detected in file: download.exe",
      timestamp: "3 hours ago",
      type: "warning",
      status: "active",
    },
  ])

  const [criticalAlerts, setCriticalAlerts] = useState<Alert[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Security Report",
      message: "The monthly security report is now available for review",
      source: "System",
      timestamp: "1 hour ago",
      read: false,
    },
    {
      id: "2",
      title: "User Account Created",
      message: "A new user account 'jsmith' has been created by admin",
      source: "User Management",
      timestamp: "3 hours ago",
      read: true,
    },
    {
      id: "3",
      title: "Backup Completed",
      message: "System backup completed successfully",
      source: "Backup System",
      timestamp: "Yesterday",
      read: true,
    },
    {
      id: "4",
      title: "Policy Update",
      message: "Security policy has been updated. Please review changes",
      source: "Admin",
      timestamp: "2 days ago",
      read: false,
    },
  ])

  const [inboxMessages, setInboxMessages] = useState<InboxMessage[]>([
    {
      id: "1",
      title: "Security Audit Results",
      content:
        "The results of our recent security audit are now available. Please review the attached report and address any critical findings within 48 hours.",
      sender: "Security Team",
      date: "Today, 09:45 AM",
      read: false,
    },
    {
      id: "2",
      title: "New Compliance Requirements",
      content:
        "We need to implement new compliance requirements by the end of the month. Let's schedule a meeting to discuss the implementation plan.",
      sender: "Compliance Officer",
      date: "Yesterday, 04:30 PM",
      read: true,
    },
    {
      id: "3",
      title: "System Maintenance Notice",
      content:
        "We will be performing scheduled maintenance on the servers this weekend. Please ensure all critical work is saved before Friday evening.",
      sender: "IT Department",
      date: "Mar 20, 2025",
      read: true,
    },
  ])

  // Add a new state to track active tab
  const [activeTab, setActiveTab] = useState<"notifications" | "inbox">("notifications")

  // Handle alert actions
  const removeAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id))
  }

  const ignoreAlert = (id: string) => {
    setAlerts(alerts.map((alert) => (alert.id === id ? { ...alert, status: "ignored" as const } : alert)))
  }

  const solveAlert = (id: string) => {
    // In the main component, this would add to solvingAlerts
    // Here we'll just remove it
    setAlerts(alerts.filter((alert) => alert.id !== id))
  }

  const removeCriticalAlert = (id: string) => {
    setCriticalAlerts(criticalAlerts.filter((alert) => alert.id !== id))
  }

  // Handle notification actions
  const removeNotification = (id: string) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  const markNotificationRead = (id: string) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
    // In a real app, you might navigate to the source of the notification here
  }

  // Handle inbox actions
  const removeInboxMessage = (id: string) => {
    setInboxMessages(inboxMessages.filter((message) => message.id !== id))
  }

  const markInboxMessageRead = (id: string) => {
    setInboxMessages(inboxMessages.map((message) => (message.id === id ? { ...message, read: true } : message)))
    // In a real app, you might navigate to the message details here
  }

  // Download alerts as PDF
  const downloadAlertsPDF = () => {
    console.log("Downloading alerts as PDF...")
    // In a real app, you would generate and download a PDF here
    alert("PDF download started (simulated)")
  }

  // Count unread notifications and messages
  const unreadNotifications = notifications.filter((n) => !n.read).length
  const unreadInbox = inboxMessages.filter((m) => !m.read).length

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Alerts Widget */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-red-100 text-red-500 dark:bg-red-900 dark:text-red-300">
              <AlertTriangle size={20} />
            </div>
            <h2 className="text-lg font-semibold">Security Alerts</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={downloadAlertsPDF}
              className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
              title="Download as PDF"
            >
              <Download size={16} />
            </button>
            <button
              onClick={() => setShowWeeklyChart(!showWeeklyChart)}
              className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            >
              <span className="text-xs font-medium">{showWeeklyChart ? "View Monthly" : "View Weekly"}</span>
            </button>
          </div>
        </div>

        {/* Alert Chart */}
        <AlertChart weekView={showWeeklyChart} />

        {/* Alert Count */}
        <div className="flex items-center justify-between mt-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <span className="text-2xl font-bold">{alerts.filter((a) => a.status === "active").length}</span>
            <span className="text-gray-500 dark:text-gray-400 ml-2">active alerts</span>
          </div>
          <button className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
            View All
          </button>
        </div>

        {/* Alert List */}
        <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
          {alerts
            .filter((alert) => alert.status === "active")
            .map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onRemove={() => removeAlert(alert.id)}
                onIgnore={() => ignoreAlert(alert.id)}
                onSolve={() => solveAlert(alert.id)}
                onView={() => {
                  const alertToReport = alerts.find((a) => a.id === alert.id)
                  if (alertToReport) {
                    setCriticalAlerts([...criticalAlerts, { ...alertToReport, status: "not-solved" as const }])
                    removeAlert(alert.id)
                  }
                }}
              />
            ))}

          {alerts.filter((a) => a.status === "active").length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No active alerts</p>
            </div>
          )}
        </div>
      </div>

      {/* Notifications & Inbox Widget */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300">
              <Bell size={20} />
            </div>
            <h2 className="text-lg font-semibold">Notifications & Inbox</h2>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Notifications</h3>
              {unreadNotifications > 0 && (
                <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {unreadNotifications} new
                </span>
              )}
            </div>
            <p className="text-2xl font-bold mt-2">{notifications.length}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Inbox</h3>
              {unreadInbox > 0 && (
                <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadInbox} new</span>
              )}
            </div>
            <p className="text-2xl font-bold mt-2">{inboxMessages.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
          <button
            className={`px-4 py-2 border-b-2 ${activeTab === "notifications" ? "border-blue-500 text-blue-500" : "border-transparent text-gray-500 dark:text-gray-400"} font-medium transition-colors`}
            onClick={() => setActiveTab("notifications")}
          >
            Notifications
          </button>
          <button
            className={`px-4 py-2 border-b-2 ${activeTab === "inbox" ? "border-blue-500 text-blue-500" : "border-transparent text-gray-500 dark:text-gray-400"} font-medium transition-colors`}
            onClick={() => setActiveTab("inbox")}
          >
            Inbox
          </button>
        </div>

        {/* Notification List */}
        <div className={`max-h-80 overflow-y-auto pr-2 ${activeTab === "notifications" ? "block" : "hidden"}`}>
          {notifications.length > 0 ? (
            <>
              <div className="flex justify-center mb-4">
                <div className="w-40 h-40 relative">
                  <Bell className="w-full h-full text-blue-100 dark:text-blue-900" />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-blue-500">
                    {notifications.length}
                  </div>
                </div>
              </div>
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRemove={() => removeNotification(notification.id)}
                  onClick={() => markNotificationRead(notification.id)}
                />
              ))}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <div className="flex justify-center mb-4">
                <Bell className="w-20 h-20 text-gray-200 dark:text-gray-700" />
              </div>
              <p>No notifications</p>
            </div>
          )}
        </div>

        {/* Inbox List */}
        <div className={`max-h-80 overflow-y-auto pr-2 ${activeTab === "inbox" ? "block" : "hidden"}`}>
          {inboxMessages.length > 0 ? (
            <>
              <div className="flex justify-center mb-4">
                <div className="w-40 h-40 relative">
                  <Mail className="w-full h-full text-purple-100 dark:text-purple-900" />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-purple-500">
                    {inboxMessages.length}
                  </div>
                </div>
              </div>
              {inboxMessages.map((message) => (
                <InboxItem
                  key={message.id}
                  message={message}
                  onRemove={() => removeInboxMessage(message.id)}
                  onClick={() => markInboxMessageRead(message.id)}
                />
              ))}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <div className="flex justify-center mb-4">
                <Mail className="w-20 h-20 text-gray-200 dark:text-gray-700" />
              </div>
              <p>Your inbox is empty</p>
            </div>
          )}
        </div>
      </div>

      {/* Critical Alerts Section */}
      {criticalAlerts.length > 0 && (
        <div className="lg:col-span-2">
          <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-6 border border-red-200 dark:border-red-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmODcxNzEiPjwvcmVjdD4KPC9zdmc+')] opacity-10 pointer-events-none" />

            <div className="animate-pulse absolute -inset-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600 opacity-10 blur-xl rounded-lg"></div>

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-red-100 text-red-500 dark:bg-red-900 dark:text-red-300">
                    <AlertTriangle size={20} />
                  </div>
                  <h2 className="text-lg font-semibold text-red-700 dark:text-red-300">Critical Alerts</h2>
                </div>
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {criticalAlerts.length} {criticalAlerts.length === 1 ? "alert" : "alerts"}
                </span>
              </div>

              <div className="space-y-4">
                {criticalAlerts.map((alert) => (
                  <CriticalAlertCard key={alert.id} alert={alert} onRemove={() => removeCriticalAlert(alert.id)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
