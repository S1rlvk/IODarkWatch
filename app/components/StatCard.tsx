import { Card } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: number | string
  percentage?: string
  type: 'active' | 'dark' | 'alert' | 'sync'
  isLoading?: boolean
}

export function StatCard({ title, value, percentage, type, isLoading }: StatCardProps) {
  const getBadgeColor = () => {
    switch (type) {
      case 'active':
        return 'bg-emerald-500/20 text-emerald-300'
      case 'dark':
        return 'bg-red-500/20 text-red-400'
      case 'alert':
        return 'bg-cyan-500/20 text-cyan-300'
      case 'sync':
        return 'bg-blue-500/20 text-blue-300'
      default:
        return 'bg-gray-500/20 text-gray-300'
    }
  }

  if (isLoading) {
    return (
      <Card className="p-4 animate-pulse">
        <div className="h-4 bg-gray-700/50 rounded w-1/2 mb-2"></div>
        <div className="h-8 bg-gray-700/50 rounded w-3/4"></div>
      </Card>
    )
  }

  return (
    <Card className="p-4 hover:border-[#00FFFF]/30 transition-colors duration-200">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-white/80 font-medium">{title}</span>
        {percentage && (
          <span className={`px-2 py-1 rounded text-xs font-medium ${getBadgeColor()}`}>
            {percentage}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </Card>
  )
} 