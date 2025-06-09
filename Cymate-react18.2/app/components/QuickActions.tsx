import { Play, Users, Lightbulb, User } from "lucide-react"
import Link from "next/link"

const actions = [
  { icon: Play, label: "Run Tool", color: "bg-blue-500", href: "/toolkit" },
  { icon: Users, label: "Community Space", color: "bg-yellow-500", href: "/community" },
  { icon: Lightbulb, label: "Innovation Library", color: "bg-green-500", href: "/innovation" },
  { icon: User, label: "Portfolio", color: "bg-purple-500", href: "/portfolio" },
]

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <Link
          key={index}
          href={action.href}
          className={`${action.color} text-white p-6 rounded-lg flex flex-col items-center justify-center transition-transform duration-200 hover:scale-105 h-32`}
        >
          <action.icon className="w-8 h-8 mb-3" />
          <span className="text-sm font-medium text-center">{action.label}</span>
        </Link>
      ))}
    </div>
  )
}
