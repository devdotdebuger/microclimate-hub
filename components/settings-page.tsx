"use client"

import { Settings, Bell, Shield, Palette, Globe, HelpCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Navbar } from "@/components/navbar"
import { BottomNav } from "@/components/bottom-nav"

const settingsGroups = [
  {
    title: "Notifications",
    icon: Bell,
    settings: [
      { label: "Push Notifications", description: "Receive alerts for new heat reports", enabled: true },
      { label: "Email Updates", description: "Weekly summary of climate data", enabled: false },
      { label: "Community Updates", description: "News about tree planting events", enabled: true },
    ],
  },
  {
    title: "Privacy & Security",
    icon: Shield,
    settings: [
      { label: "Location Sharing", description: "Share your location for better heat mapping", enabled: true },
      { label: "Anonymous Reports", description: "Submit reports without personal identification", enabled: false },
      { label: "Data Analytics", description: "Help improve our AI models with your data", enabled: true },
    ],
  },
  {
    title: "Appearance",
    icon: Palette,
    settings: [
      { label: "Dark Mode", description: "Use dark theme (currently enabled)", enabled: true },
      { label: "High Contrast", description: "Increase contrast for better visibility", enabled: false },
      { label: "Compact View", description: "Show more content in less space", enabled: false },
    ],
  },
]

export function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white fade-in">
      <Navbar />

      <div className="pt-20 page-container section-spacing">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="threads-title text-3xl mb-2 flex items-center">
            <Settings className="w-8 h-8 mr-3 text-green-500" />
            Settings
          </h1>
          <p className="threads-body">Customize your Microclimate Hub experience</p>
        </div>

        {/* Settings Groups */}
        <div className="space-y-6">
          {settingsGroups.map((group, groupIndex) => {
            const Icon = group.icon
            return (
              <Card
                key={group.title}
                className="threads-card slide-up"
                style={{ animationDelay: `${groupIndex * 0.1}s` }}
              >
                <CardHeader>
                  <CardTitle className="threads-title flex items-center">
                    <Icon className="w-5 h-5 mr-2 text-green-500" />
                    {group.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {group.settings.map((setting, settingIndex) => (
                    <div key={setting.label} className="flex items-center justify-between p-4 bg-[#2A2A2A] rounded-lg">
                      <div className="flex-1">
                        <h3 className="threads-subtitle text-sm">{setting.label}</h3>
                        <p className="threads-body text-xs mt-1">{setting.description}</p>
                      </div>
                      <Switch defaultChecked={setting.enabled} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Additional Options */}
        <Card className="threads-card slide-up">
          <CardHeader>
            <CardTitle className="threads-title flex items-center">
              <Globe className="w-5 h-5 mr-2 text-blue-500" />
              General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start border-gray-700 text-gray-300 bg-transparent">
              <HelpCircle className="w-4 h-4 mr-2" />
              Help & Support
            </Button>
            <Button variant="outline" className="w-full justify-start border-gray-700 text-gray-300 bg-transparent">
              About Microclimate Hub
            </Button>
            <Button variant="outline" className="w-full justify-start border-gray-700 text-gray-300 bg-transparent">
              Terms of Service
            </Button>
            <Button variant="outline" className="w-full justify-start border-gray-700 text-gray-300 bg-transparent">
              Privacy Policy
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNav activeTab="profile" />
    </div>
  )
}
