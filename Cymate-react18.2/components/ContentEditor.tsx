"use client"

import { useState } from "react"
import { Plus, FileText, Calendar, HelpCircle, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const contentTypes = [
  { type: "Post", icon: MessageSquare },
  { type: "Blog", icon: FileText },
  { type: "Event", icon: Calendar },
  { type: "Question", icon: HelpCircle },
]

export default function ContentEditor() {
  const [isOpen, setIsOpen] = useState(false)
  const [showList, setShowList] = useState(false)
  const [contentType, setContentType] = useState("")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [location, setLocation] = useState("")
  const [dateTime, setDateTime] = useState("")
  const [invitationRequired, setInvitationRequired] = useState(false)
  const [attendanceFee, setAttendanceFee] = useState("")

  const handleContentTypeChange = (type: string) => {
    setContentType(type)
    setTags([type])
    setIsOpen(true)
    setShowList(false)
  }

  const handlePublish = () => {
    // Implement publishing logic here
    console.log("Publishing:", {
      contentType,
      title,
      content,
      tags,
      location,
      dateTime,
      invitationRequired,
      attendanceFee,
    })
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="rounded-full w-12 h-12 bg-purple-500 hover:bg-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        onClick={() => setShowList(!showList)}
      >
        <Plus className="w-6 h-6" />
      </Button>
      {showList && (
        <div className="absolute left-0 bottom-16 w-48 rounded-md shadow-lg bg-white/10 backdrop-filter backdrop-blur-lg border border-white/20 ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {contentTypes.map((item) => (
              <button
                key={item.type}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                role="menuitem"
                onClick={() => handleContentTypeChange(item.type)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.type}
              </button>
            ))}
          </div>
        </div>
      )}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New {contentType}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
            <Textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="col-span-3"
            />
            {contentType === "Event" && (
              <>
                <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
                <Input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
                <div className="flex items-center space-x-2">
                  <Switch checked={invitationRequired} onCheckedChange={setInvitationRequired} />
                  <label>Invitation Required</label>
                </div>
                <Input
                  placeholder="Attendance Fee"
                  value={attendanceFee}
                  onChange={(e) => setAttendanceFee(e.target.value)}
                />
              </>
            )}
            <Button onClick={handlePublish}>Publish</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
