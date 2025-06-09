"use client"

import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface Notification {
  name: string
  description: string
  icon: string
  color: string
  time: string
}

interface NotificationPortalProps {
  isOpen: boolean
  onClose: () => void
  notifications: Notification[]
  buttonRect: DOMRect | null
  onAddNotification?: (notification: Notification) => void
}

const NotificationItem = ({ name, description, icon, color, time }: Notification) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4 mb-2",
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        "bg-white dark:bg-gray-800 [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        "transform-gpu dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: color,
          }}
        >
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white ">
            <span className="text-sm sm:text-lg">{name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500">{time}</span>
          </figcaption>
          <p className="text-sm font-normal dark:text-white/60">{description}</p>
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
  onAddNotification,
}: NotificationPortalProps) {
  const [mounted, setMounted] = useState(false)
  const [allNotifications, setAllNotifications] = useState<Notification[]>(notifications)

  useEffect(() => {
    setMounted(true)

    // Set up event listener for custom notification events
    const handleNotificationEvent = (event: CustomEvent) => {
      if (event.detail && onAddNotification) {
        onAddNotification(event.detail)
      }
    }

    window.addEventListener("notification", handleNotificationEvent as EventListener)

    return () => {
      setMounted(false)
      window.removeEventListener("notification", handleNotificationEvent as EventListener)
    }
  }, [onAddNotification])

  // Update notifications when prop changes
  useEffect(() => {
    setAllNotifications(notifications)
  }, [notifications])

  if (!mounted) return null

  // Calculate position based on button rect
  const top = buttonRect ? buttonRect.bottom + window.scrollY + 8 : 80
  const right = buttonRect ? window.innerWidth - buttonRect.right - window.scrollX : 20

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
              <h3 className="font-medium">Notifications</h3>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto p-2" style={{ maxHeight: "calc(100vh - 150px)" }}>
              {allNotifications.map((notification, index) => (
                <NotificationItem key={index} {...notification} />
              ))}

              {allNotifications.length === 0 && <div className="p-4 text-center text-gray-500">No notifications</div>}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  )
}
