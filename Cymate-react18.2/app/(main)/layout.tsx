import type React from "react"
import "../globals.css"
import { Inter } from "next/font/google"
import Sidebar from "./components/Sidebar"
import Navbar from "./components/Navbar"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "CyMate",
  description: "Advanced cybersecurity platform for professionals",
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${inter.className} bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-br from-purple-300/20 via-violet-300/20 to-pink-300/20 dark:from-purple-900/20 dark:via-violet-900/20 dark:to-pink-900/20 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-purple-300/20 via-violet-300/20 to-pink-300/20 dark:from-purple-900/20 dark:via-violet-900/20 dark:to-pink-900/20 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-1/4 h-1/4 bg-gradient-to-br from-purple-300/20 via-violet-300/20 to-pink-300/20 dark:from-purple-900/20 dark:via-violet-900/20 dark:to-pink-900/20 rounded-full opacity-40 blur-3xl"></div>
      </div>
      <div className="relative z-10 flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
        </div>
      </div>
      <Toaster richColors />
    </div>
  )
}
