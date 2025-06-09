"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Copy, CornerUpLeft, Zap, ThumbsDown, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface Comment {
  id: string
  author: {
    name: string
    avatar: string
    username: string
  }
  content: string
  timestamp: string
  reactions: {
    thunder: number
    love: number
    angry: number
  }
}

interface CommentSectionProps {
  comments: Comment[]
  onAddComment: (comment: string) => void
}

export default function CommentSection({ comments, onAddComment }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("")
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [userReactions, setUserReactions] = useState<
    Record<string, { thunder: boolean; love: boolean; dislike: boolean }>
  >({})
  const [reactionCounts, setReactionCounts] = useState<
    Record<string, { thunder: number; love: number; dislike: number }>
  >({})

  useEffect(() => {
    const initialReactionCounts = comments.reduce((acc, comment) => {
      acc[comment.id] = {
        thunder: comment.reactions.thunder || 0,
        love: comment.reactions.love || 0,
        dislike: comment.reactions.angry || 0,
      }
      return acc
    }, {})
    setReactionCounts(initialReactionCounts)
  }, [comments])

  const handleReaction = (commentId: string, type: "thunder" | "love" | "dislike") => {
    setUserReactions((prev) => {
      const newState = {
        ...prev,
        [commentId]: {
          ...prev[commentId],
          [type]: !prev[commentId]?.[type],
        },
      }
      setReactionCounts((prevCounts) => ({
        ...prevCounts,
        [commentId]: {
          ...prevCounts[commentId],
          [type]: prevCounts[commentId][type] + (newState[commentId][type] ? 1 : -1),
        },
      }))
      return newState
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <MessageSquare className="h-4 w-4 mr-2" />
          {comments.length} Comments
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <div className="space-y-4">
          <div className="max-h-[400px] overflow-y-auto space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReaction(comment.id, "thunder")}
                        className={`transition-colors ${userReactions[comment.id]?.thunder ? "text-violet-500 bg-violet-100 dark:bg-violet-900" : ""}`}
                      >
                        <Zap className={`w-4 h-4 mr-1 ${userReactions[comment.id]?.thunder ? "animate-pulse" : ""}`} />
                        {reactionCounts[comment.id]?.thunder || 0}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReaction(comment.id, "love")}
                        className={`transition-colors ${userReactions[comment.id]?.love ? "text-red-500 bg-red-100 dark:bg-red-900" : ""}`}
                      >
                        <Heart className={`w-4 h-4 mr-1 ${userReactions[comment.id]?.love ? "animate-pulse" : ""}`} />
                        {reactionCounts[comment.id]?.love || 0}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReaction(comment.id, "dislike")}
                        className={`transition-colors ${userReactions[comment.id]?.dislike ? "text-red-900 bg-red-100 dark:bg-red-900" : ""}`}
                      >
                        <ThumbsDown
                          className={`w-4 h-4 mr-1 ${userReactions[comment.id]?.dislike ? "animate-pulse" : ""}`}
                        />
                        {reactionCounts[comment.id]?.dislike || 0}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setReplyTo(comment.author.username)}>
                        <CornerUpLeft className="h-4 w-4 mr-1" />
                        Reply
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder={replyTo ? `Reply to @${replyTo}...` : "Write a comment..."}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Upload className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Code className="h-4 w-4" />
                </Button>
              </div>
              <Button
                onClick={() => {
                  onAddComment(newComment)
                  setNewComment("")
                  setReplyTo(null)
                }}
              >
                Post Comment
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
