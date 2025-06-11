"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bell, MessageSquare, PenToolIcon as Tool, AlertTriangle, Zap, CheckCircle } from "lucide-react"

const dummyNotifications = [
  { id: 1, type: "comment", content: "John Doe replied to your post", time: "5 minutes ago" },
  { id: 2, type: "reaction", content: "Your article received 50 thunders", time: "2 hours ago" },
  { id: 3, type: "tool", content: "New vulnerability found in your scanned network", time: "1 day ago" },
  { id: 4, type: "alert", content: "Critical security alert: System vulnerability detected", time: "3 days ago" },
  { id: 5, type: "approval", content: "Your card is approved and waiting for payment", time: "1 week ago" },
]

export default function Notifications() {
  const [notifications, setNotifications] = useState(dummyNotifications)

  const getIcon = (type: string) => {
    switch (type) {
      case "comment":
        return <MessageSquare className="text-blue-500" />
      case "reaction":
        return <Zap className="text-yellow-500" />
      case "tool":
        return <Tool className="text-purple-500" />
      case "alert":
        return <AlertTriangle className="text-red-500" />
      case "approval":
        return <CheckCircle className="text-green-500" />
      default:
        return <Bell className="text-gray-500" />
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Notifications</h3>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
        >
          <div className="flex items-center space-x-4">
            {getIcon(notification.type)}
            <div>
              <p className="font-medium">{notification.content}</p>
              <p className="text-sm text-gray-500">{notification.time}</p>
            </div>
          </div>
          {notification.type === "approval" ? (
            <Button variant="outline" size="sm">
              Make Payment
            </Button>
          ) : (
            <Button variant="ghost" size="sm">
              View
            </Button>
          )}
        </div>
      ))}
    </div>
  )
}
