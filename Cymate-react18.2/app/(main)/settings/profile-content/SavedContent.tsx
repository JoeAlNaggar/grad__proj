"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bookmark, ExternalLink, Trash2,
  MessageCircle,
  Heart,
  Share2,
  Zap,
  ThumbsDown } from "lucide-react"
import { getSavedPosts, savePost } from "@/app/services/api"
import { toast } from "sonner"

export default function SavedContent() {
  const [savedItems, setSavedItems] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSavedPosts()
  }, [])

  const fetchSavedPosts = async () => {
    try {
      const posts = await getSavedPosts()
      setSavedItems(posts)
    } catch (error) {
      toast.error("Failed to fetch saved posts. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemove = async (id: string) => {
    try {
      await savePost(id)
      setSavedItems((prev) => prev.filter((item) => item.id !== id))
      toast.success("Post removed from saved items.")
    } catch (error) {
      toast.error("Failed to remove post. Please try again later.")
    }
  }

  const filteredItems = savedItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.post_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold dark:text-white">Saved Posts</h3>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-purple-400"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-yellow-500/10 rounded-lg">
            <Bookmark className="w-6 h-6 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold py-2 text-gray-800 dark:text-white">Saved Posts</h2>
        </div>
      <Input
        placeholder="Search Saved Posts.."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600 dark:placeholder-gray-400"
        style={{ boxShadow: 'none' }}
      />
      {filteredItems.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 p-8">
          {searchQuery ? "No saved items match your search." : "No saved items yet."}
        </div>
      ) : (
        filteredItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg"
            style={{ boxShadow: 'none' }}
          >
            <div className="flex items-center space-x-4">
              <Bookmark className="text-yellow-500" />
              <div>
                <h4 className="font-medium dark:text-white">{item.title}</h4>
                {item.author && (
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    {item.author.first_name} {item.author.last_name}
                  </div>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.post_type} • Saved on {formatDate(item.created_at)}
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.tags?.map((tag: string) => (
                    <span key={tag} className="text-xs bg-gray-200 dark:bg-slate-700 dark:text-gray-300 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                {/* Reactions row */}
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 py-2">
                        <div className="flex items-center gap-4">
                          {/* Reaction Icons with Individual Counts */}
                          <div className="flex items-center gap-1 text-violet-600">
                            <Zap className="w-4 h-4" />
                            <span>{item.reactions?.Thunder || 0}</span>
                          </div>
                          <div className="flex items-center gap-1 text-red-600">
                            <Heart className="w-4 h-4" />
                            <span>{item.reactions?.Love || 0}</span>
                          </div>
                          <div className="flex items-center gap-1 text-blue-600">
                            <ThumbsDown className="w-4 h-4" />
                            <span>{item.reactions?.Dislike || 0}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{item.comments_count}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Share2 className="w-4 h-4" />
                            <span>{item.shares_count}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Bookmark className="w-4 h-4" />
                            <span>{item.saves_count}</span>
                          </div>
                        </div>
                        </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" asChild className="dark:text-gray-300 dark:hover:bg-slate-700">
                <a href={`/community/post/${item.id}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View
                </a>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleRemove(item.id)} className="dark:text-gray-300 dark:hover:bg-slate-700">
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
