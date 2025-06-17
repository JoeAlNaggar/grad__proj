"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/contexts/AuthContext"
import Layout from "./components/layout"
import Card from "./components/card"
import AdCard from "./components/ad-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline"
import { TrendingUp, Clock } from "lucide-react"
import { getPosts, type Post, type PostResponse } from "@/app/services/api"

const adCards = [
  {
    title: "CyberShield Pro",
    description: "Advanced threat protection for your enterprise. Try our 30-day free trial now!",
    imageUrl: "/placeholder.svg?height=150&width=300",
    link: "https://example.com/cybershield-pro",
    tags: ["Ad", "Security", "Enterprise", "Trial"],
  },
  {
    title: "SecureCloud 2023",
    description: "The ultimate conference for cloud security professionals. Early bird tickets available!",
    imageUrl: "/placeholder.svg?height=150&width=300",
    link: "https://example.com/securecloud-2023",
    tags: ["Ad", "Conference", "Cloud Security", "Networking"],
  },
  {
    title: "Quantum-Safe Encryption",
    description: "Prepare for the post-quantum era with our state-of-the-art encryption solutions.",
    imageUrl: "/placeholder.svg?height=150&width=300",
    link: "https://example.com/quantum-safe",
    tags: ["Ad", "Encryption", "Quantum Computing", "Data Protection"],
  },
  {
    title: "CyberAcademy Online",
    description: "Master cybersecurity skills from home. Flexible learning paths for all levels.",
    imageUrl: "/placeholder.svg?height=150&width=300",
    link: "https://example.com/cyber-academy",
    tags: ["Ad", "Education", "Online Learning", "Certification"],
  },
  {
    title: "AI-Powered Threat Intelligence",
    description: "Stay ahead of cyber threats with our AI-driven intelligence platform.",
    imageUrl: "/placeholder.svg?height=150&width=300",
    link: "https://example.com/ai-threat-intel",
    tags: ["Ad", "AI", "Threat Intelligence", "Cybersecurity"],
  },
  {
    title: "SecureCoder Bootcamp",
    description: "Intensive 12-week program to become a certified secure coding expert.",
    imageUrl: "/placeholder.svg?height=150&width=300",
    link: "https://example.com/secure-coder-bootcamp",
    tags: ["Ad", "Training", "Secure Coding", "Certification"],
  },
  {
    title: "PhishGuard Pro",
    description: "Protect your organization from sophisticated phishing attacks. Get a demo today!",
    imageUrl: "/placeholder.svg?height=150&width=300",
    link: "https://example.com/phishguard-pro",
    tags: ["Ad", "Anti-Phishing", "Email Security", "Demo"],
  },
  {
    title: "CyberInsure Plus",
    description: "Comprehensive cyber insurance for businesses of all sizes. Get a quote in minutes.",
    imageUrl: "/placeholder.svg?height=150&width=300",
    link: "https://example.com/cyber-insure",
    tags: ["Ad", "Insurance", "Risk Management", "Business"],
  },
  {
    title: "Blockchain Security Summit",
    description: "Join industry leaders to discuss the future of blockchain security. Register now!",
    imageUrl: "/placeholder.svg?height=150&width=300",
    link: "https://example.com/blockchain-summit",
    tags: ["Ad", "Blockchain", "Conference", "Networking"],
  },
  {
    title: "SecureIoT Platform",
    description: "End-to-end security solution for your IoT devices and networks.",
    imageUrl: "/placeholder.svg?height=150&width=300",
    link: "https://example.com/secure-iot",
    tags: ["Ad", "IoT", "Network Security", "Device Management"],
  },
]

