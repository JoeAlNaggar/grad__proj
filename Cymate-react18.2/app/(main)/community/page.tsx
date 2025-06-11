"use client"

import type React from "react"

import { useState } from "react"
import Layout from "./components/layout"
import Card from "./components/card"
import AdCard from "./components/ad-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline"
import { TrendingUp, Clock } from "lucide-react"

const dummyData = [
  {
    content:
      "Join our upcoming webinar on 'Advanced Threat Detection Techniques in Cybersecurity'. In this session, we'll dive deep into the latest methodologies and tools used by security professionals to identify and mitigate advanced persistent threats. Our expert panel will discuss machine learning applications in threat detection, behavioral analysis, and the role of AI in modern cybersecurity practices.",
    tags: ["Event", "Cybersecurity", "Webinar"],
    author: {
      name: "Alice Johnson",
      username: "alice_cyber",
      jobTitle: "Senior Security Analyst",
      profileImage: "/placeholder.svg?height=40&width=40",
    },
    reactions: { thunder: 15, love: 30, dislike: 2 },
    views: 250,
    comments: [
      {
        author: "Bob Smith",
        content: "Looking forward to this! Will it cover machine learning applications?",
        reactions: { thunder: 3, love: 5, dislike: 0 },
      },
    ],
    timestamp: "2024-03-15T10:00:00Z",
  },
  {
    content: "New zero-day vulnerability discovered in popular IoT devices. Here's what you need to know:",
    tags: ["Blog", "IoT", "Vulnerability"],
    author: {
      name: "Charlie Brown",
      username: "charlie_sec",
      jobTitle: "IoT Security Researcher",
      profileImage: "/placeholder.svg?height=40&width=40",
    },
    reactions: { thunder: 45, love: 80, dislike: 5 },
    views: 1200,
    comments: [
      {
        author: "Diana Prince",
        content: "Great analysis! Have any patches been released yet?",
        reactions: { thunder: 7, love: 12, dislike: 0 },
      },
    ],
    timestamp: "2024-03-14T14:30:00Z",
  },
  {
    content: "What's your preferred method for secure password storage?",
    tags: ["Question", "Password Security"],
    author: {
      name: "Eva Green",
      username: "eva_secure",
      jobTitle: "Cybersecurity Consultant",
      profileImage: "/placeholder.svg?height=40&width=40",
    },
    reactions: { thunder: 10, love: 25, dislike: 3 },
    views: 500,
    comments: [
      {
        author: "Frank Castle",
        content: "I prefer a combination of password manager and 2FA.",
        reactions: { thunder: 5, love: 8, dislike: 1 },
      },
    ],
    timestamp: "2024-03-13T18:00:00Z",
  },
  {
    content:
      "Check out our latest white paper on 'Implementing Zero Trust Architecture in Enterprise Networks'. This comprehensive guide covers the principles of Zero Trust, practical implementation strategies, and case studies from organizations that have successfully adopted this security model. Learn how to move beyond perimeter-based security and implement a more robust, identity-centric approach to protecting your digital assets.",
    file: "/dummy-whitepaper.pdf",
    tags: ["Post", "Zero Trust", "Enterprise Security"],
    author: {
      name: "George Orwell",
      username: "george_1984",
      jobTitle: "Network Security Architect",
      profileImage: "/placeholder.svg?height=40&width=40",
    },
    reactions: { thunder: 30, love: 50, dislike: 1 },
    views: 800,
    comments: [
      {
        author: "Hank Pym",
        content: "Great resource! Will be sharing this with my team.",
        reactions: { thunder: 4, love: 7, dislike: 0 },
      },
    ],
    timestamp: "2024-03-12T12:45:00Z",
  },
  {
    content:
      "Live demonstration: Ethical hacking techniques to improve your organization's security posture. Join us for a hands-on session where we'll showcase real-world hacking scenarios and teach you how to defend against them. Topics include: network penetration testing, social engineering tactics, and web application security.",
    video: "/dummy-video.mp4",
    tags: ["Event", "Ethical Hacking", "Live Demo"],
    author: {
      name: "Irene Adler",
      username: "irene_hack",
      jobTitle: "Ethical Hacking Instructor",
      profileImage: "/placeholder.svg?height=40&width=40",
    },
    reactions: { thunder: 60, love: 100, dislike: 4 },
    views: 1500,
    comments: [
      {
        author: "John Watson",
        content: "Incredible demo! Can't wait to try these techniques in our next pentest.",
        reactions: { thunder: 10, love: 15, dislike: 0 },
      },
    ],
    timestamp: "2024-03-11T16:15:00Z",
  },
  {
    content:
      "Breaking: Major tech company announces revolutionary AI-powered firewall. Our team of experts is currently analyzing its potential impact on enterprise security. Stay tuned for our in-depth review and recommendations.",
    tags: ["Blog", "AI", "Firewall"],
    author: {
      name: "David Lee",
      username: "david_ai_sec",
      jobTitle: "AI Security Specialist",
      profileImage: "/placeholder.svg?height=40&width=40",
    },
    reactions: { thunder: 80, love: 150, dislike: 5 },
    views: 2000,
    comments: [
      {
        author: "Emma Watson",
        content: "Exciting news! Can't wait to see how this compares to traditional firewalls.",
        reactions: { thunder: 10, love: 20, dislike: 0 },
      },
    ],
    timestamp: "2024-03-10T09:00:00Z",
  },
  {
    content:
      "New research reveals alarming increase in supply chain attacks. We've compiled a comprehensive guide on how to audit your vendors and strengthen your supply chain security.",
    file: "/supply-chain-security-guide.pdf",
    tags: ["Post", "Supply Chain", "Security Audit"],
    author: {
      name: "Fiona Green",
      username: "fiona_audit",
      jobTitle: "Supply Chain Security Auditor",
      profileImage: "/placeholder.svg?height=40&width=40",
    },
    reactions: { thunder: 55, love: 90, dislike: 2 },
    views: 1800,
    comments: [
      {
        author: "George Brown",
        content: "This is crucial information. Thanks for putting this together!",
        reactions: { thunder: 8, love: 15, dislike: 0 },
      },
    ],
    timestamp: "2024-03-09T11:30:00Z",
  },
  {
    content:
      "Upcoming workshop: 'Securing Microservices Architecture'. Learn best practices for implementing security in a distributed system environment.",
    image: "/placeholder.svg?height=200&width=400",
    tags: ["Event", "Microservices", "Workshop"],
    author: {
      name: "Hannah Montana",
      username: "hannah_micro",
      jobTitle: "Cloud Security Architect",
      profileImage: "/placeholder.svg?height=40&width=40",
    },
    reactions: { thunder: 40, love: 75, dislike: 1 },
    views: 1200,
    comments: [
      {
        author: "Ian Malcolm",
        content: "Will this cover service mesh security as well?",
        reactions: { thunder: 5, love: 10, dislike: 0 },
      },
    ],
    timestamp: "2024-03-08T15:00:00Z",
  },
  {
    content:
      "Q&A Session: Ask Me Anything about Quantum Cryptography. I'll be answering your questions live for the next 2 hours!",
    tags: ["Question", "Quantum Cryptography", "AMA"],
    author: {
      name: "Jack Ryan",
      username: "jack_quantum",
      jobTitle: "Quantum Cryptography Researcher",
      profileImage: "/placeholder.svg?height=40&width=40",
    },
    reactions: { thunder: 100, love: 200, dislike: 3 },
    views: 3000,
    comments: [
      {
        author: "Kate Bishop",
        content: "How soon do you think quantum-resistant algorithms will become standard?",
        reactions: { thunder: 15, love: 25, dislike: 0 },
      },
    ],
    timestamp: "2024-03-07T19:45:00Z",
  },
  {
    content:
      "Just released: Our annual 'State of Cybersecurity' report. Download now to get insights on the latest trends, threats, and predictions for the coming year.",
    file: "/cybersecurity-report-2023.pdf",
    tags: ["Post", "Report", "Trends"],
    author: {
      name: "Liam Neeson",
      username: "liam_cyber_intel",
      jobTitle: "Chief Information Security Officer",
      profileImage: "/placeholder.svg?height=40&width=40",
    },
    reactions: { thunder: 200, love: 350, dislike: 10 },
    views: 5000,
    comments: [
      {
        author: "Mia Wallace",
        content: "Always look forward to this report. Thanks for the valuable insights!",
        reactions: { thunder: 20, love: 40, dislike: 0 },
      },
    ],
    timestamp: "2024-03-06T13:30:00Z",
  },
  {
    content:
      "Introducing our new 'Cybersecurity for Beginners' course. Perfect for those looking to start a career in infosec or for non-technical professionals wanting to understand the basics of digital security.",
    tags: ["Post", "Course", "Beginners"],
    author: {
      name: "Nina Simone",
      username: "nina_teach",
      jobTitle: "Cybersecurity Educator",
      profileImage: "/placeholder.svg?height=40&width=40",
    },
    reactions: { thunder: 120, love: 280, dislike: 5 },
    views: 3500,
    comments: [
      {
        author: "Oscar Wilde",
        content: "Is this suitable for complete beginners with no IT background?",
        reactions: { thunder: 8, love: 12, dislike: 0 },
      },
    ],
    timestamp: "2024-03-05T17:00:00Z",
  },
  {
    content:
      "Critical vulnerability found in widely-used VPN service. Patch immediately to prevent potential data breaches.",
    tags: ["Blog", "VPN", "Vulnerability"],
    author: {
      name: "Peter Parker",
      username: "peter_sec",
      jobTitle: "Security Researcher",
      profileImage: "/placeholder.svg?height=40&width=40",
    },
    reactions: { thunder: 300, love: 150, dislike: 2 },
    views: 10000,
    comments: [
      {
        author: "Quentin Beck",
        content: "Has this been disclosed to the vendor? What's the CVE number?",
        reactions: { thunder: 25, love: 30, dislike: 0 },
      },
    ],
    timestamp: "2024-03-04T10:45:00Z",
  },
  {
    content:
      "Join us for a virtual CTF (Capture The Flag) competition next weekend. Test your skills, learn new techniques, and compete for prizes!",
    image: "/placeholder.svg?height=200&width=400",
    tags: ["Event", "CTF", "Competition"],
    author: {
      name: "Rachel Green",
      username: "rachel_ctf",
      jobTitle: "CTF Organizer",
      profileImage: "/placeholder.svg?height=40&width=40",
    },
    reactions: { thunder: 180, love: 320, dislike: 1 },
    views: 4500,
    comments: [
      {
        author: "Sherlock Holmes",
        content: "Excited for this! Will there be both jeopardy-style and attack-defense challenges?",
        reactions: { thunder: 15, love: 22, dislike: 0 },
      },
    ],
    timestamp: "2024-03-03T14:15:00Z",
  },
  {
    content:
      "New study shows alarming rise in ransomware attacks targeting healthcare institutions. We've prepared a comprehensive guide on protecting medical data and critical infrastructure.",
    file: "/healthcare-cybersecurity-guide.pdf",
    tags: ["Post", "Healthcare", "Ransomware", "Data Protection"],
    author: {
      name: "Tony Stark",
      username: "tony_medsec",
      jobTitle: "Healthcare Cybersecurity Specialist",
      profileImage: "/placeholder.svg?height=40&width=40",
    },
    reactions: { thunder: 250, love: 400, dislike: 3 },
    views: 7500,
    comments: [
      {
        author: "Ursula Smith",
        content: "This is crucial information. Are there any specific recommendations for small clinics?",
        reactions: { thunder: 30, love: 45, dislike: 0 },
      },
    ],
    timestamp: "2024-03-02T18:30:00Z",
  },
  {
    content:
      "Exploring the intersection of AI and cybersecurity: How machine learning is revolutionizing threat detection and response. Join our podcast discussion with leading experts in the field.",
    tags: ["Post", "AI", "Machine Learning"],
    author: {
      name: "Victor Frankenstein",
      username: "victor_ai",
      jobTitle: "AI Security Researcher",
      profileImage: "/placeholder.svg?height=40&width=40",
    },
    reactions: { thunder: 150, love: 280, dislike: 8 },
    views: 3200,
    comments: [
      {
        author: "Wendy Darling",
        content: "Fascinating topic! Will you be discussing potential risks of AI in cybersecurity as well?",
        reactions: { thunder: 20, love: 35, dislike: 1 },
      },
    ],
    timestamp: "2024-03-01T11:00:00Z",
  },
]

