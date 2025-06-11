"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronRight,
  ChevronLeft,
  Database,
  Bell,
  AlertTriangle,
  Trash2,
  FileText,
  Download,
  CheckCircle,
  XCircle,
  Mail,
  ShieldCheck,
  BadgeAlert,
  LineChart,
  BellRing,
  ClipboardCheck,
  ServerCog,
  UserCog,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Add this import
import AnalyticsDashboard from "../components/control-panel/AnalyticsDashboard"
import { SystemSettingsSection } from "../components/control-panel/SystemSettingsSection"
import { DataManagementSection } from "../components/control-panel/DataManagementSection"
import { SecurityControlsSection } from "../components/control-panel/SecurityControlsSection"
import { VerificationCenterSection } from "../components/control-panel/VerificationCenterSection"
import { UserManagementSection } from "../components/control-panel/UserManagementSection"

// Types
interface Alert {
  id: string
  title: string
  description: string
  timestamp: string
  type: "critical" | "warning" | "info"
  status: "active" | "ignored" | "solving" | "solved" | "not-solved"
}

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

// Section Card Component
interface SectionCardProps {
  title: string
  icon: React.ReactNode
  primaryColor: string
  secondaryColor: string
  accentColor: string
  isActive: boolean
  alertCount?: number
  index: number
  description: string
  illustration: string
  onClick: () => void
}

const SectionCard = ({
  title,
  icon,
  primaryColor,
  secondaryColor,
  accentColor,
  isActive,
  alertCount,
  index,
  description,
  illustration,
  onClick,
}: SectionCardProps) => {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "min-w-[340px] h-[220px] rounded-xl transition-all duration-300 cursor-pointer relative overflow-hidden group",
        isActive
          ? "ring-2 ring-offset-2 dark:ring-offset-gray-900 shadow-lg"
          : "hover:shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
      )}
      style={{
        boxShadow: isActive ? `0 8px 24px -6px ${primaryColor}40` : "",
        borderColor: isActive ? primaryColor : "",
      }}
    >
      {/* Background pattern */}
      <div
        className={cn("absolute inset-0 opacity-5 pointer-events-none", isActive ? "opacity-10" : "opacity-5")}
        style={{
          backgroundImage: `radial-gradient(circle at 20px 20px, ${primaryColor} 2px, transparent 0), 
                            radial-gradient(circle at 60px 60px, ${primaryColor} 2px, transparent 0)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Colored top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5 transition-all duration-300"
        style={{
          background: isActive ? `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` : "transparent",
          opacity: isActive ? 1 : 0,
        }}
      />

      {/* Content */}
      <div className="p-5 relative z-10 h-full flex flex-col">
        <div className="flex items-start justify-between">
          <div
            className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300",
              isActive ? "text-white" : "text-gray-700 dark:text-gray-200",
            )}
            style={{
              background: isActive ? `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` : "rgba(0,0,0,0.05)",
              color: isActive ? "white" : primaryColor,
            }}
          >
            {icon}
          </div>

          {alertCount && alertCount > 0 && (
            <div
              className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse"
              style={{ boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.2)" }}
            >
              {alertCount > 99 ? "99+" : alertCount}
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-col flex-grow">
          <h3
            className={cn(
              "text-xl font-bold transition-colors duration-300",
              isActive
                ? "text-gray-900 dark:text-white"
                : "text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white",
            )}
            style={{ color: isActive ? primaryColor : "" }}
          >
            {title}
          </h3>
          <p
            className={cn(
              "text-sm mt-1.5 line-clamp-2 transition-colors duration-300",
              isActive ? "text-gray-700 dark:text-gray-300" : "text-gray-500 dark:text-gray-400",
            )}
          >
            {description}
          </p>
        </div>

        {/* Bottom indicator */}
        <div className="absolute bottom-4 right-4">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 transform",
              isActive ? "opacity-100 scale-100" : "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100",
            )}
            style={{
              background: isActive
                ? `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                : `${primaryColor}20`,
            }}
          >
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-colors duration-300",
                isActive ? "text-white" : `text-[${primaryColor}]`,
              )}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Alert Card Component
