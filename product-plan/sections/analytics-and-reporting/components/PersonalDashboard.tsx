import type { PersonalDashboardProps, CircleParticipation, AIInsight } from '../types'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Target,
  ChevronRight,
  Download,
  Sparkles,
  ArrowUpRight,
  CircleDollarSign,
  PiggyBank,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info,
  Lightbulb
} from 'lucide-react'

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' }).format(amount)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatMonth(monthString: string): string {
  const [year, month] = monthString.split('-')
  return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { month: 'short' })
}

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'stable' }) {
  if (trend === 'up') return <TrendingUp className="w-4 h-4 text-emerald-500" />
  if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />
  return <Minus className="w-4 h-4 text-slate-400" />
}

function InsightIcon({ priority }: { priority: AIInsight['priority'] }) {
  switch (priority) {
    case 'positive':
      return <CheckCircle2 className="w-5 h-5 text-emerald-500" />
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-amber-500" />
    case 'suggestion':
      return <Lightbulb className="w-5 h-5 text-indigo-500" />
    default:
      return <Info className="w-5 h-5 text-slate-400" />
  }
}

function ContributionChart({ history }: { history: PersonalDashboardProps['contributionHistory'] }) {
  const maxAmount = Math.max(...history.map(h => h.amount))
  const recentHistory = history.slice(-12)

  return (
    <div className="flex items-end gap-1 h-24">
      {recentHistory.map((item, index) => {
        const height = (item.amount / maxAmount) * 100
        return (
          <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={`w-full rounded-t transition-all ${
                item.onTime
                  ? 'bg-gradient-to-t from-indigo-600 to-indigo-400'
                  : 'bg-gradient-to-t from-amber-500 to-amber-300'
              }`}
              style={{ height: `${height}%` }}
              title={`${formatMonth(item.month)}: ${formatCurrency(item.amount)}`}
            />
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              {formatMonth(item.month)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function CircleCard({
  circle,
  onView
}: {
  circle: CircleParticipation
  onView?: () => void
}) {
  const progress = (circle.currentCycle / circle.totalCycles) * 100

  return (
    <button
      onClick={onView}
      className="w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {circle.circleName}
          </h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">{circle.associationName}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">Progress</span>
          <span className="font-medium text-slate-700 dark:text-slate-300">
            Cycle {circle.currentCycle} of {circle.totalCycles}
          </span>
        </div>

        <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              circle.payoutReceived
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
            }`}>
              Position #{circle.myPosition}
            </span>
            {circle.payoutReceived && (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            )}
          </div>
          <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
            {formatCurrency(circle.contributionAmount)}/mo
          </span>
        </div>
      </div>
    </button>
  )
}

export function PersonalDashboard({
  currentUser,
  dashboard,
  contributionHistory,
  upcomingPayouts,
  circleParticipations,
  aiInsights,
  onViewCircle,
  onInsightAction,
  onDownloadStatement
}: PersonalDashboardProps) {
  const daysUntilPayout = Math.ceil(
    (new Date(dashboard.nextPayoutDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Welcome back, {currentUser.name.split(' ')[0]}
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Here's your savings overview
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Savings */}
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-5 text-white shadow-lg shadow-indigo-500/20">
            <div className="flex items-center justify-between mb-3">
              <PiggyBank className="w-8 h-8 opacity-80" />
              <span className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" />
                +{dashboard.savingsGrowthPercent}%
              </span>
            </div>
            <p className="text-indigo-100 text-sm mb-1">Total Savings</p>
            <p className="text-3xl font-bold">{formatCurrency(dashboard.totalSavings)}</p>
          </div>

          {/* Net Savings This Year */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <CircleDollarSign className="w-8 h-8 text-emerald-500" />
              <TrendIcon trend={dashboard.trustScoreTrend} />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Net Savings (2025)</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(dashboard.netSavingsThisYear)}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              vs {formatCurrency(dashboard.comparedToPreviousYear.netSavings)} last year
            </p>
          </div>

          {/* Trust Score */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <Target className="w-8 h-8 text-amber-500" />
              <span className={`flex items-center gap-1 text-sm px-2 py-1 rounded-full ${
                dashboard.trustScoreTrend === 'up'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
              }`}>
                {dashboard.trustScoreTrend === 'up' ? '+' : ''}{dashboard.trustScoreChange}
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Trust Score</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {currentUser.trustScore}
              <span className="text-sm font-normal text-slate-400">/1000</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {dashboard.onTimePaymentRate}% on-time payments
            </p>
          </div>

          {/* Next Payout */}
          <div className="bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl p-5 text-white shadow-lg shadow-amber-500/20">
            <div className="flex items-center justify-between mb-3">
              <Calendar className="w-8 h-8 opacity-80" />
              <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                {daysUntilPayout} days
              </span>
            </div>
            <p className="text-amber-100 text-sm mb-1">Next Payout</p>
            <p className="text-3xl font-bold">{formatCurrency(dashboard.nextPayoutAmount)}</p>
            <p className="text-xs text-amber-100 mt-1">{dashboard.nextPayoutCircle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contribution History Chart */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Contribution History
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Last 12 months</p>
                </div>
                <button
                  onClick={() => onDownloadStatement?.('annual')}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
              <ContributionChart history={contributionHistory} />
              <div className="flex items-center gap-4 mt-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-indigo-500" /> On-time
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-amber-500" /> Late
                </span>
              </div>
            </div>

            {/* Active Circles */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    My Circles
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {dashboard.activeCircles} active, {dashboard.completedCircles} completed
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {circleParticipations.map(circle => (
                  <CircleCard
                    key={circle.circleId}
                    circle={circle}
                    onView={() => onViewCircle?.(circle.circleId)}
                  />
                ))}
              </div>
            </div>

            {/* Upcoming Payouts */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Upcoming Payouts
              </h2>
              <div className="space-y-3">
                {upcomingPayouts.map((payout, index) => (
                  <div
                    key={payout.id}
                    className={`flex items-center justify-between p-4 rounded-xl ${
                      index === 0
                        ? 'bg-gradient-to-r from-indigo-50 to-amber-50 dark:from-indigo-900/20 dark:to-amber-900/20 border border-indigo-100 dark:border-indigo-800'
                        : 'bg-slate-50 dark:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        index === 0
                          ? 'bg-indigo-100 dark:bg-indigo-900/50'
                          : 'bg-slate-200 dark:bg-slate-600'
                      }`}>
                        <Clock className={`w-5 h-5 ${
                          index === 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {payout.circleName}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Position {payout.position} of {payout.totalPositions} • {formatDate(payout.scheduledDate)}
                        </p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                      {formatCurrency(payout.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - AI Insights */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    AI Insights
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Personalized recommendations
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {aiInsights.map(insight => (
                  <div
                    key={insight.id}
                    className={`p-4 rounded-xl border ${
                      insight.priority === 'positive'
                        ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800'
                        : insight.priority === 'warning'
                        ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800'
                        : insight.priority === 'suggestion'
                        ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800'
                        : 'bg-slate-50 border-slate-200 dark:bg-slate-700/50 dark:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <InsightIcon priority={insight.priority} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 dark:text-white text-sm">
                          {insight.title}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                          {insight.description}
                        </p>
                        {insight.actionable && insight.action && (
                          <button
                            onClick={() => onInsightAction?.(insight)}
                            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                          >
                            {insight.action.label}
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                Year-over-Year
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Contributions</span>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(dashboard.totalContributions)}
                    </p>
                    <p className="text-xs text-emerald-500">
                      +{Math.round((dashboard.totalContributions / dashboard.comparedToPreviousYear.contributions - 1) * 100)}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Payouts Received</span>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(dashboard.totalPayoutsReceived)}
                    </p>
                    <p className="text-xs text-emerald-500">
                      +{Math.round((dashboard.totalPayoutsReceived / dashboard.comparedToPreviousYear.payouts - 1) * 100)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
