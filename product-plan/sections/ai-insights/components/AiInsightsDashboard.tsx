import type {
  AiInsightsDashboardProps,
  CircleRecommendation,
  CashFlowAlert,
  SavingsOpportunity,
  ContributionSuggestion,
} from '../types'

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
  }).format(amount)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// Recommendation Card Component
function RecommendationCard({
  recommendation,
  onView,
  onJoin,
  onDismiss,
}: {
  recommendation: CircleRecommendation
  onView?: () => void
  onJoin?: () => void
  onDismiss?: () => void
}) {
  const riskColors = {
    low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }

  return (
    <div className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300">
      {/* Match percentage badge */}
      <div className="absolute -top-3 -right-3 w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30">
        <span className="text-white font-bold text-sm">{recommendation.matchPercentage}%</span>
      </div>

      {/* Dismiss button */}
      <button
        onClick={onDismiss}
        className="absolute top-3 right-14 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
      >
        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="mb-4">
        <h3 className="font-semibold text-slate-900 dark:text-white text-lg pr-12">{recommendation.circleName}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Organized by {recommendation.organizerName} · Trust Score {recommendation.organizerTrustScore}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${riskColors[recommendation.riskLevel]}`}>
          {recommendation.riskLevel} risk
        </span>
        {recommendation.tags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Contribution</p>
          <p className="font-semibold text-slate-900 dark:text-white">
            {formatCurrency(recommendation.contributionAmount)}
            <span className="text-xs font-normal text-slate-500">/{recommendation.frequency.replace('_', '-')}</span>
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Members</p>
          <p className="font-semibold text-slate-900 dark:text-white">
            {recommendation.memberCount}/{recommendation.maxParticipants}
          </p>
        </div>
        <div className="col-span-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">Est. Payout Date</p>
          <p className="font-semibold text-slate-900 dark:text-white">{formatDate(recommendation.estimatedPayoutDate)}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Why it's a match</p>
        {recommendation.matchReasons.slice(0, 2).map((reason, i) => (
          <div key={i} className="flex items-start gap-2">
            <svg className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-slate-600 dark:text-slate-300">{reason}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onView}
          className="flex-1 px-4 py-2.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
        >
          View Details
        </button>
        <button
          onClick={onJoin}
          className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl hover:from-indigo-600 hover:to-indigo-700 shadow-md shadow-indigo-500/25 transition-all"
        >
          Join Circle
        </button>
      </div>
    </div>
  )
}

// Alert Card Component
function AlertCard({
  alert,
  onDismiss,
}: {
  alert: CashFlowAlert
  onDismiss?: () => void
}) {
  const severityStyles = {
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'text-blue-500',
      badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400',
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      icon: 'text-amber-500',
      badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400',
    },
    critical: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      icon: 'text-red-500',
      badge: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400',
    },
  }

  const styles = severityStyles[alert.severity]

  return (
    <div className={`${styles.bg} ${styles.border} border rounded-2xl p-5`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${styles.badge}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">{alert.title}</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {alert.daysUntilDue} days until due · {Math.round(alert.confidence * 100)}% confidence
            </p>
          </div>
        </div>
        <button onClick={onDismiss} className="p-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{alert.message}</p>

      <div className="flex items-center gap-4 mb-4 p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Shortfall</p>
          <p className="font-bold text-lg text-slate-900 dark:text-white">{formatCurrency(alert.predictedShortfall)}</p>
        </div>
        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Due Amount</p>
          <p className="font-semibold text-slate-900 dark:text-white">{formatCurrency(alert.contributionAmount)}</p>
        </div>
        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Due Date</p>
          <p className="font-semibold text-slate-900 dark:text-white">{formatDate(alert.contributionDueDate)}</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Suggested Actions</p>
        {alert.suggestedActions.map((action, i) => (
          <button
            key={i}
            className="w-full flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group"
          >
            <div className="text-left">
              <p className="text-sm font-medium text-slate-900 dark:text-white">{action.description}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{action.impact}</p>
            </div>
            <svg
              className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}

// Opportunity Card Component
function OpportunityCard({
  opportunity,
  onAct,
}: {
  opportunity: SavingsOpportunity
  onAct?: (allocation: string) => void
}) {
  const typeIcons = {
    surplus_detected: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    income_increase: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    expense_reduction: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
      </svg>
    ),
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2.5 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-xl">
          {typeIcons[opportunity.type]}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-slate-900 dark:text-white">{opportunity.title}</h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{opportunity.description}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{formatCurrency(opportunity.surplusAmount)}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{Math.round(opportunity.confidence * 100)}% confidence</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">How to use it</p>
        {opportunity.suggestions.map((suggestion, i) => (
          <button
            key={i}
            onClick={() => onAct?.(suggestion.allocation)}
            className="w-full flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-amber-200 dark:border-amber-800/50 hover:border-amber-400 dark:hover:border-amber-600 transition-colors group"
          >
            <div className="text-left">
              <p className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                {suggestion.allocation.replace(/_/g, ' ')} · {formatCurrency(suggestion.amount)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{suggestion.impact}</p>
            </div>
            <svg
              className="w-5 h-5 text-slate-400 group-hover:text-amber-500 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}

// Contribution Suggestion Card
function SuggestionCard({
  suggestion,
  onAccept,
  onDismiss,
}: {
  suggestion: ContributionSuggestion
  onAccept?: () => void
  onDismiss?: () => void
}) {
  if (suggestion.status !== 'pending') return null

  const isIncrease = suggestion.changePercent > 0

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl ${
              isIncrease
                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isIncrease ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'}
              />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">
              {isIncrease ? 'Increase' : 'Decrease'} contribution suggestion
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {Math.round(suggestion.confidence * 100)}% confidence
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 line-through">{formatCurrency(suggestion.currentAmount)}</span>
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
              {formatCurrency(suggestion.suggestedAmount)}
            </span>
          </div>
          <p className="text-xs text-slate-500">{suggestion.changePercent > 0 ? '+' : ''}{suggestion.changePercent}% change</p>
        </div>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
        {suggestion.reasoning}
      </p>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
          <p className="text-xs text-slate-500 dark:text-slate-400">Monthly Income</p>
          <p className="font-semibold text-slate-900 dark:text-white">
            {formatCurrency(suggestion.incomePatterns.averageMonthlyIncome)}
          </p>
        </div>
        <div className="text-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
          <p className="text-xs text-slate-500 dark:text-slate-400">Income Trend</p>
          <p className="font-semibold text-slate-900 dark:text-white capitalize">{suggestion.incomePatterns.recentTrend}</p>
        </div>
        <div className="text-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
          <p className="text-xs text-slate-500 dark:text-slate-400">Affordability</p>
          <p className="font-semibold text-slate-900 dark:text-white">{Math.round(suggestion.affordabilityScore * 100)}%</p>
        </div>
      </div>

      <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl mb-4">
        <p className="text-sm text-indigo-700 dark:text-indigo-300">
          <span className="font-semibold">Impact:</span> {suggestion.impactProjection.goalAcceleration}
          {suggestion.impactProjection.additionalSavingsPerYear !== 0 && (
            <> ({suggestion.impactProjection.additionalSavingsPerYear > 0 ? '+' : ''}
            {formatCurrency(suggestion.impactProjection.additionalSavingsPerYear)}/year)</>
          )}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onDismiss}
          className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        >
          Dismiss
        </button>
        <button
          onClick={onAccept}
          className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl hover:from-indigo-600 hover:to-indigo-700 shadow-md shadow-indigo-500/25 transition-all"
        >
          Accept Suggestion
        </button>
      </div>
    </div>
  )
}

// Portfolio Summary Card
function PortfolioSummary({ insights }: { insights: AiInsightsDashboardProps['crossCircleInsights'] }) {
  const { summary, circleBreakdown, projectedPayouts2026 } = insights

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Portfolio Overview</h3>
        <span className="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-full">
          {summary.totalCircles} circles
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-900/10 rounded-xl">
          <p className="text-xs text-indigo-600 dark:text-indigo-400 mb-1">Monthly Contribution</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(summary.totalMonthlyContribution)}</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-900/10 rounded-xl">
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">Total Contributed</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(summary.totalContributedAllTime)}</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-900/10 rounded-xl">
          <p className="text-xs text-amber-600 dark:text-amber-400 mb-1">Payouts Received</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(summary.totalPayoutValue)}</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-900/10 rounded-xl">
          <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">Trust Score</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{summary.overallTrustScore}</p>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Your Circles</h4>
        <div className="space-y-3">
          {circleBreakdown.map((circle) => (
            <div
              key={circle.circleId}
              className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                  #{circle.position}
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{circle.circleName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formatCurrency(circle.contribution)}/{circle.frequency.replace('_', '-')} · Health {circle.healthScore}%
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-900 dark:text-white">{formatDate(circle.nextPayoutDate)}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Next payout</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Upcoming Payouts</h4>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {projectedPayouts2026.map((payout) => {
            const circle = circleBreakdown.find((c) => c.circleId === payout.circleId)
            return (
              <div
                key={payout.circleId}
                className="flex-shrink-0 p-3 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-900/10 border border-emerald-200 dark:border-emerald-800/50 rounded-xl"
              >
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">{formatDate(payout.date)}</p>
                <p className="font-bold text-slate-900 dark:text-white">{formatCurrency(payout.amount)}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[120px]">{circle?.circleName}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Seasonal Patterns Chart
function SeasonalPatternsChart({ patterns }: { patterns: AiInsightsDashboardProps['seasonalPatterns'] }) {
  const maxIncome = Math.max(...patterns.monthlyTrends.map((t) => t.income))

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Seasonal Patterns</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Based on {patterns.dataMonths} months of data</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-indigo-500" />
            <span className="text-slate-600 dark:text-slate-400">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-slate-600 dark:text-slate-400">Spending</span>
          </div>
        </div>
      </div>

      <div className="h-48 flex items-end gap-1 mb-4">
        {patterns.monthlyTrends.map((trend) => (
          <div key={trend.month} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex gap-0.5 items-end" style={{ height: '160px' }}>
              <div
                className="flex-1 bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-sm"
                style={{ height: `${(trend.income / maxIncome) * 100}%` }}
              />
              <div
                className="flex-1 bg-gradient-to-t from-amber-500 to-amber-400 rounded-t-sm"
                style={{ height: `${(trend.spending / maxIncome) * 100}%` }}
              />
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">{trend.month}</span>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Key Insights</h4>
        {patterns.patterns.map((pattern, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
            <div
              className={`p-2 rounded-lg ${
                pattern.type.includes('high') || pattern.type.includes('spike')
                  ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                  : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    pattern.type.includes('high') || pattern.type.includes('spike')
                      ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
                      : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'
                  }
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">{pattern.description}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{pattern.recommendation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AiInsightsDashboard({
  circleRecommendations,
  cashFlowAlerts,
  savingsOpportunities,
  contributionSuggestions,
  seasonalPatterns,
  crossCircleInsights,
  onViewRecommendation,
  onJoinCircle,
  onDismissRecommendation,
  onAcceptSuggestion,
  onDismissSuggestion,
  onDismissAlert,
  onActOnOpportunity,
}: AiInsightsDashboardProps) {
  const activeAlerts = cashFlowAlerts.filter((a) => a.status === 'active')
  const pendingSuggestions = contributionSuggestions.filter((s) => s.status === 'pending')
  const pendingOpportunities = savingsOpportunities.filter((o) => o.status === 'pending' || o.status === 'viewed')

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">AI Insights</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Personalized recommendations and predictive analytics</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          AI Settings
        </button>
      </div>

      {/* Alerts Section */}
      {activeAlerts.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Cash Flow Alerts
            <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
              {activeAlerts.length}
            </span>
          </h2>
          <div className="space-y-4">
            {activeAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} onDismiss={() => onDismissAlert?.(alert.id)} />
            ))}
          </div>
        </section>
      )}

      {/* Contribution Suggestions */}
      {pendingSuggestions.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Smart Suggestions
          </h2>
          <div className="space-y-4">
            {pendingSuggestions.map((suggestion) => (
              <SuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                onAccept={() => onAcceptSuggestion?.(suggestion.id)}
                onDismiss={() => onDismissSuggestion?.(suggestion.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Savings Opportunities */}
      {pendingOpportunities.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Savings Opportunities
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {pendingOpportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                onAct={(allocation) => onActOnOpportunity?.(opportunity.id, allocation)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Portfolio & Patterns */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PortfolioSummary insights={crossCircleInsights} />
        <SeasonalPatternsChart patterns={seasonalPatterns} />
      </div>

      {/* Circle Recommendations */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Recommended Circles
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {circleRecommendations.map((rec) => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              onView={() => onViewRecommendation?.(rec.circleId)}
              onJoin={() => onJoinCircle?.(rec.circleId)}
              onDismiss={() => onDismissRecommendation?.(rec.id)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
