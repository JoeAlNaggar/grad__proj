"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Trash2, 
  Bell, 
  CheckCheck, 
  MessageCircle, 
  Share2, 
  Heart, 
  AtSign, 
  UserPlus, 
  ThumbsUp,
  ThumbsDown,
  Zap,
  Clock,
  User
} from "lucide-react"
import { toast } from "sonner"
import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  getImageUrl
} from "../../services/api"
import type { Notification } from "../../types/Notification"

const NotificationsList: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [markingAllAsRead, setMarkingAllAsRead] = useState(false)
  const notificationListRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await getNotifications()
      setNotifications(response.results)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  // Get icon for notification type based on action
  const getNotificationIcon = (notification: Notification) => {
    const { notification_type, liked, disliked, thundered } = notification
    
    // For reaction notifications, use the specific action icon
    if (notification_type === 'like' || notification_type === 'react') {
      if (thundered) {
        return <Zap className="w-5 h-5 text-orange-500" />
      } else if (liked) {
        return <ThumbsUp className="w-5 h-5 text-green-500" />
      } else if (disliked) {
        return <ThumbsDown className="w-5 h-5 text-red-500" />
      }
      // Fallback for generic like
      return <Heart className="w-5 h-5 text-red-500" />
    }
    
    // For other notification types
    switch (notification_type) {
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-blue-500" />
      case 'share':
        return <Share2 className="w-5 h-5 text-green-500" />
      case 'mention':
        return <AtSign className="w-5 h-5 text-purple-500" />
      case 'follow':
        return <UserPlus className="w-5 h-5 text-indigo-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  // Format timestamp to relative time
  const formatTimestamp = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return 'just now'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes}m ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours}h ago`
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days}d ago`
    } else {
      return time.toLocaleDateString()
    }
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

      // Navigate to the post using post_id (priority) or post.id (fallback)
      const postId = notification.post_id || notification.post?.id
      if (postId) {
        router.push(`/community/post/${postId}`)
      } else {
        toast.info('No associated post found')
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
      toast.error('Failed to process notification')
    }
  }

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAllAsRead(true)
      await markAllNotificationsAsRead()
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      )
      
      toast.success('All notifications marked as read')
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
      toast.error('Failed to mark all notifications as read')
    } finally {
      setMarkingAllAsRead(false)
    }
  }

  // Get sender display name
  const getSenderDisplayName = (sender: Notification['sender']) => {
    if (sender.first_name || sender.last_name) {
      return `${sender.first_name} ${sender.last_name}`.trim()
    }
    return sender.username
  }

  // Get sender profile image
  const getSenderProfileImage = (sender: Notification['sender']) => {
    return sender.profile_picture || sender.profile_image || "/placeholder-user.jpg"
  }

  // Generate dynamic notification message based on action
  const getNotificationMessage = (notification: Notification) => {
    const { notification_type, liked, disliked, thundered, sender } = notification
    const senderName = getSenderDisplayName(sender)
    
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

  if (loading) {
    return (
      <div className="relative bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg p-4" style={{ boxShadow: 'none' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Bell className="w-6 h-6 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Notifications</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 dark:border-purple-400"></div>
        </div>
      </div>
    )
  }

  const unreadNotifications = notifications.filter(n => !n.is_read)

  return (
    <div className="relative bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg p-4" style={{ boxShadow: 'none' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Bell className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Notifications</h2>
            {unreadNotifications.length > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {unreadNotifications.length} unread
              </p>
            )}
          </div>
        </div>
        
        {unreadNotifications.length > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            disabled={markingAllAsRead}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            <CheckCheck className="w-4 h-4" />
            {markingAllAsRead ? 'Marking...' : 'Mark all read'}
          </button>
        )}
      </div>

      <div ref={notificationListRef} className="overflow-y-auto max-h-96 space-y-2 pr-2">
        <AnimatePresence>
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <motion.div
                key={notification.id}
                className={`p-3 rounded-md flex items-start gap-3 cursor-pointer transition-colors duration-200 group ${
                  notification.is_read 
                    ? 'bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700' 
                    : 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                }`}
                onClick={() => handleNotificationClick(notification)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Notification type icon */}
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification)}
                </div>

                {/* Sender avatar */}
                <div className="flex-shrink-0">
                  <img
                    src={getImageUrl(getSenderProfileImage(notification.sender)) || "/placeholder-user.jpg"}
                    alt={getSenderDisplayName(notification.sender)}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== `${window.location.origin}/placeholder-user.jpg`) {
                        target.src = "/placeholder-user.jpg";
                      }
                    }}
                  />
                </div>

                {/* Notification content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 dark:text-white break-words">
                    {getNotificationMessage(notification)}
                  </p>
                  
                  {notification.post && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                      on "{notification.post.title || notification.post.content.substring(0, 50) + '...'}"
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTimestamp(notification.created_at)}
                    </span>
                    {!notification.is_read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {notifications.length > 10 && (
        <div className="mt-4 text-center">
          <button
            onClick={fetchNotifications}
            className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            Refresh notifications
          </button>
        </div>
      )}
    </div>
  )
}

export default NotificationsList
