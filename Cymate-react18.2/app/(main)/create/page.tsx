"use client"

import type React from "react"

import { useState, useRef } from "react"
import {
  X,
  Code,
  File,
  ImageIcon,
  Link,
  Type,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  BarChart,
  Smile,
  Crop,
  MousePointerClick,
  Clock,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import "./styles.css"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { Checkbox } from "@/components/ui/checkbox"

const contentTypes = ["Post", "Blog", "Event", "Question", "Tool", "Inspiration", "Ads", "Streaks"]

const expirationOptions = [
  { value: "30m", label: "30 Minutes" },
  { value: "1h", label: "1 Hour" },
  { value: "1d", label: "1 Day" },
  { value: "1w", label: "1 Week" },
  { value: "1m", label: "1 Month" },
  { value: "6m", label: "6 Months" },
  { value: "1y", label: "1 Year" },
]

interface ButtonOptions {
  color: string
  textColor: string
  position: "left" | "center" | "right"
  width: string
  placeholder: string
  link: string
  borderRadius: string
}

interface ContentCard {
  id: string
  type: "code" | "file" | "media" | "link" | "title" | "poll" | "button"
  content: string | File[] | null
  title?: string
  textStyle?: "regular" | "bold" | "extrabold" | "italic-bold"
  currentIndex?: number
  language?: string
  textColor?: string
  buttonOptions?: ButtonOptions
}

interface ContentBlock {
  id: string
  type: "text" | "card" | "poll"
  content: string | ContentCard | Poll
}

interface PollOption {
  id: string
  text: string
  votes: number
}

interface Poll {
  question: string
  options: PollOption[]
  multipleChoice: boolean
}

const PollCreator = ({
  onCreatePoll,
}: { onCreatePoll: (question: string, options: string[], multipleChoice: boolean) => void }) => {
  const [question, setQuestion] = useState("")
  const [options, setOptions] = useState(["", ""])
  const [multipleChoice, setMultipleChoice] = useState(false)

  const addOption = () => {
    if (options.length < 5) {
      setOptions([...options, ""])
    }
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const createPoll = () => {
    if (question && options.filter(Boolean).length >= 2) {
      onCreatePoll(question, options.filter(Boolean), multipleChoice)
    }
  }

  return (
    <div className="space-y-4">
      <Input placeholder="Enter your question" value={question} onChange={(e) => setQuestion(e.target.value)} />
      {options.map((option, index) => (
        <Input
          key={index}
          placeholder={`Option ${index + 1}`}
          value={option}
          onChange={(e) => updateOption(index, e.target.value)}
        />
      ))}
      {options.length < 5 && (
        <Button onClick={addOption} variant="outline">
          Add Option
        </Button>
      )}
      <div className="flex items-center space-x-2">
        <Switch id="multiple-choice" checked={multipleChoice} onCheckedChange={setMultipleChoice} />
        <Label htmlFor="multiple-choice">Allow multiple choices</Label>
      </div>
      <Button onClick={createPoll}>Create Poll</Button>
    </div>
  )
}

export default function CreateContent() {
  const [contentType, setContentType] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([])
  const contentRef = useRef<HTMLDivElement>(null)
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null)
  const [isBackgroundBlurred, setIsBackgroundBlurred] = useState(true)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [currentEmojiTarget, setCurrentEmojiTarget] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [showPollCreator, setShowPollCreator] = useState(false)
  const [poll, setPoll] = useState<Poll | null>(null)
  const [backgroundType, setBackgroundType] = useState<"image" | "video">("image")
  const [textColor, setTextColor] = useState<string>("#000000")
  const [expirationTime, setExpirationTime] = useState<string>("1w")

  const isPublishable = () => {
    if (contentType === "Ads" || contentType === "Streaks") {
      return contentType !== "" && contentBlocks.length > 0
    }

    return (
      contentType !== "" &&
      tags.length >= 4 && // At least 3 tags plus the content type tag
      contentBlocks.length > 0 && // At least one content block
      contentBlocks.some(
        (
          block, // At least one block has content
        ) =>
          block.type === "text"
            ? (block.content as string).trim() !== ""
            : (block.content as ContentCard).content !== null,
      )
    )
  }

  const handleContentTypeChange = (value: string) => {
    setContentType(value)
    setTags([value])

    // Reset background type when changing content type
    setBackgroundType("image")
  }

  const handleAddTag = () => {
    if (newTag.trim() !== "" && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    if (tagToRemove !== contentType) {
      setTags(tags.filter((tag) => tag !== tagToRemove))
    }
  }

  const handleAddCard = (type: ContentCard["type"]) => {
    const newCard: ContentCard = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: type === "media" || type === "file" ? [] : "",
      title: type === "code" ? "" : undefined,
      textStyle: type === "title" ? "italic-bold" : undefined,
      currentIndex: 0,
      language: type === "code" ? "text" : undefined,
    }
    const newBlock: ContentBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type: "card",
      content: newCard,
    }
    setContentBlocks([...contentBlocks, newBlock])
  }

  const handleUpdateCard = (cardId: string, field: keyof ContentCard, value: any) => {
    setContentBlocks((blocks) =>
      blocks.map((block) =>
        block.type === "card" && (block.content as ContentCard).id === cardId
          ? { ...block, content: { ...(block.content as ContentCard), [field]: value } }
          : block,
      ),
    )
  }

  const handleFileSelection = (cardId: string, files: FileList | null, type: "media" | "file") => {
    if (!files) return

    const maxFiles = type === "media" ? 10 : 5
    const existingFiles =
      ((
        contentBlocks.find((block) => block.type === "card" && (block.content as ContentCard).id === cardId)
          ?.content as ContentCard
      )?.content as File[]) || []

    const newFiles = Array.from(files)
    const combinedFiles = [...existingFiles, ...newFiles].slice(0, maxFiles)

    handleUpdateCard(cardId, "content", combinedFiles)
  }

  const handleNavigateMedia = (cardId: string, direction: "prev" | "next") => {
    const card = contentBlocks.find((block) => block.type === "card" && (block.content as ContentCard).id === cardId)
      ?.content as ContentCard

    if (!card || !Array.isArray(card.content)) return

    const newIndex = direction === "next" ? (card.currentIndex || 0) + 1 : (card.currentIndex || 0) - 1

    if (newIndex >= 0 && newIndex < card.content.length) {
      handleUpdateCard(cardId, "currentIndex", newIndex)
    }
  }

  const handleRemoveCard = (cardId: string) => {
    setContentBlocks((blocks) =>
      blocks.filter((block) => block.type !== "card" || (block.content as ContentCard).id !== cardId),
    )
  }

  const handleMoveCard = (cardId: string, direction: "up" | "down") => {
    const index = contentBlocks.findIndex(
      (block) => block.type === "card" && (block.content as ContentCard).id === cardId,
    )
    if (index === -1) return

    const newBlocks = [...contentBlocks]
    const block = newBlocks[index]

    if (direction === "up" && index > 0) {
      newBlocks.splice(index, 1)
      newBlocks.splice(index - 1, 0, block)
    } else if (direction === "down" && index < newBlocks.length - 1) {
      newBlocks.splice(index, 1)
      newBlocks.splice(index + 1, 0, block)
    }

    setContentBlocks(newBlocks)
  }

  const handleContentChange = (index: number, value: string) => {
    const newBlocks = [...contentBlocks]
    if (newBlocks[index].type === "text") {
      newBlocks[index].content = value
    }
    setContentBlocks(newBlocks)
  }

  const handleAddTextBlock = () => {
    const newBlock: ContentBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type: "text",
      content: "",
    }
    setContentBlocks([...contentBlocks, newBlock])
  }

  const handleBackgroundImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBackgroundImage(e.target.files[0])
    }
  }

  const handleCropImage = () => {
    // Implement image cropping logic here
    console.log("Image cropping functionality to be implemented")
  }

  const handlePublish = () => {
    if (!isPublishable()) {
      toast({
        title: "Cannot publish yet",
        description: "Please select a content type, add at least 3 more tags, and add some content before publishing.",
        variant: "destructive",
      })
      return
    }

    // Handle publishing logic here
    console.log({
      contentType,
      title,
      content: contentBlocks,
      tags,
      backgroundImage,
      poll,
      expirationTime: contentType === "Ads" || contentType === "Streaks" ? expirationTime : null,
    })

    toast({
      title: "Content published!",
      description: "Your content has been published successfully.",
    })
  }

  const handleEmojiSelect = (emoji: any) => {
    if (currentEmojiTarget.startsWith("title-")) {
      const cardId = currentEmojiTarget.replace("title-", "")
      const titleCard = contentBlocks.find(
        (block) => block.type === "card" && (block.content as ContentCard).id === cardId,
      ) as { content: ContentCard } | undefined
      if (titleCard) {
        handleUpdateCard(cardId, "content", ((titleCard.content.content as string) || "") + emoji.native)
      }
    } else {
      const textBlock = contentBlocks.find((block) => block.id === currentEmojiTarget)
      if (textBlock && textBlock.type === "text") {
        handleContentChange(contentBlocks.indexOf(textBlock), (textBlock.content as string) + emoji.native)
      }
    }
    setShowEmojiPicker(false)
  }

  const toggleEmojiPicker = (target: string) => {
    setCurrentEmojiTarget(target)
    setShowEmojiPicker(!showEmojiPicker)
  }

  const removeTextBlock = (blockId: string) => {
    setContentBlocks((blocks) => blocks.filter((block) => block.id !== blockId))
  }

  const handleMovePoll = (direction: "up" | "down") => {
    const pollIndex = contentBlocks.findIndex((block) => block.type === "poll")
    if (pollIndex === -1) return

    const newBlocks = [...contentBlocks]
    const pollBlock = newBlocks[pollIndex]

    if (direction === "up" && pollIndex > 0) {
      newBlocks.splice(pollIndex, 1)
      newBlocks.splice(pollIndex - 1, 0, pollBlock)
    } else if (direction === "down" && pollIndex < newBlocks.length - 1) {
      newBlocks.splice(pollIndex, 1)
      newBlocks.splice(pollIndex + 1, 0, pollBlock)
    }

    setContentBlocks(newBlocks)
  }

  const handleRemovePoll = () => {
    setContentBlocks((blocks) => blocks.filter((block) => block.type !== "poll"))
    setPoll(null)
  }

  const renderCard = (card: ContentCard) => {
    return (
      <Card key={card.id} className="mb-4 bg-white dark:bg-gray-800 shadow-neumorphic dark:shadow-neumorphic-dark">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            {card.type === "title" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Select
                    value={card.textStyle}
                    onValueChange={(value) => handleUpdateCard(card.id, "textStyle", value)}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Text style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="italic-bold">Italic Bold</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                      <SelectItem value="extrabold">Extra Bold</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`text-color-${card.id}`} className="text-sm">
                      Text Color:
                    </Label>
                    <Input
                      id={`text-color-${card.id}`}
                      type="color"
                      value={card.textColor || "#000000"}
                      onChange={(e) => handleUpdateTextColor(card.id, e.target.value)}
                      className="w-10 h-8 p-0 border-0"
                    />
                  </div>
                </div>
                <div className="relative">
                  <Input
                    placeholder="Enter title..."
                    value={card.content as string}
                    onChange={(e) => handleUpdateCard(card.id, "content", e.target.value)}
                    className={cn(
                      "bg-transparent border-0 p-0 focus-visible:ring-0",
                      card.textStyle === "italic-bold" && "font-bold italic",
                      card.textStyle === "bold" && "font-bold",
                      card.textStyle === "extrabold" && "font-extrabold text-2xl",
                    )}
                    style={{ color: card.textColor || "inherit" }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleEmojiPicker(`title-${card.id}`)}
                    className="absolute right-0 top-0 h-8 w-8 p-0"
                  >
                    <Smile className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => handleMoveCard(card.id, "up")}>
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleMoveCard(card.id, "down")}>
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleRemoveCard(card.id)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {card.type === "code" && (
            <div className="space-y-4">
              <Select
                value={card.language || "text"}
                onValueChange={(value) => handleUpdateCard(card.id, "language", value)}
              >
                <SelectTrigger className="w-[180px] mb-2">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Plain Text</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="csharp">C#</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="ruby">Ruby</SelectItem>
                  <SelectItem value="go">Go</SelectItem>
                  <SelectItem value="rust">Rust</SelectItem>
                  <SelectItem value="php">PHP</SelectItem>
                  <SelectItem value="swift">Swift</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="sql">SQL</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="css">CSS</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Enter title..."
                value={card.title || ""}
                onChange={(e) => handleUpdateCard(card.id, "title", e.target.value)}
                className="mb-4 bg-[#2d2d2d] border-[#3c3c3c] text-white"
              />
              <div className="relative">
                <Textarea
                  placeholder="// Enter your code here"
                  value={card.content as string}
                  onChange={(e) => handleUpdateCard(card.id, "content", e.target.value)}
                  className="font-mono min-h-[200px] bg-[#1e1e1e] border-[#3c3c3c] text-white resize-none"
                />
                <SyntaxHighlighter
                  language={card.language || "text"}
                  style={{
                    ...vscDarkPlus,
                    comment: { color: "#6A9955" },
                  }}
                  className="!m-0 !bg-[#1e1e1e]"
                >
                  {(card.content as string) || "// Your code here"}
                </SyntaxHighlighter>
              </div>
            </div>
          )}

          {(card.type === "media" || card.type === "file") && (
            <div className="space-y-4">
              <Input
                type="file"
                multiple
                accept={card.type === "media" ? "image/*,video/*" : undefined}
                onChange={(e) => handleFileSelection(card.id, e.target.files, card.type)}
                className="bg-gray-100 dark:bg-gray-700 rounded-md"
              />
              {Array.isArray(card.content) && card.content.length > 0 && (
                <div className="relative">
                  {card.type === "media" && (
                    <div className="aspect-video relative">
                      <img
                        src={URL.createObjectURL(card.content[card.currentIndex || 0])}
                        alt="Media preview"
                        className="w-full h-full object-cover rounded-md"
                      />
                      {card.content.length > 1 && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute left-2 top-1/2 -translate-y-1/2"
                            onClick={() => handleNavigateMedia(card.id, "prev")}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={() => handleNavigateMedia(card.id, "next")}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                  <div className="flex gap-2 mt-2 overflow-x-auto">
                    {card.content.map((file, index) => (
                      <div
                        key={index}
                        className={cn(
                          "w-16 h-16 rounded-md overflow-hidden cursor-pointer border-2",
                          index === card.currentIndex ? "border-purple-500" : "border-transparent",
                        )}
                        onClick={() => handleUpdateCard(card.id, "currentIndex", index)}
                      >
                        {card.type === "media" ? (
                          <img
                            src={URL.createObjectURL(file) || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                            <File className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {card.type === "link" && (
            <Input
              placeholder="Enter URL..."
              value={card.content as string}
              onChange={(e) => handleUpdateCard(card.id, "content", e.target.value)}
              className="bg-gray-100 dark:bg-gray-700 rounded-md"
            />
          )}

          {card.type === "button" && card.buttonOptions && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`button-text-${card.id}`}>Button Text</Label>
                  <Input
                    id={`button-text-${card.id}`}
                    value={card.content as string}
                    onChange={(e) => handleUpdateCard(card.id, "content", e.target.value)}
                    placeholder="Button text"
                  />
                </div>
                <div>
                  <Label htmlFor={`button-link-${card.id}`}>Button Link</Label>
                  <Input
                    id={`button-link-${card.id}`}
                    value={card.buttonOptions.link}
                    onChange={(e) => handleUpdateButtonOptions(card.id, "link", e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <Label htmlFor={`button-color-${card.id}`}>Button Color</Label>
                  <Input
                    id={`button-color-${card.id}`}
                    type="color"
                    value={card.buttonOptions.color}
                    onChange={(e) => handleUpdateButtonOptions(card.id, "color", e.target.value)}
                    className="h-10"
                  />
                </div>
                <div>
                  <Label htmlFor={`button-text-color-${card.id}`}>Text Color</Label>
                  <Input
                    id={`button-text-color-${card.id}`}
                    type="color"
                    value={card.buttonOptions.textColor}
                    onChange={(e) => handleUpdateButtonOptions(card.id, "textColor", e.target.value)}
                    className="h-10"
                  />
                </div>
                <div>
                  <Label htmlFor={`button-position-${card.id}`}>Position</Label>
                  <Select
                    value={card.buttonOptions.position}
                    onValueChange={(value: "left" | "center" | "right") =>
                      handleUpdateButtonOptions(card.id, "position", value)
                    }
                  >
                    <SelectTrigger id={`button-position-${card.id}`}>
                      <SelectValue placeholder="Position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`button-width-${card.id}`}>Width</Label>
                  <Select
                    value={card.buttonOptions.width}
                    onValueChange={(value) => handleUpdateButtonOptions(card.id, "width", value)}
                  >
                    <SelectTrigger id={`button-width-${card.id}`}>
                      <SelectValue placeholder="Width" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto</SelectItem>
                      <SelectItem value="full">Full Width</SelectItem>
                      <SelectItem value="1/2">Half Width</SelectItem>
                      <SelectItem value="1/3">One Third</SelectItem>
                      <SelectItem value="2/3">Two Thirds</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`button-radius-${card.id}`}>Border Radius</Label>
                  <Select
                    value={card.buttonOptions.borderRadius}
                    onValueChange={(value) => handleUpdateButtonOptions(card.id, "borderRadius", value)}
                  >
                    <SelectTrigger id={`button-radius-${card.id}`}>
                      <SelectValue placeholder="Border Radius" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">None</SelectItem>
                      <SelectItem value="0.375rem">Small</SelectItem>
                      <SelectItem value="0.5rem">Medium</SelectItem>
                      <SelectItem value="0.75rem">Large</SelectItem>
                      <SelectItem value="9999px">Pill</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div
                className={`flex ${
                  card.buttonOptions.position === "center"
                    ? "justify-center"
                    : card.buttonOptions.position === "right"
                      ? "justify-end"
                      : "justify-start"
                }`}
              >
                <a
                  href={card.buttonOptions.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-block ${
                    card.buttonOptions.width === "full"
                      ? "w-full"
                      : card.buttonOptions.width === "1/2"
                        ? "w-1/2"
                        : card.buttonOptions.width === "1/3"
                          ? "w-1/3"
                          : card.buttonOptions.width === "2/3"
                            ? "w-2/3"
                            : "w-auto"
                  }`}
                >
                  <button
                    style={{
                      backgroundColor: card.buttonOptions.color,
                      color: card.buttonOptions.textColor,
                      borderRadius: card.buttonOptions.borderRadius,
                    }}
                    className="px-4 py-2 w-full transition-all duration-200 hover:opacity-90"
                  >
                    {card.content as string}
                  </button>
                </a>
              </div>
            </div>
          )}

          {card.type === "title" && (
            <div className="relative">
              <Input
                placeholder="Enter title..."
                value={card.content as string}
                onChange={(e) => handleUpdateCard(card.id, "content", e.target.value)}
                className={cn(
                  "bg-transparent border-0 p-0 focus-visible:ring-0",
                  card.textStyle === "italic-bold" && "font-bold italic",
                  card.textStyle === "bold" && "font-bold",
                  card.textStyle === "extrabold" && "font-extrabold text-2xl",
                )}
                style={{ color: card.textColor || "inherit" }}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleEmojiPicker(`title-${card.id}`)}
                className="absolute right-0 top-0 h-8 w-8 p-0"
              >
                <Smile className="h-5 w-5" />
              </Button>
            </div>
          )}
          {card.type === "poll" && <div>{/* Poll content here */}</div>}
        </CardContent>
      </Card>
    )
  }

  const handleMoveBlock = (index: number, direction: "up" | "down") => {
    const newBlocks = [...contentBlocks]
    if (direction === "up" && index > 0) {
      ;[newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]]
    } else if (direction === "down" && index < newBlocks.length - 1) {
      ;[newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]]
    }
    setContentBlocks(newBlocks)
  }

  const removeBlock = (blockId: string) => {
    setContentBlocks((blocks) => blocks.filter((block) => block.id !== blockId))
  }

  const handleCreatePoll = (question: string, options: string[], multipleChoice: boolean) => {
    const newPoll: Poll = {
      question,
      options: options.map((option, index) => ({ id: `option-${index}`, text: option, votes: 0 })),
      multipleChoice,
    }
    const newBlock: ContentBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type: "poll",
      content: newPoll,
    }
    setContentBlocks([...contentBlocks, newBlock])
    setShowPollCreator(false)
  }

  const handleAddButtonCard = () => {
    const newCard: ContentCard = {
      id: Math.random().toString(36).substr(2, 9),
      type: "button",
      content: "Click Me",
      buttonOptions: {
        color: "#3b82f6", // Default blue
        textColor: "#ffffff", // Default white
        position: "center",
        width: "auto",
        placeholder: "Click Me",
        link: "",
        borderRadius: "0.375rem",
      },
    }
    const newBlock: ContentBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type: "card",
      content: newCard,
    }
    setContentBlocks([...contentBlocks, newBlock])
  }

  const handleUpdateButtonOptions = (cardId: string, field: keyof ButtonOptions, value: any) => {
    setContentBlocks((blocks) =>
      blocks.map((block) => {
        if (block.type === "card" && (block.content as ContentCard).id === cardId) {
          const card = block.content as ContentCard
          return {
            ...block,
            content: {
              ...card,
              buttonOptions: {
                ...(card.buttonOptions as ButtonOptions),
                [field]: value,
              },
            },
          }
        }
        return block
      }),
    )
  }

  const handleUpdateTextColor = (cardId: string, color: string) => {
    handleUpdateCard(cardId, "textColor", color)
  }

  return (
    <div className="p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <h2 className="text-3xl font-bold text-center mb-8">Create Content</h2>

        <Card className="p-6 bg-white dark:bg-gray-800 shadow-neumorphic dark:shadow-neumorphic-dark">
          <Select onValueChange={handleContentTypeChange}>
            <SelectTrigger className="w-full mb-4">
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              {contentTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(contentType === "Ads" || contentType === "Streaks") && (
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-5 w-5 text-purple-500" />
                <Label htmlFor="expiration-time" className="font-medium">
                  Content Expiration Time
                </Label>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Set how long this {contentType.toLowerCase()} content will be visible before being automatically
                  removed.
                </p>
                <Select value={expirationTime} onValueChange={setExpirationTime}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select expiration time" />
                  </SelectTrigger>
                  <SelectContent>
                    {expirationOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {contentType !== "Ads" && contentType !== "Streaks" && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className={cn(
                    "flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors",
                    index === 0
                      ? "bg-purple-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600",
                  )}
                >
                  {tag}
                  {index !== 0 && (
                    <X onClick={() => handleRemoveTag(tag)} className="w-3 h-3 cursor-pointer hover:text-red-500" />
                  )}
                </Badge>
              ))}
              <div className="flex-1 flex items-center gap-2">
                <Input
                  placeholder="Add at least 3 tags..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                />
                <Button variant="outline" size="sm" className="rounded-full" onClick={handleAddTag}>
                  Add
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="backgroundType">Background Type</Label>
              <Select value={backgroundType} onValueChange={(value: "image" | "video") => setBackgroundType(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select background type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="backgroundMedia">
                {backgroundType === "image" ? "Background Image" : "Background Video"}
              </Label>
              <Input
                id="backgroundMedia"
                type="file"
                accept={backgroundType === "image" ? "image/*" : "video/*"}
                onChange={
                  backgroundType === "image"
                    ? handleBackgroundImageChange
                    : (e) => {
                        if (e.target.files && e.target.files[0]) {
                          setBackgroundImage(e.target.files[0])
                        }
                      }
                }
              />
            </div>
            <div className="flex items-center space-x-4 mb-4">
              {backgroundImage && backgroundType === "image" && (
                <>
                  <div className="flex items-center space-x-2">
                    <Switch id="blur-toggle" checked={isBackgroundBlurred} onCheckedChange={setIsBackgroundBlurred} />
                    <Label htmlFor="blur-toggle">Blur Background</Label>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleCropImage} className="flex items-center space-x-2">
                    <Crop className="h-4 w-4" />
                    <span>Crop Image</span>
                  </Button>
                </>
              )}
            </div>
          </div>

          <div
            ref={contentRef}
            className="relative bg-white dark:bg-gray-800 rounded-lg p-4 shadow-inner mt-4 min-h-[400px]"
            style={
              backgroundImage
                ? {
                    backgroundImage: `url(${URL.createObjectURL(backgroundImage)})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }
                : {}
            }
          >
            <div
              className={`absolute inset-0 ${isBackgroundBlurred ? "bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm" : ""}`}
            ></div>
            <div className="relative z-10">
              {contentBlocks.map((block, index) => (
                <div key={block.id}>
                  {block.type === "text" ? (
                    <div className="relative mb-4">
                      <div className="flex justify-end mb-2">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor={`block-text-color-${block.id}`} className="text-sm">
                            Text Color:
                          </Label>
                          <Input
                            id={`block-text-color-${block.id}`}
                            type="color"
                            value={(block as any).textColor || "#000000"}
                            onChange={(e) => {
                              const newBlocks = [...contentBlocks]
                              if (newBlocks[index].type === "text") {
                                ;(newBlocks[index] as any).textColor = e.target.value
                              }
                              setContentBlocks(newBlocks)
                            }}
                            className="w-10 h-8 p-0 border-0"
                          />
                        </div>
                      </div>
                      <Textarea
                        value={block.content as string}
                        onChange={(e) => handleContentChange(index, e.target.value)}
                        placeholder="Write your content here..."
                        className="w-full min-h-[100px] bg-transparent border-0 focus-visible:ring-0 resize-none p-0"
                        style={{ color: (block as any).textColor || "inherit" }}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleEmojiPicker(block.id)}
                        className="absolute right-0 bottom-0 h-8 w-8 p-0"
                      >
                        <Smile className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTextBlock(block.id)}
                        className="absolute right-10 bottom-0 h-8 w-8 p-0"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  ) : block.type === "poll" ? (
                    <Card className="bg-white dark:bg-gray-700 rounded-lg p-4 mb-4 relative">
                      <h3 className="text-lg font-semibold mb-2">{(block.content as Poll).question}</h3>
                      {(block.content as Poll).multipleChoice ? (
                        <div className="space-y-2">
                          {(block.content as Poll).options.map((option) => (
                            <div key={option.id} className="flex items-center space-x-2">
                              <div className="relative w-full h-10 bg-gray-200 dark:bg-gray-600 rounded-md shadow-inner overflow-hidden">
                                <div
                                  className="absolute top-0 left-0 h-full bg-violet-500"
                                  style={{
                                    width: `${(option.votes / Math.max(...(block.content as Poll).options.map((o) => o.votes), 1)) * 100}%`,
                                  }}
                                ></div>
                                <div className="absolute inset-0 flex items-center justify-between px-3">
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {option.text}
                                  </span>
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {option.votes}
                                  </span>
                                </div>
                              </div>
                              <Checkbox id={option.id} />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <RadioGroup>
                          <div className="space-y-2">
                            {(block.content as Poll).options.map((option) => (
                              <div key={option.id} className="flex items-center space-x-2">
                                <div className="relative w-full h-10 bg-gray-200 dark:bg-gray-600 rounded-md shadow-inner overflow-hidden">
                                  <div
                                    className="absolute top-0 left-0 h-full bg-violet-500"
                                    style={{
                                      width: `${(option.votes / Math.max(...(block.content as Poll).options.map((o) => o.votes), 1)) * 100}%`,
                                    }}
                                  ></div>
                                  <div className="absolute inset-0 flex items-center justify-between px-3">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                      {option.text}
                                    </span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                      {option.votes}
                                    </span>
                                  </div>
                                </div>
                                <RadioGroupItem value={option.id} id={option.id} />
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      )}
                      <div className="absolute top-2 right-2 flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleMoveBlock(index, "up")}>
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleMoveBlock(index, "down")}>
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => removeBlock(block.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ) : (
                    renderCard(block.content as ContentCard)
                  )}
                </div>
              ))}
              {/* <Button variant="outline" onClick={() => toggleEmojiPicker("text")} className="mt-4 mr-2">
                Add Text Block with Emoji
              </Button> */}
              <Button variant="outline" onClick={handleAddTextBlock} className="mt-4">
                Add Text Block
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAddCard("code")}
                className="h-10 w-10 p-0 rounded-full shadow-neumorphic dark:shadow-neumorphic-dark"
                className="h-10 w-10 p-0 rounded-full shadow-neumorphic dark:shadow-neumorphic-dark"
              >
                <Code className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAddCard("file")}
                className="h-10 w-10 p-0 rounded-full shadow-neumorphic dark:shadow-neumorphic-dark"
              >
                <File className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAddCard("media")}
                className="h-10 w-10 p-0 rounded-full shadow-neumorphic dark:shadow-neumorphic-dark"
              >
                <ImageIcon className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAddCard("link")}
                className="h-10 w-10 p-0 rounded-full shadow-neumorphic dark:shadow-neumorphic-dark"
              >
                <Link className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAddCard("title")}
                className="h-10 w-10 p-0 rounded-full shadow-neumorphic dark:shadow-neumorphic-dark flex items-center justify-center"
              >
                <Type className="h-5 w-5" />
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0 rounded-full shadow-neumorphic dark:shadow-neumorphic-dark"
                  >
                    <BarChart className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create a Poll</DialogTitle>
                  </DialogHeader>
                  <PollCreator onCreatePoll={handleCreatePoll} />
                </DialogContent>
              </Dialog>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddButtonCard}
                className="h-10 w-10 p-0 rounded-full shadow-neumorphic dark:shadow-neumorphic-dark"
              >
                <MousePointerClick className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Card>

        <div className="flex justify-center">
          <Button
            className={cn(
              "px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 ease-in-out transform hover:scale-105",
              isPublishable()
                ? "bg-purple-600 hover:bg-purple-700 text-white shadow-glow"
                : "bg-gray-400 cursor-not-allowed",
            )}
            onClick={handlePublish}
            disabled={!isPublishable()}
          >
            Publish
          </Button>
        </div>
      </div>
      {showEmojiPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-4">
            <Picker data={data} onEmojiSelect={handleEmojiSelect} />
            <Button onClick={() => setShowEmojiPicker(false)} className="mt-4">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
