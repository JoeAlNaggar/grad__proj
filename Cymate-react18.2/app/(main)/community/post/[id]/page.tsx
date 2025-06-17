"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/app/contexts/AuthContext"
import Layout from "../../components/layout"
import Card from "../../components/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertCircle } from "lucide-react"
import { getPostDetails, type Post } from "@/app/services/api"
import { toast } from "sonner"

export default function PostDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Only fetch post if user is authenticated and auth loading is complete
    if (!authLoading && isAuthenticated && id) {
      fetchPost()
    } else if (!authLoading && !isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = '/login'
    }
  }, [id, authLoading, isAuthenticated])

  const fetchPost = async () => {
    try {
      setLoading(true)
      setError(null)
      const postData = await getPostDetails(id as string)
      setPost(postData)
    } catch (err: any) {
      console.error('Error fetching post:', err)
      if (err.response?.status === 404) {
        setError('Post not found')
      } else if (err.response?.status === 401) {
        setError('Authentication required. Please log in again.')
        setTimeout(() => {
          window.location.href = '/login'
        }, 2000)
      } else {
        setError('Failed to load post. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handlePostUpdate = (updatedPost: Post) => {
    setPost(updatedPost)
  }

  const handleShare = async () => {
    try {
      const postUrl = `${window.location.origin}/community/post/${id}`
      await navigator.clipboard.writeText(postUrl)
      
      toast.success("Post link copied to clipboard!", {
        description: "You can now share this post with others",
        duration: 3000,
        action: {
          label: "Open in New Tab",
          onClick: () => window.open(postUrl, '_blank'),
        },
      })
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      toast.error("Failed to copy link", {
        description: "Please try again",
        duration: 3000,
      })
    }
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
      <div className="max-w-4xl mx-auto">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          {post && (
            <Button
              variant="outline"
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              Share Post
            </Button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading post...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex gap-4">
              <Button onClick={() => router.push('/community')} variant="outline">
                Back to Community
              </Button>
              <Button onClick={fetchPost}>
                Try Again
              </Button>
            </div>
          </div>
        ) : post ? (
          <div className="space-y-6">
            {/* Main Post */}
            <div className="max-w-2xl mx-auto">
              <Card 
                {...post}
                onUpdate={handlePostUpdate}
              />
            </div>

            {/* Additional Post Information */}
            <div className="max-w-2xl mx-auto bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-30">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Post Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Author:</span>
                  <span className="ml-2 font-medium text-gray-900">{post.author}</span>
                </div>
                <div>
                  <span className="text-gray-600">Post Type:</span>
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    post.post_type === 'blog' ? 'bg-blue-100 text-blue-800' :
                    post.post_type === 'question' ? 'bg-green-100 text-green-800' :
                    post.post_type === 'event' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {post.post_type.charAt(0).toUpperCase() + post.post_type.slice(1)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Created:</span>
                  <span className="ml-2 text-gray-900">{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Engagement:</span>
                  <span className="ml-2 text-gray-900">
                    {post.reacts_count} reactions, {post.comments_count} comments
                  </span>
                </div>
                {post.tags && post.tags.length > 0 && (
                  <div className="col-span-2">
                    <span className="text-gray-600">Tags:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-violet-500 bg-opacity-20 text-violet-800 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {post.trend && (
                  <div className="col-span-2">
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full font-medium">
                      🔥 Trending Post
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Related Posts or Actions */}
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-gray-600 mb-4">Enjoying this post?</p>
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={() => router.push('/community')}
                  variant="outline"
                >
                  Explore More Posts
                </Button>
                <Button 
                  onClick={() => router.push('/create')}
                >
                  Create Your Own Post
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Layout>
  )
} 