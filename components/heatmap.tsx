"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"
import { Search, MapPin, Navigation, Thermometer, Loader2, Globe, Layers, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useDebounce } from "@/hooks/use-debounce"
import type { Report } from "@/lib/types"

interface Location {
  latitude: number
  longitude: number
  address?: string
  city?: string
  country?: string
}

interface HeatmapProps {
  reports: Report[]
  onLocationSelect?: (location: Location) => void
  className?: string
}

// Enhanced heat gradient colors with better visual appeal
const getHeatColor = (temperature: number): string => {
  if (temperature >= 40) return "#FF1744" // Bright red - Extreme heat
  if (temperature >= 35) return "#FF5722" // Deep orange - High heat
  if (temperature >= 30) return "#FF9800" // Orange - Moderate heat
  if (temperature >= 25) return "#4CAF50" // Green - Warm
  return "#2196F3" // Blue - Cool
}

const getHeatIntensity = (temperature: number): number => {
  if (temperature >= 40) return 0.95 // Very intense
  if (temperature >= 35) return 0.8 // High intensity
  if (temperature >= 30) return 0.6 // Medium intensity
  if (temperature >= 25) return 0.4 // Low intensity
  return 0.2 // Very low intensity
}

const getHeatSize = (temperature: number): number => {
  if (temperature >= 40) return 24 // Large for extreme heat
  if (temperature >= 35) return 20 // Medium-large for high heat
  if (temperature >= 30) return 16 // Medium for moderate heat
  if (temperature >= 25) return 12 // Small-medium for warm
  return 8 // Small for cool
}

