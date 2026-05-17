import { useState } from 'react'
import type {
  AccessRequestsProps,
  AccessRequestStatus,
  AccessMode,
  PermissionScope,
} from '../types'

const statusColors: Record<AccessRequestStatus, { bg: string; text: string }> = {
  pending: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
  approved: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
  denied: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400' },
  expired: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400' },
}

const accessModeLabels: Record<AccessMode, string> = {
  none: 'No Access',
  read: 'Read',
  write: 'Write',
  read_write: 'Read & Write',
}

const accessModeColors: Record<AccessMode, string> = {
  none: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  read: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  write: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  read_write: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
}

const scopeColors: Record<PermissionScope, string> = {
  federation: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  association: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  circle: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
}

type Filter = 'all' | 'pending' | 'approved' | 'denied'

export function AccessRequests({
  requests,
  onApprove,
  onDeny,
  onCreateRequest,
}: AccessRequestsProps) {
  const [filter, setFilter] = useState<Filter>('all')
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null)

  const filteredRequests =
    filter === 'all' ? requests : requests.filter((r) => r.status === filter)

  const pendingCount = requests.filter((r) => r.status === 'pending').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Access Requests
            {pendingCount > 0 && (
              <span className="ml-2 inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-amber-500 px-1.5 text-xs font-bold text-white">
                {pendingCount}
              </span>
            )}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Review and manage permission access requests from users
          </p>
        </div>
        <button
          onClick={onCreateRequest}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          New Request
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {([
          { label: 'Pending', status: 'pending' as const, color: 'text-amber-600 dark:text-amber-400' },
          { label: 'Approved', status: 'approved' as const, color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Denied', status: 'denied' as const, color: 'text-red-600 dark:text-red-400' },
          { label: 'Total', status: 'all' as const, color: 'text-slate-900 dark:text-white' },
        ]).map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {stat.label}
            </p>
            <p className={`mt-1 text-2xl font-bold ${stat.color}`}>
              {stat.status === 'all'
                ? requests.length
                : requests.filter((r) => r.status === stat.status).length}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'pending', 'approved', 'denied'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === f
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Request List */}
      <div className="space-y-3">
        {filteredRequests.map((req) => {
          const isExpanded = expandedRequest === req.id
          const isPending = req.status === 'pending'
          return (
            <div
              key={req.id}
              className={`rounded-lg border bg-white dark:bg-slate-800 ${
                isPending
                  ? 'border-amber-200 dark:border-amber-800'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="p-4">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                    {req.requesterAvatar ? (
                      <img src={req.requesterAvatar} alt={req.requesterName} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                        {req.requesterName.split(' ').map((n) => n[0]).join('')}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {req.requesterName}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColors[req.status].bg} ${statusColors[req.status].text}`}>
                        {req.status}
                      </span>
                      {req.isTemporary && (
                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                          Temporary
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      Requesting <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-medium ${accessModeColors[req.requestedMode]}`}>{accessModeLabels[req.requestedMode]}</span>
                      {' '}access to{' '}
                      <span className="font-medium text-slate-700 dark:text-slate-300">{req.featureName}</span>
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${scopeColors[req.scopeType]}`}>
                        {req.scopeName}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        Current: <span className={`rounded px-1 py-0.5 ${accessModeColors[req.currentMode]}`}>{accessModeLabels[req.currentMode]}</span>
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => setExpandedRequest(isExpanded ? null : req.id)}
                      className="mt-1 text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                    >
                      {isExpanded ? 'Less' : 'Details'}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-900/50">
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Justification</p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{req.justification}</p>
                      </div>
                      {req.isTemporary && req.expiresAt && (
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Requested Until</p>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{new Date(req.expiresAt).toLocaleDateString()}</p>
                        </div>
                      )}
                      {req.reviewerComment && (
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Reviewer Comment</p>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                            {req.reviewerComment}
                            <span className="ml-2 text-xs text-slate-400">— {req.reviewerName}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions for pending requests */}
                {isPending && (
                  <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                    <button
                      onClick={() => onDeny?.(req.id, 'Request denied by admin.')}
                      className="rounded-lg border border-red-300 px-4 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      Deny
                    </button>
                    <button
                      onClick={() =>
                        onApprove?.(req.id, 'Approved.', req.isTemporary, req.expiresAt ?? undefined)
                      }
                      className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
                    >
                      Approve
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {filteredRequests.length === 0 && (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No {filter === 'all' ? '' : filter} access requests found.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
