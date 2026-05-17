import type { AssociationDashboardProps, TopPerformingCircle, CircleNeedingAttention } from '../types'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  CircleDot,
  Download,
  AlertTriangle,
  Trophy,
  Wallet,
  Shield,
  ChevronRight,
  ArrowUpRight,
  BarChart3
} from 'lucide-react'

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' }).format(amount)
}

function formatCompactCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `CHF ${(amount / 1000000).toFixed(1)}M`
  }
  if (amount >= 1000) {
    return `CHF ${(amount / 1000).toFixed(0)}K`
  }
  return formatCurrency(amount)
}

function formatMonth(monthString: string): string {
  const [year, month] = monthString.split('-')
  return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { month: 'short' })
}

function TrendIcon({ trend, className = '' }: { trend: 'up' | 'down' | 'stable'; className?: string }) {
  if (trend === 'up') return <TrendingUp className={`w-4 h-4 text-emerald-500 ${className}`} />
  if (trend === 'down') return <TrendingDown className={`w-4 h-4 text-red-500 ${className}`} />
  return <Minus className={`w-4 h-4 text-slate-400 ${className}`} />
}

function StatCard({
  icon: Icon,
  label,
  value,
  subValue,
  trend,
  iconColor = 'text-indigo-500',
  iconBg = 'bg-indigo-100 dark:bg-indigo-900/30'
}: {
  icon: typeof Users
  label: string
  value: string | number
  subValue?: string
  trend?: 'up' | 'down' | 'stable'
  iconColor?: string
  iconBg?: string
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        {trend && <TrendIcon trend={trend} />}
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      {subValue && (
        <p className="text-xs text-slate-400 mt-1">{subValue}</p>
      )}
    </div>
  )
}

