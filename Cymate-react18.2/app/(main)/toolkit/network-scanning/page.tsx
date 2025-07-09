"use client"

import { useState } from "react"
import axios from "axios"
import {
  Wifi,
  AlertCircle,
  Download,
  Copy,
  Mail,
  Search,
  AlertTriangle,
  Activity,
  Globe,
  Shield,
  Zap,
  Layers,
  GitMerge,
  Database,
  Server,
  Cpu,
  Radio,
  FileCode,
  Lock,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Select } from "@/components/ui/select"
// import { FileInput } from "@/components/ui/file-input"
import { ScanProgress } from "@/components/ui/scan-progress"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/lib/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { modifyToolkitTokens } from "@/app/services/api"

const API_BASE_URL = 'http://localhost:3000/network';

const scanningTools = [
  {
    title: "IP Scanning",
    description: "Detects live hosts within a specified network range.",
    icon: Search,
    endpoint: "/ipscan",
    inputs: [{ type: "text", placeholder: "CIDR (e.g., 192.168.1.1/24)", key: "cidr" }],
  },
  {
    title: "Firewall and ACL Testing",
    description: "Test network firewalls and access control lists.",
    icon: Shield,
    endpoint: "/firewall",
    inputs: [
      { type: "text", placeholder: "Target (e.g., google.com)", key: "target" },
      { type: "text", placeholder: "Protocol (e.g., tcp)", key: "protocol" },
      { type: "text", placeholder: "Ports (e.g., 80,443,22)", key: "ports" },
    ],
  },
  {
    title: "DNS Hostname Scanning",
    description: "Analyze DNS records and identify subdomains.",
    icon: Database,
    endpoint: "/dns",
    inputs: [{ type: "text", placeholder: "Domain name (e.g., google.com)", key: "domain" }],
  },
  {
    title: "Port Scanning",
    description: "Identify open, closed, or filtered ports.",
    icon: Wifi,
    endpoint: "/portscan",
    inputs: [
      { type: "text", placeholder: "Target (e.g., google.com)", key: "target" },
      { type: "text", placeholder: "Port range (e.g., 20-80)", key: "range" },
    ],
  },
  {
    title: "Protocol Analysis",
    description: "Detect supported protocols on a target system.",
    icon: Globe,
    endpoint: "/protocol",
    inputs: [{ type: "text", placeholder: "Target (e.g., google.com)", key: "target" }],
  },
  {
    title: "Subnet and VLAN Scanning",
    description: "Detect devices within a subnet or VLAN.",
    icon: GitMerge,
    endpoint: "/subnet",
    inputs: [
      { type: "text", placeholder: "Subnet (e.g., 192.168.1.0/24)", key: "subnet" },
      { type: "text", placeholder: "VLAN (e.g., 10)", key: "vlan" },
    ],
  },
  {
    title: "Service Detection",
    description: "Discover services running on open ports.",
    icon: Activity,
    endpoint: "/services",
    inputs: [
      { type: "text", placeholder: "Target (e.g., 192.168.1.1)", key: "target" },
      // { type: "checkbox", label: "Enable version detection", key: "versionDetection" },
    ],
  },
  {
    title: "Latency Testing",
    description: "Measure network performance metrics.",
    icon: Activity,
    endpoint: "/latency",
    inputs: [
      { type: "text", placeholder: "Target (e.g., google.com)", key: "target" },
      { type: "text", placeholder: "Count (e.g., 10)", key: "count" },
    ],
  },
];

