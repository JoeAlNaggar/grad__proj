"use client"

import type React from "react"

import { useState } from "react"
import { ChevronRight, ChevronLeft, Settings, Shield, Users, Database, BarChart, Bell, Lock } from "lucide-react"

// Card component for each admin section
interface AdminSectionCardProps {
  title: string
  icon: React.ReactNode
  description: string
  onClick?: () => void
}

const AdminSectionCard = ({ title, icon, description, onClick }: AdminSectionCardProps) => {
  return (
    <div
      onClick={onClick}
      className="min-w-[300px] h-[220px] bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col p-6 cursor-pointer border border-gray-200 dark:border-gray-700 group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-lg bg-primary/10 text-primary">{icon}</div>
        <div className="h-8 w-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <ChevronRight className="h-5 w-5" />
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>

      <div className="mt-auto">
        <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full">
          <div className="h-full w-0 bg-primary rounded-full group-hover:w-full transition-all duration-700"></div>
        </div>
      </div>
    </div>
  )
}

export default function AdminControlPanel() {
  const [scrollPosition, setScrollPosition] = useState(0)

  const scrollContainer = (direction: "left" | "right") => {
    const container = document.getElementById("scrollContainer")
    if (container) {
      const scrollAmount = 340 // Card width + gap
      const newPosition =
        direction === "left" ? Math.max(scrollPosition - scrollAmount, 0) : scrollPosition + scrollAmount

      container.scrollTo({
        left: newPosition,
        behavior: "smooth",
      })
      setScrollPosition(newPosition)
    }
  }

  // Placeholder sections - you can customize these later
  const adminSections = [
    {
      title: "User Management",
      icon: <Users className="h-6 w-6" />,
      description: "Manage users, roles, and permissions throughout the platform.",
    },
    {
      title: "Security Controls",
      icon: <Shield className="h-6 w-6" />,
      description: "Configure security policies, access controls, and authentication requirements.",
    },
    {
      title: "System Settings",
      icon: <Settings className="h-6 w-6" />,
      description: "Adjust core system configurations and operational parameters.",
    },
    {
      title: "Data Management",
      icon: <Database className="h-6 w-6" />,
      description: "Oversee data storage, retention policies, and backup procedures.",
    },
    {
      title: "Analytics Dashboard",
      icon: <BarChart className="h-6 w-6" />,
      description: "View comprehensive platform usage statistics and key metrics.",
    },
    {
      title: "Notification Center",
      icon: <Bell className="h-6 w-6" />,
      description: "Configure system notifications and alert thresholds.",
    },
    {
      title: "Compliance Management",
      icon: <Lock className="h-6 w-6" />,
      description: "Ensure platform adherence to regulatory requirements and standards.",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Control Panel</h1>
          <p className="text-gray-500 dark:text-gray-400">Centralized management for system administrators</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scrollContainer("left")}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scrollContainer("right")}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Horizontal scrolling container */}
      <div
        id="scrollContainer"
        className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {adminSections.map((section, index) => (
          <div key={index} className="snap-start">
            <AdminSectionCard title={section.title} icon={section.icon} description={section.description} />
          </div>
        ))}
      </div>

      {/* Grid layout for detailed sections - to be filled later */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-64 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex items-center justify-center"
          >
            <p className="text-gray-400 dark:text-gray-500">Section content will appear here</p>
          </div>
        ))}
      </div>
    </div>
  )
}
