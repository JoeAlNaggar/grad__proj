"use client"
import { ExternalLink, Zap, AlertTriangle } from "lucide-react"

interface AdCardProps {
  title: string
  description: string
  imageUrl: string
  link: string
  tags: string[]
}

export default function AdCard({ title, description, imageUrl, link, tags }: AdCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col border-2 border-blue-500">
      <div className="bg-blue-500 text-white text-xs font-bold px-2 py-1">Sponsored</div>
      <img src={imageUrl || "/placeholder.svg"} alt={title} className="w-full h-40 object-cover" />
      <div className="p-4 flex-grow">
        <h3 className="font-bold text-lg mb-2 text-blue-600">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black text-white">Ad</span>
          {tags.slice(1).map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-700">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="px-4 pb-4">
        {/* <div className="flex justify-between items-center mb-2">
          <button className="flex items-center space-x-1 text-gray-500">
            <Zap size={16} />
            <span>0</span>
          </button>
          <button className="text-gray-500 hover:text-red-500" title="Report this ad">
            <AlertTriangle size={16} />
          </button>
        </div> */}
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors w-full justify-center"
        >
          Learn More
          <ExternalLink size={16} className="ml-2" />
        </a>
      </div>
    </div>
  )
}
