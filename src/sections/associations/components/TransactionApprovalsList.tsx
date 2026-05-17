import { useState, useEffect } from 'react'
import { useAssociationLedger } from '../../hooks/useAssociationLedger'
import type { ApprovalStatus, ApprovalType, TransactionApproval } from '@/../product/sections/associations/types'

interface TransactionApprovalsListProps {
  associationId: string
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
    </div>
  )
}

function TypeBadge({ type }: { type: ApprovalType }) {
  const colors: Record<ApprovalType, string> = {
    expense: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    transfer: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    high_value: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${colors[type]}`}>
      {type.replace(/_/g, ' ')}
    </span>
  )
}

function ApprovalStatusBadge({ status }: { status: ApprovalStatus }) {
  const styles: Record<ApprovalStatus, string> = {
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    approved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    expired: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-500',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status]}`}>
      {status}
    </span>
  )
}

function RejectModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: (reason: string) => void
  onCancel: () => void
}) {
  const [reason, setReason] = useState('')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Rejection Reason</h3>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          placeholder="Provide a reason for rejecting this transaction..."
        />
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={!reason.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  )
}

function ApprovalRow({
  approval,
  onApprove,
  onReject,
  processing,
}: {
  approval: TransactionApproval
  onApprove: (id: string) => void
  onReject: (id: string) => void
  processing: boolean
}) {
  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
      <td className="px-4 py-3">
        <TypeBadge type={approval.approvalType} />
      </td>
      <td className="px-4 py-3 text-sm text-right font-medium text-slate-900 dark:text-white">
        {approval.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </td>
      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
        {approval.description || '-'}
      </td>
      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
        {approval.requestedByName}
      </td>
      <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
        {new Date(approval.createdAt).toLocaleDateString()}
      </td>
      <td className="px-4 py-3">
        <ApprovalStatusBadge status={approval.status} />
        {approval.rejectionReason && (
          <p className="text-xs text-red-500 mt-1">{approval.rejectionReason}</p>
        )}
      </td>
      <td className="px-4 py-3 text-right">
        {approval.status === 'pending' && (
          <div className="flex justify-end gap-2">
            <button
              onClick={() => onApprove(approval.id)}
              disabled={processing}
              className="px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors disabled:opacity-50"
            >
              Approve
            </button>
            <button
              onClick={() => onReject(approval.id)}
              disabled={processing}
              className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        )}
      </td>
    </tr>
  )
}

export function TransactionApprovalsList({ associationId }: TransactionApprovalsListProps) {
  const { approvals, loading, error, loadApprovals, approveTransaction, rejectTransaction } = useAssociationLedger(associationId)
  const [activeTab, setActiveTab] = useState<ApprovalStatus>('pending')
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [rejectingId, setRejectingId] = useState<string | null>(null)

  useEffect(() => {
    loadApprovals({ status: activeTab })
  }, [loadApprovals, activeTab])

  const handleApprove = async (id: string) => {
    setProcessingId(id)
    try { await approveTransaction(id) } finally { setProcessingId(null) }
  }

  const handleRejectConfirm = async (reason: string) => {
    if (!rejectingId) return
    setProcessingId(rejectingId)
    try {
      await rejectTransaction(rejectingId, { reason })
    } finally {
      setProcessingId(null)
      setRejectingId(null)
    }
  }

  if (loading) return <Spinner />

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        <button onClick={() => loadApprovals()} className="mt-4 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800">
          Try again
        </button>
      </div>
    )
  }

  const tabs: { label: string; value: ApprovalStatus }[] = [
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Transaction Approvals</h2>

      {/* Status Tabs */}
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

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {approvals.length === 0 ? (
          <div className="p-6 text-center text-slate-500 dark:text-slate-400">
            No {activeTab} approvals found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Type</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Requested By</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {approvals.map(approval => (
                  <ApprovalRow
                    key={approval.id}
                    approval={approval}
                    onApprove={handleApprove}
                    onReject={(id) => setRejectingId(id)}
                    processing={processingId === approval.id}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectingId && (
        <RejectModal
          onConfirm={handleRejectConfirm}
          onCancel={() => setRejectingId(null)}
        />
      )}
    </div>
  )
}
