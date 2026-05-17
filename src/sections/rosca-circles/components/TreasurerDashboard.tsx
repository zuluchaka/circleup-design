import { Wallet, FileText, FileSpreadsheet } from 'lucide-react'
import type { TreasurerDashboardProps } from '@/../product/sections/rosca-circles/types'

export function TreasurerDashboard({
  dashboard,
  circle,
  onBack,
  onExportReport,
  onViewTransaction,
}: TreasurerDashboardProps) {
  const { balances, pendingTransactions, expectedVsActual, cashFlowProjection, collectionRate, onTimePaymentRate } = dashboard

  // Find max value for chart scaling
  const maxCashFlow = Math.max(...cashFlowProjection.map((e) => Math.max(e.inflow, e.outflow, e.balance)))

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Wallet className="w-6 h-6 text-indigo-500" />
                  Finance
                </h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {circle.name} • As of {new Date(dashboard.asOfDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            {onExportReport && (
              <div className="hidden sm:flex gap-2">
                <button
                  onClick={() => onExportReport('pdf')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  PDF
                </button>
                <button
                  onClick={() => onExportReport('csv')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  CSV
                </button>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400">
              <div className="text-xl font-bold truncate">{circle.currency} {balances.totalCollected.toLocaleString()}</div>
              <p className="text-sm font-medium mt-0.5 opacity-80">Total Collected</p>
            </div>
            <div className="rounded-xl px-4 py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400">
              <div className="text-xl font-bold truncate">{circle.currency} {balances.availableForPayout.toLocaleString()}</div>
              <p className="text-sm font-medium mt-0.5 opacity-80">Available</p>
            </div>
            <div className="rounded-xl px-4 py-3 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">
              <div className="text-xl font-bold truncate">{circle.currency} {balances.emergencyFundBalance.toLocaleString()}</div>
              <p className="text-sm font-medium mt-0.5 opacity-80">Emergency Fund</p>
            </div>
            <div className="rounded-xl px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
              <div className="text-xl font-bold truncate">{circle.currency} {balances.pendingContributions.toLocaleString()}</div>
              <p className="text-sm font-medium mt-0.5 opacity-80">Pending</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cash Flow Projection Chart */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Cash Flow Projection
              </h2>
              <div className="h-64 relative">
                {/* Simple bar chart */}
                <div className="absolute inset-0 flex items-end gap-2">
                  {cashFlowProjection.map((entry) => (
                    <div key={entry.month} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex gap-0.5 items-end justify-center h-48">
                        {/* Inflow bar */}
                        <div
                          className="w-3 bg-emerald-500 dark:bg-emerald-400 rounded-t"
                          style={{ height: `${(entry.inflow / maxCashFlow) * 100}%` }}
                          title={`Inflow: ${circle.currency} ${entry.inflow.toLocaleString()}`}
                        />
                        {/* Outflow bar */}
                        <div
                          className="w-3 bg-red-500 dark:bg-red-400 rounded-t"
                          style={{ height: `${(entry.outflow / maxCashFlow) * 100}%` }}
                          title={`Outflow: ${circle.currency} ${entry.outflow.toLocaleString()}`}
                        />
                        {/* Balance line marker */}
                        <div
                          className="w-3 bg-indigo-500 dark:bg-indigo-400 rounded-t"
                          style={{ height: `${(entry.balance / maxCashFlow) * 100}%` }}
                          title={`Balance: ${circle.currency} ${entry.balance.toLocaleString()}`}
                        />
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 truncate w-full text-center">
                        {entry.month}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-emerald-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Inflow</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-red-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Outflow</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-indigo-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Balance</span>
                </div>
              </div>
            </div>

            {/* Expected vs Actual */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Expected vs Actual by Cycle
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left py-3 px-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                        Cycle
                      </th>
                      <th className="text-right py-3 px-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                        Expected
                      </th>
                      <th className="text-right py-3 px-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                        Actual
                      </th>
                      <th className="text-right py-3 px-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                        Variance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {Object.entries(expectedVsActual).map(([cycle, data]) => (
                      <tr key={cycle} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="py-3 px-2 font-medium text-slate-900 dark:text-white">
                          Cycle {cycle}
                        </td>
                        <td className="py-3 px-2 text-right text-slate-600 dark:text-slate-400">
                          {circle.currency} {data.expected.toLocaleString()}
                        </td>
                        <td className="py-3 px-2 text-right text-slate-900 dark:text-white">
                          {circle.currency} {data.actual.toLocaleString()}
                        </td>
                        <td className={`py-3 px-2 text-right font-medium ${
                          data.variance >= 0
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {data.variance >= 0 ? '+' : ''}{circle.currency} {data.variance.toLocaleString()}
                          {data.varianceReason && (
                            <span className="block text-xs font-normal text-slate-500 dark:text-slate-400">
                              {data.varianceReason}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pending Transactions */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Pending Transactions ({pendingTransactions.length})
              </h2>
              {pendingTransactions.length === 0 ? (
                <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                  No pending transactions
                </p>
              ) : (
                <div className="space-y-3">
                  {pendingTransactions.map((tx, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      onClick={() => onViewTransaction?.(`${tx.type}-${idx}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === 'contribution'
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                            : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                        }`}>
                          {tx.type === 'contribution' ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {tx.participantName}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {tx.type === 'contribution' ? 'Contribution' : 'Payout'} • Due {new Date(tx.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          tx.type === 'contribution'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-indigo-600 dark:text-indigo-400'
                        }`}>
                          {tx.type === 'contribution' ? '+' : '-'}{circle.currency} {tx.amount.toLocaleString()}
                        </p>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Collection Metrics */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Collection Metrics
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Collection Rate</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{collectionRate}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className={`h-2 rounded-full ${
                        collectionRate >= 90
                          ? 'bg-emerald-500'
                          : collectionRate >= 70
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${collectionRate}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-500 dark:text-slate-400">On-Time Payments</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{onTimePaymentRate}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className={`h-2 rounded-full ${
                        onTimePaymentRate >= 90
                          ? 'bg-emerald-500'
                          : onTimePaymentRate >= 70
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${onTimePaymentRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Circle Status */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Circle Status
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Current Cycle</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {circle.currentCycle} of {circle.duration}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Members</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {circle.currentParticipants}/{circle.maxParticipants}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Contribution</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {circle.currency} {circle.contributionAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Emergency Rate</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {circle.emergencyFundRate}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Next Payout</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {circle.nextPayoutDate
                      ? new Date(circle.nextPayoutDate).toLocaleDateString()
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Quick Actions
              </h2>
              <div className="space-y-2">
                <button className="w-full py-2 px-4 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left flex items-center gap-3">
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Record Cash Collection
                </button>
                <button className="w-full py-2 px-4 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left flex items-center gap-3">
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  Reconcile Payments
                </button>
                <button className="w-full py-2 px-4 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left flex items-center gap-3">
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Send Reminders
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
