import { useState } from 'react'
import type { CircleRenewalProps } from '@/../product/sections/rosca-circles/types'

const statusLabels: Record<string, { label: string; color: string }> = {
  proposed: { label: 'Proposed', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  voting: { label: 'Voting', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  approved: { label: 'Approved', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  cancelled: { label: 'Cancelled', color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400' },
  created: { label: 'Circle Created', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400' },
}

export function CircleRenewalPanel({
  circle,
  renewals,
  isOrganizer,
  onPropose,
  onVote,
  onStartVoting,
  onCreateCircle,
  onCancel,
}: CircleRenewalProps) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    proposedStartDate: '',
    newContributionAmount: '',
    newDurationMonths: '',
    notes: '',
  })

  const currency = circle.currency || 'CHF'

  const handlePropose = () => {
    if (!onPropose || !formData.proposedStartDate) return
    onPropose({
      proposedStartDate: formData.proposedStartDate,
      newContributionAmount: formData.newContributionAmount ? Number(formData.newContributionAmount) : undefined,
      newDurationMonths: formData.newDurationMonths ? Number(formData.newDurationMonths) : undefined,
      notes: formData.notes || undefined,
    })
    setShowForm(false)
  }

  const canPropose = isOrganizer && ['active', 'completed'].includes(circle.status) &&
    !renewals.some(r => ['proposed', 'voting'].includes(r.status))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Circle Renewal</h3>
        {canPropose && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-indigo-700"
          >
            Propose Renewal
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Proposed Start Date *
            </label>
            <input
              type="date"
              value={formData.proposedStartDate}
              onChange={(e) => setFormData({ ...formData, proposedStartDate: e.target.value })}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm dark:bg-slate-700 dark:text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                New Contribution ({currency})
              </label>
              <input
                type="number"
                placeholder="Keep current"
                value={formData.newContributionAmount}
                onChange={(e) => setFormData({ ...formData, newContributionAmount: e.target.value })}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm dark:bg-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                New Duration (months)
              </label>
              <input
                type="number"
                placeholder="Keep current"
                value={formData.newDurationMonths}
                onChange={(e) => setFormData({ ...formData, newDurationMonths: e.target.value })}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm dark:bg-slate-700 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm dark:bg-slate-700 dark:text-white"
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePropose}
              disabled={!formData.proposedStartDate}
              className="bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              Submit Proposal
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {renewals.length === 0 && !showForm && (
        <p className="text-sm text-slate-500 dark:text-slate-400">No renewal proposals yet.</p>
      )}

      {renewals.map((renewal) => {
        const st = statusLabels[renewal.status] || statusLabels.proposed
        return (
          <div
            key={renewal.id}
            className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${st.color}`}>{st.label}</span>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Proposed by {renewal.initiatedBy.name}
                </span>
              </div>
              <span className="text-xs text-slate-400">
                {new Date(renewal.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div>
                <span className="text-slate-500 dark:text-slate-400">Start Date:</span>
                <span className="ml-1 font-medium text-slate-900 dark:text-white">
                  {new Date(renewal.proposedStartDate).toLocaleDateString()}
                </span>
              </div>
              {renewal.newContributionAmount && (
                <div>
                  <span className="text-slate-500 dark:text-slate-400">New Amount:</span>
                  <span className="ml-1 font-medium text-slate-900 dark:text-white">
                    {currency} {renewal.newContributionAmount}
                  </span>
                </div>
              )}
              {renewal.newDurationMonths && (
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Duration:</span>
                  <span className="ml-1 font-medium text-slate-900 dark:text-white">
                    {renewal.newDurationMonths} months
                  </span>
                </div>
              )}
            </div>

            {renewal.notes && (
              <p className="text-sm text-slate-600 dark:text-slate-400 italic">"{renewal.notes}"</p>
            )}

            {renewal.status === 'voting' && (
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Votes</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {renewal.voteSummary.requiredOptIns} needed to approve
                  </span>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-emerald-600 dark:text-emerald-400">Opt In: {renewal.voteSummary.optIn}</span>
                  <span className="text-red-600 dark:text-red-400">Opt Out: {renewal.voteSummary.optOut}</span>
                  <span className="text-slate-500 dark:text-slate-400">Pending: {renewal.voteSummary.pending}</span>
                </div>
                {renewal.voteSummary.votingDeadline && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Deadline: {new Date(renewal.voteSummary.votingDeadline).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-2 flex-wrap">
              {renewal.status === 'voting' && onVote && (
                <>
                  <button
                    onClick={() => onVote(renewal.id, 'opt_in')}
                    className="bg-emerald-600 text-white rounded-lg px-3 py-1.5 text-sm hover:bg-emerald-700"
                  >
                    Opt In
                  </button>
                  <button
                    onClick={() => onVote(renewal.id, 'opt_out')}
                    className="bg-red-600 text-white rounded-lg px-3 py-1.5 text-sm hover:bg-red-700"
                  >
                    Opt Out
                  </button>
                </>
              )}
              {isOrganizer && renewal.status === 'proposed' && onStartVoting && (
                <button
                  onClick={() => onStartVoting(renewal.id)}
                  className="bg-indigo-600 text-white rounded-lg px-3 py-1.5 text-sm hover:bg-indigo-700"
                >
                  Start Voting
                </button>
              )}
              {isOrganizer && renewal.status === 'approved' && onCreateCircle && (
                <button
                  onClick={() => onCreateCircle(renewal.id)}
                  className="bg-emerald-600 text-white rounded-lg px-3 py-1.5 text-sm hover:bg-emerald-700"
                >
                  Create Renewed Circle
                </button>
              )}
              {isOrganizer && ['proposed', 'voting'].includes(renewal.status) && onCancel && (
                <button
                  onClick={() => onCancel(renewal.id)}
                  className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg px-3 py-1.5 text-sm hover:bg-slate-300 dark:hover:bg-slate-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
