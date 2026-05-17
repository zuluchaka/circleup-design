import type { CircleHealthDashboardProps, MemberContribution } from '../types'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Download,
  Calendar,
  Bell,
  ChevronUp,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Shield,
  MoreVertical
} from 'lucide-react'

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' }).format(amount)
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

function StatusBadge({ status }: { status: MemberContribution['status'] }) {
  const styles = {
    excellent: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    good: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    at_risk: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    defaulted: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  }

  const labels = {
    excellent: 'Excellent',
    good: 'Good',
    at_risk: 'At Risk',
    defaulted: 'Defaulted'
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}

function MetricCard({
  label,
  value,
  suffix = '',
  benchmark,
  status,
  trend
}: {
  label: string
  value: number
  suffix?: string
  benchmark?: number
  status?: 'above' | 'below' | 'at'
  trend?: 'up' | 'down' | 'stable'
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
        {trend && <TrendIcon trend={trend} />}
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">
        {value.toFixed(1)}{suffix}
      </p>
      {benchmark !== undefined && (
        <p className={`text-xs mt-1 ${
          status === 'above' ? 'text-emerald-500' : status === 'below' ? 'text-red-500' : 'text-slate-400'
        }`}>
          {status === 'above' ? (
            <span className="flex items-center gap-1">
              <ChevronUp className="w-3 h-3" />
              Above benchmark ({benchmark}%)
            </span>
          ) : status === 'below' ? (
            <span className="flex items-center gap-1">
              <ChevronDown className="w-3 h-3" />
              Below benchmark ({benchmark}%)
            </span>
          ) : (
            `At benchmark (${benchmark}%)`
          )}
        </p>
      )}
    </div>
  )
}

function TrendChart({ trends }: { trends: CircleHealthDashboardProps['metrics']['monthlyTrends'] }) {
  const maxRate = 100

  return (
    <div className="h-32">
      <div className="flex items-end gap-2 h-full">
        {trends.map((item, index) => (
          <div key={item.month} className="flex-1 flex flex-col items-center gap-1 h-full">
            <div className="flex-1 w-full flex flex-col justify-end gap-0.5">
              <div
                className="w-full bg-indigo-500 rounded-t opacity-80"
                style={{ height: `${(item.collectionRate / maxRate) * 100}%` }}
                title={`Collection: ${item.collectionRate}%`}
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

function MemberRow({
  member,
  onViewMember,
  onSendReminder
}: {
  member: MemberContribution
  onViewMember?: () => void
  onSendReminder?: () => void
}) {
  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
      <td className="px-4 py-3">
        <button onClick={onViewMember} className="flex items-center gap-3 text-left group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-medium text-sm">
            {member.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {member.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {member.role === 'organizer' ? 'Organizer' : 'Member'}
            </p>
          </div>
        </button>
      </td>
      <td className="px-4 py-3 text-center">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300">
          #{member.payoutPosition}
        </span>
      </td>
      <td className="px-4 py-3 text-right font-medium text-slate-900 dark:text-white">
        {formatCurrency(member.totalContributed)}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-center gap-1">
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">{member.onTimePayments}</span>
          <span className="text-slate-400">/</span>
          <span className="text-amber-600 dark:text-amber-400">{member.latePayments}</span>
          <span className="text-slate-400">/</span>
          <span className="text-red-600 dark:text-red-400">{member.missedPayments}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <div className="w-16 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                member.onTimeRate >= 90 ? 'bg-emerald-500' : member.onTimeRate >= 75 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${member.onTimeRate}%` }}
            />
          </div>
          <span className="text-sm text-slate-600 dark:text-slate-300 w-12">
            {member.onTimeRate}%
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <Shield className={`w-4 h-4 ${
            member.trustScore >= 800 ? 'text-emerald-500' : member.trustScore >= 600 ? 'text-amber-500' : 'text-red-500'
          }`} />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {member.trustScore}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        <StatusBadge status={member.status} />
      </td>
      <td className="px-4 py-3 text-center">
        {member.payoutReceived ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
        ) : (
          <Clock className="w-5 h-5 text-slate-400 mx-auto" />
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          {member.status === 'at_risk' && (
            <button
              onClick={onSendReminder}
              className="p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
              title="Send reminder"
            >
              <Bell className="w-4 h-4" />
            </button>
          )}
          <button className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}

export function CircleHealthDashboard({
  metrics,
  memberContributions,
  onViewMember,
  onSendReminder,
  onExportReport,
  onScheduleReport
}: CircleHealthDashboardProps) {
  const progress = (metrics.currentCycle / metrics.totalCycles) * 100

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                {metrics.circleName}
              </h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                metrics.status === 'active'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
              }`}>
                {metrics.status.charAt(0).toUpperCase() + metrics.status.slice(1)}
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400">
              {metrics.associationName} • Cycle {metrics.currentCycle} of {metrics.totalCycles}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onScheduleReport}
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Schedule Report
            </button>
            <button
              onClick={() => onExportReport?.('pdf')}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">Circle Progress</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {metrics.memberCount} members • {formatCurrency(metrics.totalCollected)} collected
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {progress.toFixed(0)}%
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Complete</p>
            </div>
          </div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            label="Collection Rate"
            value={metrics.collectionRate}
            suffix="%"
            benchmark={metrics.benchmarkComparison.collectionRate.benchmark}
            status={metrics.benchmarkComparison.collectionRate.status}
            trend={metrics.collectionRateTrend}
          />
          <MetricCard
            label="On-Time Payments"
            value={metrics.onTimePaymentRate}
            suffix="%"
            benchmark={metrics.benchmarkComparison.onTimePayment.benchmark}
            status={metrics.benchmarkComparison.onTimePayment.status}
            trend={metrics.onTimePaymentTrend}
          />
          <MetricCard
            label="Engagement Score"
            value={metrics.averageEngagementScore}
            suffix=""
            benchmark={metrics.benchmarkComparison.engagement.benchmark}
            status={metrics.benchmarkComparison.engagement.status}
          />
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <span className="text-sm text-slate-500 dark:text-slate-400">Emergency Fund</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
              {formatCurrency(metrics.emergencyFundBalance)}
            </p>
            <p className="text-xs text-slate-400 mt-1">Available for coverage</p>
          </div>
        </div>

        {/* Risk Indicators & Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Risk Indicators */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Risk Indicators
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300">Members at Risk</span>
                <span className={`font-semibold ${
                  metrics.riskIndicators.membersAtRisk > 0 ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                  {metrics.riskIndicators.membersAtRisk}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300">Late Payments (This Month)</span>
                <span className={`font-semibold ${
                  metrics.riskIndicators.latePaymentsThisMonth > 0 ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                  {metrics.riskIndicators.latePaymentsThisMonth}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300">Emergency Fund Used</span>
                <span className={`font-semibold ${
                  metrics.riskIndicators.emergencyFundUsage > 0 ? 'text-red-600' : 'text-emerald-600'
                }`}>
                  {metrics.riskIndicators.emergencyFundUsage}x
                </span>
              </div>
            </div>
          </div>

          {/* Trend Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
              Collection Rate Trend
            </h3>
            <TrendChart trends={metrics.monthlyTrends} />
          </div>
        </div>

        {/* Member Contributions Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-500" />
                <h3 className="font-semibold text-slate-900 dark:text-white">Member Contributions</h3>
              </div>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {memberContributions.length} members
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Contributed
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    On/Late/Missed
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    On-Time Rate
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Trust Score
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Payout
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {memberContributions.map(member => (
                  <MemberRow
                    key={member.userId}
                    member={member}
                    onViewMember={() => onViewMember?.(member.userId)}
                    onSendReminder={() => onSendReminder?.(member.userId)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
