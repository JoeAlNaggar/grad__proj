"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SecurityManagement from "./SecurityManagement"
import TokenPricingTiers from "./TokenPricingTiers"
import { Shield, CreditCard } from "lucide-react"


export default function SettingsManagementPage() {
  return (
    <div className="container mx-auto p-4 max-w-[100rem] bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Settings Management</h1>
      <Tabs defaultValue="security" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600" style={{ boxShadow: 'none' }}>
          <TabsTrigger value="security" className="flex items-center gap-2 dark:text-gray-300 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white">
            <Shield className="w-4 h-4" />
            Security Management
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2 dark:text-gray-300 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white">
            <CreditCard className="w-4 h-4" />
            Billing Management
          </TabsTrigger>
        </TabsList>
        <TabsContent value="security">
          <Card className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600" style={{ boxShadow: 'none' }}>
            <CardHeader className="text-center">
              <CardTitle className="dark:text-white">Security Management</CardTitle>
              <CardDescription className="dark:text-gray-300">Manage your account security settings</CardDescription>
            </CardHeader>
            <CardContent>
              <SecurityManagement />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="billing">
          <Card className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600" style={{ boxShadow: 'none' }}>
            <CardHeader className="text-center">
              <CardTitle className="dark:text-white">Billing & Subscriptions</CardTitle>
              <CardDescription className="dark:text-gray-300">Manage your token packages and upgrade your security toolkit access</CardDescription>
            </CardHeader>
            <CardContent>
              <TokenPricingTiers />
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="verification">
          <Card>
            <CardHeader>
              <CardTitle>Account Verification</CardTitle>
              <CardDescription>Verify your account by providing your National ID card details</CardDescription>
            </CardHeader>
            <CardContent>
              <AccountVerification />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Setup</CardTitle>
              <CardDescription>Manage your payment methods and subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentSetup />
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  )
}
