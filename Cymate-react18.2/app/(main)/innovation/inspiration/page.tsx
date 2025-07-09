"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { XCircle, Search, X, MoveHorizontalIcon as AdjustmentsHorizontalIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter, useSearchParams } from "next/navigation"

interface Card {
  id: number
  title: string
  author: string
  image: string
  content: string
  tags: string[]
  date: Date
  readTime: number
}

// Helper function to calculate read time
const calculateReadTime = (content: string): number => {
  return Math.ceil(content.length / 1000)
}

const dummyCards: Card[] = [
  {
    id: 1,
    title: "Zero Trust Architecture",
    author: "CyMate",
    image: "/inspiration_imgs/1.jpg",
    tags: ["cybersecurity", "zero-trust", "best-practices"],
    content: "Zero Trust Architecture redefines cybersecurity by assuming no user or device is inherently trustworthy. This inspiration explores core principles like continuous verification, least privilege access, and micro-segmentation. It highlights how organizations can implement Zero Trust to protect against insider threats and external attacks. Key components include identity and access management (IAM), endpoint security, and real-time monitoring. Practical steps for adoption, such as assessing current infrastructure and integrating Zero Trust solutions, are discussed, emphasizing its role in modern hybrid work environments.",
    date: new Date(2025, 6, 7), // July 7, 2025 (newest)
    readTime: 1
  },
  {
    id: 2,
    title: "AI-Powered Threat Detection",
    author: "CyMate",
    image: "/inspiration_imgs/2.jpg",
    tags: ["cybersecurity", "artificial-intelligence", "threat-detection"],
    content: "Artificial Intelligence is revolutionizing cybersecurity with advanced threat detection capabilities. This inspiration examines how AI analyzes vast datasets to identify anomalies, predict attacks, and automate responses. Machine learning models excel at detecting phishing, malware, and insider threats by recognizing patterns invisible to traditional systems. The content covers AI's integration with Security Information and Event Management (SIEM) tools, challenges like false positives, and ethical considerations. Organizations adopting AI-driven security can enhance response times and reduce human error, making it a critical trend in 2025.",
    date: new Date(2025, 6, 6), // July 6, 2025
    readTime: 1
  },
  {
    id: 3,
    title: "Cloud Security Best Practices",
    author: "CyMate",
    image: "/inspiration_imgs/3.jpg",
    tags: ["cybersecurity", "cloud-security", "best-practices"],
    content: "As organizations migrate to the cloud, robust security practices are essential. This inspiration outlines strategies for securing cloud environments, including shared responsibility models, encryption, and secure API configurations. It discusses the importance of regular audits, compliance with standards like GDPR and CCPA, and the use of Cloud Security Posture Management (CSPM) tools. Real-world examples illustrate common vulnerabilities like misconfigured S3 buckets and how to mitigate them. By prioritizing visibility and automation, businesses can safeguard data and applications in multi-cloud setups.",
    date: new Date(2025, 6, 5), // July 5, 2025
    readTime: 2
  },
  {
    id: 4,
    title: "Ransomware Defense Strategies",
    author: "CyMate",
    image: "/inspiration_imgs/4.jpg",
    tags: ["cybersecurity", "ransomware", "defense"],
    content: "Ransomware remains a top cybersecurity threat, costing billions annually. This inspiration details proactive defense strategies, including regular backups, endpoint detection and response (EDR), and employee training to combat phishing. It explores the role of network segmentation in limiting attack spread and the importance of incident response plans. Advanced techniques, such as deception technology and threat intelligence, are also covered. By combining prevention, detection, and recovery measures, organizations can minimize the impact of ransomware and maintain operational resilience.",
    date: new Date(2025, 6, 4), // July 4, 2025
    readTime: 2
  },
  {
    id: 5,
    title: "Quantum Cryptography Advances",
    author: "CyMate",
    image: "/inspiration_imgs/5.jpg",
    tags: ["cybersecurity", "quantum-cryptography", "innovation"],
    content: "Quantum cryptography promises unbreakable security through quantum key distribution (QKD). This inspiration explores how quantum mechanics enhances encryption, rendering traditional attacks obsolete. It covers practical implementations, such as satellite-based QKD and fiber-optic networks, alongside challenges like scalability and cost. The content also addresses the threat quantum computing poses to current encryption standards and how post-quantum cryptography complements QKD. As quantum technology matures, it will play a pivotal role in securing sensitive data across industries.",
    date: new Date(2025, 6, 3), // July 3, 2025
    readTime: 3
  },
  {
    id: 6,
    title: "Secure DevOps Practices",
    author: "CyMate",
    image: "/inspiration_imgs/6.jpg",
    tags: ["cybersecurity", "devops", "best-practices"],
    content: "Secure DevOps integrates security into the software development lifecycle. This inspiration highlights practices like shift-left security, where vulnerabilities are addressed early in coding. It covers tools for static and dynamic analysis, container security, and CI/CD pipeline protection. The importance of collaboration between development, operations, and security teams is emphasized, along with automation to streamline compliance. By embedding security into DevOps workflows, organizations can deliver secure applications faster while reducing risks in production environments.",
    date: new Date(2025, 6, 2), // July 2, 2025
    readTime: 2
  },
  {
    id: 7,
    title: "IoT Security Challenges",
    author: "CyMate",
    image: "/inspiration_imgs/7.jpg",
    tags: ["cybersecurity", "iot", "challenges"],
    content: "The proliferation of IoT devices introduces unique security challenges. This inspiration examines risks like weak authentication, unpatched firmware, and insecure communication protocols. It discusses strategies for securing IoT ecosystems, including device identity management, encryption, and network segmentation. Standards like MQTT and CoAP are explored for secure data transmission. The content also addresses the role of edge computing in reducing attack surfaces. By adopting robust IoT security measures, organizations can protect connected devices and prevent large-scale breaches.",
    date: new Date(2025, 6, 1), // July 1, 2025
    readTime: 1
  },
  {
    id: 8,
    title: "Phishing Prevention Techniques",
    author: "CyMate",
    image: "/inspiration_imgs/8.jpg",
    tags: ["cybersecurity", "phishing", "prevention"],
    content: "Phishing attacks exploit human vulnerabilities, making prevention critical. This inspiration covers techniques like email filtering, DMARC implementation, and user awareness training. It explores advanced methods, such as AI-driven phishing detection and behavioral analysis, to identify sophisticated attacks. The content emphasizes the importance of multi-layered defenses, including secure email gateways and two-factor authentication. By fostering a security-conscious culture and leveraging technology, organizations can significantly reduce the success rate of phishing campaigns.",
    date: new Date(2025, 5, 30), // June 30, 2025
    readTime: 2
  },
  {
    id: 9,
    title: "Endpoint Security Evolution",
    author: "CyMate",
    image: "/inspiration_imgs/9.jpg",
    tags: ["cybersecurity", "endpoint-security", "trends"],
    content: "Endpoint security has evolved to address modern threats like remote work and BYOD policies. This inspiration explores next-generation endpoint protection platforms (EPP) that combine antivirus, EDR, and threat hunting. It discusses the role of AI in detecting zero-day attacks and the importance of patch management. The content also covers challenges like securing diverse devices and integrating endpoints with SOC workflows. By adopting advanced endpoint security, organizations can protect against sophisticated threats in distributed environments.",
    date: new Date(2025, 5, 29), // June 29, 2025
    readTime: 4
  },
  {
    id: 10,
    title: "Data Privacy Regulations",
    author: "CyMate",
    image: "/inspiration_imgs/10.jpg",
    tags: ["cybersecurity", "data-privacy", "compliance"],
    content: "Data privacy regulations like GDPR, CCPA, and DPDP shape cybersecurity strategies. This inspiration examines how organizations ensure compliance through data minimization, consent management, and encryption. It discusses the role of Data Protection Officers (DPOs) and automated compliance tools in navigating complex regulatory landscapes. The content highlights penalties for non-compliance and best practices for conducting Data Protection Impact Assessments (DPIAs). By prioritizing privacy, businesses can build trust and avoid costly legal repercussions.",
    date: new Date(2025, 5, 28), // June 28, 2025
    readTime: 2
  },
  {
    id: 11,
    title: "Supply Chain Security",
    author: "CyMate",
    image: "/inspiration_imgs/11.jpg",
    tags: ["cybersecurity", "supply-chain", "risk-management"],
    content: "Supply chain attacks exploit vulnerabilities in third-party vendors. This inspiration explores strategies for securing supply chains, including vendor risk assessments, contractual security clauses, and continuous monitoring. It discusses high-profile incidents like SolarWinds and lessons learned. The content covers Software Bill of Materials (SBOM) for transparency and the role of zero-trust in vendor interactions. By strengthening supply chain security, organizations can mitigate risks and protect critical systems from cascading attacks.",
    date: new Date(2025, 5, 27), // June 27, 2025
    readTime: 1
  },
  {
    id: 12,
    title: "Cybersecurity Awareness Training",
    author: "CyMate",
    image: "/inspiration_imgs/12.jpg",
    tags: ["cybersecurity", "training", "awareness"],
    content: "Human error remains a leading cause of breaches, making cybersecurity awareness training vital. This inspiration outlines effective training programs that teach employees to recognize phishing, secure passwords, and follow policies. It explores gamification and simulated attacks to engage learners. The content emphasizes continuous education to keep pace with evolving threats and metrics to measure training impact. By fostering a security-first culture, organizations can empower employees to act as the first line of defense against cyberattacks.",
    date: new Date(2025, 5, 26), // June 26, 2025 (oldest)
    readTime: 2
  }
];

