"use client"

import { useState } from "react"
import {
  MessageSquare,
  Share2,
  AlertTriangle,
  Bookmark,
  Calendar,
  FileText,
  HelpCircle,
  Eye,
  Zap,
  Heart,
  ThumbsDown,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { motion } from "framer-motion"
import { toast } from "@/lib/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Reaction {
  thunder: number
  love: number
  dislike: number
}

interface Comment {
  id: string
  author: {
    name: string
    avatar: string
    username: string
  }
  content: string
  timestamp: Date
  reactions: { [key: string]: number }
}

interface PostCardProps {
  type: "post" | "blog" | "event" | "question"
  author: {
    name: string
    avatar: string
    username: string
    title: string
  }
  content: string
  timestamp: Date
  image?: string
  reactions: Reaction
  comments: Comment[]
  shares: number
  views: number
  tags: string[]
  eventDetails?: {
    date: string
    location: string
    price: string
    slots: number
  }
  onBlogClick?: () => void
  userReaction?: string
  onReaction: (type: "thunder" | "love" | "dislike") => void
}

const typeColors = {
  post: "bg-blue-500/10 text-blue-500",
  blog: "bg-purple-500/10 text-purple-500",
  event: "bg-green-500/10 text-green-500",
  question: "bg-yellow-500/10 text-yellow-500",
}

const typeIcons = {
  post: FileText,
  blog: FileText,
  event: Calendar,
  question: HelpCircle,
}

export function PostCard({
  type,
  author,
  content,
  timestamp,
  image,
  reactions,
  comments,
  shares,
  views,
  tags,
  eventDetails,
  onBlogClick,
  userReaction,
  onReaction,
}: PostCardProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const TypeIcon = typeIcons[type]

  const handleShare = () => {
    setIsSharing(true)
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link copied!",
      description: "The post link has been copied to your clipboard.",
    })
    setTimeout(() => setIsSharing(false), 1000)
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
    toast({
      title: isSaved ? "Removed from saved" : "Saved for later",
      description: isSaved
        ? "The post has been removed from your saved items."
        : "The post has been saved for later viewing.",
    })
  }

  const handleReaction = (type: "thunder" | "love" | "dislike") => {
    onReaction(type)
  }

  return (
    <motion.div
      className={`bg-white dark:bg-gray-800/30 backdrop-filter backdrop-blur-lg rounded-xl p-4 shadow-lg hover:shadow-xl transition duration-300 ease-in-out ${type === "blog" ? "cursor-pointer" : ""}`}
      onClick={type === "blog" ? onBlogClick : undefined}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={author.avatar} alt={author.name} />
            <AvatarFallback>{author.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{author.name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">@{author.username}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{author.title}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20"
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log("Reporting content...")
                  }}
                >
                  <AlertTriangle className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Report this content</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full ${isSaved ? "text-yellow-500" : ""}`}
            onClick={(e) => {
              e.stopPropagation()
              handleSave()
            }}
          >
            <Bookmark className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {image && (
        <img
          src={image || "/placeholder.svg"}
          alt="Post content"
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}

      <p className="text-gray-700 dark:text-gray-300 mb-4">{content}</p>

      {eventDetails && (
        <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
          <p>
            <strong>Date:</strong> {eventDetails.date}
          </p>
          <p>
            <strong>Location:</strong> {eventDetails.location}
          </p>
          <p>
            <strong>Price:</strong> {eventDetails.price}
          </p>
          <p>
            <strong>Available Slots:</strong> {eventDetails.slots}
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="secondary" className={typeColors[type]}>
          <TypeIcon className="w-3 h-3 mr-1" />
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Badge>
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="bg-gray-100 dark:bg-gray-700">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleReaction("thunder")
            }}
            className={`transition-colors ${userReaction === "thunder" ? "text-violet-500" : "text-gray-500 hover:text-violet-500"}`}
          >
            <Zap className={`w-4 h-4 mr-1 ${userReaction === "thunder" ? "animate-pulse" : ""}`} />
            <span>{reactions.thunder}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleReaction("love")
            }}
            className={`transition-colors ${userReaction === "love" ? "text-red-500" : "text-gray-500 hover:text-red-500"}`}
          >
            <Heart className={`w-4 h-4 mr-1 ${userReaction === "love" ? "animate-pulse" : ""}`} />
            <span>{reactions.love}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleReaction("dislike")
            }}
            className={`transition-colors ${userReaction === "dislike" ? "text-green-500" : "text-gray-500 hover:text-green-500"}`}
          >
            <ThumbsDown className={`w-4 h-4 mr-1 ${userReaction === "dislike" ? "animate-pulse" : ""}`} />
            <span>{reactions.dislike}</span>
          </Button>
        </div>
        <div className="flex items-center space-x-4 text-gray-500">
          <div className="flex items-center">
            <MessageSquare className="w-4 h-4 mr-1" />
            <span>{comments.length}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleShare()
            }}
          >
            <Share2 className="w-4 h-4 mr-1" />
            <span>{shares}</span>
          </Button>
          <div className="flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            <span>{views}</span>
          </div>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        {formatDistanceToNow(timestamp, { addSuffix: true })}
      </div>
    </motion.div>
  )
}
