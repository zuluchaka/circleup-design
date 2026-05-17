import { useState } from 'react'
import type { EmergencyFundPanelProps, EmergencyFundRequest, VoteChoice } from '@/../product/sections/treasury-and-funds/types'

function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function getTimeRemaining(deadline: string): string {
  const now = new Date()
  const end = new Date(deadline)
  const diff = end.getTime() - now.getTime()

  if (diff <= 0) return 'Expired'

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (days > 0) return `${days}d ${hours}h remaining`
  return `${hours}h remaining`
}

function VotingProgress({ request }: { request: EmergencyFundRequest }) {
  const approvePercent = (request.votesApprove / request.votesRequired) * 100
  const denyPercent = (request.votesDeny / request.votesRequired) * 100
  const remainingPercent = 100 - approvePercent - denyPercent

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500 dark:text-slate-400">
          {request.votesReceived} of {request.votesRequired} votes
        </span>
        <span className="text-slate-500 dark:text-slate-400">
          {getTimeRemaining(request.votingDeadline)}
        </span>
      </div>
      <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden flex">
        <div
          className="bg-emerald-500 transition-all"
          style={{ width: `${approvePercent}%` }}
        />
        <div
          className="bg-red-500 transition-all"
          style={{ width: `${denyPercent}%` }}
        />
        <div
          className="bg-slate-200 dark:bg-slate-600 transition-all"
          style={{ width: `${remainingPercent}%` }}
        />
      </div>
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-slate-600 dark:text-slate-400">Approve ({request.votesApprove})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="text-slate-600 dark:text-slate-400">Deny ({request.votesDeny})</span>
        </div>
      </div>
    </div>
  )
}