const AlertCard = ({
  alert,
  onRemove,
  onIgnore,
  onSolve,
  onView,
}: {
  alert: Alert
  onRemove: () => void
  onIgnore: () => void
  onSolve: () => void
  onView: () => void
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-3 border-l-4 border-red-500">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "p-2 rounded-full",
              alert.type === "critical"
                ? "bg-red-100 text-red-500"
                : alert.type === "warning"
                  ? "bg-amber-100 text-amber-500"
                  : "bg-blue-100 text-blue-500",
            )}
          >
            <AlertTriangle size={16} />
          </div>
          <div>
            <h4 className="font-medium">{alert.title}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{alert.description}</p>
            <span className="text-xs text-gray-400">{alert.timestamp}</span>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onView()
            }}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Report as critical"
          >
            <FileText size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onSolve()
            }}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Solve"
          >
            <CheckCircle size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onIgnore()
            }}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Ignore"
          >
            <XCircle size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Remove"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

// Solving Alert Card Component
const SolvingAlertCard = ({
  alert,
  onSolved,
  onNotSolved,
}: {
  alert: Alert
  onSolved: () => void
  onNotSolved: () => void
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-w-[300px] bg-red-50 dark:bg-red-900/20 rounded-lg shadow-md p-4 border border-red-200 dark:border-red-800 mr-4 flex flex-col"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="p-2 rounded-full bg-red-100 text-red-500 dark:bg-red-900 dark:text-red-300">
          <AlertTriangle size={18} />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-red-700 dark:text-red-300">{alert.title}</h4>
          <p className="text-sm text-red-600 dark:text-red-400">{alert.description}</p>
          <span className="text-xs text-red-500 dark:text-red-500">{alert.timestamp}</span>
        </div>
      </div>

      <div className="flex gap-2 mt-auto">
        <button
          onClick={onSolved}
          className="flex-1 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm rounded-md transition-colors"
        >
          Solved
        </button>
        <button
          onClick={onNotSolved}
          className="flex-1 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md transition-colors"
        >
          Not Solved
        </button>
      </div>
    </motion.div>
  )
}

