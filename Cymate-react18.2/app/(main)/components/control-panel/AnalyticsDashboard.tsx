"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import {
  LineChart,
  BarChart,
  PieChart,
  AreaChart,
  Area,
  Pie,
  Bar,
  Cell,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import {
  Download,
  RefreshCw,
  Calendar,
  ChevronDown,
  Zap,
  Shield,
  AlertTriangle,
  UserCheck,
  ArrowUpRight,
  ArrowDownRight,
  Maximize2,
  X,
  BarChart3,
  PieChartIcon,
  LineChartIcon,
  Activity,
} from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"
import { Spinner } from "@/components/ui/spinner"

// Types
interface SecurityMetric {
  title: string
  value: number
  change: number
  changeType: "increase" | "decrease"
  period: string
  icon: React.ReactNode
  color: string
}

interface ChartData {
  name: string
  value: number
  fill?: string
}

interface TimeSeriesData {
  name: string
  threats: number
  incidents: number
  vulnerabilities: number
}

interface VulnerabilitySeverity {
  name: string
  value: number
  color: string
}

interface UserActivity {
  name: string
  logins: number
  actions: number
}

interface ThreatOrigin {
  subject: string
  A: number
  B: number
  fullMark: number
}

// Time periods for the dropdown
const timePeriods = [
  { value: "today", label: "Today" },
  { value: "week", label: "Last 7 Days" },
  { value: "month", label: "Last 30 Days" },
  { value: "quarter", label: "Last Quarter" },
  { value: "year", label: "Last Year" },
]

// Chart types
const chartTypes = [
  { value: "line", label: "Line", icon: <LineChartIcon className="h-4 w-4" /> },
  { value: "bar", label: "Bar", icon: <BarChart3 className="h-4 w-4" /> },
  { value: "area", label: "Area", icon: <Activity className="h-4 w-4" /> },
  { value: "pie", label: "Pie", icon: <PieChartIcon className="h-4 w-4" /> },
]

// Generate random data for charts
const generateTimeSeriesData = (days: number, factor = 1) => {
  return Array.from({ length: days }).map((_, i) => ({
    name: `Day ${i + 1}`,
    threats: Math.floor(Math.random() * 50 * factor) + 10,
    incidents: Math.floor(Math.random() * 20 * factor) + 5,
    vulnerabilities: Math.floor(Math.random() * 30 * factor) + 15,
  }))
}

const generateVulnerabilityData = (): VulnerabilitySeverity[] => {
  return [
    { name: "Critical", value: Math.floor(Math.random() * 20) + 5, color: "#ef4444" },
    { name: "High", value: Math.floor(Math.random() * 30) + 15, color: "#f97316" },
    { name: "Medium", value: Math.floor(Math.random() * 50) + 25, color: "#eab308" },
    { name: "Low", value: Math.floor(Math.random() * 70) + 40, color: "#22c55e" },
  ]
}

const generateUserActivityData = (days: number) => {
  return Array.from({ length: days }).map((_, i) => ({
    name: `Day ${i + 1}`,
    logins: Math.floor(Math.random() * 100) + 50,
    actions: Math.floor(Math.random() * 200) + 100,
  }))
}

const generateSecurityMetrics = (): SecurityMetric[] => {
  return [
    {
      title: "Security Incidents",
      value: Math.floor(Math.random() * 100) + 20,
      change: Math.floor(Math.random() * 10) - 5,
      changeType: Math.random() > 0.5 ? "increase" : "decrease",
      period: "vs. previous period",
      icon: <Shield className="h-5 w-5" />,
      color: "bg-red-500",
    },
    {
      title: "Threats Detected",
      value: Math.floor(Math.random() * 500) + 100,
      change: Math.floor(Math.random() * 15) - 5,
      changeType: Math.random() > 0.5 ? "increase" : "decrease",
      period: "vs. previous period",
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "bg-amber-500",
    },
    {
      title: "Vulnerabilities",
      value: Math.floor(Math.random() * 200) + 50,
      change: Math.floor(Math.random() * 20) - 10,
      changeType: Math.random() > 0.5 ? "increase" : "decrease",
      period: "vs. previous period",
      icon: <Zap className="h-5 w-5" />,
      color: "bg-blue-500",
    },
    {
      title: "Active Users",
      value: Math.floor(Math.random() * 300) + 75,
      change: Math.floor(Math.random() * 12) - 6,
      changeType: Math.random() > 0.5 ? "increase" : "decrease",
      period: "vs. previous period",
      icon: <UserCheck className="h-5 w-5" />,
      color: "bg-green-500",
    },
  ]
}

