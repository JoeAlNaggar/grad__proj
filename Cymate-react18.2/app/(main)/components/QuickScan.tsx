"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { FileInput } from "@/components/ui/file-input"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Shield, AlertTriangle, Scan, CheckCircle, XCircle } from "lucide-react"

export default function QuickScan() {
  const [scanType, setScanType] = useState<"file" | "url" | null>(null)
  const [url, setUrl] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<{ score: number; safe: boolean } | null>(null)
  const progressRef = useRef<NodeJS.Timeout | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)

  // Handle scan type selection
  const handleScanTypeChange = (type: "file" | "url") => {
    setScanType(type)
    setResult(null)
    if (type === "file") {
      setUrl("")
    } else {
      setFile(null)
    }
  }

  // Handle file change
  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile)
    if (selectedFile) {
      setScanType("file")
      setUrl("")
      setResult(null)
    }
  }

  // Handle URL change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
    if (e.target.value) {
      setScanType("url")
      setFile(null)
      setResult(null)
    }
  }

  // Handle scan button click
  const handleScan = () => {
    if (!scanType || (scanType === "url" && !url) || (scanType === "file" && !file)) return

    setIsScanning(true)
    setProgress(0)
    setResult(null)

    // Simulate scanning progress
    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressRef.current as NodeJS.Timeout)
          setIsScanning(false)

          // Set result based on scan type
          if (scanType === "file") {
            setResult({ score: 95, safe: true })
          } else {
            setResult({ score: 65, safe: false })
          }

          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (progressRef.current) {
        clearInterval(progressRef.current)
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Draw water animation when result is available
  useEffect(() => {
    if (!result || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = width * 0.4
    const waterHeight = height * (1 - result.score / 100)
    const color = result.safe ? "#10b981" : "#ef4444"

    let wave = 0

    const drawWater = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw circle
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.strokeStyle = color
      ctx.lineWidth = 3
      ctx.stroke()

      // Save the current state
      ctx.save()

      // Create clipping region
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.clip()

      // Draw water
      ctx.beginPath()
      ctx.moveTo(0, waterHeight)

      for (let x = 0; x < width; x++) {
        const y = waterHeight + Math.sin(x * 0.05 + wave) * 5
        ctx.lineTo(x, y)
      }

      ctx.lineTo(width, height)
      ctx.lineTo(0, height)
      ctx.closePath()
      ctx.fillStyle = color
      ctx.fill()

      // Restore the state
      ctx.restore()

      // Draw percentage text
      ctx.font = "bold 24px Arial"
      ctx.fillStyle = result.safe ? "#10b981" : "#ef4444"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(`${result.score}%`, centerX, centerY)

      wave += 0.1
      animationRef.current = requestAnimationFrame(drawWater)
    }

    drawWater()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [result])

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
        Security Quick Scan
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div
          className={`
            p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105
            ${
              scanType === "file"
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md"
                : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
            }
          `}
          onClick={() => handleScanTypeChange("file")}
        >
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-4">
              <Shield className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold">File Scan</h3>
          </div>

          <FileInput
            accept=".pdf,.doc,.docx,.txt,.jpg,.png"
            value={file}
            onChange={handleFileChange}
            disabled={isScanning}
          />
        </div>

        <div
          className={`
            p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105
            ${
              scanType === "url"
                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-md"
                : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"
            }
          `}
          onClick={() => handleScanTypeChange("url")}
        >
          <div className="flex items-center mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full mr-4">
              <AlertTriangle className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold">URL Scan</h3>
          </div>

          <Input
            type="url"
            placeholder="Enter URL to scan"
            value={url}
            onChange={handleUrlChange}
            disabled={isScanning}
            className="mb-2"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">Enter a complete URL including http:// or https://</p>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <Button
          onClick={handleScan}
          disabled={isScanning || !scanType || (scanType === "url" && !url) || (scanType === "file" && !file)}
          className="relative overflow-hidden group w-full md:w-2/3 h-12 mb-6 rounded-lg"
        >
          <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-0 -skew-x-12 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-600 group-hover:skew-x-12"></span>
          <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform skew-x-12 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:from-blue-600 group-hover:to-purple-600 group-hover:-skew-x-12 opacity-70"></span>
          <span className="relative flex items-center justify-center text-white font-medium text-lg">
            {isScanning ? "Scanning..." : "Scan Now"}
            <Scan className="ml-2 w-5 h-5" />
          </span>
        </Button>

        {isScanning && (
          <div className="w-full md:w-2/3 mb-8">
            <Progress
              value={progress}
              className="h-3 rounded-full bg-gray-200 dark:bg-gray-700"
              indicatorClassName="bg-gradient-to-r from-blue-500 to-purple-500"
            />
            <p className="text-sm text-center mt-2 text-gray-600 dark:text-gray-300">
              {progress < 30
                ? "Initializing scan..."
                : progress < 60
                  ? "Analyzing content..."
                  : progress < 90
                    ? "Checking for threats..."
                    : "Finalizing results..."}
            </p>
          </div>
        )}

        {result && (
          <div className="flex flex-col items-center mt-4 w-full">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full">
              <div className="relative">
                <canvas ref={canvasRef} width={200} height={200} className="mb-4" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {result.safe ? (
                    <CheckCircle className="w-12 h-12 text-green-500 opacity-20" />
                  ) : (
                    <XCircle className="w-12 h-12 text-red-500 opacity-20" />
                  )}
                </div>
              </div>

              <div className="text-center md:text-left max-w-md">
                <h3 className={`text-xl font-bold mb-2 ${result.safe ? "text-green-500" : "text-red-500"}`}>
                  {result.safe ? "Safe Content Detected" : "Potential Security Threat"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {result.safe
                    ? "The scanned content appears to be safe with no detected threats. You can proceed with confidence."
                    : "The scanned content may contain security risks. We recommend taking precautions before proceeding."}
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {result.safe ? (
                    <>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full dark:bg-green-900/30 dark:text-green-300">
                        No Malware
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full dark:bg-green-900/30 dark:text-green-300">
                        No Phishing
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full dark:bg-green-900/30 dark:text-green-300">
                        Safe Content
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full dark:bg-red-900/30 dark:text-red-300">
                        Suspicious URL
                      </span>
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full dark:bg-red-900/30 dark:text-red-300">
                        Potential Phishing
                      </span>
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full dark:bg-red-900/30 dark:text-red-300">
                        Unsafe Content
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
