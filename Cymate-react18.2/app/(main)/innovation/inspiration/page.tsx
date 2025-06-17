"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import {
  Search,
  SlidersHorizontal,
  Heart,
  MessageSquare,
  XCircle,
  Send,
  Smile,
  Share2,
  AlertTriangle,
  Bookmark,
  Eye,
  Zap,
  ThumbsDown,
  Plus,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"

const animationStyle = `
.animate-scroll {
  animation: scroll 20s linear infinite;
}
.animate-scroll:hover {
  animation-play-state: paused;
}
@keyframes scrollLeft {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

.animate-scroll-left {
  animation: scrollLeft 30s linear infinite;
}

.animate-scroll-left:hover {
  animation-play-state: paused;
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-fade-in-right {
  animation: fadeInRight 0.5s ease-out forwards;
}
`

// Updated author profile
const authorProfile = {
  fullName: "John Doe",
  userName: "@johndoe",
  jobTitle: "Senior Cybersecurity Analyst",
  yearsOfExperience: 8,
  brief: "Passionate about cybersecurity and web development with a focus on creating secure, scalable solutions.",
  phoneNumber: "+1 (555) 123-4567",
  email: "john.doe@example.com",
  avatar: "/placeholder.svg?height=100&width=100",
}

// Updated tools with tags
const allTools = [
  { id: 1, name: "SecureAuth", description: "Advanced authentication tool", tags: ["cybersecurity", "authentication"] },
  { id: 2, name: "CloudGuard", description: "Cloud security solution", tags: ["cybersecurity", "cloud"] },
  {
    id: 3,
    name: "DevSecOps Pro",
    description: "Integrated security for DevOps",
    tags: ["development", "cybersecurity"],
  },
  { id: 4, name: "BlockchainSafe", description: "Blockchain security toolkit", tags: ["blockchain", "cybersecurity"] },
  {
    id: 5,
    name: "MicroserviceArchitect",
    description: "Microservices design tool",
    tags: ["development", "architecture"],
  },
  {
    id: 6,
    name: "ServerlessWizard",
    description: "Serverless computing framework",
    tags: ["development", "serverless"],
  },
]

