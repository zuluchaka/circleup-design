import type {
  FraudAnalyticsProps,
  FraudAlert,
  BehaviorCluster,
} from '@/../product/sections/ai-insights/types'

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
  }).format(amount)
}

// Fraud Alert Card
function FraudAlertCard({
  alert,
  onInvestigate,
  onResolve,
  onEscalate,
}: {
  alert: FraudAlert
  onInvestigate?: () => void
  onResolve?: (resolution: 'confirmed' | 'false_positive') => void
  onEscalate?: (team: string) => void
}) {
  const severityStyles = {
    low: {
      bg: 'bg-slate-50 dark:bg-slate-800',
      border: 'border-slate-200 dark:border-slate-700',
      badge: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
      icon: 'text-slate-500',
    },
    medium: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400',
      icon: 'text-amber-500',
    },
    high: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-orange-200 dark:border-orange-800',
      badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400',
      icon: 'text-orange-500',
    },
    critical: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      badge: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400',
      icon: 'text-red-500',
    },
  }

  const alertTypeLabels = {
    account_takeover_attempt: 'Account Takeover Attempt',
    synthetic_identity: 'Synthetic Identity',
    unusual_transaction: 'Unusual Transaction',
    suspicious_pattern: 'Suspicious Pattern',
  }

  const statusLabels = {
    new: { label: 'New', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400' },
    investigating: { label: 'Investigating', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400' },
    pending_review: { label: 'Pending Review', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400' },
    monitoring: { label: 'Monitoring', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-400' },
    resolved: { label: 'Resolved', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' },
    false_positive: { label: 'False Positive', color: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400' },
  }

  const style = severityStyles[alert.severity]
  const statusStyle = statusLabels[alert.status]

  return (
    <div className={`${style.bg} ${style.border} border rounded-2xl p-5`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${style.badge}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${style.badge}`}>
                {alert.severity.toUpperCase()}
              </span>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusStyle.color}`}>
                {statusStyle.label}
              </span>
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white">{alertTypeLabels[alert.alertType]}</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {alert.userName} · {formatDate(alert.detectedAt)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 dark:text-slate-400">Risk Score</p>
          <p className={`text-2xl font-bold ${
            alert.riskScore >= 0.8 ? 'text-red-600 dark:text-red-400' :
            alert.riskScore >= 0.6 ? 'text-amber-600 dark:text-amber-400' :
            'text-slate-900 dark:text-white'
          }`}>
            {Math.round(alert.riskScore * 100)}%
          </p>
        </div>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{alert.description}</p>

      <div className="space-y-2 mb-4">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Anomalies Detected</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {alert.anomalies.map((anomaly, i) => (
            <div key={i} className="flex items-start gap-2 p-2.5 bg-white/50 dark:bg-slate-800/50 rounded-xl">
              <span className={`px-1.5 py-0.5 text-xs font-medium rounded ${
                anomaly.type === 'location' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400' :
                anomaly.type === 'device' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400' :
                anomaly.type === 'behavior' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400' :
                anomaly.type === 'document' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400' :
                'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400'
              }`}>
                {anomaly.type}
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 flex-1">{anomaly.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {alert.automatedActions.length > 0 && (
        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl">
          <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-2">✓ Automated Actions Taken</p>
          <ul className="space-y-1">
            {alert.automatedActions.map((action, i) => (
              <li key={i} className="text-sm text-emerald-600 dark:text-emerald-300 flex items-center gap-2">
                <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {action}
              </li>
            ))}
          </ul>
        </div>
      )}

      {alert.recommendedActions.length > 0 && (
        <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/50 rounded-xl">
          <p className="text-xs font-medium text-indigo-700 dark:text-indigo-400 mb-2">Recommended Actions</p>
          <ul className="space-y-1">
            {alert.recommendedActions.map((action, i) => (
              <li key={i} className="text-sm text-indigo-600 dark:text-indigo-300 flex items-center gap-2">
                <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {action}
              </li>
            ))}
          </ul>
        </div>
      )}

      {alert.assignedTo && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Assigned to: <span className="font-medium text-slate-700 dark:text-slate-300">{alert.assignedTo}</span>
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {alert.status !== 'resolved' && alert.status !== 'false_positive' && (
          <>
            {alert.status === 'new' && (
              <button
                onClick={onInvestigate}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl hover:from-indigo-600 hover:to-indigo-700 shadow-md shadow-indigo-500/25 transition-all"
              >
                Start Investigation
              </button>
            )}
            <button
              onClick={() => onResolve?.('confirmed')}
              className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
            >
              Confirm Fraud
            </button>
            <button
              onClick={() => onResolve?.('false_positive')}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Mark False Positive
            </button>
            <button
              onClick={() => onEscalate?.('security-team')}
              className="px-4 py-2 text-sm font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
            >
              Escalate
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// Behavior Cluster Card
function BehaviorClusterCard({
  cluster,
  onViewDetails,
  onExport,
}: {
  cluster: BehaviorCluster
  onViewDetails?: () => void
  onExport?: () => void
}) {
  const engagementColors = {
    low: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400',
    moderate: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400',
    high: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400',
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white">{cluster.name}</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">{cluster.description}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {cluster.memberCount.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {Math.round(cluster.percentageOfTotal * 100)}% of users
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="text-center p-2.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
          <p className="text-xs text-slate-500 dark:text-slate-400">Trust Score</p>
          <p className="font-bold text-slate-900 dark:text-white">{cluster.characteristics.averageTrustScore}</p>
        </div>
        <div className="text-center p-2.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
          <p className="text-xs text-slate-500 dark:text-slate-400">On-Time Rate</p>
          <p className="font-bold text-slate-900 dark:text-white">
            {Math.round(cluster.characteristics.onTimePaymentRate * 100)}%
          </p>
        </div>
        <div className="text-center p-2.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
          <p className="text-xs text-slate-500 dark:text-slate-400">Churn Rate</p>
          <p className={`font-bold ${
            cluster.characteristics.churnRate > 0.2 ? 'text-red-600 dark:text-red-400' :
            cluster.characteristics.churnRate > 0.1 ? 'text-amber-600 dark:text-amber-400' :
            'text-emerald-600 dark:text-emerald-400'
          }`}>
            {Math.round(cluster.characteristics.churnRate * 100)}%
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg. Monthly Contribution</p>
          <p className="font-semibold text-slate-900 dark:text-white">
            {formatCurrency(cluster.characteristics.averageMonthlyContribution)}
          </p>
        </div>
        <div className="flex-1">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg. Circles</p>
          <p className="font-semibold text-slate-900 dark:text-white">
            {cluster.characteristics.averageCircles.toFixed(1)}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Engagement</p>
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${engagementColors[cluster.characteristics.engagementLevel]}`}>
            {cluster.characteristics.engagementLevel}
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Typical Behaviors</p>
          <div className="flex flex-wrap gap-1.5">
            {cluster.typicalBehaviors.map((behavior, i) => (
              <span key={i} className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full">
                {behavior}
              </span>
            ))}
          </div>
        </div>

        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
          <p className="text-xs font-medium text-indigo-700 dark:text-indigo-400 mb-1">Recommended Approach</p>
          <p className="text-sm text-indigo-600 dark:text-indigo-300">{cluster.recommendedApproach}</p>
        </div>

        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Conversion Opportunities</p>
          <div className="flex flex-wrap gap-1.5">
            {cluster.conversionOpportunities.map((opportunity, i) => (
              <span key={i} className="px-2.5 py-1 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full">
                {opportunity}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onViewDetails}
          className="flex-1 px-4 py-2.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
        >
          View Members
        </button>
        <button
          onClick={onExport}
          className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        >
          Export Data
        </button>
      </div>
    </div>
  )
}

// Stats Overview Card
function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend
}: {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: { value: number; label: string }
}) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2.5 bg-slate-100 dark:bg-slate-700 rounded-xl text-slate-600 dark:text-slate-400">
          {icon}
        </div>
        {trend && (
          <span className={`flex items-center gap-1 text-xs font-medium ${
            trend.value >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {trend.value >= 0 ? (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
            {Math.abs(trend.value)}% {trend.label}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtitle}</p>}
    </div>
  )
}

export function FraudAnalytics({
  fraudAlerts,
  behaviorClusters,
  onInvestigateAlert,
  onResolveAlert,
  onEscalateAlert,
  onViewClusterDetails,
  onExportClusterData,
}: FraudAnalyticsProps) {
  const activeAlerts = fraudAlerts.filter(
    (a) => !['resolved', 'false_positive'].includes(a.status)
  )
  const criticalAlerts = fraudAlerts.filter((a) => a.severity === 'critical' && !['resolved', 'false_positive'].includes(a.status))
  const totalMembers = behaviorClusters.reduce((sum, c) => sum + c.memberCount, 0)
  const atRiskCluster = behaviorClusters.find((c) => c.name.toLowerCase().includes('risk'))

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Fraud & Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Platform-wide fraud detection and member behavior analysis</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Active Alerts"
          value={activeAlerts.length}
          subtitle={`${criticalAlerts.length} critical`}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
        />
        <StatsCard
          title="Total Members"
          value={totalMembers.toLocaleString()}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Behavior Segments"
          value={behaviorClusters.length}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          }
        />
        <StatsCard
          title="At-Risk Members"
          value={atRiskCluster?.memberCount.toLocaleString() || '0'}
          subtitle={atRiskCluster ? `${Math.round(atRiskCluster.percentageOfTotal * 100)}% of total` : undefined}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{criticalAlerts.length} Critical Alert{criticalAlerts.length > 1 ? 's' : ''} Require Immediate Attention</h3>
              <p className="text-white/80 text-sm">Review and resolve these high-priority security incidents</p>
            </div>
            <button className="px-4 py-2 bg-white text-red-600 font-medium rounded-xl hover:bg-white/90 transition-colors">
              View Critical
            </button>
          </div>
        </div>
      )}

      {/* Fraud Alerts */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Fraud Alerts
          <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full">
            {activeAlerts.length} active
          </span>
        </h2>
        <div className="space-y-4">
          {fraudAlerts.map((alert) => (
            <FraudAlertCard
              key={alert.id}
              alert={alert}
              onInvestigate={() => onInvestigateAlert?.(alert.id)}
              onResolve={(resolution) => onResolveAlert?.(alert.id, resolution)}
              onEscalate={(team) => onEscalateAlert?.(alert.id, team)}
            />
          ))}
        </div>
      </section>

      {/* Behavior Clusters */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Member Behavior Clusters
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          {behaviorClusters.map((cluster) => (
            <BehaviorClusterCard
              key={cluster.id}
              cluster={cluster}
              onViewDetails={() => onViewClusterDetails?.(cluster.id)}
              onExport={() => onExportClusterData?.(cluster.id)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
