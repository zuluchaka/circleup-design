import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Wallet, Filter } from 'lucide-react'
import * as ledgerApi from '@/services/associationLedgerApi'
import * as memberLedgerApi from '@/services/memberLedgerApi'

interface CircleAccount {
  circleId: string
  circleName: string
  accountBalance: number
  contributionsThisCycle: number
  nextPayoutDate: string | null
  status: string
}

interface FinancialOverview {
  associationBalance: number
  currency: string
  circleAccountsTotal: number
  circleAccounts: CircleAccount[]
  monthlyCashFlow: { month: string; income: number; expenses: number }[]
}

interface DuesInvoice {
  id: string
  reference: string
  amount: number
  lateFee: number
  currency: string
  period: string
  dueDate: string
  status: string
  paidAt: string | null
}

interface LedgerEntry {
  id: string
  entry_type: string
  direction: 'credit' | 'debit'
  amount: number
  currency: string
  description: string
  running_balance: number | null
  posted_at: string
}

interface Props {
  associationId: string
  associationName: string
  onBack?: () => void
}

const ENTRY_TYPE_LABELS: Record<string, string> = {
  dues_invoiced: 'Dues Invoiced',
  dues_paid: 'Dues Paid',
  dues_waived: 'Dues Waived',
  dues_late_fee: 'Late Fee',
  circle_contribution: 'Circle Contribution',
  circle_payout: 'Circle Payout',
  circle_late_fee: 'Circle Late Fee',
  off_platform_contribution: 'Off-Platform Payment',
  platform_subscription: 'Subscription',
  refund: 'Refund',
  credit_adjustment: 'Credit Adjustment',
  debit_adjustment: 'Debit Adjustment',
  opening_balance: 'Opening Balance',
  expense: 'Expense',
  income: 'Income',
  fund_transfer: 'Fund Transfer',
}

type TabId = 'overview' | 'ledger' | 'dues'

