import type { CircleAnalyticsDashboardProps } from '@/../product/sections/rosca-circles/types'

const trendIcon = (trend: string) => {
  if (trend === 'up' || trend === 'improving') return '↑'
  if (trend === 'down' || trend === 'declining') return '↓'
  return '→'
}

const benchmarkColor = (status: string) =>
  status === 'above' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'

export function CircleAnalyticsDashboard({
  metrics,
  memberReliability,
  riskAlerts,
  onBack,
  onExport,
}: CircleAnalyticsDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {metrics.circleName} — Analytics
          </h3>
        </div>
        {onExport && (
          <div className="flex gap-2">
            <button
              onClick={() => onExport('pdf')}
              className="px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Export PDF
            </button>
            <button
              onClick={() => onExport('csv')}
              className="px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Export CSV
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Collection Rate"
          value={`${Math.round(metrics.collectionRate * 100)}%`}
          trend={metrics.collectionRateTrend}
          benchmark={metrics.benchmarkComparison.collectionRate}
        />
        <MetricCard
          label="On-Time Rate"
          value={`${Math.round(metrics.onTimePaymentRate * 100)}%`}
          trend={metrics.onTimePaymentTrend}
          benchmark={metrics.benchmarkComparison.onTimePayment}
        />
        <MetricCard
          label="Total Collected"
          value={`CHF ${metrics.totalCollected.toLocaleString()}`}
        />
        <MetricCard
          label="Emergency Fund"
          value={`CHF ${metrics.emergencyFundBalance.toLocaleString()}`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Progress</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Cycle {metrics.currentCycle} of {metrics.totalCycles}
          </p>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
            <div
              className="bg-indigo-500 h-2 rounded-full"
              style={{ width: `${(metrics.currentCycle / metrics.totalCycles) * 100}%` }}
            />
          </div>
          {metrics.projectedCompletionDate && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Projected completion: {new Date(metrics.projectedCompletionDate).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Risk Indicators</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Members at Risk</span>
              <span className={`text-sm font-medium ${metrics.riskIndicators.membersAtRisk > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {metrics.riskIndicators.membersAtRisk}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Late This Month</span>
              <span className={`text-sm font-medium ${metrics.riskIndicators.latePaymentsThisMonth > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {metrics.riskIndicators.latePaymentsThisMonth}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">EF Usage</span>
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                {Math.round(metrics.riskIndicators.emergencyFundUsage * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {riskAlerts.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Risk Alerts</h4>
          <div className="space-y-2">
            {riskAlerts.map((alert, i) => (
              <div
                key={i}
                className={`rounded-lg p-3 border ${
                  alert.priority === 'high'
                    ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                    : 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800'
                }`}
              >
                <p className={`text-sm ${alert.priority === 'high' ? 'text-red-800 dark:text-red-300' : 'text-amber-800 dark:text-amber-300'}`}>
                  <span className="font-medium">{alert.memberName}:</span> {alert.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Member Reliability</h4>
        <div className="space-y-2">
          {memberReliability.map((member) => (
            <div
              key={member.memberId}
              className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700"
            >
              <div>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{member.memberName}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                  {member.totalPayments} payments, {member.latePayments} late
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${
                  member.reliabilityScore >= 0.90 ? 'text-emerald-600 dark:text-emerald-400' :
                  member.reliabilityScore >= 0.70 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {Math.round(member.reliabilityScore * 100)}%
                </span>
                <span className="text-xs text-slate-400">{trendIcon(member.trend)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {metrics.monthlyTrends.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Cycle Trends</h4>
          <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-2 pr-4">Cycle</th>
                  <th className="text-right py-2 px-4">Collection</th>
                  <th className="text-right py-2 px-4">On-Time</th>
                  <th className="text-right py-2 px-4">Collected</th>
                  <th className="text-right py-2 pl-4">Late</th>
                </tr>
              </thead>
              <tbody>
                {metrics.monthlyTrends.map((t) => (
                  <tr key={t.cycle} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-2 pr-4 text-slate-900 dark:text-white">#{t.cycle}</td>
                    <td className="py-2 px-4 text-right text-slate-700 dark:text-slate-300">{Math.round(t.collectionRate * 100)}%</td>
                    <td className="py-2 px-4 text-right text-slate-700 dark:text-slate-300">{Math.round(t.onTimeRate * 100)}%</td>
                    <td className="py-2 px-4 text-right text-slate-700 dark:text-slate-300">CHF {t.totalCollected.toLocaleString()}</td>
                    <td className="py-2 pl-4 text-right text-slate-700 dark:text-slate-300">{t.latePayments}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function MetricCard({ label, value, trend, benchmark }: {
  label: string
  value: string
  trend?: string
  benchmark?: { value: number; benchmark: number; status: string }
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
        {trend && <span className="text-sm text-slate-400">{trendIcon(trend)}</span>}
      </div>
      {benchmark && (
        <p className={`text-xs mt-1 ${benchmarkColor(benchmark.status)}`}>
          {benchmark.status === 'above' ? 'Above' : 'Below'} benchmark ({Math.round(benchmark.benchmark * 100)}%)
        </p>
      )}
    </div>
  )
}
