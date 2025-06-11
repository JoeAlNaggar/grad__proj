"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface InteractiveHoverButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export const InteractiveHoverButton = React.forwardRef<HTMLButtonElement, InteractiveHoverButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          "group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-slate-900 px-6 font-medium text-white transition-all duration-300 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100",
          className,
        )}
        ref={ref}
        {...props}
      >
        <div className="absolute inset-0 flex h-full w-full items-center justify-center [transform:translateX(-100%)] group-hover:[transform:translateX(0)]">
          <div className="flex h-full items-center justify-center transition-all duration-300 group-hover:scale-110">
            {children}
          </div>
        </div>
        <div className="absolute inset-0 flex h-full w-full items-center justify-center [transform:translateX(0)] group-hover:[transform:translateX(100%)]">
          <div className="flex h-full items-center justify-center transition-all duration-300">{children}</div>
        </div>
      </button>
    )
  },
)

InteractiveHoverButton.displayName = "InteractiveHoverButton"
