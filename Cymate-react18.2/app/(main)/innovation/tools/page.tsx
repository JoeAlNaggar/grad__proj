"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Search,
  Download,
  ExternalLink,
  X,
  ChevronRight,
  MoveHorizontalIcon as AdjustmentsHorizontalIcon,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "@/lib/hooks/use-toast"
import { cn } from "@/lib/utils"

interface Tool {
  id: number
  name: string
  description: string
  image: string
  tags: string[]
  pricingModel: "Free" | "Paid" | "Freemium" | "Free Trial"
  launchUrl: string
}

const tools: Tool[] = [
  {
    id: 1,
    name: "VirusTotal",
    description: "Cloud-based malware scanner that analyzes suspicious files and URLs",
    image: "/placeholder.svg?height=200&width=300",
    tags: ["Malware Analysis", "Threat Intelligence"],
    pricingModel: "Freemium",
    launchUrl: "https://www.virustotal.com/",
  },
  {
    id: 2,
    name: "Wireshark",
    description: "Popular network protocol analyzer for network troubleshooting and analysis",
    image: "/placeholder.svg?height=200&width=300",
    tags: ["Network Analysis", "Packet Capture"],
    pricingModel: "Free",
    launchUrl: "https://www.wireshark.org/",
  },
  {
    id: 3,
    name: "Symantec Endpoint Protection",
    description: "A comprehensive premium solution for endpoint security and threat prevention",
    image: "/placeholder.svg?height=200&width=300",
    tags: ["Endpoint Security", "Threat Prevention"],
    pricingModel: "Paid",
    launchUrl: "https://www.broadcom.com/products/cybersecurity/endpoint",
    },
  {
    id: 4,
    name: "Metasploit",
    description: "Advanced open-source platform for developing, testing, and executing exploit code",
    image: "/placeholder.svg?height=200&width=300",
    tags: ["Penetration Testing", "Exploit Development"],
    pricingModel: "Freemium",
    launchUrl: "https://www.metasploit.com/",
  },
  {
    id: 5,
    name: "Nmap",
    description: "Network scanner used to discover hosts, services, and vulnerabilities",
    image: "/placeholder.svg?height=200&width=300",
    tags: ["Network Scanning", "Security Auditing"],
    pricingModel: "Free",
    launchUrl: "https://nmap.org/",
  },
  {
    id: 6,
    name: "Burp Suite",
    description: "Integrated platform for performing security testing of web applications",
    image: "/placeholder.svg?height=200&width=300",
    tags: ["Web Security", "Penetration Testing"],
    pricingModel: "Freemium",
    launchUrl: "https://portswigger.net/burp",
  },
  {
    id: 7,
    name: "OWASP ZAP",
    description: "Open-source web application security scanner",
    image: "/placeholder.svg?height=200&width=300",
    tags: ["Web Security", "Vulnerability Scanning"],
    pricingModel: "Free",
    launchUrl: "https://www.zaproxy.org/",
  },
  {
    id: 8,
    name: "Snort",
    description: "Open-source intrusion prevention system capable of real-time traffic analysis",
    image: "/placeholder.svg?height=200&width=300",
    tags: ["Intrusion Detection", "Network Security"],
    pricingModel: "Free",
    launchUrl: "https://www.snort.org/",
  },
  {
    id: 9,
    name: "Aircrack-ng",
    description: "Network software suite for auditing wireless networks",
    image: "/placeholder.svg?height=200&width=300",
    tags: ["Wireless Security", "Password Cracking"],
    pricingModel: "Free",
    launchUrl: "https://www.aircrack-ng.org/",
  },
  
]

export default function ToolStation() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null)
  const [showFilterInput, setShowFilterInput] = useState(false)
  const [filterTags, setFilterTags] = useState<string[]>([])
  const [filterInput, setFilterInput] = useState("")
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilterInput(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleFilterInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filterInput.trim() !== "") {
      setFilterTags([...filterTags, filterInput.trim().toLowerCase()])
      setFilterInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFilterTags(filterTags.filter((tag) => tag !== tagToRemove))
  }

  const filteredTools = tools.filter(
    (tool) =>
      (searchQuery === "" ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filterTags.length === 0 ||
        filterTags.every((tag) => tool.tags.some((toolTag) => toolTag.toLowerCase().includes(tag)))),
  )


  return (
    <div className="p-8 space-y-8 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 dark:text-white">Tools Station</h1>
          <p className="text-gray-600 dark:text-gray-300">Connect with top cybersecurity tools from trusted partners to enhance your digital security.</p>
        </header>
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Input
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 px-4 pr-12 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-300 transition duration-300 ease-in-out dark:text-white"
              style={{ boxShadow: 'none' }}
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="relative flex items-center" ref={filterRef}>
              <Button
                onClick={() => setShowFilterInput(!showFilterInput)}
                className="flex items-center justify-center py-3 px-6 rounded-l-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300 ease-in-out"
                style={{ boxShadow: 'none' }}
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
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
            <div className="flex flex-wrap gap-2 mt-2">
              {filterTags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-2 py-1 rounded-full bg-purple-500 text-white text-sm flex items-center"
                >
                  {tag}
                  <button onClick={() => removeTag(tag)} className="ml-1 focus:outline-none">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredTools.map((tool) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105"
              style={{
                boxShadow: "none",
              }}
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{tool.name}</h3>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={cn({
                        "bg-green-500/20 text-green-600": tool.pricingModel === "Free",
                        "bg-yellow-500/20 text-yellow-600":
                          tool.pricingModel === "Freemium" || tool.pricingModel === "Free Trial",
                        "bg-red-500/20 text-red-600": tool.pricingModel === "Paid",
                      })}
                    >
                      {tool.pricingModel}
                    </Badge>
                    {/* <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => handleDownload(tool)}
                    >
                      <Download className="w-4 h-4" />
                    </Button> */}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 line-clamp-3">{tool.description}</p>
                <div className="flex flex-wrap gap-2">
                  {tool.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="border-gray-400 dark:border-gray-600">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button
                  onClick={() => setSelectedTool(tool)}
                  className="bg-purple-500 hover:bg-purple-600 text-white rounded-full px-6 py-2  transition-all duration-300"
                  style={{
                    boxShadow: "none",
                  }}
                >
                  Launch Tool <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedTool} onOpenChange={() => setSelectedTool(null)}>
        <DialogContent className="bg-gray-100 dark:bg-gray-800 rounded-2xl  p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
              {selectedTool?.name}
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300">
              Are you sure you want to launch this tool? You will be redirected to an external website.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setSelectedTool(null)}
              className="border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full px-6 py-2"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                window.open(selectedTool?.launchUrl, "_blank")
                setSelectedTool(null)
              }}
              className="bg-purple-500 hover:bg-purple-600 text-white rounded-full px-6 py-2  transition-all duration-300"
            >
              Launch Tool
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
