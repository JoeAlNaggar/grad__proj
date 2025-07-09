"use client"

import React from "react"
import { Wrench, Users, Lightbulb, User } from "lucide-react"
import Link from "next/link"
import { useAuth } from "../../contexts/AuthContext"


const QuickActionsCard = () => {

  const { user } = useAuth()
  const actions = [
    {
      id: 1,
      title: "Run Tools",
      description: "Access security toolkit",
      icon: Wrench,
      background: "bg-blue-500",
      hoverBackground: "hover:bg-blue-600",
      link: "/toolkit"
    },
    {
      id: 2,
      title: "Visit Community",
      description: "Join discussions",
      icon: Users,
      background: "bg-yellow-500",
      hoverBackground: "hover:bg-yellow-600",
      link: "/community"
    },
    {
      id: 3,
      title: "Get Inspiration",
      description: "Explore ideas",
      icon: Lightbulb,
      background: "bg-green-500",
      hoverBackground: "hover:bg-green-600",
      link: "/innovation/inspiration"
    },
    {
      id: 4,
      title: "View Profile",
      description: "Manage account",
      icon: User,
      background: "bg-purple-500",
      hoverBackground: "hover:bg-purple-600",
      link: `/profile/${user?.username}`
    }
  ]

  return (
    <div className="bg-white dark:bg-gray-800/50 backdrop-filter backdrop-blur-lg border border-white/10 dark:border-white/5 rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
      
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => {
          const IconComponent = action.icon
          
          return (
            <Link
              key={action.id}
              href={action.link}
              className={`${action.background} ${action.hoverBackground} rounded-xl p-6 text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg group`}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                  <IconComponent className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{action.title}</h3>
                  <p className="text-sm opacity-90">{action.description}</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default QuickActionsCard 