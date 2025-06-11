"use client"

import { useState } from "react"
import { ImageIcon, Video, Calendar, HelpCircle, FileText, Send } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const postTypes = [
  { id: "post", label: "Post", icon: FileText },
  { id: "blog", label: "Blog", icon: FileText },
  { id: "event", label: "Event", icon: Calendar },
  { id: "question", label: "Question", icon: HelpCircle },
]

export function PostCreator() {
  const [content, setContent] = useState("")
  const [postType, setPostType] = useState("post")

  const handleSubmit = () => {
    // Handle post submission
    console.log({ content, postType })
    setContent("")
  }

  return (
    <div className="bg-white dark:bg-gray-800/30 backdrop-filter backdrop-blur-lg border border-white/20 dark:border-white/10 rounded-xl p-4 space-y-4">
      <div className="flex items-start gap-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-4">
          <Select defaultValue={postType} onValueChange={setPostType}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select post type" />
            </SelectTrigger>
            <SelectContent>
              {postTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  <div className="flex items-center gap-2">
                    <type.icon className="w-4 h-4" />
                    <span>{type.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea
            placeholder="Share your thoughts with the community..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </div>
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <ImageIcon className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="w-5 h-5" />
          </Button>
        </div>
        <Button onClick={handleSubmit} className="gap-2">
          <Send className="w-4 h-4" />
          Share
        </Button>
      </div>
    </div>
  )
}
