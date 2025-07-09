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
import { motion } from "framer-motion"

const adCards = [
  {
    title: "CyberShield Pro",
    description: "Advanced threat protection for your enterprise. Try our 30-day free trial now!",
    imageUrl: "/ad_1.png",
    link: "https://cybershield-waf.com/",
    tags: ["Ad", "Security", "Enterprise", "Trial"],
  },
  {
    title: "SecureCloud",
    description: "The ultimate conference for cloud security professionals. Early bird tickets available!",
    imageUrl: "/placeholder.svg?height=150&width=300",
    link: "https://www.securecloud.de/en",
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
    if (searchQuery === "") return true;

    const searchTerm = searchQuery.toLowerCase();
    const content = item.content ? item.content.toLowerCase() : "";
    let authorFields = "";

    if (item.author && typeof item.author === "object") {
      const { username, first_name, last_name } = item.author;
      authorFields = [
        username,
        first_name,
        last_name
      ]
        .filter(Boolean)
        .map((v) => v.toLowerCase())
        .join(" ");
    }

    // Include post_type as a tag
    const tags = [
      ...(item.tags ? item.tags.map((tag) =>
        typeof tag === "string" ? tag.toLowerCase() : ""
      ) : []),
      item.post_type ? item.post_type.toLowerCase() : ""
    ];

    return (
      content.includes(searchTerm) ||
      authorFields.includes(searchTerm) ||
      tags.some((tag) => tag.includes(searchTerm))
    );
  });

  // Filter by tags (when filterTags is used)
  const tagFilteredContent = searchFilteredContent.filter((item) => {
    if (!filterTags.length) return true;
    // Include post_type as a tag for filtering
    const tags = [
      ...(item.tags ? item.tags.map((tag) =>
        typeof tag === "string" ? tag.toLowerCase() : ""
      ) : []),
      item.post_type ? item.post_type.toLowerCase() : ""
    ];
    return filterTags.every((tag) => tags.includes(tag));
  });

  // Use tagFilteredContent instead of searchFilteredContent for sorting and rendering
  const sortedContent = tagFilteredContent.sort((a, b) => {
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
    // Insert an ad after every 4 posts, using ascending ad index (wrap around if more posts than ads)
    if ((index + 1) % 4 === 0) {
      const adIndex = Math.floor((index + 1) / 4) - 1
      acc.push(adCards[adIndex % adCards.length])
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
    <div className="p-8 bg-gray-50 min-h-screen dark:bg-gray-900">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl mx-auto">

      <Layout>
        <div className="max-w-7xl mx-auto">
        <header className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 dark:text-white">Cybersecurity Community</h1>
          <p className="text-gray-600 dark:text-gray-300">Join the conversation, share your insights, and connect with fellow cybersecurity enthusiasts.</p>
      </header>

          <div className="mb-8 flex flex-col gap-4 mt-8">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search the community..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 px-4 pr-12 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-400 transition duration-300 ease-in-out dark:text-white dark:placeholder-gray-400"
                style={{ boxShadow: 'none' }}
              />
              <MagnifyingGlassIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 dark:text-gray-500" />
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex">
                <Button
                  variant="outline"
                  onClick={() => setShowFilterInput(!showFilterInput)}
                  className="gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                  style={{ boxShadow: 'none' }}
                >
                  <AdjustmentsHorizontalIcon className="h-6 w-6 mr-2" />
                  Filters
                </Button>
                {showFilterInput && (
              <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-r-xl">
                <Input
                type="text"
                value={filterInput}
                onChange={(e) => setFilterInput(e.target.value)}
                onKeyPress={handleFilterInput}
                  placeholder="Filter by tags (press Enter)"
                  className="w-64 py-3 px-4 rounded-r-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-300 dark:text-white"
                  style={{ boxShadow: 'none' }}
              />
            </div>
          )}
              </div>
              <Button
                variant={sortBy === "recent" ? "default" : "outline"}
                onClick={() => setSortBy("recent")}
                className={`gap-2 ${sortBy === "recent" 
                  ? "bg-violet-600 text-white hover:bg-violet-700" 
                  : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
                style={{ boxShadow: 'none' }}
              >
                <Clock className="w-4 h-4" />
                Recent
              </Button>
              <Button
                variant={sortBy === "trending" ? "default" : "outline"}
                onClick={() => setSortBy("trending")}
                className={`gap-2 ${sortBy === "trending" 
                  ? "bg-violet-600 text-white hover:bg-violet-700" 
                  : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
                style={{ boxShadow: 'none' }}
              >
                <TrendingUp className="w-4 h-4" />
                Trending
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {filterTags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-violet-500 dark:bg-violet-600 text-white text-sm flex items-center" style={{ boxShadow: 'none' }}>
                  {tag}
                  <button onClick={() => removeTag(tag)} className="ml-2 focus:outline-none hover:text-gray-200">
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          {error && (
            <div className="text-red-600 dark:text-red-400 text-center mb-4 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800" style={{ boxShadow: 'none' }}>
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
                      showTruncated={true}
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500 dark:border-violet-400 mx-auto"></div>
            </div>
          )}

          {!loading && hasMore && (
            <div className="text-center mt-8">
              <Button onClick={loadMore} variant="outline" className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700" style={{ boxShadow: 'none' }}>
                Load More
              </Button>
            </div>
          )}
        </div>
      </Layout>
      </motion.div>
    </div>
  )
}
