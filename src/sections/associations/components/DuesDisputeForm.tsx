import { useState, useEffect } from 'react'
import { useAssociationLedger } from '../../hooks/useAssociationLedger'
import type { DuesDisputeStatus, DuesDisputeItem, MemberDuesInvoice } from '@/../product/sections/associations/types'

interface DuesDisputeFormProps {
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

function DuesDisputeStatusBadge({ status }: { status: DuesDisputeStatus }) {
  const styles: Record<DuesDisputeStatus, string> = {
    open: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    investigating: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    resolved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    dismissed: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status]}`}>
      {status}
    </span>
  )
}

function CreateDisputeForm({
  invoices,
  onSubmit,
  submitting,
}: {
  invoices: MemberDuesInvoice[]
  onSubmit: (data: { member_dues_invoice_id: string; disputed_amount: number; description: string }) => void
  submitting: boolean
}) {
  const [invoiceId, setInvoiceId] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')

  const eligibleInvoices = invoices.filter(inv =>
    inv.status === 'pending' || inv.status === 'overdue' || inv.status === 'paid'
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!invoiceId || !description.trim()) return
    onSubmit({
      member_dues_invoice_id: invoiceId,
      disputed_amount: parseFloat(amount) || 0,
      description: description.trim(),
    })
    setInvoiceId('')
    setAmount('')
    setDescription('')
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">File a Dispute</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select Invoice</label>
          <select
            value={invoiceId}
            onChange={e => setInvoiceId(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Choose an invoice...</option>
            {eligibleInvoices.map(inv => (
              <option key={inv.id} value={inv.id}>
                {inv.period} - {inv.currency} {inv.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} ({inv.status})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Disputed Amount</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            rows={3}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Explain the reason for your dispute..."
          />
        </div>
        <button
          type="submit"
          disabled={submitting || !invoiceId || !description.trim()}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {submitting && (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          Submit Dispute
        </button>
      </form>
    </div>
  )
}

function DisputeRow({
  dispute,
  isTreasurer,
  onInvestigate,
  onResolve,
  onDismiss,
  processing,
}: {
  dispute: DuesDisputeItem
  isTreasurer: boolean
  onInvestigate: (id: string) => void
  onResolve: (id: string) => void
  onDismiss: (id: string) => void
  processing: boolean
}) {
  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
      <td className="px-4 py-3 text-sm text-slate-900 dark:text-white font-medium">{dispute.memberName}</td>
      <td className="px-4 py-3 text-sm text-right font-medium text-slate-900 dark:text-white">
        {dispute.disputedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </td>
      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 max-w-xs truncate">
        {dispute.description}
      </td>
      <td className="px-4 py-3">
        <DuesDisputeStatusBadge status={dispute.status} />
      </td>
      <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
        {new Date(dispute.createdAt).toLocaleDateString()}
      </td>
      <td className="px-4 py-3 text-right">
        {isTreasurer && dispute.status === 'open' && (
          <div className="flex justify-end gap-2">
            <button
              onClick={() => onInvestigate(dispute.id)}
              disabled={processing}
              className="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50"
            >
              Investigate
            </button>
            <button
              onClick={() => onDismiss(dispute.id)}
              disabled={processing}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
            >
              Dismiss
            </button>
          </div>
        )}
        {isTreasurer && dispute.status === 'investigating' && (
          <div className="flex justify-end gap-2">
            <button
              onClick={() => onResolve(dispute.id)}
              disabled={processing}
              className="px-3 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors disabled:opacity-50"
            >
              Resolve
            </button>
            <button
              onClick={() => onDismiss(dispute.id)}
              disabled={processing}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
            >
              Dismiss
            </button>
          </div>
        )}
        {dispute.resolutionNote && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic">{dispute.resolutionNote}</p>
        )}
      </td>
    </tr>
  )
}

export function DuesDisputeForm({ associationId, isTreasurer }: DuesDisputeFormProps) {
  const {
    myInvoices, disputes, loading, error,
    loadMyInvoices, loadDisputes, createDispute,
    investigateDispute, resolveDispute, dismissDispute,
  } = useAssociationLedger(associationId)
  const [submitting, setSubmitting] = useState(false)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    loadDisputes()
    if (!isTreasurer) loadMyInvoices()
  }, [loadDisputes, loadMyInvoices, isTreasurer])

  const handleCreateDispute = async (data: {
    member_dues_invoice_id: string; disputed_amount: number; description: string
  }) => {
    setSubmitting(true)
    try { await createDispute(data) } finally { setSubmitting(false) }
  }

  const handleInvestigate = async (id: string) => {
    setProcessingId(id)
    try { await investigateDispute(id) } finally { setProcessingId(null) }
  }

  const handleResolve = async (id: string) => {
    setProcessingId(id)
    try { await resolveDispute(id, { note: 'Resolved by treasurer' }) } finally { setProcessingId(null) }
  }

  const handleDismiss = async (id: string) => {
    setProcessingId(id)
    try { await dismissDispute(id, 'Dismissed by treasurer') } finally { setProcessingId(null) }
  }

  if (loading) return <Spinner />

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        <button onClick={() => loadDisputes()} className="mt-4 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800">
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
        {isTreasurer ? 'Dues Disputes' : 'My Disputes'}
      </h2>

      {!isTreasurer && (
        <CreateDisputeForm invoices={myInvoices} onSubmit={handleCreateDispute} submitting={submitting} />
      )}

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            {isTreasurer ? 'All Disputes' : 'My Dispute History'}
          </h3>
        </div>
        {disputes.length === 0 ? (
          <div className="p-6 text-center text-slate-500 dark:text-slate-400">No disputes found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Member</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Filed</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {disputes.map(dispute => (
                  <DisputeRow
                    key={dispute.id}
                    dispute={dispute}
                    isTreasurer={isTreasurer}
                    onInvestigate={handleInvestigate}
                    onResolve={handleResolve}
                    onDismiss={handleDismiss}
                    processing={processingId === dispute.id}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
