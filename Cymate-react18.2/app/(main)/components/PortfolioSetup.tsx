"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Github, Linkedin, BellIcon as BrandTelegram, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/lib/hooks/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PortfolioSetupProps {
  onClose: () => void
}

export default function PortfolioSetup({ onClose }: PortfolioSetupProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    jobTitle: "",
    yearsExperience: "",
    budgetPerHour: "",
    phoneNumber: "",
    email: "",
    username: "",
    currentWork: "",
    education: "",
    brief: "",
    jobStatus: "",
    experienceLevel: "",
    country: "Egypt",
    city: "",
    tags: [] as string[],
    projects: [] as any[],
    skills: [] as string[],
    links: {
      github: "",
      linkedin: "",
      telegram: "",
      medium: "",
    },
    services: [] as string[],
    whyHireMe: "",
  })

  const [profileImage, setProfileImage] = useState<File | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      links: { ...prev.links, [name]: value },
    }))
  }

  const handlePublish = () => {
    console.log(formData)
    toast({
      title: "Profile Published!",
      description: "Your portfolio has been successfully published.",
    })
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Setup</CardTitle>
          <CardDescription>Create and manage your professional portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="personal">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
              <TabsTrigger value="links">Links</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>
            <TabsContent value="personal">
              <div className="space-y-4 mt-4">
                <div className="flex justify-center">
                  <div className="relative w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
                    />
                    {profileImage ? (
                      <img
                        src={URL.createObjectURL(profileImage)}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <Upload className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" name="username" value={formData.username} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" name="country" value={formData.country} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleInputChange} />
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="professional">
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input id="jobTitle" name="jobTitle" value={formData.jobTitle} onChange={handleInputChange} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="yearsExperience">Years of Experience</Label>
                    <Input
                      id="yearsExperience"
                      name="yearsExperience"
                      type="number"
                      value={formData.yearsExperience}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="budgetPerHour">Budget per Hour</Label>
                    <Input
                      id="budgetPerHour"
                      name="budgetPerHour"
                      type="number"
                      value={formData.budgetPerHour}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="currentWork">Current Work</Label>
                  <Input
                    id="currentWork"
                    name="currentWork"
                    value={formData.currentWork}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="education">Education</Label>
                  <Input id="education" name="education" value={formData.education} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="jobStatus">Job Status</Label>
                  <Select
                    name="jobStatus"
                    value={formData.jobStatus}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, jobStatus: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select job status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ready">Ready to get a job</SelectItem>
                      <SelectItem value="looking">Looking for opportunities</SelectItem>
                      <SelectItem value="employed">Currently employed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="experienceLevel">Experience Level</Label>
                  <Select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, experienceLevel: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expert">Expert</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="beginner">Beginner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="brief">Brief</Label>
                  <Textarea
                    id="brief"
                    name="brief"
                    value={formData.brief}
                    onChange={handleInputChange}
                    className="h-24"
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="links">
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="github">GitHub</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      <Github className="h-5 w-5" />
                    </span>
                    <Input
                      id="github"
                      name="github"
                      value={formData.links.github}
                      onChange={handleLinkChange}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      <Linkedin className="h-5 w-5" />
                    </span>
                    <Input
                      id="linkedin"
                      name="linkedin"
                      value={formData.links.linkedin}
                      onChange={handleLinkChange}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="telegram">Telegram</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      <BrandTelegram className="h-5 w-5" />
                    </span>
                    <Input
                      id="telegram"
                      name="telegram"
                      value={formData.links.telegram}
                      onChange={handleLinkChange}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="medium">Medium</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      <FileText className="h-5 w-5" />
                    </span>
                    <Input
                      id="medium"
                      name="medium"
                      value={formData.links.medium}
                      onChange={handleLinkChange}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="projects">
              <div className="space-y-4 mt-4">
                <p>Project management functionality to be implemented here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handlePublish}>Publish Portfolio</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
