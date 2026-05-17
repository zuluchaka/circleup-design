'use client'

import { useState } from 'react'
import type { Member, Circle } from '@/../product/sections/multi-share/types'

interface ShareRequestModalProps {
  member: Member
  circle: Circle
  onSubmit?: (requestedShares: number, notes?: string) => void
  onClose?: () => void
}

export function ShareRequestModal({
  member,
  circle,
  onSubmit,
  onClose,
}: ShareRequestModalProps) {
  const [requestedShares, setRequestedShares] = useState(1)
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const maxAddable = Math.min(
    member.maxEligibleShares - member.shares,
    circle.multiShareConfig.totalSharesLimit - circle.multiShareConfig.currentTotalShares
  )

  const newTotal = member.shares + requestedShares
  const currentContribution = member.shares * circle.baseContribution
  const newContribution = newTotal * circle.baseContribution
  const contributionDiff = newContribution - currentContribution

  const currentPayout = (member.shares / circle.multiShareConfig.currentTotalShares) *
    (circle.multiShareConfig.currentTotalShares * circle.baseContribution)
  const newTotalShares = circle.multiShareConfig.currentTotalShares + requestedShares
  const newPayout = (newTotal / newTotalShares) * (newTotalShares * circle.baseContribution)
  const payoutDiff = newPayout - currentPayout

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      onSubmit?.(requestedShares, notes || undefined)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Request Additional Shares
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {circle.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-6">
          {/* Current Status */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Current Shares</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{member.shares}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600 dark:text-slate-400">Max Eligible</p>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{member.maxEligibleShares}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Trust Score: {member.trustScore}</span>
                <span className="text-slate-600 dark:text-slate-400">Available in circle: {maxAddable} shares</span>
              </div>
            </div>
          </div>

          {/* Share Selector */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              How many additional shares?
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={1}
                max={maxAddable}
                value={requestedShares}
                onChange={(e) => setRequestedShares(parseInt(e.target.value))}
                className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="w-20 text-center">
                <span className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-2xl font-bold">
                  +{requestedShares}
                </span>
              </div>
            </div>
            <div className="mt-2 flex justify-between text-sm text-slate-500 dark:text-slate-400">
              <span>New total: {newTotal} shares</span>
              <span>{((newTotal / newTotalShares) * 100).toFixed(1)}% of circle</span>
            </div>
          </div>

          {/* Impact Calculator */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Impact Summary</h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <p className="text-sm text-slate-600 dark:text-slate-400">Monthly Contribution</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-lg font-semibold text-slate-900 dark:text-white">
                    {circle.currency} {newContribution.toLocaleString()}
                  </span>
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    +{circle.currency} {contributionDiff.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <p className="text-sm text-slate-600 dark:text-slate-400">Expected Payout</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-lg font-semibold text-slate-900 dark:text-white">
                    {circle.currency} {newPayout.toLocaleString()}
                  </span>
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    +{circle.currency} {payoutDiff.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">{newTotal} shares × {circle.currency} {circle.baseContribution}</span>
                  <span className="font-medium text-slate-900 dark:text-white">{circle.currency} {newContribution.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Emergency Fund (1%)</span>
                  <span className="font-medium text-slate-900 dark:text-white">{circle.currency} {(newContribution * 0.01).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Platform Fee (1.5%)</span>
                  <span className="font-medium text-slate-900 dark:text-white">{circle.currency} {(newContribution * 0.015).toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between">
                  <span className="font-medium text-slate-900 dark:text-white">Total Due Per Cycle</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {circle.currency} {(newContribution * 1.025).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Share your reason for requesting additional shares..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Approval Notice */}
          {circle.multiShareConfig.approvalMode === 'organizer_approval' && (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-100">Organizer Approval Required</p>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    Your request will be reviewed by the circle organizer. You&apos;ll be notified once a decision is made.
                  </p>
                </div>
              </div>
            </div>
          )}

          {circle.status === 'active' && (
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-indigo-900 dark:text-indigo-100">Effective From Next Cycle</p>
                  <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">
                    If approved, your new share count will take effect starting Cycle {circle.currentCycle + 1}.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || maxAddable === 0}
            className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit Request'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
