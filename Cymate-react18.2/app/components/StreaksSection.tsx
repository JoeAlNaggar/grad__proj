"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, Key, ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Diverse card designs inspired by the provided images
const initialStreakCards = [
  {
    id: 1,
    type: "full-image",
    title: "Zero-Day Vulnerability Alert",
    description: "Critical vulnerability discovered in popular JavaScript framework. Immediate patching required.",
    image: "/placeholder.svg?height=400&width=600",
    color: "#4361ee",
    category: "Security Alert",
    link: "https://example.com/zero-day-alert",
    buttonText: "View Alert",
  },
  {
    id: 2,
    type: "icon-centered",
    title: "Quantum Encryption Protocol",
    description: "New quantum-resistant encryption standard released for enterprise systems.",
    icon: Lock,
    color: "#3a0ca3",
    category: "Cryptography",
    link: "https://example.com/quantum-encryption",
    buttonText: "Learn More",
  },
  {
    id: 3,
    type: "split-content",
    title: "AI-Powered Threat Detection",
    description: "Machine learning models now detecting 99.9% of malware variants in real-time.",
    image: "/placeholder.svg?height=300&width=300",
    color: "#7209b7",
    category: "AI Security",
    link: "https://example.com/ai-threat-detection",
    buttonText: "Explore Technology",
  },
  {
    id: 4,
    type: "stat-card",
    title: "Network Security Update",
    description: "New firewall configurations to protect against emerging threats.",
    statNumber: "145",
    statLabel: "Vulnerabilities Patched",
    color: "#f72585",
    category: "Network Security",
    link: "https://example.com/network-security",
    buttonText: "Get Guide",
  },
  {
    id: 5,
    type: "feature-card",
    title: "Blockchain Security Audit",
    description: "Comprehensive audit framework for smart contracts and blockchain applications.",
    features: ["Smart Contract Analysis", "Vulnerability Detection", "Remediation Steps"],
    color: "#4cc9f0",
    category: "Blockchain",
    link: "https://example.com/blockchain-audit",
    buttonText: "Start Audit",
  },
  {
    id: 6,
    type: "image-overlay",
    title: "Biometric Authentication",
    description: "Multi-factor biometric authentication system with 99.99% accuracy.",
    image: "/placeholder.svg?height=400&width=600",
    color: "#4895ef",
    category: "Authentication",
    link: "https://example.com/biometric-auth",
    buttonText: "Implement Now",
  },
  {
    id: 7,
    type: "minimal-card",
    title: "Ransomware Protection",
    description: "Advanced ransomware protection and recovery system for enterprise networks.",
    icon: Key,
    color: "#560bad",
    category: "Ransomware",
    link: "https://example.com/ransomware-protection",
    buttonText: "Protect Systems",
  },
]

