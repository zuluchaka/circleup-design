import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import * as ledgerApi from '@/services/memberLedgerApi'
import { saveFile } from '@/platform/downloads'

interface MemberOverview {
  id: string
  membership_id: string
  member_name: string
  member_email: string
  account_number: string
  balance: number
  outstanding_dues: number
  last_payment_date: string | null
  status: string
  currency: string
}

interface OverviewSummary {
  total_members: number
  total_outstanding: number
  overdue_members: number
  collected_this_month: number
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
  audit?: { recorded_by: string | null; recorded_from_ip: string | null }
}

interface MemberDetail {
  name: string
  email: string
  membership_id: string
  role: string
  joined_at: string
}

const ENTRY_TYPE_LABELS: Record<string, string> = {
  dues_invoiced: 'Dues Invoiced', dues_paid: 'Dues Paid', dues_waived: 'Dues Waived',
  dues_late_fee: 'Late Fee (Dues)', circle_contribution: 'Circle Contribution',
  circle_payout: 'Circle Payout', circle_late_fee: 'Late Fee (Circle)',
  off_platform_contribution: 'Off-Platform', platform_subscription: 'Subscription',
  refund: 'Refund', credit_adjustment: 'Credit Adjustment', debit_adjustment: 'Debit Adjustment',
}

interface ReconciliationData {
  year: number
  ledger: Record<string, number>
  source: Record<string, number>
  discrepancies: Array<{ field: string; ledger: number; source: number }>
  reconciled: boolean
}

interface AnnualMemberSummary {
  member_name: string
  member_email: string
  opening_balance: number
  total_dues_paid: number
  total_dues_outstanding: number
  total_circle_contributions: number
  total_circle_payouts: number
  total_late_fees: number
  total_refunds: number
  closing_balance: number
}

type TreasurerView = 'overview' | 'reconciliation' | 'annual_summary'

