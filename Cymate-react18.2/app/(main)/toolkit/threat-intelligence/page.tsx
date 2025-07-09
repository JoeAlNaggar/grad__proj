"use client"

import { useState } from "react"
import axios from "axios"
import { AlertTriangle, Download, Copy, Mail, AlertCircle, Search, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScanProgress } from "@/components/ui/scan-progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "@/lib/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { modifyToolkitTokens } from "@/app/services/api"

const API_BASE_URL = 'http://localhost:3000';

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

    try {
      const response = await axios.post(`${API_BASE_URL}/threat`, {
        query: input.trim()
      });

      handleScanComplete(response.data);
      toast({
        title: "Analysis Complete",
        description: "Threat intelligence analysis completed successfully.",
      });
    } catch (error: any) {
      console.error("Analysis error:", error.response?.data || error.message);
      toast({
        title: "Analysis Failed",
        description: error.response?.data?.message || "An error occurred during the threat analysis.",
        variant: "destructive",
      });
      setIsProcessing(false);
      setIsScanning(false);
    }
  }

  const handleScanComplete = async (result: any) => {
    setIsProcessing(false)
    setIsScanning(false)
    setResult(JSON.stringify(result, null, 2))
    
    // Determine danger level based on response
    if (result && typeof result === 'object') {
      // Check for indicators of high threat level
      const dangerIndicators = ['malicious', 'dangerous', 'threat', 'suspicious', 'high', 'critical'];
      const resultStr = JSON.stringify(result).toLowerCase();
      const hasDangerIndicators = dangerIndicators.some(indicator => resultStr.includes(indicator));
      setDangerLevel(hasDangerIndicators ? "1" : "0");
    } else {
      setDangerLevel("0");
    }
    
    // Deduct 1 toolkit token after successful scan
    try {
      const newTokenCount = await modifyToolkitTokens('deduct', 1);
      console.log('🎫 Token deducted, remaining tokens:', newTokenCount);
      
      // Trigger a custom event to update the navbar
      window.dispatchEvent(new CustomEvent('tokensUpdated', { 
        detail: { tokens: newTokenCount } 
      }));
    } catch (error) {
      console.error('Failed to deduct token:', error);
      // Don't show error to user since scan was successful
    }
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
      const blob = new Blob([result], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `threat-intelligence-report-${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const handleEmailReport = () => {
    if (email && result) {
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

      <div className="bg-white dark:bg-gray-800/30 backdrop-filter backdrop-blur-lg border border-white/20 dark:border-white/10 rounded-2xl shadow-lg p-6">
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
        <ScanProgress scanType="Threat Intelligence Analysis" data={{ query: input }} onComplete={handleScanComplete} />
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            id="results-section"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-800/30 backdrop-filter backdrop-blur-lg border border-white/20 dark:border-white/10 rounded-2xl shadow-lg p-6 mb-8"
          >
            
            <h2 className="text-2xl font-semibold mb-4">Threat Intelligence Report</h2>
            
            <div className="overflow-x-auto">
              {(() => {
                try {
                  let parsedResult = typeof result === 'string' ? JSON.parse(result) : result;

                  // Show initial state if no scan has been run
                  if (
                    parsedResult.result &&
                    parsedResult.result.results
                  ) {
                    const results = parsedResult.result.results;
                  
                    // Case 1: If warning is present
                    if (results.warning) {
                      return (
                        <div className="text-center py-6">
                          <p className="inline-block bg-yellow-100 text-yellow-800 dark:bg-green-900/30 dark:text-green-300 px-4 py-2 rounded text-sm font-medium">
                             {results.warning}
                          </p>
                        </div>
                      );
                    }
                  
                    // Case 2: Render malware_info as table
                    const malwareInfo = results.malware_info;
                  
                    if (!malwareInfo) return null;
                  
                    const keys = Object.keys(malwareInfo).filter((key) => key !== 'mitre_att&ck');
                  
                    const getBadgeStyle = (key: string) => {
                      switch (key) {
                        case 'type':
                          return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
                        case 'aliases':
                        case 'targets':
                          return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
                        case 'references':
                          return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
                        case 'impact':
                          return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400';
                        case 'first_seen':
                          return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
                        default:
                          return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200';
                      }
                    };
                  
                    return (
                      <table className="w-full border-collapse mt-6">
                        <thead>
                          <tr className="bg-gray-50 dark:bg-gray-800/50">
                            {keys.map((key) => (
                              <th
                                key={key}
                                className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 capitalize"
                              >
                                {key.replace(/_/g, ' ')}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            {keys.map((key) => {
                              const value = malwareInfo[key];
                              const style = getBadgeStyle(key);
                  
                              return (
                                <td
                                  key={key}
                                  className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 align-top space-y-1"
                                >
                                  {Array.isArray(value) ? (
                                    key === 'references' ? (
                                      <div className="flex flex-col gap-1">
                                        {value.map((link, idx) => (
                                          <a
                                            key={idx}
                                            href={link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block text-sm underline text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                          >
                                            {link}
                                          </a>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="flex flex-col gap-1">
                                        {value.map((item, idx) => (
                                          <span
                                            key={idx}
                                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${style} ${key === 'first_seen' ? 'whitespace-nowrap' : ''}`}
                                          >
                                            {item}
                                          </span>
                                        ))}
                                      </div>
                                    )
                                  ) : (
                                    <span
                                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${style} ${key === 'first_seen' ? 'whitespace-nowrap' : ''}`}
                                    >
                                      {value}
                                    </span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        </tbody>
                      </table>
                    );
                  }
                  
                  
                  

                  // Handle single object case
                  if (!Array.isArray(parsedResult)) {
                    parsedResult = [parsedResult];
                  }

                  if (parsedResult.length === 0) {
                    return (
                      <div className="text-center py-4 text-gray-500">
                        No results to display
                      </div>
                    );
                  }

                  // Get all unique keys from the first item
                  const keys = Object.keys(parsedResult[0]);
                  
                  // Function to format key for display
                  const formatKey = (key: string) => {
                    return key
                      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
                      .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
                      .trim();
                  };

                  return (
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800/50">
                          {keys.map((key) => (
                            <th key={key} className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                              {formatKey(key)}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {parsedResult.map((item: any, index: number) => (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            {keys.map((key) => {
                              const value = item[key];
                              const stringValue = value !== null && value !== undefined ? String(value) : '-';
                              const shouldBadge = key.toLowerCase().includes('status') || 
                                                key.toLowerCase().includes('risk') || 
                                                key.toLowerCase().includes('threat') ||
                                                key.toLowerCase().includes('level') ||
                                                key.toLowerCase().includes('severity');
                              
                              const getBadgeClass = () => {
                                if (value === null || value === undefined) {
                                  return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
                                }
                                const lowerValue = stringValue.toLowerCase();
                                if (lowerValue.includes('low') || lowerValue.includes('safe') || lowerValue.includes('clean')) {
                                  return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
                                }
                                if (lowerValue.includes('high') || lowerValue.includes('critical') || lowerValue.includes('malicious') || lowerValue.includes('dangerous')) {
                                  return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
                                }
                                if (lowerValue.includes('medium') || lowerValue.includes('warning') || lowerValue.includes('suspicious')) {
                                  return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
                                }
                                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
                              };

                              // Function to render nested content
                              const renderNestedContent = (value: any) => {
                                if (Array.isArray(value)) {
                                  return (
                                    <div className="space-y-2">
                                      {value.map((item, idx) => (
                                        <div key={idx} className="pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                                          {typeof item === 'object' && item !== null ? (
                                            Object.entries(item).map(([nestedKey, nestedValue]) => (
                                              <div key={nestedKey} className="text-sm">
                                                <span className="font-medium">{nestedKey}: </span>
                                                <span>{String(nestedValue)}</span>
                                              </div>
                                            ))
                                          ) : (
                                            <span>{String(item)}</span>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  );
                                }
                                
                                if (typeof value === 'object' && value !== null) {
                                  return (
                                    <div className="space-y-1">
                                      {Object.entries(value).map(([nestedKey, nestedValue]) => (
                                        <div key={nestedKey} className="text-sm">
                                          <span className="font-medium">{nestedKey}: </span>
                                          <span>{String(nestedValue)}</span>
                                        </div>
                                      ))}
                                    </div>
                                  );
                                }

                                return <span>{String(value)}</span>;
                              };

                              const hasNestedContent = Array.isArray(value) || (typeof value === 'object' && value !== null);

                              return (
                                <td key={key} className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                                  {hasNestedContent ? (
                                    <div className="space-y-2">
                                      {renderNestedContent(value)}
                                    </div>
                                  ) : shouldBadge ? (
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeClass()}`}>
                                      {stringValue}
                                    </span>
                                  ) : (
                                    stringValue
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  );
                } catch (error) {
                  return (
                    <div className="text-center py-4 text-gray-500">
                      Error parsing results: {error instanceof Error ? error.message : 'Unknown error'}
                    </div>
                  );
                }
              })()}
            </div>

            <div className="flex flex-wrap gap-4 mt-6">
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Results Button */}
      {/* {result && (
        <div className="fixed bottom-6 left-6 z-50">
          <Button
            variant="outline"
            className="bg-yellow-500 text-white dark:text-white hover:bg-yellow-600"
            onClick={() => {
              document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" })
            }}
          >
            <Zap className="w-4 h-4 mr-2" />
            View Results
          </Button>
        </div>
      )} */}

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

      {/* Dark mode background effects */}
      {/* <div className="fixed inset-0 -z-10 dark:bg-gray-900">
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-1/4 h-1/4 bg-pink-500/10 rounded-full filter blur-3xl animate-pulse delay-2000"></div>
      </div> */}
    </div>
  )
}