function TrendChart({ trends }: { trends: AssociationDashboardProps['metrics']['monthlyTrends'] }) {
  const maxValue = Math.max(
    ...trends.map(t => Math.max(t.contributions, t.payouts))
  )

  return (
    <div className="h-48">
      <div className="flex items-end gap-3 h-full">
        {trends.map((item) => (
          <div key={item.month} className="flex-1 flex flex-col items-center gap-1 h-full">
            <div className="flex-1 w-full flex items-end gap-1">
              <div
                className="flex-1 bg-indigo-500 rounded-t opacity-80"
                style={{ height: `${(item.contributions / maxValue) * 100}%` }}
                title={`Contributions: ${formatCurrency(item.contributions)}`}
              />
              <div
                className="flex-1 bg-amber-500 rounded-t opacity-80"
                style={{ height: `${(item.payouts / maxValue) * 100}%` }}
                title={`Payouts: ${formatCurrency(item.payouts)}`}
              />
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              {formatMonth(item.month)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TopCircleCard({ circle, rank, onView }: { circle: TopPerformingCircle; rank: number; onView?: () => void }) {
  return (
    <button
      onClick={onView}
      className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group"
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
        rank === 1
          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
          : rank === 2
          ? 'bg-slate-200 text-slate-600 dark:bg-slate-600 dark:text-slate-300'
          : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
      }`}>
        {rank}
      </div>
      <div className="flex-1 text-left">
        <p className="font-medium text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {circle.name}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {circle.collectionRate}% collection rate
        </p>
      </div>
      <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
    </button>
  )
}

function AtRiskCircleCard({ circle, onView }: { circle: CircleNeedingAttention; onView?: () => void }) {
  return (
    <button
      onClick={onView}
      className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group border border-transparent hover:border-red-200 dark:hover:border-red-800"
    >
      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-100 dark:bg-red-900/30">
        <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
      </div>
      <div className="flex-1 text-left">
        <p className="font-medium text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
          {circle.name}
        </p>
        <p className="text-sm text-red-600 dark:text-red-400">
          {circle.issue}
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-red-600 dark:text-red-400">
          {circle.collectionRate}%
        </p>
        <p className="text-xs text-slate-400">collection</p>
      </div>
    </button>
  )
}

export function AssociationDashboard({
  metrics,
  onViewCircle,
  onExportReport,
  onViewAtRiskCircles
}: AssociationDashboardProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {metrics.associationName}
            </h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Association Analytics Dashboard
            </p>
          </div>
          <button
            onClick={() => onExportReport?.('pdf')}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Users}
            label="Total Members"
            value={metrics.totalMembers.toLocaleString()}
            subValue={`${metrics.activeMembers} active`}
            iconColor="text-indigo-500"
            iconBg="bg-indigo-100 dark:bg-indigo-900/30"
          />
          <StatCard
            icon={CircleDot}
            label="Total Circles"
            value={metrics.totalCircles}
            subValue={`${metrics.activeCircles} active, ${metrics.completedCircles} completed`}
            iconColor="text-emerald-500"
            iconBg="bg-emerald-100 dark:bg-emerald-900/30"
          />
          <StatCard
            icon={Wallet}
            label="Funds Under Management"
            value={formatCompactCurrency(metrics.totalFundsUnderManagement)}
            iconColor="text-amber-500"
            iconBg="bg-amber-100 dark:bg-amber-900/30"
          />
          <StatCard
            icon={Shield}
            label="Emergency Fund"
            value={formatCompactCurrency(metrics.emergencyFundBalance)}
            subValue={`${metrics.emergencyFundUsageThisYear}x used this year`}
            iconColor="text-purple-500"
            iconBg="bg-purple-100 dark:bg-purple-900/30"
          />
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white shadow-lg shadow-emerald-500/20">
            <p className="text-emerald-100 text-sm mb-1">Collection Rate</p>
            <p className="text-3xl font-bold">{metrics.averageCollectionRate}%</p>
            <p className="text-xs text-emerald-100 mt-2">Avg. across circles</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-slate-500 dark:text-slate-400">On-Time Rate</p>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{metrics.averageOnTimeRate}%</p>
            <p className="text-xs text-slate-400 mt-2">Payment timeliness</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-slate-500 dark:text-slate-400">Default Rate</p>
              <TrendIcon trend={metrics.defaultRateTrend} />
            </div>
            <p className={`text-3xl font-bold ${
              metrics.defaultRate <= 2 ? 'text-emerald-600' : metrics.defaultRate <= 5 ? 'text-amber-600' : 'text-red-600'
            }`}>
              {metrics.defaultRate}%
            </p>
            <p className="text-xs text-slate-400 mt-2">
              {metrics.defaultRateTrend === 'down' ? 'Improving' : metrics.defaultRateTrend === 'up' ? 'Needs attention' : 'Stable'}
            </p>
          </div>
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-5 text-white shadow-lg shadow-indigo-500/20">
            <p className="text-indigo-100 text-sm mb-1">Member Growth</p>
            <p className="text-3xl font-bold">+{metrics.memberGrowthRate}%</p>
            <p className="text-xs text-indigo-100 mt-2">This year</p>
          </div>
        </div>

        {/* Financial Flow */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <BarChart3 className="w-5 h-5 text-indigo-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Financial Activity
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Monthly contributions and payouts</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-indigo-500" /> Contributions
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-500" /> Payouts
              </span>
            </div>
          </div>
          <TrendChart trends={metrics.monthlyTrends} />
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Contributions (2025)</p>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {formatCurrency(metrics.totalContributionsThisYear)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Payouts (2025)</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {formatCurrency(metrics.totalPayoutsThisYear)}
              </p>
            </div>
          </div>
        </div>

        {/* Top Circles & At-Risk Circles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performing Circles */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <Trophy className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Top Performing Circles
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Highest collection rates</p>
              </div>
            </div>
            <div className="space-y-2">
              {metrics.topPerformingCircles.map((circle, index) => (
                <TopCircleCard
                  key={circle.id}
                  circle={circle}
                  rank={index + 1}
                  onView={() => onViewCircle?.(circle.id)}
                />
              ))}
            </div>
          </div>

          {/* Circles Needing Attention */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Circles Needing Attention
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Below benchmark performance</p>
                </div>
              </div>
              {metrics.circlesNeedingAttention.length > 3 && (
                <button
                  onClick={onViewAtRiskCircles}
                  className="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                >
                  View all
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              )}
            </div>
            {metrics.circlesNeedingAttention.length > 0 ? (
              <div className="space-y-2">
                {metrics.circlesNeedingAttention.slice(0, 3).map((circle) => (
                  <AtRiskCircleCard
                    key={circle.id}
                    circle={circle}
                    onView={() => onViewCircle?.(circle.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-6 h-6 text-emerald-500" />
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-medium">All circles performing well!</p>
                <p className="text-sm text-slate-400 mt-1">No circles below benchmark</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