export function AssociationFinanceView({ associationId, associationName, onBack }: Props) {
  const { token } = useAuth()
  const [overview, setOverview] = useState<FinancialOverview | null>(null)
  const [myInvoices, setMyInvoices] = useState<DuesInvoice[]>([])
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([])
  const [ledgerAccount, setLedgerAccount] = useState<{ balance: number; currency: string; account_number: string; status: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  const loadAll = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const results = await Promise.allSettled([
        ledgerApi.getFinancialOverview(token, associationId),
        ledgerApi.getMyInvoices(token, associationId),
        memberLedgerApi.fetchMemberLedger(token, associationId, { page: '1' }),
      ])

      if (results[0].status === 'fulfilled') {
        setOverview(results[0].value)
      }
      if (results[1].status === 'fulfilled') {
        const raw = results[1].value?.invoices || results[1].value || []
        setMyInvoices(Array.isArray(raw) ? raw.map((inv: Record<string, unknown>) => ({
          id: String(inv.id),
          reference: String(inv.reference || ''),
          amount: Number(inv.amount || 0),
          lateFee: Number(inv.late_fee || 0),
          currency: String(inv.currency || 'CHF'),
          period: String(inv.period || ''),
          dueDate: String(inv.due_date || ''),
          status: String(inv.status || ''),
          paidAt: inv.paid_at ? String(inv.paid_at) : null,
        })) : [])
      }
      if (results[2].status === 'fulfilled') {
        const data = results[2].value
        setLedgerAccount(data.account || null)
        setLedgerEntries(data.entries || [])
      }
    } catch {
      setError('Failed to load financial data')
    } finally {
      setLoading(false)
    }
  }, [token, associationId])

  useEffect(() => { loadAll() }, [loadAll])

  const currency = overview?.currency || ledgerAccount?.currency || 'CHF'
  const pendingInvoices = myInvoices.filter(i => i.status === 'pending' || i.status === 'overdue')
  const paidInvoices = myInvoices.filter(i => i.status === 'paid')
  const totalDuesOwed = pendingInvoices.reduce((sum, i) => sum + i.amount + i.lateFee, 0)

  const tabs: { id: TabId; label: string; badge?: number }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'dues', label: 'Dues', badge: pendingInvoices.length || undefined },
    { id: 'ledger', label: 'Transactions' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
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
                  {associationName}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          {!loading && !error && (
            <div className="mt-6 grid grid-cols-4 gap-3">
              {[
                {
                  label: 'My Balance',
                  value: ledgerAccount ? `${currency} ${ledgerAccount.balance.toFixed(2)}` : '—',
                  color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400',
                },
                {
                  label: 'Association',
                  value: overview ? `${currency} ${overview.associationBalance.toFixed(2)}` : '—',
                  color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
                },
                {
                  label: 'Dues Owed',
                  value: `${currency} ${totalDuesOwed.toFixed(2)}`,
                  color: totalDuesOwed > 0
                    ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                    : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400',
                },
                {
                  label: 'Circles',
                  value: overview ? `${currency} ${overview.circleAccountsTotal.toFixed(2)}` : '—',
                  color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
                },
              ].map((stat) => (
                <div key={stat.label} className={`rounded-xl px-4 py-3 ${stat.color}`}>
                  <div className="text-lg sm:text-2xl font-bold truncate">{stat.value}</div>
                  <div className="text-xs font-medium mt-0.5 opacity-80">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Tabs */}
          {!loading && !error && (
            <div className="mt-6 flex gap-2 overflow-x-auto pb-1 sm:pb-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {tab.label}
                  {tab.badge && tab.badge > 0 && (
                    <span className="ml-1.5 inline-flex items-center justify-center min-w-[20px] h-5 px-1 text-[10px] font-bold rounded-full bg-amber-500 text-white">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <Wallet className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Failed to load</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">{error}</p>
            <button onClick={loadAll} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Circle Financial Summary */}
                {overview && overview.circleAccounts.length > 0 && (
                  <section>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wide">Circle Finances</h3>
                    <div className="space-y-3">
                      {overview.circleAccounts.map(ca => (
                        <div key={ca.circleId} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">{ca.circleName}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                {ca.status === 'active' ? 'Active' : ca.status}
                                {ca.nextPayoutDate && ` · Next payout: ${new Date(ca.nextPayoutDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-slate-900 dark:text-white">{currency} {ca.accountBalance.toFixed(2)}</p>
                              {ca.contributionsThisCycle > 0 && (
                                <p className="text-xs text-green-600 dark:text-green-400">+{currency} {ca.contributionsThisCycle.toFixed(2)} this cycle</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Monthly Cash Flow */}
                {overview && overview.monthlyCashFlow.length > 0 && (
                  <section>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wide">Monthly Cash Flow</h3>
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Month</th>
                              <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Income</th>
                              <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Expenses</th>
                              <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Net</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {overview.monthlyCashFlow.slice(-6).map(m => {
                              const net = m.income - m.expenses
                              return (
                                <tr key={m.month} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{m.month}</td>
                                  <td className="px-4 py-3 text-right text-green-600 dark:text-green-400 font-mono">{m.income > 0 ? `+${m.income.toFixed(2)}` : '—'}</td>
                                  <td className="px-4 py-3 text-right text-red-600 dark:text-red-400 font-mono">{m.expenses > 0 ? `-${m.expenses.toFixed(2)}` : '—'}</td>
                                  <td className={`px-4 py-3 text-right font-mono font-medium ${net >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {net >= 0 ? '+' : ''}{net.toFixed(2)}
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </section>
                )}

                {/* Recent Activity */}
                {ledgerEntries.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">Recent Activity</h3>
                      <button onClick={() => setActiveTab('ledger')} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                        View all
                      </button>
                    </div>
                    <div className="space-y-2">
                      {ledgerEntries.slice(0, 5).map(entry => (
                        <div key={entry.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                              {ENTRY_TYPE_LABELS[entry.entry_type] || entry.entry_type.replace(/_/g, ' ')}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {entry.description || new Date(entry.posted_at).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`text-sm font-semibold font-mono ${
                            entry.direction === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {entry.direction === 'credit' ? '+' : '-'}{entry.currency} {entry.amount.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {!overview && ledgerEntries.length === 0 && myInvoices.length === 0 && (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Wallet className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No financial data yet</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Financial activity will appear here as transactions are recorded.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Dues Tab */}
            {activeTab === 'dues' && (
              <div className="space-y-6">
                {pendingInvoices.length > 0 && (
                  <section>
                    <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">
                      {pendingInvoices.length} pending invoice{pendingInvoices.length !== 1 ? 's' : ''}
                    </p>
                    <div className="space-y-3">
                      {pendingInvoices.map(inv => (
                        <div key={inv.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-slate-900 dark:text-white">{inv.reference}</p>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                inv.status === 'overdue'
                                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                              }`}>
                                {inv.status === 'overdue' ? 'Overdue' : 'Pending'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              {inv.period} · Due {new Date(inv.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">
                            {inv.currency} {(inv.amount + inv.lateFee).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {paidInvoices.length > 0 && (
                  <section>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wide">Payment History</h3>
                    <div className="space-y-3">
                      {paidInvoices.map(inv => (
                        <div key={inv.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">{inv.reference}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              {inv.period} · Paid {inv.paidAt ? new Date(inv.paidAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                            </p>
                          </div>
                          <span className="text-sm font-semibold font-mono text-green-600 dark:text-green-400">
                            {inv.currency} {inv.amount.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {myInvoices.length === 0 && (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Filter className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No dues invoices</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      No dues invoices found for this association.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Ledger Tab */}
            {activeTab === 'ledger' && (
              <div className="space-y-4">
                {ledgerEntries.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Filter className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No transactions</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      No transactions recorded yet.
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-slate-500 dark:text-slate-500">
                      {ledgerEntries.length} transaction{ledgerEntries.length !== 1 ? 's' : ''}
                    </p>
                    <div className="space-y-2">
                      {ledgerEntries.map(entry => (
                        <div key={entry.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-slate-900 dark:text-white">
                                {ENTRY_TYPE_LABELS[entry.entry_type] || entry.entry_type.replace(/_/g, ' ')}
                              </p>
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                entry.direction === 'credit'
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              }`}>
                                {entry.direction === 'credit' ? 'Credit' : 'Debit'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                              {entry.description || new Date(entry.posted_at).toLocaleDateString('de-CH')}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0 ml-4">
                            <span className={`text-sm font-semibold font-mono ${
                              entry.direction === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                              {entry.direction === 'credit' ? '+' : '-'}{entry.currency} {entry.amount.toFixed(2)}
                            </span>
                            {entry.running_balance !== null && (
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                                Bal: {entry.currency} {entry.running_balance.toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