const adCards = [
  {
    title: "CyberShield Pro",
    description: "Advanced threat protection for your enterprise. Try our 30-day free trial now!",
    imageUrl: "/placeholder.svg?height=150&width=300",
    link: "https://example.com/cybershield-pro",
    tags: ["Ad", "Security", "Enterprise", "Trial"],
  },
  {
    title: "SecureCloud 2023",
    description: "The ultimate conference for cloud security professionals. Early bird tickets available!",
    imageUrl: "/placeholder.svg?height=150&width=300",
    link: "https://example.com/securecloud-2023",
    tags: ["Ad", "Conference", "Cloud Security", "Networking"],
  },
  {
    title: "Quantum-Safe Encryption",
    description: "Prepare for the post-quantum era with our state-of-the-art encryption solutions.",
    imageUrl: "/placeholder.svg?height=150&width=300",
    link: "https://example.com/quantum-safe",
    tags: ["Ad", "Encryption", "Quantum Computing", "Data Protection"],
  },
  {
    title: "CyberAcademy Online",
    description: "Master cybersecurity skills from home. Flexible learning paths for all levels.",
    imageUrl: "/placeholder.svg?height=150&width=300",
    link: "https://example.com/cyber-academy",
    tags: ["Ad", "Education", "Online Learning", "Certification"],
  },
  {
    title: "AI-Powered Threat Intelligence",
    description: "Stay ahead of cyber threats with our AI-driven intelligence platform.",
    imageUrl: "/placeholder.svg?height=150&width=300",
    link: "https://example.com/ai-threat-intel",
    tags: ["Ad", "AI", "Threat Intelligence", "Cybersecurity"],
  },
  {
    title: "SecureCoder Bootcamp",
    description: "Intensive 12-week program to become a certified secure coding expert.",
    imageUrl: "/placeholder.svg?height=150&width=300",
    link: "https://example.com/secure-coder-bootcamp",
    tags: ["Ad", "Training", "Secure Coding", "Certification"],
  },
  {
    title: "PhishGuard Pro",
    description: "Protect your organization from sophisticated phishing attacks. Get a demo today!",
    imageUrl: "/placeholder.svg?height=150&width=300",
    link: "https://example.com/phishguard-pro",
    tags: ["Ad", "Anti-Phishing", "Email Security", "Demo"],
  },
  {
    title: "CyberInsure Plus",
    description: "Comprehensive cyber insurance for businesses of all sizes. Get a quote in minutes.",
    imageUrl: "/placeholder.svg?height=150&width=300",
    link: "https://example.com/cyber-insure",
    tags: ["Ad", "Insurance", "Risk Management", "Business"],
  },
  {
    title: "Blockchain Security Summit",
    description: "Join industry leaders to discuss the future of blockchain security. Register now!",
    imageUrl: "/placeholder.svg?height=150&width=300",
    link: "https://example.com/blockchain-summit",
    tags: ["Ad", "Blockchain", "Conference", "Networking"],
  },
  {
    title: "SecureIoT Platform",
    description: "End-to-end security solution for your IoT devices and networks.",
    imageUrl: "/placeholder.svg?height=150&width=300",
    link: "https://example.com/secure-iot",
    tags: ["Ad", "IoT", "Network Security", "Device Management"],
  },
]

