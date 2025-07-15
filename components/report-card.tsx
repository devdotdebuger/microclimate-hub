import { MapPin, Clock, Thermometer } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Report } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

interface ReportCardProps {
  report: Report
}

export function ReportCard({ report }: ReportCardProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
      case "extreme":
        return "bg-red-600/20 text-red-400"
      case "medium":
        return "bg-yellow-600/20 text-yellow-400"
      default:
        return "bg-green-600/20 text-green-400"
    }
  }

  const formatTimestamp = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true })
  }

  return (
    <Card className="threads-card group cursor-pointer">
      <CardContent className="card-padding">
        <div className="flex gap-4">
          <div className="relative overflow-hidden rounded-xl">
            <img
              src={report.images[0] || "/placeholder.svg"}
              alt="Heat report"
              className="w-24 h-24 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {report.status === "verified" && (
              <div className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Thermometer className="w-5 h-5 text-red-500" />
                  <span className="threads-title text-xl">{report.temperature}°C</span>
                  <Badge className={`${getSeverityColor(report.severity)} font-medium`}>
                    {report.severity}
                  </Badge>
                  {report.status !== "verified" && (
                    <Badge variant="outline" className="text-xs">
                      {report.status}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 threads-subtitle text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{report.location.address}</span>
                </div>
              </div>
            </div>

            <p className="threads-body text-sm leading-relaxed">{report.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <Clock className="w-4 h-4" />
                <span>{formatTimestamp(report.createdAt)}</span>
              </div>
              
              {/* Tags */}
              {report.tags.length > 0 && (
                <div className="flex gap-1">
                  {report.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {report.tags.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{report.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
