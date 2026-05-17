import type { Association, AssociationAnalytics as Analytics } from '../types'
import {
  TrendingUp,
  TrendingDown,
  Users,
  BarChart3,
  Activity,
  Download,
  Calendar,
  Target,
  Award,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'

export interface AssociationAnalyticsProps {
  association: Association
  analytics: Analytics
  onExportReport?: () => void
  onViewMember?: (memberId: string) => void
  onBack?: () => void
}

export function AssociationAnalytics({
  association,
  analytics,
  onExportReport,
  onViewMember,
  onBack,
}: AssociationAnalyticsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CH', {
      style: 'currency',
      currency: association.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatMonth = (monthStr: string) => {
    const date = new Date(monthStr + '-01')
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  // Calculate growth trends
  const memberGrowthData = analytics.memberGrowth
  const latestMonth = memberGrowthData[memberGrowthData.length - 1]
  const previousMonth = memberGrowthData[memberGrowthData.length - 2]
  const memberGrowthPercent = previousMonth
    ? ((latestMonth.totalMembers - previousMonth.totalMembers) / previousMonth.totalMembers) * 100
    : 0

  const circleData = analytics.circleActivity
  const latestCircleMonth = circleData[circleData.length - 1]
  const previousCircleMonth = circleData[circleData.length - 2]
  const contributionGrowthPercent = previousCircleMonth
    ? ((latestCircleMonth.totalContributions - previousCircleMonth.totalContributions) / previousCircleMonth.totalContributions) * 100
    : 0

  // Calculate max values for chart scaling
  const maxMembers = Math.max(...memberGrowthData.map(d => d.totalMembers))
  const maxContributions = Math.max(...circleData.map(d => d.totalContributions))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-50 dark:from-slate-950 dark:via-indigo-950/10 dark:to-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 dark:from-indigo-900 dark:via-indigo-800 dark:to-indigo-900 border-b-4 border-amber-400 dark:border-amber-500 shadow-xl">
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
                    <BarChart3 className="w-7 h-7 text-indigo-900 dark:text-indigo-950" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">Analytics & Insights</h1>
                    <p className="text-indigo-200 dark:text-indigo-300">{association.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-indigo-200 dark:text-indigo-300">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Period: {formatMonth(analytics.period)}</span>
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
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/30 flex items-center justify-center">
                <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-bold ${memberGrowthPercent >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {memberGrowthPercent >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {Math.abs(memberGrowthPercent).toFixed(1)}%
              </div>
            </div>
            <div className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-1">
              {latestMonth.totalMembers}
            </div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Members
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
              +{latestMonth.newMembers} new this month
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-bold ${contributionGrowthPercent >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {contributionGrowthPercent >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {Math.abs(contributionGrowthPercent).toFixed(1)}%
              </div>
            </div>
            <div className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-1">
              {formatCurrency(latestCircleMonth.totalContributions)}
            </div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Contributions
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              Avg: {formatCurrency(latestCircleMonth.averageContribution)}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center">
                <Activity className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-1">
              {analytics.engagementMetrics.participationRate.toFixed(0)}%
            </div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Participation Rate
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              {analytics.engagementMetrics.activeMembers} active members
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-1">
              {latestCircleMonth.activeCircles}
            </div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Active Circles
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              {analytics.engagementMetrics.averageLoginFrequency.toFixed(1)}x avg logins/week
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Member Growth Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 shadow-lg overflow-hidden">
            <div className="p-6 border-b-2 border-indigo-100 dark:border-indigo-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/30 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    Member Growth Trend
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Last 6 months
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {memberGrowthData.map((data, index) => {
                  const barWidth = (data.totalMembers / maxMembers) * 100
                  return (
                    <div key={data.month}>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {formatMonth(data.month)}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-emerald-600 dark:text-emerald-400 text-xs">
                            +{data.newMembers}
                          </span>
                          <span className="font-bold text-slate-900 dark:text-slate-100">
                            {data.totalMembers}
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-8 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700 transition-all flex items-center justify-end pr-2"
                          style={{ width: `${barWidth}%` }}
                        >
                          {index === memberGrowthData.length - 1 && (
                            <span className="text-xs font-bold text-white">Latest</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Circle Activity Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 shadow-lg overflow-hidden">
            <div className="p-6 border-b-2 border-indigo-100 dark:border-indigo-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    Circle Contributions
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Monthly totals
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {circleData.map((data, index) => {
                  const barWidth = (data.totalContributions / maxContributions) * 100
                  return (
                    <div key={data.month}>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {formatMonth(data.month)}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-600 dark:text-slate-400">
                            {data.activeCircles} circles
                          </span>
                          <span className="font-bold text-slate-900 dark:text-slate-100">
                            {formatCurrency(data.totalContributions)}
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-8 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 transition-all flex items-center justify-end pr-2"
                          style={{ width: `${barWidth}%` }}
                        >
                          {index === circleData.length - 1 && (
                            <span className="text-xs font-bold text-white">Latest</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Top Contributors */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 shadow-lg overflow-hidden mb-8">
          <div className="p-6 border-b-2 border-indigo-100 dark:border-indigo-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center">
                <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Top Contributors
              </h2>
            </div>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {analytics.topContributors.map((contributor, index) => (
              <button
                key={contributor.memberId}
                onClick={() => onViewMember?.(contributor.memberId)}
                className="w-full px-6 py-4 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                    #{index + 1}
                  </div>
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex-shrink-0">
                    {contributor.avatarUrl ? (
                      <img src={contributor.avatarUrl} alt={contributor.memberName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                        {contributor.memberName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {contributor.memberName}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {contributor.circlesParticipating} circles
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {formatCurrency(contributor.totalContributions)}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Total contributed
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity Summary */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 shadow-lg overflow-hidden">
          <div className="p-6 border-b-2 border-indigo-100 dark:border-indigo-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/30 flex items-center justify-center">
                <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Recent Activity
              </h2>
            </div>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {analytics.recentActivity.map((activity) => (
              <div key={activity.date} className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-slate-600 dark:text-slate-400 w-24">
                    {new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      {activity.description}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold">
                    {activity.count}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
