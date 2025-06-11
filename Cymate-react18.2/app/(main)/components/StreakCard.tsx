import type { ReactNode } from "react"
import Link from "next/link"

interface StreakCardProps {
  headline: string
  summary: string
  icon: ReactNode
  link: string
}

export default function StreakCard({ headline, summary, icon, link }: StreakCardProps) {
  return (
    <Link href={link} className="block">
      <div className="glassmorphism rounded-xl p-4 h-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] dark:hover:shadow-[0_0_20px_rgba(0,255,255,0.1)] cursor-pointer">
        <div className="flex items-center mb-2">
          <div className="mr-2 text-blue-400 dark:text-blue-300">{icon}</div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{headline}</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{summary}</p>
        <span className="text-blue-500 dark:text-blue-400 text-sm font-semibold">Read more →</span>
      </div>
    </Link>
  )
}
