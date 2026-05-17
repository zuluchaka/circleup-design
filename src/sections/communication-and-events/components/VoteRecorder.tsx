import { useState } from 'react'
import type { AgendaItem, VotingProcedure } from '@/../product/sections/communication-and-events/types'

export interface VoteRecorderProps {
  agendaItem: AgendaItem
  onRecordVote: (agendaItemId: string, voteResult: VoteResult) => void
  onCancel: () => void
}

export interface VoteResult {
  motionText: string
  voteType: VotingProcedure
  votesFor: number
  votesAgainst: number
  abstentions: number
  passed: boolean
}

const voteTypeLabels: Record<VotingProcedure, string> = {
  simple_majority: 'Simple Majority (>50%)',
  two_thirds: 'Two-Thirds Majority (>66.7%)',
  unanimous: 'Unanimous (100%)',
}

function calculateResult(
  voteType: VotingProcedure,
  votesFor: number,
  votesAgainst: number
): boolean {
  const totalCast = votesFor + votesAgainst
  if (totalCast === 0) return false

  const forRatio = votesFor / totalCast

  switch (voteType) {
    case 'simple_majority':
      return forRatio > 0.5
    case 'two_thirds':
      return forRatio >= 2 / 3
    case 'unanimous':
      return votesAgainst === 0 && votesFor > 0
    default:
      return false
  }
}

export function VoteRecorder({ agendaItem, onRecordVote, onCancel }: VoteRecorderProps) {
  const [motionText, setMotionText] = useState('')
  const [voteType, setVoteType] = useState<VotingProcedure>('simple_majority')
  const [votesFor, setVotesFor] = useState(0)
  const [votesAgainst, setVotesAgainst] = useState(0)
  const [abstentions, setAbstentions] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const passed = calculateResult(voteType, votesFor, votesAgainst)
  const totalVotes = votesFor + votesAgainst + abstentions

  const handleSubmit = async () => {
    if (!motionText.trim()) return

    setIsSubmitting(true)
    try {
      await onRecordVote(agendaItem.id, {
        motionText: motionText.trim(),
        voteType,
        votesFor,
        votesAgainst,
        abstentions,
        passed,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Record Vote</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Agenda Item: {agendaItem.title}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-5">
        {/* Motion Text */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Motion Text
          </label>
          <textarea
            value={motionText}
            onChange={e => setMotionText(e.target.value)}
            placeholder="Describe the motion being voted on..."
            rows={3}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        {/* Vote Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Vote Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(Object.keys(voteTypeLabels) as VotingProcedure[]).map(type => (
              <label
                key={type}
                className={`flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-colors ${
                  voteType === type
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-800'
                    : 'bg-slate-50 dark:bg-slate-700 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-600'
                }`}
                onClick={() => setVoteType(type)}
              >
                <input
                  type="radio"
                  name="voteType"
                  value={type}
                  checked={voteType === type}
                  onChange={() => setVoteType(type)}
                  className="sr-only"
                />
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {voteTypeLabels[type]}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Vote Counts */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Vote Counts
          </label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-1">
                For
              </label>
              <input
                type="number"
                min="0"
                value={votesFor}
                onChange={e => setVotesFor(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl text-slate-900 dark:text-white text-center text-lg font-semibold focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs text-red-600 dark:text-red-400 font-medium mb-1">
                Against
              </label>
              <input
                type="number"
                min="0"
                value={votesAgainst}
                onChange={e => setVotesAgainst(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-4 py-3 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl text-slate-900 dark:text-white text-center text-lg font-semibold focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
                Abstain
              </label>
              <input
                type="number"
                min="0"
                value={abstentions}
                onChange={e => setAbstentions(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-center text-lg font-semibold focus:ring-2 focus:ring-slate-500"
              />
            </div>
          </div>
        </div>

        {/* Result Preview */}
        {totalVotes > 0 && (
          <div
            className={`p-4 rounded-xl border-2 ${
              passed
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${
                  passed
                    ? 'bg-emerald-100 dark:bg-emerald-900/40'
                    : 'bg-red-100 dark:bg-red-900/40'
                }`}
              >
                {passed ? (
                  <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div>
                <p className={`font-semibold ${passed ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                  Motion {passed ? 'PASSED' : 'FAILED'}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {votesFor} for, {votesAgainst} against, {abstentions} abstain ({totalVotes} total)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!motionText.trim() || totalVotes === 0 || isSubmitting}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-medium rounded-xl transition-colors"
          >
            {isSubmitting ? 'Recording...' : 'Record Vote'}
          </button>
        </div>
      </div>
    </div>
  )
}
