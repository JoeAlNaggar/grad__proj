"use client"

import type React from "react"

import { type ReactNode, useState, useRef, useEffect } from "react"

interface BentoCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export default function BentoCard({ children, className = "", onClick }: BentoCardProps) {
  const [isRippling, setIsRippling] = useState(false)
  const [rippleStyle, setRippleStyle] = useState({})
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isRippling) {
      const timer = setTimeout(() => setIsRippling(false), 600)
      return () => clearTimeout(timer)
    }
  }, [isRippling])

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current!.getBoundingClientRect()
    const left = e.clientX - rect.left
    const top = e.clientY - rect.top

    setRippleStyle({
      left: `${left}px`,
      top: `${top}px`,
    })

    setIsRippling(true)
    onClick && onClick()
  }

  return (
    <div
      ref={cardRef}
      className={`bg-white dark:bg-gray-800/30 bg-opacity-50 dark:bg-opacity-30 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 dark:border-gray-700/30 rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${className} animate-slide-in relative overflow-hidden`}
      onClick={handleClick}
    >
      {children}
      {isRippling && <span className="ripple" style={rippleStyle} />}
    </div>
  )
}