const InspirationPage: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilterInput, setShowFilterInput] = useState(false)
  const [filterTags, setFilterTags] = useState<string[]>([])
  const [filterInput, setFilterInput] = useState("")
  const filterRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check for card ID in URL parameters
    const cardId = searchParams.get('card')
    if (cardId) {
      const id = parseInt(cardId)
      if (dummyCards.find(card => card.id === id)) {
        setSelectedCard(id)
      }
    }
  }, [searchParams])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilterInput(false)
      }
      
      // Close modal when clicking outside
      if (modalRef.current && !modalRef.current.contains(event.target as Node) && selectedCard !== null) {
        setSelectedCard(null)
        // Remove card parameter from URL
        const url = new URL(window.location.href)
        url.searchParams.delete('card')
        router.replace(url.pathname + (url.search ? url.search : ''))
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [selectedCard, router])

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
    (card) =>
      (searchQuery === "" ||
        card.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filterTags.length === 0 ||
        filterTags.every((tag) => card.tags.some((cardTag) => cardTag.toLowerCase().includes(tag))))
  )

  const handleCardClick = (cardId: number) => {
    setSelectedCard(cardId)
    // Add card parameter to URL
    const url = new URL(window.location.href)
    url.searchParams.set('card', cardId.toString())
    router.replace(url.pathname + url.search)
  }

  const closeModal = () => {
    setSelectedCard(null)
    // Remove card parameter from URL
    const url = new URL(window.location.href)
    url.searchParams.delete('card')
    router.replace(url.pathname + (url.search ? url.search : ''))
  }

  const currentCard = selectedCard !== null ? dummyCards.find(card => card.id === selectedCard) : null

  return (
    <div className="p-8 bg-gray-50 min-h-screen dark:bg-gray-900">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl mx-auto">
        <header className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 dark:text-white">Inspiration Station</h1>
          <p className="text-gray-600 dark:text-gray-300">Ignite your tech creativity with cybersecurity and development inspiration</p>
      </header>

        <div className="flex flex-col gap-4">
        <div className="relative">
          <Input
              placeholder="Search by title..."
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

          <div className="flex flex-wrap gap-2">
          {filterTags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="px-3 py-1 rounded-full bg-purple-500 text-white text-sm flex items-center"
                style={{ boxShadow: 'none' }}
              >
              {tag}
                <button onClick={() => removeTag(tag)} className="ml-2 focus:outline-none">
                  <X className="h-3 w-3" />
              </button>
              </Badge>
          ))}
        </div>
      </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 max-w-7xl mx-auto">
        {filteredCards.map((card) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-[1.02] h-[450px] flex flex-col"
            onClick={() => handleCardClick(card.id)}
            style={{ boxShadow: 'none' }}
          >
            <div className="relative h-48 w-full">
              <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
            </div>

            <div className="p-4 flex flex-col flex-grow">
              <div className="flex items-center gap-3 mb-3">
                <img 
                  src="/favicon.ico" 
                  alt="CyMate"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">CyMate</span>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{card.title}</h3>
              
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3 flex-grow">{card.content.substring(0, 120)}...</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {card.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs"
                    style={{ boxShadow: 'none' }}
                  >
                    {tag}
                  </span>
                ))}
                {card.tags.length > 2 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs">
                    +{card.tags.length - 2} more
                  </span>
                        )}
                      </div>
              
              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mt-auto">
                <time>{card.date.toLocaleDateString()}</time>
                <span>{card.readTime} min read</span>
              </div>
          </div>
          </motion.div>
        ))}
      </div>

      {selectedCard !== null && currentCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[400]">
          <div
            ref={modalRef}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative border border-gray-200 dark:border-gray-600" 
            style={{ boxShadow: 'none' }}
          >
                <img
              src={currentCard.image}
              alt={currentCard.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
            
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/favicon.ico" 
                alt="CyMate"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">By CyMate</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <time>{currentCard.date.toLocaleDateString()}</time>
                  <span>{currentCard.readTime} min read</span>
                </div>
              </div>
                </div>
            
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              {currentCard.title}
            </h2>
            
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{currentCard.content}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {currentCard.tags.map((tag, index) => (
                            <span
                  key={index}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  style={{ boxShadow: 'none' }}
                >
                  {tag}
                              </span>
                            ))}
            </div>
            
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
              style={{ boxShadow: 'none' }}
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default InspirationPage
