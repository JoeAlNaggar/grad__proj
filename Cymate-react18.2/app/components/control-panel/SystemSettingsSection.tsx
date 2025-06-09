"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Settings,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  FileWarning,
  Server,
  Database,
  Lock,
  Users,
  FileSearch,
  Network,
  Bug,
  Fingerprint,
  HardDrive,
  Wrench,
  Activity,
  RefreshCw,
} from "lucide-react"

// Types
interface Alert {
  id: string
  title: string
  description: string
  timestamp: string
  type: "critical" | "warning" | "info"
  status: "active" | "ignored" | "solving" | "solved" | "not-solved"
}

interface SystemSettingsSectionProps {
  onAddAlert: (alert: Alert) => void
}

// Platform features that can be toggled
const platformFeatures = [
  {
    id: "malware-detection",
    name: "Malware Detection Toolkit",
    description: "Scan and analyze files for malicious content",
    icon: <Shield className="h-5 w-5" />,
    path: "/toolkit/malware-detection",
  },
  {
    id: "threat-intelligence",
    name: "Threat Intelligence",
    description: "Gather and analyze threat data from multiple sources",
    icon: <FileWarning className="h-5 w-5" />,
    path: "/toolkit/threat-intelligence",
  },
  {
    id: "web-vulnerability",
    name: "Web Vulnerability Scanner",
    description: "Identify security vulnerabilities in web applications",
    icon: <Bug className="h-5 w-5" />,
    path: "/toolkit/web-vulnerability",
  },
  {
    id: "network-scanning",
    name: "Network Scanning",
    description: "Scan and analyze network traffic for security threats",
    icon: <Network className="h-5 w-5" />,
    path: "/toolkit/network-scanning",
  },
  {
    id: "user-verification",
    name: "User Verification System",
    description: "Verify user identities and manage access permissions",
    icon: <Fingerprint className="h-5 w-5" />,
    path: "/admin/verification",
  },
  {
    id: "data-storage",
    name: "Data Storage & Backup",
    description: "Secure storage and automated backup of critical data",
    icon: <HardDrive className="h-5 w-5" />,
    path: "/admin/storage",
  },
]

// System components that will be tested
const systemComponents = [
  {
    id: "auth-system",
    name: "Authentication System",
    icon: <Lock className="h-5 w-5" />,
    testDuration: 2000,
  },
  {
    id: "database",
    name: "Database Connection",
    icon: <Database className="h-5 w-5" />,
    testDuration: 3000,
  },
  {
    id: "api-endpoints",
    name: "API Endpoints",
    icon: <Server className="h-5 w-5" />,
    testDuration: 2500,
  },
  {
    id: "file-storage",
    name: "File Storage System",
    icon: <HardDrive className="h-5 w-5" />,
    testDuration: 1800,
  },
  {
    id: "user-management",
    name: "User Management",
    icon: <Users className="h-5 w-5" />,
    testDuration: 2200,
  },
  {
    id: "security-modules",
    name: "Security Modules",
    icon: <Shield className="h-5 w-5" />,
    testDuration: 3500,
  },
]

