import type {
  AccountTransaction,
  CircleAccountDashboardProps,
} from '@/../product/sections/rosca-circles/types'

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    frozen: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    closed: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  }
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || colors.pending}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function TransactionStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || colors.pending}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

export function CircleAccountDashboard({ dashboard, onBack }: CircleAccountDashboardProps) {
  const metrics = [
    { label: 'Total Balance', value: dashboard.totalBalance, color: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Contributions This Cycle', value: dashboard.contributionsThisCycle, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Emergency Fund Balance', value: dashboard.emergencyFundBalance, color: 'text-amber-600 dark:text-amber-400' },
    { label: 'Platform Fees Total', value: dashboard.platformFeesTotal, color: 'text-indigo-600 dark:text-indigo-400' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  Circle Account Ledger
                </h1>
                <p className="mt-1 text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  Account {dashboard.accountNumber} <StatusBadge status={dashboard.status} />
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 dark:text-slate-400">Current Balance</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {dashboard.currency} {dashboard.balance.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map((m) => (
            <div key={m.label} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">{m.label}</p>
              <p className={`text-2xl font-bold mt-1 ${m.color}`}>
                {dashboard.currency} {m.value.toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Recent Transactions
              </h2>
              {dashboard.recentTransactions.length === 0 ? (
                <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                  No transactions yet
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="text-left py-3 px-2 text-sm font-medium text-slate-500 dark:text-slate-400">Type</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-slate-500 dark:text-slate-400">Description</th>
                        <th className="text-right py-3 px-2 text-sm font-medium text-slate-500 dark:text-slate-400">Amount</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-slate-500 dark:text-slate-400">Date</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-slate-500 dark:text-slate-400">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {dashboard.recentTransactions.slice(0, 10).map((tx: AccountTransaction) => (
                        <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                          <td className="py-3 px-2">
                            <span className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                              {tx.type.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-sm text-slate-600 dark:text-slate-400">
                            {tx.description}
                          </td>
                          <td className={`py-3 px-2 text-right text-sm font-semibold ${
                            tx.direction === 'inflow'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {tx.direction === 'inflow' ? '+' : '-'}{dashboard.currency} {tx.amount.toLocaleString()}
                          </td>
                          <td className="py-3 px-2 text-sm text-slate-600 dark:text-slate-400">
                            {new Date(tx.date).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-2">
                            <TransactionStatusBadge status={tx.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Next Payout
              </h2>
              {dashboard.nextPayout ? (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Recipient</span>
                    <span className="font-medium text-slate-900 dark:text-white">{dashboard.nextPayout.recipientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Amount</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {dashboard.currency} {dashboard.nextPayout.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Cycle</span>
                    <span className="font-medium text-slate-900 dark:text-white">#{dashboard.nextPayout.cycleNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Scheduled</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {new Date(dashboard.nextPayout.scheduledDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-center text-slate-500 dark:text-slate-400 py-4">
                  No upcoming payouts
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
