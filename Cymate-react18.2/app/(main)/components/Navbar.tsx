"use client"

import { Bell, Search, User, X, Menu, LogOut, Settings, Crown, CreditCard  } from "lucide-react"
import NightModeToggle from "./NightModeToggle"
import Link from "next/link"
import Logo from "./Logo"
import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"
import NotificationPortal from "./NotificationPortal"
import { useAuth } from "../../contexts/AuthContext"
import { useRouter } from "next/navigation"
import type { Notification } from "../../types/Notification"
import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead
} from "../../services/api"
import { toast } from "sonner"

export default function Navbar() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const [showNotifications, setShowNotifications] = useState(false)
  const [currentTokens, setCurrentTokens] = useState<number | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [notificationsLoading, setNotificationsLoading] = useState(false)
  const [showProfileCard, setShowProfileCard] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLButtonElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [notificationButtonRect, setNotificationButtonRect] = useState<DOMRect | null>(null)

  // Fetch notifications when component mounts and initialize token count
  useEffect(() => {
    if (user) {
      fetchNotifications()
      setCurrentTokens(user.toolkit_tokens)
    }
  }, [user])

  const fetchNotifications = async () => {
    try {
      setNotificationsLoading(true)
      const response = await getNotifications()
      setNotifications(response.results)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setNotificationsLoading(false)
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

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

  // Listen for token updates from toolkit scans
  useEffect(() => {
    const handleTokensUpdated = (event: CustomEvent) => {
      const newTokenCount = event.detail.tokens;
      console.log('🔄 Navbar received token update:', newTokenCount);
      
      // Update local token count for immediate UI update
      setCurrentTokens(newTokenCount);
    }

    window.addEventListener("tokensUpdated", handleTokensUpdated as EventListener)

    return () => {
      window.removeEventListener("tokensUpdated", handleTokensUpdated as EventListener)
    }
  }, [])

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Handle clicks outside of components
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close profile card if clicked outside
      if (showProfileCard && profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileCard(false)
      }

      // Close search if clicked outside
      if (isSearchActive && searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchActive(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showProfileCard, isSearchActive])

  // Handle ESC key for search
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isSearchActive) {
        setIsSearchActive(false)
      }
    }

    document.addEventListener("keydown", handleEscKey)

    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isSearchActive])

  // Focus search input when expanded
  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchActive])

  const toggleSearch = () => {
    if (isMobile) {
      setIsSearchExpanded(!isSearchExpanded)
    }
    setIsSearchActive(!isSearchActive)
  }

  const toggleNotifications = () => {
    if (notificationRef.current) {
      setNotificationButtonRect(notificationRef.current.getBoundingClientRect())
    }
    setShowNotifications(!showNotifications)
    setShowProfileCard(false)
    
    // Refresh notifications when opening
    if (!showNotifications) {
      fetchNotifications()
    }
  }

  const toggleProfileCard = () => {
    setShowProfileCard(!showProfileCard)
    setShowNotifications(false)
  }

  // Handle notification click - navigate to post and mark as read
  const handleNotificationClick = async (notification: Notification) => {
    try {
      // Mark notification as read if not already read
      if (!notification.is_read) {
        await markNotificationAsRead(notification.id)
        // Update local state
        setNotifications(prev => 
          prev.map(n => 
            n.id === notification.id 
              ? { ...n, is_read: true }
              : n
          )
        )
      }

      // Navigate to the post if it exists
      if (notification.post) {
        router.push(`/community/post/${notification.post.id}`)
      } else {
        toast.info('No associated post found')
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
      toast.error('Failed to process notification')
    }
  }

  // Handle notification updates from the portal
  const handleNotificationUpdate = (updatedNotifications: Notification[]) => {
    setNotifications(updatedNotifications)
  }

  const handleLogout = async () => {
    setShowProfileCard(false)
    await logout()
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return "U"
    const firstName = user.first_name || ""
    const lastName = user.last_name || ""
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || user.username?.charAt(0).toUpperCase() || "U"
  }

  const getDisplayName = () => {
    if (!user) return "User"
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`
    }
    return user.username || "User"
  }

  // Calculate unread notifications count
  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <>
      <nav className="z-[300] bg-white dark:bg-gray-800 bg-opacity-10 backdrop-filter backdrop-blur-lg border-b border-white border-opacity-20 dark:border-gray-700 py-4 px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {isMobile && (
            <button
              className="burger-menu relative z-50 w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 md:hidden"
              onClick={() => {
                const event = new CustomEvent("toggle-sidebar")
                window.dispatchEvent(event)
              }}
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6 text-purple-500" />
            </button>
          )}
          <Logo />
        </div>

        <div className="flex items-center space-x-4">
          
          <div className="relative">
            <button
              ref={notificationRef}
              className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 relative"
              onClick={toggleNotifications}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </div>

          <NightModeToggle />

          <div ref={profileRef} className="relative">
            <button
              className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              onClick={toggleProfileCard}
              onMouseEnter={() => setShowProfileCard(true)}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage 
                  src={user?.profile_picture || "/placeholder-user.jpg"} 
                  alt={getDisplayName()}
                />
                <AvatarFallback className="bg-purple-500 text-white text-sm">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </button>

            <AnimatePresence>
              {showProfileCard && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-[9999] overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <Avatar className="h-12 w-12 ">
                        <AvatarImage 
                          src={user?.profile_picture || "/placeholder-user.jpg"} 
                          alt={getDisplayName()}
                        />
                        <AvatarFallback className="bg-purple-500 text-white">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                          {getDisplayName()}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          @{user?.username || "User"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-[10px]">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Toolkit Tokens Remaining</span>
                        <span className="text-green-600 dark:text-green-400">{currentTokens ?? user?.toolkit_tokens ?? 0}/{(() => {
                          const tokens = currentTokens ?? user?.toolkit_tokens ?? 0;
                          if (tokens <= 50) return 50;       // Free tier
                          if (tokens <= 250) return 250;    // Premium tier (50 + 200)
                          return 1050;                       // Ultra tier (50 + 1000)
                        })()}</span>
                      </div>
                      <div className=" w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-300"
                          style={{ width: `${(() => {
                            const tokens = currentTokens ?? user?.toolkit_tokens ?? 0;
                            const maxTokens = tokens <= 50 ? 50 : tokens <= 250 ? 250 : 1050;
                            return (tokens / maxTokens) * 100;
                          })()}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 py-2">
                  <Link
                      href="/settings?tab=account&subtab=billing"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      <span>Purchase Toolkit Tokens</span>
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      <span>Manage Settings</span>
                    </Link>
                    <Link
                      href={`/profile/${user?.username}`}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <User className="w-4 h-4 mr-2" />
                      <span>View Your Profile</span>
                    </Link>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* Notification Portal */}
      <NotificationPortal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        buttonRect={notificationButtonRect}
        onNotificationClick={handleNotificationClick}
        onNotificationUpdate={handleNotificationUpdate}
        isLoading={notificationsLoading}
      />

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchActive && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-[150]"
              onClick={() => setIsSearchActive(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-20 left-1/2 transform -translate-x-1/2 w-11/12 max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-[200] p-6"
            >
              <div className="flex items-center">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search for tools, guides, or security topics..."
                    className="w-full py-3 pl-10 pr-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 transition-all duration-300 ease-in-out"
                  />
                </div>
                <button
                  className="ml-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                  onClick={() => setIsSearchActive(false)}
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Recent Searches</h3>
                <div className="space-y-2">
                  <div className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                    <Search className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">Vulnerability scanning</span>
                  </div>
                  <div className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                    <Search className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">Malware detection</span>
                  </div>
                  <div className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                    <Search className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">Network security</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
