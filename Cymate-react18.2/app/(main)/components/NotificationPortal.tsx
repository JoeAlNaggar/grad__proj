"use client"

import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { 
  X, 
  MessageCircle, 
  Share2, 
  Heart, 
  AtSign, 
  UserPlus, 
  Bell, 
  User, 
  Clock, 
  Eye, 
  CheckCircle,
  ThumbsUp,
  ThumbsDown,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { markNotificationAsRead, markAllNotificationsAsRead, getImageUrl } from "@/app/services/api"
import { toast } from "sonner"
import type { Notification } from "../../types/Notification"

interface NotificationPortalProps {
  isOpen: boolean
  onClose: () => void
  notifications: Notification[]
  buttonRect: DOMRect | null
  onNotificationClick?: (notification: Notification) => void
  onNotificationUpdate?: (updatedNotifications: Notification[]) => void
  isLoading?: boolean
}

const NotificationItem = ({ 
  notification, 
  onClick, 
  onMarkAsRead 
}: { 
  notification: Notification; 
  onClick: () => void;
  onMarkAsRead: () => void;
}) => {
  const [isMarkingRead, setIsMarkingRead] = useState(false)

  // Get icon and color for notification type
  const getNotificationIcon = (notification: Notification) => {
    const { notification_type, liked, disliked, thundered } = notification
    
    // For reaction notifications, use the specific action icon
    if (notification_type === 'like' || notification_type === 'react') {
      if (thundered) {
        return { icon: <Zap className="w-5 h-5" />, color: "#F97316" } // Orange for thunder
      } else if (liked) {
        return { icon: <ThumbsUp className="w-5 h-5" />, color: "#22C55E" } // Green for like
      } else if (disliked) {
        return { icon: <ThumbsDown className="w-5 h-5" />, color: "#EF4444" } // Red for dislike
      }
      // Fallback for generic like
      return { icon: <Heart className="w-5 h-5" />, color: "#EF4444" }
    }
    
    // For other notification types
    switch (notification_type) {
      case 'comment':
        return { icon: <MessageCircle className="w-5 h-5" />, color: "#3B82F6" }
      case 'share':
        return { icon: <Share2 className="w-5 h-5" />, color: "#10B981" }
      case 'mention':
        return { icon: <AtSign className="w-5 h-5" />, color: "#8B5CF6" }
      case 'follow':
        return { icon: <UserPlus className="w-5 h-5" />, color: "#6366F1" }
      default:
        return { icon: <Bell className="w-5 h-5" />, color: "#6B7280" }
    }
  }

  // Format timestamp to relative time
  const formatTimestamp = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return 'now'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes}m`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours}h`
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days}d`
    } else {
      return time.toLocaleDateString()
    }
  }

  // Get sender display name
  const getSenderDisplayName = (sender: Notification['sender']) => {
    if (sender.first_name || sender.last_name) {
      return `${sender.first_name} ${sender.last_name}`.trim()
    }
  }
  const getSenderUsername = (sender: Notification['sender']) => {
      return sender.username
  }
  

  // Generate dynamic notification message based on action
  const getNotificationMessage = (notification: Notification) => {
    const { notification_type, liked, disliked, thundered, sender } = notification
    const senderName = getSenderUsername(sender)
    
    // For reaction notifications, generate specific message
    if (notification_type === 'like' || notification_type === 'react') {
      if (thundered) {
        return `${senderName} thundered your post`
      } else if (liked) {
        return `${senderName} liked your post`
      } else if (disliked) {
        return `${senderName} disliked your post`
      }
    }
    
    // Fallback to the original message from backend
    return notification.message
  }

  const handleMarkAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (notification.is_read || isMarkingRead) return

    setIsMarkingRead(true)
    try {
      await markNotificationAsRead(notification.id)
      onMarkAsRead()
      toast.success("Notification marked as read")
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
      toast.error("Failed to mark notification as read")
    } finally {
      setIsMarkingRead(false)
    }
  }

  const { icon, color } = getNotificationIcon(notification)

  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full cursor-pointer overflow-hidden rounded-lg p-3 mb-2",
        "transition-all duration-200 ease-in-out hover:scale-[102%]",
        notification.is_read 
          ? "bg-gray-50 dark:bg-gray-700/50" 
          : "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500",
        "[box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        "transform-gpu dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      )}
      onClick={onClick}
    >
      <div className="flex flex-row items-start gap-3">
        {/* Notification type icon */}
        <div
          className="flex size-8 items-center justify-center rounded-lg flex-shrink-0"
          style={{ backgroundColor: color + "20", color: color }}
        >
          {icon}
        </div>

        {/* Sender avatar */}
        <div className="flex-shrink-0">
          {notification.sender.profile_picture ? (
            <img
              src={getImageUrl(notification.sender.profile_picture) || "/placeholder-user.jpg"}
              alt={getSenderDisplayName(notification.sender)}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </div>
          )}
        </div>

        {/* Notification content */}
        <div className="flex flex-col overflow-hidden flex-1">
          <div className="flex flex-row items-center justify-between">
            <figcaption className="flex flex-row items-center whitespace-pre text-sm font-medium dark:text-white">
              <span className="truncate">{getSenderDisplayName(notification.sender)}</span>
            </figcaption>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTimestamp(notification.created_at)}
              </span>
              {/* Mark as read button */}
              {!notification.is_read && (
                <button
                  onClick={handleMarkAsRead}
                  disabled={isMarkingRead}
                  className="text-gray-400 hover:text-blue-500 transition-colors p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30"
                  title="Mark as read"
                >
                  {isMarkingRead ? (
                    <div className="w-3 h-3 animate-spin rounded-full border border-blue-500 border-t-transparent"></div>
                  ) : (
                    <Eye className="w-3 h-3" />
                  )}
                </button>
              )}
              {notification.is_read ? (
                <CheckCircle className="w-3 h-3 text-green-500" />
              ) : (
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
              )}
            </div>
          </div>
          <p className="text-xs font-normal dark:text-white/60 text-gray-700 mt-1 break-words">
            {getNotificationMessage(notification)}
          </p>
          {notification.post && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
              on "{notification.post.title || notification.post.content.substring(0, 30) + '...'}"
            </p>
          )}
        </div>
      </div>
    </figure>
  )
}

export default function NotificationPortal({
  isOpen,
  onClose,
  notifications,
  buttonRect,
  onNotificationClick,
  onNotificationUpdate,
  isLoading = false,
}: NotificationPortalProps) {
  const [mounted, setMounted] = useState(false)
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) return null

  // Calculate position based on button rect
  const top = buttonRect ? buttonRect.bottom + window.scrollY + 8 : 80
  const right = buttonRect ? window.innerWidth - buttonRect.right - window.scrollX : 20

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read when clicked (if not already read)
    if (!notification.is_read && onNotificationUpdate) {
      try {
        await markNotificationAsRead(notification.id)
        const updatedNotifications = notifications.map(n => 
          n.id === notification.id ? { ...n, is_read: true } : n
        )
        toast.success("Notification marked as read")
        onNotificationUpdate(updatedNotifications)
      } catch (error) {
        console.error('Failed to mark notification as read:', error)
      }
    }

    // Navigate to the post using post_id (priority) or post.id (fallback)
    const postId = notification.post_id || notification.post?.id
    if (postId) {
      onClose() // Close the portal before navigation
      router.push(`/community/post/${postId}`)
    } else {
      toast.info('No associated post found')
    }
  }

  const handleNotificationMarkAsRead = (notificationId: string) => {
    if (onNotificationUpdate) {
      const updatedNotifications = notifications.map(n => 
        n.id === notificationId ? { ...n, is_read: true } : n
      )
      onNotificationUpdate(updatedNotifications)
    }
  }

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.is_read)
    if (unreadNotifications.length === 0) return

    setIsMarkingAllRead(true)
    try {
      await markAllNotificationsAsRead()
      if (onNotificationUpdate) {
        const updatedNotifications = notifications.map(n => ({ ...n, is_read: true }))
        onNotificationUpdate(updatedNotifications)
      }
      toast.success(`Marked ${unreadNotifications.length} notifications as read`)
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
      toast.error("Failed to mark all notifications as read")
    } finally {
      setIsMarkingAllRead(false)
    }
  }

  const handleViewAll = () => {
    router.push('/notifications')
    onClose()
  }

  // Show only first 5 notifications in portal
  const displayNotifications = notifications.slice(0, 5)
  const unreadCount = notifications.filter(n => !n.is_read).length

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-[9999]"
            onClick={onClose}
            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
          />

          {/* Notification panel */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed z-[10000] w-96 max-w-[95vw] bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden"
            style={{
              top: `${top}px`,
              right: `${right}px`,
              maxHeight: "calc(100vh - 100px)",
            }}
          >
            <div className="sticky top-0 flex justify-between items-center p-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {/* Mark All as Read Button */}
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    disabled={isMarkingAllRead}
                    className="text-xs text-blue-500 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors flex items-center gap-1"
                    title="Mark all as read"
                  >
                    {isMarkingAllRead ? (
                      <div className="w-3 h-3 animate-spin rounded-full border border-blue-500 border-t-transparent"></div>
                    ) : (
                      <CheckCircle className="w-3 h-3" />
                    )}
                    Mark all read
                  </button>
                )}
                <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto p-2" style={{ maxHeight: "calc(100vh - 150px)" }}>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <>
                  {displayNotifications.map((notification) => (
                    <NotificationItem 
                      key={notification.id} 
                      notification={notification} 
                      onClick={() => {
                        handleNotificationClick(notification)
                      }}
                      onMarkAsRead={() => handleNotificationMarkAsRead(notification.id)}
                    />
                  ))}

                  {displayNotifications.length === 0 && (
                    <div className="p-4 text-center text-gray-500">
                      <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No notifications yet</p>
                    </div>
                  )}
                </>
              )}

              {notifications.length > 5 && (
                <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleViewAll}
                    className="w-full text-center text-blue-500 hover:text-blue-700 text-sm py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    View all {notifications.length} notifications
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  )
}
