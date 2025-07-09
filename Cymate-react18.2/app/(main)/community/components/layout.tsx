import type React from "react"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="dark:bg-transparent min-h-screen ">
      <main className="container mx-auto px-4 ">
        {children}
      </main>

      {/* Dark mode background effects */}
      {/* <div className="fixed inset-0 -z-10 dark:bg-gray-900">
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-1/4 h-1/4 bg-pink-500/10 rounded-full filter blur-3xl animate-pulse delay-2000"></div>
      </div> */}
    </div>
  )
}