const dummyCards = [
  {
    id: 1,
    title: "Secure Authentication Patterns",
    author: "Jane Doe",
    thunder: 134,
    love: 234,
    dislike: 45,
    views: 1000,
    comments: [
      {
        id: 1,
        author: "Alice",
        text: "Great insights on multi-factor authentication!",
        thunder: 5,
        love: 8,
        dislike: 1,
        replies: [
          { id: 1, author: "Bob", text: "Agreed! MFA is crucial these days.", thunder: 2, love: 3, dislike: 0 },
        ],
      },
      {
        id: 2,
        author: "Charlie",
        text: "How would this work with biometric authentication?",
        thunder: 3,
        love: 4,
        dislike: 0,
      },
    ],
    image: "/placeholder.svg?height=300&width=300",
    tags: ["cybersecurity", "authentication", "best-practices"],
    content:
      "This inspiration showcases various secure authentication patterns, including multi-factor authentication, biometric verification, and token-based systems. It emphasizes the importance of layered security and user-friendly design in modern authentication processes.",
  },
  {
    id: 2,
    title: "Microservices Architecture",
    author: "John Smith",
    thunder: 89,
    love: 189,
    dislike: 32,
    views: 800,
    comments: [
      {
        id: 1,
        author: "David",
        text: "How does this compare to monolithic architectures?",
        thunder: 4,
        love: 6,
        dislike: 1,
        replies: [
          {
            id: 1,
            author: "Emily",
            text: "Microservices offer better scalability and flexibility.",
            thunder: 3,
            love: 5,
            dislike: 0,
          },
        ],
      },
      { id: 2, author: "Frank", text: "Great explanation of service discovery!", thunder: 2, love: 4, dislike: 0 },
    ],
    image: "/placeholder.svg?height=300&width=300",
    tags: ["development", "microservices", "architecture"],
    content:
      "This inspiration delves into the world of microservices architecture, highlighting its benefits in scalability and maintainability. It covers key concepts such as service discovery, API gateways, and strategies for breaking down monolithic applications into microservices.",
  },
  {
    id: 3,
    title: "Blockchain in Cybersecurity",
    author: "Emily Green",
    thunder: 212,
    love: 312,
    dislike: 67,
    views: 1500,
    comments: [
      {
        id: 1,
        author: "Eva",
        text: "Interesting application of blockchain beyond cryptocurrencies!",
        thunder: 7,
        love: 9,
        dislike: 1,
      },
      {
        id: 2,
        author: "Frank",
        text: "How does this affect data privacy regulations?",
        thunder: 5,
        love: 6,
        dislike: 0,
      },
    ],
    image: "/placeholder.svg?height=300&width=300",
    tags: ["cybersecurity", "blockchain", "innovation"],
    content:
      "This inspiration explores the innovative use of blockchain technology in cybersecurity. It covers topics such as secure data storage, tamper-proof audit trails, and decentralized identity management, showcasing how blockchain can enhance security in various digital systems.",
  },
  {
    id: 4,
    title: "Serverless Computing Patterns",
    author: "Alex Blue",
    thunder: 176,
    love: 276,
    dislike: 53,
    views: 1200,
    comments: [
      {
        id: 1,
        author: "Grace",
        text: "How does this affect traditional DevOps practices?",
        thunder: 6,
        love: 8,
        dislike: 1,
      },
      {
        id: 2,
        author: "Henry",
        text: "Great examples of event-driven architectures!",
        thunder: 4,
        love: 7,
        dislike: 0,
      },
    ],
    image: "/placeholder.svg?height=300&width=300",
    tags: ["development", "serverless", "cloud"],
    content:
      "This inspiration dives into serverless computing patterns, showcasing how they can simplify development and reduce operational overhead. It covers topics such as function-as-a-service (FaaS), event-driven architectures, and best practices for designing scalable serverless applications.",
  },
  {
    id: 5,
    title: "AI in Cybersecurity",
    author: "Sarah Johnson",
    thunder: 156,
    love: 278,
    dislike: 23,
    views: 1300,
    comments: [
      { id: 1, author: "Mike", text: "Fascinating use of AI for threat detection!", thunder: 8, love: 12, dislike: 1 },
      { id: 2, author: "Lisa", text: "How does this compare to traditional methods?", thunder: 5, love: 7, dislike: 0 },
    ],
    image: "/placeholder.svg?height=300&width=300",
    tags: ["cybersecurity", "ai", "machine-learning"],
    content:
      "This inspiration explores the cutting-edge applications of AI in cybersecurity, including predictive threat analysis, anomaly detection, and automated incident response. It highlights how machine learning algorithms are revolutionizing the way we approach digital security.",
  },
  {
    id: 6,
    title: "Quantum Computing and Cryptography",
    author: "Dr. Quantum",
    thunder: 201,
    love: 345,
    dislike: 12,
    views: 1800,
    comments: [
      {
        id: 1,
        author: "Curious Mind",
        text: "Mind-blowing implications for current encryption methods!",
        thunder: 15,
        love: 20,
        dislike: 0,
      },
      {
        id: 2,
        author: "Skeptic101",
        text: "How far are we from practical quantum computers?",
        thunder: 7,
        love: 9,
        dislike: 2,
      },
    ],
    image: "/placeholder.svg?height=300&width=300",
    tags: ["quantum-computing", "cryptography", "future-tech"],
    content:
      "This inspiration delves into the world of quantum computing and its potential impact on cryptography. It explores concepts like quantum key distribution, post-quantum cryptography, and the race to develop quantum-resistant algorithms.",
  },
  {
    id: 7,
    title: "DevOps in the Cloud Era",
    author: "CloudMaster",
    thunder: 132,
    love: 245,
    dislike: 18,
    views: 1100,
    comments: [
      {
        id: 1,
        author: "DevOps Enthusiast",
        text: "Great insights on integrating security into the CI/CD pipeline!",
        thunder: 10,
        love: 15,
        dislike: 0,
      },
      {
        id: 2,
        author: "Cloud Newbie",
        text: "How does this approach scale for larger organizations?",
        thunder: 6,
        love: 8,
        dislike: 1,
      },
    ],
    image: "/placeholder.svg?height=300&width=300",
    tags: ["devops", "cloud-computing", "ci-cd"],
    content:
      "This inspiration covers the evolution of DevOps practices in the cloud computing era. It highlights strategies for seamless integration, automated deployments, and maintaining security throughout the development lifecycle.",
  },
  {
    id: 8,
    title: "Ethical Hacking Techniques",
    author: "White Hat Hero",
    thunder: 189,
    love: 301,
    dislike: 9,
    views: 1600,
    comments: [
      {
        id: 1,
        author: "Security Student",
        text: "Invaluable insights for aspiring ethical hackers!",
        thunder: 12,
        love: 18,
        dislike: 0,
      },
      {
        id: 2,
        author: "Corporate IT",
        text: "How can companies best utilize ethical hacking services?",
        thunder: 8,
        love: 11,
        dislike: 1,
      },
    ],
    image: "/placeholder.svg?height=300&width=300",
    tags: ["ethical-hacking", "penetration-testing", "cybersecurity"],
    content:
      "This inspiration provides an overview of ethical hacking techniques and their importance in modern cybersecurity. It covers topics such as vulnerability assessment, social engineering, and responsible disclosure practices.",
  },
  {
    id: 9,
    title: "Blockchain Beyond Cryptocurrency",
    author: "Chain Innovator",
    thunder: 167,
    love: 289,
    dislike: 15,
    views: 1400,
    comments: [
      {
        id: 1,
        author: "Blockchain Believer",
        text: "Exciting applications in supply chain management!",
        thunder: 9,
        love: 14,
        dislike: 1,
      },
      {
        id: 2,
        author: "Tech Analyst",
        text: "What are the scalability challenges for these use cases?",
        thunder: 7,
        love: 10,
        dislike: 0,
      },
    ],
    image: "/placeholder.svg?height=300&width=300",
    tags: ["blockchain", "distributed-systems", "innovation"],
    content:
      "This inspiration explores innovative applications of blockchain technology beyond cryptocurrencies. It covers use cases in areas such as supply chain management, digital identity verification, and decentralized governance systems.",
  },
  {
    id: 10,
    title: "The Future of Edge Computing",
    author: "Edge Master",
    thunder: 145,
    love: 267,
    dislike: 11,
    views: 1200,
    comments: [
      {
        id: 1,
        author: "IoT Enthusiast",
        text: "Game-changing for Internet of Things applications!",
        thunder: 11,
        love: 16,
        dislike: 0,
      },
      {
        id: 2,
        author: "Network Pro",
        text: "How does this impact traditional cloud architectures?",
        thunder: 7,
        love: 9,
        dislike: 1,
      },
    ],
    image: "/placeholder.svg?height=300&width=300",
    tags: ["edge-computing", "iot", "distributed-systems"],
    content:
      "This inspiration delves into the emerging field of edge computing and its potential to revolutionize data processing. It explores how edge computing can reduce latency, enhance privacy, and enable new applications in IoT and AI.",
  },
]

