"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/app/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { deletePost } from "@/app/services/api"
import { Share2, ExternalLink, Trash2, MessageCircle, Heart, Bookmark, Zap, ThumbsDown } from "lucide-react"
import { getUserProfile, type Post } from "@/app/services/api"
import { toast } from "sonner"

export default function Sharings() {
  const { user } = useAuth()
  const [userPosts, setUserPosts] = useState<Post[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user?.username) {
      fetchUserPosts()
    }
  }, [user])

  const fetchUserPosts = async () => {
    try {
      if (!user?.username) return
      
      const profileData = await getUserProfile(user.username)
      setUserPosts(profileData.posts || [])
    } catch (error) {
      toast.error("Failed to fetch your posts. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deletePost(id)
      setUserPosts((prev) => prev.filter((item) => item.id !== id))
      toast.success("Post deleted successfully.")
    } catch (error) {
      toast.error("Failed to delete post. Please try again later.")
    }
  }

  const filteredPosts = userPosts.filter(
    (post) =>
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.post_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold dark:text-white">Your Posts</h3>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-purple-400"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-green-500/10 rounded-lg">
          <Share2 className="w-6 h-6 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold py-2 text-gray-800 dark:text-white">Your Posts</h2>
      </div>
      <Input
        placeholder="Search Your Posts.."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600 dark:placeholder-gray-400"
        style={{ boxShadow: 'none' }}
      />
      {filteredPosts.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 p-8">
          {searchQuery ? "No posts match your search." : "You haven't shared any posts yet."}
        </div>
      ) : (
        filteredPosts.map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg"
            style={{ boxShadow: 'none' }}
          >
            <div className="flex items-center space-x-4">
              <Share2 className="text-green-500" />
              <div>
                <h4 className="font-medium dark:text-white">{post.title || "Untitled Post"}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                  {post.content}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {post.post_type} • Posted on {formatDate(post.created_at)}
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {post.tags?.map((tag: string) => (
                    <span key={tag} className="text-xs bg-gray-200 dark:bg-slate-700 dark:text-gray-300 px-2 py-1 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
                {/* Reactions row */}
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 py-2">
                  <div className="flex items-center gap-4">
                    {/* Reaction Icons with Individual Counts */}
                    <div className="flex items-center gap-1 text-violet-600">
                      <Zap className="w-4 h-4" />
                      <span>{post.reactions?.Thunder || 0}</span>
                    </div>
                    <div className="flex items-center gap-1 text-red-600">
                      <Heart className="w-4 h-4" />
                      <span>{post.reactions?.Love || 0}</span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-600">
                      <ThumbsDown className="w-4 h-4" />
                      <span>{post.reactions?.Dislike || 0}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="w-4 h-4" />
                      <span>{post.shares_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bookmark className="w-4 h-4" />
                      <span>{post.saves_count}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" asChild className="dark:text-gray-300 dark:hover:bg-slate-700">
                <a href={`/community/post/${post.id}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View
                </a>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(post.id)} className="dark:text-gray-300 dark:hover:bg-slate-700">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
