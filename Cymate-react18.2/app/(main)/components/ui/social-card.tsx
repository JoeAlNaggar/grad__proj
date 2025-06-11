"use client"

import { useState } from "react"
import { Share2, Bookmark, AlertTriangle, MessageSquare, Zap, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { formatDistanceToNow } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"

interface Author {
  name: string
  username: string
  avatar: string
  jobTitle: string
}

interface Comment {
  id: string
  author: {
    name: string
    username: string
    avatar: string
  }
  content: string
  timestamp: string
  reactions: {
    thunder: number
    rage: number
  }
}

interface SocialCardProps {
  type: "post" | "blog" | "event" | "question"
  author: Author
  content: string
  timestamp: Date
  image?: string
  eventDetails?: {
    date: string
    location: string
    price: string
    slots: number
  }
  reactions: {
    thunder: number
    rage: number
  }
  comments: Comment[]
}

export default function SocialCard({
  type,
  author,
  content,
  timestamp,
  image,
  eventDetails,
  reactions,
  comments,
}: SocialCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [userReactions, setUserReactions] = useState({ thunder: false, rage: false })
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")

  const handleReaction = (type: "thunder" | "rage") => {
    setUserReactions((prev) => ({ ...prev, [type]: !prev[type] }))
  }

  const handleReport = () => {
    console.log("Reporting content...")
  }

  return (
    <div className="bg-white/10 dark:bg-gray-800/30 backdrop-filter backdrop-blur-lg border border-white/20 dark:border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-purple-500/10">
      <div className="p-6 space-y-4">
        {/* Author Section */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={author.avatar} />
              <AvatarFallback>{author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{author.name}</span>
                <span className="text-sm text-gray-500">@{author.username}</span>
              </div>
              <div className="text-sm text-gray-500">{author.jobTitle}</div>
              <div className="text-xs text-gray-400">{formatDistanceToNow(timestamp, { addSuffix: true })}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsBookmarked(!isBookmarked)}>
              <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={handleReport}>
                    <AlertTriangle className="h-4 w-4 hover:text-red-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Report this content</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-4">
          {type === "event" && eventDetails && (
            <div className="bg-purple-500/10 dark:bg-purple-500/5 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Date:</span>
                <span>{eventDetails.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Location:</span>
                <span>{eventDetails.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Price:</span>
                <span>{eventDetails.price}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Available Slots:</span>
                <span>{eventDetails.slots}</span>
              </div>
            </div>
          )}
          <p className="text-gray-800 dark:text-gray-200">{content}</p>
          {image && <img src={image} alt="Post content" className="rounded-lg w-full object-cover max-h-96" />}
        </div>

        {/* Actions Section */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)}>
              <MessageSquare className="h-4 w-4 mr-2" />
              {comments.length} Comments
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => handleReaction("thunder")}>
              <Zap
                className={`h-4 w-4 mr-1 transition-all duration-300 ${
                  userReactions.thunder
                    ? "text-yellow-500 fill-yellow-500 animate-pulse filter drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]"
                    : ""
                }`}
              />
              {reactions.thunder + (userReactions.thunder ? 1 : 0)}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleReaction("rage")}>
              <Flame
                className={`h-4 w-4 mr-1 transition-all duration-300 ${
                  userReactions.rage
                    ? "text-red-500 fill-red-500 animate-pulse filter drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                    : ""
                }`}
              />
              {reactions.rage + (userReactions.rage ? 1 : 0)}
            </Button>
          </div>
        </div>

        {/* Expandable Comments Section */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={comment.author.avatar} />
                        <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{comment.author.name}</span>
                          <span className="text-sm text-gray-500">@{comment.author.username}</span>
                          <span className="text-sm text-gray-500">{comment.timestamp}</span>
                        </div>
                        <p className="mt-1">{comment.content}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Button variant="ghost" size="sm">
                            <Zap className="h-4 w-4 mr-1" />
                            {comment.reactions.thunder}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Flame className="h-4 w-4 mr-1" />
                            {comment.reactions.rage}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    className="flex-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button
                    onClick={() => {
                      // Handle comment submission
                      setNewComment("")
                    }}
                  >
                    Post
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
