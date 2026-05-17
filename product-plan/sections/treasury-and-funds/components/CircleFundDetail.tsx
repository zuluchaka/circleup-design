import { useState } from 'react'
import type { CircleFundDetailProps, Transaction, TransactionType, TransactionStatus, ReportFormat } from '../types'

function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
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

const transactionTypeLabels: Record<TransactionType, string> = {
  contribution: 'Contribution',
  payout: 'Payout',
  fee: 'Fee',
  refund: 'Refund',
  transfer: 'Transfer',
  welfare: 'Welfare',
  emergency_fund: 'Emergency Fund',
  investment_return: 'Investment Return',
}

const statusColors: Record<TransactionStatus, string> = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  processing: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

function AllocationChart({ fund }: { fund: CircleFundDetailProps['fund'] }) {
  const segments = [
    { label: 'Available', value: fund.availableBalance, color: 'bg-indigo-500' },
    { label: 'Emergency', value: fund.emergencyFundBalance, color: 'bg-amber-500' },
    { label: 'Invested', value: fund.investedBalance, color: 'bg-emerald-500' },
    { label: 'Held', value: fund.heldBalance, color: 'bg-slate-400' },
  ].filter(s => s.value > 0)

  const total = segments.reduce((sum, s) => sum + s.value, 0)

  return (
    <div className="space-y-4">
      {/* Bar Chart */}
      <div className="h-4 rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-700">
        {segments.map((segment, idx) => (
          <div
            key={segment.label}
            className={`${segment.color} transition-all`}
            style={{ width: `${(segment.value / total) * 100}%` }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3">
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${segment.color}`} />
            <span className="text-sm text-slate-600 dark:text-slate-400">{segment.label}</span>
            <span className="text-sm font-medium text-slate-900 dark:text-white ml-auto">
              {((segment.value / total) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TransactionRow({ transaction, currency }: { transaction: Transaction; currency: string }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border-b border-slate-100 dark:border-slate-700 last:border-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          transaction.direction === 'credit'
            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
            : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
        }`}>
          {transaction.direction === 'credit' ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-0 text-left">
          <p className="font-medium text-slate-900 dark:text-white truncate">{transaction.description}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {formatDate(transaction.createdAt)} at {formatTime(transaction.createdAt)}
            </span>
            {transaction.memberName && (
              <>
                <span className="text-slate-300 dark:text-slate-600">·</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">{transaction.memberName}</span>
              </>
            )}
          </div>
        </div>

        <div className="text-right">
          <p className={`font-semibold ${
            transaction.direction === 'credit'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-900 dark:text-white'
          }`}>
            {transaction.direction === 'credit' ? '+' : '-'}
            {formatCurrency(transaction.amount, currency)}
          </p>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[transaction.status]}`}>
            {transaction.status}
          </span>
        </div>

        <svg
          className={`w-5 h-5 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-0 ml-14 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</p>
              <p className="font-medium text-slate-900 dark:text-white">{transactionTypeLabels[transaction.type]}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Running Balance</p>
              <p className="font-medium text-slate-900 dark:text-white">{formatCurrency(transaction.runningBalance, currency)}</p>
            </div>
            {transaction.cycleNumber && (
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cycle</p>
                <p className="font-medium text-slate-900 dark:text-white">#{transaction.cycleNumber}</p>
              </div>
            )}
            {transaction.stripeChargeId && (
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Reference</p>
                <p className="font-mono text-sm text-slate-700 dark:text-slate-300 truncate">{transaction.stripeChargeId}</p>
              </div>
            )}
          </div>
          {transaction.failureReason && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-400">
                <span className="font-medium">Failed:</span> {transaction.failureReason}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function CircleFundDetail({
  fund,
  transactions,
  onFilterTransactions,
  onExportStatement,
  onBack,
}: CircleFundDetailProps) {
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'all'>('all')

  const filteredTransactions = transactions.filter((t) => {
    if (typeFilter !== 'all' && t.type !== typeFilter) return false
    if (statusFilter !== 'all' && t.status !== statusFilter) return false
    return true
  })

  const reconciliationStatusColors = {
    matched: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    discrepancy: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    pending: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
    resolved: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  }

  const fundStatusColors = {
    active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    forming: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    paused: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
    completed: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-4 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Treasury
          </button>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  {fund.circleName}
                </h1>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${fundStatusColors[fund.status]}`}>
                  {fund.status}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Segregated fund account · {fund.currency}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  onChange={(e) => onExportStatement?.(e.target.value as ReportFormat)}
                  className="appearance-none px-4 py-2.5 pr-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                  defaultValue=""
                >
                  <option value="" disabled>Export Statement</option>
                  <option value="pdf">Export as PDF</option>
                  <option value="excel">Export as Excel</option>
                  <option value="csv">Export as CSV</option>
                </select>
                <svg className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Segregation Notice */}
        <div className="flex items-center gap-3 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl mb-6">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
            <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-indigo-800 dark:text-indigo-200">Segregated Account</p>
            <p className="text-sm text-indigo-600 dark:text-indigo-400">
              This fund is isolated from other circles for protection and compliance
            </p>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Balance</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {formatCurrency(fund.totalBalance, fund.currency)}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">Available</p>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
              {formatCurrency(fund.availableBalance, fund.currency)}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">Emergency Fund</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
              {formatCurrency(fund.emergencyFundBalance, fund.currency)}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">Invested</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {formatCurrency(fund.investedBalance, fund.currency)}
            </p>
          </div>
        </div>

        {/* Allocation and Reconciliation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Fund Allocation
            </h2>
            <AllocationChart fund={fund} />
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Reconciliation Status
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Status</span>
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${reconciliationStatusColors[fund.reconciliationStatus]}`}>
                  {fund.reconciliationStatus}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Last Reconciled</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {fund.lastReconciliationDate ? formatDate(fund.lastReconciliationDate) : 'Never'}
                </span>
              </div>
              {fund.pendingContributions > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Pending Contributions</span>
                  <span className="font-medium text-amber-600 dark:text-amber-400">
                    {formatCurrency(fund.pendingContributions, fund.currency)}
                  </span>
                </div>
              )}
              {fund.pendingPayouts > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Pending Payouts</span>
                  <span className="font-medium text-amber-600 dark:text-amber-400">
                    {formatCurrency(fund.pendingPayouts, fund.currency)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Transaction History
              </h2>
              <div className="flex flex-wrap gap-3">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as TransactionType | 'all')}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-700 dark:text-slate-300"
                >
                  <option value="all">All Types</option>
                  {Object.entries(transactionTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as TransactionStatus | 'all')}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-700 dark:text-slate-300"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <TransactionRow key={transaction.id} transaction={transaction} currency={fund.currency} />
              ))
            ) : (
              <div className="p-12 text-center">
                <svg className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-slate-500 dark:text-slate-400">No transactions match your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
