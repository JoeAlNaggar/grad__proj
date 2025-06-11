"use client"

import { useState } from "react"
import { Zap, ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"

const trendingContent = [
  {
    id: 1,
    author: {
      name: "Sarah Chen",
      username: "sarahc",
      avatar: "/placeholder.svg?height=40&width=40",
      jobTitle: "Security Researcher",
    },
    timestamp: new Date("2024-01-03"),
    content:
      "Just discovered a critical vulnerability in a popular web framework that could affect millions of websites. Here's my detailed analysis and mitigation strategy.",
    image: "/placeholder.svg?height=300&width=500",
    thunderCount: 12453,
    type: "research",
  },
  {
    id: 2,
    author: {
      name: "Alex Rivera",
      username: "alexr",
      avatar: "/placeholder.svg?height=40&width=40",
      jobTitle: "Malware Analyst",
    },
    timestamp: new Date("2024-01-04"),
    content:
      "Breaking: New ransomware strain targeting IoT devices. I've created a detection tool - open source and available now!",
    image: "/placeholder.svg?height=300&width=500",
    thunderCount: 9872,
    type: "tool",
  },
  {
    id: 3,
    author: {
      name: "Dr. Emma Watson",
      username: "emmaw",
      avatar: "/placeholder.svg?height=40&width=40",
      jobTitle: "AI Security Expert",
    },
    timestamp: new Date("2024-01-05"),
    content:
      "Introducing a new AI-powered intrusion detection system that achieves 99.9% accuracy with near-zero false positives.",
    image: "/placeholder.svg?height=300&width=500",
    thunderCount: 15234,
    type: "innovation",
  },
  {
    id: 4,
    author: {
      name: "Marcus Zhang",
      username: "marcusz",
      avatar: "/placeholder.svg?height=40&width=40",
      jobTitle: "Blockchain Security",
    },
    timestamp: new Date("2024-01-06"),
    content:
      "📝 Complete guide: Securing Smart Contracts against the top 10 vulnerabilities. Including real-world examples and prevention techniques.",
    image: "/placeholder.svg?height=300&width=500",
    thunderCount: 8765,
    type: "guide",
  },
  {
    id: 5,
    author: {
      name: "Lisa Kumar",
      username: "lisak",
      avatar: "/placeholder.svg?height=40&width=40",
      jobTitle: "Red Team Lead",
    },
    timestamp: new Date("2024-01-07"),
    content:
      "🔥 Just released: Advanced Penetration Testing Framework with automated exploit generation. 2 years in the making!",
    image: "/placeholder.svg?height=300&width=500",
    thunderCount: 11324,
    type: "tool",
  },
]

export default function ThunderSpotlight() {
  const [activeIndex, setActiveIndex] = useState(0)

  const nextSlide = () => {
    setActiveIndex((current) => (current + 1) % trendingContent.length)
  }

  const prevSlide = () => {
    setActiveIndex((current) => (current - 1 + trendingContent.length) % trendingContent.length)
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 relative overflow-hidden min-h-[600px]">
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-12">
        <div className="p-2 bg-purple-500/10 rounded-lg">
          <Zap className="w-6 h-6 text-purple-500" />
        </div>
        <h2 className="text-3xl font-bold text-white">Thunder Spotlight</h2>
      </div>

      {/* Carousel */}
      <div className="relative px-12">
        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white z-10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white z-10"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Cards */}
        <div className="relative h-[400px] overflow-hidden">
          <div className="absolute w-full h-full flex items-center">
            {trendingContent.map((content, index) => {
              const position = (index - activeIndex + trendingContent.length) % trendingContent.length
              const offset = position - Math.floor(trendingContent.length / 2)

              return (
                <motion.div
                  key={content.id}
                  className="absolute w-full max-w-2xl transform transition-all duration-300"
                  animate={{
                    left: `${50 + offset * 60}%`,
                    scale: position === 0 ? 1 : 0.8,
                    opacity: Math.abs(offset) <= 2 ? 1 : 0,
                    zIndex: trendingContent.length - Math.abs(offset),
                  }}
                  style={{
                    translateX: "-50%",
                  }}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl cursor-pointer hover:scale-[1.02] transition-transform">
                    {/* Author Info */}
                    <div className="p-6 flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={content.author.avatar} />
                          <AvatarFallback>{content.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">{content.author.name}</h3>
                          <p className="text-sm text-gray-500">@{content.author.username}</p>
                          <p className="text-sm text-gray-500">{content.author.jobTitle}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDistanceToNow(content.timestamp, { addSuffix: true })}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="px-6 pb-6">
                      <p className="text-gray-700 dark:text-gray-300 mb-4">{content.content}</p>
                      <img
                        src={content.image || "/placeholder.svg"}
                        alt="Content preview"
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-purple-500 animate-pulse filter drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                        <span className="font-semibold text-purple-500">{content.thunderCount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
