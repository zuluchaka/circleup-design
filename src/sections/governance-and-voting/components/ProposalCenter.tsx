import React from 'react'
import type {
  Proposal,
  ProposalCenterProps,
  ProposalStatus,
  ProposalCategory,
  VoteChoice,
} from '@/../product/sections/governance-and-voting/types'

// Helper functions
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return formatDate(dateString)
}

function getStatusConfig(status: ProposalStatus): { label: string; className: string; icon: string } {
  const configs: Record<ProposalStatus, { label: string; className: string; icon: string }> = {
    draft: { label: 'Draft', className: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
    discussion: { label: 'Discussion', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    voting: { label: 'Voting', className: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    passed: { label: 'Passed', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' },
    implemented: { label: 'Implemented', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', icon: 'M5 13l4 4L19 7' },
    withdrawn: { label: 'Withdrawn', className: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400', icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' },
  }
  return configs[status]
}

function getCategoryConfig(category: ProposalCategory): { label: string; className: string } {
  const configs: Record<ProposalCategory, { label: string; className: string }> = {
    financial: { label: 'Financial', className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' },
    governance: { label: 'Governance', className: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400' },
    programs: { label: 'Programs', className: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' },
    partnerships: { label: 'Partnerships', className: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' },
    bylaws: { label: 'Bylaws', className: 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400' },
    other: { label: 'Other', className: 'bg-slate-50 text-slate-700 dark:bg-slate-700 dark:text-slate-300' },
  }
  return configs[category]
}

// Sub-components
function StatusBadge({ status }: { status: ProposalStatus }) {
  const config = getStatusConfig(status)
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={config.icon} />
      </svg>
      {config.label}
    </span>
  )
}

function CategoryBadge({ category }: { category: ProposalCategory }) {
  const config = getCategoryConfig(category)
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}

function VoteProgress({ proposal }: { proposal: Proposal }) {
  const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.abstentions
  const forPercent = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0
  const againstPercent = totalVotes > 0 ? (proposal.votesAgainst / totalVotes) * 100 : 0
  const abstainPercent = totalVotes > 0 ? (proposal.abstentions / totalVotes) * 100 : 0
  const participationRate = proposal.totalEligibleVoters > 0
    ? Math.round((totalVotes / proposal.totalEligibleVoters) * 100)
    : 0

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600 dark:text-slate-400">Vote Progress</span>
        <span className="font-medium text-slate-900 dark:text-white">{totalVotes} of {proposal.totalEligibleVoters} votes</span>
      </div>
      <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
        {forPercent > 0 && (
          <div className="bg-emerald-500" style={{ width: `${forPercent}%` }} />
        )}
        {againstPercent > 0 && (
          <div className="bg-red-500" style={{ width: `${againstPercent}%` }} />
        )}
        {abstainPercent > 0 && (
          <div className="bg-slate-400" style={{ width: `${abstainPercent}%` }} />
        )}
      </div>
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-400">For: {proposal.votesFor}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-slate-600 dark:text-slate-400">Against: {proposal.votesAgainst}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span className="text-slate-600 dark:text-slate-400">Abstain: {proposal.abstentions}</span>
          </span>
        </div>
        <span className="text-slate-500 dark:text-slate-400">{participationRate}% participation</span>
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
  onVote?: (choice: VoteChoice) => void
}) {
  const isVoting = proposal.status === 'voting'

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-2 mb-2">
              <StatusBadge status={proposal.status} />
              <CategoryBadge category={proposal.category} />
            </div>
            <h3
              className="text-lg font-semibold text-slate-900 dark:text-white mb-2 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              onClick={onView}
            >
              {proposal.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
              {proposal.description}
            </p>
          </div>
        </div>

        {/* Sponsor Info */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400">Sponsored by</span>
            <span className="font-medium text-slate-900 dark:text-white">{proposal.sponsorName}</span>
          </div>
          {proposal.coSponsors.length > 0 && (
            <span className="text-slate-400 dark:text-slate-500">
              +{proposal.coSponsors.length} co-sponsor{proposal.coSponsors.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Voting Progress (if in voting phase) */}
        {['voting', 'passed', 'rejected'].includes(proposal.status) && (
          <div className="mb-4">
            <VoteProgress proposal={proposal} />
          </div>
        )}

        {/* Timeline */}
        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
          <span>Submitted {formatRelativeTime(proposal.submittedAt)}</span>
          {proposal.votingEndDate && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Voting ends {formatDate(proposal.votingEndDate)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onView}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {proposal.commentCount} Comments
          </button>
          {isVoting && (
            <>
              <button
                onClick={() => onVote?.('for')}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Vote For
              </button>
              <button
                onClick={() => onVote?.('against')}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Vote Against
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterBar({
  selectedStatus,
  selectedCategory,
  onStatusChange,
  onCategoryChange,
}: {
  selectedStatus: ProposalStatus | 'all'
  selectedCategory: ProposalCategory | 'all'
  onStatusChange: (status: ProposalStatus | 'all') => void
  onCategoryChange: (category: ProposalCategory | 'all') => void
}) {
  const statuses: (ProposalStatus | 'all')[] = ['all', 'draft', 'discussion', 'voting', 'passed', 'rejected', 'implemented', 'withdrawn']
  const categories: (ProposalCategory | 'all')[] = ['all', 'financial', 'governance', 'programs', 'partnerships', 'bylaws', 'other']

  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <div className="flex items-center gap-2">
        <label className="text-sm text-slate-600 dark:text-slate-400">Status:</label>
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value as ProposalStatus | 'all')}
          className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          {statuses.map(status => (
            <option key={status} value={status}>
              {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm text-slate-600 dark:text-slate-400">Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value as ProposalCategory | 'all')}
          className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

function CreateProposalModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Submit Proposal</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Proposal Title
            </label>
            <input
              type="text"
              placeholder="Enter a clear, concise title for your proposal"
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Category
            </label>
            <select className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">Select a category</option>
              <option value="financial">Financial</option>
              <option value="governance">Governance</option>
              <option value="programs">Programs</option>
              <option value="partnerships">Partnerships</option>
              <option value="bylaws">Bylaws</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Description
            </label>
            <textarea
              rows={6}
              placeholder="Describe your proposal in detail. Include the problem you're addressing, your proposed solution, and expected outcomes..."
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Supporting Documents
            </label>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors cursor-pointer">
              <svg className="w-10 h-10 text-slate-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Drag and drop files here, or <span className="text-indigo-600 dark:text-indigo-400 font-medium">browse</span>
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">PDF, DOC, or images up to 10MB</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Co-Sponsors (Optional)
            </label>
            <input
              type="text"
              placeholder="Search for members to add as co-sponsors..."
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <div className="sticky bottom-0 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
          <button className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            Save as Draft
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
              Submit for Review
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main component
export function ProposalCenter({
  proposals,
  comments: _comments,
  onSubmitProposal: _onSubmitProposal,
  onAddComment: _onAddComment,
  onVote,
  onViewProposal,
  onFilter,
}: ProposalCenterProps) {
  const [selectedStatus, setSelectedStatus] = React.useState<ProposalStatus | 'all'>('all')
  const [selectedCategory, setSelectedCategory] = React.useState<ProposalCategory | 'all'>('all')
  const [showCreateModal, setShowCreateModal] = React.useState(false)

  const filteredProposals = proposals.filter(proposal => {
    if (selectedStatus !== 'all' && proposal.status !== selectedStatus) return false
    if (selectedCategory !== 'all' && proposal.category !== selectedCategory) return false
    return true
  })

  const handleStatusChange = (status: ProposalStatus | 'all') => {
    setSelectedStatus(status)
    onFilter?.({ status: status === 'all' ? undefined : status })
  }

  const handleCategoryChange = (category: ProposalCategory | 'all') => {
    setSelectedCategory(category)
    onFilter?.({ category: category === 'all' ? undefined : category })
  }

  // Stats
  const activeProposals = proposals.filter(p => ['discussion', 'voting'].includes(p.status))
  const votingProposals = proposals.filter(p => p.status === 'voting')
  const passedProposals = proposals.filter(p => p.status === 'passed')

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Proposal Center</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Submit, discuss, and track proposals through their lifecycle
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Submit Proposal
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Proposals</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{proposals.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Active</p>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{activeProposals.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Currently Voting</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{votingProposals.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Passed</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{passedProposals.length}</p>
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBar
          selectedStatus={selectedStatus}
          selectedCategory={selectedCategory}
          onStatusChange={handleStatusChange}
          onCategoryChange={handleCategoryChange}
        />

        {/* Proposals Grid */}
        {filteredProposals.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredProposals.map(proposal => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                onView={() => onViewProposal?.(proposal.id)}
                onVote={(choice) => onVote?.(proposal.id, choice)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No Proposals Found</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4 max-w-md mx-auto">
              {selectedStatus !== 'all' || selectedCategory !== 'all'
                ? 'No proposals match your current filters. Try adjusting your filters or submit a new proposal.'
                : 'Be the first to submit a proposal and start the conversation.'}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Submit Proposal
            </button>
          </div>
        )}
      </div>

      {/* Create Proposal Modal */}
      {showCreateModal && <CreateProposalModal onClose={() => setShowCreateModal(false)} />}
    </div>
  )
}
