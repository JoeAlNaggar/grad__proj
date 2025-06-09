"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ReactionButtons } from "./reaction-buttons"
import { formatDistanceToNow } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"

interface Comment {
  id: string
  author: {
    name: string
    avatar: string
    username: string
  }
  content: string
  timestamp: Date
  reactions: {
    thunder: number
    love: number
    dislike: number
  }
  userReactions?: {
    thunder: boolean
    love: boolean
    dislike: boolean
  }
}

interface CommentSectionProps {
  comments: Comment[]
  onAddComment: (content: string) => void
  onReaction: (commentId: string, type: "thunder" | "love" | "dislike") => void
}

export function CommentSection({ comments, onAddComment, onReaction }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      onAddComment(newComment)
      setNewComment("")
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex gap-4">
        <Avatar className="w-8 h-8">
          <AvatarImage src="/placeholder.svg?height=32&width=32" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 bg-gray-800/50 border-gray-700/50 text-gray-100 placeholder-gray-400"
          />
          <Button type="submit" disabled={!newComment.trim()} className="bg-indigo-500 hover:bg-indigo-600 text-white">
            Comment
          </Button>
        </div>
      </form>

      <AnimatePresence>
        {comments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex gap-4 group"
          >
            <Avatar className="w-8 h-8">
              <AvatarImage src={comment.author.avatar} />
              <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-200">{comment.author.name}</span>
                <span className="text-gray-400">@{comment.author.username}</span>
                <span className="text-gray-500">·</span>
                <span className="text-gray-500">{formatDistanceToNow(comment.timestamp, { addSuffix: true })}</span>
              </div>
              <p className="mt-1 text-gray-300">{comment.content}</p>
              <div className="mt-2">
                <ReactionButtons
                  reactions={comment.reactions}
                  onReaction={(type) => onReaction(comment.id, type)}
                  userReactions={comment.userReactions}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
