"use client"

import { useState, useCallback } from "react"

interface UseScanProgressOptions {
  onProgress?: (progress: number) => void
  onComplete?: (result: any) => void
  onError?: (error: Error) => void
}

export function useScanProgress({ onProgress, onComplete, onError }: UseScanProgressOptions = {}) {
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<Error | null>(null)
  const [isScanning, setIsScanning] = useState(false)

  const startScan = useCallback(
    async (scanType: string, data: any) => {
      setIsScanning(true)
      setProgress(0)
      setError(null)

      try {
        // Simulate scan progress
        const totalSteps = 10
        for (let i = 0; i < totalSteps; i++) {
          await new Promise((resolve) => setTimeout(resolve, 300))
          const currentProgress = ((i + 1) / totalSteps) * 100
          setProgress(currentProgress)
          onProgress?.(currentProgress)
        }

        // Don't complete the scan here - let the actual API response handle it
        return {
          isInitializing: true,
          message: "Initializing scan..."
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Scan failed")
        setError(error)
        onError?.(error)
        throw error
      }
    },
    [onProgress, onComplete, onError],
  )

  const reset = useCallback(() => {
    setProgress(0)
    setError(null)
    setIsScanning(false)
  }, [])

  return {
    progress,
    error,
    isScanning,
    startScan,
    reset,
  }
}
