import { useState } from 'react'
import type {
  RBACAuditTrailProps,
  RBACActionType,
  PermissionScope,
  ReviewStatus,
} from '@/../product/sections/platform-administration/types'

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
  access_requested: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  access_granted: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  access_denied: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  review_completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  emergency_access: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  delegation_created: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
}

const scopeColors: Record<PermissionScope, string> = {
  federation: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  association: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  circle: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
}

const reviewStatusColors: Record<ReviewStatus, string> = {
  scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  in_progress: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  overdue: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

type Tab = 'audit_log' | 'reviews' | 'sod'

export function RBACAuditTrail({
  entries,
  reviews,
  sodRules,
  onExport,
  onStartReview,
  onViewReview,
}: RBACAuditTrailProps) {
  const [activeTab, setActiveTab] = useState<Tab>('audit_log')
  const [actionFilter, setActionFilter] = useState<string>('all')
  const [scopeFilter, setScopeFilter] = useState<string>('all')
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null)

  const filteredEntries = entries.filter((e) => {
    if (actionFilter !== 'all' && e.actionType !== actionFilter) return false
    if (scopeFilter !== 'all' && e.scope !== scopeFilter) return false
    return true
  })

  const tabs: { key: Tab; label: string }[] = [
    { key: 'audit_log', label: 'Audit Log' },
    { key: 'reviews', label: 'Access Reviews' },
    { key: 'sod', label: 'SoD Violations' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            RBAC Audit Trail
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Permission change history, access reviews, and compliance tracking
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onExport?.('csv')}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Export CSV
          </button>
          <button
            onClick={() => onExport?.('pdf')}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Export PDF
          </button>
          <button
            onClick={onStartReview}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Start Review
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-700">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`border-b-2 pb-3 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Audit Log Tab */}
      {activeTab === 'audit_log' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              <option value="all">All Actions</option>
              {Object.entries(actionTypeLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <select
              value={scopeFilter}
              onChange={(e) => setScopeFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              <option value="all">All Scopes</option>
              <option value="federation">Federation</option>
              <option value="association">Association</option>
              <option value="circle">Circle</option>
            </select>
            <span className="flex items-center text-xs text-slate-500 dark:text-slate-400">
              {filteredEntries.length} entries
            </span>
          </div>

          {/* Entries */}
          <div className="space-y-2">
            {filteredEntries.map((entry) => {
              const isExpanded = expandedEntry === entry.id
              return (
                <div
                  key={entry.id}
                  className="rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
                >
                  <button
                    onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                    className="flex w-full items-center gap-4 p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-lg"
                  >
                    <div className="h-8 w-8 shrink-0 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                        {entry.actorName.split(' ').map((n) => n[0]).join('')}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {entry.actorName}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${actionTypeColors[entry.actionType] ?? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}
                        >
                          {actionTypeLabels[entry.actionType]}
                        </span>
                        {entry.scope && (
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${scopeColors[entry.scope]}`}>
                            {entry.scopeName ?? entry.scope}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {entry.targetName}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                    <svg
                      className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isExpanded && (
                    <div className="border-t border-slate-100 px-4 py-3 dark:border-slate-800">
                      {entry.reason && (
                        <div className="mb-3">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Reason</p>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{entry.reason}</p>
                        </div>
                      )}
                      {Object.keys(entry.changes).length > 0 && (
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Changes</p>
                          <div className="mt-1 space-y-1">
                            {Object.entries(entry.changes).map(([key, val]) => (
                              <div key={key} className="flex items-center gap-2 text-xs">
                                <span className="font-medium text-slate-600 dark:text-slate-400">{key}:</span>
                                <span className="rounded bg-red-50 px-1.5 py-0.5 text-red-600 line-through dark:bg-red-900/20 dark:text-red-400">
                                  {String(val.before ?? 'null')}
                                </span>
                                <span className="text-slate-400">→</span>
                                <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                                  {String(val.after ?? 'null')}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Access Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      {review.name}
                    </h3>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${reviewStatusColors[review.status]}`}>
                      {review.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Reviewer: {review.reviewerName} • Due: {new Date(review.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => onViewReview?.(review.id)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300"
                >
                  View Details
                </button>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>{review.completedItems}/{review.totalItems} items reviewed</span>
                  <span>{review.totalItems > 0 ? Math.round((review.completedItems / review.totalItems) * 100) : 0}%</span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700">
                  <div
                    className={`h-2 rounded-full ${review.status === 'overdue' ? 'bg-red-500' : 'bg-indigo-500'}`}
                    style={{
                      width: `${review.totalItems > 0 ? (review.completedItems / review.totalItems) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              {review.findings.length > 0 && (
                <div className="mt-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Findings ({review.findings.length})
                  </p>
                  <div className="mt-2 space-y-1">
                    {review.findings.map((finding, i) => {
                      const actionColors = {
                        confirmed: 'text-emerald-600 dark:text-emerald-400',
                        modified: 'text-amber-600 dark:text-amber-400',
                        revoked: 'text-red-600 dark:text-red-400',
                      }
                      return (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <span className={`font-medium ${actionColors[finding.action]}`}>
                            {finding.action.charAt(0).toUpperCase() + finding.action.slice(1)}
                          </span>
                          <span className="text-slate-600 dark:text-slate-400">
                            {finding.userName} — {finding.featureName}
                          </span>
                          <span className="text-slate-400 dark:text-slate-500 truncate">
                            {finding.note}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* SoD Violations Tab */}
      {activeTab === 'sod' && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 text-center">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{sodRules.length}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Rules</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 text-center">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {sodRules.filter((r) => r.enforced).length}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Enforced</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 text-center">
              <p className={`text-2xl font-bold ${sodRules.reduce((s, r) => s + r.violations, 0) > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {sodRules.reduce((s, r) => s + r.violations, 0)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Violations</p>
            </div>
          </div>
          {sodRules.map((rule) => (
            <div
              key={rule.id}
              className={`rounded-lg border p-4 ${
                rule.violations > 0
                  ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/10'
                  : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{rule.name}</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      rule.enforced
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {rule.enforced ? 'Enforced' : 'Advisory'}
                  </span>
                </div>
                <span className={`text-lg font-bold ${rule.violations > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {rule.violations} violations
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{rule.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
