"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Share2, ExternalLink, Trash2 } from "lucide-react"

const dummySharings = [
  { id: 1, title: "10 Tips for Better Password Security", date: "2024-01-18", tags: ["passwords", "security-tips"] },
  { id: 2, title: "Cybersecurity Trends 2024", date: "2024-01-25", tags: ["trends", "industry-news"] },
  {
    id: 3,
    title: "How to Protect Your Business from Ransomware",
    date: "2024-02-05",
    tags: ["ransomware", "business-security"],
  },
  { id: 4, title: "The Importance of Two-Factor Authentication", date: "2024-02-12", tags: ["2fa", "authentication"] },
  { id: 5, title: "Cybersecurity for Remote Work", date: "2024-02-20", tags: ["remote-work", "best-practices"] },
]

export default function Sharings() {
  const [sharings, setSharings] = useState(dummySharings)
  const [searchQuery, setSearchQuery] = useState("")

  const handleDelete = (id: number) => {
    setSharings(sharings.filter((item) => item.id !== id))
  }

  const filteredSharings = sharings.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Your Sharings</h3>
      <Input
        placeholder="Search sharings..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4"
      />
      {filteredSharings.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
        >
          <div className="flex items-center space-x-4">
            <Share2 className="text-green-500" />
            <div>
              <h4 className="font-medium">{item.title}</h4>
              <p className="text-sm text-gray-500">Shared on CyMate • {item.date}</p>
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
            <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