export default function CommunityPage() {
  const [sortBy, setSortBy] = useState<"trending" | "recent">("trending")
  const [showFilterInput, setShowFilterInput] = useState(false)
  const [filterTags, setFilterTags] = useState<string[]>([])
  const [filterInput, setFilterInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const allContent = [...dummyData]

  const handleFilterInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filterInput.trim() !== "") {
      setFilterTags([...filterTags, filterInput.trim().toLowerCase()])
      setFilterInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFilterTags(filterTags.filter((tag) => tag !== tagToRemove))
  }

  const filteredContent = allContent.filter((item) => {
    const matchesTags =
      filterTags.length === 0 || filterTags.every((tag) => item.tags.map((t) => t.toLowerCase()).includes(tag))
    const matchesSearch =
      searchQuery === "" ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesTags && matchesSearch
  })

  const sortedContent = filteredContent.sort((a, b) => {
    if (sortBy === "trending") {
      return b.reactions.thunder + b.reactions.love - (a.reactions.thunder + a.reactions.love)
    } else {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    }
  })

  const contentWithAds = sortedContent.reduce((acc, item, index) => {
    acc.push(item)
    if ((index + 1) % 12 === 0 && adCards[(index / 12) % adCards.length]) {
      acc.push(adCards[(index / 12) % adCards.length])
    }
    return acc
  }, [])

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8 text-center">Cybersecurity Community</h1>

      <div className="mb-8 flex flex-col gap-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search the community..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3 px-4 pr-12 rounded-xl bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg focus:outline-none focus:ring-2 focus:ring-violet-300 transition duration-300 ease-in-out shadow-lg"
          />
          <MagnifyingGlassIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
        </div>
        <div className="flex gap-4 items-center">
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowFilterInput(!showFilterInput)}
              className="flex items-center justify-center py-3 px-6 rounded-xl bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg text-gray-700 font-semibold shadow-lg hover:shadow-xl transition duration-300 ease-in-out"
            >
              <AdjustmentsHorizontalIcon className="h-6 w-6 mr-2" />
              Filters
            </Button>
            {showFilterInput && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg p-4 z-10">
                <Input
                  type="text"
                  value={filterInput}
                  onChange={(e) => setFilterInput(e.target.value)}
                  onKeyPress={handleFilterInput}
                  placeholder="Add tag and press Enter"
                  className="w-full py-2 px-3 rounded-lg bg-white bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-violet-300"
                />
              </div>
            )}
          </div>
          <Button
            variant={sortBy === "trending" ? "default" : "outline"}
            onClick={() => setSortBy("trending")}
            className="gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Trending
          </Button>
          <Button
            variant={sortBy === "recent" ? "default" : "outline"}
            onClick={() => setSortBy("recent")}
            className="gap-2"
          >
            <Clock className="w-4 h-4" />
            Recent
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {filterTags.map((tag, index) => (
            <span key={index} className="px-2 py-1 rounded-full bg-violet-500 text-white text-sm flex items-center">
              {tag}
              <button onClick={() => removeTag(tag)} className="ml-1 focus:outline-none">
                &times;
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
        {contentWithAds.map((item, index) => {
          if (!item) return null // Skip rendering if item is undefined
          return (
            <div key={index} className="break-inside-avoid mb-8">
              {"content" in item ? <Card {...item} /> : "title" in item ? <AdCard {...item} /> : null}
            </div>
          )
        })}
      </div>
    </Layout>
  )
}
