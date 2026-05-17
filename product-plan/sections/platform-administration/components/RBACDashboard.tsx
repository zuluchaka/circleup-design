import type {
  RBACDashboardProps,
  AccessRequestStatus,
  ReviewStatus,
  RBACActionType,
} from '../types'

const actionTypeLabels: Record<RBACActionType, string> = {
  role_assigned: 'Role Assigned',
  role_removed: 'Role Removed',
  permission_changed: 'Permission Changed',
  override_created: 'Override Created',
  override_revoked: 'Override Revoked',
  template_applied: 'Template Applied',
  access_requested: 'Access Requested',
  access_granted: 'Access Granted',
  access_denied: 'Access Denied',
  review_completed: 'Review Completed',
  emergency_access: 'Emergency Access',
  delegation_created: 'Delegation Created',
}

const actionTypeColors: Record<string, string> = {
  role_assigned: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  role_removed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  permission_changed: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  override_created: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  override_revoked: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  template_applied: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  access_granted: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  access_denied: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  review_completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
}

const requestStatusColors: Record<AccessRequestStatus, string> = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  denied: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  expired: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
}

const reviewStatusColors: Record<ReviewStatus, string> = {
  scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  in_progress: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  overdue: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export function RBACDashboard({
  metrics,
  recentAuditEntries,
  anomalies,
  pendingRequests,
  pendingReviews,
  onViewAuditTrail,
  onViewRequests,
  onViewAnomalies,
  onStartReview,
}: RBACDashboardProps) {
  const unacknowledgedAnomalies = anomalies.filter((a) => !a.acknowledged)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            RBAC Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Role-Based Access Control overview and system health
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onStartReview}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            Start Access Review
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { label: 'Access Roles', value: metrics.totalAccessRoles, color: 'text-indigo-600 dark:text-indigo-400' },
          { label: 'Contextual Roles', value: metrics.totalContextualRoles, color: 'text-purple-600 dark:text-purple-400' },
          { label: 'Active Overrides', value: metrics.totalOverrides, color: 'text-amber-600 dark:text-amber-400' },
          { label: 'Temp Grants', value: metrics.activeTemporaryGrants, color: 'text-teal-600 dark:text-teal-400' },
          { label: 'Pending Requests', value: metrics.pendingAccessRequests, color: 'text-blue-600 dark:text-blue-400' },
          { label: 'SoD Violations', value: metrics.sodViolations, color: metrics.sodViolations > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {stat.label}
            </p>
            <p className={`mt-1 text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Distribution Chart */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Users by Access Role
          </h2>
          <div className="mt-4 space-y-3">
            {Object.entries(metrics.usersPerAccessRole).map(([role, count]) => {
              const total = Object.values(metrics.usersPerAccessRole).reduce((s, c) => s + c, 0)
              const pct = total > 0 ? (count / total) * 100 : 0
              const colors: Record<string, string> = {
                admin: 'bg-red-500',
                standard_user: 'bg-indigo-500',
                invitee: 'bg-slate-400',
              }
              const labels: Record<string, string> = {
                admin: 'Admin',
                standard_user: 'Standard User',
                invitee: 'Invitee',
              }
              return (
                <div key={role}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {labels[role] ?? role}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {count.toLocaleString()} ({pct.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700">
                    <div
                      className={`h-2 rounded-full ${colors[role] ?? 'bg-slate-400'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Cache Hit Rate: {metrics.cacheHitRate}%</span>
            <span>{metrics.totalFeatures} registered features</span>
          </div>
        </div>

        {/* Anomalies */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Permission Anomalies
              {unacknowledgedAnomalies.length > 0 && (
                <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unacknowledgedAnomalies.length}
                </span>
              )}
            </h2>
            <button
              onClick={onViewAnomalies}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              View All
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {anomalies.slice(0, 4).map((anomaly) => {
              const severityColors = {
                low: 'border-l-slate-400',
                medium: 'border-l-amber-400',
                high: 'border-l-red-500',
              }
              return (
                <div
                  key={anomaly.id}
                  className={`rounded border-l-4 ${severityColors[anomaly.severity]} bg-slate-50 p-3 dark:bg-slate-900/50`}
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {anomaly.userName}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                        {anomaly.description}
                      </p>
                    </div>
                    {anomaly.acknowledged && (
                      <span className="ml-2 shrink-0 text-xs text-emerald-600 dark:text-emerald-400">
                        Acknowledged
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
            {anomalies.length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No anomalies detected
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Activity & Requests */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Recent Permission Changes
            </h2>
            <button
              onClick={onViewAuditTrail}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              Full Audit Trail
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {recentAuditEntries.slice(0, 6).map((entry) => (
              <div
                key={entry.id}
                className="flex items-start gap-3 rounded-lg p-2 hover:bg-slate-50 dark:hover:bg-slate-900/50"
              >
                <div className="mt-0.5 h-8 w-8 shrink-0 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    {entry.actorName.split(' ').map((n) => n[0]).join('')}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {entry.actorName}
                    </span>
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${actionTypeColors[entry.actionType] ?? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}
                    >
                      {actionTypeLabels[entry.actionType]}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {entry.targetName}
                    {entry.scopeName && ` • ${entry.scopeName}`}
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">
                    {new Date(entry.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Requests & Reviews */}
        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Pending Requests
                {pendingRequests.filter((r) => r.status === 'pending').length > 0 && (
                  <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">
                    {pendingRequests.filter((r) => r.status === 'pending').length}
                  </span>
                )}
              </h2>
              <button
                onClick={onViewRequests}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                View All
              </button>
            </div>
            <div className="mt-4 space-y-2">
              {pendingRequests.filter((r) => r.status === 'pending').slice(0, 4).map((req) => (
                <div
                  key={req.id}
                  className="flex items-center gap-2 rounded p-2 bg-slate-50 dark:bg-slate-900/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                      {req.requesterName}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {req.featureName} • {req.scopeName}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${requestStatusColors[req.status]}`}
                  >
                    {req.status}
                  </span>
                </div>
              ))}
              {pendingRequests.filter((r) => r.status === 'pending').length === 0 && (
                <p className="text-xs text-slate-500 dark:text-slate-400">No pending requests</p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Access Reviews
              </h2>
              <button
                onClick={onStartReview}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                New Review
              </button>
            </div>
            <div className="mt-4 space-y-2">
              {pendingReviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded border border-slate-200 p-3 dark:border-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {review.name}
                    </p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${reviewStatusColors[review.status]}`}
                    >
                      {review.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                      <span>{review.completedItems}/{review.totalItems} reviewed</span>
                      <span>Due {new Date(review.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-700">
                      <div
                        className="h-1.5 rounded-full bg-indigo-500"
                        style={{
                          width: `${review.totalItems > 0 ? (review.completedItems / review.totalItems) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
