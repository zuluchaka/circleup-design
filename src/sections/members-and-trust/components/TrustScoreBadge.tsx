import type { ScoreTrend } from '@/../product/sections/members-and-trust/types'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface TrustScoreBadgeProps {
  score: number
  trend?: ScoreTrend
  size?: 'sm' | 'md' | 'lg'
  showTrend?: boolean
}

function getScoreColor(score: number): string {
  if (score >= 800) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800'
  if (score >= 600) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800'
  if (score >= 400) return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/50 border-orange-200 dark:border-orange-800'
  return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800'
}

function getTrendIcon(trend: ScoreTrend) {
  switch (trend) {
    case 'up':
      return <TrendingUp className="w-3 h-3 text-emerald-500" />
    case 'down':
      return <TrendingDown className="w-3 h-3 text-red-500" />
    default:
      return <Minus className="w-3 h-3 text-slate-400" />
  }
}

export function TrustScoreBadge({ score, trend, size = 'md', showTrend = true }: TrustScoreBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5 gap-1',
    md: 'text-sm px-2 py-1 gap-1.5',
    lg: 'text-base px-3 py-1.5 gap-2 font-semibold'
  }

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${getScoreColor(score)} ${sizeClasses[size]}`}>
      <span>{score}</span>
      {showTrend && trend && getTrendIcon(trend)}
    </span>
  )
}
