"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Shield,
  Lock,
  Users,
  Eye,
  AlertTriangle,
  Search,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  Save,
  Key,
  ShieldCheck,
  FileText,
  Download,
} from "lucide-react"

interface SecurityPolicy {
  id: string
  name: string
  description: string
  status: "enabled" | "disabled"
  lastUpdated: string
  category: "firewall" | "authentication" | "access" | "monitoring" | "encryption"
  severity: "critical" | "high" | "medium" | "low"
  configurable: boolean
  expanded?: boolean
  settings?: {
    name: string
    value: string | boolean | number
    type: "toggle" | "text" | "select" | "number"
    options?: string[]
  }[]
}

interface SecurityVulnerability {
  id: string
  title: string
  description: string
  severity: "critical" | "high" | "medium" | "low"
  status: "open" | "in-progress" | "resolved"
  detectedDate: string
  affectedSystems: string[]
  remediationSteps: string[]
  expanded?: boolean
}

interface SecurityLog {
  id: string
  timestamp: string
  event: string
  source: string
  severity: "critical" | "high" | "medium" | "low" | "info"
  details: string
}

export function SecurityControlsSection() {
  const [activeTab, setActiveTab] = useState<"policies" | "vulnerabilities" | "logs" | "settings">("policies")
  const [searchQuery, setSearchQuery] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanResults, setScanResults] = useState<{ found: number; fixed: number; timestamp: string } | null>(null)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationType, setNotificationType] = useState<"success" | "error" | "warning" | "info">("info")

  // Security Policies
  const [securityPolicies, setSecurityPolicies] = useState<SecurityPolicy[]>([
    {
      id: "fw-1",
      name: "Inbound Traffic Filtering",
      description: "Controls which incoming network traffic is allowed to reach your systems",
      status: "enabled",
      lastUpdated: "2025-03-15",
      category: "firewall",
      severity: "critical",
      configurable: true,
      expanded: false,
      settings: [
        {
          name: "Block all incoming traffic by default",
          value: true,
          type: "toggle",
        },
        {
          name: "Allow HTTP/HTTPS",
          value: true,
          type: "toggle",
        },
        {
          name: "Allow SSH",
          value: true,
          type: "toggle",
        },
        {
          name: "Allow FTP",
          value: false,
          type: "toggle",
        },
        {
          name: "Custom port exceptions",
          value: "22, 80, 443",
          type: "text",
        },
      ],
    },
    {
      id: "fw-2",
      name: "Outbound Traffic Filtering",
      description: "Controls which outgoing network traffic is allowed from your systems",
      status: "enabled",
      lastUpdated: "2025-03-10",
      category: "firewall",
      severity: "high",
      configurable: true,
      expanded: false,
      settings: [
        {
          name: "Block suspicious outbound connections",
          value: true,
          type: "toggle",
        },
        {
          name: "Block known malicious domains",
          value: true,
          type: "toggle",
        },
        {
          name: "Block countries",
          value: "North Korea, Iran, Russia",
          type: "text",
        },
      ],
    },
    {
      id: "auth-1",
      name: "Multi-Factor Authentication",
      description: "Requires users to provide two or more verification factors to gain access",
      status: "enabled",
      lastUpdated: "2025-03-05",
      category: "authentication",
      severity: "critical",
      configurable: true,
      expanded: false,
      settings: [
        {
          name: "Required for all users",
          value: true,
          type: "toggle",
        },
        {
          name: "MFA method",
          value: "app",
          type: "select",
          options: ["app", "sms", "email", "hardware"],
        },
        {
          name: "Remember device (days)",
          value: 30,
          type: "number",
        },
      ],
    },
    {
      id: "auth-2",
      name: "Password Policy",
      description: "Enforces strong password requirements for all user accounts",
      status: "enabled",
      lastUpdated: "2025-02-28",
      category: "authentication",
      severity: "high",
      configurable: true,
      expanded: false,
      settings: [
        {
          name: "Minimum length",
          value: 12,
          type: "number",
        },
        {
          name: "Require uppercase letters",
          value: true,
          type: "toggle",
        },
        {
          name: "Require lowercase letters",
          value: true,
          type: "toggle",
        },
        {
          name: "Require numbers",
          value: true,
          type: "toggle",
        },
        {
          name: "Require special characters",
          value: true,
          type: "toggle",
        },
        {
          name: "Password expiration (days)",
          value: 90,
          type: "number",
        },
      ],
    },
    {
      id: "access-1",
      name: "Role-Based Access Control",
      description: "Restricts system access to authorized users based on roles",
      status: "enabled",
      lastUpdated: "2025-02-20",
      category: "access",
      severity: "high",
      configurable: true,
      expanded: false,
      settings: [
        {
          name: "Enforce least privilege principle",
          value: true,
          type: "toggle",
        },
        {
          name: "Auto-revoke inactive accounts (days)",
          value: 90,
          type: "number",
        },
        {
          name: "Require approval for privilege escalation",
          value: true,
          type: "toggle",
        },
      ],
    },
    {
      id: "mon-1",
      name: "Intrusion Detection System",
      description: "Monitors network traffic for suspicious activity and policy violations",
      status: "enabled",
      lastUpdated: "2025-02-15",
      category: "monitoring",
      severity: "critical",
      configurable: true,
      expanded: false,
      settings: [
        {
          name: "Monitor mode",
          value: "active",
          type: "select",
          options: ["passive", "active"],
        },
        {
          name: "Alert threshold",
          value: "medium",
          type: "select",
          options: ["low", "medium", "high", "critical"],
        },
        {
          name: "Auto-block suspicious IPs",
          value: true,
          type: "toggle",
        },
      ],
    },
    {
      id: "enc-1",
      name: "Data Encryption",
      description: "Encrypts sensitive data at rest and in transit",
      status: "enabled",
      lastUpdated: "2025-02-10",
      category: "encryption",
      severity: "critical",
      configurable: true,
      expanded: false,
      settings: [
        {
          name: "Encrypt data at rest",
          value: true,
          type: "toggle",
        },
        {
          name: "Encrypt data in transit",
          value: true,
          type: "toggle",
        },
        {
          name: "Encryption algorithm",
          value: "AES-256",
          type: "select",
          options: ["AES-128", "AES-256", "ChaCha20"],
        },
      ],
    },
  ])

  // Security Vulnerabilities
  const [securityVulnerabilities, setSecurityVulnerabilities] = useState<SecurityVulnerability[]>([
    {
      id: "vuln-1",
      title: "Outdated SSL/TLS Version",
      description: "The system is using an outdated SSL/TLS version that has known vulnerabilities",
      severity: "high",
      status: "open",
      detectedDate: "2025-03-15",
      affectedSystems: ["Web Server", "API Gateway"],
      remediationSteps: [
        "Upgrade to TLS 1.3",
        "Disable support for TLS 1.0 and 1.1",
        "Update cipher suites to secure configurations",
      ],
      expanded: false,
    },
    {
      id: "vuln-2",
      title: "Weak SSH Configuration",
      description: "SSH service is configured with weak ciphers and authentication methods",
      severity: "medium",
      status: "in-progress",
      detectedDate: "2025-03-10",
      affectedSystems: ["Linux Servers", "Development Environment"],
      remediationSteps: [
        "Disable password authentication, use key-based authentication only",
        "Remove weak ciphers from SSH configuration",
        "Implement SSH key rotation policy",
      ],
      expanded: false,
    },
    {
      id: "vuln-3",
      title: "Exposed Admin Interface",
      description: "Administrative interface is accessible from public networks without adequate protection",
      severity: "critical",
      status: "open",
      detectedDate: "2025-03-05",
      affectedSystems: ["Admin Portal", "Management Console"],
      remediationSteps: [
        "Restrict access to admin interfaces to VPN or internal networks only",
        "Implement IP-based access controls",
        "Enable multi-factor authentication for all admin accounts",
      ],
      expanded: false,
    },
    {
      id: "vuln-4",
      title: "Unpatched Operating System",
      description: "Several servers are running operating systems with missing security patches",
      severity: "high",
      status: "open",
      detectedDate: "2025-02-28",
      affectedSystems: ["Database Server", "File Server", "Application Server"],
      remediationSteps: [
        "Apply all security patches and updates",
        "Implement automated patch management",
        "Create regular patching schedule",
      ],
      expanded: false,
    },
    {
      id: "vuln-5",
      title: "Insecure File Permissions",
      description: "Critical system files have overly permissive access rights",
      severity: "medium",
      status: "resolved",
      detectedDate: "2025-02-20",
      affectedSystems: ["Configuration Files", "Certificate Storage"],
      remediationSteps: [
        "Review and restrict file permissions",
        "Apply principle of least privilege",
        "Implement file integrity monitoring",
      ],
      expanded: false,
    },
  ])

  // Security Logs
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([
    {
      id: "log-1",
      timestamp: "2025-03-15 14:32:45",
      event: "Failed Login Attempt",
      source: "192.168.1.105",
      severity: "medium",
      details: "Multiple failed login attempts for user 'admin'",
    },
    {
      id: "log-2",
      timestamp: "2025-03-15 12:18:22",
      event: "Firewall Rule Updated",
      source: "System Admin",
      severity: "info",
      details: "Firewall rule 'Allow HTTPS' was modified",
    },
    {
      id: "log-3",
      timestamp: "2025-03-14 23:45:12",
      event: "Suspicious File Access",
      source: "user.john",
      severity: "high",
      details: "Attempted access to restricted configuration files",
    },
    {
      id: "log-4",
      timestamp: "2025-03-14 18:22:05",
      event: "New User Created",
      source: "System Admin",
      severity: "info",
      details: "New user account 'jane.doe' was created",
    },
    {
      id: "log-5",
      timestamp: "2025-03-14 15:10:33",
      event: "Malware Detected",
      source: "Endpoint Protection",
      severity: "critical",
      details: "Malicious file 'invoice.exe' was quarantined",
    },
    {
      id: "log-6",
      timestamp: "2025-03-14 11:05:18",
      event: "System Update",
      source: "Auto-updater",
      severity: "info",
      details: "Security patches were applied successfully",
    },
    {
      id: "log-7",
      timestamp: "2025-03-13 22:48:59",
      event: "Unusual Network Traffic",
      source: "Network Monitor",
      severity: "high",
      details: "Unusual outbound traffic detected to IP 203.0.113.100",
    },
    {
      id: "log-8",
      timestamp: "2025-03-13 16:33:27",
      event: "Access Control Change",
      source: "System Admin",
      severity: "medium",
      details: "User 'mark.smith' was added to 'Administrators' group",
    },
    {
      id: "log-9",
      timestamp: "2025-03-13 09:15:42",
      event: "Certificate Expiration Warning",
      source: "Certificate Manager",
      severity: "medium",
      details: "SSL certificate for 'api.example.com' will expire in 15 days",
    },
    {
      id: "log-10",
      timestamp: "2025-03-12 14:22:08",
      event: "Backup Completed",
      source: "Backup System",
      severity: "info",
      details: "Full system backup completed successfully",
    },
  ])

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    autoScan: true,
    scanFrequency: "daily",
    alertThreshold: "medium",
    autoRemediate: false,
    retentionPeriod: 90,
    emailAlerts: true,
    smsAlerts: false,
    apiIntegrations: ["slack", "jira"],
  })

  // Filter policies based on search query
  const filteredPolicies = securityPolicies.filter(
    (policy) =>
      policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Filter vulnerabilities based on search query
  const filteredVulnerabilities = securityVulnerabilities.filter(
    (vuln) =>
      vuln.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vuln.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Filter logs based on search query
  const filteredLogs = securityLogs.filter(
    (log) =>
      log.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Toggle policy expansion
  const togglePolicyExpansion = (id: string) => {
    setSecurityPolicies(
      securityPolicies.map((policy) => (policy.id === id ? { ...policy, expanded: !policy.expanded } : policy)),
    )
  }

  // Toggle policy status
  const togglePolicyStatus = (id: string) => {
    setSecurityPolicies(
      securityPolicies.map((policy) =>
        policy.id === id
          ? {
              ...policy,
              status: policy.status === "enabled" ? "disabled" : "enabled",
              lastUpdated: new Date().toISOString().split("T")[0],
            }
          : policy,
      ),
    )

    // Show notification
    showNotificationMessage(`Policy status updated successfully`, "success")
  }

  // Update policy setting
  const updatePolicySetting = (policyId: string, settingName: string, value: string | boolean | number) => {
    setSecurityPolicies(
      securityPolicies.map((policy) => {
        if (policy.id === policyId && policy.settings) {
          const updatedSettings = policy.settings.map((setting) =>
            setting.name === settingName ? { ...setting, value } : setting,
          )
          return { ...policy, settings: updatedSettings, lastUpdated: new Date().toISOString().split("T")[0] }
        }
        return policy
      }),
    )
  }

  // Toggle vulnerability expansion
  const toggleVulnerabilityExpansion = (id: string) => {
    setSecurityVulnerabilities(
      securityVulnerabilities.map((vuln) => (vuln.id === id ? { ...vuln, expanded: !vuln.expanded } : vuln)),
    )
  }

  // Update vulnerability status
  const updateVulnerabilityStatus = (id: string, status: "open" | "in-progress" | "resolved") => {
    setSecurityVulnerabilities(securityVulnerabilities.map((vuln) => (vuln.id === id ? { ...vuln, status } : vuln)))

    // Show notification
    showNotificationMessage(`Vulnerability status updated to ${status}`, "success")
  }

  // Start security scan
  const startSecurityScan = () => {
    setIsScanning(true)
    setScanProgress(0)

    // Simulate scan progress
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsScanning(false)

          // Set scan results
          setScanResults({
            found: Math.floor(Math.random() * 10),
            fixed: Math.floor(Math.random() * 5),
            timestamp: new Date().toLocaleString(),
          })

          // Show notification
          showNotificationMessage("Security scan completed successfully", "success")

          return 100
        }
        return prev + 5
      })
    }, 300)
  }

  // Update security settings
  const updateSecuritySetting = (setting: string, value: any) => {
    setSecuritySettings({
      ...securitySettings,
      [setting]: value,
    })
  }

  // Save security settings
  const saveSecuritySettings = () => {
    // In a real app, you would save these settings to a backend
    showNotificationMessage("Security settings saved successfully", "success")
  }

  // Export security report
  const exportSecurityReport = () => {
    // In a real app, you would generate and download a report
    showNotificationMessage("Security report export started", "info")
  }

  // Show notification message
  const showNotificationMessage = (message: string, type: "success" | "error" | "warning" | "info") => {
    setNotificationMessage(message)
    setNotificationType(type)
    setShowNotification(true)

    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false)
    }, 3000)
  }

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600 dark:text-red-400"
      case "high":
        return "text-orange-600 dark:text-orange-400"
      case "medium":
        return "text-yellow-600 dark:text-yellow-400"
      case "low":
        return "text-blue-600 dark:text-blue-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "enabled":
        return "text-green-600 dark:text-green-400"
      case "disabled":
        return "text-red-600 dark:text-red-400"
      case "open":
        return "text-red-600 dark:text-red-400"
      case "in-progress":
        return "text-yellow-600 dark:text-yellow-400"
      case "resolved":
        return "text-green-600 dark:text-green-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "enabled":
        return <CheckCircle className="h-4 w-4" />
      case "disabled":
        return <XCircle className="h-4 w-4" />
      case "open":
        return <AlertTriangle className="h-4 w-4" />
      case "in-progress":
        return <RefreshCw className="h-4 w-4" />
      case "resolved":
        return <CheckCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "firewall":
        return <Shield className="h-5 w-5" />
      case "authentication":
        return <Lock className="h-5 w-5" />
      case "access":
        return <Users className="h-5 w-5" />
      case "monitoring":
        return <Eye className="h-5 w-5" />
      case "encryption":
        return <Key className="h-5 w-5" />
      default:
        return <Settings className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold">Security Controls</h2>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Configure and monitor security policies, firewalls, and authentication protocols to protect your systems from
          threats.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-4 rounded-lg border border-red-200 dark:border-red-800/30">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
              <h3 className="font-medium">Security Policies</h3>
            </div>
            <p className="text-2xl font-bold">{securityPolicies.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {securityPolicies.filter((p) => p.status === "enabled").length} enabled
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800/30">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <h3 className="font-medium">Vulnerabilities</h3>
            </div>
            <p className="text-2xl font-bold">{securityVulnerabilities.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {securityVulnerabilities.filter((v) => v.status === "open").length} open
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800/30">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-medium">Security Logs</h3>
            </div>
            <p className="text-2xl font-bold">{securityLogs.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {securityLogs.filter((l) => l.severity === "critical" || l.severity === "high").length} critical/high
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border border-green-200 dark:border-green-800/30">
            <div className="flex items-center gap-2 mb-2">
              <Search className="h-5 w-5 text-green-600 dark:text-green-400" />
              <h3 className="font-medium">Security Scan</h3>
            </div>
            {scanResults ? (
              <>
                <p className="text-2xl font-bold">{scanResults.found}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{scanResults.fixed} auto-fixed</p>
              </>
            ) : (
              <button
                onClick={startSecurityScan}
                disabled={isScanning}
                className="mt-2 w-full py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Scanning... {scanProgress}%
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Start Scan
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`px-4 py-3 border-b-2 ${activeTab === "policies" ? "border-red-500 text-red-500" : "border-transparent text-gray-500 dark:text-gray-400"} font-medium transition-colors`}
            onClick={() => setActiveTab("policies")}
          >
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Policies</span>
            </div>
          </button>
          <button
            className={`px-4 py-3 border-b-2 ${activeTab === "vulnerabilities" ? "border-red-500 text-red-500" : "border-transparent text-gray-500 dark:text-gray-400"} font-medium transition-colors`}
            onClick={() => setActiveTab("vulnerabilities")}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Vulnerabilities</span>
            </div>
          </button>
          <button
            className={`px-4 py-3 border-b-2 ${activeTab === "logs" ? "border-red-500 text-red-500" : "border-transparent text-gray-500 dark:text-gray-400"} font-medium transition-colors`}
            onClick={() => setActiveTab("logs")}
          >
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Logs</span>
            </div>
          </button>
          <button
            className={`px-4 py-3 border-b-2 ${activeTab === "settings" ? "border-red-500 text-red-500" : "border-transparent text-gray-500 dark:text-gray-400"} font-medium transition-colors`}
            onClick={() => setActiveTab("settings")}
          >
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </div>
          </button>
        </div>

        {/* Search and Actions */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportSecurityReport}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md transition-colors flex items-center gap-2 text-sm"
            >
              <Download className="h-4 w-4" />
              Export Report
            </button>
            {activeTab === "policies" && (
              <button className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4" />
                Add Policy
              </button>
            )}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {/* Policies Tab */}
          {activeTab === "policies" && (
            <div className="space-y-4">
              {filteredPolicies.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>No policies found matching your search criteria.</p>
                </div>
              ) : (
                filteredPolicies.map((policy) => (
                  <div
                    key={policy.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                  >
                    <div
                      className="p-4 bg-gray-50 dark:bg-gray-800 flex justify-between items-start cursor-pointer"
                      onClick={() => togglePolicyExpansion(policy.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            policy.severity === "critical"
                              ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                              : policy.severity === "high"
                                ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                                : policy.severity === "medium"
                                  ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                                  : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                          }`}
                        >
                          {getCategoryIcon(policy.category)}
                        </div>
                        <div>
                          <h3 className="font-medium">{policy.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{policy.description}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs">
                            <span className={`flex items-center gap-1 ${getStatusColor(policy.status)}`}>
                              {getStatusIcon(policy.status)}
                              {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
                            </span>
                            <span className={`flex items-center gap-1 ${getSeverityColor(policy.severity)}`}>
                              {policy.severity.charAt(0).toUpperCase() + policy.severity.slice(1)}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Last updated: {policy.lastUpdated}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            togglePolicyStatus(policy.id)
                          }}
                          className={`p-1 rounded-full ${
                            policy.status === "enabled"
                              ? "bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                              : "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                          }`}
                        >
                          {policy.status === "enabled" ? (
                            <ToggleRight className="h-5 w-5" />
                          ) : (
                            <ToggleLeft className="h-5 w-5" />
                          )}
                        </button>
                        {policy.expanded ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* Policy Settings */}
                    {policy.expanded && policy.settings && (
                      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <h4 className="font-medium mb-3">Policy Settings</h4>
                        <div className="space-y-3">
                          {policy.settings.map((setting) => (
                            <div key={setting.name} className="flex items-center justify-between">
                              <span className="text-sm">{setting.name}</span>
                              {setting.type === "toggle" ? (
                                <button
                                  onClick={() => updatePolicySetting(policy.id, setting.name, !setting.value)}
                                  className={`p-1 rounded-full ${
                                    setting.value
                                      ? "bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                                      : "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                                  }`}
                                >
                                  {setting.value ? (
                                    <ToggleRight className="h-5 w-5" />
                                  ) : (
                                    <ToggleLeft className="h-5 w-5" />
                                  )}
                                </button>
                              ) : setting.type === "select" ? (
                                <select
                                  value={setting.value as string}
                                  onChange={(e) => updatePolicySetting(policy.id, setting.name, e.target.value)}
                                  className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700"
                                >
                                  {setting.options?.map((option) => (
                                    <option key={option} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
                              ) : setting.type === "number" ? (
                                <input
                                  type="number"
                                  value={setting.value as number}
                                  onChange={(e) =>
                                    updatePolicySetting(policy.id, setting.name, Number.parseInt(e.target.value))
                                  }
                                  className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700"
                                />
                              ) : (
                                <input
                                  type="text"
                                  value={setting.value as string}
                                  onChange={(e) => updatePolicySetting(policy.id, setting.name, e.target.value)}
                                  className="w-48 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Vulnerabilities Tab */}
          {activeTab === "vulnerabilities" && (
            <div className="space-y-4">
              {filteredVulnerabilities.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>No vulnerabilities found matching your search criteria.</p>
                </div>
              ) : (
                filteredVulnerabilities.map((vuln) => (
                  <div key={vuln.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <div
                      className="p-4 bg-gray-50 dark:bg-gray-800 flex justify-between items-start cursor-pointer"
                      onClick={() => toggleVulnerabilityExpansion(vuln.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            vuln.severity === "critical"
                              ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                              : vuln.severity === "high"
                                ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                                : vuln.severity === "medium"
                                  ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                                  : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                          }`}
                        >
                          <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium">{vuln.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{vuln.description}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs">
                            <span className={`flex items-center gap-1 ${getStatusColor(vuln.status)}`}>
                              {getStatusIcon(vuln.status)}
                              {vuln.status.charAt(0).toUpperCase() + vuln.status.slice(1)}
                            </span>
                            <span className={`flex items-center gap-1 ${getSeverityColor(vuln.severity)}`}>
                              {vuln.severity.charAt(0).toUpperCase() + vuln.severity.slice(1)}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Detected: {vuln.detectedDate}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        {vuln.expanded ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* Vulnerability Details */}
                    {vuln.expanded && (
                      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Affected Systems</h4>
                          <div className="flex flex-wrap gap-2">
                            {vuln.affectedSystems.map((system) => (
                              <span
                                key={system}
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs"
                              >
                                {system}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Remediation Steps</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            {vuln.remediationSteps.map((step, index) => (
                              <li key={index}>{step}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => updateVulnerabilityStatus(vuln.id, "in-progress")}
                            disabled={vuln.status === "in-progress" || vuln.status === "resolved"}
                            className="px-3 py-1.5 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-md hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          >
                            Mark In Progress
                          </button>
                          <button
                            onClick={() => updateVulnerabilityStatus(vuln.id, "resolved")}
                            disabled={vuln.status === "resolved"}
                            className="px-3 py-1.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-md hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          >
                            Mark Resolved
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Logs Tab */}
          {activeTab === "logs" && (
            <div>
              {filteredLogs.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>No logs found matching your search criteria.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Timestamp
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Event
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Source
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Severity
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {log.timestamp}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {log.event}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {log.source}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                log.severity === "critical"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                  : log.severity === "high"
                                    ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                                    : log.severity === "medium"
                                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                      : log.severity === "low"
                                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {log.severity.charAt(0).toUpperCase() + log.severity.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{log.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="max-w-3xl mx-auto">
              <h3 className="font-medium text-lg mb-4">Security Settings</h3>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300">Scanning Settings</h4>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Automatic Scanning</span>
                      <button
                        onClick={() => updateSecuritySetting("autoScan", !securitySettings.autoScan)}
                        className={`p-1 rounded-full ${
                          securitySettings.autoScan
                            ? "bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                            : "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                        }`}
                      >
                        {securitySettings.autoScan ? (
                          <ToggleRight className="h-5 w-5" />
                        ) : (
                          <ToggleLeft className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Scan Frequency</span>
                      <select
                        value={securitySettings.scanFrequency}
                        onChange={(e) => updateSecuritySetting("scanFrequency", e.target.value)}
                        className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700"
                      >
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Alert Threshold</span>
                      <select
                        value={securitySettings.alertThreshold}
                        onChange={(e) => updateSecuritySetting("alertThreshold", e.target.value)}
                        className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical Only</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Auto-Remediate Issues</span>
                      <button
                        onClick={() => updateSecuritySetting("autoRemediate", !securitySettings.autoRemediate)}
                        className={`p-1 rounded-full ${
                          securitySettings.autoRemediate
                            ? "bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                            : "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                        }`}
                      >
                        {securitySettings.autoRemediate ? (
                          <ToggleRight className="h-5 w-5" />
                        ) : (
                          <ToggleLeft className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300">Notification Settings</h4>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Email Alerts</span>
                      <button
                        onClick={() => updateSecuritySetting("emailAlerts", !securitySettings.emailAlerts)}
                        className={`p-1 rounded-full ${
                          securitySettings.emailAlerts
                            ? "bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                            : "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                        }`}
                      >
                        {securitySettings.emailAlerts ? (
                          <ToggleRight className="h-5 w-5" />
                        ) : (
                          <ToggleLeft className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">SMS Alerts</span>
                      <button
                        onClick={() => updateSecuritySetting("smsAlerts", !securitySettings.smsAlerts)}
                        className={`p-1 rounded-full ${
                          securitySettings.smsAlerts
                            ? "bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                            : "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                        }`}
                      >
                        {securitySettings.smsAlerts ? (
                          <ToggleRight className="h-5 w-5" />
                        ) : (
                          <ToggleLeft className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Log Retention (days)</span>
                      <input
                        type="number"
                        value={securitySettings.retentionPeriod}
                        onChange={(e) => updateSecuritySetting("retentionPeriod", Number.parseInt(e.target.value))}
                        className="w-20 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700"
                      />
                    </div>

                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">API Integrations</span>
                      <div className="flex flex-wrap gap-2">
                        {["slack", "jira", "teams", "pagerduty"].map((integration) => (
                          <div
                            key={integration}
                            onClick={() => {
                              const current = securitySettings.apiIntegrations || []
                              if (current.includes(integration)) {
                                updateSecuritySetting(
                                  "apiIntegrations",
                                  current.filter((i) => i !== integration),
                                )
                              } else {
                                updateSecuritySetting("apiIntegrations", [...current, integration])
                              }
                            }}
                            className={`px-3 py-1.5 rounded-md text-sm cursor-pointer ${
                              securitySettings.apiIntegrations?.includes(integration)
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {integration.charAt(0).toUpperCase() + integration.slice(1)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                  <button
                    onClick={saveSecuritySettings}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
              notificationType === "success"
                ? "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/30"
                : notificationType === "error"
                  ? "bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/30"
                  : notificationType === "warning"
                    ? "bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800/30"
                    : "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/30"
            }`}
          >
            {notificationMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
