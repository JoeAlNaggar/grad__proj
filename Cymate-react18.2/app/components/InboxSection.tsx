"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Trash2, Mail } from "lucide-react"

interface InboxMessage {
  id: string
  title: string
  content: string
  date: string
  type: "community" | "tool" | "verification" | "admin" | "milestone"
}

const dummyInboxMessages: InboxMessage[] = [
  {
    id: "1",
    title: "New Blog Post in Community",
    content:
      'A new blog post "Advanced Network Security Techniques" has been published in the community. Check it out!',
    date: "2025-03-03",
    type: "community",
  },
  {
    id: "2",
    title: "Tool Approval: Network Scanner",
    content: 'Your submitted tool "Advanced Network Scanner" has been approved and is now available in the toolkit.',
    date: "2025-03-02",
    type: "tool",
  },
  {
    id: "3",
    title: "Account Verification Update",
    content: "Your account verification has been approved. You now have access to all premium features.",
    date: "2025-03-01",
    type: "verification",
  },
  {
    id: "4",
    title: "Important Security Alert",
    content:
      "CyMate admin: We've detected unusual activity on your account. Please review your recent logins and update your password.",
    date: "2025-02-28",
    type: "admin",
  },
  {
    id: "5",
    title: "Content Milestone Achieved",
    content: 'Congratulations! Your post "Top 10 Cybersecurity Practices" has reached 10,000 views.',
    date: "2025-02-27",
    type: "milestone",
  },
]

const InboxSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextMessage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % dummyInboxMessages.length)
  }

  const prevMessage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + dummyInboxMessages.length) % dummyInboxMessages.length)
  }

  const deleteMessage = (id: string) => {
    console.log(`Message with id ${id} would be deleted`)
    // In a real application, you would remove the message from the array here
  }

  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-purple-500/10 rounded-lg">
          <Mail className="w-6 h-6 text-purple-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Inbox</h2>
      </div>

      <div className="flex items-center">
        <button onClick={prevMessage} className="p-2">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <motion.div
          className="flex-grow overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {dummyInboxMessages.map((message, index) => (
            <motion.div
              key={message.id}
              className={`bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md group ${
                index === currentIndex ? "block" : "hidden"
              }`}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{message.title}</h3>
                <button
                  onClick={() => deleteMessage(message.id)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-2">{message.content}</p>
              <p className="text-sm text-gray-500">{message.date}</p>
            </motion.div>
          ))}
        </motion.div>
        <button onClick={nextMessage} className="p-2">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}

export default InboxSection
