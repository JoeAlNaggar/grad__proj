import TokenPricingTiers from "../settings/management/TokenPricingTiers"

export default function BillingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Billing & Subscriptions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your token packages and upgrade your security toolkit access
          </p>
        </div>

        {/* Pricing Tiers Component */}
        <TokenPricingTiers />
      </div>
    </div>
  )
} 