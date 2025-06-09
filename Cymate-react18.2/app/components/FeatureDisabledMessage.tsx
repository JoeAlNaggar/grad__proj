import Link from "next/link"
import { Settings, AlertTriangle } from "lucide-react"

interface FeatureDisabledMessageProps {
  featureName: string
}

export default function FeatureDisabledMessage({ featureName }: FeatureDisabledMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-8 max-w-md text-center border border-yellow-200 dark:border-yellow-800">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300">
            <AlertTriangle className="h-8 w-8" />
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2 text-yellow-700 dark:text-yellow-300">Feature Temporarily Unavailable</h2>
        <p className="text-yellow-600 dark:text-yellow-400 mb-6">
          The {featureName} feature is currently undergoing maintenance or updates and is temporarily unavailable.
          Please check back later.
        </p>
        <Link
          href="/control-panel"
          className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
        >
          <Settings className="h-4 w-4" />
          Go to Control Panel
        </Link>
      </div>
    </div>
  )
}
