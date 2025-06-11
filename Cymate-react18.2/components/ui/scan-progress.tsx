"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { useScanProgress } from "@/lib/hooks/use-scan-progress"

interface ScanProgressProps {
  scanType: string
  data: any
  onComplete?: (result: any) => void
}

export function ScanProgress({ scanType, data, onComplete }: ScanProgressProps) {
  const { progress, isScanning, error, startScan } = useScanProgress({
    onComplete,
  })

  React.useEffect(() => {
    startScan(scanType, data)
  }, [startScan, scanType, data])

  return (
    <AnimatePresence>
      {isScanning && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-8"
        >
          <Progress
            value={progress}
            variant={error ? "error" : progress === 100 ? "success" : "default"}
            showValue
            label={error ? "Scan failed" : `${scanType} in progress...`}
            sublabel={error ? error.message : undefined}
            indeterminate={progress === 0}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
