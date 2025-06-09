"use client"
import { Zap, Heart, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ReactionButtonsProps {
  reactions: {
    thunder: number
    love: number
    dislike: number
  }
  onReaction: (type: "thunder" | "love" | "dislike") => void
  userReactions?: {
    thunder: boolean
    love: boolean
    dislike: boolean
  }
}

export function ReactionButtons({
  reactions,
  onReaction,
  userReactions = { thunder: false, love: false, dislike: false },
}: ReactionButtonsProps) {
  return (
    <div className="flex space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onReaction("thunder")}
        className={cn(
          "transition-all duration-200",
          userReactions.thunder
            ? "text-amber-500 bg-amber-500/10"
            : "text-gray-400 hover:text-amber-400 hover:bg-amber-500/10",
        )}
      >
        <motion.div animate={userReactions.thunder ? { scale: [1, 1.2, 1] } : {}}>
          <Zap className="w-4 h-4 mr-1" />
        </motion.div>
        {reactions.thunder}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onReaction("love")}
        className={cn(
          "transition-all duration-200",
          userReactions.love
            ? "text-rose-500 bg-rose-500/10"
            : "text-gray-400 hover:text-rose-400 hover:bg-rose-500/10",
        )}
      >
        <motion.div animate={userReactions.love ? { scale: [1, 1.2, 1] } : {}}>
          <Heart className="w-4 h-4 mr-1" />
        </motion.div>
        {reactions.love}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onReaction("dislike")}
        className={cn(
          "transition-all duration-200",
          userReactions.dislike ? "text-sky-500 bg-sky-500/10" : "text-gray-400 hover:text-sky-400 hover:bg-sky-500/10",
        )}
      >
        <motion.div animate={userReactions.dislike ? { scale: [1, 1.2, 1] } : {}}>
          <ThumbsDown className="w-4 h-4 mr-1" />
        </motion.div>
        {reactions.dislike}
      </Button>
    </div>
  )
}
