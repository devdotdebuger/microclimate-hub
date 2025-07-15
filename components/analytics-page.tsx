"use client"

import { TrendingUp, BarChart3, PieChart, Activity, Users, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { BottomNav } from "@/components/bottom-nav"

const analyticsData = [
  { title: "Total Reports", value: "2,847", change: "+12%", icon: Activity, color: "text-blue-500" },
  { title: "Active Users", value: "1,234", change: "+8%", icon: Users, color: "text-green-500" },
  { title: "Heat Zones", value: "156", change: "+3%", icon: MapPin, color: "text-red-500" },
  { title: "Avg Temperature", value: "38.2°C", change: "-2%", icon: TrendingUp, color: "text-orange-500" },
]

export function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white fade-in">
      <Navbar />

      <div className="pt-20 page-container section-spacing">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="threads-title text-3xl mb-2">Analytics Dashboard</h1>
          <p className="threads-body">Real-time insights into climate data and community engagement</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {analyticsData.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title} className="threads-card bounce-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="card-padding">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="threads-body text-sm">{stat.title}</p>
                      <p className="threads-title text-2xl mt-1">{stat.value}</p>
                      <Badge
                        variant="secondary"
                        className={`mt-2 ${
                          stat.change.startsWith("+") ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400"
                        }`}
                      >
                        {stat.change}
                      </Badge>
                    </div>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="threads-card slide-up">
            <CardHeader>
              <CardTitle className="threads-title flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
                Temperature Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-[#2A2A2A] rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                  <p>Temperature trend chart</p>
                  <p className="text-sm mt-1">Chart.js integration</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="threads-card slide-up">
            <CardHeader>
              <CardTitle className="threads-title flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-green-500" />
                Report Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-[#2A2A2A] rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <PieChart className="w-12 h-12 mx-auto mb-2" />
                  <p>Report severity distribution</p>
                  <p className="text-sm mt-1">Interactive pie chart</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNav activeTab="feed" />
    </div>
  )
}
