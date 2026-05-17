import { useState, useEffect } from 'react'
import { useAssociationLedger } from '../../hooks/useAssociationLedger'
import { DuesPaymentModal } from './DuesPaymentModal'
import type { DuesInvoiceStatus, MemberDuesInvoice } from '@/../product/sections/associations/types'

interface MemberDuesHistoryProps {
  associationId: string
  isTreasurer: boolean
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
    </div>
  )
}

function StatusBadge({ status }: { status: DuesInvoiceStatus }) {
  const styles: Record<DuesInvoiceStatus, string> = {
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    paid: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    waived: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
    cancelled: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-500',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status]}`}>
      {status}
    </span>
  )
}

function TreasurerView({
  invoices,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  onWaive,
  onGenerateInvoices,
  waivingId,
  generating,
}: {
  invoices: MemberDuesInvoice[]
  searchQuery: string
  setSearchQuery: (q: string) => void
  statusFilter: DuesInvoiceStatus | 'all'
  setStatusFilter: (s: DuesInvoiceStatus | 'all') => void
  onWaive: (id: string) => void
  onGenerateInvoices: () => void
  waivingId: string | null
  generating: boolean
}) {
  const filtered = invoices.filter(inv => {
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter
    const matchesSearch = !searchQuery ||
      inv.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.memberEmail.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Member Dues</h2>
        <button
          onClick={onGenerateInvoices}
          disabled={generating}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {generating && (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          Generate Invoices
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search members..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as DuesInvoiceStatus | 'all')}
          className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
          <option value="waived">Waived</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-slate-500 dark:text-slate-400">No invoices found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Member</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Period</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Due Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filtered.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{inv.memberName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{inv.memberEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{inv.period}</td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-slate-900 dark:text-white">
                      {inv.currency} {inv.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                      {new Date(inv.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={inv.status} />
                      {inv.daysOverdue > 0 && inv.status === 'overdue' && (
                        <span className="ml-1 text-xs text-red-500">{inv.daysOverdue}d overdue</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {(inv.status === 'pending' || inv.status === 'overdue') && (
                        <button
                          onClick={() => onWaive(inv.id)}
                          disabled={waivingId === inv.id}
                          className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 disabled:opacity-50"
                        >
                          {waivingId === inv.id ? 'Waiving...' : 'Waive'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function MemberView({
  invoices,
  onPay,
  payingId,
}: {
  invoices: MemberDuesInvoice[]
  onPay: (id: string) => void
  payingId: string | null
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Dues</h2>

      {invoices.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-center">
          <p className="text-slate-500 dark:text-slate-400">No invoices to display.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {invoices.map(inv => (
            <div
              key={inv.id}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{inv.period}</p>
                  <StatusBadge status={inv.status} />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Due: {new Date(inv.dueDate).toLocaleDateString()}
                  {inv.daysOverdue > 0 && inv.status === 'overdue' && (
                    <span className="text-red-500 ml-2">{inv.daysOverdue} days overdue</span>
                  )}
                </p>
                {inv.lateFee > 0 && (
                  <p className="text-xs text-red-500 mt-0.5">Late fee: {inv.currency} {inv.lateFee.toFixed(2)}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {inv.currency} {inv.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
                {(inv.status === 'pending' || inv.status === 'overdue') && (
                  <button
                    onClick={() => onPay(inv.id)}
                    disabled={payingId === inv.id}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {payingId === inv.id && (
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    )}
                    Pay
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function MemberDuesHistory({ associationId, isTreasurer }: MemberDuesHistoryProps) {
  const {
    invoices, myInvoices, loading, error,
    loadInvoices, loadMyInvoices, waiveInvoice, generateInvoices,
  } = useAssociationLedger(associationId)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<DuesInvoiceStatus | 'all'>('all')
  const [waivingId, setWaivingId] = useState<string | null>(null)
  const payingId: string | null = null
  const [generating, setGenerating] = useState(false)
  const [paymentInvoice, setPaymentInvoice] = useState<{
    id: string; amount: number; currency: string; reference: string; period: string
  } | null>(null)

  useEffect(() => {
    if (isTreasurer) {
      loadInvoices()
    } else {
      loadMyInvoices()
    }
  }, [isTreasurer, loadInvoices, loadMyInvoices])

  const handleWaive = async (id: string) => {
    setWaivingId(id)
    try { await waiveInvoice(id) } finally { setWaivingId(null) }
  }

  const handlePay = (id: string) => {
    const inv = myInvoices.find(i => i.id === id)
    if (inv) {
      setPaymentInvoice({
        id: inv.id,
        amount: inv.totalAmount,
        currency: inv.currency,
        reference: inv.reference,
        period: inv.period,
      })
    }
  }

  const handleGenerateInvoices = async () => {
    setGenerating(true)
    try { await generateInvoices() } finally { setGenerating(false) }
  }

  if (loading) return <Spinner />

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={() => isTreasurer ? loadInvoices() : loadMyInvoices()}
          className="mt-4 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800"
        >
          Try again
        </button>
      </div>
    )
  }

  if (isTreasurer) {
    return (
      <TreasurerView
        invoices={invoices}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onWaive={handleWaive}
        onGenerateInvoices={handleGenerateInvoices}
        waivingId={waivingId}
        generating={generating}
      />
    )
  }

  return (
    <>
      <MemberView
        invoices={myInvoices}
        onPay={handlePay}
        payingId={payingId}
      />
      {paymentInvoice && (
        <DuesPaymentModal
          associationId={associationId}
          invoiceId={paymentInvoice.id}
          amount={paymentInvoice.amount}
          currency={paymentInvoice.currency}
          reference={paymentInvoice.reference}
          period={paymentInvoice.period}
          onSuccess={() => {
            setPaymentInvoice(null)
            loadMyInvoices()
          }}
          onClose={() => setPaymentInvoice(null)}
        />
      )}
    </>
  )
}