const generateThreatOriginData = (): ThreatOrigin[] => {
  return [
    {
      subject: "Malware",
      A: Math.floor(Math.random() * 100) + 50,
      B: Math.floor(Math.random() * 100) + 30,
      fullMark: 150,
    },
    {
      subject: "Phishing",
      A: Math.floor(Math.random() * 100) + 50,
      B: Math.floor(Math.random() * 100) + 30,
      fullMark: 150,
    },
    {
      subject: "DDoS",
      A: Math.floor(Math.random() * 100) + 50,
      B: Math.floor(Math.random() * 100) + 30,
      fullMark: 150,
    },
    {
      subject: "Insider",
      A: Math.floor(Math.random() * 100) + 50,
      B: Math.floor(Math.random() * 100) + 30,
      fullMark: 150,
    },
    {
      subject: "Zero-day",
      A: Math.floor(Math.random() * 100) + 50,
      B: Math.floor(Math.random() * 100) + 30,
      fullMark: 150,
    },
    {
      subject: "Ransomware",
      A: Math.floor(Math.random() * 100) + 50,
      B: Math.floor(Math.random() * 100) + 30,
      fullMark: 150,
    },
  ]
}

// Get data based on selected time period
const getDataForTimePeriod = (period: string) => {
  switch (period) {
    case "today":
      return {
        timeSeriesData: generateTimeSeriesData(24), // 24 hours
        userActivityData: generateUserActivityData(24),
        days: 24,
        label: "Hours",
      }
    case "week":
      return {
        timeSeriesData: generateTimeSeriesData(7), // 7 days
        userActivityData: generateUserActivityData(7),
        days: 7,
        label: "Days",
      }
    case "month":
      return {
        timeSeriesData: generateTimeSeriesData(30), // 30 days
        userActivityData: generateUserActivityData(30),
        days: 30,
        label: "Days",
      }
    case "quarter":
      return {
        timeSeriesData: generateTimeSeriesData(90, 2), // 90 days
        userActivityData: generateUserActivityData(90),
        days: 90,
        label: "Days",
      }
    case "year":
      return {
        timeSeriesData: generateTimeSeriesData(12, 3), // 12 months
        userActivityData: generateUserActivityData(12),
        days: 12,
        label: "Months",
      }
    default:
      return {
        timeSeriesData: generateTimeSeriesData(7), // Default to 7 days
        userActivityData: generateUserActivityData(7),
        days: 7,
        label: "Days",
      }
  }
}

