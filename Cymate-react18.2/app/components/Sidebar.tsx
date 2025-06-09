"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Home, BoxIcon as Toolbox, Users, Lightbulb, Plus, ArrowLeft, Wrench, Sparkles, Sliders, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const navItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: Toolbox, label: "Toolkit", href: "/toolkit" },
  { icon: Users, label: "Community", href: "/community" },
  { icon: Plus, label: "Create", href: "/create", special: true },
  {
    icon: Lightbulb,
    label: "Innovation",
    href: "#",
    subItems: [
      { icon: Sparkles, label: "Inspiration", href: "/innovation/inspiration" },
      { icon: Wrench, label: "Tools", href: "/innovation/tools" },
    ],
  },
  { icon: Sliders, label: "Control Panel", href: "/control-panel" },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const isHome = pathname === "/"
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkIfMobile()

    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (isMobileMenuOpen && !target.closest(".sidebar") && !target.closest(".burger-menu")) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobileMenuOpen])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Add this useEffect to handle the custom event from Navbar
  useEffect(() => {
    const handleToggleSidebar = () => {
      toggleMobileMenu()
    }

    window.addEventListener("toggle-sidebar", handleToggleSidebar)

    return () => {
      window.removeEventListener("toggle-sidebar", handleToggleSidebar)
    }
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const sidebarContent = (
    <>
      {!isHome && (
        <button
          onClick={() => router.back()}
          className="w-12 h-12 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-white hover:bg-purple-500 rounded-lg transition-all duration-200 mt-4 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}
      {navItems.map((item, index) => {
        const isActive = pathname === item.href || (item.subItems && item.subItems.some((sub) => pathname === sub.href))
        return (
          <div
            key={index}
            className={`relative group mb-6 ${item.special ? "mt-2 mb-8" : ""}`}
            onMouseEnter={() => setHoveredItem(item.label)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Link
              href={item.href === "#" ? (item.subItems ? item.subItems[0].href : "/") : item.href}
              className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 
                ${
                  isActive
                    ? "bg-purple-500 text-white"
                    : "text-gray-600 dark:text-gray-400 hover:bg-purple-500 hover:text-white"
                }
                ${item.special ? "w-14 h-14 shadow-lg shadow-purple-500/30 dark:shadow-purple-700/30 relative z-10" : ""}
              `}
            >
              {item.special && (
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-400 to-blue-500 opacity-80 blur-[2px] animate-pulse"></div>
              )}
              <item.icon className={`${item.special ? "w-7 h-7 relative z-10" : "w-5 h-5"}`} />
              {item.subItems && <div className="w-1 h-1 bg-current rounded-full mt-1" />}
              <span className="absolute -bottom-5 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap bg-purple-500 text-white px-2 py-1 rounded-md">
                {item.label}
              </span>
            </Link>

            {/* Sub-items */}
            <AnimatePresence>
              {hoveredItem === item.label && item.subItems && item.label !== "Control Panel" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute left-full ml-2 top-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 w-48 z-50"
                >
                  {item.subItems.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      href={subItem.href}
                      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-200"
                    >
                      <subItem.icon className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">{subItem.label}</span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </>
  )

  // Mobile sidebar
  const mobileSidebar = (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="sidebar fixed inset-y-0 left-0 z-[100] w-16 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 backdrop-filter backdrop-blur-lg border-r border-gray-200 dark:border-gray-700 flex flex-col items-center pt-16"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-blue-500/5 pointer-events-none" />
          <button
            onClick={toggleMobileMenu}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <X className="w-4 h-4" />
          </button>
          {sidebarContent}
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Desktop sidebar
  const desktopSidebar = (
    <nav className="sidebar hidden md:flex w-16 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 backdrop-filter backdrop-blur-lg border-r border-gray-200 dark:border-gray-700 h-full flex-col items-center relative z-10">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-blue-500/5 pointer-events-none" />
      {sidebarContent}
    </nav>
  )

  return (
    <>
      {mobileSidebar}
      {desktopSidebar}
    </>
  )
}
