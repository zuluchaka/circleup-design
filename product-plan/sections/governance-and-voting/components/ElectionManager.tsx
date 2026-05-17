import React from 'react'
import type {
  Election,
  Position,
  Candidate,
  ElectionManagerProps,
  ElectionStatus,
  CandidateStatus,
} from '../types'

// Helper functions
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function getElectionStatusConfig(status: ElectionStatus): { label: string; className: string } {
  const configs: Record<ElectionStatus, { label: string; className: string }> = {
    draft: { label: 'Draft', className: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300' },
    nominations: { label: 'Nominations Open', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
    voting: { label: 'Voting Active', className: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400' },
    closed: { label: 'Closed', className: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400' },
    certified: { label: 'Certified', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
    cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  }
  return configs[status]
}

function getCandidateStatusConfig(status: CandidateStatus): { label: string; className: string } {
  const configs: Record<CandidateStatus, { label: string; className: string }> = {
    pending: { label: 'Pending Review', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
    approved: { label: 'Approved', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
    rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
    withdrawn: { label: 'Withdrawn', className: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400' },
  }
  return configs[status]
}

// Sub-components
function StatusBadge({ status, type }: { status: ElectionStatus | CandidateStatus; type: 'election' | 'candidate' }) {
  const config = type === 'election'
    ? getElectionStatusConfig(status as ElectionStatus)
    : getCandidateStatusConfig(status as CandidateStatus)

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}

function ElectionCard({
  election,
  positions,
  candidates,
  onView,
  onEdit,
  onCertify,
}: {
  election: Election
  positions: Position[]
  candidates: Candidate[]
  onView?: () => void
  onEdit?: () => void
  onCertify?: () => void
}) {
  const electionPositions = positions.filter(p => election.positionIds.includes(p.id))
  const electionCandidates = candidates.filter(c => c.electionId === election.id)
  const pendingCandidates = electionCandidates.filter(c => c.status === 'pending')
  const participationRate = election.eligibleVoterCount > 0
    ? Math.round((election.votescast / election.eligibleVoterCount) * 100)
    : 0

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
                {election.title}
              </h3>
              <StatusBadge status={election.status} type="election" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
              {election.description}
            </p>
          </div>
        </div>

        {/* Positions */}
        <div className="mb-4">
          <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Positions ({electionPositions.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {electionPositions.map(position => (
              <span
                key={position.id}
                className="inline-flex items-center px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg"
              >
                {position.title}
              </span>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Nomination Period</p>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {formatDate(election.nominationStartDate)} - {formatDate(election.nominationEndDate)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Voting Period</p>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {formatDate(election.votingStartDate)} - {formatDate(election.votingEndDate)}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 py-4 border-t border-slate-200 dark:border-slate-700">
          <div className="text-center">
            <p className="text-2xl font-semibold text-slate-900 dark:text-white">{electionCandidates.length}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Candidates</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-slate-900 dark:text-white">{election.votescast}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Votes Cast</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-semibold ${election.quorumMet ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
              {participationRate}%
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Participation</p>
          </div>
        </div>

        {/* Pending candidates alert */}
        {pendingCandidates.length > 0 && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg mb-4 border border-amber-200 dark:border-amber-800">
            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-sm text-amber-800 dark:text-amber-200">
              {pendingCandidates.length} candidate{pendingCandidates.length > 1 ? 's' : ''} awaiting review
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onView}
            className="flex-1 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
          >
            View Details
          </button>
          {['draft', 'nominations'].includes(election.status) && (
            <button
              onClick={onEdit}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Edit
            </button>
          )}
          {election.status === 'closed' && !election.certifiedDate && (
            <button
              onClick={onCertify}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Certify Results
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function CandidateRow({
  candidate,
  position,
  onApprove,
  onReject,
}: {
  candidate: Candidate
  position: Position | undefined
  onApprove?: () => void
  onReject?: () => void
}) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
      <img
        src={candidate.photoUrl}
        alt={candidate.name}
        className="w-12 h-12 rounded-full object-cover bg-slate-200 dark:bg-slate-700"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-slate-900 dark:text-white truncate">{candidate.name}</h4>
          {candidate.isIncumbent && (
            <span className="inline-flex items-center px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs rounded-full">
              Incumbent
            </span>
          )}
          <StatusBadge status={candidate.status} type="candidate" />
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Running for: <span className="font-medium">{position?.title || 'Unknown Position'}</span>
        </p>
      </div>
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
        <span>{candidate.endorsementCount}</span>
      </div>
      {candidate.status === 'pending' && (
        <div className="flex items-center gap-2">
          <button
            onClick={onApprove}
            className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
            title="Approve candidate"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
          <button
            onClick={onReject}
            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Reject candidate"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

function CreateElectionModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Create Election</h2>
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
          {/* Election Details */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Election Title
            </label>
            <input
              type="text"
              placeholder="e.g., 2024 Board Elections"
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe the purpose of this election..."
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Positions */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Positions to Fill
            </label>
            <div className="space-y-2">
              {['President', 'Vice President', 'Treasurer', 'Secretary'].map(position => (
                <label key={position} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                  <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded border-slate-300 dark:border-slate-600 focus:ring-indigo-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{position}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Nomination Start
              </label>
              <input
                type="date"
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Nomination End
              </label>
              <input
                type="date"
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Voting Start
              </label>
              <input
                type="date"
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Voting End
              </label>
              <input
                type="date"
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Voting Options */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Voting Method
            </label>
            <select className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option value="simple_majority">Simple Majority</option>
              <option value="supermajority">Supermajority (2/3)</option>
              <option value="ranked_choice">Ranked Choice</option>
            </select>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded border-slate-300 dark:border-slate-600 focus:ring-indigo-500" />
              <span className="text-sm text-slate-700 dark:text-slate-300">Secret Ballot</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded border-slate-300 dark:border-slate-600 focus:ring-indigo-500" />
              <span className="text-sm text-slate-700 dark:text-slate-300">Allow Proxy Voting</span>
            </label>
          </div>
        </div>
        <div className="sticky bottom-0 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
            Create Election
          </button>
        </div>
      </div>
    </div>
  )
}

// Main component
export function ElectionManager({
  elections,
  positions,
  candidates,
  onCreateElection,
  onEditElection,
  onApproveCandidate,
  onRejectCandidate,
  onCertifyResults,
  onViewElection,
}: ElectionManagerProps) {
  const [activeTab, setActiveTab] = React.useState<'all' | 'active' | 'completed'>('all')
  const [showCreateModal, setShowCreateModal] = React.useState(false)
  const [selectedElection, setSelectedElection] = React.useState<string | null>(null)

  const filteredElections = elections.filter(election => {
    if (activeTab === 'active') return ['nominations', 'voting'].includes(election.status)
    if (activeTab === 'completed') return ['closed', 'certified'].includes(election.status)
    return true
  })

  const pendingCandidates = candidates.filter(c => c.status === 'pending')

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Election Manager</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Create, configure, and manage elections for leadership positions
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Election
          </button>
        </div>

        {/* Pending Candidates Alert */}
        {pendingCandidates.length > 0 && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-amber-100 dark:bg-amber-900/40 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-amber-800 dark:text-amber-200">
                  {pendingCandidates.length} Candidate{pendingCandidates.length > 1 ? 's' : ''} Awaiting Review
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Review and approve candidates before voting begins
                </p>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/60 transition-colors">
                Review Now
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit mb-6">
          {(['all', 'active', 'completed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize ${
                activeTab === tab
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab} ({tab === 'all'
                ? elections.length
                : tab === 'active'
                  ? elections.filter(e => ['nominations', 'voting'].includes(e.status)).length
                  : elections.filter(e => ['closed', 'certified'].includes(e.status)).length
              })
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Elections List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredElections.length > 0 ? (
              filteredElections.map(election => (
                <ElectionCard
                  key={election.id}
                  election={election}
                  positions={positions}
                  candidates={candidates}
                  onView={() => {
                    setSelectedElection(election.id)
                    onViewElection?.(election.id)
                  }}
                  onEdit={() => onEditElection?.(election.id, {})}
                  onCertify={() => onCertifyResults?.(election.id)}
                />
              ))
            ) : (
              <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No Elections Found</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {activeTab === 'active'
                    ? 'There are no active elections at the moment.'
                    : activeTab === 'completed'
                      ? 'No completed elections to display.'
                      : 'Create your first election to get started.'}
                </p>
                {activeTab === 'all' && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Election
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Pending Candidates */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Pending Candidates
              </h2>
              {pendingCandidates.length > 0 ? (
                <div className="space-y-3">
                  {pendingCandidates.slice(0, 5).map(candidate => (
                    <CandidateRow
                      key={candidate.id}
                      candidate={candidate}
                      position={positions.find(p => p.id === candidate.positionId)}
                      onApprove={() => onApproveCandidate?.(candidate.id)}
                      onReject={() => onRejectCandidate?.(candidate.id)}
                    />
                  ))}
                  {pendingCandidates.length > 5 && (
                    <button className="w-full py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                      View all {pendingCandidates.length} pending candidates
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    All candidates have been reviewed
                  </p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Election Statistics
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Total Elections</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{elections.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Active Elections</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {elections.filter(e => ['nominations', 'voting'].includes(e.status)).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Total Candidates</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{candidates.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Positions</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{positions.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Election Modal */}
      {showCreateModal && <CreateElectionModal onClose={() => setShowCreateModal(false)} />}
    </div>
  )
}