export default function StreaksSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const [streakCards, setStreakCards] = useState(initialStreakCards)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const nextCard = () => {
    setActiveIndex((prev) => (prev + 1) % streakCards.length)
  }

  const prevCard = () => {
    setActiveIndex((prev) => (prev - 1 + streakCards.length) % streakCards.length)
  }

  const goToCard = (index: number) => {
    setActiveIndex(index)
    setAutoPlay(false)
  }

  const handleDeleteCard = (e: React.MouseEvent, cardId: number) => {
    e.preventDefault()
    e.stopPropagation()

    // Remove the card from state
    const newCards = streakCards.filter((card) => card.id !== cardId)
    setStreakCards(newCards)

    // Adjust active index if needed
    if (activeIndex >= newCards.length) {
      setActiveIndex(Math.max(0, newCards.length - 1))
    }
  }

  useEffect(() => {
    if (autoPlay) {
      autoPlayRef.current = setInterval(() => {
        nextCard()
      }, 5000)
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [autoPlay, streakCards.length]) // Added streakCards.length dependency

  // Render different card designs based on type
  const renderCard = (card: (typeof streakCards)[0], isActive: boolean) => {
    switch (card.type) {
      case "full-image":
        return (
          <div
            className="relative h-[350px] rounded-xl overflow-hidden bg-white shadow-md group"
            style={{ backgroundColor: card.color }}
          >
            <div className="absolute inset-0">
              <Image src={card.image || "/placeholder.svg"} alt={card.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
            <div className="relative z-10 h-full p-6 flex flex-col">
              <span className="text-sm font-medium text-white/80 mb-2">{card.category}</span>
              <h3 className="text-2xl font-bold text-white mb-3">{card.title}</h3>
              <p className="text-white/70 mb-6">{card.description}</p>
              <div className="mt-auto">
                {isActive && (
                  <button className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-opacity-90 transition-colors">
                    {card.buttonText}
                  </button>
                )}
              </div>
            </div>
            {/* Delete button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => handleDeleteCard(e, card.id)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity z-20 p-1"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )

      case "icon-centered":
        return (
          <div className="relative h-[350px] rounded-xl overflow-hidden bg-white shadow-md p-6 flex flex-col items-center text-center group">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
              style={{ backgroundColor: card.color }}
            >
              {card.icon &&
                React.createElement(card.icon, {
                  className: "w-10 h-10 text-white",
                })}
            </div>
            <span className="text-sm font-medium mb-2" style={{ color: card.color }}>
              {card.category}
            </span>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">{card.title}</h3>
            <p className="text-gray-600 mb-6">{card.description}</p>
            <div className="mt-auto">
              {isActive && (
                <button
                  className="px-4 py-2 font-medium rounded-lg text-white transition-colors"
                  style={{ backgroundColor: card.color }}
                >
                  {card.buttonText}
                </button>
              )}
            </div>
            {/* Delete button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => handleDeleteCard(e, card.id)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity z-20 p-1"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )

      case "split-content":
        return (
          <div className="relative h-[350px] rounded-xl overflow-hidden bg-white shadow-md flex flex-col md:flex-row group">
            <div className="md:w-1/2 p-6 flex flex-col" style={{ backgroundColor: card.color }}>
              <span className="text-sm font-medium text-white/80 mb-2">{card.category}</span>
              <h3 className="text-2xl font-bold text-white mb-3">{card.title}</h3>
              <p className="text-white/70 mb-6">{card.description}</p>
              <div className="mt-auto">
                {isActive && (
                  <button className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-opacity-90 transition-colors">
                    {card.buttonText}
                  </button>
                )}
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <Image src={card.image || "/placeholder.svg"} alt={card.title} fill className="object-cover" />
            </div>
            {/* Delete button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => handleDeleteCard(e, card.id)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity z-20 p-1"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )

      case "stat-card":
        return (
          <div className="relative h-[350px] rounded-xl overflow-hidden bg-white shadow-md p-6 flex flex-col group">
            <span className="text-sm font-medium mb-2" style={{ color: card.color }}>
              {card.category}
            </span>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">{card.title}</h3>
            <p className="text-gray-600 mb-6">{card.description}</p>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl font-bold" style={{ color: card.color }}>
                {card.statNumber}
              </span>
              <span className="text-gray-500">{card.statLabel}</span>
            </div>
            <div className="mt-auto">
              {isActive && (
                <button
                  className="px-4 py-2 font-medium rounded-lg text-white transition-colors"
                  style={{ backgroundColor: card.color }}
                >
                  {card.buttonText}
                </button>
              )}
            </div>
            {/* Delete button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => handleDeleteCard(e, card.id)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity z-20 p-1"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )

      case "feature-card":
        return (
          <div className="relative h-[350px] rounded-xl overflow-hidden bg-white shadow-md p-6 flex flex-col group">
            <span className="text-sm font-medium mb-2" style={{ color: card.color }}>
              {card.category}
            </span>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">{card.title}</h3>
            <p className="text-gray-600 mb-6">{card.description}</p>
            <ul className="space-y-2 mb-6">
              {card.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: card.color }}></div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto">
              {isActive && (
                <button
                  className="px-4 py-2 font-medium rounded-lg text-white transition-colors"
                  style={{ backgroundColor: card.color }}
                >
                  {card.buttonText}
                </button>
              )}
            </div>
            {/* Delete button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => handleDeleteCard(e, card.id)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity z-20 p-1"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )

      case "image-overlay":
        return (
          <div className="relative h-[350px] rounded-xl overflow-hidden shadow-md group">
            <Image src={card.image || "/placeholder.svg"} alt={card.title} fill className="object-cover" />
            <div className="absolute inset-0" style={{ backgroundColor: `${card.color}99` }}></div>
            <div className="absolute inset-0 p-6 flex flex-col">
              <span className="text-sm font-medium text-white/80 mb-2">{card.category}</span>
              <h3 className="text-2xl font-bold text-white mb-3">{card.title}</h3>
              <p className="text-white/70 mb-6">{card.description}</p>
              <div className="mt-auto">
                {isActive && (
                  <button className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-opacity-90 transition-colors">
                    {card.buttonText}
                  </button>
                )}
              </div>
            </div>
            {/* Delete button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => handleDeleteCard(e, card.id)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity z-20 p-1"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )

      case "minimal-card":
        return (
          <div
            className="relative h-[350px] rounded-xl overflow-hidden bg-white shadow-md p-6 flex flex-col border-t-4 group"
            style={{ borderColor: card.color }}
          >
            <div className="flex items-center gap-3 mb-4">
              {card.icon &&
                React.createElement(card.icon, {
                  className: "w-6 h-6",
                  style: { color: card.color },
                })}
              <span className="text-sm font-medium" style={{ color: card.color }}>
                {card.category}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">{card.title}</h3>
            <p className="text-gray-600 mb-6">{card.description}</p>
            <div className="mt-auto">
              {isActive && (
                <button
                  className="px-4 py-2 font-medium rounded-lg text-white transition-colors"
                  style={{ backgroundColor: card.color }}
                >
                  {card.buttonText}
                </button>
              )}
            </div>
            {/* Delete button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => handleDeleteCard(e, card.id)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity z-20 p-1"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[500px] overflow-hidden bg-gray-50 dark:bg-gray-900 rounded-xl p-8"
    >
      <div className="relative z-10 h-full flex flex-col">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Cybersecurity Trends</h2>

        <div className="flex-1 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {streakCards.map((card, index) => {
                // Calculate position relative to active card
                const position = (index - activeIndex + streakCards.length) % streakCards.length
                const isActive = position === 0
                const isVisible = position === 0 || position === 1 || position === streakCards.length - 1

                // Calculate offset for positioning
                let xOffset = 0
                if (position === 0) xOffset = 0
                else if (position === 1) xOffset = 300
                else if (position === streakCards.length - 1) xOffset = -300
                else if (position < streakCards.length - 1) xOffset = 600
                else xOffset = -600

                return (
                  <motion.div
                    key={card.id}
                    className={`absolute top-0 w-full max-w-md ${isActive ? "z-20" : "z-10"}`}
                    initial={{ opacity: 0, x: 1000 }}
                    animate={{
                      opacity: isVisible ? 1 : 0,
                      x: xOffset,
                      scale: isActive ? 1 : 0.8,
                      filter: isActive ? "brightness(1.1)" : "brightness(0.9)",
                    }}
                    exit={{ opacity: 0, x: -1000 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <Link
                      href={card.link}
                      className="block group hover:scale-[1.02] transition-all duration-300"
                      onMouseEnter={() => setAutoPlay(false)}
                      onMouseLeave={() => setAutoPlay(true)}
                    >
                      {renderCard(card, isActive)}
                    </Link>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={prevCard}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextCard}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Dot navigation */}
        <div className="flex justify-center gap-2 mt-6">
          {streakCards.map((_, index) => (
            <button
              key={index}
              onClick={() => goToCard(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeIndex ? "bg-white w-8" : "bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
