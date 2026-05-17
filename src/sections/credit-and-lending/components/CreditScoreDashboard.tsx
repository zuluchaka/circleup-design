import { useState } from 'react'
import { TrendingUp, Lightbulb, ChevronRight, Check, Sparkles, Info } from 'lucide-react'
import type { CreditScore, SimulatorScenario, CreditTip } from '@/../product/sections/credit-and-lending/types'

export interface CreditScoreDashboardProps {
  creditScore: CreditScore
  simulatorScenarios: SimulatorScenario[]
  creditTips: CreditTip[]
  onRunSimulation?: (scenarioId: string) => void
  onTipAction?: (tip: CreditTip) => void
}

function ScoreGauge({ score, maxScore, tier }: { score: number; maxScore: number; tier: string }) {
  const percentage = (score / maxScore) * 100
  const circumference = 2 * Math.PI * 120
  const strokeDashoffset = circumference - (percentage / 100) * circumference * 0.75

  const tierColors: Record<string, { gradient: string; text: string }> = {
    poor: { gradient: 'from-red-500 to-red-600', text: 'text-red-500' },
    fair: { gradient: 'from-amber-500 to-orange-500', text: 'text-amber-500' },
    good: { gradient: 'from-indigo-500 to-indigo-600', text: 'text-indigo-500' },
    excellent: { gradient: 'from-emerald-500 to-emerald-600', text: 'text-emerald-500' },
  }

  const colors = tierColors[tier] || tierColors.good

  return (
    <div className="relative w-64 h-48 mx-auto">
      <svg className="w-full h-full" viewBox="0 0 280 200">
        {/* Background arc */}
        <path
          d="M 40 180 A 120 120 0 0 1 240 180"
          fill="none"
          stroke="currentColor"
          strokeWidth="20"
          strokeLinecap="round"
          className="text-slate-200 dark:text-slate-700"
        />
        {/* Colored arc */}
        <path
          d="M 40 180 A 120 120 0 0 1 240 180"
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="20"
          strokeLinecap="round"
          strokeDasharray={circumference * 0.75}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" className={`${tier === 'poor' ? 'text-red-500' : tier === 'fair' ? 'text-amber-500' : tier === 'good' ? 'text-indigo-500' : 'text-emerald-500'}`} stopColor="currentColor" />
            <stop offset="100%" className={`${tier === 'poor' ? 'text-red-600' : tier === 'fair' ? 'text-orange-500' : tier === 'good' ? 'text-indigo-600' : 'text-emerald-600'}`} stopColor="currentColor" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
        <span className={`text-5xl font-bold ${colors.text}`}>{score}</span>
        <span className="text-sm text-slate-500 dark:text-slate-400 mt-1">of {maxScore}</span>
        <span className={`text-sm font-semibold uppercase tracking-wider mt-2 ${colors.text}`}>
          {tier}
        </span>
      </div>
    </div>
  )
}

