"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/contexts/AuthContext"
import Layout from "../community/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Upload, Image } from "lucide-react"
import { createPost } from "@/app/services/api"
import { toast } from "sonner"

export default function CreatePage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [postType, setPostType] = useState<"post" | "blog" | "question" | "event">("post")
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Handle adding tags
  const addTag = () => {
    const tag = currentTag.trim().toLowerCase()
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
      setCurrentTag("")
    }
  }

  // Handle removing tags
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  // Handle key press for adding tags
  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("Please select a valid image file")
        return
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("Image file size must be less than 10MB")
        return
      }
      
      setSelectedImage(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setError(null)
    }
  }

  // Remove selected image
  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      setError("Title is required")
      return
    }
    
    if (!content.trim()) {
      setError("Content is required")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const postData = {
        title: title.trim(),
        content: content.trim(),
        post_type: postType,
        tags: tags,
        image: selectedImage
      }

      const newPost = await createPost(postData)
      
      // Show success toast and redirect to the new post
      toast.success("Post created successfully!", {
        description: "Your post has been published to the community",
        duration: 3000,
      })
      
      // Redirect to the new post page
      router.push(`/community/post/${newPost.id}`)
    } catch (err: any) {
      console.error("Error creating post:", err)
      if (err.response?.status === 401) {
        setError("Authentication required. Please log in again.")
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail)
      } else if (err.response?.data) {
        // Handle validation errors
        const errors = []
        for (const [field, messages] of Object.entries(err.response.data)) {
          if (Array.isArray(messages)) {
            errors.push(`${field}: ${messages.join(", ")}`)
          } else {
            errors.push(`${field}: ${messages}`)
          }
        }
        setError(errors.join(" | "))
      } else {
        setError("Failed to create post. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
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

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    router.push("/login")
    return null
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl mx-auto">

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">Create New Post</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Post Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="post-type" className="text-gray-700 dark:text-gray-300">Post Type</Label>
              <Select value={postType} onValueChange={(value: "post" | "blog" | "question" | "event") => setPostType(value)}>
                <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white" style={{ boxShadow: 'none' }}>
                  <SelectValue placeholder="Select post type" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  <SelectItem value="post">Post</SelectItem>
                  <SelectItem value="blog">Blog</SelectItem>
                  <SelectItem value="question">Question</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your post title..."
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-purple-300 dark:focus:ring-purple-300"
                style={{ boxShadow: 'none' }}
                required
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content" className="text-gray-700 dark:text-gray-300">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind? Share your thoughts, experiences, or questions..."
                rows={8}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-purple-300 dark:focus:ring-purple-300 resize-none whitespace-pre-wrap"
                style={{ boxShadow: 'none' }}
                required
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image" className="text-gray-700 dark:text-gray-300">Image (Optional)</Label>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:cursor-pointer"
                    style={{ boxShadow: 'none' }}
                  />
                </div>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-sm max-h-64 rounded-lg border border-gray-300 dark:border-gray-600 object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={removeImage}
                      className="absolute top-2 right-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-gray-700 dark:text-gray-300">Tags</Label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={handleTagKeyPress}
                    placeholder="Add a tag..."
                    className="flex-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-purple-300 dark:focus:ring-purple-300"
                    style={{ boxShadow: 'none' }}
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    disabled={!currentTag.trim()}
                    variant="outline"
                    size="sm"
                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Display current tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm flex items-center"
                        style={{ boxShadow: 'none' }}
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-purple-200 focus:outline-none"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-800 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                disabled={isSubmitting || !content.trim() || !title.trim() || !tags.length}
                className="px-8 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full transition-all duration-300"
                style={{ boxShadow: 'none' }}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </div>
                ) : (
                  "Create Post"
                )}
              </Button>
            </div>
          </form>
        </div>
        </motion.div>
      </div>
    </Layout>
  )
}