export function Heatmap({ reports, onLocationSelect, className = "" }: HeatmapProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [isLoadingSearch, setIsLoadingSearch] = useState(false)
  const [mapCenter, setMapCenter] = useState<Location>({
    latitude: 40.7128,
    longitude: -74.0060,
    address: "New York",
    city: "New York",
    country: "USA"
  })
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)

  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  // Get current location
  const getCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser")
      return
    }

    setIsLoadingLocation(true)
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        })
      })

      const { latitude, longitude } = position.coords
      
      // Reverse geocoding to get address
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
        )
        const data = await response.json()
        
        const location: Location = {
          latitude,
          longitude,
          address: data.display_name?.split(',')[0] || 'Current Location',
          city: data.address?.city || data.address?.town || 'Unknown City',
          country: data.address?.country || 'Unknown Country'
        }
        
        setCurrentLocation(location)
        setMapCenter(location)
        onLocationSelect?.(location)
      } catch (error) {
        // Fallback to coordinates only
        const location: Location = {
          latitude,
          longitude,
          address: 'Current Location',
          city: 'Unknown City',
          country: 'Unknown Country'
        }
        setCurrentLocation(location)
        setMapCenter(location)
        onLocationSelect?.(location)
      }
    } catch (error) {
      console.error("Error getting current location:", error?.message || error)
    } finally {
      setIsLoadingLocation(false)
    }
  }, [onLocationSelect])

  // Search for location
  const searchLocation = useCallback(async (query: string) => {
    if (typeof query !== "string" || !query.trim()) return

    setIsLoadingSearch(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
      )
      const data = await response.json()

      if (data.length > 0) {
        const result = data[0]
        const location: Location = {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          address: result.display_name?.split(',')[0] || query,
          city: result.address?.city || result.address?.town || 'Unknown City',
          country: result.address?.country || 'Unknown Country'
        }
        
        setMapCenter(location)
        onLocationSelect?.(location)
      }
    } catch (error) {
      console.error("Error searching location:", error)
    } finally {
      setIsLoadingSearch(false)
    }
  }, [onLocationSelect])

  // Search effect
  useEffect(() => {
    if (debouncedSearchQuery) {
      searchLocation(debouncedSearchQuery)
    }
  }, [debouncedSearchQuery, searchLocation])

  // Get current location on mount
  useEffect(() => {
    getCurrentLocation()
  }, [getCurrentLocation])

  // Generate heatmap data from reports
  const heatmapData = useMemo(() => {
    return reports.map(report => ({
      lat: report.location.latitude,
      lng: report.location.longitude,
      temperature: report.temperature,
      color: getHeatColor(report.temperature),
      intensity: getHeatIntensity(report.temperature),
      size: getHeatSize(report.temperature),
      report
    }))
  }, [reports])

  // Calculate average temperature for the current area
  const averageTemperature = useMemo(() => {
    if (heatmapData.length === 0) return null
    
    const total = heatmapData.reduce((sum, point) => sum + point.temperature, 0)
    return Math.round(total / heatmapData.length)
  }, [heatmapData])

  // Get temperature severity
  const getTemperatureSeverity = (temp: number) => {
    if (temp >= 40) return { label: "Extreme", color: "bg-red-500", textColor: "text-red-500" }
    if (temp >= 35) return { label: "High", color: "bg-orange-500", textColor: "text-orange-500" }
    if (temp >= 30) return { label: "Moderate", color: "bg-yellow-500", textColor: "text-yellow-500" }
    if (temp >= 25) return { label: "Warm", color: "bg-green-500", textColor: "text-green-500" }
    return { label: "Cool", color: "bg-blue-500", textColor: "text-blue-500" }
  }

  return (
    <Card className={`w-full overflow-hidden ${className}`}>
      <CardHeader className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700">
        <CardTitle className="flex items-center gap-3 text-white">
          <div className="p-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg">
            <Thermometer className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-lg font-semibold">Heat Map</div>
            <div className="text-sm text-slate-300 font-normal">Real-time temperature visualization</div>
          </div>
          {averageTemperature && (
            <Badge variant="secondary" className="ml-auto bg-white/10 text-white border-white/20">
              <Thermometer className="w-3 h-3 mr-1" />
              Avg: {averageTemperature}°C
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        {/* Search and Location Controls */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search for any location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 h-12 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            {isLoadingSearch && (
              <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 animate-spin" />
            )}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={getCurrentLocation}
            disabled={isLoadingLocation}
            className="h-12 w-12 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-600 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
          >
            {isLoadingLocation ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Current Location Display */}
        {currentLocation && (
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
            <div className="p-2 bg-blue-500 rounded-lg">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-900 dark:text-white">
                {currentLocation.address}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300">
                {currentLocation.city}, {currentLocation.country}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Map Container */}
        <div className="relative w-full h-80 bg-gradient-to-br from-blue-100 via-green-100 to-yellow-100 dark:from-blue-900/30 dark:via-green-900/30 dark:to-yellow-900/30 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-600 shadow-xl">
          {/* Map Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                               radial-gradient(circle at 75% 75%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)`,
            }} />
          </div>

          {/* Heatmap Visualization */}
          <div className="absolute inset-0">
            {heatmapData.map((point, index) => (
              <div
                key={index}
                className="absolute rounded-full cursor-pointer transition-all duration-300 hover:scale-125 hover:z-10"
                style={{
                  left: `${((point.lng - (mapCenter.longitude - 0.1)) / 0.2) * 100}%`,
                  top: `${((point.lat - (mapCenter.latitude - 0.1)) / 0.2) * 100}%`,
                  width: `${point.size}px`,
                  height: `${point.size}px`,
                  backgroundColor: point.color,
                  opacity: hoveredPoint === index ? 1 : point.intensity,
                  boxShadow: hoveredPoint === index 
                    ? `0 0 20px ${point.color}, 0 0 40px ${point.color}40`
                    : `0 0 10px ${point.color}60`,
                  transform: 'translate(-50%, -50%)',
                  animation: `pulse-${index % 3} 2s ease-in-out infinite`
                }}
                title={`${point.temperature}°C - ${point.report.description}`}
                onClick={() => onLocationSelect?.(point.report.location)}
                onMouseEnter={() => setHoveredPoint(index)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            ))}
          </div>

          {/* Map Center Indicator */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 bg-blue-600 rounded-full border-3 border-white shadow-lg animate-pulse" />
            <div className="w-8 h-8 bg-blue-600/20 rounded-full border border-blue-600/30 animate-ping" />
          </div>

          {/* Enhanced Heat Legend */}
          <div className="absolute bottom-4 right-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-slate-200 dark:border-slate-600">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              <div className="text-sm font-semibold text-slate-900 dark:text-white">Temperature Scale</div>
            </div>
            <div className="space-y-2">
              {[
                { temp: 40, label: "40°C+", color: "#FF1744", range: "Extreme" },
                { temp: 35, label: "35-39°C", color: "#FF5722", range: "High" },
                { temp: 30, label: "30-34°C", color: "#FF9800", range: "Moderate" },
                { temp: 25, label: "25-29°C", color: "#4CAF50", range: "Warm" },
                { temp: 20, label: "<25°C", color: "#2196F3", range: "Cool" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full shadow-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1">
                    <div className="text-xs font-medium text-slate-900 dark:text-white">{item.label}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{item.range}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Reports Count */}
          <div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-xl border border-slate-200 dark:border-slate-600">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg">
                <Globe className="w-3 h-3 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {reports.length} Reports
                </div>
                {averageTemperature && (
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    Avg: {averageTemperature}°C
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8 bg-white/90 dark:bg-slate-800/90 border-slate-200 dark:border-slate-600 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-all duration-200"
            >
              <Info className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Enhanced Temperature Summary */}
        {averageTemperature && (
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl border border-slate-200 dark:border-slate-600">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg">
                <Thermometer className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">Average Temperature</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Across all reported locations</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{averageTemperature}°C</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Current average</div>
              </div>
              <Badge className={`${getTemperatureSeverity(averageTemperature).color} text-white border-0`}>
                {getTemperatureSeverity(averageTemperature).label}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>

      <style jsx>{`
        @keyframes pulse-0 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
        }
        @keyframes pulse-1 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.05); }
        }
        @keyframes pulse-2 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.15); }
        }
      `}</style>
    </Card>
  )
} 