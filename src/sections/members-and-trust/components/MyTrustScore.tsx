import { useState } from 'react'
import type { TrustScore, Member, Reference, ScoreImprovementTip, TrustScoreFactors } from '@/../product/sections/members-and-trust/types'
import {
  Shield,
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  Clock,
  Users,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  History,
  Sparkles,
  Target,
  UserCheck,
  FileText
} from 'lucide-react'

interface MyTrustScoreProps {
  member: Member
  trustScore: TrustScore
  references: Reference[]
  improvementTips: ScoreImprovementTip[]
  scoreHistory?: { date: string; score: number }[]
  onRequestReference?: () => void
  onCompleteVerification?: () => void
  onViewHistory?: () => void
}

function getScoreColor(score: number): string {
  if (score >= 800) return 'text-emerald-600 dark:text-emerald-400'
  if (score >= 600) return 'text-amber-600 dark:text-amber-400'
  if (score >= 400) return 'text-orange-600 dark:text-orange-400'
  return 'text-red-600 dark:text-red-400'
}

function getScoreLabel(score: number): string {
  if (score >= 800) return 'Excellent'
  if (score >= 600) return 'Good'
  if (score >= 400) return 'Fair'
  return 'Needs Improvement'
}

function getTrendInfo(trend: string) {
  switch (trend) {
    case 'up':
      return { icon: <TrendingUp className="w-5 h-5" />, label: 'Improving', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30' }
    case 'down':
      return { icon: <TrendingDown className="w-5 h-5" />, label: 'Declining', color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30' }
    default:
      return { icon: <Minus className="w-5 h-5" />, label: 'Stable', color: 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800' }
  }
}

function getFactorIcon(factor: keyof TrustScoreFactors) {
  const icons = {
    paymentHistory: <CreditCard className="w-5 h-5" />,
    verification: <Shield className="w-5 h-5" />,
    tenure: <Clock className="w-5 h-5" />,
    engagement: <Users className="w-5 h-5" />,
    network: <UserCheck className="w-5 h-5" />,
    external: <FileText className="w-5 h-5" />
  }
  return icons[factor]
}

export function MyTrustScore({
  member: _member,
  trustScore,
  references,
  improvementTips,
  scoreHistory = [],
  onRequestReference,
  onCompleteVerification,
  onViewHistory
}: MyTrustScoreProps) {
  const [selectedFactor, setSelectedFactor] = useState<keyof TrustScoreFactors | null>(null)

  const trendInfo = getTrendInfo(trustScore.trend)
  const factorOrder: (keyof TrustScoreFactors)[] = ['paymentHistory', 'verification', 'tenure', 'engagement', 'network', 'external']

  // Find factors that need improvement (under 80%)
  const improvableFacts = factorOrder.filter(key => trustScore.factors[key].score < 80)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">My Trust Score</h1>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
            {/* Score Display */}
            <div className="relative">
              <div className="w-40 h-40 sm:w-48 sm:h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="white"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 45}
                    strokeDashoffset={(1 - trustScore.score / 1000) * 2 * Math.PI * 45}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl sm:text-5xl font-bold">{trustScore.score}</span>
                  <span className="text-sm text-white/80">out of 1000</span>
                </div>
              </div>
            </div>

            {/* Score Summary */}
            <div className="flex-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full backdrop-blur-sm mb-3">
                {trendInfo.icon}
                <span className="text-sm font-medium">{trendInfo.label}</span>
              </div>
              <h2 className={`text-2xl font-bold mb-2 ${getScoreColor(trustScore.score).replace('text-', 'text-white/')}`}>
                {getScoreLabel(trustScore.score)}
              </h2>
              <p className="text-white/70 text-sm max-w-sm">
                Your trust score is calculated from 6 factors and updated continuously based on your activity.
              </p>
              <p className="mt-3 text-xs text-white/50">
                Last updated: {new Date(trustScore.lastCalculated).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Quick Actions */}
        {improvableFacts.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Quick Wins</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {trustScore.factors.verification.score < 100 && (
                <button
                  onClick={() => onCompleteVerification?.()}
                  className="flex items-center gap-3 p-4 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-xl transition-colors text-left"
                >
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                    <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 dark:text-white text-sm">Complete Verification</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Boost score by up to 200 pts</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>
              )}
              {references.length < 3 && (
                <button
                  onClick={() => onRequestReference?.()}
                  className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded-xl transition-colors text-left"
                >
                  <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                    <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 dark:text-white text-sm">Get References</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">You have {references.length} of 3+ recommended</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Score Factors */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-semibold text-slate-900 dark:text-white">Score Breakdown</h3>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Click any factor for tips</span>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {factorOrder.map((key) => {
              const factor = trustScore.factors[key]
              const tip = improvementTips.find(t => t.factor === key)
              const isSelected = selectedFactor === key
              const isExcellent = factor.score >= 80

              return (
                <button
                  key={key}
                  onClick={() => setSelectedFactor(isSelected ? null : key)}
                  className="w-full px-4 sm:px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      isExcellent
                        ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {getFactorIcon(key)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-medium text-slate-900 dark:text-white text-sm">{factor.label}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${
                            factor.score >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
                            factor.score >= 60 ? 'text-amber-600 dark:text-amber-400' :
                            'text-red-600 dark:text-red-400'
                          }`}>
                            {factor.score}%
                          </span>
                          <span className="text-xs text-slate-400">({factor.weight}% weight)</span>
                        </div>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            factor.score >= 80 ? 'bg-emerald-500' :
                            factor.score >= 60 ? 'bg-amber-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${factor.score}%` }}
                        />
                      </div>
                    </div>
                    {isExcellent ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                    )}
                  </div>

                  {/* Expandable tip */}
                  {isSelected && tip && (
                    <div className="mt-3 ml-12 p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-sm text-slate-700 dark:text-slate-300">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                        <p>{tip.tip}</p>
                      </div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Score History Preview */}
        {scoreHistory.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-semibold text-slate-900 dark:text-white">Score History</h3>
              </div>
              <button
                onClick={() => onViewHistory?.()}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View all
              </button>
            </div>

            <div className="flex items-end gap-1 h-24">
              {scoreHistory.slice(-12).map((point, i) => {
                const height = (point.score / 1000) * 100
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t transition-all ${
                        point.score >= 800 ? 'bg-emerald-500' :
                        point.score >= 600 ? 'bg-amber-500' :
                        point.score >= 400 ? 'bg-orange-500' :
                        'bg-red-500'
                      }`}
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-[10px] text-slate-400">
                      {new Date(point.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* References Summary */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-semibold text-slate-900 dark:text-white">My References</h3>
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {references.length} received
            </span>
          </div>

          {references.length > 0 ? (
            <div className="space-y-3">
              {references.slice(0, 2).map((ref) => (
                <div key={ref.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm text-slate-900 dark:text-white">
                      {ref.fromMemberName}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {ref.relationship}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                    "{ref.text}"
                  </p>
                </div>
              ))}
              {references.length > 2 && (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                  +{references.length - 2} more references
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <Award className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-500 dark:text-slate-400">No references yet</p>
              <button
                onClick={() => onRequestReference?.()}
                className="mt-3 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Request a reference
              </button>
            </div>
          )}
        </div>

        {/* How Score is Calculated */}
        <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-4 sm:p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3">How Your Score is Calculated</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Your trust score combines multiple factors to give other members and organizers
            confidence in your reliability. Payment history has the highest weight (40%),
            followed by verification level (20%), membership tenure (15%), community engagement (10%),
            network connections (10%), and external credit factors (5%).
          </p>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-500">
            Model version: {trustScore.modelVersion}
          </p>
        </div>
      </div>
    </div>
  )
}
