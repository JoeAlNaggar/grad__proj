"use client"

import { Share2, Bookmark, Eye, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/lib/hooks/use-toast"
import { motion } from "framer-motion"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface ActionButtonsProps {
  stats: {
    comments: number
    views: number
  }
  onCommentClick: () => void
  isSaved?: boolean
  onSaveClick?: () => void
  className?: string
}

export function ActionButtons({ stats, onCommentClick, isSaved = false, onSaveClick, className }: ActionButtonsProps) {
  const [isSharing, setIsSharing] = useState(false)

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setIsSharing(true)
      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard.",
      })
      setTimeout(() => setIsSharing(false), 1000)
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy link to clipboard.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={onCommentClick}
        className="text-gray-400 hover:text-gray-300 hover:bg-gray-800"
      >
        <MessageSquare className="w-4 h-4 mr-1" />
        {stats.comments}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleShare}
        className="text-gray-400 hover:text-gray-300 hover:bg-gray-800"
      >
        <motion.div animate={isSharing ? { scale: [1, 1.2, 1] } : {}}>
          <Share2 className="w-4 h-4" />
        </motion.div>
      </Button>

      {onSaveClick && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onSaveClick}
          className={cn(
            "transition-all duration-200",
            isSaved ? "text-indigo-500 bg-indigo-500/10" : "text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10",
          )}
        >
          <motion.div animate={isSaved ? { scale: [1, 1.2, 1] } : {}}>
            <Bookmark className="w-4 h-4" />
          </motion.div>
        </Button>
      )}

      <div className="flex items-center text-gray-400">
        <Eye className="w-4 h-4 mr-1" />
        {stats.views}
      </div>
    </div>
  )
}
