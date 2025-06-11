"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SavedContent from "./profile/SavedContent"
import Sharings from "./profile/Sharings"
import Notifications from "./profile/Notifications"
import Inbox from "./profile/Inbox"

export default function ProfileContent() {
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle>Profile Content</CardTitle>
          <CardDescription>Manage your saved content, sharings, notifications, and messages</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="saved">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="saved">Save for Later</TabsTrigger>
              <TabsTrigger value="sharings">Sharings</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="inbox">Inbox</TabsTrigger>
            </TabsList>
            <TabsContent value="saved">
              <SavedContent />
            </TabsContent>
            <TabsContent value="sharings">
              <Sharings />
            </TabsContent>
            <TabsContent value="notifications">
              <Notifications />
            </TabsContent>
            <TabsContent value="inbox">
              <Inbox />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
