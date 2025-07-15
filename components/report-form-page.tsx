"use client"

import type React from "react"

import { useState } from "react"
import { Camera, Mic, MapPin, Thermometer, Upload, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { BottomNav } from "@/components/bottom-nav"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { apiClient } from "@/lib/api"

export function ReportFormPage() {
  const [temperature, setTemperature] = useState([35])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [location, setLocation] = useState("Current Location")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [images, setImages] = useState<File[]>([])
  const [voiceNote, setVoiceNote] = useState<File | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      await apiClient.createReport({
        temperature: temperature[0],
        location,
        description,
        tags,
        images,
        voiceNote,
      })
      setIsSubmitted(true)
    } catch (err: any) {
      setError(err?.message || "Failed to submit report.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 bg-[#1A1A1A] border-gray-800">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-poppins font-semibold mb-2">Report Submitted!</h2>
            <p className="text-gray-400 mb-6">
              Your heat report has been successfully submitted and will help improve our community climate data.
            </p>
            <Link href="/">
              <Button className="w-full bg-green-600 hover:bg-green-700">Back to Feed</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white fade-in">
      <Navbar />

      <div className="pt-20 page-container section-spacing">
        <Card className="max-w-2xl mx-auto threads-card slide-up">
          <CardHeader className="card-padding card-header-spacing">
            <CardTitle className="threads-title text-2xl">Submit Heat Report</CardTitle>
            <p className="threads-body">Help us track microclimate conditions in your area</p>
          </CardHeader>
          <CardContent className="card-padding">
            <form onSubmit={handleSubmit} className="section-spacing">
              {/* Temperature Input */}
              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center">
                  <Thermometer className="w-4 h-4 mr-2 text-red-500" />
                  Temperature: {temperature[0]}°C
                </label>
                <Slider
                  value={temperature}
                  onValueChange={setTemperature}
                  max={50}
                  min={15}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>15°C</span>
                  <span>50°C</span>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                  Location
                </label>
                <div className="flex space-x-2">
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="flex-1 bg-[#2A2A2A] border-gray-700 text-white threads-input"
                    placeholder="Enter location or use current"
                  />
                  <Button type="button" variant="outline" className="border-gray-700 bg-transparent">
                    <MapPin className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Describe the heat conditions, surroundings, and any observations..."
                  className="bg-[#2A2A2A] border-gray-700 text-white min-h-[100px] threads-input"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center">
                  <Camera className="w-4 h-4 mr-2 text-green-500" />
                  Photo Evidence (Optional)
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={e => {
                    if (e.target.files) {
                      setImages(Array.from(e.target.files))
                    }
                  }}
                  className="bg-[#2A2A2A] border-gray-700 text-white threads-input"
                />
                {images.length > 0 && (
                  <div className="text-xs text-gray-400">
                    {images.map((file, idx) => <div key={idx}>{file.name}</div>)}
                  </div>
                )}
              </div>

              {/* Voice Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center">
                  <Mic className="w-4 h-4 mr-2 text-purple-500" />
                  Voice Note (Optional)
                </label>
                <Input
                  type="file"
                  accept="audio/*"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setVoiceNote(e.target.files[0])
                    }
                  }}
                  className="bg-[#2A2A2A] border-gray-700 text-white threads-input"
                />
                {voiceNote && (
                  <div className="text-xs text-gray-400">{voiceNote.name}</div>
                )}
              </div>

              {/* Submit Button */}
              {error && <div className="text-red-500 mb-2">{error}</div>}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting Report...
                  </div>
                ) : (
                  "Submit Heat Report"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <BottomNav activeTab="report" />
    </div>
  )
}
