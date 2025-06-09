"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { X, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

const progressVariants = cva("w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1", {
  variants: {
    variant: {
      default: "",
      success: "",
      error: "",
      warning: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const barVariants = cva("h-2.5 rounded-full transition-all duration-300", {
  variants: {
    variant: {
      default: "bg-blue-500",
      success: "bg-green-500",
      error: "bg-red-500",
      warning: "bg-yellow-500",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof progressVariants> {
  value: number
  max?: number
  showValue?: boolean
  label?: string
  sublabel?: string
  showCancel?: boolean
  onCancel?: () => void
  indeterminate?: boolean
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    { className, variant, value, max = 100, showValue, label, sublabel, showCancel, onCancel, indeterminate, ...props },
    ref,
  ) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100))
    const isComplete = percentage === 100
    const hasError = variant === "error"

    return (
      <div className="w-full space-y-1" ref={ref} {...props}>
        {(label || showValue || showCancel) && (
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              {indeterminate && <Loader2 className="h-4 w-4 animate-spin text-gray-500" />}
              {isComplete && variant === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
              {hasError && <AlertCircle className="h-4 w-4 text-red-500" />}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</span>
            </div>
            <div className="flex items-center gap-2">
              {showValue && <span className="text-sm text-gray-500 dark:text-gray-400">{Math.round(percentage)}%</span>}
              {showCancel && (
                <button
                  onClick={onCancel}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              )}
            </div>
          </div>
        )}
        <div className={cn(progressVariants({ variant, className }))}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.3 }}
            className={cn(barVariants({ variant }))}
          />
        </div>
        {sublabel && <p className="text-xs text-gray-500 dark:text-gray-400">{sublabel}</p>}
      </div>
    )
  },
)
Progress.displayName = "Progress"

export { Progress }
