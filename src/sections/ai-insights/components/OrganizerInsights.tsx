import type {
  RiskAssessmentProps,
  MemberRiskScore,
  CircleHealthScore,
  ChurnWarning,
  ConfigurationSuggestion,
  PayoutOrderRecommendation,
} from '@/../product/sections/ai-insights/types'

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

// Risk Score Gauge Component
function RiskGauge({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: { width: 60, stroke: 6 },
    md: { width: 80, stroke: 8 },
    lg: { width: 100, stroke: 10 },
  }
  const { width, stroke } = sizes[size]
  const radius = (width - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (score / 100) * circumference

  const getColor = () => {
    if (score <= 35) return { stroke: '#10b981', bg: 'emerald' }
    if (score <= 65) return { stroke: '#f59e0b', bg: 'amber' }
    return { stroke: '#ef4444', bg: 'red' }
  }

  const color = getColor()

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={width} height={width} className="transform -rotate-90">
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-slate-200 dark:text-slate-700"
        />
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke={color.stroke}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className="transition-all duration-500"
        />
      </svg>
      <span
        className={`absolute font-bold ${
          size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg' : 'text-xl'
        } text-slate-900 dark:text-white`}
      >
        {score}
      </span>
    </div>
  )
}

// Member Risk Card
function MemberRiskCard({
  member,
  onApprove,
  onDeny,
  onRequestInfo,
}: {
  member: MemberRiskScore
  onApprove?: () => void
  onDeny?: () => void
  onRequestInfo?: () => void
}) {
  const recommendationStyles = {
    approve: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-800',
    },
    review: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      text: 'text-amber-700 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800',
    },
    deny: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      text: 'text-red-700 dark:text-red-400',
      border: 'border-red-200 dark:border-red-800',
    },
  }

  const style = recommendationStyles[member.recommendation]

  return (
    <div className={`${style.bg} ${style.border} border rounded-2xl p-5`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <RiskGauge score={member.riskScore} />
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">{member.applicantName}</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Applying to {member.circleName}
            </p>
            <span className={`inline-block mt-1 px-2.5 py-0.5 text-xs font-medium rounded-full ${style.text} ${style.bg}`}>
              {member.recommendation === 'approve' ? '✓ Recommend Approve' :
               member.recommendation === 'review' ? '⚠ Needs Review' : '✕ Recommend Deny'}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 dark:text-slate-400">Confidence</p>
          <p className="font-semibold text-slate-900 dark:text-white">{Math.round(member.confidence * 100)}%</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Risk Factors</p>
        {member.factors.map((factor, i) => (
          <div key={i} className="flex items-center justify-between p-2.5 bg-white/50 dark:bg-slate-800/50 rounded-xl">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{factor.name}</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{factor.score}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    factor.score >= 80 ? 'bg-emerald-500' : factor.score >= 50 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${factor.score}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{factor.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-300 p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl mb-4">
        <span className="font-medium">Comparison:</span> {member.similarMemberComparison}
      </p>

      <div className="flex gap-2">
        {member.recommendation === 'approve' ? (
          <>
            <button
              onClick={onApprove}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl hover:from-emerald-600 hover:to-emerald-700 shadow-md shadow-emerald-500/25 transition-all"
            >
              Approve Member
            </button>
            <button
              onClick={onRequestInfo}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Request Info
            </button>
          </>
        ) : member.recommendation === 'review' ? (
          <>
            <button
              onClick={onRequestInfo}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl hover:from-amber-600 hover:to-amber-700 shadow-md shadow-amber-500/25 transition-all"
            >
              Request More Info
            </button>
            <button
              onClick={onApprove}
              className="px-4 py-2.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
            >
              Approve
            </button>
            <button
              onClick={onDeny}
              className="px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
            >
              Deny
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onDeny}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:from-red-600 hover:to-red-700 shadow-md shadow-red-500/25 transition-all"
            >
              Deny Application
            </button>
            <button
              onClick={onRequestInfo}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Request Info
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// Circle Health Card
function CircleHealthCard({ health }: { health: CircleHealthScore }) {
  const levelStyles = {
    excellent: { color: 'emerald', label: 'Excellent' },
    good: { color: 'indigo', label: 'Good' },
    fair: { color: 'amber', label: 'Fair' },
    poor: { color: 'red', label: 'Poor' },
  }

  const trendIcons = {
    improving: (
      <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    ),
    stable: (
      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
      </svg>
    ),
    declining: (
      <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    ),
  }

  const style = levelStyles[health.healthLevel]

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white">{health.circleName}</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">Last analyzed {formatDate(health.analysisDate)}</p>
        </div>
        <div className="flex items-center gap-2">
          {trendIcons[health.trend]}
          <div className="text-right">
            <p className={`text-2xl font-bold text-${style.color}-600 dark:text-${style.color}-400`}>{health.healthScore}</p>
            <p className={`text-xs font-medium text-${style.color}-600 dark:text-${style.color}-400`}>{style.label}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="text-center p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
          <p className="text-xs text-slate-500 dark:text-slate-400">Collection</p>
          <p className="font-semibold text-slate-900 dark:text-white">{Math.round(health.metrics.collectionRate * 100)}%</p>
        </div>
        <div className="text-center p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
          <p className="text-xs text-slate-500 dark:text-slate-400">On-Time</p>
          <p className="font-semibold text-slate-900 dark:text-white">{Math.round(health.metrics.onTimePaymentRate * 100)}%</p>
        </div>
        <div className="text-center p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
          <p className="text-xs text-slate-500 dark:text-slate-400">Engagement</p>
          <p className="font-semibold text-slate-900 dark:text-white">{Math.round(health.metrics.memberEngagement * 100)}%</p>
        </div>
      </div>

      {health.strengths.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Strengths</p>
          <div className="space-y-1">
            {health.strengths.slice(0, 2).map((strength, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-slate-600 dark:text-slate-300">{strength}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {health.improvements.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Areas to Improve</p>
          <div className="space-y-2">
            {health.improvements.slice(0, 2).map((improvement, i) => (
              <div key={i} className="p-2.5 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{improvement.area}</span>
                  <span className="text-xs text-amber-600 dark:text-amber-400">
                    {Math.round(improvement.currentValue * 100)}% → {Math.round(improvement.targetValue * 100)}%
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{improvement.suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {health.riskFactors.length > 0 && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl">
          <p className="text-xs font-medium text-red-700 dark:text-red-400 mb-1">⚠ Risk Factors</p>
          {health.riskFactors.map((risk, i) => (
            <p key={i} className="text-sm text-red-600 dark:text-red-300">{risk}</p>
          ))}
        </div>
      )}
    </div>
  )
}

// Churn Warning Card
function ChurnWarningCard({
  warning,
  onView,
  onAct,
}: {
  warning: ChurnWarning
  onView?: () => void
  onAct?: (action: string) => void
}) {
  const levelStyles = {
    low: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800',
    medium: 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800',
    high: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
  }

  const typeLabels = {
    likely_to_leave: 'At Risk of Leaving',
    likely_to_default: 'At Risk of Default',
  }

  return (
    <div className={`${levelStyles[warning.riskLevel]} border rounded-2xl p-5`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${
            warning.riskLevel === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400' :
            warning.riskLevel === 'medium' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400' :
            'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400'
          }`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">{warning.memberName}</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">{warning.circleName}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{Math.round(warning.churnRisk * 100)}%</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">churn risk</p>
        </div>
      </div>

      <div className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium mb-4 ${
        warning.warningType === 'likely_to_leave' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
      }`}>
        {typeLabels[warning.warningType]}
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Warning Indicators</p>
        {warning.indicators.map((indicator, i) => (
          <div key={i} className="flex items-start gap-2 p-2.5 bg-white/50 dark:bg-slate-800/50 rounded-xl">
            <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{indicator.signal}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{indicator.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {warning.suggestedActions.map((action, i) => (
          <button
            key={i}
            onClick={() => onAct?.(action.action)}
            className={`px-3 py-2 text-sm font-medium rounded-xl transition-colors ${
              action.priority === 'high'
                ? 'text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-md shadow-indigo-500/25'
                : 'text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {action.description}
          </button>
        ))}
        <button
          onClick={onView}
          className="px-3 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
        >
          View Details →
        </button>
      </div>
    </div>
  )
}

// Configuration Suggestion Card
function ConfigSuggestionCard({
  suggestion,
  onApply,
}: {
  suggestion: ConfigurationSuggestion
  onApply?: () => void
}) {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-900/10 border border-indigo-200 dark:border-indigo-800/50 rounded-2xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white">{suggestion.title}</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">{suggestion.basedOn}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 dark:text-slate-400">Predicted Success</p>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {Math.round(suggestion.predictedSuccessRate * 100)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-xl">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Contribution</p>
          <p className="font-semibold text-slate-900 dark:text-white">
            {formatCurrency(suggestion.suggestions.contributionAmount.recommended)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Range: {formatCurrency(suggestion.suggestions.contributionAmount.range?.min || 0)} - {formatCurrency(suggestion.suggestions.contributionAmount.range?.max || 0)}
          </p>
        </div>
        <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-xl">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Frequency</p>
          <p className="font-semibold text-slate-900 dark:text-white capitalize">
            {suggestion.suggestions.frequency.recommended.replace('_', '-')}
          </p>
        </div>
        <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-xl">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Member Count</p>
          <p className="font-semibold text-slate-900 dark:text-white">
            {suggestion.suggestions.memberCount.recommended} members
          </p>
        </div>
        <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-xl">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Payout Method</p>
          <p className="font-semibold text-slate-900 dark:text-white capitalize">
            {suggestion.suggestions.payoutMethod.recommended.replace('_', ' ')}
          </p>
        </div>
      </div>

      <button
        onClick={onApply}
        className="w-full px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl hover:from-indigo-600 hover:to-indigo-700 shadow-md shadow-indigo-500/25 transition-all"
      >
        Apply Configuration
      </button>
    </div>
  )
}

// Payout Order Card
function PayoutOrderCard({
  recommendation,
  onAccept,
  onModify,
}: {
  recommendation: PayoutOrderRecommendation
  onAccept?: () => void
  onModify?: (newOrder: string[]) => void
}) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white">{recommendation.circleName}</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Cycle {recommendation.cycleNumber} · {recommendation.totalMembers} members
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 dark:text-slate-400">Fairness Score</p>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {Math.round(recommendation.fairnessScore * 100)}%
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Recommended Order</p>
        {recommendation.recommendedOrder.slice(0, 3).map((pos) => (
          <div key={pos.memberId} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              {pos.position}
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-900 dark:text-white">{pos.memberName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Need score: {Math.round(pos.needScore * 100)}%
                {pos.suggestedDiscount > 0 && ` · ${Math.round(pos.suggestedDiscount * 100)}% discount`}
              </p>
            </div>
          </div>
        ))}
        {recommendation.recommendedOrder.length > 3 && (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-2">
            +{recommendation.recommendedOrder.length - 3} more members
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onAccept}
          className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl hover:from-indigo-600 hover:to-indigo-700 shadow-md shadow-indigo-500/25 transition-all"
        >
          Accept Order
        </button>
        <button
          onClick={() => onModify?.(recommendation.recommendedOrder.map((p) => p.memberId))}
          className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        >
          Modify
        </button>
      </div>
    </div>
  )
}

export function OrganizerInsights({
  memberRiskScores,
  circleHealthScores,
  churnWarnings,
  configurationSuggestions,
  payoutOrderRecommendations,
  onApproveMember,
  onDenyMember,
  onRequestMoreInfo,
  onViewChurnWarning,
  onActOnChurnWarning,
  onApplyConfiguration,
  onAcceptPayoutOrder,
  onModifyPayoutOrder,
}: RiskAssessmentProps) {
  const activeChurnWarnings = churnWarnings.filter((w) => w.status === 'active')
  const pendingPayoutOrders = payoutOrderRecommendations.filter((r) => r.status === 'pending_vote')

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Organizer Insights</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Risk assessment and circle management tools</p>
      </div>

      {/* Member Risk Scores */}
      {memberRiskScores.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Membership Applications
            <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-full">
              {memberRiskScores.length}
            </span>
          </h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {memberRiskScores.map((member) => (
              <MemberRiskCard
                key={member.id}
                member={member}
                onApprove={() => onApproveMember?.(member.applicantId, member.circleId)}
                onDeny={() => onDenyMember?.(member.applicantId, member.circleId)}
                onRequestInfo={() => onRequestMoreInfo?.(member.applicantId, member.circleId)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Circle Health Scores */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Circle Health
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          {circleHealthScores.map((health) => (
            <CircleHealthCard key={health.id} health={health} />
          ))}
        </div>
      </section>

      {/* Churn Warnings */}
      {activeChurnWarnings.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Churn Warnings
            <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
              {activeChurnWarnings.length}
            </span>
          </h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {activeChurnWarnings.map((warning) => (
              <ChurnWarningCard
                key={warning.id}
                warning={warning}
                onView={() => onViewChurnWarning?.(warning.id)}
                onAct={(action) => onActOnChurnWarning?.(warning.id, action)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Configuration Suggestions & Payout Orders */}
      <div className="grid gap-6 lg:grid-cols-2">
        {configurationSuggestions.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Configuration Tips
            </h2>
            <div className="space-y-4">
              {configurationSuggestions.map((suggestion) => (
                <ConfigSuggestionCard
                  key={suggestion.id}
                  suggestion={suggestion}
                  onApply={() => onApplyConfiguration?.(suggestion.id)}
                />
              ))}
            </div>
          </section>
        )}

        {pendingPayoutOrders.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Payout Order Recommendations
            </h2>
            <div className="space-y-4">
              {pendingPayoutOrders.map((recommendation) => (
                <PayoutOrderCard
                  key={recommendation.id}
                  recommendation={recommendation}
                  onAccept={() => onAcceptPayoutOrder?.(recommendation.id)}
                  onModify={(newOrder) => onModifyPayoutOrder?.(recommendation.id, newOrder)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
