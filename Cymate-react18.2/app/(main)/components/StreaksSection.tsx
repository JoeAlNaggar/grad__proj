"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, Key, ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface StreakCard {
  id: number;
  type: string;
  title: string;
  description: string;
  image?: string;
  icon?: React.ComponentType<any>;
  color: string;
  category: string;
  link: string;
  buttonText: string;
  statNumber?: string;
  statLabel?: string;
  features?: string[];
}

// Inspiration cards from the inspiration page
const initialStreakCards: StreakCard[] = [
  {
    id: 1,
    type: "full-image",
    title: "Zero Trust Architecture",
    description: "Zero Trust Architecture redefines cybersecurity by assuming no user or device is inherently trustworthy.",
    image: "/inspiration_imgs/1.jpg",
    color: "#4361ee",
    category: "Cybersecurity",
    link: "/innovation/inspiration?card=1",
    buttonText: "Read More",
  },
  {
    id: 2,
    type: "full-image",
    title: "AI-Powered Threat Detection",
    description: "Artificial Intelligence is revolutionizing cybersecurity with advanced threat detection capabilities.",
    image: "/inspiration_imgs/2.jpg",
    color: "#7209b7",
    category: "AI Security",
    link: "/innovation/inspiration?card=2",
    buttonText: "Explore AI",
  },
  {
    id: 3,
    type: "full-image",
    title: "Cloud Security Best Practices",
    description: "As organizations migrate to the cloud, robust security practices are essential.",
    image: "/inspiration_imgs/3.jpg",
    color: "#3a0ca3",
    category: "Cloud Security",
    link: "/innovation/inspiration?card=3",
    buttonText: "Learn Best Practices",
  },
  {
    id: 4,
    type: "full-image",
    title: "Ransomware Defense Strategies",
    description: "Ransomware remains a top cybersecurity threat, costing billions annually.",
    image: "/inspiration_imgs/4.jpg",
    color: "#f72585",
    category: "Defense",
    link: "/innovation/inspiration?card=4",
    buttonText: "Get Protected",
  },
  {
    id: 5,
    type: "full-image",
    title: "Quantum Cryptography Advances",
    description: "Quantum cryptography promises unbreakable security through quantum key distribution.",
    image: "/inspiration_imgs/5.jpg",
    color: "#560bad",
    category: "Quantum",
    link: "/innovation/inspiration?card=5",
    buttonText: "Discover Future",
  },
]

export default function StreaksSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const [streakCards, setStreakCards] = useState<StreakCard[]>(initialStreakCards)
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
  const renderCard = (card: StreakCard, isActive: boolean) => {
    switch (card.type) {
      case "full-image":
        return (
          <div
            className="relative h-[350px] rounded-xl overflow-hidden bg-white shadow-md group"
            style={{ backgroundColor: card.color }}
          >
            <div className="absolute inset-0">
              <Image src={card.image || "/placeholder.svg"} alt={card.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/60"></div>
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
            {/* <Button
              variant="ghost"
              size="icon"
              onClick={(e) => handleDeleteCard(e, card.id)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity z-20 p-1"
            >
              <Trash2 className="w-4 h-4" />
            </Button> */}
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
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Latest Inspiration</h2>

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
