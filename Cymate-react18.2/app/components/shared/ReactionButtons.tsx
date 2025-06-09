"use client"

import { useState } from "react"
import { Zap, Heart, ThumbsDown, Share, Bookmark, Flag } from "lucide-react"

interface ReactionButtonsProps {
  initialCounts?: {
    thunder: number
    love: number
    dislike: number
  }
  onReact?: (type: "thunder" | "love" | "dislike", value: number) => void
  onShare?: () => void
  onSave?: () => void
  onReport?: () => void
  className?: string
}

export default function ReactionButtons({
  initialCounts = { thunder: 0, love: 0, dislike: 0 },
  onReact,
  onShare,
  onSave,
  onReport,
  className = "",
}: ReactionButtonsProps) {
  const [reactions, setReactions] = useState({
    thunder: { count: initialCounts.thunder, active: false },
    love: { count: initialCounts.love, active: false },
    dislike: { count: initialCounts.dislike, active: false },
    saved: false,
  })

  const handleReaction = (type: "thunder" | "love" | "dislike") => {
    setReactions((prev) => {
      const newValue = !prev[type].active
      const newCount = prev[type].count + (newValue ? 1 : -1)

      if (onReact) {
        onReact(type, newCount)
      }

      return {
        ...prev,
        [type]: {
          count: newCount,
          active: newValue,
        },
      }
    })
  }

  const handleSave = () => {
    setReactions((prev) => ({
      ...prev,
      saved: !prev.saved,
    }))

    if (onSave) {
      onSave()
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={() => handleReaction("thunder")}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${
          reactions.thunder.active
            ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
            : "hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
      >
        <Zap
          className={`w-4 h-4 ${
            reactions.thunder.active ? "text-purple-500 fill-purple-500" : "text-gray-500 dark:text-gray-400"
          }`}
        />
        <span
          className={`text-sm font-medium ${
            reactions.thunder.active ? "text-purple-600 dark:text-purple-400" : "text-gray-600 dark:text-gray-300"
          }`}
        >
          {reactions.thunder.count > 0 ? reactions.thunder.count : ""}
        </span>
      </button>

      <button
        onClick={() => handleReaction("love")}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${
          reactions.love.active
            ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
            : "hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
      >
        <Heart
          className={`w-4 h-4 ${
            reactions.love.active ? "text-red-500 fill-red-500" : "text-gray-500 dark:text-gray-400"
          }`}
        />
        <span
          className={`text-sm font-medium ${
            reactions.love.active ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-300"
          }`}
        >
          {reactions.love.count > 0 ? reactions.love.count : ""}
        </span>
      </button>

      <button
        onClick={() => handleReaction("dislike")}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${
          reactions.dislike.active
            ? "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            : "hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
      >
        <ThumbsDown
          className={`w-4 h-4 ${
            reactions.dislike.active
              ? "text-gray-600 fill-gray-600 dark:text-gray-300 dark:fill-gray-300"
              : "text-gray-500 dark:text-gray-400"
          }`}
        />
        <span
          className={`text-sm font-medium ${
            reactions.dislike.active ? "text-gray-700 dark:text-gray-300" : "text-gray-600 dark:text-gray-300"
          }`}
        >
          {reactions.dislike.count > 0 ? reactions.dislike.count : ""}
        </span>
      </button>

      <div className="flex-1"></div>

      <button
        onClick={onShare}
        className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Share"
      >
        <Share className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </button>

      <button
        onClick={handleSave}
        className={`p-1.5 rounded-full transition-colors ${
          reactions.saved ? "bg-blue-100 dark:bg-blue-900/30" : "hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
        aria-label="Save for later"
      >
        <Bookmark
          className={`w-4 h-4 ${
            reactions.saved
              ? "text-blue-500 fill-blue-500 dark:text-blue-400 dark:fill-blue-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
        />
      </button>

      <button
        onClick={onReport}
        className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Report"
      >
        <Flag className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </button>
    </div>
  )
}