function FactorBar({ factor, color }: { factor: { weight: number; score: number; label: string; description: string }; color: string }) {
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{factor.label}</span>
          <span className="text-xs text-slate-400 dark:text-slate-500">({factor.weight}%)</span>
        </div>
        <span className="text-sm font-semibold text-slate-900 dark:text-white">{factor.score}/100</span>
      </div>
      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${factor.score}%` }}
        />
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {factor.description}
      </p>
    </div>
  )
}

function ScoreHistoryChart({ history, currentScore }: { history: { date: string; score: number }[]; currentScore: number }) {
  const allScores = [...history.map(h => h.score), currentScore]
  const minScore = Math.min(...allScores) - 20
  const maxScore = Math.max(...allScores) + 20
  const range = maxScore - minScore

  const points = [...history, { date: 'Now', score: currentScore }]
    .map((point, index) => {
      const x = (index / (history.length)) * 100
      const y = 100 - ((point.score - minScore) / range) * 100
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div className="mt-6">
      <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Score History</h4>
      <div className="h-24 relative">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Gradient fill */}
          <defs>
            <linearGradient id="historyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(99 102 241)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(99 102 241)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Area fill */}
          <polygon
            points={`0,100 ${points} 100,100`}
            fill="url(#historyGradient)"
          />
          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke="rgb(99 102 241)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          {/* Current point */}
          <circle
            cx="100"
            cy={100 - ((currentScore - minScore) / range) * 100}
            r="3"
            fill="rgb(99 102 241)"
            className="animate-pulse"
          />
        </svg>
        <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-1">
          {history.slice(0, 3).map((h, i) => (
            <span key={i}>{new Date(h.date).toLocaleDateString('en-US', { month: 'short' })}</span>
          ))}
          <span className="font-medium text-indigo-500">Now</span>
        </div>
      </div>
    </div>
  )
}

export function CreditScoreDashboard({
  creditScore,
  simulatorScenarios,
  creditTips,
  onRunSimulation,
  onTipAction,
}: CreditScoreDashboardProps) {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [showAllTips, setShowAllTips] = useState(false)

  const factorColors = {
    paymentHistory: 'bg-indigo-500',
    verification: 'bg-emerald-500',
    tenure: 'bg-amber-500',
    engagement: 'bg-cyan-500',
    network: 'bg-purple-500',
    external: 'bg-pink-500',
  }

  const displayedTips = showAllTips ? creditTips : creditTips.slice(0, 3)

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Credit Score</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Your CircleUp credit score based on participation history
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Info className="w-4 h-4" />
          <span>Last updated {new Date(creditScore.lastUpdated).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Score Card */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <ScoreGauge
            score={creditScore.score}
            maxScore={creditScore.maxScore}
            tier={creditScore.tier}
          />
          <ScoreHistoryChart history={creditScore.history} currentScore={creditScore.score} />

          {/* Quick improvement tips from score */}
          {creditScore.improvementTips.length > 0 && (
            <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Quick Wins</span>
              </div>
              <ul className="space-y-2">
                {creditScore.improvementTips.map((tip, i) => (
                  <li key={i} className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Factor Breakdown */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Score Breakdown</h3>
          <div className="grid sm:grid-cols-2 gap-6">
            {Object.entries(creditScore.factors).map(([key, factor]) => (
              <FactorBar
                key={key}
                factor={factor}
                color={factorColors[key as keyof typeof factorColors]}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Score Simulator */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Score Simulator</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">See how actions can impact your score</p>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {simulatorScenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => {
                setSelectedScenario(scenario.id)
                onRunSimulation?.(scenario.id)
              }}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                selectedScenario === scenario.id
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600'
              }`}
            >
              <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                {scenario.label}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-emerald-500">+{scenario.scoreImpact}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">pts</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Projected: {scenario.newProjectedScore}
              </p>
              {scenario.currentValue > 0 && (
                <div className="mt-2 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${(scenario.currentValue / scenario.targetValue) * 100}%` }}
                  />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Credit Tips */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Lightbulb className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Credit Building Tips</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Personalized recommendations to improve your score</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {displayedTips.map((tip) => (
            <div
              key={tip.id}
              className={`p-4 rounded-xl border ${
                tip.completed
                  ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {tip.completed && (
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-emerald-500 rounded-full">
                        <Check className="w-3 h-3 text-white" />
                      </span>
                    )}
                    <h4 className={`font-medium ${tip.completed ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                      {tip.title}
                    </h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      tip.impactLevel === 'high'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : tip.impactLevel === 'medium'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-600 dark:text-slate-300'
                    }`}>
                      {tip.impactLevel} impact
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{tip.description}</p>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-2 font-medium">
                    {tip.estimatedScoreImpact}
                  </p>
                </div>
                {tip.actionLabel && !tip.completed && (
                  <button
                    onClick={() => onTipAction?.(tip)}
                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
                  >
                    {tip.actionLabel}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {creditTips.length > 3 && (
          <button
            onClick={() => setShowAllTips(!showAllTips)}
            className="mt-4 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
          >
            {showAllTips ? 'Show less' : `Show ${creditTips.length - 3} more tips`}
          </button>
        )}
      </div>
    </div>
  )
}
