"use client"

import { useEffect } from "react"

export const useFeatureSync = (features: string[]) => {
  useEffect(() => {
    // Save disabled features to localStorage
    localStorage.setItem("disabledFeatures", JSON.stringify(features))
  }, [features])
}

export const isFeatureEnabled = (featureId: string): boolean => {
  if (typeof window === "undefined") return true // Default to enabled on server-side

  try {
    const savedFeatures = localStorage.getItem("disabledFeatures")
    if (!savedFeatures) return true // Default to enabled if no settings found

    const disabledFeatures = JSON.parse(savedFeatures)
    return !disabledFeatures.includes(featureId) // Feature is enabled if NOT in the disabled list
  } catch (error) {
    console.error("Error checking feature status:", error)
    return true // Default to enabled on error
  }
}
