"use client"

import { useState, useEffect } from "react"
import {
  HardDrive,
  Database,
  Save,
  Trash2,
  Clock,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Lock,
  Unlock,
  FileText,
  Settings,
  Loader2,
  ArrowUpRight,
  Shield,
  Zap,
  Filter,
  Search,
  XCircle,
} from "lucide-react"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Types
interface StorageData {
  total: number
  used: number
  available: number
  unit: string
}

interface BackupConfig {
  enabled: boolean
  frequency: "hourly" | "daily" | "weekly" | "monthly"
  lastBackup: string
  nextBackup: string
  retention: number
  encryptionEnabled: boolean
  locations: string[]
}

interface RetentionPolicy {
  enabled: boolean
  duration: number
  autoDelete: boolean
  excludedTypes: string[]
}

interface StorageLocation {
  id: string
  name: string
  type: "local" | "cloud" | "hybrid"
  capacity: number
  used: number
  status: "online" | "offline" | "maintenance"
  encrypted: boolean
}

interface DataType {
  name: string
  size: number
  count: number
  color: string
}

export const DataManagementSection = () => {
  // State for storage data
  const [storageData, setStorageData] = useState<StorageData>({
    total: 1000,
    used: 650,
    available: 350,
    unit: "GB",
  })

  // State for backup configuration
  const [backupConfig, setBackupConfig] = useState<BackupConfig>({
    enabled: true,
    frequency: "daily",
    lastBackup: "2025-03-27 14:30:22",
    nextBackup: "2025-03-28 14:30:00",
    retention: 30,
    encryptionEnabled: true,
    locations: ["Primary Cloud Storage", "Secondary Data Center"],
  })

  // State for retention policy
  const [retentionPolicy, setRetentionPolicy] = useState<RetentionPolicy>({
    enabled: true,
    duration: 90,
    autoDelete: true,
    excludedTypes: ["user-data", "system-logs", "security-audits"],
  })

  // State for storage locations
  const [storageLocations, setStorageLocations] = useState<StorageLocation[]>([
    {
      id: "loc1",
      name: "Primary Cloud Storage",
      type: "cloud",
      capacity: 2000,
      used: 1200,
      status: "online",
      encrypted: true,
    },
    {
      id: "loc2",
      name: "Secondary Data Center",
      type: "hybrid",
      capacity: 1500,
      used: 800,
      status: "online",
      encrypted: true,
    },
    {
      id: "loc3",
      name: "Local Backup Server",
      type: "local",
      capacity: 500,
      used: 350,
      status: "maintenance",
      encrypted: false,
    },
  ])

  // State for data types
  const [dataTypes, setDataTypes] = useState<DataType[]>([
    { name: "User Data", size: 320, count: 15420, color: "#8884d8" },
    { name: "System Logs", size: 180, count: 8750, color: "#82ca9d" },
    { name: "Security Audits", size: 60, count: 2340, color: "#ffc658" },
    { name: "Media Files", size: 90, count: 1250, color: "#ff8042" },
  ])

  // State for loading
  const [isLoading, setIsLoading] = useState(true)
  const [isBackupRunning, setIsBackupRunning] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)

  // Load data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1200)
  }, [])

  // Handle backup now
  const handleBackupNow = () => {
    setIsBackupRunning(true)

    // Simulate backup process
    setTimeout(() => {
      setIsBackupRunning(false)

      // Update last backup time
      const now = new Date()
      const nextBackup = new Date(now)

      // Set next backup based on frequency
      switch (backupConfig.frequency) {
        case "hourly":
          nextBackup.setHours(nextBackup.getHours() + 1)
          break
        case "daily":
          nextBackup.setDate(nextBackup.getDate() + 1)
          break
        case "weekly":
          nextBackup.setDate(nextBackup.getDate() + 7)
          break
        case "monthly":
          nextBackup.setMonth(nextBackup.getMonth() + 1)
          break
      }

      setBackupConfig({
        ...backupConfig,
        lastBackup: now.toLocaleString(),
        nextBackup: nextBackup.toLocaleString(),
      })
    }, 3000)
  }

  // Handle storage optimization
  const handleOptimizeStorage = () => {
    setIsOptimizing(true)

    // Simulate optimization process
    setTimeout(() => {
      // Reduce used storage by 10%
      const optimizedUsed = Math.floor(storageData.used * 0.9)
      const savedSpace = storageData.used - optimizedUsed

      setStorageData({
        ...storageData,
        used: optimizedUsed,
        available: storageData.available + savedSpace,
      })

      setIsOptimizing(false)
    }, 4000)
  }

  // Toggle backup encryption
  const toggleBackupEncryption = () => {
    setBackupConfig({
      ...backupConfig,
      encryptionEnabled: !backupConfig.encryptionEnabled,
    })
  }

  // Change backup frequency
  const changeBackupFrequency = (frequency: "hourly" | "daily" | "weekly" | "monthly") => {
    setBackupConfig({
      ...backupConfig,
      frequency,
    })
  }

  // Toggle retention policy
  const toggleRetentionPolicy = () => {
    setRetentionPolicy({
      ...retentionPolicy,
      enabled: !retentionPolicy.enabled,
    })
  }

  // Change retention duration
  const changeRetentionDuration = (duration: number) => {
    setRetentionPolicy({
      ...retentionPolicy,
      duration,
    })
  }

  // Toggle auto delete
  const toggleAutoDelete = () => {
    setRetentionPolicy({
      ...retentionPolicy,
      autoDelete: !retentionPolicy.autoDelete,
    })
  }

  // Calculate storage usage percentage
  const storageUsagePercentage = (storageData.used / storageData.total) * 100

  // Prepare data for storage usage chart
  const storageUsageData = [
    { name: "Used", value: storageData.used },
    { name: "Available", value: storageData.available },
  ]

  // Prepare data for data type distribution chart
  const dataTypeDistribution = dataTypes.map((type) => ({
    name: type.name,
    size: type.size,
  }))

  // Prepare data for storage locations chart
  const storageLocationsData = storageLocations.map((location) => ({
    name: location.name,
    used: location.used,
    capacity: location.capacity,
  }))

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-cyan-500" />
        <span className="ml-3 text-xl font-medium text-gray-700 dark:text-gray-300">Loading data management...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Storage Overview Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-full bg-cyan-100 text-cyan-600 dark:bg-cyan-900 dark:text-cyan-300">
            <HardDrive className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold">Storage Overview</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Storage Usage */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Storage Usage</h3>
            <div className="flex items-center justify-center h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={storageUsageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell key="cell-0" fill="#0ea5e9" />
                    <Cell key="cell-1" fill="#e2e8f0" />
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} ${storageData.unit}`, "Storage"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center">
              <div className="text-2xl font-bold">{Math.round(storageUsagePercentage)}%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {storageData.used} {storageData.unit} used of {storageData.total} {storageData.unit}
              </div>
              <div className="mt-4">
                <button
                  onClick={handleOptimizeStorage}
                  disabled={isOptimizing}
                  className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors flex items-center justify-center gap-2 w-full"
                >
                  {isOptimizing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      Optimize Storage
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Data Type Distribution */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Data Type Distribution</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataTypeDistribution} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value) => [`${value} ${storageData.unit}`, "Size"]} />
                  <Bar dataKey="size" name="Size">
                    {dataTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={dataTypes[index].color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <div className="flex flex-wrap gap-3">
                {dataTypes.map((type) => (
                  <div key={type.name} className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }}></div>
                    <span className="text-xs">{type.name}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <button className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors flex items-center justify-center gap-2 w-full">
                  <Filter className="h-4 w-4" />
                  Filter Data Types
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={handleBackupNow}
                disabled={isBackupRunning}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {isBackupRunning ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Backup in Progress...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>Backup Now</span>
                  </>
                )}
              </button>

              <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0">
                <Shield className="h-5 w-5" />
                <span>Security Scan</span>
              </button>

              <button className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0">
                <BarChart3 className="h-5 w-5" />
                <span>Generate Report</span>
              </button>

              <button className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg flex items-center gap-2 shadow-lg shadow-green-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0">
                <Settings className="h-5 w-5" />
                <span>Advanced Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Backup Configuration Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
            <Save className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold">Backup Configuration</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Backup Settings */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Backup Settings</h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Backup Status</span>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={backupConfig.enabled}
                    onChange={() => setBackupConfig({ ...backupConfig, enabled: !backupConfig.enabled })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
                  <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    {backupConfig.enabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Backup Frequency</span>
                <select
                  value={backupConfig.frequency}
                  onChange={(e) => changeBackupFrequency(e.target.value as any)}
                  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-sm"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Encryption</span>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={backupConfig.encryptionEnabled}
                    onChange={toggleBackupEncryption}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
                  <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    {backupConfig.encryptionEnabled ? (
                      <div className="flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        <span>Encrypted</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <Unlock className="h-3 w-3" />
                        <span>Unencrypted</span>
                      </div>
                    )}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Retention Period</span>
                <select
                  value={backupConfig.retention}
                  onChange={(e) => setBackupConfig({ ...backupConfig, retention: Number.parseInt(e.target.value) })}
                  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-sm"
                >
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                  <option value="90">90 days</option>
                </select>
              </div>
            </div>

            <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-2">
                <Clock className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-700 dark:text-blue-300">Backup Schedule</h4>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Last backup: {backupConfig.lastBackup}</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Next backup: {backupConfig.nextBackup}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Backup Locations */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Backup Locations</h3>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {backupConfig.locations.map((location, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-500" />
                    <span>{location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                      <Settings className="h-4 w-4 text-gray-500" />
                    </button>
                    <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <Database className="h-4 w-4" />
                Add Backup Location
              </button>
            </div>

            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-amber-700 dark:text-amber-300">Best Practice</h4>
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    For optimal data protection, maintain at least 3 backup locations with at least one off-site.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Retention & Storage Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Retention Policy */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300">
              <Clock className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold">Data Retention Policy</h2>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Policy Status</span>
              <div className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={retentionPolicy.enabled}
                  onChange={toggleRetentionPolicy}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-purple-600"></div>
                <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  {retentionPolicy.enabled ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">Retention Duration</span>
              <select
                value={retentionPolicy.duration}
                onChange={(e) => changeRetentionDuration(Number.parseInt(e.target.value))}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-sm"
              >
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
                <option value="180">180 days</option>
                <option value="365">365 days</option>
              </select>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">Auto Delete Expired Data</span>
              <div className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={retentionPolicy.autoDelete}
                  onChange={toggleAutoDelete}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-purple-600"></div>
                <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  {retentionPolicy.autoDelete ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Excluded Data Types</h4>
              <div className="flex flex-wrap gap-2">
                {retentionPolicy.excludedTypes.map((type, index) => (
                  <div
                    key={index}
                    className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    <span>{type}</span>
                    <button className="hover:text-purple-600">
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <span>Add Type</span>
                  <span>+</span>
                </button>
              </div>
            </div>

            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 mt-4">
              <div className="flex items-start gap-2">
                <FileText className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-purple-700 dark:text-purple-300">Compliance Note</h4>
                  <p className="text-sm text-purple-600 dark:text-purple-400">
                    Current retention policy complies with industry standards. Review quarterly to ensure continued
                    compliance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Storage Locations */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
              <Database className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold">Storage Locations</h2>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                  placeholder="Search locations..."
                />
              </div>
              <button className="ml-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                <Database className="h-4 w-4" />
                Add Location
              </button>
            </div>

            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
              {storageLocations.map((location) => (
                <div
                  key={location.id}
                  className={`p-4 rounded-lg border ${
                    location.status === "online"
                      ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/10"
                      : location.status === "maintenance"
                        ? "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-900/10"
                        : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/10"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          location.status === "online"
                            ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                            : location.status === "maintenance"
                              ? "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300"
                              : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        <Database className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{location.name}</h4>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              location.status === "online"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : location.status === "maintenance"
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {location.status.charAt(0).toUpperCase() + location.status.slice(1)}
                          </span>
                          {location.encrypted && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 flex items-center gap-1">
                              <Lock className="h-3 w-3" />
                              Encrypted
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Type: {location.type.charAt(0).toUpperCase() + location.type.slice(1)}
                        </p>
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                            <span>Usage: {Math.round((location.used / location.capacity) * 100)}%</span>
                            <span>
                              {location.used} GB / {location.capacity} GB
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                            <div
                              className={`h-1.5 rounded-full ${
                                (location.used / location.capacity) > 0.9
                                  ? "bg-red-600"
                                  : location.used / location.capacity > 0.7
                                    ? "bg-amber-500"
                                    : "bg-green-600"
                              }`}
                              style={{ width: `${(location.used / location.capacity) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-full hover:bg-white/50 dark:hover:bg-black/20">
                        <Settings className="h-4 w-4 text-gray-500" />
                      </button>
                      <button className="p-1.5 rounded-full hover:bg-white/50 dark:hover:bg-black/20">
                        <ArrowUpRight className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 mt-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-green-700 dark:text-green-300">Storage Health</h4>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    All primary storage locations are operating normally. One location is under scheduled maintenance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
