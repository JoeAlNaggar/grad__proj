"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type React from "react"

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

export const SectionCard = ({
  title,
  icon,
  primaryColor,
  secondaryColor,
  accentColor,
  isActive,
  alertCount,
  index,
  description,
  onClick,
}: SectionCardProps) => {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "min-w-[340px] h-[240px] rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden group",
        isActive && `shadow-[0_0_20px_rgba(${accentColor},0.4)]`,
      )}
      style={{
        background: isActive ? `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)` : "white",
      }}
    >
      {/* Background decoration */}
      <div
        className="absolute top-0 right-0 h-32 w-32 opacity-30 rounded-full blur-md -mt-10 -mr-10"
        style={{ background: isActive ? accentColor : `rgba(${accentColor}, 0.1)` }}
      />
      <div
        className="absolute bottom-0 left-0 h-20 w-20 opacity-20 rounded-full blur-md -mb-8 -ml-8"
        style={{ background: isActive ? accentColor : `rgba(${accentColor}, 0.1)` }}
      />

      {/* Content */}
      <div className="p-6 relative z-10 h-full flex flex-col">
        <div className="flex items-center justify-between">
          <div
            className={cn(
              "w-14 h-14 rounded-xl flex items-center justify-center",
              isActive ? "bg-white/20" : `bg-[${primaryColor}]/10`,
            )}
          >
            <div className={isActive ? "text-white" : `text-[${primaryColor}]`}>{icon}</div>
          </div>

          {alertCount && alertCount > 0 && (
            <div className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {alertCount > 99 ? "99+" : alertCount}
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-col flex-grow">
          <h3 className={cn("text-xl font-bold", isActive ? "text-white" : "text-gray-800 dark:text-white")}>
            {title}
          </h3>
          <p
            className={cn("text-sm mt-1 line-clamp-2", isActive ? "text-white/80" : "text-gray-500 dark:text-gray-400")}
          >
            {description}
          </p>
        </div>
      </div>

      {/* Active indicator */}
      {isActive && <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/50" />}
    </motion.div>
  )
}
