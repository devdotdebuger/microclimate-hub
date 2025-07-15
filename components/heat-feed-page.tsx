"use client"

import React, { useState, useCallback, useMemo, useEffect } from "react"
import { Filter, Search, MapPin, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ReportCard } from "@/components/report-card"
import { BottomNav } from "@/components/bottom-nav"
import { Navbar } from "@/components/navbar"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { VirtualList } from "@/components/ui/virtual-list"
import { Heatmap } from "@/components/heatmap"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { useDebounce } from "@/hooks/use-debounce"
import { useAppStore, useReports, useAppActions } from "@/lib/store"
import { apiClient } from "@/lib/api"
import { useQuery, useInfiniteQuery } from "@tanstack/react-query"
import type { Report, ReportFilters } from "@/lib/types"

// Mock data for development
const mockReports: Report[] = [
  {
    id: "1",
    userId: "user1",
    temperature: 42,
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      address: "Downtown Plaza",
      city: "New York",
      country: "USA"
    },
    description: "Extreme heat near concrete surfaces",
    images: ["/placeholder.svg?height=120&width=200"],
    severity: "high",
    status: "verified",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    tags: ["concrete", "urban", "heat-island"],
    weather: {
      temperature: 42,
      humidity: 65,
      windSpeed: 5,
      pressure: 1013,
      description: "Sunny",
      icon: "01d"
    }
  },
  {
    id: "2",
    userId: "user2",
    temperature: 38,
    location: {
      latitude: 40.7589,
      longitude: -73.9851,
      address: "Central Park",
      city: "New York",
      country: "USA"
    },
    description: "Elevated temperature in park area",
    images: ["/placeholder.svg?height=120&width=200"],
    severity: "medium",
    status: "verified",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    tags: ["park", "green-space"],
    weather: {
      temperature: 38,
      humidity: 70,
      windSpeed: 3,
      pressure: 1012,
      description: "Partly cloudy",
      icon: "02d"
    }
  },
  {
    id: "3",
    userId: "user3",
    temperature: 45,
    location: {
      latitude: 40.7505,
      longitude: -73.9934,
      address: "Industrial District",
      city: "New York",
      country: "USA"
    },
    description: "Heat island effect observed",
    images: ["/placeholder.svg?height=120&width=200"],
    severity: "high",
    status: "verified",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    tags: ["industrial", "heat-island"],
    weather: {
      temperature: 45,
      humidity: 55,
      windSpeed: 2,
      pressure: 1010,
      description: "Clear",
      icon: "01d"
    }
  },
]

export function HeatFeedPage() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  
  const { reports, setReports, addReport } = useAppStore()
  const { setLoading, clearLoading } = useAppActions()

  // Debounced search query
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Filters configuration
  const filters = useMemo((): ReportFilters => {
    const filterConfig: ReportFilters = {}
    
    if (activeFilter !== "all") {
      filterConfig.severity = activeFilter as any
    }
    
    if (selectedLocation) {
      // In a real app, you'd convert location to coordinates
      filterConfig.location = {
        lat: 40.7128,
        lng: -74.0060,
        radius: 5000 // 5km radius
      }
    }
    
    return filterConfig
  }, [activeFilter, selectedLocation])

  // Fetch reports with React Query
  const {
    data: reportsData,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['reports', filters, debouncedSearchQuery],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      setLoading('reports', { isLoading: true })
      try {
        // In production and development, use real API
        const response = await apiClient.getReports(filters, pageParam as number, 10)
        return response.data
      } finally {
        clearLoading('reports')
      }
    },
    getNextPageParam: (lastPage: any) => {
      const page = lastPage?.pagination?.page
      return lastPage?.pagination?.hasNext && page ? page + 1 : undefined
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  })

  // Flatten reports from all pages
  const allReports = useMemo(() => {
    if (!reportsData?.pages) return []
    return reportsData.pages.flatMap(page => page?.reports ?? [])
  }, [reportsData])

  // Intersection observer for infinite loading
  const { ref: loadMoreRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px'
  }) as { ref: React.RefObject<HTMLDivElement>; isIntersecting: boolean }

  // Load more when intersection observer triggers
  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage])

  // Handle filter change
  const handleFilterChange = useCallback((filter: string) => {
    setActiveFilter(filter)
  }, [])

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  // Handle location selection from heatmap
  const handleLocationSelect = useCallback((location: any) => {
    setSelectedLocation(location.address || location.city || "")
  }, [])

  // Render report item for virtual list
  const renderReportItem = useCallback((report: Report, index: number) => (
    <div className="mb-4" style={{ animationDelay: `${index * 0.1}s` }}>
      <ReportCard report={report} />
    </div>
  ), [])

  // Loading state
  if (isLoading && allReports.length === 0) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white">
        <Navbar />
        <div className="pt-20 page-container flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading reports..." />
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white">
        <Navbar />
        <div className="pt-20 page-container flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400 mb-4">Failed to load reports</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white fade-in">
      <Navbar />

      <div className="pt-20 page-container space-y-6">
        {/* Heatmap Section */}
        <div className="section-spacing">
          <Heatmap 
            reports={allReports} 
            onLocationSelect={handleLocationSelect}
            className="bg-[#1A1A1A] border-gray-800"
          />
        </div>

        {/* Reports Section */}
        <div className="section-spacing">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 bg-[#2A2A2A] border-gray-700 text-white placeholder-gray-400 threads-input"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <Button
                variant={activeFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("all")}
                className={activeFilter === "all" ? "bg-green-600 hover:bg-green-700" : "border-gray-700 text-gray-300"}
              >
                All Reports
              </Button>
              <Button
                variant={activeFilter === "high" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("high")}
                className={activeFilter === "high" ? "bg-red-600 hover:bg-red-700" : "border-gray-700 text-gray-300"}
              >
                High Severity
              </Button>
              <Button
                variant={activeFilter === "medium" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("medium")}
                className={activeFilter === "medium" ? "bg-yellow-600 hover:bg-yellow-700" : "border-gray-700 text-gray-300"}
              >
                Medium Severity
              </Button>
              <Button
                variant={activeFilter === "recent" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("recent")}
                className={
                  activeFilter === "recent" ? "bg-blue-600 hover:bg-blue-700" : "border-gray-700 text-gray-300"
                }
              >
                Recent
              </Button>
              <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 bg-transparent">
                <Filter className="w-4 h-4 mr-2" />
                More
              </Button>
            </div>

            {/* Location Filter */}
            {selectedLocation && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">
                  Filtering by: {selectedLocation}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedLocation("")}
                  className="text-xs text-gray-500 hover:text-gray-300"
                >
                  Clear
                </Button>
              </div>
            )}

            {/* Reports Count */}
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>{allReports.length} reports found</span>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>Live updates</span>
              </div>
            </div>

            {/* Reports List */}
            <div className="section-spacing">
              {allReports.length > 0 ? (
                <VirtualList
                  items={allReports}
                  height={600}
                  itemHeight={200}
                  renderItem={renderReportItem}
                  onEndReached={() => fetchNextPage()}
                  loading={isFetchingNextPage}
                  LoadingComponent={() => (
                    <div className="flex justify-center py-4">
                      <LoadingSpinner size="sm" text="Loading more..." />
                    </div>
                  )}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No reports found</p>
                  <p className="text-sm text-gray-500 mt-2">Try adjusting your filters</p>
                </div>
              )}
            </div>

            {/* Load More Trigger */}
            {hasNextPage && (
              <div ref={loadMoreRef} className="h-4" />
            )}
          </div>
        </div>
      </div>

      <BottomNav activeTab="feed" />
    </div>
  )
}
