"use client"

import { useState } from "react"
import { Globe, MapPin, Wifi, Server, Database, Flag, Loader, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/lib/hooks/use-toast"

// Create a context or use an existing event system for notifications
// This is a simple example using a custom event
const sendNotification = (title: string, message: string, type: "success" | "error") => {
  // Create and dispatch a custom event for notifications
  const event = new CustomEvent("notification", {
    detail: {
      name: title,
      description: message,
      time: new Date().toLocaleString(),
      icon: type === "success" ? "✅" : "⚠️",
      color: type === "success" ? "#00C9A7" : "#FF3D71",
    },
  })

  window.dispatchEvent(event)
}

// Dummy data for Egypt
const ipInfo = {
  ip: "156.208.118.10",
  hostname: "156-208-118-10.orange.eg",
  city: "Cairo",
  region: "Cairo Governorate",
  country: "Egypt",
  loc: "30.0626,31.2497",
  org: "AS8452 TE-AS",
  postal: "11511",
  timezone: "Africa/Cairo",
  asn: {
    asn: "AS8452",
    name: "TE-AS",
    domain: "te.eg",
    route: "156.208.0.0/13",
    type: "ISP",
  },
  company: {
    name: "Telecom Egypt",
    domain: "te.eg",
    type: "ISP",
  },
  privacy: {
    vpn: false,
    proxy: false,
    tor: false,
    relay: false,
    hosting: false,
    service: "",
  },
  abuse: {
    address: "Cairo, Egypt",
    country: "EG",
    email: "abuse@te.eg",
    name: "Abuse",
    network: "156.208.0.0/13",
    phone: "+20 2 33440700",
  },
}

// Set up some simulated issues to fix
const simulatedIssues = {
  dns: {
    hasIssue: true,
    message: "DNS misconfiguration detected: hostname resolution inconsistent",
  },
  geo: {
    hasIssue: false,
    message: "Geolocation data is accurate",
  },
  network: {
    hasIssue: true,
    message: "Network route anomaly detected: potential BGP hijacking",
  },
  privacy: {
    hasIssue: false,
    message: "Privacy checks passed: no VPN or proxy detected",
  },
}

export default function OSINTInfoCard() {
  const { toast } = useToast()
  const [isTesting, setIsTesting] = useState(false)
  const [hasIssues, setHasIssues] = useState<boolean | null>(null)
  const [isFixing, setIsFixing] = useState(false)
  const [fixComplete, setFixComplete] = useState(false)

  // Add event listener for notifications on component mount
  useState(() => {
    const handleNotification = (event: any) => {
      if (event.detail) {
        toast({
          title: event.detail.name,
          description: event.detail.description,
        })
      }
    }

    window.addEventListener("notification", handleNotification)

    return () => {
      window.removeEventListener("notification", handleNotification)
    }
  })

  const handleTest = async () => {
    setIsTesting(true)
    setHasIssues(null)
    setFixComplete(false)

    // Simulate testing process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Check if any simulated issues exist
    const foundIssues = Object.values(simulatedIssues).some((issue) => issue.hasIssue)
    setHasIssues(foundIssues)
    setIsTesting(false)

    // Send notification
    if (foundIssues) {
      sendNotification(
        "OSINT Test Complete",
        "Issues detected in your OSINT configuration. Please run the fix to resolve them.",
        "error",
      )
    } else {
      sendNotification("OSINT Test Complete", "All OSINT systems are functioning correctly!", "success")
    }
  }

  const handleFix = async () => {
    setIsFixing(true)

    // Simulate fixing process with random success/failure
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // 80% chance of successful fix
    const isSuccessful = Math.random() > 0.2

    if (isSuccessful) {
      setHasIssues(false)
      sendNotification(
        "OSINT Fix Complete",
        "All issues have been successfully resolved. Your OSINT configuration is now optimal.",
        "success",
      )
    } else {
      setHasIssues(true)
      sendNotification(
        "OSINT Fix Failed",
        "Some issues could not be automatically resolved. Manual intervention may be required.",
        "error",
      )
    }

    setIsFixing(false)
    setFixComplete(true)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-bold">OSINT Info: Egypt</h3>
        <div className="flex space-x-2">
          {!isTesting && !isFixing && (
            <Button
              onClick={handleTest}
              className="group relative px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center gap-2 z-10">
                <Globe className="w-4 h-4 animate-pulse" />
                <span className="font-medium">Test OSINT</span>
              </div>
            </Button>
          )}

          {isTesting && (
            <Button disabled className="bg-gray-500 text-white">
              <Loader className="animate-spin mr-2 h-4 w-4" />
              Testing...
            </Button>
          )}

          {hasIssues && !isFixing && !fixComplete && (
            <Button onClick={handleFix} className="bg-red-500 hover:bg-red-600 text-white transition-all">
              Fix Issues
            </Button>
          )}

          {isFixing && (
            <Button disabled className="bg-gray-500 text-white">
              <Loader className="animate-spin mr-2 h-4 w-4" />
              Fixing...
            </Button>
          )}

          {fixComplete && !hasIssues && (
            <div className="flex items-center text-green-500">
              <CheckCircle className="mr-1 h-5 w-5" />
              <span>Fixed</span>
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <Globe className="mr-2 text-blue-500" />
          <div>
            <p className="font-semibold">IP</p>
            <p>{ipInfo.ip}</p>
          </div>
        </div>
        <div className="flex items-center">
          <MapPin className="mr-2 text-green-500" />
          <div>
            <p className="font-semibold">Location</p>
            <p>
              {ipInfo.city}, {ipInfo.region}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <Wifi className="mr-2 text-purple-500" />
          <div>
            <p className="font-semibold">ISP</p>
            <p>{ipInfo.org}</p>
          </div>
        </div>
        <div className="flex items-center">
          <Server className="mr-2 text-red-500" />
          <div>
            <p className="font-semibold">ASN</p>
            <p>
              {ipInfo.asn.asn} ({ipInfo.asn.name})
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <Database className="mr-2 text-yellow-500" />
          <div>
            <p className="font-semibold">Hostname</p>
            <p>{ipInfo.hostname}</p>
          </div>
        </div>
        <div className="flex items-center">
          <Flag className="mr-2 text-indigo-500" />
          <div>
            <p className="font-semibold">Country</p>
            <p>{ipInfo.country}</p>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <p className="font-semibold">Additional Info:</p>
        <p>Timezone: {ipInfo.timezone}</p>
        <p>Postal Code: {ipInfo.postal}</p>
        <p>
          Company: {ipInfo.company.name} ({ipInfo.company.type})
        </p>
        <p>
          Privacy: VPN: {ipInfo.privacy.vpn ? "Yes" : "No"}, Proxy: {ipInfo.privacy.proxy ? "Yes" : "No"}, TOR:{" "}
          {ipInfo.privacy.tor ? "Yes" : "No"}
        </p>
        <p>Abuse Contact: {ipInfo.abuse.email}</p>
      </div>
    </div>
  )
}
