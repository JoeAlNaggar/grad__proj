"use client"

import { useState } from "react"
import { Heart, ThumbsDown, Zap, Share2, Eye, MessageSquare, AlertTriangle, Bookmark, User } from "lucide-react"

type Reaction = "thunder" | "love" | "dislike" | null

interface CardProps {
  content: string
  image?: string
  video?: string
  file?: string
  poll?: string
  tags: string[]
  author: {
    name: string
    username: string
    jobTitle: string
    profileImage: string
  }
  reactions: {
    thunder: number
    love: number
    dislike: number
  }
  views: number
  comments: {
    author: string
    content: string
    reactions: {
      thunder: number
      love: number
      dislike: number
    }
  }[]
}

export default function Card({
  content,
  image,
  video,
  file,
  poll,
  tags,
  author,
  reactions,
  views,
  comments,
}: CardProps) {
  const [currentReaction, setCurrentReaction] = useState<Reaction>(null)
  const [showComments, setShowComments] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleReaction = (reaction: Reaction) => {
    if (currentReaction === reaction) {
      setCurrentReaction(null)
    } else {
      setCurrentReaction(reaction)
    }
  }

  const handleShare = () => {
    // In a real app, you'd implement actual sharing logic here
    alert("Link copied!")
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <img
              src={author.profileImage || "/placeholder.svg"}
              alt={author.name}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <h3 className="font-semibold">{author.name}</h3>
              <p className="text-sm text-gray-600">@{author.username}</p>
              <p className="text-xs text-gray-500">{author.jobTitle}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              className={`p-1 rounded-full ${saved ? "text-yellow-500" : "text-gray-500 hover:text-yellow-500"}`}
              onClick={() => setSaved(!saved)}
            >
              <Bookmark size={16} />
            </button>
            <button className="p-1 rounded-full text-gray-500 hover:text-red-500" title="Report this">
              <AlertTriangle size={16} />
            </button>
          </div>
        </div>
        <p className="mb-4">{content}</p>
        {image && <img src={image || "/placeholder.svg"} alt="Content" className="w-full mb-4 rounded" />}
        {video && <video src={video} controls className="w-full mb-4 rounded" />}
        {file && (
          <a href={file} download className="block mb-4 text-blue-500 hover:underline">
            Download File
          </a>
        )}
        {poll && <div className="mb-4 p-4 bg-gray-100 rounded">{poll}</div>}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => {
            let tagStyle = "px-3 py-1 rounded-full text-xs font-semibold"
            if (index === 0) {
              switch (tag.toLowerCase()) {
                case "blog":
                  tagStyle += " bg-violet-500 text-white"
                  break
                case "post":
                  tagStyle += " bg-blue-500 text-white"
                  break
                case "event":
                  tagStyle += " bg-green-500 text-white"
                  break
                case "question":
                  tagStyle += " bg-yellow-500 text-white"
                  break
                default:
                  tagStyle += " bg-gray-500 text-white"
              }
            } else {
              tagStyle += " bg-gray-200 text-gray-700"
            }
            return (
              <span key={tag} className={tagStyle}>
                {tag}
              </span>
            )
          })}
        </div>
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              className={`flex items-center space-x-1 ${currentReaction === "thunder" ? "text-violet-500" : "text-gray-500"}`}
              onClick={() => handleReaction("thunder")}
            >
              <Zap size={16} />
              <span>{reactions.thunder + (currentReaction === "thunder" ? 1 : 0)}</span>
            </button>
            <button
              className={`flex items-center space-x-1 ${currentReaction === "love" ? "text-red-500" : "text-gray-500"}`}
              onClick={() => handleReaction("love")}
            >
              <Heart size={16} />
              <span>{reactions.love + (currentReaction === "love" ? 1 : 0)}</span>
            </button>
            <button
              className={`flex items-center space-x-1 ${currentReaction === "dislike" ? "text-green-500" : "text-gray-500"}`}
              onClick={() => handleReaction("dislike")}
            >
              <ThumbsDown size={16} />
              <span>{reactions.dislike + (currentReaction === "dislike" ? 1 : 0)}</span>
            </button>
          </div>
          <div className="flex space-x-4">
            <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500" onClick={handleShare}>
              <Share2 size={16} />
            </button>
            <div className="flex items-center space-x-1 text-gray-500">
              <Eye size={16} />
              <span>{views}</span>
            </div>
            <button
              className="flex items-center space-x-1 text-gray-500 hover:text-blue-500"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageSquare size={16} />
              <span>{comments.length}</span>
            </button>
          </div>
        </div>
      </div>
      {showComments && (
        <div className="p-4 bg-gray-50">
          {comments.map((comment, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <div className="flex items-center mb-2">
                <User size={16} className="mr-2" />
                <span className="font-semibold">{comment.author}</span>
              </div>
              <p className="mb-2">{comment.content}</p>
              <div className="flex space-x-4">
                <button className="flex items-center space-x-1 text-gray-500 hover:text-violet-500">
                  <Zap size={14} />
                  <span>{comment.reactions.thunder}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500">
                  <Heart size={14} />
                  <span>{comment.reactions.love}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500">
                  <ThumbsDown size={14} />
                  <span>{comment.reactions.dislike}</span>
                </button>
                <button className="text-gray-500 hover:text-blue-500">Reply</button>
              </div>
            </div>
          ))}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Add a comment..."
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}
      {tags.includes("Event") && (
        <div className="p-4 bg-blue-50">
          <h4 className="font-semibold mb-2">Event Details</h4>
          <p className="mb-2">Join us for this exciting cybersecurity event!</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            Enroll Now
          </button>
        </div>
      )}
    </div>
  )
}
