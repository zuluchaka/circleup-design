import { useState, useEffect } from 'react'
import { useAssociationLedger } from '../../hooks/useAssociationLedger'

interface LedgerReportViewerProps {
  associationId: string
}

type ReportTab = 'income-expense' | 'fund-balance' | 'member-standing'

function Spinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
    </div>
  )
}

function StandingBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    current: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    due_soon: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status] || styles.current}`}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}

function PeriodSelector({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
}: {
  startDate: string
  endDate: string
  onStartChange: (v: string) => void
  onEndChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div>
        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={e => onStartChange(e.target.value)}
          className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={e => onEndChange(e.target.value)}
          className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>
  )
}

function IncomeExpenseTab({
  associationId,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: {
  associationId: string
  startDate: string
  endDate: string
  setStartDate: (v: string) => void
  setEndDate: (v: string) => void
}) {
  const { incomeExpenseReport, loading, loadIncomeExpenseReport } = useAssociationLedger(associationId)

  useEffect(() => {
    if (startDate && endDate) {
      loadIncomeExpenseReport(startDate, endDate)
    }
  }, [loadIncomeExpenseReport, startDate, endDate])

  const report = incomeExpenseReport

  return (
    <div className="space-y-4">
      <PeriodSelector startDate={startDate} endDate={endDate} onStartChange={setStartDate} onEndChange={setEndDate} />

      {loading ? (
        <Spinner />
      ) : !report ? (
        <div className="p-6 text-center text-slate-500 dark:text-slate-400">Select a date range to generate the report.</div>
      ) : (
        <>
          {/* Totals */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Income</p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {report.totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Expenses</p>
              <p className="text-xl font-bold text-red-600 dark:text-red-400 mt-1">
                {report.totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400">Net Surplus</p>
              <p className={`text-xl font-bold mt-1 ${report.netSurplus >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {report.netSurplus.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Category Breakdown */}
          {(Object.keys(report.incomeByCategory).length > 0 || Object.keys(report.expenseByCategory).length > 0) && (
            <div className="grid sm:grid-cols-2 gap-4">
              {Object.keys(report.incomeByCategory).length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Income by Category</h4>
                  </div>
                  <div className="divide-y divide-slate-200 dark:divide-slate-700">
                    {Object.entries(report.incomeByCategory).map(([cat, amount]) => (
                      <div key={cat} className="px-6 py-3 flex items-center justify-between">
                        <span className="text-sm text-slate-700 dark:text-slate-300 capitalize">{cat.replace(/_/g, ' ')}</span>
                        <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                          {(amount as number).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {Object.keys(report.expenseByCategory).length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Expense by Category</h4>
                  </div>
                  <div className="divide-y divide-slate-200 dark:divide-slate-700">
                    {Object.entries(report.expenseByCategory).map(([cat, amount]) => (
                      <div key={cat} className="px-6 py-3 flex items-center justify-between">
                        <span className="text-sm text-slate-700 dark:text-slate-300 capitalize">{cat.replace(/_/g, ' ')}</span>
                        <span className="text-sm font-medium text-red-600 dark:text-red-400">
                          {(amount as number).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Fund Breakdown Table */}
          {report.fundBreakdown.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Fund Breakdown</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Fund</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Credits</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Debits</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Net</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {report.fundBreakdown.map((fund) => (
                      <tr key={fund.slug} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">{fund.name}</td>
                        <td className="px-4 py-3 text-sm text-right text-emerald-600 dark:text-emerald-400">
                          {fund.credits.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-red-600 dark:text-red-400">
                          {fund.debits.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className={`px-4 py-3 text-sm text-right font-medium ${fund.net >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                          {fund.net.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function FundBalanceTab({
  associationId,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: {
  associationId: string
  startDate: string
  endDate: string
  setStartDate: (v: string) => void
  setEndDate: (v: string) => void
}) {
  const { fundBalanceReport, loading, loadFundBalanceReport } = useAssociationLedger(associationId)

  useEffect(() => {
    if (startDate && endDate) {
      loadFundBalanceReport(startDate, endDate)
    }
  }, [loadFundBalanceReport, startDate, endDate])

  const report = fundBalanceReport

  return (
    <div className="space-y-4">
      <PeriodSelector startDate={startDate} endDate={endDate} onStartChange={setStartDate} onEndChange={setEndDate} />

      {loading ? (
        <Spinner />
      ) : !report || report.funds.length === 0 ? (
        <div className="p-6 text-center text-slate-500 dark:text-slate-400">
          {!report ? 'Select a date range to generate the report.' : 'No fund data for the selected period.'}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {report.funds.map(fund => (
            <div key={fund.slug} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">{fund.name}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Opening Balance</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {fund.openingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Credits</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    +{fund.totalCredits.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Debits</span>
                  <span className="font-medium text-red-600 dark:text-red-400">
                    -{fund.totalDebits.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Closing Balance</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {fund.closingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function MemberStandingTab({ associationId }: { associationId: string }) {
  const { memberStandingReport, loading, loadMemberStandingReport } = useAssociationLedger(associationId)

  useEffect(() => {
    loadMemberStandingReport()
  }, [loadMemberStandingReport])

  if (loading) return <Spinner />

  if (!memberStandingReport || memberStandingReport.members.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500 dark:text-slate-400">No member standing data available.</div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400">Total Members</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{memberStandingReport.totalMembers}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400">Current</p>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{memberStandingReport.current}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400">Due Soon</p>
          <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">{memberStandingReport.dueSoon}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400">Overdue</p>
          <p className="text-xl font-bold text-red-600 dark:text-red-400 mt-1">{memberStandingReport.overdue}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Member</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Paid YTD</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Outstanding</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Days Overdue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {memberStandingReport.members.map(member => (
                <tr key={member.memberId} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{member.memberName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{member.memberEmail}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StandingBadge status={member.duesStatus} />
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-slate-900 dark:text-white">
                    {member.paidYtd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-red-600 dark:text-red-400">
                    {member.outstanding > 0 ? member.outstanding.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-slate-600 dark:text-slate-300">
                    {member.daysOverdue > 0 ? member.daysOverdue : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export function LedgerReportViewer({ associationId }: LedgerReportViewerProps) {
  const { exportReports, error } = useAssociationLedger(associationId)
  const [activeTab, setActiveTab] = useState<ReportTab>('income-expense')
  const [startDate, setStartDate] = useState(() => {
    const d = new Date()
    d.setMonth(d.getMonth() - 3)
    return d.toISOString().split('T')[0]
  })
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0])

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    )
  }

  const tabs: { label: string; value: ReportTab }[] = [
    { label: 'Income & Expense', value: 'income-expense' },
    { label: 'Fund Balance', value: 'fund-balance' },
    { label: 'Member Standing', value: 'member-standing' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Ledger Reports</h2>
        <button
          onClick={() => exportReports(startDate, endDate)}
          className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export
        </button>
      </div>

      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
        {tabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.value
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'income-expense' && (
        <IncomeExpenseTab
          associationId={associationId}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
      )}
      {activeTab === 'fund-balance' && (
        <FundBalanceTab
          associationId={associationId}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
      )}
      {activeTab === 'member-standing' && (
        <MemberStandingTab associationId={associationId} />
      )}
    </div>
  )
}
