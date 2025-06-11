"use client"

import { useState, useCallback } from "react"

interface UseFileUploadOptions {
  onProgress?: (progress: number) => void
  onComplete?: (result: any) => void
  onError?: (error: Error) => void
}

export function useFileUpload({ onProgress, onComplete, onError }: UseFileUploadOptions = {}) {
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<Error | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const upload = useCallback(
    async (file: File) => {
      setIsUploading(true)
      setProgress(0)
      setError(null)

      try {
        // Simulate file upload with progress
        const totalChunks = 10
        for (let i = 0; i < totalChunks; i++) {
          await new Promise((resolve) => setTimeout(resolve, 500))
          const currentProgress = ((i + 1) / totalChunks) * 100
          setProgress(currentProgress)
          onProgress?.(currentProgress)
        }

        const result = { success: true, url: URL.createObjectURL(file) }
        onComplete?.(result)
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Upload failed")
        setError(error)
        onError?.(error)
        throw error
      } finally {
        setIsUploading(false)
      }
    },
    [onProgress, onComplete, onError],
  )

  const reset = useCallback(() => {
    setProgress(0)
    setError(null)
    setIsUploading(false)
  }, [])

  return {
    progress,
    error,
    isUploading,
    upload,
    reset,
  }
}