export default function NetworkScanning() {
  const [expandedTool, setExpandedTool] = useState<number | null>(null)
  const [showError, setShowError] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [showEmailError, setShowEmailError] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [file, setFile] = useState<File | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanType, setScanType] = useState<string>("")

  const handleToolSelect = (index: number) => {
    if (expandedTool === index) {
      return
    }
    setExpandedTool(index)
    setFormData({})
    setScanType(scanningTools[index].title)
  }

  const handleInputChange = (toolIndex: number, inputIndex: number, value: string | boolean) => {
    const inputKey = scanningTools[toolIndex].inputs[inputIndex].key;
    setFormData((prev) => ({
      ...prev,
      [inputKey]: value,
    }))
  }

  const handleAction = async () => {
    if (expandedTool === null) {
      setShowError(true);
      return;
    }
  
    setIsScanning(true);
    const selectedTool = scanningTools[expandedTool];
  
    if (!selectedTool || !selectedTool.endpoint) {
      toast({
        title: "Invalid Tool",
        description: "Please select a valid scanning tool.",
        variant: "destructive",
      });
      setIsScanning(false);
      return;
    }
  
    try {
      const response = await axios.get(`${API_BASE_URL}${selectedTool.endpoint}`, {
        params: formData,
      });
  
      await handleScanComplete(response.data);
      toast({
        title: "Scan Complete",
        description: "Network scan completed successfully.",
      });
    } catch (error: any) {
      console.error("Scanning error:", error.response?.data || error.message);
      toast({
        title: "Scan Failed",
        description: error.response?.data?.message || "An error occurred during the network scan.",
        variant: "destructive",
      });
      setIsScanning(false);
    }
  };

  const handleScanComplete = async (result: any) => {
    setIsScanning(false);
    setResult(JSON.stringify(result, null, 2));
    
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

  const handleEmailReport = () => {
    if (!email) {
      setShowEmailError(true)
      setTimeout(() => setShowEmailError(false), 3000)
      return
    }

    setIsEmailSent(true)
    toast({
      title: "Report Sent!",
      description: "The network scanning report has been sent to your email.",
    })

    setTimeout(() => {
      setIsEmailSent(false)
      setEmail("")
    }, 2000)
  }

  const handleDownload = () => {
    if (!result) return;
    
    const blob = new Blob([result], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `network-scan-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  const handleCopy = () => {
    if (!result) return;
    
    navigator.clipboard.writeText(result);
    toast({
      title: "Copied!",
      description: "Report copied to clipboard.",
    });
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-3xl p-8 shadow-xl">
        <h1 className="text-4xl font-bold mb-4">Network Scanning</h1>
        <p className="text-xl">Analyze your network for vulnerabilities and potential threats</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scanningTools.map((tool, index) => (
          <motion.div
            key={index}
            // layout="position"
            className={`bg-white dark:bg-gray-800/30 backdrop-filter backdrop-blur-lg border border-white/20 dark:border-white/10 rounded-xl shadow-md overflow-hidden transition-all duration-300 cursor-pointer ${
              expandedTool === index ? "col-span-full" : ""
            }`}
            onClick={() => handleToolSelect(index)}
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div
                  className={`p-3 rounded-full bg-${tool.icon === Shield ? "red" : tool.icon === Wifi ? "blue" : tool.icon === Globe ? "green" : "purple"}-100 dark:bg-${tool.icon === Shield ? "red" : tool.icon === Wifi ? "blue" : tool.icon === Globe ? "green" : "purple"}-900/20`}
                >
                  <tool.icon
                    className={`w-6 h-6 text-${tool.icon === Shield ? "red" : tool.icon === Wifi ? "blue" : tool.icon === Globe ? "green" : "purple"}-500`}
                  />
                </div>
                <h3 className="text-lg font-semibold ml-3">{tool.title}</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{tool.description}</p>

              <AnimatePresence>
                {expandedTool === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="space-y-4 mt-4 border-t pt-4 border-gray-200 dark:border-gray-700">
                      {tool.inputs.map((input, inputIndex) => (
                        <div key={inputIndex} className="space-y-2">
                          <Input
                            type={input.type}
                            placeholder={input.placeholder}
                            value={formData[input.key] || ""}
                            onChange={(e) => handleInputChange(index, inputIndex, e.target.value)}
                          />
                        </div>
                      ))}
                      
                      {/* Action buttons inside expanded tool */}
                      <div className="flex gap-2 pt-4">
                        <Button 
                          onClick={handleAction} 
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                          disabled={isScanning}
                        >
                          {isScanning ? (
                            <>
                              <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              Scanning...
                            </>
                          ) : (
                            <>
                              <Search className="w-4 h-4 mr-2" />
                              Start Scan
                            </>
                          )}
                        </Button>

                        {result && (
                          <Button
                            variant="outline"
                            className="bg-green-500 text-white hover:bg-green-600"
                            onClick={() => {
                              document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" })
                            }}
                          >
                            <Zap className="w-4 h-4 mr-2" />
                            View Results
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      {isScanning && <ScanProgress scanType={scanType} data={formData} onComplete={handleScanComplete} />}

      <AnimatePresence>
        {result && (
          <motion.div
            id="results-section"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-800/30 backdrop-filter backdrop-blur-lg border border-white/20 dark:border-white/10 rounded-2xl shadow-lg p-6 mb-8"
          >
            <h2 className="text-2xl font-semibold mb-4">Network Scanning Report</h2>
            
            <div className="overflow-x-auto">
              {(() => {
                try {
                  let parsedResult = typeof result === 'string' ? JSON.parse(result) : result;

                  // Show initial state if no scan has been run
                  if (!parsedResult || Object.keys(parsedResult).length === 0) {
                    return (
                      <div className="text-center py-12">
                        <div className="flex flex-col items-center gap-4">
                          <Search className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">
                            Ready to Scan
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 max-w-md text-center">
                            Select a scanning tool and configure its parameters to generate a detailed network analysis report.
                          </p>
                        </div>
                      </div>
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

                  // Function to determine if a value should be displayed as a badge
                  const shouldShowAsBadge = (key: string, value: string) => {
                    if (!value) return false;
                    const lowerValue = value.toLowerCase();
                    return (
                      key.toLowerCase().includes('state') ||
                      key.toLowerCase().includes('status') ||
                      key.toLowerCase().includes('risk') ||
                      key.toLowerCase().includes('issue')
                    );
                  };

                  // Function to get badge color based on value
                  const getBadgeColor = (key: string, value: string) => {
                    if (!value) return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
                    const lowerValue = value.toLowerCase();
                    if (lowerValue.includes('no') || lowerValue.includes('none') || lowerValue.includes('open')) {
                      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
                    }
                    if (lowerValue.includes('error') || lowerValue.includes('closed') || lowerValue.includes('failed')) {
                      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
                    }
                    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
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
                              const shouldBadge = key.toLowerCase().includes('state') || 
                                                key.toLowerCase().includes('status') || 
                                                key.toLowerCase().includes('risk') || 
                                                key.toLowerCase().includes('issue');
                              
                              const getBadgeClass = () => {
                                if (value === null || value === undefined) {
                                  return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
                                }
                                const lowerValue = stringValue.toLowerCase();
                                if (lowerValue.includes('no') || lowerValue.includes('none') || lowerValue.includes('open')) {
                                  return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
                                }
                                if (lowerValue.includes('error') || lowerValue.includes('closed') || lowerValue.includes('failed')) {
                                  return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
                                }
                                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
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
                                          <span className="font-medium">{nestedKey} : </span>
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
                                      {/* <div className="font-medium text-gray-700 dark:text-gray-300">{formatKey(key)}</div> */}
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
              <Button variant="outline" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              <Button variant="outline" onClick={handleCopy}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Report
              </Button>
              <div className="flex gap-2 relative">
                <Input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={showEmailError ? "ring-2 ring-red-500" : ""}
                />
                <Button onClick={handleEmailReport} className="relative">
                  {isEmailSent ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </motion.div>
                  ) : (
                    <Mail className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      

      {/* Selection Required Dialog  */}
      <Dialog open={showError} onOpenChange={setShowError}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Selection Required
            </DialogTitle>
            <DialogDescription>Please select at least one scanning tool before starting the scan.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}