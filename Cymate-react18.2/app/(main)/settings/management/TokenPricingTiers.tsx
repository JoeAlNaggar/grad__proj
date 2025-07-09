"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Zap, Crown, Rocket, Star } from "lucide-react"
import { motion } from "framer-motion"
import { modifyToolkitTokens } from "@/app/services/api"
import { toast } from "sonner"

interface PricingTier {
  name: string
  price: string
  tokens: number
  description: string
  features: string[]
  icon: React.ElementType
  gradient: string
  buttonText: string
  stripeUrl?: string
  popular?: boolean
}

export default function TokenPricingTiers() {
  const [isProcessing, setIsProcessing] = useState<string | null>(null)

  const tiers: PricingTier[] = [
    {
      name: "Free",
      price: "$0",
      tokens: 50,
      description: "getting started with our security toolkit",
      features: [
        "50 Toolkit Tokens/Month",
        "Basic Network Scanning",
        "Malware Detection",
        "Threat Intelligence",
        "Web Vulnerability Scanning",
        "Community Support"
      ],
      icon: Zap,
      gradient: "from-gray-500 to-gray-600",
      buttonText: "Current Plan"
    },
    {
      name: "Premium",
      price: "$10",
      tokens: 200,
      description: "Ideal for professionals and small teams",
      features: [
        "200 Additional Tokens",
        "Priority Scanning Speed",
        "Advanced Reporting",
        "Email Report Delivery",
        "24/7 Support",
        "API Access",
        
      ],
      icon: Crown,
      gradient: "from-purple-500 to-purple-600",
      buttonText: "Upgrade Now",
      stripeUrl: "https://buy.stripe.com/test_aFaaEX7ep3Jxg370Xdg7e00",
      popular: true
    },
    {
      name: "Ultra",
      price: "$30",
      tokens: 1000,
      description: "For enterprises and security professionals",
      features: [
        "1000 Additional Tokens",
        "Lightning Fast Scanning",
        "White-label Reports",
        "Dedicated Account Manager",
        "Custom Integrations",
        "SLA Guarantee",
        
      ],
      icon: Rocket,
      gradient: "from-orange-500 to-red-500",
      buttonText: "Go Ultra",
      stripeUrl: "https://buy.stripe.com/test_fZufZh42d7ZN4kpbBRg7e01"
    }
  ]

  const handlePurchase = async (tier: PricingTier) => {
    if (!tier.stripeUrl) return

    setIsProcessing(tier.name)

    try {
      // Open Stripe payment page in new tab
      window.open(tier.stripeUrl, '_blank')

      // Add tokens to user's account
      const newTokenCount = await modifyToolkitTokens('add', tier.tokens)
      
      // Trigger navbar update with new token count
      window.dispatchEvent(new CustomEvent('tokensUpdated', { 
        detail: { tokens: newTokenCount } 
      }))

      toast.success(
        `🎉 ${tier.name} Plan Activated!`,
        {
          description: `${tier.tokens} tokens have been added to your account. Your new balance: ${newTokenCount} tokens`,
          duration: 5000,
        }
      )

    } catch (error) {
      console.error('Error processing purchase:', error)
      toast.error(
        "Payment Processing Error",
        {
          description: "There was an issue processing your payment. Please try again.",
          duration: 5000,
        }
      )
    } finally {
      setIsProcessing(null)
    }
  }

  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Choose Your <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Security Arsenal</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Unlock the full potential of our cybersecurity toolkit with flexible token packages. 
              Scale your security operations with confidence.
            </p>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative bg-white dark:bg-gray-800/50 rounded-2xl shadow-xl  border ${
                tier.popular 
                  ? 'border-purple-500 dark:border-purple-400 ring-2 ring-purple-200 dark:ring-purple-800' 
                  : 'border-gray-200 dark:border-gray-700'
              } hover:shadow-2xl transition-all duration-300`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Card Content */}
              <div className="p-8">
                {/* Icon & Title */}
                <div className="flex items-center justify-center mb-6">
                  <div className={`p-3 rounded-full bg-gradient-to-r ${tier.gradient}`}>
                    <tier.icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {tier.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                      {tier.price}
                    </span>
                    {tier.price !== "$0" && (
                      <span className="text-gray-500 dark:text-gray-400">
                        /one-time
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {tier.description}
                  </p>
                </div>

                {/* Token Count Highlight */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg p-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {tier.tokens.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {tier.name === "Free" ? "Tokens/Month" : "Additional Tokens"}
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <Check className="w-5 h-5 text-green-500" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => handlePurchase(tier)}
                  disabled={!tier.stripeUrl || isProcessing === tier.name}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                    tier.name === "Free"
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : `bg-gradient-to-r ${tier.gradient} text-white hover:shadow-lg hover:scale-105 disabled:hover:scale-100 disabled:opacity-50`
                  }`}
                >
                  {isProcessing === tier.name ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    tier.buttonText
                  )}
                </Button>

                {/* Value Proposition */}
                {tier.stripeUrl && (
                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      ${(parseFloat(tier.price.replace('$', '')) / tier.tokens * 1000).toFixed(2)} per 1K tokens
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Security Badges */}
        <div className="flex justify-center items-center gap-8 mt-12 opacity-60">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Check className="w-4 h-4 text-green-500" />
            Secure Payments via Stripe
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Check className="w-4 h-4 text-green-500" />
            No Hidden Fees
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Check className="w-4 h-4 text-green-500" />
            Instant Activation
          </div>
        </div>
      </div>
    </div>
  )
} 