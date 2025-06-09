"use client"

import { usePathname, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BackNavigation() {
  const pathname = usePathname()
  const router = useRouter()

  // Only show on non-home pages
  if (pathname === "/") return null

  return (
    <div className="fixed left-20 top-4 z-50">
      <Button
        variant="ghost"
        size="icon"
        className="bg-white/5 backdrop-blur-lg rounded-full p-2 hover:bg-white/10 transition-all duration-200 dark:shadow-[0_0_15px_rgba(124,58,237,0.1)]"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="sr-only">Go back</span>
      </Button>
    </div>
  )
}
