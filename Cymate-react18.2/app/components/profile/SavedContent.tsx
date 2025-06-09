"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bookmark, ExternalLink, Trash2 } from "lucide-react"

const dummySavedContent = [
  {
    id: 1,
    title: "Advanced Encryption Techniques",
    type: "Article",
    date: "2024-01-15",
    tags: ["encryption", "security"],
  },
  {
    id: 2,
    title: "Cybersecurity Conference 2024",
    type: "Event",
    date: "2024-03-01",
    tags: ["conference", "networking"],
  },
  { id: 3, title: "New Malware Detection Tool", type: "Tool", date: "2024-02-10", tags: ["malware", "detection"] },
  {
    id: 4,
    title: "Zero Trust Architecture Explained",
    type: "Video",
    date: "2024-01-22",
    tags: ["zero-trust", "architecture"],
  },
  {
    id: 5,
    title: "Ethical Hacking Workshop",
    type: "Course",
    date: "2024-02-28",
    tags: ["ethical-hacking", "workshop"],
  },
]

export default function SavedContent() {
  const [savedItems, setSavedItems] = useState(dummySavedContent)
  const [searchQuery, setSearchQuery] = useState("")

  const handleRemove = (id: number) => {
    setSavedItems(savedItems.filter((item) => item.id !== id))
  }

  const filteredItems = savedItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Snacks</h3>
      <Input
        placeholder="Search snacks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4"
      />
      {filteredItems.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
        >
          <div className="flex items-center space-x-4">
            <Bookmark className="text-blue-500" />
            <div>
              <h4 className="font-medium">{item.title}</h4>
              <p className="text-sm text-gray-500">
                {item.type} • Saved on {item.date}
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {item.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              View
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleRemove(item.id)}>
              <Trash2 className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
