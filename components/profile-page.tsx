"use client"

import { Edit, LogOut, MapPin, Award, Coins, TreePine } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BadgeCard } from "@/components/badge-card"
import { BottomNav } from "@/components/bottom-nav"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/lib/auth"
import Link from "next/link"

const userBadges = [
  { id: 1, name: "First Report", icon: "🌡️", unlocked: true, description: "Submit your first heat report" },
  { id: 2, name: "Tree Planter", icon: "🌳", unlocked: true, description: "Plant 10 trees" },
  { id: 3, name: "Heat Detective", icon: "🔍", unlocked: true, description: "Submit 25 reports" },
  { id: 4, name: "Community Leader", icon: "👑", unlocked: false, description: "Reach top 10 leaderboard" },
  { id: 5, name: "Eco Warrior", icon: "⚡", unlocked: false, description: "Save 100kg CO₂" },
  { id: 6, name: "Climate Champion", icon: "🏆", unlocked: false, description: "Complete all challenges" },
]

const userReports = [
  { id: 1, location: "Downtown Plaza", temperature: 42, date: "2 days ago", status: "verified" },
  { id: 2, location: "Central Park", temperature: 38, date: "1 week ago", status: "pending" },
  { id: 3, location: "Industrial District", temperature: 45, date: "2 weeks ago", status: "verified" },
]

export function ProfilePage() {
  const { user, signOut } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Please sign in to view your profile</p>
          <Link href="/auth/login">
            <Button className="bg-green-600 hover:bg-green-700">Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white fade-in">
      <Navbar />

      <div className="pt-20 page-container section-spacing">
        {/* User Profile Card */}
        <Card className="threads-card slide-up">
          <CardContent className="card-padding">
            <div className="flex items-center space-x-4 mb-6">
              <img
                src="/placeholder.svg?height=80&width=80"
                alt="Profile"
                className="w-20 h-20 rounded-full border-2 border-green-500"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-poppins font-semibold">{user.name}</h2>
                <p className="text-gray-400">Climate Action Enthusiast</p>
                <Badge className="mt-2 bg-green-600/20 text-green-400">User</Badge>
              </div>
              <Button variant="outline" size="sm" className="border-gray-700 bg-transparent">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">2,840</div>
                <p className="text-sm text-gray-400 flex items-center justify-center">
                  <Coins className="w-4 h-4 mr-1" />
                  Eco-Coins
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">156</div>
                <p className="text-sm text-gray-400 flex items-center justify-center">
                  <TreePine className="w-4 h-4 mr-1" />
                  Trees Planted
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">42</div>
                <p className="text-sm text-gray-400 flex items-center justify-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  Reports
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badges Section */}
        <Card className="bg-[#1A1A1A] border-gray-800">
          <CardHeader>
            <CardTitle className="font-poppins text-lg flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-500" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {userBadges.map((badge, index) => (
                <div key={badge.id} className="bounce-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <BadgeCard badge={badge} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card className="bg-[#1A1A1A] border-gray-800">
          <CardHeader>
            <CardTitle className="font-poppins text-lg">My Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 bg-[#2A2A2A] rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold">{report.temperature}°</span>
                    </div>
                    <div>
                      <p className="font-medium">{report.location}</p>
                      <p className="text-sm text-gray-400">{report.date}</p>
                    </div>
                  </div>
                  <Badge
                    variant={report.status === "verified" ? "default" : "secondary"}
                    className={
                      report.status === "verified"
                        ? "bg-green-600/20 text-green-400"
                        : "bg-yellow-600/20 text-yellow-400"
                    }
                  >
                    {report.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button variant="outline" className="w-full border-gray-700 text-gray-300 justify-start bg-transparent">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
          <Button
            variant="outline"
            className="w-full border-red-700 text-red-400 hover:bg-red-600/10 justify-start bg-transparent"
            onClick={() => signOut()}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      <BottomNav activeTab="profile" />
    </div>
  )
}
