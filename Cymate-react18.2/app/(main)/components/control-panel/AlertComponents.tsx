"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Trash2, FileText, CheckCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

// Types
export interface Alert {
  id: string
  title: string
  description: string
  timestamp: string
  type: "critical" | "warning" | "info"
  status: "active" | "ignored" | "solving" | "solved" | "not-solved"
}

// Alert Card Component
export const AlertCard = ({
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
export const SolvingAlertCard = ({
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
export const CriticalAlertCard = ({ alert, onRemove }: { alert: Alert; onRemove: () => void }) => {
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

// Alert Chart Component
export const AlertChart = ({ weekView = true }: { weekView?: boolean }) => {
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
