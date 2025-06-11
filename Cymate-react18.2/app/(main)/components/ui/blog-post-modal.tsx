"use client"

import { useState } from "react"
import { X, Zap, Heart, ThumbsDown, MessageSquare, Share2, Eye, Bookmark, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import AnimatedAd from "../AnimatedAd"
import { formatDistanceToNow } from "date-fns"
import { toast } from "@/lib/hooks/use-toast"

interface BlogPostModalProps {
  blogData: any
  onClose: () => void
}

export function BlogPostModal({ blogData, onClose }: BlogPostModalProps) {
  const [userReactions, setUserReactions] = useState({
    thunder: false,
    love: false,
    dislike: false,
  })
  const [reactionCounts, setReactionCounts] = useState({
    thunder: blogData.reactions.find((r) => r.type === "thunder")?.count || 0,
    love: blogData.reactions.find((r) => r.type === "love")?.count || 0,
    dislike: blogData.reactions.find((r) => r.type === "angry")?.count || 0,
  })
  const [showComments, setShowComments] = useState(false)
  const [isSharing, setIsSharing] = useState(false)

  const handleReaction = (type: "thunder" | "love" | "dislike") => {
    setUserReactions((prev) => {
      const newState = { ...prev, [type]: !prev[type] }
      setReactionCounts((prevCounts) => ({
        ...prevCounts,
        [type]: prevCounts[type] + (newState[type] ? 1 : -1),
      }))
      return newState
    })
  }

  const handleShare = () => {
    setIsSharing(true)
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link copied!",
      description: "The blog post link has been copied to your clipboard.",
    })
    setTimeout(() => setIsSharing(false), 1000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>

            {blogData.image && (
              <img src={blogData.image} alt="Blog post image" className="w-full rounded-lg object-cover max-h-96" />
            )}

            <h1 className="text-3xl font-bold">{blogData.title || "Blog Post Title"}</h1>

            <div className="prose dark:prose-invert max-w-none">{blogData.content}</div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReaction("thunder")}
                  className={`transition-colors ${userReactions.thunder ? "text-violet-500 bg-violet-100 dark:bg-violet-900" : ""}`}
                >
                  <Zap className={`w-5 h-5 mr-1 ${userReactions.thunder ? "animate-pulse" : ""}`} />
                  {reactionCounts.thunder}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReaction("love")}
                  className={`transition-colors ${userReactions.love ? "text-red-500 bg-red-100 dark:bg-red-900" : ""}`}
                >
                  <Heart className={`w-5 h-5 mr-1 ${userReactions.love ? "animate-pulse" : ""}`} />
                  {reactionCounts.love}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReaction("dislike")}
                  className={`transition-colors ${userReactions.dislike ? "text-red-900 bg-red-100 dark:bg-red-900" : ""}`}
                >
                  <ThumbsDown className={`w-5 h-5 mr-1 ${userReactions.dislike ? "animate-pulse" : ""}`} />
                  {reactionCounts.dislike}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)}>
                  <MessageSquare className="w-5 h-5 mr-1" />
                  {blogData.comments.length}
                </Button>
                <AnimatePresence>
                  {isSharing ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-green-500"
                    >
                      Link copied
                    </motion.div>
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <Button variant="ghost" size="sm" onClick={handleShare}>
                        <Share2 className="w-5 h-5 mr-1" />
                        {blogData.shares}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex items-center text-gray-500">
                  <Eye className="w-5 h-5 mr-1" />
                  {blogData.views}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Bookmark className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="group">
                  <AlertCircle className="w-5 h-5 group-hover:text-red-500 transition-colors" />
                </Button>
              </div>
            </div>
            {showComments && (
              <div className="mt-4 space-y-4 border-t pt-4 dark:border-gray-700">
                {blogData.comments.map((comment, index) => (
                  <div key={index} className="flex space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={comment.author.avatar} />
                      <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{comment.author.name}</div>
                      <div className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                      </div>
                      <p className="mt-1">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={blogData.author.avatar} alt={blogData.author.name} />
                  <AvatarFallback>{blogData.author.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{blogData.author.name}</h3>
                  <p className="text-gray-500">@{blogData.author.username}</p>
                  <p className="text-sm text-gray-500">{blogData.author.title}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {blogData.author.bio ||
                  "Passionate about creating scalable web applications and solving complex problems. Experienced in modern web technologies and cloud architecture."}
              </p>
              <Button className="w-full">View</Button>
            </div>

            <AnimatedAd />

            <div className="space-y-4">
              <h4 className="font-semibold">New Tools</h4>
              {/* Add animated cards for new tools here */}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-4">More from {blogData.author.name}</h4>
            {/* Add cards for content from the same author */}
          </div>
          <div>
            <h4 className="font-semibold mb-4">Related Content</h4>
            {/* Add cards for content with the same tags */}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
