"use client"

import { Home, FileText, BarChart3, User } from "lucide-react"
import Link from "next/link"

interface BottomNavProps {
  activeTab: "feed" | "report" | "impact" | "profile"
}

export function BottomNav({ activeTab }: BottomNavProps) {
  const navItems = [
    { id: "feed", label: "Feed", icon: Home, href: "/" },
    { id: "report", label: "Report", icon: FileText, href: "/report" },
    { id: "impact", label: "Impact", icon: BarChart3, href: "/impact" },
    { id: "profile", label: "Profile", icon: User, href: "/profile" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1A1A1A]/95 backdrop-blur-xl border-t border-gray-800/50 md:hidden">
      <div className="flex items-center justify-around py-3 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center py-3 px-4 rounded-2xl transition-all duration-300 ease-out ${
                isActive
                  ? "text-green-500 bg-green-500/10 scale-105 shadow-lg shadow-green-500/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5 active:scale-95"
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 transition-transform duration-200 ${isActive ? "scale-110" : ""}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
