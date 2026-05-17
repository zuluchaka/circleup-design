import { useState } from 'react'
import {
  Users, Clock, CheckCircle, XCircle, MessageSquare,
  ThumbsUp, ThumbsDown, AlertCircle, ChevronDown, ChevronUp
} from 'lucide-react'
import type { CollectiveLoan, CollectiveLoanVote } from '@/../product/sections/credit-and-lending/types'

export interface CollectiveLendingProps {
  collectiveLoans: CollectiveLoan[]
  votes: CollectiveLoanVote[]
  onVote?: (loanId: string, vote: 'approve' | 'deny', comment?: string) => void
  onViewLoan?: (loanId: string) => void
  onRequestCollectiveLoan?: (circleId: string, amount: number, termMonths: number, purpose: string) => void
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-CH', { style: 'currency', currency: 'CHF' }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function timeRemaining(deadline: string) {
  const now = new Date()
  const end = new Date(deadline)
  const diff = end.getTime() - now.getTime()

  if (diff <= 0) return 'Ended'

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (days > 0) return `${days}d ${hours}h left`
  return `${hours}h left`
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    voting: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', icon: <Clock className="w-3.5 h-3.5" /> },
    approved: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', icon: <CheckCircle className="w-3.5 h-3.5" /> },
    declined: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', icon: <XCircle className="w-3.5 h-3.5" /> },
    disbursed: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-400', icon: <CheckCircle className="w-3.5 h-3.5" /> },
    repaying: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-400', icon: <Clock className="w-3.5 h-3.5" /> },
    completed: { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-600 dark:text-slate-400', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  }

  const style = styles[status] || styles.voting

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
      {style.icon}
      <span className="capitalize">{status}</span>
    </span>
  )
}

function VoteProgress({ approved, denied, required }: { approved: number; denied: number; required: number }) {
  const approvedPercent = (approved / required) * 100
  const deniedPercent = (denied / required) * 100
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{approved + denied} of {required} votes received</span>
        <span>{required - approved - denied} remaining</span>
      </div>
      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden flex">
        <div
          className="h-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${approvedPercent}%` }}
        />
        <div
          className="h-full bg-red-500 transition-all duration-300"
          style={{ width: `${deniedPercent}%` }}
        />
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
          <ThumbsUp className="w-3 h-3" />
          {approved} approve
        </span>
        <span className="text-red-600 dark:text-red-400 flex items-center gap-1">
          <ThumbsDown className="w-3 h-3" />
          {denied} deny
        </span>
      </div>
    </div>
  )
}