// Component for a stat card
const StatCard = ({ metric }: { metric: SecurityMetric }) => {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    // Animate the value change
    const duration = 1000 // ms
    const steps = 20
    const stepDuration = duration / steps
    const increment = metric.value / steps

    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      setDisplayValue((prev) => {
        const newValue = increment * currentStep

        if (currentStep >= steps) {
          clearInterval(timer)
          return metric.value
        }

        return Math.floor(newValue)
      })
    }, stepDuration)

    return () => clearInterval(timer)
  }, [metric.value])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-lg ${metric.color} bg-opacity-20 dark:bg-opacity-30`}>
          <div className={`text-${metric.color.split("-")[1]}-600 dark:text-${metric.color.split("-")[1]}-400`}>
            {metric.icon}
          </div>
        </div>
        <div
          className={`text-sm font-medium px-2 py-1 rounded-full ${
            metric.changeType === "increase"
              ? metric.title === "Security Incidents" || metric.title === "Vulnerabilities"
                ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
              : metric.title === "Security Incidents" || metric.title === "Vulnerabilities"
                ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
          } flex items-center`}
        >
          {metric.changeType === "increase" ? (
            <ArrowUpRight className="h-3 w-3 mr-1" />
          ) : (
            <ArrowDownRight className="h-3 w-3 mr-1" />
          )}
          {Math.abs(metric.change)}%
        </div>
      </div>
      <div className="mt-3">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{metric.title}</h3>
        <p className="text-2xl font-bold mt-1">{displayValue.toLocaleString()}</p>
        <p className="text-xs text-gray-400 mt-1">{metric.period}</p>
      </div>
    </motion.div>
  )
}

// Chart Card Component
const ChartCard = ({
  title,
  description,
  children,
  onRefresh,
  isRefreshing = false,
  onMaximize,
  chartType,
  onChartTypeChange,
  showChartTypeSelector = false,
}: {
  title: string
  description: string
  children: React.ReactNode
  onRefresh: () => void
  isRefreshing?: boolean
  onMaximize?: () => void
  chartType?: string
  onChartTypeChange?: (type: string) => void
  showChartTypeSelector?: boolean
}) => {
  const [showChartTypes, setShowChartTypes] = useState(false)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          {showChartTypeSelector && (
            <div className="relative">
              <button
                onClick={() => setShowChartTypes(!showChartTypes)}
                className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors flex items-center gap-1"
              >
                {chartTypes.find((type) => type.value === chartType)?.icon || <BarChart3 className="h-4 w-4" />}
                <ChevronDown className="h-3 w-3" />
              </button>
              {showChartTypes && (
                <div className="absolute right-0 mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                  {chartTypes.map((type) => (
                    <button
                      key={type.value}
                      className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        onChartTypeChange?.(type.value)
                        setShowChartTypes(false)
                      }}
                    >
                      {type.icon}
                      {type.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <button
            onClick={onRefresh}
            className={`p-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors ${
              isRefreshing ? "opacity-50" : ""
            }`}
            disabled={isRefreshing}
          >
            {isRefreshing ? <Spinner className="h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}
          </button>
          {onMaximize && (
            <button
              onClick={onMaximize}
              className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

// Modal Component for maximized charts
const ChartModal = ({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 flex-1 overflow-auto">{children}</div>
      </motion.div>
    </div>
  )
}

// Main Analytics Dashboard component
export default function AnalyticsDashboard() {
  const { toast } = useToast()
  const [timePeriod, setTimePeriod] = useState("week")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetric[]>(generateSecurityMetrics())
  const [vulnerabilityData, setVulnerabilityData] = useState<VulnerabilitySeverity[]>(generateVulnerabilityData())
  const [threatOriginData, setThreatOriginData] = useState<ThreatOrigin[]>(generateThreatOriginData())
  const [showTimePeriods, setShowTimePeriods] = useState(false)
  const [maximizedChart, setMaximizedChart] = useState<string | null>(null)
  const [incidentChartType, setIncidentChartType] = useState("line")
  const [userActivityChartType, setUserActivityChartType] = useState("bar")
  const dashboardRef = useRef<HTMLDivElement>(null)

  // Get data based on selected time period
  const { timeSeriesData, userActivityData, days, label } = getDataForTimePeriod(timePeriod)

  // Function to refresh all charts
  const refreshAllCharts = () => {
    setIsRefreshing(true)

    // Show toast for visual feedback
    toast({
      title: "Refreshing dashboard data",
      description: "Fetching the latest security analytics...",
    })

    // Simulate API call delay
    setTimeout(() => {
      setSecurityMetrics(generateSecurityMetrics())
      setVulnerabilityData(generateVulnerabilityData())
      setThreatOriginData(generateThreatOriginData())
      setIsRefreshing(false)

      toast({
        title: "Dashboard refreshed",
        description: "All security analytics are now up-to-date.",
      })
    }, 1000)
  }

  // Generate PDF of the dashboard
  const generatePDF = () => {
    toast({
      title: "Generating PDF",
      description: "Your dashboard export is being prepared...",
    })

    // Simulate PDF generation
    setTimeout(() => {
      toast({
        title: "PDF Generated",
        description: "Your security analytics dashboard has been exported.",
      })
    }, 1500)
  }

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-md shadow-md">
          <p className="text-sm font-medium">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6" ref={dashboardRef}>
      {/* Dashboard Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-2xl font-bold">Security Analytics</h2>
          <p className="text-gray-500 dark:text-gray-400">Comprehensive overview of your security posture</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Time Period Selector */}
          <div className="relative">
            <button
              onClick={() => setShowTimePeriods(!showTimePeriods)}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm">
                {timePeriods.find((period) => period.value === timePeriod)?.label || "Last 7 Days"}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>
            {showTimePeriods && (
              <div className="absolute right-0 mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                {timePeriods.map((period) => (
                  <button
                    key={period.value}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      setTimePeriod(period.value)
                      setShowTimePeriods(false)
                    }}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Manual Refresh Button */}
          <button
            onClick={refreshAllCharts}
            disabled={isRefreshing}
            className={`flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
              isRefreshing ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isRefreshing ? (
              <Spinner className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            ) : (
              <RefreshCw className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            )}
            <span className="text-sm">Refresh</span>
          </button>

          {/* Export Button */}
          <button
            onClick={generatePDF}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-2 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span className="text-sm font-medium">Export</span>
          </button>
        </div>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {securityMetrics.map((metric, index) => (
          <StatCard key={index} metric={metric} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Incidents Chart */}
        <ChartCard
          title="Security Incidents Trend"
          description={`Incidents tracked over the last ${days} ${label.toLowerCase()}`}
          onRefresh={() => {
            setIsRefreshing(true)
            setTimeout(() => {
              setIsRefreshing(false)
            }, 800)
          }}
          isRefreshing={isRefreshing}
          onMaximize={() => setMaximizedChart("incidents")}
          chartType={incidentChartType}
          onChartTypeChange={setIncidentChartType}
          showChartTypeSelector={true}
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {incidentChartType === "line" ? (
                <LineChart data={timeSeriesData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="threats"
                    stroke="#ec4899"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                    animationDuration={1000}
                    animationEasing="ease-in-out"
                  />
                  <Line
                    type="monotone"
                    dataKey="incidents"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    animationDuration={1000}
                    animationEasing="ease-in-out"
                  />
                  <Line
                    type="monotone"
                    dataKey="vulnerabilities"
                    stroke="#f97316"
                    strokeWidth={2}
                    animationDuration={1000}
                    animationEasing="ease-in-out"
                  />
                </LineChart>
              ) : incidentChartType === "bar" ? (
                <BarChart data={timeSeriesData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="threats" fill="#ec4899" animationDuration={1000} />
                  <Bar dataKey="incidents" fill="#8b5cf6" animationDuration={1000} />
                  <Bar dataKey="vulnerabilities" fill="#f97316" animationDuration={1000} />
                </BarChart>
              ) : (
                <AreaChart data={timeSeriesData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="threats"
                    stroke="#ec4899"
                    fill="#ec4899"
                    fillOpacity={0.2}
                    animationDuration={1000}
                  />
                  <Area
                    type="monotone"
                    dataKey="incidents"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.2}
                    animationDuration={1000}
                  />
                  <Area
                    type="monotone"
                    dataKey="vulnerabilities"
                    stroke="#f97316"
                    fill="#f97316"
                    fillOpacity={0.2}
                    animationDuration={1000}
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Vulnerability Distribution */}
        <ChartCard
          title="Vulnerability Severity Distribution"
          description="Distribution of vulnerabilities by severity level"
          onRefresh={() => {
            setIsRefreshing(true)
            setTimeout(() => {
              setVulnerabilityData(generateVulnerabilityData())
              setIsRefreshing(false)
            }, 800)
          }}
          isRefreshing={isRefreshing}
          onMaximize={() => setMaximizedChart("vulnerabilities")}
        >
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vulnerabilityData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {vulnerabilityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* User Activity */}
        <ChartCard
          title="User Activity Monitoring"
          description={`User logins and actions over the last ${days} ${label.toLowerCase()}`}
          onRefresh={() => {
            setIsRefreshing(true)
            setTimeout(() => {
              setIsRefreshing(false)
            }, 800)
          }}
          isRefreshing={isRefreshing}
          onMaximize={() => setMaximizedChart("userActivity")}
          chartType={userActivityChartType}
          onChartTypeChange={setUserActivityChartType}
          showChartTypeSelector={true}
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {userActivityChartType === "bar" ? (
                <BarChart data={userActivityData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="logins"
                    fill="#0ea5e9"
                    name="Logins"
                    animationDuration={1000}
                    animationEasing="ease-in-out"
                  />
                  <Bar
                    dataKey="actions"
                    fill="#22d3ee"
                    name="User Actions"
                    animationDuration={1000}
                    animationEasing="ease-in-out"
                  />
                </BarChart>
              ) : userActivityChartType === "line" ? (
                <LineChart data={userActivityData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="logins"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    name="Logins"
                    animationDuration={1000}
                    animationEasing="ease-in-out"
                  />
                  <Line
                    type="monotone"
                    dataKey="actions"
                    stroke="#22d3ee"
                    strokeWidth={2}
                    name="User Actions"
                    animationDuration={1000}
                    animationEasing="ease-in-out"
                  />
                </LineChart>
              ) : (
                <AreaChart data={userActivityData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="logins"
                    stroke="#0ea5e9"
                    fill="#0ea5e9"
                    fillOpacity={0.2}
                    name="Logins"
                    animationDuration={1000}
                  />
                  <Area
                    type="monotone"
                    dataKey="actions"
                    stroke="#22d3ee"
                    fill="#22d3ee"
                    fillOpacity={0.2}
                    name="User Actions"
                    animationDuration={1000}
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Threat Origin Analysis */}
        <ChartCard
          title="Threat Origin Analysis"
          description="Distribution of threats by origin type"
          onRefresh={() => {
            setIsRefreshing(true)
            setTimeout(() => {
              setThreatOriginData(generateThreatOriginData())
              setIsRefreshing(false)
            }, 800)
          }}
          isRefreshing={isRefreshing}
          onMaximize={() => setMaximizedChart("threatOrigin")}
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={threatOriginData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 150]} />
                <Radar
                  name="Current Period"
                  dataKey="A"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                  animationDuration={1000}
                />
                <Radar
                  name="Previous Period"
                  dataKey="B"
                  stroke="#ec4899"
                  fill="#ec4899"
                  fillOpacity={0.6}
                  animationDuration={1000}
                />
                <Legend />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Security Score Trend */}
      <ChartCard
        title="Security Posture Score Trend"
        description="Overall security score trend analysis"
        onRefresh={() => {
          setIsRefreshing(true)
          setTimeout(() => {
            setIsRefreshing(false)
          }, 800)
        }}
        isRefreshing={isRefreshing}
        onMaximize={() => setMaximizedChart("securityScore")}
      >
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={timeSeriesData.map((item, index) => ({
                name: item.name,
                score: 80 - Math.floor(Math.random() * 20) + index * 0.5,
              }))}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => [`${value}%`, "Security Score"]} content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
              {/* Threshold line at 80% */}
              <Line
                type="monotone"
                dataKey={() => 80}
                stroke="#ef4444"
                strokeDasharray="5 5"
                strokeWidth={2}
                name="Minimum Threshold"
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Modals for maximized charts */}
      <ChartModal
        isOpen={maximizedChart === "incidents"}
        onClose={() => setMaximizedChart(null)}
        title="Security Incidents Trend"
      >
        <div className="h-[600px]">
          <ResponsiveContainer width="100%" height="100%">
            {incidentChartType === "line" ? (
              <LineChart data={timeSeriesData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="threats"
                  stroke="#ec4899"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                />
                <Line
                  type="monotone"
                  dataKey="incidents"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                />
                <Line
                  type="monotone"
                  dataKey="vulnerabilities"
                  stroke="#f97316"
                  strokeWidth={2}
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                />
              </LineChart>
            ) : incidentChartType === "bar" ? (
              <BarChart data={timeSeriesData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="threats" fill="#ec4899" animationDuration={1000} />
                <Bar dataKey="incidents" fill="#8b5cf6" animationDuration={1000} />
                <Bar dataKey="vulnerabilities" fill="#f97316" animationDuration={1000} />
              </BarChart>
            ) : (
              <AreaChart data={timeSeriesData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="threats"
                  stroke="#ec4899"
                  fill="#ec4899"
                  fillOpacity={0.2}
                  animationDuration={1000}
                />
                <Area
                  type="monotone"
                  dataKey="incidents"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.2}
                  animationDuration={1000}
                />
                <Area
                  type="monotone"
                  dataKey="vulnerabilities"
                  stroke="#f97316"
                  fill="#f97316"
                  fillOpacity={0.2}
                  animationDuration={1000}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </ChartModal>

      <ChartModal
        isOpen={maximizedChart === "vulnerabilities"}
        onClose={() => setMaximizedChart(null)}
        title="Vulnerability Severity Distribution"
      >
        <div className="h-[600px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={vulnerabilityData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={200}
                fill="#8884d8"
                dataKey="value"
                animationDuration={1000}
                animationEasing="ease-in-out"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {vulnerabilityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </ChartModal>

      <ChartModal
        isOpen={maximizedChart === "userActivity"}
        onClose={() => setMaximizedChart(null)}
        title="User Activity Monitoring"
      >
        <div className="h-[600px]">
          <ResponsiveContainer width="100%" height="100%">
            {userActivityChartType === "bar" ? (
              <BarChart data={userActivityData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="logins"
                  fill="#0ea5e9"
                  name="Logins"
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                />
                <Bar
                  dataKey="actions"
                  fill="#22d3ee"
                  name="User Actions"
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                />
              </BarChart>
            ) : userActivityChartType === "line" ? (
              <LineChart data={userActivityData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="logins"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  name="Logins"
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                />
                <Line
                  type="monotone"
                  dataKey="actions"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  name="User Actions"
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                />
              </LineChart>
            ) : (
              <AreaChart data={userActivityData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="logins"
                  stroke="#0ea5e9"
                  fill="#0ea5e9"
                  fillOpacity={0.2}
                  name="Logins"
                  animationDuration={1000}
                />
                <Area
                  type="monotone"
                  dataKey="actions"
                  stroke="#22d3ee"
                  fill="#22d3ee"
                  fillOpacity={0.2}
                  name="User Actions"
                  animationDuration={1000}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </ChartModal>

      <ChartModal
        isOpen={maximizedChart === "threatOrigin"}
        onClose={() => setMaximizedChart(null)}
        title="Threat Origin Analysis"
      >
        <div className="h-[600px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={threatOriginData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 150]} />
              <Radar
                name="Current Period"
                dataKey="A"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.6}
                animationDuration={1000}
              />
              <Radar
                name="Previous Period"
                dataKey="B"
                stroke="#ec4899"
                fill="#ec4899"
                fillOpacity={0.6}
                animationDuration={1000}
              />
              <Legend />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </ChartModal>

      <ChartModal
        isOpen={maximizedChart === "securityScore"}
        onClose={() => setMaximizedChart(null)}
        title="Security Posture Score Trend"
      >
        <div className="h-[600px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={timeSeriesData.map((item, index) => ({
                name: item.name,
                score: 80 - Math.floor(Math.random() * 20) + index * 0.5,
              }))}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => [`${value}%`, "Security Score"]} content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
              {/* Threshold line at 80% */}
              <Line
                type="monotone"
                dataKey={() => 80}
                stroke="#ef4444"
                strokeDasharray="5 5"
                strokeWidth={2}
                name="Minimum Threshold"
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartModal>
    </div>
  )
}
