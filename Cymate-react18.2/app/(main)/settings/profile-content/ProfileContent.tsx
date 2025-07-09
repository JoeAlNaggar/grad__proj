"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SavedContent from "./SavedContent"
import Sharings from "./Sharings"
import NotificationsList from '../../components/NotificationsList';
import { FileText, Bookmark, Share2, Bell } from "lucide-react"

export default function ProfileContent() {
  return (
    <div className="container mx-auto  max-w-[100rem] bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Card className="bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700" style={{ boxShadow: 'none' }}>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 dark:text-white">
            <FileText className="w-5 h-5" />
            Profile Content
          </CardTitle>
          <CardDescription className="dark:text-gray-300">Manage your saved content, sharings, notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="saved">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-slate-700" style={{ boxShadow: 'none' }}>
              <TabsTrigger value="saved" className="flex items-center gap-2 dark:text-gray-300 dark:data-[state=active]:bg-slate-600 dark:data-[state=active]:text-white">
                <Bookmark className="w-4 h-4" />
                Saved Posts
              </TabsTrigger>
              <TabsTrigger value="sharings" className="flex items-center gap-2 dark:text-gray-300 dark:data-[state=active]:bg-slate-600 dark:data-[state=active]:text-white">
                <Share2 className="w-4 h-4" />
                Your Posts
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2 dark:text-gray-300 dark:data-[state=active]:bg-slate-600 dark:data-[state=active]:text-white">
                <Bell className="w-4 h-4" />
                Notifications
              </TabsTrigger>
            </TabsList>
            <TabsContent value="saved">
              <SavedContent />
            </TabsContent>
            <TabsContent value="sharings">
              <Sharings />
            </TabsContent>
            <TabsContent value="notifications">
              <NotificationsList />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