type Reaction = "thunder" | "love" | "dislike" | null

interface CardState {
  [key: number]: Reaction
}

interface CommentState {
  [key: number]: {
    [commentId: number]: Reaction
  }
}

// SVG patterns for the grainy effect
const NoiseSVG = () => (
  <svg width="0" height="0" className="hidden">
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"></feTurbulence>
      <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"></feColorMatrix>
    </filter>
  </svg>
)

const InspirationPage: React.FC = () => {
  const [cardStates, setCardStates] = useState<CardState>({})
  const [commentStates, setCommentStates] = useState<CommentState>({})
  const [showFilterInput, setShowFilterInput] = useState(false)
  const [filterTags, setFilterTags] = useState<string[]>([])
  const [filterInput, setFilterInput] = useState("")
  const [selectedCard, setSelectedCard] = useState<number | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [commentInput, setCommentInput] = useState("")
  const [replyingTo, setReplyingTo] = useState<{ commentId: number; author: string } | null>(null)
  const [showShareMessage, setShowShareMessage] = useState(false) // Added state for share message
  const [savedCards, setSavedCards] = useState<number[]>([]) // Added state for saved cards
  const [relatedContent, setRelatedContent] = useState<typeof dummyCards>([])
  const [authorContent, setAuthorContent] = useState<typeof dummyCards>([])
  const [expandedCard, setExpandedCard] = useState<number | null>(null)
  const [showReportMessage, setShowReportMessage] = useState(false)
  const [showModalShareMessage, setShowModalShareMessage] = useState(false)
  const [showModalReportMessage, setShowModalReportMessage] = useState(false)

  const modalRef = useRef<HTMLDivElement>(null)
  const filterRef = useRef<HTMLDivElement>(null)

  const handleCardClick = (cardId: number) => {
    setSelectedCardId(cardId)
  }

  const handleShareClick = (e: React.MouseEvent, cardId: number) => {
    e.stopPropagation()
    handleShare(cardId)
  }

  const handleAlertClick = (e: React.MouseEvent, cardId: number) => {
    e.stopPropagation()
    handleAlert(cardId)
  }

  const handleSaveClick = (e: React.MouseEvent, cardId: number) => {
    e.stopPropagation()
    handleSave(cardId)
  }

  const handleReactionClick = (e: React.MouseEvent, cardId: number, reaction: Reaction) => {
    e.stopPropagation()
    handleReaction(cardId, reaction)
  }

  const handleCommentClick = (e: React.MouseEvent, cardId: number) => {
    e.stopPropagation()
    setExpandedCard(expandedCard === cardId ? null : cardId)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setSelectedCard(null)
      }
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilterInput(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleReaction = (cardId: number, reaction: Reaction) => {
    setCardStates((prevStates) => {
      const currentReaction = prevStates[cardId]
      if (currentReaction === reaction) {
        const { [cardId]: _, ...rest } = prevStates
        return rest
      } else {
        return { ...prevStates, [cardId]: reaction }
      }
    })
  }

  const handleCommentReaction = (cardId: number, commentId: number, replyId: number | null, reaction: Reaction) => {
    setCommentStates((prevStates) => {
      const currentCardState = prevStates[cardId] || {}
      const commentKey = replyId ? `${commentId}-${replyId}` : `${commentId}`
      const currentReaction = currentCardState[commentKey]

      if (currentReaction === reaction) {
        const { [commentKey]: _, ...rest } = currentCardState
        return { ...prevStates, [cardId]: rest }
      } else {
        return { ...prevStates, [cardId]: { ...currentCardState, [commentKey]: reaction } }
      }
    })
  }

  const handleFilterInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filterInput.trim() !== "") {
      setFilterTags([...filterTags, filterInput.trim().toLowerCase()])
      setFilterInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFilterTags(filterTags.filter((tag) => tag !== tagToRemove))
  }

  const filteredCards = dummyCards.filter(
    (card) => filterTags.length === 0 || filterTags.every((tag) => card.tags.includes(tag)),
  )

  const handleEmojiSelect = (emoji: any) => {
    setCommentInput((prevInput) => prevInput + emoji.native)
    setShowEmojiPicker(false)
  }

  const handleCommentSubmit = () => {
    if (commentInput.trim() === "") return

    const newComment = {
      id: Date.now(),
      author: "You",
      text: commentInput,
      thunder: 0,
      love: 0,
      dislike: 0,
      replies: [],
    }

    const updatedCards = dummyCards.map((card) => {
      if (card.id === selectedCard) {
        if (replyingTo) {
          const updatedComments = card.comments.map((comment) => {
            if (comment.id === replyingTo.commentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newComment],
              }
            }
            return comment
          })
          return { ...card, comments: updatedComments }
        } else {
          return { ...card, comments: [...card.comments, newComment] }
        }
      }
      return card
    })

    // In a real application, you would update the state or make an API call here
    console.log("Updated cards:", updatedCards)

    setCommentInput("")
    setReplyingTo(null)
  }

  const handleShare = (cardId: number) => {
    // Updated handleShare function
    console.log(`Sharing card ${cardId}`)
    setShowShareMessage(true)
    setTimeout(() => {
      setShowShareMessage(false)
    }, 2000)
  }

  const handleAlert = (cardId: number) => {
    console.log(`Reporting card ${cardId}`)
    setShowReportMessage(true)
    setTimeout(() => {
      setShowReportMessage(false)
    }, 2000)
  }

  const handleSave = (cardId: number) => {
    // Updated handleSave function
    setSavedCards((prev) => (prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId]))
  }

  const renderCommentReactions = (
    cardId: number,
    commentId: number,
    replyId: number | null,
    thunder: number,
    love: number,
    dislike: number,
  ) => (
    <div className="flex space-x-2 text-sm">
      <button
        onClick={() => handleCommentReaction(cardId, commentId, replyId, "thunder")}
        className={`flex items-center ${
          commentStates[cardId]?.[replyId ? `${commentId}-${replyId}` : `${commentId}`] === "thunder"
            ? "text-violet-500 glow-violet"
            : "text-gray-500"
        }`}
      >
        <Zap className="h-4 w-4 mr-1" />
        <span>
          {thunder +
            (commentStates[cardId]?.[replyId ? `${commentId}-${replyId}` : `${commentId}`] === "thunder" ? 1 : 0)}
        </span>
      </button>
      <button
        onClick={() => handleCommentReaction(cardId, commentId, replyId, "love")}
        className={`flex items-center ${
          commentStates[cardId]?.[replyId ? `${commentId}-${replyId}` : `${commentId}`] === "love"
            ? "text-red-500 glow-red"
            : "text-gray-500"
        }`}
      >
        <Heart className="h-4 w-4 mr-1" />
        <span>
          {love + (commentStates[cardId]?.[replyId ? `${commentId}-${replyId}` : `${commentId}`] === "love" ? 1 : 0)}
        </span>
      </button>
      <button
        onClick={() => handleCommentReaction(cardId, commentId, replyId, "dislike")}
        className={`flex items-center ${
          commentStates[cardId]?.[replyId ? `${commentId}-${replyId}` : `${commentId}`] === "dislike"
            ? "text-green-500 glow-green"
            : "text-gray-500"
        }`}
      >
        <ThumbsDown className="h-4 w-4 mr-1" />
        <span>
          {dislike +
            (commentStates[cardId]?.[replyId ? `${commentId}-${replyId}` : `${commentId}`] === "dislike" ? 1 : 0)}
        </span>
      </button>
    </div>
  )

  const getMatchingTools = (cardTags: string[]) => {
    return allTools.filter((tool) => cardTags.filter((tag) => tool.tags.includes(tag)).length >= 2)
  }

  const getRelatedContent = (cardId: number) => {
    const currentCard = dummyCards.find((c) => c.id === cardId)
    if (!currentCard) return []
    const relatedCards = dummyCards.filter(
      (c) => c.id !== cardId && c.tags.some((tag) => currentCard.tags.includes(tag)),
    )
    // Duplicate the related cards to ensure we have enough for smooth scrolling
    // Add a unique identifier to each duplicated card
    return [...relatedCards, ...relatedCards.map((card) => ({ ...card, id: `${card.id}-duplicate` }))].slice(0, 20)
  }

  const getAuthorContent = (cardId: number) => {
    const currentCard = dummyCards.find((c) => c.id === cardId)
    if (!currentCard) return []
    return [
      {
        id: 101,
        title: "Advanced Encryption Techniques",
        image: "/placeholder.svg?height=200&width=300",
        description: "Explore cutting-edge encryption methods for securing sensitive data.",
        date: new Date("2023-05-15"),
      },
      {
        id: 102,
        title: "Blockchain in Healthcare",
        image: "/placeholder.svg?height=200&width=300",
        description: "Discover how blockchain is revolutionizing patient data management and security.",
        date: new Date("2023-04-22"),
      },
      {
        id: 103,
        title: "AI-Powered Threat Detection",
        image: "/placeholder.svg?height=200&width=300",
        description: "Learn about the latest AI algorithms used in cybersecurity threat detection.",
        date: new Date("2023-03-10"),
      },
      {
        id: 104,
        title: "Quantum Computing: Risks and Opportunities",
        image: "/placeholder.svg?height=200&width=300",
        description: "Understand the potential impact of quantum computing on current security protocols.",
        date: new Date("2023-02-05"),
      },
      {
        id: 105,
        title: "Zero Trust Architecture Implementation",
        image: "/placeholder.svg?height=200&width=300",
        description: "A comprehensive guide to implementing zero trust security in your organization.",
        date: new Date("2023-01-18"),
      },
    ]
  }

  const setSelectedCardId = (cardId: number | null) => {
    setSelectedCard(cardId)
    if (cardId !== null) {
      setRelatedContent(getRelatedContent(cardId))
      setAuthorContent(getAuthorContent(cardId))
    }
  }

  const handleModalShare = () => {
    setShowModalShareMessage(true)
    setTimeout(() => {
      setShowModalShareMessage(false)
    }, 2000)
  }

  const handleModalAlert = () => {
    setShowModalReportMessage(true)
    setTimeout(() => {
      setShowModalReportMessage(false)
    }, 2000)
  }

  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = animationStyle
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div className="p-8 bg-gray-50 min-h-screen dark:bg-transparent">
      <NoiseSVG />
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 dark:text-white">Inspiration Station</h1>
        <p className="text-gray-600 dark:text-white">Ignite your tech creativity with cybersecurity and development inspiration</p>
      </header>

      <div className="mb-8 flex flex-col gap-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search for inspiration..."
            className="dark:bg-gray-500 w-full py-3 px-4 pr-12 rounded-xl bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg focus:outline-none focus:ring-2 focus:ring-purple-300 transition duration-300 ease-in-out shadow-lg"
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
        </div>
        <div className="relative flex items-center" ref={filterRef}>
          <button
            onClick={() => setShowFilterInput(!showFilterInput)}
            className="flex items-center justify-center py-3 px-6 rounded-l-xl bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg text-gray-700 font-semibold shadow-lg hover:shadow-xl transition duration-300 ease-in-out"
          >
            <SlidersHorizontal className="h-6 w-6 mr-2" />
            Filters
          </button>
          {showFilterInput && (
            <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-r-xl shadow-lg">
              <input
                type="text"
                value={filterInput}
                onChange={(e) => setFilterInput(e.target.value)}
                onKeyPress={handleFilterInput}
                placeholder="Filter with tags"
                className="w-64 py-3 px-4 rounded-r-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
          )}
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
      <div className="mb-12"></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCards.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer group"
            onClick={() => handleCardClick(card.id)}
          >
            {/* Square Image Container */}
            <div className="relative aspect-square w-full">
              <img src={card.image || "/placeholder.svg"} alt={card.title} className="w-full h-full object-cover" />
              {/* Reaction overlay on image */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex justify-between items-center text-white">
                  <div className="flex space-x-3">
                    <button
                      onClick={(e) => handleReactionClick(e, card.id, "thunder")}
                      className={`flex items-center transition-all duration-300 ${
                        cardStates[card.id] === "thunder" ? "text-violet-400" : "hover:text-violet-400"
                      }`}
                    >
                      <Zap className="h-5 w-5 mr-1" />
                      <span>{card.thunder + (cardStates[card.id] === "thunder" ? 1 : 0)}</span>
                    </button>
                    <button
                      onClick={(e) => handleReactionClick(e, card.id, "love")}
                      className={`flex items-center transition-all duration-300 ${
                        cardStates[card.id] === "love" ? "text-red-400" : "hover:text-red-400"
                      }`}
                    >
                      <Heart className="h-5 w-5 mr-1" />
                      <span>{card.love + (cardStates[card.id] === "love" ? 1 : 0)}</span>
                    </button>
                    <button
                      onClick={(e) => handleReactionClick(e, card.id, "dislike")}
                      className={`flex items-center transition-all duration-300 ${
                        cardStates[card.id] === "dislike" ? "text-green-400" : "hover:text-green-400"
                      }`}
                    >
                      <ThumbsDown className="h-5 w-5 mr-1" />
                      <span>{card.dislike + (cardStates[card.id] === "dislike" ? 1 : 0)}</span>
                    </button>
                    <button
                      onClick={(e) => handleCommentClick(e, card.id)}
                      className="flex items-center hover:text-blue-400 transition-all duration-300"
                    >
                      <MessageSquare className="h-5 w-5 mr-1" />
                      <span>{card.comments.length}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <img
                  src={authorProfile.avatar || "/placeholder.svg"}
                  alt={card.author}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-gray-700 font-medium">{card.author}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{card.title}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{card.content}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <time>{new Date().toISOString().split("T")[0]}</time>
                <span>{Math.ceil(card.content.length / 1000)} min read</span>
              </div>
            </div>

            {/* Comments Expansion */}
            {expandedCard === card.id && (
              <div className="absolute left-0 right-0 top-full z-10 bg-white rounded-b-xl shadow-lg px-4 pb-4 border-t border-gray-200">
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setExpandedCard(null)
                    }}
                    className="absolute right-0 top-2 text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                  <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                    <h4 className="font-semibold text-sm">Comments</h4>
                    {card.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-2 text-sm">
                        <p className="font-medium text-xs">{comment.author}</p>
                        <p className="text-xs">{comment.text}</p>
                        {renderCommentReactions(
                          card.id,
                          comment.id,
                          null,
                          comment.thunder,
                          comment.love,
                          comment.dislike,
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedCard !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto relative"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <img
                  src={dummyCards.find((c) => c.id === selectedCard)?.image || "/placeholder.svg"}
                  alt={dummyCards.find((c) => c.id === selectedCard)?.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {dummyCards.find((c) => c.id === selectedCard)?.title}
                </h2>
                <p className="text-gray-700 mb-4">{dummyCards.find((c) => c.id === selectedCard)?.content}</p>
                <div className="mb-4 flex flex-wrap gap-2">
                  {/* Add "Inspiration" as the first tag with glowing effect */}
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium relative overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(124, 58, 237, 0.8) 100%)",
                      boxShadow: "0 0 10px rgba(139, 92, 246, 0.5)",
                      color: "white",
                    }}
                  >
                    <span className="relative z-10">Inspiration</span>
                    <div
                      className="absolute inset-0 z-0 opacity-30"
                      style={{
                        filter: "url(#noise)",
                        mixBlendMode: "overlay",
                      }}
                    ></div>
                  </span>
                  {dummyCards
                    .find((c) => c.id === selectedCard)
                    ?.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: "rgba(243, 244, 246, 0.7)",
                          border: "1px solid rgba(229, 231, 235, 0.8)",
                          color: "#4B5563",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                </div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleReaction(selectedCard, "thunder")}
                      className={`flex items-center transition-all duration-300 ${cardStates[selectedCard] === "thunder" ? "text-violet-500 glow-violet" : "text-gray-500 hover:text-violet-500"}`}
                    >
                      <Zap className="h-6 w-6 mr-1" />
                      <span>
                        {(dummyCards.find((c) => c.id === selectedCard)?.thunder || 0) +
                          (cardStates[selectedCard] === "thunder" ? 1 : 0)}
                      </span>
                    </button>
                    <button
                      onClick={() => handleReaction(selectedCard, "love")}
                      className={`flex items-center transition-all duration-300 ${cardStates[selectedCard] === "love" ? "text-red-500 glow-red" : "text-gray-500 hover:text-red-500"}`}
                    >
                      <Heart className="h-6 w-6 mr-1" />
                      <span>
                        {(dummyCards.find((c) => c.id === selectedCard)?.love || 0) +
                          (cardStates[selectedCard] === "love" ? 1 : 0)}
                      </span>
                    </button>
                    <button
                      onClick={() => handleReaction(selectedCard, "dislike")}
                      className={`flex items-center transition-all duration-300 ${cardStates[selectedCard] === "dislike" ? "text-green-500 glow-green" : "text-gray-500 hover:text-green-500"}`}
                    >
                      <ThumbsDown className="h-6 w-6 mr-1" />
                      <span>
                        {(dummyCards.find((c) => c.id === selectedCard)?.dislike || 0) +
                          (cardStates[selectedCard] === "dislike" ? 1 : 0)}
                      </span>
                    </button>
                    <button className="flex items-center text-gray-500">
                      <MessageSquare className="h-6 w-6 mr-1" />
                      <span>{dummyCards.find((c) => c.id === selectedCard)?.comments.length}</span>
                    </button>
                    <button className="flex items-center text-gray-500">
                      <Eye className="h-6 w-6 mr-1" />
                      <span>{dummyCards.find((c) => c.id === selectedCard)?.views}</span>
                    </button>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleModalShare}
                      className="text-gray-500 hover:text-violet-500 transition-colors duration-200"
                    >
                      <Share2 className="h-6 w-6" />
                    </button>
                    <button
                      onClick={() => handleSave(selectedCard)}
                      className={`transition-colors duration-200 ${savedCards.includes(selectedCard) ? "text-violet-500" : "text-gray-500 hover:text-violet-500"}`}
                    >
                      <Bookmark className="h-6 w-6" />
                    </button>
                    <div className="relative group">
                      <button
                        onClick={handleModalAlert}
                        className="text-gray-500 group-hover:text-red-500 transition-colors duration-200"
                      >
                        <AlertTriangle className="h-6 w-6" />
                      </button>
                      <span className="absolute hidden group-hover:block bg-red-500 text-white text-xs py-1 px-2 rounded -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                        Report this
                      </span>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  Comments
                  <button
                    onClick={() => {
                      setReplyingTo(null)
                      setCommentInput("")
                      document.querySelector('input[placeholder="Add a comment..."]')?.focus()
                    }}
                    className="ml-2 text-violet-500 hover:text-violet-600 transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </h3>
                <div className="space-y-4 mb-4">
                  {dummyCards
                    .find((c) => c.id === selectedCard)
                    ?.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-4 shadow">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-semibold text-gray-700">{comment.author}</p>
                          {renderCommentReactions(
                            selectedCard,
                            comment.id,
                            null,
                            comment.thunder,
                            comment.love,
                            comment.dislike,
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{comment.text}</p>
                        <button
                          onClick={() => setReplyingTo({ commentId: comment.id, author: comment.author })}
                          className="text-sm text-purple-600 hover:text-purple-800"
                        >
                          Reply
                        </button>
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="ml-4 mt-2 space-y-2">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="bg-gray-100 rounded-lg p-2">
                                <div className="flex justify-between items-start mb-1">
                                  <p className="font-semibold text-gray-700">{reply.author}</p>
                                  {renderCommentReactions(
                                    selectedCard,
                                    comment.id,
                                    reply.id,
                                    reply.thunder,
                                    reply.love,
                                    reply.dislike,
                                  )}
                                </div>
                                <p className="text-gray-600">{reply.text}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
                <div className="relative">
                  <Input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder={replyingTo ? `Reply to ${replyingTo.author}...` : "Add a comment..."}
                    className="w-full py-2 px-3 pr-12 rounded-lg bg-white bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Smile className="h-6 w-6" />
                  </button>
                  <button
                    onClick={handleCommentSubmit}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-purple-600 hover:text-purple-800"
                  >
                    <Send className="h-6 w-6" />
                  </button>
                </div>
                {showEmojiPicker && (
                  <div className="absolute bottom-full right-0 mb-2">
                    <Picker data={data} onEmojiSelect={handleEmojiSelect} />
                  </div>
                )}

                {/* Related Content Section */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Related Content</h3>
                  <div className="relative overflow-hidden" style={{ height: "200px" }}>
                    <div className="flex space-x-4 animate-scroll-left">
                      {[...relatedContent, ...relatedContent].map((card, index) => (
                        <div
                          key={`${card.id}-${index}`}
                          className="w-64 flex-shrink-0 bg-white rounded-lg shadow-md p-4 cursor-pointer transition-transform hover:scale-105 animate-fade-in-right"
                          style={{ animationDelay: `${index * 0.1}s` }}
                          onClick={() =>
                            setSelectedCardId(typeof card.id === "number" ? card.id : Number.parseInt(card.id))
                          }
                        >
                          <img
                            src={card.image || "/placeholder.svg"}
                            alt={card.title}
                            className="w-full h-32 object-cover rounded-md mb-2"
                          />
                          <h4 className="font-semibold text-gray-800">{card.title}</h4>
                          <p className="text-sm text-gray-600">by {card.author}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:col-span-1">
                <div className="bg-white bg-opacity-50 rounded-xl p-4 shadow-lg mb-4">
                  <img
                    src={authorProfile.avatar || "/placeholder.svg"}
                    alt={authorProfile.fullName}
                    className="w-20 h-20 rounded-full mx-auto mb-2"
                  />
                  <h3 className="text-xl font-semibold text-center mb-2">{authorProfile.fullName}</h3>
                  <p className="text-gray-600 text-center mb-2">{authorProfile.userName}</p>
                  <p className="text-gray-700 font-medium mb-1">{authorProfile.jobTitle}</p>
                  <p className="text-gray-600 mb-2">{authorProfile.yearsOfExperience} years of experience</p>
                  <p className="text-gray-600 mb-2">{authorProfile.brief}</p>
                  <p className="text-gray-600 mb-1">{authorProfile.phoneNumber}</p>
                  <p className="text-gray-600">{authorProfile.email}</p>
                </div>
                <div className="bg-white bg-opacity-50 rounded-xl p-4 shadow-lg mb-4">
                  <h4 className="text-lg font-semibold mb-2">Advertisement</h4>
                  <img src="/placeholder.svg?height=200&width=300" alt="Advertisement" className="w-full rounded-lg" />
                </div>
                <div className="bg-white bg-opacity-50 rounded-xl p-4 shadow-lg mb-4">
                  <h4 className="text-lg font-semibold mb-4">Related Tools</h4>
                  <div className="grid gap-4">
                    {getMatchingTools(dummyCards.find((c) => c.id === selectedCard)?.tags || []).map((tool) => (
                      <div key={tool.id} className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-lg font-semibold">{tool.name}</h5>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                tool.tags.includes("premium")
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {tool.tags.includes("premium") ? "Freemium" : "Free"}
                            </span>
                            <button className="text-gray-500 hover:text-gray-700">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 012 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {tool.tags
                            .filter((tag) => tag !== "premium")
                            .map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                                {tag
                                  .split("-")
                                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                  .join(" ")}
                              </span>
                            ))}
                        </div>
                        <button className="w-full bg-violet-500 text-white py-2 px-4 rounded-lg hover:bg-violet-600 transition-colors flex items-center justify-center gap-2 text-sm">
                          Launch Tool
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white bg-opacity-50 rounded-xl p-4 shadow-lg">
                  <h4 className="text-lg font-semibold mb-4">More from this Author</h4>
                  <div className="space-y-4">
                    {authorContent.map((content, index) => (
                      <div
                        key={content.id}
                        className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-md"
                      >
                        <div className="flex items-center">
                          <img
                            src={content.image || "/placeholder.svg"}
                            alt={content.title}
                            className="w-1/3 h-20 object-cover"
                          />
                          <div className="p-2 flex-1">
                            <h5 className="font-semibold text-sm text-gray-800 mb-1">{content.title}</h5>
                            <p className="text-xs text-gray-600 mb-1 line-clamp-2">{content.description}</p>
                            <p className="text-xs text-gray-500">{content.date.toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedCardId(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <XCircle className="h-6 w-6" />
            </button>
            {showModalShareMessage && (
              <div className="absolute bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-out">
                Link copied successfully
              </div>
            )}
            {showModalReportMessage && (
              <div className="absolute bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-out">
                Reported successfully
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default InspirationPage
