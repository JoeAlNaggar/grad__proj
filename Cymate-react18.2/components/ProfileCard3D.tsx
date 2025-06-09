"use client"

import type React from "react"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Briefcase, Clock } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import QRCode from "./QRCode"
import Image from "next/image"

interface ProfileCard3DProps {
  profile: {
    fullName: string
    username: string
    jobTitle: string
    jobStatus: string
    brief: string
    yearsOfExperience: string
    email: string
    phoneNumber: string
    profileImage: File | null
  }
}

export default function ProfileCard3D({ profile }: ProfileCard3DProps) {
  const [showQR, setShowQR] = useState(false)
  const [copyAnimation, setCopyAnimation] = useState(false)
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"])

  useEffect(() => {
    if (profile.profileImage) {
      const url = URL.createObjectURL(profile.profileImage)
      setProfileImageUrl(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [profile.profileImage])

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopyAnimation(true)
    toast({
      title: "Link Copied!",
      description: "Your portfolio link has been copied to the clipboard.",
    })
    setTimeout(() => setCopyAnimation(false), 500)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className="relative w-full max-w-sm mx-auto h-[400px] rounded-xl"
    >
      <div
        style={{
          transform: "translateZ(75px)",
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-0 glassmorphism rounded-xl p-6 shadow-2xl shadow-black overflow-hidden"
      >
        <div className="relative z-10 flex flex-col items-start gap-4 h-full">
          {profileImageUrl && (
            <div className="absolute inset-0 z-0">
              <Image
                src={profileImageUrl || "/placeholder.svg"}
                alt="Profile"
                layout="fill"
                objectFit="cover"
                className="filter blur-2xl opacity-50"
              />
            </div>
          )}
          <div className="relative z-10 flex flex-col items-start gap-4 h-full">
            <div className="flex items-center gap-4 w-full">
              <div
                className="w-20 h-20 rounded-xl overflow-hidden"
                style={{
                  transform: "translateZ(25px)",
                }}
              >
                {profileImageUrl ? (
                  <Image
                    src={profileImageUrl || "/placeholder.svg"}
                    alt="Profile"
                    width={80}
                    height={80}
                    objectFit="cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl font-bold text-white">
                    {profile.fullName[0]}
                  </div>
                )}
              </div>
              <div
                className="flex-1"
                style={{
                  transform: "translateZ(50px)",
                }}
              >
                <h2 className="text-2xl font-bold text-white">{profile.fullName}</h2>
                <p className="text-purple-200/80">@{profile.username}</p>
                <p className="text-purple-200/80">{profile.jobTitle}</p>
                <Badge variant="secondary" className="mt-1 bg-violet-500/50 text-white">
                  {profile.jobStatus}
                </Badge>
              </div>
            </div>

            <div
              className="text-sm text-white/80"
              style={{
                transform: "translateZ(25px)",
              }}
            >
              {profile.brief}
            </div>

            <div
              className="text-sm text-white/60 space-y-1 mt-auto"
              style={{
                transform: "translateZ(25px)",
              }}
            >
              <p className="flex items-center">
                <Mail className="w-4 h-4 mr-2" /> {profile.email}
              </p>
              <p className="flex items-center">
                <Phone className="w-4 h-4 mr-2" /> {profile.phoneNumber}
              </p>
              <p className="flex items-center">
                <Briefcase className="w-4 h-4 mr-2" /> {profile.jobTitle}
              </p>
              <p className="flex items-center">
                <Clock className="w-4 h-4 mr-2" /> {profile.yearsOfExperience} years of experience
              </p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-2 right-2 text-xl font-['Bagel_Fat_One']">
          <span className="text-purple-600">Cy</span>Mate
        </div>
      </div>

      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Portfolio QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <QRCode />
            <Button
              onClick={() => {
                toast({
                  title: "QR Code Downloaded",
                  description: "Your portfolio QR code has been downloaded.",
                })
              }}
            >
              Download QR Code
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