export default function CommunityPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [sortBy, setSortBy] = useState<"trending" | "recent">("recent")
  const [showFilterInput, setShowFilterInput] = useState(false)
  const [filterTags, setFilterTags] = useState<string[]>([])
  const [filterInput, setFilterInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    // Only fetch posts if user is authenticated and auth loading is complete
    if (!authLoading && isAuthenticated) {
      // Reset to page 1 when filters change
      setPage(1)
      setPosts([])
      fetchPosts(1, filterTags)
    } else if (!authLoading && !isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = '/login'
    }
  }, [filterTags, authLoading, isAuthenticated])

  useEffect(() => {
    // Load more posts when page changes (but not on first load)
    if (!authLoading && isAuthenticated && page > 1) {
      fetchPosts(page, filterTags)
    }
  }, [page, authLoading, isAuthenticated])

  const fetchPosts = async (pageNum: number = 1, tags: string[] = []) => {
    try {
      setLoading(true)
      const response = await getPosts(pageNum, 10, tags.length > 0 ? tags : undefined)
      
      // Debug: Log post IDs to verify they're coming from backend correctly
      console.log('📋 Fetched posts with IDs:', response.results.map(post => ({ 
        id: post.id, 
        author: post.author, 
        content: post.content.substring(0, 50) + '...' 
      })))
      
      if (pageNum === 1) {
        setPosts(response.results)
      } else {
        setPosts(prev => [...prev, ...response.results])
      }
      setHasMore(!!response.next)
      setError(null)
    } catch (err: any) {
      if (err.response?.status === 401) {
        // Handle unauthorized access
        setError('Authentication required. Please log in again.')
        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = '/login'
        }, 2000)
      } else {
        setError('Failed to fetch posts. Please try again.')
      }
      console.error('Error fetching posts:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filterInput.trim() !== "") {
      setFilterTags([...filterTags, filterInput.trim().toLowerCase()])
      setFilterInput("")
      setShowFilterInput(false) 
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFilterTags(filterTags.filter((tag) => tag !== tagToRemove))
  }

  // Apply search filtering client-side (since search is not in API)
  const searchFilteredContent = posts.filter((item) => {
    if (searchQuery === "") return true
    return (
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })

  const sortedContent = searchFilteredContent.sort((a, b) => {
    if (sortBy === "trending") {
      // Calculate total reactions from individual reaction counts
      const aTotal = (a.reactions?.Thunder || 0) + (a.reactions?.Love || 0) + (a.reactions?.Dislike || 0)
      const bTotal = (b.reactions?.Thunder || 0) + (b.reactions?.Love || 0) + (b.reactions?.Dislike || 0)
      return bTotal - aTotal
    } else {
      // Sort by created_at timestamp (most recent first)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
  })

  const contentWithAds = sortedContent.reduce((acc, item, index) => {
    acc.push(item)
    if ((index + 1) % 12 === 0 && adCards[(index / 12) % adCards.length]) {
      acc.push(adCards[(index / 12) % adCards.length])
    }
    return acc
  }, [] as (Post | typeof adCards[0])[])

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1)
    }
  }

  // Handle post deletion
  const handlePostDelete = (deletedPostId: string) => {
    setPosts(prev => prev.filter(post => post.id !== deletedPostId))
  }

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8 text-center">Cybersecurity Community</h1>

      <div className="mb-8 flex flex-col gap-4 ">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search the community..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="dark:bg-slate-600 w-full py-3 px-4 pr-12 rounded-xl bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg focus:outline-none focus:ring-2 focus:ring-violet-300 transition duration-300 ease-in-out shadow-lg"
          />
          <MagnifyingGlassIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
        </div>
        <div className="flex gap-4 items-center">
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowFilterInput(!showFilterInput)}
              className="gap-2"
            >
              <AdjustmentsHorizontalIcon className="h-6 w-6 mr-2" />
              Filters
            </Button>
            {showFilterInput && (
              <div className="absolute top-full left-0 mt-2 w-64  backdrop-filter backdrop-blur-lg rounded-xl shadow-lg p-1 z-10">
                <Input
                  type="text"
                  value={filterInput}
                  onChange={(e) => setFilterInput(e.target.value)}
                  onKeyPress={handleFilterInput}
                  placeholder="Filter by Tag"
                  className="w-full py-2 px-3 rounded-lg bg-white bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-violet-300"
                />
              </div>
            )}
          </div>
          <Button
            variant={sortBy === "recent" ? "default" : "outline"}
            onClick={() => setSortBy("recent")}
            className="gap-2"
          >
            <Clock className="w-4 h-4" />
            Recent
          </Button>
          <Button
            variant={sortBy === "trending" ? "default" : "outline"}
            onClick={() => setSortBy("trending")}
            className="gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Trending
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {filterTags.map((tag) => (
            <span key={tag} className="px-2 py-1 rounded-full bg-violet-500 text-white text-sm flex items-center">
              {tag}
              <button onClick={() => removeTag(tag)} className="ml-1 focus:outline-none">
                &times;
              </button>
            </span>
          ))}
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-center mb-4">
          {error}
        </div>
      )}

      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
        {contentWithAds.map((item, index) => {
          if (!item) return null
          
          // Use post ID as key for posts, and a stable identifier for ads
          const key = "content" in item ? `post-${item.id}` : `ad-${index}`
          
          // Debug: Log the key being used (only for posts)
          if ("content" in item) {
            console.log(`🔑 Using key: ${key} for post by ${item.author}`)
          }
          
          return (
            <div key={key} className="break-inside-avoid mb-8">
              {"content" in item ? (
                <Card 
                  {...item} 
                  onUpdate={(updatedPost) => {
                    // Update the post in the posts array
                    setPosts(prev => prev.map(post => 
                      post.id === updatedPost.id ? updatedPost : post
                    ))
                  }}
                  onDelete={handlePostDelete}
                />
              ) : "title" in item ? (
                <AdCard {...item} />
              ) : null}
            </div>
          )
        })}
      </div>

      {loading && (
        <div className="text-center mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500 mx-auto"></div>
        </div>
      )}

      {!loading && hasMore && (
        <div className="text-center mt-8">
          <Button onClick={loadMore} variant="outline">
            Load More
          </Button>
        </div>
      )}
    </Layout>
  )
}
