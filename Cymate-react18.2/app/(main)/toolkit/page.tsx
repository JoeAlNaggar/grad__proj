import Link from "next/link"
import { Shield, Wifi, Globe, AlertTriangle } from "lucide-react"
const tools = [
	{
		name: "Malware Detection",
		icon: Shield,
		description: "Scan your system for malware and viruses",
		href: "/toolkit/malware-detection",
		color: "bg-red-500",
		textcolor: "red-500",
	},
	{
		name: "Network Scanning",
		icon: Wifi,
		description: "Analyze your network for vulnerabilities",
		href: "/toolkit/network-scanning",
		color: "bg-blue-500",
		textcolor: "blue-500",
	},
	{
		name: "Web Vulnerability",
		icon: Globe,
		description: "Identify and assess vulnerabilities in web applications",
		href: "/toolkit/web-vulnerability",
		color: "bg-green-500",
		textcolor: "green-500",
	},
	{
		name: "Threat Intelligence",
		icon: AlertTriangle,
		description: "Get real-time threat intelligence updates",
		href: "/toolkit/threat-intelligence",
		color: "bg-yellow-500",
		textcolor: "yellow-500",
	},
]

export default function Toolkit() {
	return (
    <div className="space-y-8">

      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white rounded-3xl p-8 shadow-xl">
        <h1 className="text-4xl font-bold mb-4">Cybersecurity Toolkit</h1>
        <p className="text-xl">
          Powerful tools to protect your digital assets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {tools.map((tool, index) => (
          <Link key={index} href={tool.href}>
            <div className="group bg-white dark:bg-gray-800/30 backdrop-filter backdrop-blur-lg border border-white/20 dark:border-white/10 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer dark:hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]">
              <div className={`h-3 ${tool.color}`}></div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div
                    className={`p-3 rounded-full ${tool.color} mr-4`}
                  >
                    <tool.icon
                      className={`w-8 h-8 ${tool.color} text-opacity-100`}
                    />
                  </div>
                  <h2 className="text-2xl font-semibold">{tool.name}</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {tool.description}
                </p>
                <div className="flex justify-end">
                  <span
                    className={`text-blue-600 dark:text-white ${
                      tool.textcolor === "red-500"
                        ? "group-hover:text-red-500"
                        : tool.textcolor === "yellow-500"
                        ? "group-hover:text-yellow-500"
                        : tool.textcolor === "green-500"
                        ? "group-hover:text-green-500"
                        : "group-hover:text-blue-500"
                    }`}
                  >
                    Launch Tool →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}

      </div>
    </div>
  );
}
