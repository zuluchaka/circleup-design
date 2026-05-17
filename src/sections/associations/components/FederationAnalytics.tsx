import type { Federation, FederationMembership, FederationMetrics } from '@/../product/sections/associations/types'
import {
  TrendingUp,
  BarChart3,
  Download,
  Building2,
  Users,
  Target,
  Award,
  ArrowUp,
  Calendar,
} from 'lucide-react'

export interface FederationAnalyticsProps {
  federation: Federation
  chapters: FederationMembership[]
  metrics: FederationMetrics
  onExportReport?: () => void
  onViewChapter?: (associationId: string) => void
  onBack?: () => void
}

export function FederationAnalytics({
  federation,
  chapters,
  metrics,
  onExportReport,
  onViewChapter,
  onBack,
}: FederationAnalyticsProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const formatMonth = (period: string) => {
    const date = new Date(period + '-01')
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  // Calculate chapter performance tiers
  const excellentChapters = metrics.chapterPerformance.filter(c => c.healthScore >= 90)
  const goodChapters = metrics.chapterPerformance.filter(c => c.healthScore >= 75 && c.healthScore < 90)
  const needsAttention = metrics.chapterPerformance.filter(c => c.healthScore < 75)

  // Sort chapters by different metrics
  const topByMembers = [...metrics.chapterPerformance].sort((a, b) => b.memberCount - a.memberCount).slice(0, 5)
  const topByContributions = [...metrics.chapterPerformance].sort((a, b) => b.contributions - a.contributions).slice(0, 5)
  const topByHealth = [...metrics.chapterPerformance].sort((a, b) => b.healthScore - a.healthScore).slice(0, 5)

  // Calculate max values for scaling
  const maxMembers = Math.max(...metrics.chapterPerformance.map(c => c.memberCount))
  const maxContributions = Math.max(...metrics.chapterPerformance.map(c => c.contributions))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-slate-50 dark:from-slate-950 dark:via-purple-950/10 dark:to-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 dark:from-purple-900 dark:via-purple-800 dark:to-purple-900 border-b-4 border-amber-400 dark:border-amber-500 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              )}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-amber-400 dark:bg-amber-500 flex items-center justify-center shadow-lg">
                    <BarChart3 className="w-7 h-7 text-purple-900 dark:text-purple-950" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">Federation Analytics</h1>
                    <p className="text-purple-200 dark:text-purple-300">{federation.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-purple-200 dark:text-purple-300">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Period: {formatMonth(metrics.period)}</span>
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    <span>{chapters.length} Chapters</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={onExportReport}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Federation Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-purple-200 dark:border-purple-800 p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex items-center gap-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                <ArrowUp className="w-4 h-4" />
                {metrics.memberGrowth.toFixed(1)}%
              </div>
            </div>
            <div className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-1">
              {formatNumber(metrics.totalMembers)}
            </div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Members
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
              Across all chapters
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-purple-200 dark:border-purple-800 p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center">
                <Target className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-1">
              {metrics.activeCircles}
            </div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Active Circles
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              Federation-wide
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-purple-200 dark:border-purple-800 p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/30 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <div className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-1">
              CHF {formatNumber(metrics.totalContributions)}
            </div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Contributions
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              This period
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-purple-200 dark:border-purple-800 p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center">
                <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-1">
              {metrics.averageCircleHealth}
            </div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Avg Health Score
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
              {excellentChapters.length} excellent chapters
            </div>
          </div>
        </div>

        {/* Chapter Performance Distribution */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-purple-200 dark:border-purple-800 shadow-lg overflow-hidden mb-8">
          <div className="p-6 border-b-2 border-purple-100 dark:border-purple-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Chapter Performance Distribution
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Health score breakdown across all chapters
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-xl p-6 border-2 border-emerald-200 dark:border-emerald-800">
                <div className="text-5xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                  {excellentChapters.length}
                </div>
                <div className="font-semibold text-emerald-900 dark:text-emerald-100 mb-1">
                  Excellent
                </div>
                <div className="text-sm text-emerald-700 dark:text-emerald-300">
                  Health Score ≥ 90
                </div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-6 border-2 border-amber-200 dark:border-amber-800">
                <div className="text-5xl font-bold text-amber-600 dark:text-amber-400 mb-2">
                  {goodChapters.length}
                </div>
                <div className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                  Good
                </div>
                <div className="text-sm text-amber-700 dark:text-amber-300">
                  Health Score 75-89
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-950/20 rounded-xl p-6 border-2 border-red-200 dark:border-red-800">
                <div className="text-5xl font-bold text-red-600 dark:text-red-400 mb-2">
                  {needsAttention.length}
                </div>
                <div className="font-semibold text-red-900 dark:text-red-100 mb-1">
                  Needs Attention
                </div>
                <div className="text-sm text-red-700 dark:text-red-300">
                  Health Score &lt; 75
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Chapters by Members */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-purple-200 dark:border-purple-800 shadow-lg overflow-hidden">
            <div className="p-6 border-b-2 border-purple-100 dark:border-purple-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/30 flex items-center justify-center">
                  <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Top Chapters by Members
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topByMembers.map((chapter, index) => {
                  const barWidth = (chapter.memberCount / maxMembers) * 100
                  return (
                    <button
                      key={chapter.associationId}
                      onClick={() => onViewChapter?.(chapter.associationId)}
                      className="w-full text-left hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-colors rounded-lg p-2"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                          #{index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {chapter.associationName}
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                          {chapter.memberCount}
                        </div>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Top Chapters by Contributions */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-purple-200 dark:border-purple-800 shadow-lg overflow-hidden">
            <div className="p-6 border-b-2 border-purple-100 dark:border-purple-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Top Chapters by Contributions
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topByContributions.map((chapter, index) => {
                  const barWidth = (chapter.contributions / maxContributions) * 100
                  return (
                    <button
                      key={chapter.associationId}
                      onClick={() => onViewChapter?.(chapter.associationId)}
                      className="w-full text-left hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-colors rounded-lg p-2"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center font-bold text-sm">
                          #{index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {chapter.associationName}
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                          CHF {formatNumber(chapter.contributions)}
                        </div>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-600"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* All Chapters Performance */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-purple-200 dark:border-purple-800 shadow-lg overflow-hidden">
          <div className="p-6 border-b-2 border-purple-100 dark:border-purple-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center">
                <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                All Chapters Performance
              </h2>
            </div>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {topByHealth.map((chapter) => {
              const healthColor = chapter.healthScore >= 90
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/30'
                : chapter.healthScore >= 75
                ? 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/30'
                : 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/30'

              return (
                <button
                  key={chapter.associationId}
                  onClick={() => onViewChapter?.(chapter.associationId)}
                  className="w-full px-6 py-4 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-xl ${healthColor} flex items-center justify-center`}>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{chapter.healthScore}</div>
                        <div className="text-xs font-medium">Health</div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 truncate mb-1">
                        {chapter.associationName}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                        <span>{chapter.memberCount} members</span>
                        <span>·</span>
                        <span>{chapter.activeCircles} circles</span>
                        <span>·</span>
                        <span>CHF {formatNumber(chapter.contributions)}</span>
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
