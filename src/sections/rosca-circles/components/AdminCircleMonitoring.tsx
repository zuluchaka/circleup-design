import { useState } from 'react'
import type { AdminCircleMonitoringProps } from '@/../product/sections/rosca-circles/types'

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    forming: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    paused: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
    completed: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || colors.active}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function HealthBadge({ score }: { score: number }) {
  const color =
    score >= 0.85
      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
      : score >= 0.7
      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {Math.round(score * 100)}%
    </span>
  )
}

export function AdminCircleMonitoring({
  circles,
  onViewCircle,
  onFreezeAccount,
  onFlagCircle,
}: AdminCircleMonitoringProps) {
  const [freezeModal, setFreezeModal] = useState<{ circleId: string; circleName: string } | null>(null)
  const [freezeReason, setFreezeReason] = useState('')

  const totalFunds = circles.reduce((sum, row) => sum + (row.circle.totalCollected || 0), 0)
  const totalEF = circles.reduce((sum, row) => sum + (row.circle.emergencyFundBalance || 0), 0)
  const activeCount = circles.filter(row => row.circle.status === 'active').length
  const openDisputes = circles.reduce((sum, row) => sum + row.openDisputes, 0)

  const handleFreeze = () => {
    if (!freezeModal || !freezeReason.trim() || !onFreezeAccount) return
    onFreezeAccount(freezeModal.circleId, freezeReason)
    setFreezeModal(null)
    setFreezeReason('')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Admin Circle Monitoring</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">Platform-wide circle account oversight</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Funds Under Management</p>
            <p className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">CHF {totalFunds.toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Active Circles</p>
            <p className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">{activeCount}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Emergency Fund Reserves</p>
            <p className="text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400">CHF {totalEF.toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Open Disputes</p>
            <p className="text-2xl font-bold mt-1 text-red-600 dark:text-red-400">{openDisputes}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Circles</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-2 text-sm font-medium text-slate-500 dark:text-slate-400">Circle</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-slate-500 dark:text-slate-400">Association</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-slate-500 dark:text-slate-400">Balance</th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-slate-500 dark:text-slate-400">Status</th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-slate-500 dark:text-slate-400">Health</th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-slate-500 dark:text-slate-400">Disputes</th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-slate-500 dark:text-slate-400">Flags</th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-slate-500 dark:text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {circles.map((row) => (
                  <tr key={row.circle.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="py-3 px-2">
                      <button
                        onClick={() => onViewCircle?.(row.circle.id)}
                        className="text-sm font-medium text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
                      >
                        {row.circle.name}
                      </button>
                    </td>
                    <td className="py-3 px-2 text-sm text-slate-600 dark:text-slate-400">{row.circle.associationName}</td>
                    <td className="py-3 px-2 text-sm text-right font-semibold text-emerald-600 dark:text-emerald-400">
                      {row.circle.currency} {row.circle.totalCollected.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-center"><StatusBadge status={row.circle.status} /></td>
                    <td className="py-3 px-2 text-center"><HealthBadge score={row.healthScore} /></td>
                    <td className="py-3 px-2 text-sm text-center">
                      {row.openDisputes > 0 ? (
                        <span className="text-red-600 dark:text-red-400 font-medium">{row.openDisputes}</span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-sm text-center">
                      {row.flagsCount > 0 ? (
                        <span className="text-amber-600 dark:text-amber-400 font-medium">{row.flagsCount}</span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {onFlagCircle && (
                          <button
                            onClick={() => onFlagCircle(row.circle.id, 'Manual review')}
                            className="px-2 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-medium hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
                          >
                            Flag
                          </button>
                        )}
                        {onFreezeAccount && (
                          <button
                            onClick={() => setFreezeModal({ circleId: row.circle.id, circleName: row.circle.name })}
                            className="px-2 py-1 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                          >
                            Freeze
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {freezeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setFreezeModal(null)}>
          <div
            className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Freeze Circle Account</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Freezing <span className="font-medium text-slate-900 dark:text-white">{freezeModal.circleName}</span> will prevent all transactions.
            </p>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Reason</label>
            <textarea
              value={freezeReason}
              onChange={(e) => setFreezeReason(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter reason for freezing..."
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => { setFreezeModal(null); setFreezeReason('') }}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleFreeze}
                disabled={!freezeReason.trim()}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Freeze Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
