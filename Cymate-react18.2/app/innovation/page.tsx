import BentoCard from "../components/BentoCard"
import StreaksSection from "../components/StreaksSection"
import { Search } from "lucide-react"

const projects = [
  {
    title: "AI-Powered Threat Detection",
    description: "Developing an AI system to detect and respond to cyber threats in real-time.",
  },
  {
    title: "Blockchain for Secure Communication",
    description: "Exploring the use of blockchain technology for secure, decentralized communication.",
  },
  {
    title: "Quantum-Resistant Encryption",
    description: "Research into encryption methods that can withstand attacks from quantum computers.",
  },
]

export default function InnovationStation() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Innovation Station</h1>
      <StreaksSection />
      <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-md p-2">
        <Search className="text-gray-400 mr-2" />
        <input type="text" placeholder="Search projects..." className="w-full outline-none bg-transparent" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <BentoCard key={index}>
            <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
            <button className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors">
              Explore Details
            </button>
          </BentoCard>
        ))}
      </div>
    </div>
  )
}
