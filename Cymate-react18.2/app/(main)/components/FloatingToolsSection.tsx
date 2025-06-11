"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Shield, Wifi, Bug, Search, AlertTriangle, Globe, Lock, Server, FileCode } from "lucide-react"
import { Card } from "@/components/ui/card"

const tools = [
  // Network Scanning Tools
  {
    id: 1,
    name: "Port Scanning",
    description: "Identify open, closed, or filtered ports on target systems",
    icon: Wifi,
    href: "/toolkit/network-scanning",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    name: "Vulnerability Scanning",
    description: "Scan for potential vulnerabilities in services and ports",
    icon: AlertTriangle,
    href: "/toolkit/network-scanning",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: 3,
    name: "Service Detection",
    description: "Discover services running on open ports",
    icon: Search,
    href: "/toolkit/network-scanning",
    gradient: "from-blue-500 to-cyan-500",
  },
  // Malware Detection Tools
  {
    id: 4,
    name: "File Analysis",
    description: "Scan local files for potential malware threats",
    icon: FileCode,
    href: "/toolkit/malware-detection",
    gradient: "from-red-500 to-orange-500",
  },
  {
    id: 5,
    name: "URL Scan",
    description: "Analyze URLs for malicious content",
    icon: Globe,
    href: "/toolkit/malware-detection",
    gradient: "from-red-500 to-orange-500",
  },
  // Web Vulnerability Tools
  {
    id: 6,
    name: "Broken Access Control",
    description: "Detect improper enforcement of access controls",
    icon: Lock,
    href: "/toolkit/web-vulnerability",
    gradient: "from-green-500 to-teal-600",
  },
  {
    id: 7,
    name: "Cryptographic Failures",
    description: "Identify weak or improperly implemented cryptographic techniques",
    icon: Shield,
    href: "/toolkit/web-vulnerability",
    gradient: "from-green-500 to-teal-600",
  },
  {
    id: 8,
    name: "Injection Flaws",
    description: "Detect SQL, NoSQL, OS, and LDAP injection vulnerabilities",
    icon: Bug,
    href: "/toolkit/web-vulnerability",
    gradient: "from-green-500 to-teal-600",
  },
  {
    id: 9,
    name: "Security Misconfiguration",
    description: "Identify configuration weaknesses and unnecessary features",
    icon: Server,
    href: "/toolkit/web-vulnerability",
    gradient: "from-green-500 to-teal-600",
  },
  // Threat Intelligence Tools
  {
    id: 10,
    name: "Threat Analysis",
    description: "Analyze and understand potential threats to your systems",
    icon: Search,
    href: "/toolkit/threat-intelligence",
    gradient: "from-yellow-400 to-amber-600",
  },
]

export function FloatingToolsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tools.length)
    }, 4000) // Slowed down to 4 seconds (2 times slower)
    return () => clearInterval(timer)
  }, [])

  const currentTool = tools[currentIndex]
  const nextIndex = (currentIndex + 1) % tools.length
  const prevIndex = (currentIndex - 1 + tools.length) % tools.length

  return (
    <div className="w-full py-8">
      <h2 className="text-2xl font-bold mb-6">Toolkit Vault</h2>
      <div className="relative h-[300px] w-full flex items-center justify-center">
        {/* Previous Card */}
        <motion.div
          className="absolute left-[15%] z-10 opacity-50 scale-75 transform -rotate-12"
          animate={{ x: 0 }}
          initial={{ x: -100 }}
          exit={{ x: -100 }}
        >
          <ToolCard tool={tools[prevIndex]} isActive={false} />
        </motion.div>

        {/* Current Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTool.id}
            className="absolute z-20"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ToolCard tool={currentTool} isActive={true} />
          </motion.div>
        </AnimatePresence>

        {/* Next Card */}
        <motion.div
          className="absolute right-[15%] z-10 opacity-50 scale-75 transform rotate-12"
          animate={{ x: 0 }}
          initial={{ x: 100 }}
          exit={{ x: 100 }}
        >
          <ToolCard tool={tools[nextIndex]} isActive={false} />
        </motion.div>
      </div>
    </div>
  )
}

function ToolCard({ tool, isActive }: { tool: (typeof tools)[0]; isActive: boolean }) {
  return (
    <Link href={tool.href}>
      <Card
        className={`
        relative w-[300px] h-[200px] p-6 cursor-pointer
        transition-all duration-300 group
        hover:scale-105 hover:shadow-xl
        ${isActive ? "shadow-lg transform scale-110" : ""}
      `}
      >
        {/* Gradient Overlay */}
        <div
          className={`
          absolute inset-0 opacity-20 rounded-lg
          bg-gradient-to-br ${tool.gradient}
          group-hover:opacity-30 transition-opacity
          ${isActive ? "shadow-[0_0_30px_rgba(0,0,0,0.2)]" : ""}
        `}
        />

        {/* Glowing Effect for Active Card */}
        {isActive && (
          <div
            className={`
            absolute inset-0 rounded-lg
            animate-pulse opacity-30
            bg-gradient-to-br ${tool.gradient}
            filter blur-xl
          `}
          />
        )}

        <div className="relative z-10">
          <tool.icon className="w-10 h-10 mb-4" />
          <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
          <p className="text-sm text-muted-foreground">{tool.description}</p>
        </div>
      </Card>
    </Link>
  )
}