export default function TreasurerMemberLedgerDashboard({ associationId }: { associationId: string }) {
  const { token } = useAuth()
  const [overviewSummary, setOverviewSummary] = useState<OverviewSummary | null>(null)
  const [members, setMembers] = useState<MemberOverview[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedMember, setSelectedMember] = useState<{
    detail: MemberDetail
    entries: LedgerEntry[]
    account: { id: string; account_number: string; currency: string; balance: number; status: string }
  } | null>(null)
  const [adjustModal, setAdjustModal] = useState<{ membershipId: string; memberName: string; currency: string } | null>(null)
  const [adjustForm, setAdjustForm] = useState({ direction: 'credit', amount: '', description: '' })
  const [adjusting, setAdjusting] = useState(false)
  const [currentView, setCurrentView] = useState<TreasurerView>('overview')
  const [reconciliation, setReconciliation] = useState<ReconciliationData | null>(null)
  const [annualMembers, setAnnualMembers] = useState<AnnualMemberSummary[]>([])
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [generatingBulk, setGeneratingBulk] = useState(false)

  const fetchOverview = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const data = await ledgerApi.fetchLedgerOverview(token, associationId)
      setOverviewSummary(data.summary)
      setMembers(data.members || [])
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [token, associationId])

  useEffect(() => { fetchOverview() }, [fetchOverview])

  const viewMemberStatement = async (membershipId: string) => {
    if (!token) return
    try {
      const data = await ledgerApi.fetchMemberStatement(token, associationId, membershipId)
      setSelectedMember({ detail: data.member, entries: data.entries || [], account: data.account })
    } catch {
      // silent
    }
  }

  const submitAdjustment = async () => {
    if (!adjustModal || !token) return
    setAdjusting(true)
    try {
      await ledgerApi.submitAdjustment(token, associationId, adjustModal.membershipId, {
        direction: adjustForm.direction,
        amount: parseFloat(adjustForm.amount),
        description: adjustForm.description,
      })
      setAdjustModal(null)
      setAdjustForm({ direction: 'credit', amount: '', description: '' })
      if (selectedMember) viewMemberStatement(adjustModal.membershipId)
      fetchOverview()
    } catch {
      // silent
    } finally {
      setAdjusting(false)
    }
  }

  const fetchReconciliation = useCallback(async (year: number) => {
    if (!token) return
    setLoading(true)
    try {
      const data = await ledgerApi.fetchReconciliation(token, associationId, year)
      setReconciliation(data)
    } catch { /* silent */ } finally { setLoading(false) }
  }, [token, associationId])

  const fetchAnnualSummary = useCallback(async (year: number) => {
    if (!token) return
    setLoading(true)
    try {
      const data = await ledgerApi.fetchAnnualSummary(token, associationId, year)
      setAnnualMembers(data.members || [])
    } catch { /* silent */ } finally { setLoading(false) }
  }, [token, associationId])

  const downloadMemberPdf = async (membershipId: string, memberName: string) => {
    if (!token) return
    try {
      const blob = await ledgerApi.downloadPdfStatement(token, associationId, membershipId, { year: String(selectedYear) })
      await saveFile({
        blob,
        fileName: `statement-${memberName.replace(/\s+/g, '_')}-${selectedYear}.pdf`,
        mimeType: 'application/pdf',
      })
    } catch { /* silent */ }
  }

  const handleBulkStatements = async () => {
    if (!token) return
    setGeneratingBulk(true)
    try {
      const data = await ledgerApi.generateBulkStatements(token, associationId, selectedYear)
      for (const stmt of data.statements) {
        const bytes = atob(stmt.pdf_base64)
        const arr = new Uint8Array(bytes.length)
        for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i)
        const blob = new Blob([arr], { type: 'application/pdf' })
        await saveFile({ blob, fileName: stmt.filename, mimeType: 'application/pdf' })
      }
    } catch { /* silent */ } finally { setGeneratingBulk(false) }
  }

  const switchView = (view: TreasurerView) => {
    setCurrentView(view)
    setSelectedMember(null)
    if (view === 'reconciliation') fetchReconciliation(selectedYear)
    if (view === 'annual_summary') fetchAnnualSummary(selectedYear)
  }

  const filtered = members.filter(m =>
    !search || m.member_name?.toLowerCase().includes(search.toLowerCase()) || m.member_email?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading && !members.length) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Member Detail View
  if (selectedMember) {
    const { detail, entries, account } = selectedMember
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedMember(null)}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to overview
        </button>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{detail.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{detail.email} · {detail.role} · Joined {new Date(detail.joined_at).toLocaleDateString('de-CH')}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400">Balance</p>
                <p className={`text-xl font-bold ${account.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {account.currency} {account.balance.toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => downloadMemberPdf(detail.membership_id, detail.name)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-xl"
              >
                PDF Statement
              </button>
              <button
                onClick={() => setAdjustModal({ membershipId: detail.membership_id, memberName: detail.name, currency: account.currency })}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl"
              >
                Record Adjustment
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Description</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Direction</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Amount</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Balance</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Recorded By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {entries.map(entry => (
                <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">{new Date(entry.posted_at).toLocaleDateString('de-CH')}</td>
                  <td className="px-4 py-3 text-slate-900 dark:text-white font-medium whitespace-nowrap">{ENTRY_TYPE_LABELS[entry.entry_type] || entry.entry_type}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300 max-w-xs truncate">{entry.description}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${entry.direction === 'credit' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                      {entry.direction === 'credit' ? 'Credit' : 'Debit'}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-right font-mono font-medium ${entry.direction === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {entry.direction === 'credit' ? '+' : '-'}{entry.currency} {entry.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-300">
                    {entry.running_balance !== null ? `${entry.currency} ${entry.running_balance.toFixed(2)}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">{entry.audit?.recorded_by || '—'}</td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">No entries</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Adjust Modal */}
        {adjustModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Record Adjustment — {adjustModal.memberName}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Direction</label>
                  <select value={adjustForm.direction} onChange={e => setAdjustForm(f => ({ ...f, direction: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                    <option value="credit">Credit (increase balance)</option>
                    <option value="debit">Debit (decrease balance)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount ({adjustModal.currency})</label>
                  <input type="number" step="0.01" min="0.01" value={adjustForm.amount} onChange={e => setAdjustForm(f => ({ ...f, amount: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description (min 10 chars)</label>
                  <textarea value={adjustForm.description} onChange={e => setAdjustForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setAdjustModal(null)} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">Cancel</button>
                <button
                  onClick={submitAdjustment}
                  disabled={adjusting || !adjustForm.amount || adjustForm.description.length < 10}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg disabled:opacity-50"
                >
                  {adjusting ? 'Recording...' : 'Confirm Adjustment'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Reconciliation View
  if (currentView === 'reconciliation') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={() => setCurrentView('overview')} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to overview
          </button>
          <div className="flex items-center gap-2">
            <select value={selectedYear} onChange={e => { setSelectedYear(Number(e.target.value)); fetchReconciliation(Number(e.target.value)) }} className="px-3 py-1.5 rounded-lg text-sm border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800">
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Reconciliation Report — {selectedYear}</h2>

        {reconciliation && (
          <>
            <div className={`p-4 rounded-xl border ${reconciliation.reconciled ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'}`}>
              <p className={`font-medium ${reconciliation.reconciled ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400'}`}>
                {reconciliation.reconciled ? 'All records are reconciled. No discrepancies found.' : `${reconciliation.discrepancies.length} discrepancy(ies) found between ledger and source records.`}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Category</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Ledger Total</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Source Total</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {['dues_paid', 'dues_invoiced', 'circle_contributions', 'circle_payouts'].map(field => {
                    const disc = reconciliation.discrepancies.find(d => d.field === field)
                    return (
                      <tr key={field}>
                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</td>
                        <td className="px-4 py-3 text-right font-mono">{(reconciliation.ledger[field] || 0).toFixed(2)}</td>
                        <td className="px-4 py-3 text-right font-mono">{(reconciliation.source[field] || 0).toFixed(2)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${disc ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                            {disc ? 'Mismatch' : 'OK'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                  <tr className="bg-slate-50 dark:bg-slate-700/30">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">Refunds (ledger only)</td>
                    <td className="px-4 py-3 text-right font-mono">{(reconciliation.ledger.refunds || 0).toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-400">—</td>
                    <td className="px-4 py-3 text-center"><span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">Info</span></td>
                  </tr>
                  <tr className="bg-slate-50 dark:bg-slate-700/30">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">Late Fees (ledger only)</td>
                    <td className="px-4 py-3 text-right font-mono">{(reconciliation.ledger.late_fees || 0).toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-400">—</td>
                    <td className="px-4 py-3 text-center"><span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">Info</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    )
  }

  // Annual Summary View
  if (currentView === 'annual_summary') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={() => setCurrentView('overview')} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to overview
          </button>
          <div className="flex items-center gap-2">
            <select value={selectedYear} onChange={e => { setSelectedYear(Number(e.target.value)); fetchAnnualSummary(Number(e.target.value)) }} className="px-3 py-1.5 rounded-lg text-sm border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800">
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <button onClick={handleBulkStatements} disabled={generatingBulk} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50">
              {generatingBulk ? 'Generating...' : 'Download All PDFs'}
            </button>
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Year-End Financial Summary — {selectedYear}</h2>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase">Member</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-slate-500 uppercase">Opening</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-slate-500 uppercase">Dues Paid</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-slate-500 uppercase">Outstanding</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-slate-500 uppercase">Circle In</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-slate-500 uppercase">Circle Out</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-slate-500 uppercase">Late Fees</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-slate-500 uppercase">Refunds</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-slate-500 uppercase">Closing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {annualMembers.map((m, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <td className="px-3 py-3">
                      <p className="font-medium text-slate-900 dark:text-white text-xs">{m.member_name}</p>
                      <p className="text-xs text-slate-400">{m.member_email}</p>
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-xs">{m.opening_balance.toFixed(2)}</td>
                    <td className="px-3 py-3 text-right font-mono text-xs text-green-600">{m.total_dues_paid.toFixed(2)}</td>
                    <td className="px-3 py-3 text-right font-mono text-xs text-red-600">{m.total_dues_outstanding.toFixed(2)}</td>
                    <td className="px-3 py-3 text-right font-mono text-xs">{m.total_circle_contributions.toFixed(2)}</td>
                    <td className="px-3 py-3 text-right font-mono text-xs">{m.total_circle_payouts.toFixed(2)}</td>
                    <td className="px-3 py-3 text-right font-mono text-xs text-amber-600">{m.total_late_fees.toFixed(2)}</td>
                    <td className="px-3 py-3 text-right font-mono text-xs">{m.total_refunds.toFixed(2)}</td>
                    <td className={`px-3 py-3 text-right font-mono text-xs font-medium ${m.closing_balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {m.closing_balance.toFixed(2)}
                    </td>
                  </tr>
                ))}
                {annualMembers.length === 0 && (
                  <tr><td colSpan={9} className="px-4 py-8 text-center text-slate-500">No data for this year</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // Overview
  return (
    <div className="space-y-6">
      {/* View Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
        {([
          { key: 'overview', label: 'Members Overview' },
          { key: 'reconciliation', label: 'Reconciliation' },
          { key: 'annual_summary', label: 'Annual Summary' },
        ] as const).map(tab => (
          <button
            key={tab.key}
            onClick={() => switchView(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              currentView === tab.key
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
        <div className="ml-auto">
          <button onClick={handleBulkStatements} disabled={generatingBulk} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50">
            {generatingBulk ? 'Generating...' : 'Bulk PDF Statements'}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {overviewSummary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Members', value: overviewSummary.total_members, color: 'indigo' },
            { label: 'Total Outstanding', value: `CHF ${overviewSummary.total_outstanding.toFixed(2)}`, color: 'red' },
            { label: 'Overdue Members', value: overviewSummary.overdue_members, color: 'amber' },
            { label: 'Collected This Month', value: `CHF ${overviewSummary.collected_this_month.toFixed(2)}`, color: 'green' },
          ].map(card => (
            <div key={card.label} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">{card.label}</p>
              <p className={`text-2xl font-bold mt-1 text-${card.color}-600 dark:text-${card.color}-400`}>{card.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search members..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
        />
      </div>

      {/* Members Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Member</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Account</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Balance</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Outstanding</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Last Payment</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {filtered.map(m => (
              <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer" onClick={() => viewMemberStatement(m.membership_id)}>
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900 dark:text-white">{m.member_name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{m.member_email}</p>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-mono text-xs">{m.account_number}</td>
                <td className={`px-4 py-3 text-right font-mono font-medium ${m.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {m.currency} {m.balance.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-300">
                  {m.outstanding_dues > 0 ? `${m.currency} ${m.outstanding_dues.toFixed(2)}` : '—'}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                  {m.last_payment_date ? new Date(m.last_payment_date).toLocaleDateString('de-CH') : '—'}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={e => { e.stopPropagation(); viewMemberStatement(m.membership_id) }}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 text-xs font-medium"
                  >
                    View Ledger
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">No members found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