function VotesList({ votes }: { votes: CollectiveLoanVote[] }) {
  return (
    <div className="space-y-3">
      {votes.map(vote => (
        <div key={vote.id} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
            {vote.memberName.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-900 dark:text-white">{vote.memberName}</span>
              <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                vote.vote === 'approve'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {vote.vote === 'approve' ? (
                  <>
                    <ThumbsUp className="w-3 h-3" />
                    Approved
                  </>
                ) : (
                  <>
                    <ThumbsDown className="w-3 h-3" />
                    Denied
                  </>
                )}
              </span>
            </div>
            {vote.comment && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">"{vote.comment}"</p>
            )}
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{formatDate(vote.votedAt)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function VotingModal({
  loan,
  onClose,
  onSubmit,
}: {
  loan: CollectiveLoan
  onClose: () => void
  onSubmit: (vote: 'approve' | 'deny', comment?: string) => void
}) {
  const [selectedVote, setSelectedVote] = useState<'approve' | 'deny' | null>(null)
  const [comment, setComment] = useState('')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Cast Your Vote</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          {loan.requesterName}'s loan request for {formatCurrency(loan.requestedAmount)}
        </p>

        {/* Vote Options */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setSelectedVote('approve')}
            className={`p-4 rounded-xl border-2 transition-all ${
              selectedVote === 'approve'
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300'
            }`}
          >
            <ThumbsUp className={`w-8 h-8 mx-auto mb-2 ${
              selectedVote === 'approve' ? 'text-emerald-500' : 'text-slate-400'
            }`} />
            <p className={`font-medium ${
              selectedVote === 'approve' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'
            }`}>
              Approve
            </p>
          </button>
          <button
            onClick={() => setSelectedVote('deny')}
            className={`p-4 rounded-xl border-2 transition-all ${
              selectedVote === 'deny'
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-red-300'
            }`}
          >
            <ThumbsDown className={`w-8 h-8 mx-auto mb-2 ${
              selectedVote === 'deny' ? 'text-red-500' : 'text-slate-400'
            }`} />
            <p className={`font-medium ${
              selectedVote === 'deny' ? 'text-red-700 dark:text-red-400' : 'text-slate-700 dark:text-slate-300'
            }`}>
              Deny
            </p>
          </button>
        </div>

        {/* Comment */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Add a comment (optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your reasoning with the circle..."
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>

        {/* Guarantee Info */}
        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl mb-6">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>If approved, your share of collective guarantee: {formatCurrency(loan.memberGuaranteeShare)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => selectedVote && onSubmit(selectedVote, comment || undefined)}
            disabled={!selectedVote}
            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
              selectedVote
                ? 'bg-indigo-500 hover:bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
          >
            Submit Vote
          </button>
        </div>
      </div>
    </div>
  )
}

function CollectiveLoanCard({
  loan,
  votes,
  onVote,
  onViewLoan: _onViewLoan,
}: {
  loan: CollectiveLoan
  votes: CollectiveLoanVote[]
  onVote?: (vote: 'approve' | 'deny', comment?: string) => void
  onViewLoan?: () => void
}) {
  const [isExpanded, setIsExpanded] = useState(loan.status === 'voting')
  const [showVotingModal, setShowVotingModal] = useState(false)

  const loanVotes = votes.filter(v => v.collectiveLoanId === loan.id)
  const isVoting = loan.status === 'voting'
  const needsVote = isVoting && !loan.currentUserVoted

  return (
    <>
      <div className={`bg-white dark:bg-slate-800 rounded-2xl border shadow-sm overflow-hidden ${
        needsVote
          ? 'border-amber-300 dark:border-amber-700'
          : 'border-slate-200 dark:border-slate-700'
      }`}>
        {/* Action Required Banner */}
        {needsVote && (
          <div className="px-5 py-2 bg-amber-50 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Your vote is needed</span>
          </div>
        )}

        {/* Header */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-medium">
                {loan.requesterName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{loan.requesterName}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{loan.circleName}</p>
              </div>
            </div>
            <StatusBadge status={loan.status} />
          </div>

          {/* Purpose */}
          <div className="mb-4">
            <p className="text-lg font-semibold text-slate-900 dark:text-white mb-1">{loan.purpose}</p>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {formatCurrency(loan.requestedAmount)}
            </p>
          </div>

          {/* Key Details */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <p className="text-xs text-slate-500 dark:text-slate-400">Term</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{loan.proposedTermMonths} months</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <p className="text-xs text-slate-500 dark:text-slate-400">Interest</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{loan.interestRate}%</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <p className="text-xs text-slate-500 dark:text-slate-400">Monthly</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatCurrency(loan.monthlyRepayment)}</p>
            </div>
          </div>

          {/* Voting Progress */}
          {isVoting && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Voting Progress</span>
                <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {timeRemaining(loan.votingDeadline)}
                </span>
              </div>
              <VoteProgress
                approved={loan.votesApproved}
                denied={loan.votesDenied}
                required={loan.votesRequired}
              />
            </div>
          )}

          {/* Repayment Progress (for approved loans) */}
          {(loan.status === 'approved' || loan.status === 'repaying') && loan.remainingBalance !== undefined && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600 dark:text-slate-400">Repayment Progress</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {loan.paymentsCompleted} payments made
                </span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${((loan.requestedAmount - loan.remainingBalance) / loan.requestedAmount) * 100}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {formatCurrency(loan.remainingBalance)} remaining
              </p>
            </div>
          )}

          {/* Vote Button */}
          {needsVote && (
            <button
              onClick={() => setShowVotingModal(true)}
              className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors"
            >
              Cast Your Vote
            </button>
          )}

          {/* Voted indicator */}
          {isVoting && loan.currentUserVoted && (
            <div className="flex items-center justify-center gap-2 py-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-slate-600 dark:text-slate-400">You've voted</span>
            </div>
          )}

          {/* Expand/Collapse */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 w-full flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Hide votes
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Show votes ({loanVotes.length})
              </>
            )}
          </button>
        </div>

        {/* Expanded Votes */}
        {isExpanded && loanVotes.length > 0 && (
          <div className="border-t border-slate-200 dark:border-slate-700 p-5">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Member Votes
            </h4>
            <VotesList votes={loanVotes} />
          </div>
        )}
      </div>

      {/* Voting Modal */}
      {showVotingModal && (
        <VotingModal
          loan={loan}
          onClose={() => setShowVotingModal(false)}
          onSubmit={(vote, comment) => {
            onVote?.(vote, comment)
            setShowVotingModal(false)
          }}
        />
      )}
    </>
  )
}

export function CollectiveLending({
  collectiveLoans,
  votes,
  onVote,
  onViewLoan,
  onRequestCollectiveLoan,
}: CollectiveLendingProps) {
  const votingLoans = collectiveLoans.filter(l => l.status === 'voting')
  const activeLoans = collectiveLoans.filter(l => ['approved', 'disbursed', 'repaying'].includes(l.status))
  const pendingVotes = votingLoans.filter(l => !l.currentUserVoted).length

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Collective Lending</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Circle members vote to approve loans backed by collective guarantee
          </p>
        </div>
        <button
          onClick={() => onRequestCollectiveLoan?.('', 0, 0, '')}
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
        >
          <Users className="w-4 h-4" />
          Request Loan
        </button>
      </div>

      {/* Pending Votes Alert */}
      {pendingVotes > 0 && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 flex items-center gap-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="font-medium text-amber-800 dark:text-amber-300">
              {pendingVotes} loan request{pendingVotes > 1 ? 's' : ''} awaiting your vote
            </p>
            <p className="text-sm text-amber-600 dark:text-amber-500">Your vote helps the circle make decisions</p>
          </div>
        </div>
      )}

      {/* Voting Loans */}
      {votingLoans.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            Active Voting
          </h2>
          <div className="space-y-4">
            {votingLoans.map(loan => (
              <CollectiveLoanCard
                key={loan.id}
                loan={loan}
                votes={votes}
                onVote={(vote, comment) => onVote?.(loan.id, vote, comment)}
                onViewLoan={() => onViewLoan?.(loan.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Active Loans */}
      {activeLoans.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            Approved Loans
          </h2>
          <div className="space-y-4">
            {activeLoans.map(loan => (
              <CollectiveLoanCard
                key={loan.id}
                loan={loan}
                votes={votes}
                onViewLoan={() => onViewLoan?.(loan.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {collectiveLoans.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No collective loans</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            Circle members can request loans backed by the collective guarantee
          </p>
        </div>
      )}
    </div>
  )
}
