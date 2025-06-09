"use client"

import { useState } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  addYears,
  subYears,
} from "date-fns"
import { ChevronLeft, ChevronRight, MoveLeft, MoveRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Note {
  day: number
  note: string
}

const events = [
  { date: new Date(2025, 0, 15), title: "Cybersecurity Webinar" },
  { date: new Date(2025, 0, 22), title: "Tool Workshop" },
]

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1))
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [newNoteDay, setNewNoteDay] = useState("")
  const [newNoteText, setNewNoteText] = useState("")

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const hasEvent = (date: Date) => events.some((event) => isSameDay(event.date, date))
  const hasNote = (date: Date) => notes.some((note) => note.day === date.getDate())
  const getNote = (date: Date) => notes.find((note) => note.day === date.getDate())?.note

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const nextYear = () => setCurrentDate(addYears(currentDate, 1))
  const prevYear = () => setCurrentDate(subYears(currentDate, 1))

  const handleAddNote = () => {
    const day = Number.parseInt(newNoteDay)
    if (day && day > 0 && day <= 31 && newNoteText) {
      setNotes([...notes, { day, note: newNoteText }])
      setNewNoteDay("")
      setNewNoteText("")
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-lg p-6 w-full max-w-3xl mx-auto backdrop-blur-lg">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <button onClick={prevYear} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <MoveLeft className="w-5 h-5" />
          </button>
          <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{format(currentDate, "MMMM yyyy")}</h2>
        <div className="flex items-center gap-2">
          <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <ChevronRight className="w-5 h-5" />
          </button>
          <button onClick={nextYear} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <MoveRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-semibold text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {monthDays.map((day) => {
          const isSelected = selectedDate && isSameDay(day, selectedDate)
          const hasNoteForDay = hasNote(day)
          return (
            <button
              key={day.toString()}
              onClick={() => setSelectedDate(day)}
              className={`
                relative h-14 rounded-lg text-sm transition-all duration-200
                ${!isSameMonth(day, monthStart) ? "text-gray-400 dark:text-gray-600" : "text-gray-900 dark:text-gray-100"}
                ${isSelected ? "bg-yellow-400/20 shadow-[0_0_15px_rgba(250,204,21,0.3)] text-yellow-500 dark:text-yellow-300" : "hover:bg-gray-100 dark:hover:bg-gray-700"}
              `}
            >
              <span className="block font-medium">{format(day, "d")}</span>
              {hasEvent(day) && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                </div>
              )}
              {hasNoteForDay && (
                <div className="absolute bottom-1 right-1 group">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
                    <div className="bg-black text-white text-xs rounded p-2 whitespace-nowrap">{getNote(day)}</div>
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>
      {selectedDate && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg backdrop-blur-lg">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
            {format(selectedDate, "MMMM d, yyyy")}
          </h3>
          {hasEvent(selectedDate) ? (
            <div className="space-y-2">
              {events
                .filter((event) => isSameDay(event.date, selectedDate))
                .map((event, index) => (
                  <div key={index} className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded">
                    {event.title}
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No events scheduled</p>
          )}
        </div>
      )}
      <div className="mt-6 space-y-4">
        <div className="flex gap-4">
          <Input
            type="number"
            min="1"
            max="31"
            placeholder="Day"
            value={newNoteDay}
            onChange={(e) => setNewNoteDay(e.target.value)}
            className="w-24 dark:bg-gray-700/50 dark:border-gray-600"
          />
          <Input
            placeholder="Add note"
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            className="dark:bg-gray-700/50 dark:border-gray-600"
          />
          <Button onClick={handleAddNote}>OK</Button>
        </div>
      </div>
    </div>
  )
}
