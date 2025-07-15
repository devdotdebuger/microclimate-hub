"use client"

import { useState } from "react"
import { TrendingUp, TreePine, Award, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { BottomNav } from "@/components/bottom-nav"
import { Navbar } from "@/components/navbar"

const leaderboardData = [
  { rank: 1, name: "Sarah Chen", points: 2840, avatar: "/placeholder.svg?height=40&width=40" },
  { rank: 2, name: "Mike Johnson", points: 2650, avatar: "/placeholder.svg?height=40&width=40" },
  { rank: 3, name: "Emma Davis", points: 2420, avatar: "/placeholder.svg?height=40&width=40" },
  { rank: 4, name: "Alex Kim", points: 2180, avatar: "/placeholder.svg?height=40&width=40" },
  { rank: 5, name: "Lisa Wang", points: 1950, avatar: "/placeholder.svg?height=40&width=40" },
]

export function ImpactDashboard() {
  const [treeCount, setTreeCount] = useState([100])
  const temperatureDrop = (treeCount[0] * 0.02).toFixed(1)

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white fade-in">
      <Navbar />

      <div className="pt-20 page-container section-spacing">
        {/* Impact Simulator */}
        <Card className="threads-card slide-up">
          <CardHeader>
            <CardTitle className="font-poppins text-xl flex items-center">
              <Target className="w-6 h-6 mr-2 text-green-500" />
              Impact Simulator
            </CardTitle>
            <p className="text-gray-400">See how tree planting affects local temperature</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center">
                <TreePine className="w-4 h-4 mr-2 text-green-500" />
                Number of Trees: {treeCount[0]}
              </label>
              <Slider value={treeCount} onValueChange={setTreeCount} max={1000} min={10} step={10} className="w-full" />
            </div>

            <div className="bg-[#2A2A2A] rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">-{temperatureDrop}°C</div>
              <p className="text-gray-400">Estimated temperature reduction with {treeCount[0]} trees</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#2A2A2A] rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-500 mb-1">{(treeCount[0] * 22).toLocaleString()}</div>
                <p className="text-sm text-gray-400">kg CO₂ absorbed/year</p>
              </div>
              <div className="bg-[#2A2A2A] rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-500 mb-1">{(treeCount[0] * 0.5).toFixed(0)}</div>
                <p className="text-sm text-gray-400">m² shade coverage</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="threads-card bounce-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-500 mb-2">1,250</div>
                <p className="text-gray-400 flex items-center justify-center">
                  <TreePine className="w-4 h-4 mr-1" />
                  Trees Planted
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart Placeholder */}
        <Card className="threads-card slide-up">
          <CardHeader>
            <CardTitle className="font-poppins text-lg flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              Temperature Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-[#2A2A2A] rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-400">
                <TrendingUp className="w-12 h-12 mx-auto mb-2" />
                <p>Interactive chart showing temperature reduction over time</p>
                <p className="text-sm mt-1">Chart.js integration would go here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card className="threads-card slide-up">
          <CardHeader>
            <CardTitle className="font-poppins text-lg flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-500" />
              Top Contributors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboardData.map((user) => (
                <div key={user.rank} className="flex items-center justify-between p-3 bg-[#2A2A2A] rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-sm font-bold">
                      {user.rank}
                    </div>
                    <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-10 h-10 rounded-full" />
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-600/20 text-green-400">
                    {user.points} pts
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav activeTab="impact" />
    </div>
  )
}