function RequestCard({
  request,
  hasVoted,
  onVote,
  onViewDetails,
}: {
  request: EmergencyFundRequest
  hasVoted: boolean
  onVote?: (requestId: string, vote: VoteChoice, comment?: string) => void
  onViewDetails?: () => void
}) {
  const [showVoting, setShowVoting] = useState(false)
  const [voteComment, setVoteComment] = useState('')

  const statusColors = {
    draft: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
    voting: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    denied: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    disbursed: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    cancelled: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
  }

  const handleVote = (vote: VoteChoice) => {
    onVote?.(request.id, vote, voteComment || undefined)
    setShowVoting(false)
    setVoteComment('')
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
              {request.requesterName.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">{request.requesterName}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{formatDate(request.createdAt)}</p>
            </div>
          </div>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[request.status]}`}>
            {request.status}
          </span>
        </div>

        {/* Amount */}
        <div className="mb-4">
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(request.amountRequested, request.currency)}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{request.reason}</p>
        </div>

        {/* Description */}
        <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
          {request.description}
        </p>

        {/* Supporting Documents */}
        {request.supportingDocuments.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {request.supportingDocuments.length} document{request.supportingDocuments.length > 1 ? 's' : ''} attached
            </span>
          </div>
        )}

        {/* Repayment Plan */}
        <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl mb-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Repayment Plan</p>
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            {formatCurrency(request.repaymentPlan.monthlyAmount, request.currency)}/month for {request.repaymentPlan.months} months
          </p>
        </div>

        {/* Voting Progress */}
        {request.status === 'voting' && <VotingProgress request={request} />}

        {/* Outcome Info */}
        {request.status === 'approved' && request.disbursedAt && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
            <p className="text-sm text-emerald-700 dark:text-emerald-400">
              Disbursed on {formatDate(request.disbursedAt)}
            </p>
          </div>
        )}
        {request.status === 'denied' && request.decidedAt && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
            <p className="text-sm text-red-700 dark:text-red-400">
              Denied on {formatDate(request.decidedAt)}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      {request.status === 'voting' && !hasVoted && (
        <div className="border-t border-slate-100 dark:border-slate-700">
          {!showVoting ? (
            <div className="p-4 flex gap-3">
              <button
                onClick={() => setShowVoting(true)}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
              >
                Cast Your Vote
              </button>
              <button
                onClick={onViewDetails}
                className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Details
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Add a comment (optional)
                </label>
                <textarea
                  value={voteComment}
                  onChange={(e) => setVoteComment(e.target.value)}
                  placeholder="Share your reasoning..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  rows={2}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleVote('approve')}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleVote('deny')}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-colors"
                >
                  Deny
                </button>
                <button
                  onClick={() => setShowVoting(false)}
                  className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {hasVoted && request.status === 'voting' && (
        <div className="border-t border-slate-100 dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            You have voted on this request
          </div>
        </div>
      )}
    </div>
  )
}

export function EmergencyFundPanel({
  fund,
  requests,
  userVotes,
  currentUserId: _currentUserId,
  onSubmitRequest: _onSubmitRequest,
  onVote,
  onViewRequest,
  onConfigureReplenishment,
}: EmergencyFundPanelProps) {
  const [showRequestForm, setShowRequestForm] = useState(false)

  const votedRequestIds = new Set(userVotes.map((v) => v.requestId))
  const activeRequests = requests.filter((r) => r.status === 'voting')
  const pastRequests = requests.filter((r) => r.status !== 'voting')

  const utilizationRate = fund.totalBalance > 0
    ? ((fund.emergencyFundBalance / fund.totalBalance) * 100).toFixed(1)
    : '0.0'

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Emergency Fund
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {fund.circleName}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onConfigureReplenishment}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </button>
            <button
              onClick={() => setShowRequestForm(true)}
              disabled={fund.emergencyFundBalance <= 0}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed rounded-xl text-sm font-medium text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Request Funds
            </button>
          </div>
        </div>

        {/* Fund Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 sm:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Available Balance</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(fund.emergencyFundBalance, fund.currency)}
                </p>
              </div>
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                <svg className="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Utilization Rate</span>
                <span className="font-medium text-slate-900 dark:text-white">{utilizationRate}% of total fund</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all"
                  style={{ width: `${utilizationRate}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Active Requests</p>
            <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">{activeRequests.length}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">awaiting votes</p>
          </div>
        </div>

        {/* Insufficient Fund Warning */}
        {fund.emergencyFundBalance <= 0 && (
          <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl mb-8">
            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-200">Emergency Fund Depleted</p>
              <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                New requests cannot be submitted. The fund will replenish as members make contributions.
              </p>
            </div>
          </div>
        )}

        {/* Active Requests */}
        {activeRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Active Requests
            </h2>
            <div className="space-y-4">
              {activeRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  hasVoted={votedRequestIds.has(request.id)}
                  onVote={onVote}
                  onViewDetails={() => onViewRequest?.(request.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Past Requests */}
        {pastRequests.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Request History
            </h2>
            <div className="space-y-4">
              {pastRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  hasVoted={votedRequestIds.has(request.id)}
                  onViewDetails={() => onViewRequest?.(request.id)}
                />
              ))}
            </div>
          </div>
        )}

        {requests.length === 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <svg className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <p className="text-lg font-medium text-slate-900 dark:text-white">No emergency requests</p>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              When members need urgent financial help, requests will appear here
            </p>
          </div>
        )}
      </div>

      {/* Request Form Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Request Emergency Funds
                </h2>
                <button
                  onClick={() => setShowRequestForm(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Amount Requested
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Reason
                </label>
                <input
                  type="text"
                  placeholder="Brief description of why you need funds"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Provide more details about your situation..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Repayment Period (months)
                </label>
                <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="1">1 month</option>
                  <option value="2">2 months</option>
                  <option value="3">3 months</option>
                  <option value="4">4 months</option>
                  <option value="6">6 months</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Supporting Documents
                </label>
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl p-6 text-center">
                  <svg className="w-8 h-8 text-slate-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Drop files here or click to upload
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
              <button
                onClick={() => setShowRequestForm(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
