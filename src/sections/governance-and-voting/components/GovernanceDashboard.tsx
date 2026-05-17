import React from 'react'
import type {
  GovernanceDashboardProps,
  Election,
  Proposal,
  Decision,
} from '@/../product/sections/governance-and-voting/types'

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatTimeRemaining(deadline: string) {
  const now = new Date()
  const end = new Date(deadline)
  const diff = end.getTime() - now.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  if (days > 0) return `${days}d ${hours}h remaining`
  if (hours > 0) return `${hours}h remaining`
  return 'Ending soon'
}

function getStatusColor(status: string) {
  switch (status) {
    case 'voting':
      return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
    case 'nominations':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
    case 'discussion':
      return 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300'
    case 'passed':
    case 'certified':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
    case 'rejected':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
    default:
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
  }
}

function StatCard({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode
  label: string
  value: number | string
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-xl p-4 ${
        highlight
          ? 'bg-indigo-600 text-white dark:bg-indigo-500'
          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg ${
            highlight
              ? 'bg-indigo-500 dark:bg-indigo-400'
              : 'bg-slate-100 dark:bg-slate-700'
          }`}
        >
          {icon}
        </div>
        <div>
          <p
            className={`text-2xl font-semibold ${
              highlight ? 'text-white' : 'text-slate-900 dark:text-white'
            }`}
          >
            {value}
          </p>
          <p
            className={`text-sm ${
              highlight ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {label}
          </p>
        </div>
      </div>
    </div>
  )
}

function ElectionCard({
  election,
  onView,
  onVote,
}: {
  election: Election
  onView?: () => void
  onVote?: () => void
}) {
  const isVoting = election.status === 'voting'
  const participationPercent = Math.round(
    (election.votescast / election.eligibleVoterCount) * 100
  )

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(
                election.status
              )}`}
            >
              {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
            </span>
            {isVoting && !election.quorumMet && (
              <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Quorum needed
              </span>
            )}
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white">
            {election.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {election.associationName}
          </p>
        </div>
      </div>

      {isVoting && (
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-500 dark:text-slate-400">
              {election.votescast} of {election.eligibleVoterCount} votes
            </span>
            <span className="text-indigo-600 dark:text-indigo-400 font-medium">
              {participationPercent}%
            </span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all"
              style={{ width: `${participationPercent}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {isVoting
            ? formatTimeRemaining(election.votingEndDate)
            : `Voting starts ${formatDate(election.votingStartDate)}`}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onView}
            className="text-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Details
          </button>
          {isVoting && (
            <button
              onClick={onVote}
              className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1"
            >
              Vote Now
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function ProposalCard({
  proposal,
  onView,
  onVote,
}: {
  proposal: Proposal
  onView?: () => void
  onVote?: () => void
}) {
  const isVoting = proposal.status === 'voting'
  const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.abstentions
  const forPercent =
    totalVotes > 0 ? Math.round((proposal.votesFor / totalVotes) * 100) : 0

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(
                proposal.status
              )}`}
            >
              {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {proposal.category}
            </span>
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">
            {proposal.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            by {proposal.sponsorName}
          </p>
        </div>
      </div>

      {isVoting && (
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-emerald-600 dark:text-emerald-400">
              {proposal.votesFor} For
            </span>
            <span className="text-red-600 dark:text-red-400">
              {proposal.votesAgainst} Against
            </span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-emerald-500"
              style={{ width: `${forPercent}%` }}
            />
            <div
              className="h-full bg-red-500"
              style={{ width: `${100 - forPercent}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>{proposal.commentCount} comments</span>
          {isVoting && proposal.votingEndDate && (
            <>
              <span>•</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatTimeRemaining(proposal.votingEndDate)}
            </>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onView}
            className="text-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            View
          </button>
          {isVoting && (
            <button
              onClick={onVote}
              className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
            >
              Vote
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function DecisionItem({ decision }: { decision: Decision }) {
  const isPositive =
    decision.outcome === 'passed' || decision.outcome === 'certified'

  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
      <div
        className={`p-1.5 rounded-full ${
          isPositive
            ? 'bg-emerald-100 dark:bg-emerald-900/30'
            : 'bg-red-100 dark:bg-red-900/30'
        }`}
      >
        {isPositive ? (
          <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
          {decision.title}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {formatDate(decision.decidedAt)} • {decision.participationRate}% turnout
        </p>
      </div>
      <span
        className={`text-xs font-medium ${
          isPositive
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-red-600 dark:text-red-400'
        }`}
      >
        {decision.outcome.charAt(0).toUpperCase() + decision.outcome.slice(1)}
      </span>
    </div>
  )
}

export function GovernanceDashboard({
  summary,
  elections,
  proposals,
  committees,
  decisions,
  onViewElection,
  onViewProposal,
  onVote,
  onSubmitProposal,
}: GovernanceDashboardProps) {
  const activeElections = elections.filter(
    (e) => e.status === 'voting' || e.status === 'nominations'
  )
  const activeProposals = proposals.filter(
    (p) => p.status === 'voting' || p.status === 'discussion'
  )
  const recentDecisions = decisions.slice(0, 5)

  // Icon components for stat cards
  const VoteIcon = (
    <svg className={`w-5 h-5 ${summary.userVotesPending > 0 ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  )
  const CalendarIcon = (
    <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
  const FileIcon = (
    <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
  const TrendIcon = (
    <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Governance
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Participate in elections and community decisions
            </p>
          </div>
          <button
            onClick={onSubmitProposal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Submit Proposal
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <StatCard
            icon={VoteIcon}
            label="Votes Pending"
            value={summary.userVotesPending}
            highlight={summary.userVotesPending > 0}
          />
          <StatCard
            icon={CalendarIcon}
            label="Active Elections"
            value={summary.activeElections}
          />
          <StatCard
            icon={FileIcon}
            label="Open Proposals"
            value={summary.pendingProposals}
          />
          <StatCard
            icon={TrendIcon}
            label="Participation Rate"
            value={`${summary.participationRate}%`}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Elections Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Elections
              </h2>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {activeElections.length} active
              </span>
            </div>
            {activeElections.length > 0 ? (
              <div className="space-y-3">
                {activeElections.map((election) => (
                  <ElectionCard
                    key={election.id}
                    election={election}
                    onView={() => onViewElection?.(election.id)}
                    onVote={() => onVote?.('election', election.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
                <svg className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <p className="text-slate-500 dark:text-slate-400">
                  No active elections
                </p>
              </div>
            )}

            {/* Proposals */}
            <div className="flex items-center justify-between mt-8">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Proposals
              </h2>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {activeProposals.length} active
              </span>
            </div>
            {activeProposals.length > 0 ? (
              <div className="space-y-3">
                {activeProposals.map((proposal) => (
                  <ProposalCard
                    key={proposal.id}
                    proposal={proposal}
                    onView={() => onViewProposal?.(proposal.id)}
                    onVote={() => onVote?.('proposal', proposal.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
                <svg className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-slate-500 dark:text-slate-400">
                  No active proposals
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Committees */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Active Committees
              </h3>
              <div className="space-y-2">
                {committees.slice(0, 4).map((committee) => (
                  <div
                    key={committee.id}
                    className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {committee.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {committee.memberCount} members
                      </p>
                    </div>
                    {committee.isOpen && (
                      <span className="text-xs text-indigo-600 dark:text-indigo-400">
                        Open
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Decisions */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Recent Decisions
              </h3>
              {recentDecisions.length > 0 ? (
                <div>
                  {recentDecisions.map((decision) => (
                    <DecisionItem key={decision.id} decision={decision} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
                  No recent decisions
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
