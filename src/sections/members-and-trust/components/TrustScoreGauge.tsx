import type { TrustScore, TrustScoreFactors, ScoreImprovementTip } from '@/../product/sections/members-and-trust/types'
import { TrendingUp, TrendingDown, Minus, Info, Sparkles } from 'lucide-react'

interface TrustScoreGaugeProps {
  trustScore: TrustScore
  improvementTips?: ScoreImprovementTip[]
  isOwnScore?: boolean
  size?: 'sm' | 'md' | 'lg'
}

function getScoreColor(score: number): string {
  if (score >= 800) return '#10b981' // emerald-500
  if (score >= 600) return '#f59e0b' // amber-500
  if (score >= 400) return '#f97316' // orange-500
  return '#ef4444' // red-500
}

function getScoreLabel(score: number): string {
  if (score >= 800) return 'Excellent'
  if (score >= 600) return 'Good'
  if (score >= 400) return 'Fair'
  return 'Needs Improvement'
}

function getTrendIcon(trend: string) {
  switch (trend) {
    case 'up':
      return <TrendingUp className="w-4 h-4 text-emerald-500" />
    case 'down':
      return <TrendingDown className="w-4 h-4 text-red-500" />
    default:
      return <Minus className="w-4 h-4 text-slate-400" />
  }
}

export function TrustScoreGauge({ trustScore, improvementTips, isOwnScore = false, size = 'md' }: TrustScoreGaugeProps) {
  const { score, trend, factors } = trustScore
  const color = getScoreColor(score)
  const label = getScoreLabel(score)

  // Calculate the stroke-dasharray for the circular progress
  const circumference = 2 * Math.PI * 45
  const progress = (score / 1000) * circumference

  const sizeConfig = {
    sm: { gauge: 120, stroke: 8, fontSize: 'text-2xl' },
    md: { gauge: 160, stroke: 10, fontSize: 'text-3xl' },
    lg: { gauge: 200, stroke: 12, fontSize: 'text-4xl' }
  }

  const config = sizeConfig[size]

  const factorOrder: (keyof TrustScoreFactors)[] = ['paymentHistory', 'verification', 'tenure', 'engagement', 'network', 'external']

  return (
    <div className="flex flex-col items-center">
      {/* Circular Gauge */}
      <div className="relative" style={{ width: config.gauge, height: config.gauge }}>
        <svg className="transform -rotate-90" width={config.gauge} height={config.gauge}>
          {/* Background circle */}
          <circle
            cx={config.gauge / 2}
            cy={config.gauge / 2}
            r={45}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.stroke}
            className="text-slate-200 dark:text-slate-700"
          />
          {/* Progress circle */}
          <circle
            cx={config.gauge / 2}
            cy={config.gauge / 2}
            r={45}
            fill="none"
            stroke={color}
            strokeWidth={config.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${config.fontSize} font-bold text-slate-900 dark:text-white`}>{score}</span>
          <div className="flex items-center gap-1">
            {getTrendIcon(trend)}
            <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
          </div>
        </div>
      </div>

      {/* Factor Breakdown */}
      <div className="mt-6 w-full max-w-sm space-y-3">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          Score Factors
        </h4>
        {factorOrder.map((key) => {
          const factor = factors[key]
          const tip = improvementTips?.find(t => t.factor === key)

          return (
            <div key={key} className="group">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-slate-600 dark:text-slate-400">{factor.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-900 dark:text-white font-medium">{factor.score}%</span>
                  <span className="text-xs text-slate-400">({factor.weight}%)</span>
                </div>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${factor.score}%`,
                    backgroundColor: factor.score >= 80 ? '#10b981' : factor.score >= 60 ? '#f59e0b' : '#ef4444'
                  }}
                />
              </div>
              {isOwnScore && tip && factor.score < 100 && (
                <div className="mt-1.5 flex items-start gap-1.5 text-xs text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Info className="w-3 h-3 mt-0.5 text-indigo-500 shrink-0" />
                  <span>{tip.tip}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Last calculated */}
      <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
        Last updated: {new Date(trustScore.lastCalculated).toLocaleDateString()}
      </p>
    </div>
  )
}
