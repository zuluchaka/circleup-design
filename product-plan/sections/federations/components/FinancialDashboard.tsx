import type {
  FederationFund,
  DuesConfig,
  DuesInvoice,
  FederationBudget,
  FederationTransfer,
  CashFlowEntry,
} from '../types'

interface FinancialDashboardProps {
  funds: FederationFund[]
  duesConfig: DuesConfig
  duesInvoices: DuesInvoice[]
  budget: FederationBudget
  transfers: FederationTransfer[]
  cashFlowHistory: CashFlowEntry[]
  currency: string
  onConfigureDues?: () => void
  onCreateTransfer?: () => void
  onApproveTransfer?: (id: string) => void
  onCreateBudget?: () => void
}

const invoiceStatusStyles = {
  paid: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
  pending: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  overdue: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
}

const transferStatusStyles = {
  completed: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
  pending_approval: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  rejected: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
}

function MiniBarChart({ entries }: { entries: CashFlowEntry[] }) {
  const maxVal = Math.max(...entries.flatMap((e) => [e.income, e.expenses]))
  return (
    <div className="flex items-end gap-1 h-24">
      {entries.map((entry) => (
        <div key={entry.month} className="flex-1 flex items-end gap-px group relative">
          <div
            className="flex-1 bg-indigo-400/70 dark:bg-indigo-500/50 rounded-t-sm transition-all hover:bg-indigo-500 dark:hover:bg-indigo-400/70"
            style={{ height: `${(entry.income / maxVal) * 100}%` }}
          />
          <div
            className="flex-1 bg-rose-400/70 dark:bg-rose-500/50 rounded-t-sm transition-all hover:bg-rose-500 dark:hover:bg-rose-400/70"
            style={{ height: `${(entry.expenses / maxVal) * 100}%` }}
          />
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[8px] font-mono px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
            {entry.month.slice(5)}: +{(entry.income / 1000).toFixed(1)}k / -{(entry.expenses / 1000).toFixed(1)}k
          </div>
        </div>
      ))}
    </div>
  )
}

