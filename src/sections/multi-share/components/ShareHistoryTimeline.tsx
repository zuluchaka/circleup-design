'use client'

import type { ShareHistoryEntry } from '@/../product/sections/multi-share/types'

interface ShareHistoryTimelineProps {
  history: ShareHistoryEntry[]
  onExport?: (format: 'csv' | 'pdf') => void
}

const eventTypeConfig: Record<string, { icon: string; color: string; label: string }> = {
  initial_allocation: { icon: '✦', color: 'indigo', label: 'Joined Circle' },
  increase_requested: { icon: '↑', color: 'amber', label: 'Increase Requested' },
  increase_approved: { icon: '✓', color: 'emerald', label: 'Increase Approved' },
  increase_rejected: { icon: '✕', color: 'red', label: 'Increase Rejected' },
  reduction_requested: { icon: '↓', color: 'amber', label: 'Reduction Requested' },
  reduction_approved: { icon: '✓', color: 'emerald', label: 'Reduction Approved' },
  emergency_reduction: { icon: '!', color: 'red', label: 'Emergency Reduction' },
  transfer_sent: { icon: '→', color: 'slate', label: 'Transfer Sent' },
  transfer_received: { icon: '←', color: 'slate', label: 'Transfer Received' },
  cancelled: { icon: '○', color: 'slate', label: 'Cancelled' },
}

export function ShareHistoryTimeline({
  history,
  onExport,
}: ShareHistoryTimelineProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Share History</h3>
        {onExport && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onExport('csv')}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              CSV
            </button>
            <button
              onClick={() => onExport('pdf')}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              PDF
            </button>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="p-6">
        {history.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-slate-600 dark:text-slate-400">No share history yet</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />

            <div className="space-y-6">
              {history.map((entry) => {
                const config = eventTypeConfig[entry.eventType] || eventTypeConfig.cancelled
                const colorClasses = {
                  indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
                  emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
                  amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
                  red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
                  slate: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
                }[config.color]

                return (
                  <div key={entry.id} className="relative flex gap-4">
                    {/* Icon */}
                    <div className={`
                      relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2
                      ${colorClasses}
                    `}>
                      <span className="text-lg font-bold">{config.icon}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pb-6">
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-white">
                              {config.label}
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Cycle {entry.cycle} · {new Date(entry.timestamp).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>

                          {/* Share Change Badge */}
                          <div className={`
                            inline-flex items-center px-3 py-1.5 rounded-lg font-medium text-sm
                            ${entry.change > 0
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                              : entry.change < 0
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                            }
                          `}>
                            {entry.previousShares} → {entry.newShares} shares
                            {entry.change !== 0 && (
                              <span className="ml-1.5">
                                ({entry.change > 0 ? '+' : ''}{entry.change})
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Additional Details */}
                        {(entry.approvedBy || entry.rejectedBy || entry.reason || entry.note) && (
                          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                            {entry.approvedBy && (
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                <span className="font-medium">Approved by:</span> {entry.approvedBy}
                              </p>
                            )}
                            {entry.rejectedBy && (
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                <span className="font-medium">Rejected by:</span> {entry.rejectedBy}
                              </p>
                            )}
                            {entry.reason && (
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                <span className="font-medium">Reason:</span> {entry.reason}
                              </p>
                            )}
                            {entry.note && (
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                <span className="font-medium">Note:</span> {entry.note}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
