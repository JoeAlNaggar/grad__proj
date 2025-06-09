"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Lightbulb, Wrench, ArrowRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Tools data
const tools = [
  {
    id: 1,
    title: "Network Scanner",
    description: "Scan your network for vulnerabilities and potential threats",
    image: "/placeholder.svg?height=200&width=200",
    color: "#4361ee",
    link: "/toolkit/network-scanning",
    icon: "/placeholder.svg?height=48&width=48",
  },
  {
    id: 2,
    title: "Web Vulnerability Scanner",
    description: "Identify and assess vulnerabilities in your web applications",
    image: "/placeholder.svg?height=200&width=200",
    color: "#3a0ca3",
    link: "/toolkit/web-vulnerability",
    icon: "/placeholder.svg?height=48&width=48",
  },
  {
    id: 3,
    title: "Malware Detection",
    description: "Scan files and URLs for potential malware threats",
    image: "/placeholder.svg?height=200&width=200",
    color: "#7209b7",
    link: "/toolkit/malware-detection",
    icon: "/placeholder.svg?height=48&width=48",
  },
  {
    id: 4,
    title: "Threat Intelligence",
    description: "Get real-time intelligence on potential threats",
    image: "/placeholder.svg?height=200&width=200",
    color: "#f72585",
    link: "/toolkit/threat-intelligence",
    icon: "/placeholder.svg?height=48&width=48",
  },
  {
    id: 5,
    title: "Password Analyzer",
    description: "Check the strength of your passwords and get recommendations",
    image: "/placeholder.svg?height=200&width=200",
    color: "#4cc9f0",
    link: "/toolkit/password-analyzer",
    icon: "/placeholder.svg?height=48&width=48",
  },
]

// Inspiration data
const inspirations = [
  {
    id: 1,
    title: "Zero Trust Architecture",
    description: "Implementing zero trust security models in modern enterprises",
    image: "/placeholder.svg?height=200&width=200",
    color: "#4361ee",
    link: "/innovation/inspiration/zero-trust",
    author: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 2,
    title: "AI in Cybersecurity",
    description: "How artificial intelligence is transforming threat detection",
    image: "/placeholder.svg?height=200&width=200",
    color: "#3a0ca3",
    link: "/innovation/inspiration/ai-cybersecurity",
    author: {
      name: "Samantha Lee",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 3,
    title: "Blockchain Security",
    description: "Securing blockchain applications and smart contracts",
    image: "/placeholder.svg?height=200&width=200",
    color: "#7209b7",
    link: "/innovation/inspiration/blockchain-security",
    author: {
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 4,
    title: "Cloud Security Best Practices",
    description: "Protecting your data and applications in the cloud",
    image: "/placeholder.svg?height=200&width=200",
    color: "#f72585",
    link: "/innovation/inspiration/cloud-security",
    author: {
      name: "Priya Patel",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 5,
    title: "IoT Security Challenges",
    description: "Addressing security concerns in Internet of Things devices",
    image: "/placeholder.svg?height=200&width=200",
    color: "#4cc9f0",
    link: "/innovation/inspiration/iot-security",
    author: {
      name: "David Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
]

export default function InnovationStation() {
  const toolsContainerRef = useRef<HTMLDivElement>(null)
  const inspirationsContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const toolsContainer = toolsContainerRef.current
    const inspirationsContainer = inspirationsContainerRef.current

    if (toolsContainer) {
      const scrollTools = () => {
        if (toolsContainer.scrollLeft >= toolsContainer.scrollWidth / 2) {
          toolsContainer.scrollLeft = 0
        } else {
          toolsContainer.scrollLeft += 1
        }
      }

      const toolsInterval = setInterval(scrollTools, 30)
      return () => clearInterval(toolsInterval)
    }

    if (inspirationsContainer) {
      const scrollInspirations = () => {
        if (inspirationsContainer.scrollLeft >= inspirationsContainer.scrollWidth / 2) {
          inspirationsContainer.scrollLeft = 0
        } else {
          inspirationsContainer.scrollLeft += 1
        }
      }

      const inspirationsInterval = setInterval(scrollInspirations, 30)
      return () => clearInterval(inspirationsInterval)
    }
  }, [])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md">
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Wrench className="w-6 h-6 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tool Station</h2>
          </div>
          <Link href="/toolkit" className="flex items-center gap-1 text-blue-500 hover:text-blue-600 transition-colors">
            <span>View all tools</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div
          ref={toolsContainerRef}
          className="flex overflow-x-auto scrollbar-hide gap-4 pb-4"
          style={{ scrollBehavior: "smooth" }}
        >
          {/* Duplicate tools for infinite scroll effect */}
          {[...tools, ...tools].map((tool, index) => (
            <Link
              key={`${tool.id}-${index}`}
              href={tool.link}
              className="flex-shrink-0 w-64 bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all hover:scale-105"
            >
              <div className="h-2 w-full" style={{ backgroundColor: tool.color }}></div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-full mr-4`} style={{ backgroundColor: `${tool.color}20` }}>
                    <Image
                      src={tool.icon || "/placeholder.svg"}
                      alt={tool.title}
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{tool.title}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{tool.description}</p>
                <div className="flex justify-end">
                  <span className="text-blue-600 dark:text-blue-400 hover:underline">Launch Tool →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Lightbulb className="w-6 h-6 text-purple-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Inspiration Station</h2>
          </div>
          <Link
            href="/innovation/inspiration"
            className="flex items-center gap-1 text-purple-500 hover:text-purple-600 transition-colors"
          >
            <span>View all inspirations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div
          ref={inspirationsContainerRef}
          className="flex overflow-x-auto scrollbar-hide gap-4 pb-4"
          style={{ scrollBehavior: "smooth" }}
        >
          {/* Duplicate inspirations for infinite scroll effect */}
          {[...inspirations, ...inspirations].map((inspiration, index) => (
            <Link
              key={`${inspiration.id}-${index}`}
              href={inspiration.link}
              className="flex-shrink-0 w-64 bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all hover:scale-105"
            >
              <div className="h-32 relative" style={{ backgroundColor: inspiration.color }}>
                <Image
                  src={inspiration.image || "/placeholder.svg"}
                  alt={inspiration.title}
                  fill
                  className="object-cover mix-blend-overlay"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{inspiration.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{inspiration.description}</p>
                <div className="flex items-center mt-2">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={inspiration.author.avatar} alt={inspiration.author.name} />
                    <AvatarFallback>{inspiration.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{inspiration.author.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