function BudgetBar({ name, budgeted, spent, percentUsed, currency }: { name: string; budgeted: number; spent: number; percentUsed: number; currency: string }) {
  const color = percentUsed >= 90 ? 'bg-red-500' : percentUsed >= 80 ? 'bg-amber-500' : 'bg-indigo-500'
  const textColor = percentUsed >= 90 ? 'text-red-600 dark:text-red-400' : percentUsed >= 80 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-600 dark:text-slate-300'

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{name}</span>
        <span className={`text-xs font-bold ${textColor}`}>{percentUsed.toFixed(0)}%</span>
      </div>
      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${Math.min(percentUsed, 100)}%` }} />
      </div>
      <div className="flex items-center justify-between mt-0.5">
        <span className="text-[9px] text-slate-400 dark:text-slate-500">{currency} {spent.toLocaleString()} spent</span>
        <span className="text-[9px] text-slate-400 dark:text-slate-500">{currency} {budgeted.toLocaleString()} budget</span>
      </div>
    </div>
  )
}

export function FinancialDashboard({
  funds,
  duesConfig,
  duesInvoices,
  budget,
  transfers,
  cashFlowHistory,
  currency,
  onConfigureDues,
  onCreateTransfer,
  onApproveTransfer,
  onCreateBudget,
}: FinancialDashboardProps) {
  const totalBalance = funds.reduce((sum, f) => sum + f.balance, 0)
  const totalYtdIncome = funds.reduce((sum, f) => sum + f.ytdIncome, 0)
  const totalYtdExpenses = funds.reduce((sum, f) => sum + f.ytdExpenses, 0)
  const fundsAtRisk = funds.filter((f) => f.belowThreshold)

  return (
    <div className="space-y-6">
      {/* Financial overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl p-4 text-white">
          <p className="text-xs font-medium text-indigo-200 uppercase tracking-wide">Total Balance</p>
          <p className="text-2xl font-bold mt-1">{currency} {totalBalance.toLocaleString()}</p>
          <p className="text-xs text-indigo-200 mt-1">{funds.length} fund accounts</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">YTD Income</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{currency} {totalYtdIncome.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">YTD Expenses</p>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">{currency} {totalYtdExpenses.toLocaleString()}</p>
        </div>
      </div>

      {/* Cash Flow Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Cash Flow (12-month)</h4>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-sm bg-indigo-400/70" />
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Income</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-sm bg-rose-400/70" />
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Expenses</span>
            </div>
          </div>
        </div>
        <MiniBarChart entries={cashFlowHistory} />
        <div className="flex justify-between mt-1">
          <span className="text-[8px] text-slate-400 font-mono">{cashFlowHistory[0]?.month}</span>
          <span className="text-[8px] text-slate-400 font-mono">{cashFlowHistory[cashFlowHistory.length - 1]?.month}</span>
        </div>
      </div>

      {/* Fund accounts */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">Fund Accounts</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {funds.map((fund) => (
            <div
              key={fund.id}
              className={`bg-white dark:bg-slate-800 rounded-xl border p-4 ${
                fund.belowThreshold
                  ? 'border-red-200 dark:border-red-800/50'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-xs font-semibold text-slate-900 dark:text-white">{fund.name}</h5>
                <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                  {fund.allocationPercent}% alloc
                </span>
              </div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {fund.currency} {fund.balance.toLocaleString()}
              </p>
              {fund.belowThreshold && (
                <p className="text-[10px] text-red-600 dark:text-red-400 font-medium mt-1">
                  Below minimum ({fund.currency} {fund.minimumThreshold.toLocaleString()})
                </p>
              )}
              <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500 dark:text-slate-400">
                <span className="text-emerald-600 dark:text-emerald-400">+{fund.currency} {fund.ytdIncome.toLocaleString()}</span>
                <span className="text-rose-600 dark:text-rose-400">-{fund.currency} {fund.ytdExpenses.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
        {fundsAtRisk.length > 0 && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 rounded-lg p-3">
            <p className="text-xs text-red-700 dark:text-red-300 font-medium">
              {fundsAtRisk.length} fund{fundsAtRisk.length > 1 ? 's' : ''} below minimum threshold
            </p>
          </div>
        )}
      </div>

      {/* Dues */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">Dues Collection</h4>
          <button
            onClick={onConfigureDues}
            className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 px-2 py-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
          >
            Configure
          </button>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-center">
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">Type</p>
              <p className="text-xs font-semibold text-slate-900 dark:text-white capitalize">{duesConfig.type.replace('_', ' ')}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">Amount</p>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                {duesConfig.currency} {duesConfig.amount}{duesConfig.type === 'per_member' ? '/member' : ''}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">Frequency</p>
              <p className="text-xs font-semibold text-slate-900 dark:text-white capitalize">{duesConfig.frequency}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">Next Due</p>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">{new Date(duesConfig.nextDueDate).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-t border-b border-slate-200 dark:border-slate-700">
                  <th className="px-3 py-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Association</th>
                  <th className="px-3 py-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Period</th>
                  <th className="px-3 py-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase text-right">Amount</th>
                  <th className="px-3 py-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {duesInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-3 py-2 text-xs font-medium text-slate-900 dark:text-white">{inv.associationName}</td>
                    <td className="px-3 py-2 text-xs text-slate-500 dark:text-slate-400">{inv.period}</td>
                    <td className="px-3 py-2 text-xs text-slate-900 dark:text-white text-right font-mono">
                      {duesConfig.currency} {inv.amount.toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${invoiceStatusStyles[inv.status]}`}>
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Budget */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">
            Annual Budget {budget.year}
            <span className={`ml-2 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
              budget.status === 'approved' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' :
              budget.status === 'draft' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' :
              'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
            }`}>
              {budget.status}
            </span>
          </h4>
          <button
            onClick={onCreateBudget}
            className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 px-2 py-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
          >
            {budget.status === 'draft' ? 'Edit Budget' : 'New Budget'}
          </button>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {budget.currency} {budget.totalSpent.toLocaleString()} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">/ {budget.currency} {budget.totalBudget.toLocaleString()}</span>
              </p>
            </div>
            <span className={`text-sm font-bold ${
              (budget.totalSpent / budget.totalBudget * 100) >= 80 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-600 dark:text-slate-300'
            }`}>
              {(budget.totalSpent / budget.totalBudget * 100).toFixed(0)}%
            </span>
          </div>
          <div className="space-y-4">
            {budget.categories.map((cat) => (
              <BudgetBar key={cat.name} {...cat} currency={budget.currency} />
            ))}
          </div>
        </div>
      </div>

      {/* Transfers */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">Transfers & Grants</h4>
          <button
            onClick={onCreateTransfer}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
            New Transfer
          </button>
        </div>
        <div className="space-y-2">
          {transfers.map((xfer) => (
            <div
              key={xfer.id}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                      {xfer.type === 'grant' ? 'Grant' : 'Inter-Fund'}
                    </span>
                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${transferStatusStyles[xfer.status]}`}>
                      {xfer.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                    {xfer.currency} {xfer.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {xfer.sourceFundName} → {xfer.targetAssociationName || xfer.targetFundName}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{xfer.purpose}</p>

                  {/* Approvals */}
                  <div className="flex items-center gap-2 mt-2">
                    {xfer.approvals.map((approval) => (
                      <div key={approval.role} className="flex items-center gap-1">
                        <span className={`w-3 h-3 rounded-full flex items-center justify-center ${
                          approval.approved ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                        }`}>
                          {approval.approved ? (
                            <svg className="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                          ) : (
                            <svg className="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                          )}
                        </span>
                        <span className="text-[9px] text-slate-500 dark:text-slate-400">{approval.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {xfer.status === 'pending_approval' && (
                  <button
                    onClick={() => onApproveTransfer?.(xfer.id)}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex-shrink-0"
                  >
                    Approve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
