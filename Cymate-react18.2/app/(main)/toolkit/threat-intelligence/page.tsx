"use client"

import { useState } from "react"
import { AlertTriangle, Download, Copy, Mail, AlertCircle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScanProgress } from "@/components/ui/scan-progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "@/lib/hooks/use-toast"

export default function ThreatIntelligence() {
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [showError, setShowError] = useState(false)
  const [email, setEmail] = useState("")
  const [dangerLevel, setDangerLevel] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)

  const handleAction = async () => {
    if (!input.trim()) {
      setShowError(true)
      return
    }

    setIsProcessing(true)
    setIsScanning(true)
  }

  const handleScanComplete = (result: any) => {
    setIsProcessing(false)
    setIsScanning(false)
    setResult(JSON.stringify(result, null, 2))
    setDangerLevel(Math.random() > 0.5 ? "1" : "0") // Randomly set danger level for demonstration
  }

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result)
      toast({
        title: "Copied!",
        description: "The report has been copied to your clipboard.",
      })
    }
  }

  const handleDownload = () => {
    if (result) {
      const blob = new Blob([result], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "threat-intelligence-report.txt"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const handleEmailReport = () => {
    if (email && result) {
      // Simulate sending email
      toast({
        title: "Report Sent!",
        description: "The threat intelligence report has been sent to your email.",
      })
      setEmail("")
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-3xl p-8 shadow-xl">
        <h1 className="text-4xl font-bold mb-4">Threat Intelligence</h1>
        <p className="text-xl">Get real-time intelligence on potential threats</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center mb-4">
          <AlertTriangle className="w-8 h-8 text-yellow-500 mr-3" />
          <div>
            <h2 className="text-2xl font-semibold">Analyze Threat</h2>
            <p className="text-sm text-gray-500">Enter a keyword, IP, domain, or hash to analyze</p>
          </div>
        </div>
        <div className="space-y-4">
          <Input
            placeholder="Enter threat indicator (e.g., malware name, IP address, domain)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`transition-all duration-300 ${isProcessing ? "ring-2 ring-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]" : ""}`}
          />
          <Button
            onClick={handleAction}
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Analyze Threat"}
            <Search className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {isScanning && (
        <ScanProgress scanType="Threat Intelligence Analysis" data={{ input }} onComplete={handleScanComplete} />
      )}

      {result && (
        <div id="results-section" className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mt-8">
          {dangerLevel === "1" && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
              <p className="font-bold">Critical Alert!</p>
              <p>
                This threat is extremely dangerous. Immediate action is strongly recommended to mitigate potential
                risks.
              </p>
            </div>
          )}
          <h3 className="text-2xl font-semibold mb-4">Threat Intelligence Report</h3>
          <pre className="text-gray-600 dark:text-gray-300 mb-6 whitespace-pre-wrap">{result}</pre>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" onClick={handleCopy}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Report
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
            <div className="flex gap-2">
              <Input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Button onClick={handleEmailReport}>
                <Mail className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={showError} onOpenChange={setShowError}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Input Required
            </DialogTitle>
            <DialogDescription>
              Please enter a threat indicator or upload a file to analyze before proceeding.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