// Critical Alert Card Component
const CriticalAlertCard = ({ alert, onRemove }: { alert: Alert; onRemove: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-red-50 dark:bg-red-900/20 rounded-lg shadow-md p-4 mb-3 border border-red-200 dark:border-red-800 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmODcxNzEiPjwvcmVjdD4KPC9zdmc+')] opacity-20 pointer-events-none" />

      <div className="animate-pulse absolute -inset-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600 opacity-20 blur-xl rounded-lg"></div>

      <div className="relative">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-red-100 text-red-500 dark:bg-red-900 dark:text-red-300">
              <AlertTriangle size={18} />
            </div>
            <div>
              <div className="flex items-center">
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded mr-2">CRITICAL</span>
                <h4 className="font-medium text-red-700 dark:text-red-300">{alert.title}</h4>
              </div>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{alert.description}</p>
              <span className="text-xs text-red-500 dark:text-red-500 block mt-1">{alert.timestamp}</span>
            </div>
          </div>
          <button onClick={onRemove} className="p-1.5 rounded-full hover:bg-red-200 dark:hover:bg-red-800 text-red-500">
            <Trash2 size={16} />
          </button>
        </div>

        <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-800">
          <h5 className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">Recommended Action:</h5>
          <p className="text-sm text-red-600 dark:text-red-400">
            This alert requires immediate attention. Please review and take appropriate action.
          </p>
        </div>
      </div>
    </motion.div>
  )
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
      className={cn(
        "bg-white dark:bg-gray-800 p-3 rounded-md flex justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group mb-2",
        !notification.read && "border-l-4 border-blue-500",
      )}
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
      className={cn(
        "bg-white dark:bg-gray-800 p-4 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group mb-3",
        !message.read && "border-l-4 border-purple-500",
      )}
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

// Alert Chart Component
const AlertChart = ({ weekView = true }: { weekView?: boolean }) => {
  // This is a simplified chart component
  const days = weekView ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] : ["Week 1", "Week 2", "Week 3", "Week 4"]

  const values = weekView ? [4, 7, 2, 5, 9, 3, 6] : [18, 24, 15, 21]

  const maxValue = Math.max(...values)

  return (
    <div className="pt-4">
      <div className="flex items-end h-32 gap-1">
        {values.map((value, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="w-full bg-red-500 rounded-t-sm" style={{ height: `${(value / maxValue) * 100}%` }}></div>
            <span className="text-xs mt-1 text-gray-500">{days[index]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Illustrations as SVG strings
const illustrations = {
  userManagement: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="35" r="15" fill="#4F46E5" opacity="0.8"/>
    <circle cx="30" cy="65" r="12" fill="#818CF8" opacity="0.7"/>
    <circle cx="70" cy="65" r="12" fill="#6366F1" opacity="0.7"/>
    <path d="M50 50V80" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round"/>
    <path d="M30 77H70" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round"/>
    <path d="M30 77V65" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round"/>
    <path d="M70 77V65" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round"/>
  </svg>`,

  securityControls: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 20L85 35V55C85 70 70 80 50 90C30 80 15 70 15 55V35L50 20Z" fill="#EF4444" fillOpacity="0.2" stroke="#EF4444" strokeWidth="3"/>
    <path d="M40 50L45 55L60 40" stroke="#EF4444" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>`,

  systemSettings: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="30" fill="#8B5CF6" fillOpacity="0.2" stroke="#8B5CF6" strokeWidth="3"/>
    <path d="M50 20V25" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round"/>
    <path d="M50 75V80" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round"/>
    <path d="M80 50H75" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round"/>
    <path d="M25 50H20" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round"/>
    <path d="M71 29L67 33" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round"/>
    <path d="M33 67L29 71" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round"/>
    <path d="M71 71L67 67" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round"/>
    <path d="M33 33L29 29" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="50" cy="50" r="10" fill="#8B5CF6" fillOpacity="0.6"/>
  </svg>`,

  dataManagement: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="30" rx="30" ry="15" fill="#10B981" fillOpacity="0.2" stroke="#10B981" strokeWidth="3"/>
    <path d="M20 30V50" stroke="#10B981" strokeWidth="3"/>
    <path d="M80 30V50" stroke="#10B981" strokeWidth="3"/>
    <ellipse cx="50" cy="50" rx="30" ry="15" fill="#10B981" fillOpacity="0.2" stroke="#10B981" strokeWidth="3"/>
    <path d="M20 50V70" stroke="#10B981" strokeWidth="3"/>
    <path d="M80 50V70" stroke="#10B981" strokeWidth="3"/>
    <ellipse cx="50" cy="70" rx="30" ry="15" fill="#10B981" fillOpacity="0.2" stroke="#10B981" strokeWidth="3"/>
  </svg>`,

  analyticsDashboard: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="15" y="20" width="70" height="60" rx="5" fill="#F59E0B" fillOpacity="0.2" stroke="#F59E0B" strokeWidth="3"/>
    <path d="M25 65L40 50L55 60L75 40" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="40" cy="50" r="4" fill="#F59E0B"/>
    <circle cx="55" cy="60" r="4" fill="#F59E0B"/>
    <circle cx="75" cy="40" r="4" fill="#F59E0B"/>
  </svg>`,

  notificationCenter: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 20C65 20 75 30 75 45V65L85 75H15L25 65V45C25 30 35 20 50 20Z" fill="#EC4899" fillOpacity="0.2" stroke="#EC4899" strokeWidth="3"/>
    <path d="M40 75C40 80 45 85 50 85C55 85 60 80 60 75" stroke="#EC4899" strokeWidth="3"/>
    <circle cx="70" cy="30" r="10" fill="#EC4899"/>
    <path d="M67 30L73 30" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <path d="M70 27L70 33" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>`,

  complianceManagement: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="20" width="60" height="60" rx="5" fill="#0EA5E9" fillOpacity="0.2" stroke="#0EA5E9" strokeWidth="3"/>
    <path d="M35 45L45 55L65 35" stroke="#0EA5E9" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M35 65H65" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round"/>
    <path d="M35 75H55" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round"/>
  </svg>`,
}

// Main Control Panel Component
export default function ControlPanel() {
  const [activeSection, setActiveSection] = useState(5) // Default to Notification Center (index 5)
  const [scrollPosition, setScrollPosition] = useState(0)
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

  const [solvingAlerts, setSolvingAlerts] = useState<Alert[]>([])
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

  // Scroll container horizontally
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      const atStart = scrollLeft <= 10
      const atEnd = scrollLeft >= scrollWidth - clientWidth - 10

      const startFade = document.getElementById("startFade")
      const endFade = document.getElementById("endFade")

      if (startFade) startFade.style.opacity = atStart ? "0" : "1"
      if (endFade) endFade.style.opacity = atEnd ? "0" : "1"
    }
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", checkScroll)
      // Initial check
      checkScroll()
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScroll)
      }
    }
  }, [])

  const scrollContainer = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400 // Card width + gap
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  // Scroll solving alerts horizontally
  const scrollSolvingAlerts = (direction: "left" | "right") => {
    const container = document.getElementById("solvingAlertsContainer")
    if (container) {
      const scrollAmount = 320 // Card width + gap
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  // Handle alert actions
  const removeAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id))
  }

  const ignoreAlert = (id: string) => {
    setAlerts(alerts.map((alert) => (alert.id === id ? { ...alert, status: "ignored" as const } : alert)))
  }

  const solveAlert = (id: string) => {
    const alertToSolve = alerts.find((alert) => alert.id === id)
    if (alertToSolve) {
      setSolvingAlerts([...solvingAlerts, { ...alertToSolve, status: "solving" as const }])
      setAlerts(alerts.filter((alert) => alert.id !== id))
    }
  }

  const markAlertSolved = (id: string) => {
    setSolvingAlerts(solvingAlerts.filter((alert) => alert.id !== id))
    // You could also add to a "solved alerts" list if needed
  }

  const markAlertNotSolved = (id: string) => {
    const alertToMove = solvingAlerts.find((alert) => alert.id === id)
    if (alertToMove) {
      setCriticalAlerts([...criticalAlerts, { ...alertToMove, status: "not-solved" as const }])
      setSolvingAlerts(solvingAlerts.filter((alert) => alert.id !== id))
    }
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

  // Section definitions with colors and illustrations
  const sections = [
    {
      title: "User Management",
      icon: <UserCog className="h-6 w-6" />,
      primaryColor: "#6366F1",
      secondaryColor: "#818CF8",
      accentColor: "99, 102, 241",
      description: "Manage user accounts, roles, and access permissions system-wide.",
      illustration: illustrations.userManagement,
    },
    {
      title: "Security Controls",
      icon: <ShieldCheck className="h-6 w-6" />,
      primaryColor: "#F43F5E",
      secondaryColor: "#FB7185",
      accentColor: "244, 63, 94",
      description: "Configure and monitor security policies, firewalls, and authentication protocols.",
      illustration: illustrations.securityControls,
    },
    {
      title: "System Settings",
      icon: <ServerCog className="h-6 w-6" />,
      primaryColor: "#8B5CF6",
      secondaryColor: "#A78BFA",
      accentColor: "139, 92, 246",
      description: "Customize core platform configuration and operational parameters.",
      illustration: illustrations.systemSettings,
    },
    {
      title: "Data Management",
      icon: <Database className="h-6 w-6" />,
      primaryColor: "#10B981",
      secondaryColor: "#34D399",
      accentColor: "16, 185, 129",
      description: "Control data storage, backups, retention policies, and optimize performance.",
      illustration: illustrations.dataManagement,
    },
    {
      title: "Analytics Dashboard",
      icon: <LineChart className="h-6 w-6" />,
      primaryColor: "#F59E0B",
      secondaryColor: "#FBBF24",
      accentColor: "245, 158, 11",
      description: "Visualize system metrics and gain insights from comprehensive reports.",
      illustration: illustrations.analyticsDashboard,
    },
    {
      title: "Notification Center",
      icon: <BellRing className="h-6 w-6" />,
      primaryColor: "#EC4899",
      secondaryColor: "#F472B6",
      accentColor: "236, 72, 153",
      description: "Manage alerts, notifications, and system communication preferences.",
      illustration: illustrations.notificationCenter,
      alertCount: alerts.filter((a) => a.status === "active").length,
    },
    {
      title: "Verification Center",
      icon: <ClipboardCheck className="h-6 w-6" />,
      primaryColor: "#0EA5E9",
      secondaryColor: "#38BDF8",
      accentColor: "14, 165, 233",
      description: "Verify user profiles and review tools before publishing to the platform.",
      illustration: illustrations.complianceManagement,
    },
  ]

  // Count unread notifications and messages
  const unreadNotifications = notifications.filter((n) => !n.read).length
  const unreadInbox = inboxMessages.filter((m) => !m.read).length

  // Add a new state to track active tab
  const [activeTab, setActiveTab] = useState<"notifications" | "inbox">("notifications")

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Control Panel</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage platform settings and monitor system health</p>
        </div>
      </div>

      {/* Horizontal scrolling container for section cards */}
      <div className="relative">
        {/* Scroll fade indicators */}
        <div
          id="startFade"
          className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-900 z-10 pointer-events-none opacity-0 transition-opacity duration-300"
        />
        <div
          id="endFade"
          className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-50 to-transparent dark:from-gray-900 z-10 pointer-events-none transition-opacity duration-300"
        />

        {/* Scroll buttons */}
        <button
          onClick={() => scrollContainer("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-gray-800 rounded-full p-2.5 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-200 dark:border-gray-700"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => scrollContainer("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-gray-800 rounded-full p-2.5 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-200 dark:border-gray-700"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto py-2 px-4 mx-3 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {sections.map((section, index) => (
            <SectionCard
              key={index}
              index={index}
              title={section.title}
              icon={section.icon}
              primaryColor={section.primaryColor}
              secondaryColor={section.secondaryColor}
              accentColor={section.accentColor}
              isActive={activeSection === index}
              alertCount={section.alertCount}
              description={section.description}
              illustration={section.illustration}
              onClick={() => setActiveSection(index)}
            />
          ))}
        </div>
      </div>

      {/* Solving Alerts Section (appears below section cards) */}
      {solvingAlerts.length > 0 && (
        <div className="mt-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Alerts Being Solved</h2>
            <div className="flex gap-2">
              <button
                onClick={() => scrollSolvingAlerts("left")}
                className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => scrollSolvingAlerts("right")}
                className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div
            id="solvingAlertsContainer"
            className="flex overflow-x-auto pb-4 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <AnimatePresence>
              {solvingAlerts.map((alert) => (
                <SolvingAlertCard
                  key={alert.id}
                  alert={alert}
                  onSolved={() => markAlertSolved(alert.id)}
                  onNotSolved={() => markAlertNotSolved(alert.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Critical Alerts Section (Section 8) */}
      {criticalAlerts.length > 0 && (
        <div className="mt-8 mb-8">
          <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-6 border border-red-200 dark:border-red-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmODcxNzEiPjwvcmVjdD4KPC9zdmc+')] opacity-10 pointer-events-none" />

            <div className="animate-pulse absolute -inset-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600 opacity-10 blur-xl rounded-lg"></div>

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-red-100 text-red-500 dark:bg-red-900 dark:text-red-300">
                    <BadgeAlert size={20} />
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

      {/* Active Section Content */}
      <div className="mt-8">
        {/* Security Controls Section */}
        {activeSection === 1 && (
          <div className="space-y-6">
            <SecurityControlsSection />
          </div>
        )}

        {/* Analytics Dashboard Section */}
        {activeSection === 4 && (
          <div className="space-y-6">
            <AnalyticsDashboard />
          </div>
        )}

        {/* Notification Center Section */}
        {activeSection === 5 && (
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
                      <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {unreadInbox} new
                      </span>
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
          </div>
        )}

        {/* Verification Center Section */}
        {activeSection === 6 && (
          <div className="space-y-6">
            <VerificationCenterSection />
          </div>
        )}

        {/* User Management Section */}
        {activeSection === 0 && (
          <div className="space-y-6">
            <UserManagementSection />
          </div>
        )}

        {/* System Settings Section */}
        {activeSection === 2 && (
          <div className="space-y-6">
            <SystemSettingsSection
              onAddAlert={(alert) => {
                setAlerts((prev) => [...prev, alert])
              }}
            />
          </div>
        )}

        {/* Data Management Section */}
        {activeSection === 3 && (
          <div className="space-y-6">
            <DataManagementSection />
          </div>
        )}

        {/* Default placeholder for other sections */}
        {activeSection !== 0 &&
          activeSection !== 1 &&
          activeSection !== 2 &&
          activeSection !== 3 &&
          activeSection !== 4 &&
          activeSection !== 5 &&
          activeSection !== 6 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">{sections[activeSection].title}</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  This section is under development. Content for {sections[activeSection].title.toLowerCase()} will
                  appear here.
                </p>
              </div>
            </div>
          )}
      </div>
    </div>
  )
}
