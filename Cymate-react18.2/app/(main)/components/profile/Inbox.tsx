"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Mail, User, Calendar, AlertTriangle } from "lucide-react"

const dummyInboxMessages = [
  {
    id: 1,
    sender: "System",
    subject: "Welcome to CyMate Platform",
    content: "Thank you for joining our community...",
    date: "2024-01-01",
    read: true,
  },
  {
    id: 2,
    sender: "John Doe",
    subject: "Question about your recent post",
    content: "Hi, I was wondering if you could elaborate on...",
    date: "2024-02-15",
    read: false,
  },
  {
    id: 3,
    sender: "Event Team",
    subject: "Upcoming Cybersecurity Webinar",
    content: "You're invited to our exclusive webinar on...",
    date: "2024-02-20",
    read: false,
  },
  {
    id: 4,
    sender: "Security Alert",
    subject: "Critical Vulnerability Detected",
    content: "Our system has detected a critical vulnerability...",
    date: "2024-02-25",
    read: true,
  },
  {
    id: 5,
    sender: "Tool Review Team",
    subject: "Your tool submission was rejected",
    content:
      'We regret to inform you that your tool "Network Scanner Pro" has been rejected. Reason: The tool does not meet our current security standards. Please review our guidelines and resubmit after addressing the issues.',
    date: "2024-03-01",
    read: false,
  },
]

export default function Inbox() {
  const [messages, setMessages] = useState(dummyInboxMessages)

  const getIcon = (sender: string) => {
    switch (sender) {
      case "System":
        return <Mail className="text-blue-500" />
      case "Event Team":
        return <Calendar className="text-green-500" />
      case "Security Alert":
        return <AlertTriangle className="text-red-500" />
      default:
        return <User className="text-gray-500" />
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Inbox</h3>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow ${!message.read ? "border-l-4 border-blue-500" : ""}`}
        >
          <div className="flex items-center space-x-4">
            {getIcon(message.sender)}
            <div>
              <h4 className="font-medium">{message.subject}</h4>
              <p className="text-sm text-gray-500">
                {message.sender} • {message.date}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{message.content.substring(0, 50)}...</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            Read
          </Button>
        </div>
      ))}
    </div>
  )
}