export const SystemSettingsSection: React.FC<SystemSettingsSectionProps> = ({ onAddAlert }) => {
  // State for feature toggles - now storing DISABLED features
  const [disabledFeatures, setDisabledFeatures] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // State for system testing
  const [isTestRunning, setIsTestRunning] = useState(false)
  const [testProgress, setTestProgress] = useState(0)
  const [testResults, setTestResults] = useState<
    Array<{ id: string; name: string; status: "success" | "warning" | "error" | "pending"; message: string }>
  >([])
  const [showTestResults, setShowTestResults] = useState(false)

  // State for tracking features being fixed
  const [fixingFeatures, setFixingFeatures] = useState<string[]>([])
  const [fixResults, setFixResults] = useState<Record<string, { success: boolean; message: string }>>({})
  const [fixProgress, setFixProgress] = useState<Record<string, number>>({})

  // Load disabled features from localStorage on component mount
  useEffect(() => {
    const loadFeatures = () => {
      try {
        const savedFeatures = localStorage.getItem("disabledFeatures")
        if (savedFeatures) {
          setDisabledFeatures(JSON.parse(savedFeatures))
        } else {
          // By default, no features are disabled
          setDisabledFeatures([])
        }
      } catch (error) {
        console.error("Error loading disabled features:", error)
        // Fallback to no features disabled
        setDisabledFeatures([])
      } finally {
        setIsLoading(false)
      }
    }

    // Simulate API call delay
    setTimeout(loadFeatures, 800)
  }, [])

  // Save disabled features to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("disabledFeatures", JSON.stringify(disabledFeatures))
    }
  }, [disabledFeatures, isLoading])

  // Handle feature toggle
  const handleFeatureToggle = (featureId: string) => {
    setDisabledFeatures((prev) =>
      prev.includes(featureId) ? prev.filter((id) => id !== featureId) : [...prev, featureId],
    )
  }

  // Run system test
  const runSystemTest = () => {
    setIsTestRunning(true)
    setTestProgress(0)
    setTestResults([])
    setShowTestResults(false)

    // Initialize all components as pending
    const initialResults = systemComponents.map((component) => ({
      id: component.id,
      name: component.name,
      status: "pending" as const,
      message: "Test pending...",
    }))
    setTestResults(initialResults)

    // Simulate testing each component with different outcomes
    let completedTests = 0
    const totalTests = systemComponents.length
    const testInterval = setInterval(() => {
      if (completedTests < totalTests) {
        const component = systemComponents[completedTests]
        const randomStatus = Math.random()
        let status: "success" | "warning" | "error"
        let message = ""

        if (randomStatus > 0.8) {
          status = "error"
          message = `${component.name} test failed. Critical issue detected.`
          // Add a critical alert
          const newAlert: Alert = {
            id: `test-${Date.now()}-${component.id}`,
            title: `${component.name} Test Failed`,
            description: `Critical issue detected during system test: ${message}`,
            timestamp: new Date().toLocaleTimeString(),
            type: "critical",
            status: "active",
          }
          onAddAlert(newAlert)
        } else if (randomStatus > 0.6) {
          status = "warning"
          message = `${component.name} test completed with warnings.`
          // Add a warning alert
          const newAlert: Alert = {
            id: `test-${Date.now()}-${component.id}`,
            title: `${component.name} Test Warning`,
            description: `Warning detected during system test: ${message}`,
            timestamp: new Date().toLocaleTimeString(),
            type: "warning",
            status: "active",
          }
          onAddAlert(newAlert)
        } else {
          status = "success"
          message = `${component.name} test completed successfully.`
        }

        setTestResults((prev) =>
          prev.map((result, idx) => (idx === completedTests ? { ...result, status, message } : result)),
        )

        completedTests++
        setTestProgress((completedTests / totalTests) * 100)
      } else {
        clearInterval(testInterval)
        setIsTestRunning(false)
        setShowTestResults(true)
      }
    }, 1000)
  }

  // Handle fixing a feature
  const handleFixFeature = (featureId: string) => {
    // Start fixing process
    setFixingFeatures((prev) => [...prev, featureId])
    setFixResults((prev) => ({ ...prev, [featureId]: { success: false, message: "Diagnosing issues..." } }))
    setFixProgress((prev) => ({ ...prev, [featureId]: 0 }))

    // Simulate fixing process with progress updates
    const totalSteps = 5
    let currentStep = 0
    const stepMessages = [
      "Diagnosing issues...",
      "Checking dependencies...",
      "Repairing system files...",
      "Optimizing performance...",
      "Finalizing repairs...",
    ]

    const progressInterval = setInterval(() => {
      if (currentStep < totalSteps) {
        currentStep++
        setFixProgress((prev) => ({ ...prev, [featureId]: (currentStep / totalSteps) * 100 }))
        setFixResults((prev) => ({
          ...prev,
          [featureId]: {
            success: false,
            message: stepMessages[currentStep - 1],
          },
        }))
      } else {
        clearInterval(progressInterval)

        // Determine if fix was successful
        const isSuccessful = Math.random() > 0.4 // 60% chance of success

        if (isSuccessful) {
          // Fix was successful, re-enable the feature
          setDisabledFeatures((prev) => prev.filter((id) => id !== featureId))
          setFixResults((prev) => ({
            ...prev,
            [featureId]: {
              success: true,
              message: "Issue resolved successfully! Feature has been re-enabled.",
            },
          }))
        } else {
          // Fix failed, create an alert
          const feature = platformFeatures.find((f) => f.id === featureId)
          if (feature) {
            const newAlert: Alert = {
              id: `fix-${Date.now()}-${featureId}`,
              title: `${feature.name} Fix Failed`,
              description: `Automatic fix attempt for ${feature.name} was unsuccessful. Manual intervention required.`,
              timestamp: new Date().toLocaleTimeString(),
              type: "critical",
              status: "active",
            }
            onAddAlert(newAlert)
            setFixResults((prev) => ({
              ...prev,
              [featureId]: {
                success: false,
                message: "Fix attempt failed. Alert has been created for manual intervention.",
              },
            }))
          }
        }

        // End fixing process
        setFixingFeatures((prev) => prev.filter((id) => id !== featureId))

        // Clear fix results after 5 seconds
        setTimeout(() => {
          setFixResults((prev) => {
            const newResults = { ...prev }
            delete newResults[featureId]
            return newResults
          })
          setFixProgress((prev) => {
            const newProgress = { ...prev }
            delete newProgress[featureId]
            return newProgress
          })
        }, 5000)
      }
    }, 600) // Update progress every 600ms (total 3 seconds)
  }

  // Get button style based on feature ID
  const getButtonStyle = (featureId: string) => {
    const styles = {
      "malware-detection": {
        bg: "from-red-500 to-orange-500",
        hover: "from-red-600 to-orange-600",
        icon: <Shield className="h-5 w-5" />,
        shadow: "shadow-red-500/30",
      },
      "threat-intelligence": {
        bg: "from-blue-500 to-indigo-500",
        hover: "from-blue-600 to-indigo-600",
        icon: <Activity className="h-5 w-5" />,
        shadow: "shadow-blue-500/30",
      },
      "web-vulnerability": {
        bg: "from-purple-500 to-pink-500",
        hover: "from-purple-600 to-pink-600",
        icon: <Bug className="h-5 w-5" />,
        shadow: "shadow-purple-500/30",
      },
      "network-scanning": {
        bg: "from-green-500 to-teal-500",
        hover: "from-green-600 to-teal-600",
        icon: <Network className="h-5 w-5" />,
        shadow: "shadow-green-500/30",
      },
      "user-verification": {
        bg: "from-amber-500 to-yellow-500",
        hover: "from-amber-600 to-yellow-600",
        icon: <Fingerprint className="h-5 w-5" />,
        shadow: "shadow-amber-500/30",
      },
      "data-storage": {
        bg: "from-cyan-500 to-blue-500",
        hover: "from-cyan-600 to-blue-600",
        icon: <HardDrive className="h-5 w-5" />,
        shadow: "shadow-cyan-500/30",
      },
    }

    return (
      styles[featureId as keyof typeof styles] || {
        bg: "from-gray-500 to-slate-500",
        hover: "from-gray-600 to-slate-600",
        icon: <Wrench className="h-5 w-5" />,
        shadow: "shadow-gray-500/30",
      }
    )
  }

  return (
    <div className="space-y-6">
      {/* Feature Toggles Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300">
            <Settings className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold">Platform Features Maintenance</h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            <span className="ml-3 text-gray-500 dark:text-gray-400">Loading feature settings...</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-amber-800 dark:text-amber-300">Maintenance Mode</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    Toggle switches to ON to disable features for maintenance. When a feature is disabled, users will
                    see a maintenance message when trying to access it.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {platformFeatures.map((feature) => {
                const buttonStyle = getButtonStyle(feature.id)
                const isDisabled = disabledFeatures.includes(feature.id)
                const isFixing = fixingFeatures.includes(feature.id)
                const fixResult = fixResults[feature.id]
                const progress = fixProgress[feature.id] || 0

                return (
                  <div
                    key={feature.id}
                    className={`flex flex-col p-4 rounded-lg ${
                      isDisabled
                        ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                        : "bg-gray-50 dark:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            isDisabled
                              ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                              : "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
                          }`}
                        >
                          {feature.icon}
                        </div>
                        <div>
                          <h3 className="font-medium">{feature.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
                          {isDisabled && (
                            <p className="text-sm font-medium text-red-600 dark:text-red-400 mt-1">
                              Currently disabled for maintenance
                            </p>
                          )}
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={isDisabled}
                          onChange={() => handleFeatureToggle(feature.id)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-red-600"></div>
                        <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                          {isDisabled ? "Disabled" : "Enabled"}
                        </span>
                      </label>
                    </div>

                    {/* Fix button appears only for disabled features */}
                    {isDisabled && (
                      <div className="mt-4">
                        {/* Progress bar */}
                        {isFixing && (
                          <div className="mb-2">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-medium">{fixResult?.message}</span>
                              <span className="text-xs font-medium">{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
                              <div
                                className={`h-1.5 rounded-full transition-all duration-300 bg-gradient-to-r ${buttonStyle.bg}`}
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        <button
                          onClick={() => handleFixFeature(feature.id)}
                          disabled={isFixing}
                          className={`group w-full py-2.5 px-4 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden ${
                            isFixing
                              ? "bg-gray-400 cursor-not-allowed"
                              : `bg-gradient-to-r ${buttonStyle.bg} hover:bg-gradient-to-r hover:${buttonStyle.hover} ${buttonStyle.shadow} shadow-lg transform hover:-translate-y-0.5 active:translate-y-0`
                          }`}
                        >
                          {isFixing ? (
                            <>
                              <RefreshCw className="h-5 w-5 animate-spin" />
                              <span>Fixing...</span>
                            </>
                          ) : (
                            <>
                              {buttonStyle.icon}
                              <span>Troubleshoot & Fix</span>
                              <span className="absolute right-0 top-0 h-full w-12 bg-white/20 transform -skew-x-12 transition-transform duration-700 ease-in-out group-hover:translate-x-80"></span>
                            </>
                          )}
                        </button>

                        {/* Fix result message */}
                        {fixResult && !isFixing && (
                          <div
                            className={`mt-2 p-2 text-sm rounded-lg ${
                              fixResult.success
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                            }`}
                          >
                            {fixResult.message}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* System Test Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
            <FileSearch className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold">System Test</h2>
        </div>

        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Run a comprehensive test of all system components to ensure everything is functioning properly. Failed tests
          will generate alerts in the notification center.
        </p>

        {!isTestRunning && !showTestResults && (
          <div className="flex justify-center py-8">
            <button
              onClick={runSystemTest}
              className="relative px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg group"
            >
              <span className="relative z-10">Run System Test</span>
              <span className="absolute inset-0 rounded-lg bg-blue-600 animate-pulse group-hover:animate-none"></span>
              <span className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 opacity-70 blur-lg group-hover:opacity-100 transition-opacity"></span>
            </button>
          </div>
        )}

        {isTestRunning && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Testing in progress...</span>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{Math.round(testProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${testProgress}%` }}
              ></div>
            </div>

            <div className="space-y-3 mt-6">
              {testResults.map((result) => (
                <div key={result.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="p-2 rounded-full bg-gray-200 dark:bg-gray-600">
                    {result.status === "pending" ? (
                      <Loader2 className="h-4 w-4 animate-spin text-gray-500 dark:text-gray-400" />
                    ) : result.status === "success" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : result.status === "warning" ? (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{result.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {result.status === "pending" ? "Testing..." : result.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showTestResults && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Test Results</h3>
              <div className="flex gap-2">
                <span className="flex items-center gap-1 text-sm">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  {testResults.filter((r) => r.status === "success").length} Passed
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  {testResults.filter((r) => r.status === "warning").length} Warnings
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  {testResults.filter((r) => r.status === "error").length} Errors
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {testResults.map((result) => (
                <div
                  key={result.id}
                  className={`p-4 rounded-lg border ${
                    result.status === "success"
                      ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/10"
                      : result.status === "warning"
                        ? "border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-900/10"
                        : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        result.status === "success"
                          ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                          : result.status === "warning"
                            ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {result.status === "success" ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : result.status === "warning" ? (
                        <AlertTriangle className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{result.name}</h4>
                      <p
                        className={`text-sm ${
                          result.status === "success"
                            ? "text-green-600 dark:text-green-400"
                            : result.status === "warning"
                              ? "text-yellow-600 dark:text-yellow-400"
                              : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {result.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={runSystemTest}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                Run Test Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
