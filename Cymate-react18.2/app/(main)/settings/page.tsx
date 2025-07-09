"use client"

// Available Deep Links:
// - /settings?tab=account&subtab=security (Account Management > Security Management)
// - /settings?tab=account&subtab=billing (Account Management > Billing Management) 
// - /settings?tab=profile-setup (Profile Setup)
// - /settings?tab=profile-content (Profile Content)

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs as SubTabs, TabsContent as SubTabsContent, TabsList as SubTabsList, TabsTrigger as SubTabsTrigger } from "@/components/ui/tabs"
import SecurityManagement from "./management/SecurityManagement"
import TokenPricingTiers from "./management/TokenPricingTiers"
import ProfileContent from "./profile-content/ProfileContent"
import { Settings, User, Shield, CreditCard, FileText, Briefcase } from "lucide-react"
import dynamic from 'next/dynamic'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from "framer-motion"  

// Dynamically import ProfileSetup to avoid SSR issues with the neumorphism styles
const ProfileSetup = dynamic(() => import('./profile-setup/page'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px] bg-gray-100 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400"></div>
    </div>
  )
})

export default function SettingsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Get tab and subtab from URL parameters
  const urlTab = searchParams.get('tab') || 'account'
  const urlSubTab = searchParams.get('subtab') || 'security'
  
  // State for active tabs
  const [activeTab, setActiveTab] = useState(urlTab)
  const [activeSubTab, setActiveSubTab] = useState(urlSubTab)

  // Update state when URL parameters change
  useEffect(() => {
    const tab = searchParams.get('tab') || 'account'
    const subtab = searchParams.get('subtab') || 'security'
    setActiveTab(tab)
    setActiveSubTab(subtab)
  }, [searchParams])

  // Function to update URL when tabs change
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab)
    const params = new URLSearchParams()
    params.set('tab', newTab)
    
    // Set default subtab for account management
    if (newTab === 'account') {
      params.set('subtab', activeSubTab)
    }
    
    router.push(`/settings?${params.toString()}`, { scroll: false })
  }

  // Function to update URL when sub-tabs change
  const handleSubTabChange = (newSubTab: string) => {
    setActiveSubTab(newSubTab)
    const params = new URLSearchParams()
    params.set('tab', 'account')
    params.set('subtab', newSubTab)
    router.push(`/settings?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="container mx-auto p-4 max-w-[100rem] bg-gray-100 dark:bg-gray-900 min-h-screen">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-800 dark:text-white flex items-center justify-center gap-3">
          <Settings className="w-8 h-8" />
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-300">Manage your account, profile, and preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600" style={{ boxShadow: 'none' }}>
          <TabsTrigger value="account" className="flex items-center gap-2 dark:text-gray-300 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white">
            <Shield className="w-4 h-4" />
            Account Management
          </TabsTrigger>
          <TabsTrigger value="profile-setup" className="flex items-center gap-2 dark:text-gray-300 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white">
            <User className="w-4 h-4" />
            Profile Setup
          </TabsTrigger>
          <TabsTrigger value="profile-content" className="flex items-center gap-2 dark:text-gray-300 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white">
            <FileText className="w-4 h-4" />
            Profile Content
          </TabsTrigger>
        </TabsList>

        {/* Account Management Tab */}
        <TabsContent value="account">
          <Card className="bg-white  border-gray-300  dark:bg-slate-800 dark:border-slate-700" style={{ boxShadow: 'none' }}>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 dark:text-white">
                <Shield className="w-5 h-5" />
                Account Management
              </CardTitle>
              <CardDescription className="dark:text-gray-300">Manage your security settings, billing, and account preferences</CardDescription>
            </CardHeader>
                         <CardContent>
               <SubTabs value={activeSubTab} onValueChange={handleSubTabChange} className="w-full">
                 <SubTabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-slate-700" style={{ boxShadow: 'none' }}>
                   <SubTabsTrigger value="security" className="flex items-center gap-2 dark:text-gray-300 dark:data-[state=active]:bg-slate-600 dark:data-[state=active]:text-white">
                     <Shield className="w-4 h-4" />
                     Security Management
                   </SubTabsTrigger>
                   <SubTabsTrigger value="billing" className="flex items-center gap-2 dark:text-gray-300 dark:data-[state=active]:bg-slate-600 dark:data-[state=active]:text-white">
                     <CreditCard className="w-4 h-4" />
                     Billing Management
                   </SubTabsTrigger>
                 </SubTabsList>
                
                <SubTabsContent value="security">
                  <Card className="bg-gray-50 dark:bg-slate-800 border-gray-400 dark:border-slate-600" style={{ boxShadow: 'none' }}>
                    <CardHeader className="text-center">
                      <CardTitle className="dark:text-white">Security Management</CardTitle>
                      <CardDescription className="dark:text-gray-300">Manage your account security settings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SecurityManagement />
                    </CardContent>
                  </Card>
                </SubTabsContent>
                
                <SubTabsContent value="billing">
                  <Card className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-gray-600" style={{ boxShadow: 'none' }}>
                    <CardHeader className="text-center">
                      <CardTitle className="dark:text-white">Billing & Subscriptions</CardTitle>
                      <CardDescription className="dark:text-gray-300">Manage your token packages and upgrade your security toolkit access</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TokenPricingTiers />
                    </CardContent>
                  </Card>
                </SubTabsContent>
              </SubTabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Setup Tab */}
        <TabsContent value="profile-setup">
          <ProfileSetup />
        </TabsContent>

        {/* Profile Content Tab */}
        <TabsContent value="profile-content">
          <ProfileContent />
        </TabsContent>
      </Tabs>
      </motion.div>

    </div>
  )
} 