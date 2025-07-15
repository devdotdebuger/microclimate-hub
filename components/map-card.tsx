"use client"

import { MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const heatZones = [
  { id: 1, lat: 40.7128, lng: -74.006, temperature: 42, severity: "high" },
  { id: 2, lat: 40.7589, lng: -73.9851, temperature: 38, severity: "medium" },
  { id: 3, lat: 40.6892, lng: -74.0445, temperature: 45, severity: "high" },
]

export function MapCard() {
  return (
    <Card className="threads-card">
      <CardHeader className="card-padding card-header-spacing">
        <CardTitle className="threads-title text-xl flex items-center gap-3">
          <MapPin className="w-6 h-6 text-blue-500" />
          Heat Zone Map
        </CardTitle>
      </CardHeader>
      <CardContent className="card-padding pt-0">
        {/* Map Placeholder */}
        <div className="aspect-video bg-gradient-to-br from-[#2A2A2A] to-[#1F1F1F] rounded-xl mb-6 relative overflow-hidden border border-gray-800/50">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-green-900/10">
            <div className="absolute top-4 left-4 threads-body text-sm">Interactive Map View</div>

            {/* Enhanced heat zone markers */}
            {heatZones.map((zone, index) => (
              <div
                key={zone.id}
                className={`absolute w-6 h-6 rounded-full ${
                  zone.severity === "high" ? "bg-red-500" : "bg-yellow-500"
                } animate-pulse shadow-lg`}
                style={{
                  top: `${Math.random() * 60 + 20}%`,
                  left: `${Math.random() * 60 + 20}%`,
                  animationDelay: `${index * 0.5}s`,
                }}
              />
            ))}

            <div className="absolute bottom-4 right-4 threads-body text-xs">Leaflet.js integration</div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-400">High Risk</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-400">Medium Risk</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-400">Low Risk</span>
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-600/20 text-blue-400">
            Live Data
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
