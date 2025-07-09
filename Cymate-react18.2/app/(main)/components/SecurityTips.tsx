"use client"

import type React from "react"

import { useState } from "react"
import { Shield, Key, Lock, AlertTriangle, Trash2, Plus, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// Define the tip type
type SecurityTip = {
  id: string
  category: string
  title: string
  description: string
  icon: any
  color: string
  decoration: string
  backgroundImage?: string
}

// Initial tips data
const initialTips = [
  {
    id: "1",
    category: "AUTHENTICATION",
    title: "Password Security",
    description: "Use strong, unique passwords with special characters",
    icon: Key,
    color: "bg-[#00DC82]",
    decoration: "circles",
  },
  {
    id: "2",
    category: "PROTECTION",
    title: "Two-Factor Auth",
    description: "Enable 2FA on all your accounts",
    icon: Lock,
    color: "bg-[#0066FF]",
    decoration: "waves",
  },
  {
    id: "3",
    category: "AWARENESS",
    title: "Phishing Defense",
    description: "Always verify suspicious emails",
    icon: AlertTriangle,
    color: "bg-[#1C1C1C]",
    decoration: "lines",
  },
]

// Map category to icon
const categoryIcons: Record<string, any> = {
  AUTHENTICATION: Key,
  PROTECTION: Lock,
  AWARENESS: AlertTriangle,
}

// Map for decoration types
const decorationTypes = ["circles", "waves", "lines"]

// Predefined colors for tips
const tipColors = ["bg-[#00DC82]", "bg-[#0066FF]", "bg-[#1C1C1C]", "bg-[#6E56CF]", "bg-[#FF3366]", "bg-[#FF9500]"]

export default function SecurityTips() {
  const [tips, setTips] = useState<SecurityTip[]>(initialTips)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTip, setNewTip] = useState({
    category: "",
    title: "",
    description: "",
    backgroundImage: "",
  })

  // Delete a tip
  const deleteTip = (id: string) => {
    setTips(tips.filter((tip) => tip.id !== id))
  }

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewTip({
      ...newTip,
      [name]: value,
    })
  }

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewTip({
          ...newTip,
          backgroundImage: reader.result as string,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  // Add new tip
  const addNewTip = () => {
    if (newTip.category && newTip.title && newTip.description) {
      const icon = categoryIcons[newTip.category] || AlertTriangle
      const randomColor = tipColors[Math.floor(Math.random() * tipColors.length)]

      const newTipObject: SecurityTip = {
        id: Date.now().toString(),
        category: newTip.category,
        title: newTip.title,
        description: newTip.description,
        icon: icon,
        color: randomColor,
        decoration: decorationTypes[Math.floor(Math.random() * decorationTypes.length)],
        backgroundImage: newTip.backgroundImage || undefined,
      }

      setTips([...tips, newTipObject])
      setNewTip({
        category: "",
        title: "",
        description: "",
        backgroundImage: "",
      })
      setShowAddForm(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-purple-500" />
          <h2 className="text-2xl font-bold">Security Tips</h2>
        </div>
        {/* <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowAddForm(!showAddForm)}
          className="rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/20"
        >
          <Plus className="w-5 h-5 text-purple-500" />
        </Button> */}
      </div>

      {/* Add New Tip Form */}
      {/* {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Add New Security Tip</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Background Image</label>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                  <Input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
                {newTip.backgroundImage && <span className="text-sm text-green-500">Image uploaded</span>}
              </div>
              {newTip.backgroundImage && (
                <div className="mt-2 relative w-full h-20 rounded-md overflow-hidden">
                  <img
                    src={newTip.backgroundImage || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <Input
                name="category"
                value={newTip.category}
                onChange={handleInputChange}
                placeholder="AUTHENTICATION, PROTECTION, AWARENESS..."
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input
                name="title"
                value={newTip.title}
                onChange={handleInputChange}
                placeholder="Two-Factor Auth, Phishing Defense..."
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                name="description"
                value={newTip.description}
                onChange={handleInputChange}
                placeholder="Use strong, unique passwords with special characters..."
                className="w-full"
                rows={2}
              />
            </div>

            <Button
              onClick={addNewTip}
              className="w-full relative overflow-hidden bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-md transition-all duration-300 shadow-[0_0_0_3px_#6E56CF33]"
            >
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiPjwvcmVjdD4KPC9zdmc+')] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]"></div>
              </div>
              <span className="relative z-10">Publish Tip</span>
            </Button>
          </div>
        </div>
      )} */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tips.map((tip) => (
          <div
            key={tip.id}
            className={`relative overflow-hidden ${tip.backgroundImage ? "" : tip.color} rounded-xl p-6 h-[200px] transition-transform hover:scale-[1.02] group`}
            style={{
              backgroundImage: tip.backgroundImage ? `url(${tip.backgroundImage})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Overlay for text visibility on image backgrounds */}
            {tip.backgroundImage && <div className="absolute inset-0 bg-black/40"></div>}

            {/* Delete Button */}
            {/* <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteTip(tip.id)}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity z-20"
            >
              <Trash2 className="w-4 h-4" />
            </Button> */}

            {/* Decorative Background Elements */}
            {tip.decoration === "circles" && (
              <>
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full border-2 border-white/10 transform translate-x-16 -translate-y-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full border-2 border-white/10 transform -translate-x-12 translate-y-12" />
              </>
            )}
            {tip.decoration === "waves" && (
              <div className="absolute bottom-0 right-0 w-64 h-64">
                <svg viewBox="0 0 200 200" className="w-full h-full text-white/10">
                  <path fill="currentColor" d="M 0 100 Q 50 0 100 100 T 200 100 V 200 H 0 Z" />
                </svg>
              </div>
            )}
            {tip.decoration === "lines" && (
              <div className="absolute inset-0">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute h-px bg-white/10 w-full transform -rotate-45"
                    style={{ top: `${i * 40}%`, left: `${i * 20}%` }}
                  />
                ))}
              </div>
            )}

            {/* Content */}
            <div className="relative z-10 text-white">
              <div className="text-sm font-medium opacity-60 mb-2">{tip.category}</div>
              <h3 className="text-2xl font-bold mb-3">{tip.title}</h3>
              <p className="text-sm opacity-80">{tip.description}</p>
              <tip.icon className="absolute top-6 right-6 w-6 h-6 opacity-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
