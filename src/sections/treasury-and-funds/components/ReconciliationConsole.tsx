import { useState } from 'react'
import type { ReconciliationConsoleProps, ReconciliationRecord, DiscrepancySeverity } from '@/../product/sections/treasury-and-funds/types'

function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const severityColors: Record<DiscrepancySeverity, { bg: string; text: string; icon: string }> = {
  low: {
    bg: 'bg-sky-100 dark:bg-sky-900/30',
    text: 'text-sky-700 dark:text-sky-400',
    icon: 'text-sky-500',
  },
  medium: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-400',
    icon: 'text-amber-500',
  },
  high: {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-700 dark:text-orange-400',
    icon: 'text-orange-500',
  },
  critical: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-400',
    icon: 'text-red-500',
  },
}

function SummaryCard({
  label,
  value,
  icon,
  color,
}: {
  label: string
  value: number
  icon: React.ReactNode
  color: 'emerald' | 'amber' | 'slate'
}) {
  const colorClasses = {
    emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    slate: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>{icon}</div>
        <div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        </div>
      </div>
    </div>
  )
}

function ReconciliationCard({
  record,
  onApproveMatch,
  onFlagForReview,
  onManualAdjust,
}: {
  record: ReconciliationRecord
  onApproveMatch?: (discrepancyId: string) => void
  onFlagForReview?: (discrepancyId: string, notes: string) => void
  onManualAdjust?: (discrepancyId: string, adjustment: number, notes: string) => void
}) {
  const [expandedDiscrepancy, setExpandedDiscrepancy] = useState<string | null>(null)
  const [notes, setNotes] = useState('')

  const statusColors = {
    matched: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    discrepancy: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    pending: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
    resolved: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {formatDate(record.date)}
              </h3>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[record.status]}`}>
                {record.status}
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Run at {formatTime(record.runAt)}
            </p>
          </div>
          {record.discrepancyAmount !== 0 && (
            <div className="text-right">
              <p className="text-sm text-slate-500 dark:text-slate-400">Discrepancy</p>
              <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                {formatCurrency(Math.abs(record.discrepancyAmount))}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Balance Comparison */}
      <div className="p-5 bg-slate-50 dark:bg-slate-800/50">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Expected</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              {formatCurrency(record.expectedBalance)}
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className={`p-2 rounded-full ${
              record.expectedBalance === record.actualBalance
                ? 'bg-emerald-100 dark:bg-emerald-900/30'
                : 'bg-amber-100 dark:bg-amber-900/30'
            }`}>
              {record.expectedBalance === record.actualBalance ? (
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Actual</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              {formatCurrency(record.actualBalance)}
            </p>
          </div>
        </div>
      </div>

      {/* Transaction Summary */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-400">Matched</span>
            <span className="font-semibold text-slate-900 dark:text-white">{record.matchedTransactions}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-slate-600 dark:text-slate-400">Unmatched</span>
            <span className="font-semibold text-slate-900 dark:text-white">{record.unmatchedTransactions}</span>
          </div>
        </div>
      </div>

      {/* Discrepancies */}
      {record.discrepancies.length > 0 && (
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {record.discrepancies.map((discrepancy) => (
            <div key={discrepancy.id} className="p-5">
              <button
                onClick={() => setExpandedDiscrepancy(
                  expandedDiscrepancy === discrepancy.id ? null : discrepancy.id
                )}
                className="w-full text-left"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${severityColors[discrepancy.severity].bg}`}>
                    <svg className={`w-4 h-4 ${severityColors[discrepancy.severity].icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900 dark:text-white">{discrepancy.description}</p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${severityColors[discrepancy.severity].bg} ${severityColors[discrepancy.severity].text}`}>
                        {discrepancy.severity}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Expected: {formatCurrency(discrepancy.expectedAmount)} · Actual: {formatCurrency(discrepancy.actualAmount)}
                    </p>
                  </div>
                  <svg
                    className={`w-5 h-5 text-slate-400 transition-transform ${expandedDiscrepancy === discrepancy.id ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {expandedDiscrepancy === discrepancy.id && (
                <div className="mt-4 ml-11 space-y-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Suggested Action</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{discrepancy.suggestedAction}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Notes (optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes about this discrepancy..."
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                      rows={2}
                    />
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => onApproveMatch?.(discrepancy.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Approve Match
                    </button>
                    <button
                      onClick={() => onFlagForReview?.(discrepancy.id, notes)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                      </svg>
                      Flag for Review
                    </button>
                    <button
                      onClick={() => onManualAdjust?.(discrepancy.id, discrepancy.expectedAmount - discrepancy.actualAmount, notes)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Manual Adjust
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Notes */}
      {record.notes && (
        <div className="p-5 bg-slate-50 dark:bg-slate-700/50">
          <p className="text-sm text-slate-600 dark:text-slate-400">{record.notes}</p>
        </div>
      )}
    </div>
  )
}

export function ReconciliationConsole({
  records,
  onApproveMatch,
  onFlagForReview,
  onManualAdjust,
  onViewHistory,
  onConfigureSchedule,
}: ReconciliationConsoleProps) {
  const matched = records.filter((r) => r.status === 'matched').length
  const withDiscrepancies = records.filter((r) => r.status === 'discrepancy').length
  const pending = records.filter((r) => r.status === 'pending').length

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Reconciliation Console
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Review and resolve fund balance discrepancies
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onViewHistory}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              History
            </button>
            <button
              onClick={onConfigureSchedule}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-sm font-medium text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Configure
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <SummaryCard
            label="Matched"
            value={matched}
            color="emerald"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <SummaryCard
            label="With Discrepancies"
            value={withDiscrepancies}
            color="amber"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
          />
          <SummaryCard
            label="Pending Review"
            value={pending}
            color="slate"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {/* Records List */}
        <div className="space-y-6">
          {records.map((record) => (
            <ReconciliationCard
              key={record.id}
              record={record}
              onApproveMatch={onApproveMatch}
              onFlagForReview={onFlagForReview}
              onManualAdjust={onManualAdjust}
            />
          ))}
        </div>

        {records.length === 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <svg className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-medium text-slate-900 dark:text-white">No reconciliation records</p>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Reconciliation runs will appear here</p>
          </div>
        )}
      </div>
    </div>
  )
}
