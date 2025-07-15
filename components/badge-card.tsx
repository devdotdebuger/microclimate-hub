interface Badge {
  id: number
  name: string
  icon: string
  unlocked: boolean
  description: string
}

interface BadgeCardProps {
  badge: Badge
}

export function BadgeCard({ badge }: BadgeCardProps) {
  return (
    <div
      className={`group cursor-pointer transition-all duration-300 ease-out ${
        badge.unlocked
          ? "threads-card hover:scale-105 hover:shadow-green-500/10"
          : "bg-[#151515] border border-gray-800/30 opacity-60 hover:opacity-80"
      }`}
    >
      <div className="card-padding text-center">
        <div
          className={`text-4xl mb-3 transition-transform duration-300 ${badge.unlocked ? "group-hover:scale-110" : ""}`}
        >
          {badge.icon}
        </div>
        <h3 className="threads-subtitle text-sm mb-2">{badge.name}</h3>
        <p className="threads-body text-xs leading-relaxed">{badge.description}</p>
        {badge.unlocked && (
          <div className="mt-3 flex justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
    </div>
  )
}
