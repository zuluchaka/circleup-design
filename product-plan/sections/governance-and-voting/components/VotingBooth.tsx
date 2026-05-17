import React from 'react'
import type {
  Election,
  Proposal,
  Candidate,
  Vote,
  VotingBoothProps,
  VoteChoice,
  Position,
} from '../types'

// Helper functions
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatTimeRemaining(endDate: string): string {
  const end = new Date(endDate)
  const now = new Date()
  const diffMs = end.getTime() - now.getTime()

  if (diffMs <= 0) return 'Voting ended'

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  if (days > 0) return `${days}d ${hours}h remaining`
  if (hours > 0) return `${hours}h ${minutes}m remaining`
  return `${minutes}m remaining`
}

// Sub-components
function VotingHeader({
  title,
  description,
  endDate,
  type,
}: {
  title: string
  description: string
  endDate: string
  type: 'election' | 'proposal'
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
              type === 'election'
                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
            }`}>
              {type === 'election' ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Election
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Proposal
                </>
              )}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{title}</h1>
          <p className="text-slate-600 dark:text-slate-400">{description}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Voting ends</p>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">{formatDate(endDate)}</p>
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{formatTimeRemaining(endDate)}</p>
        </div>
      </div>
    </div>
  )
}

function CandidateOption({
  candidate,
  isSelected,
  onSelect,
}: {
  candidate: Candidate
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
        isSelected
          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
          : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 bg-white dark:bg-slate-800'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="relative">
          <img
            src={candidate.photoUrl}
            alt={candidate.name}
            className="w-16 h-16 rounded-full object-cover bg-slate-200 dark:bg-slate-700"
          />
          {isSelected && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-900 dark:text-white">{candidate.name}</h3>
            {candidate.isIncumbent && (
              <span className="inline-flex items-center px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs rounded-full">
                Incumbent
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
            {candidate.platformStatement}
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              {candidate.endorsementCount} endorsements
            </span>
            <span>{candidate.qualifications.length} qualifications</span>
          </div>
        </div>
        <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
          isSelected
            ? 'border-indigo-500 bg-indigo-500'
            : 'border-slate-300 dark:border-slate-600'
        }`}>
          {isSelected && (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </button>
  )
}

function ProposalVoteOption({
  choice,
  label,
  description,
  isSelected,
  onSelect,
  colorClass,
}: {
  choice: VoteChoice
  label: string
  description: string
  isSelected: boolean
  onSelect: () => void
  colorClass: string
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
        isSelected
          ? `${colorClass} border-current`
          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          isSelected ? 'bg-current/10' : 'bg-slate-100 dark:bg-slate-700'
        }`}>
          {choice === 'for' && (
            <svg className={`w-5 h-5 ${isSelected ? 'text-current' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {choice === 'against' && (
            <svg className={`w-5 h-5 ${isSelected ? 'text-current' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {choice === 'abstain' && (
            <svg className={`w-5 h-5 ${isSelected ? 'text-current' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold mb-1 ${
            isSelected ? 'text-current' : 'text-slate-900 dark:text-white'
          }`}>{label}</h3>
          <p className={`text-sm ${
            isSelected ? 'text-current/70' : 'text-slate-600 dark:text-slate-400'
          }`}>{description}</p>
        </div>
        <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
          isSelected
            ? 'border-current bg-current'
            : 'border-slate-300 dark:border-slate-600'
        }`}>
          {isSelected && (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </button>
  )
}

function VoteConfirmation({
  type,
  selection,
  onConfirm,
  onCancel,
}: {
  type: 'election' | 'proposal'
  selection: string | VoteChoice
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Confirm Your Vote</h2>
          <p className="text-slate-600 dark:text-slate-400">
            {type === 'election'
              ? 'Please review your selection before submitting.'
              : 'Please confirm your vote on this proposal.'}
          </p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 mb-6">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Your vote:</p>
          <p className="font-semibold text-slate-900 dark:text-white text-lg capitalize">{selection}</p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-amber-800 dark:text-amber-200">
              This action cannot be undone. Once submitted, your vote will be recorded.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Submit Vote
          </button>
        </div>
      </div>
    </div>
  )
}

function AlreadyVotedMessage({
  existingVote,
  allowChange,
  onChangeVote,
}: {
  existingVote: Vote
  allowChange: boolean
  onChangeVote?: () => void
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center">
      <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Vote Recorded</h2>
      <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
        Thank you for participating! Your vote was recorded on {formatDate(existingVote.castAt)}.
      </p>
      <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 inline-block mb-6">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Your vote:</p>
        <p className="font-semibold text-slate-900 dark:text-white text-lg capitalize">
          {existingVote.choice || (existingVote.positionVotes?.length ? 'Ballot Submitted' : 'Unknown')}
        </p>
      </div>
      {allowChange && (
        <div>
          <button
            onClick={onChangeVote}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Change Vote
          </button>
        </div>
      )}
    </div>
  )
}

// Main component
export function VotingBooth({
  election,
  proposal,
  candidates,
  existingVote,
  allowChangeVote,
  onSubmitVote,
  onChangeVote,
  onAbstain,
}: VotingBoothProps) {
  const [selectedCandidate, setSelectedCandidate] = React.useState<string | null>(null)
  const [selectedChoice, setSelectedChoice] = React.useState<VoteChoice | null>(null)
  const [showConfirmation, setShowConfirmation] = React.useState(false)
  const [isChangingVote, setIsChangingVote] = React.useState(false)

  const isElection = !!election
  const title = election?.title || proposal?.title || 'Vote'
  const description = election?.description || proposal?.description || ''
  const endDate = election?.votingEndDate || proposal?.votingEndDate || ''

  // If already voted and not changing
  if (existingVote && !isChangingVote) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <VotingHeader
            title={title}
            description={description}
            endDate={endDate}
            type={isElection ? 'election' : 'proposal'}
          />
          <AlreadyVotedMessage
            existingVote={existingVote}
            allowChange={allowChangeVote}
            onChangeVote={() => setIsChangingVote(true)}
          />
        </div>
      </div>
    )
  }

  const handleSubmit = () => {
    if (isElection && selectedCandidate) {
      onSubmitVote?.({
        type: 'election',
        electionId: election.id,
        positionVotes: [{ positionId: election.positionIds[0], candidateId: selectedCandidate }],
      })
    } else if (proposal && selectedChoice) {
      onSubmitVote?.({
        type: 'proposal',
        proposalId: proposal.id,
        choice: selectedChoice,
      })
    }
    setShowConfirmation(false)
  }

  const canSubmit = isElection ? !!selectedCandidate : !!selectedChoice

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <VotingHeader
          title={title}
          description={description}
          endDate={endDate}
          type={isElection ? 'election' : 'proposal'}
        />

        {/* Voting Content */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          {isElection ? (
            // Election Ballot
            <>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Select Your Candidate
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Review each candidate's platform and qualifications before making your selection.
                </p>
              </div>
              <div className="space-y-4 mb-6">
                {candidates?.map(candidate => (
                  <CandidateOption
                    key={candidate.id}
                    candidate={candidate}
                    isSelected={selectedCandidate === candidate.id}
                    onSelect={() => setSelectedCandidate(candidate.id)}
                  />
                ))}
              </div>
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => {
                    setSelectedCandidate(null)
                    onAbstain?.()
                  }}
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  I prefer to abstain from this election
                </button>
              </div>
            </>
          ) : (
            // Proposal Vote
            <>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Cast Your Vote
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Choose how you would like to vote on this proposal.
                </p>
              </div>
              <div className="space-y-4">
                <ProposalVoteOption
                  choice="for"
                  label="Vote For"
                  description="Support this proposal and approve it moving forward."
                  isSelected={selectedChoice === 'for'}
                  onSelect={() => setSelectedChoice('for')}
                  colorClass="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                />
                <ProposalVoteOption
                  choice="against"
                  label="Vote Against"
                  description="Oppose this proposal and reject it from moving forward."
                  isSelected={selectedChoice === 'against'}
                  onSelect={() => setSelectedChoice('against')}
                  colorClass="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                />
                <ProposalVoteOption
                  choice="abstain"
                  label="Abstain"
                  description="Choose not to vote for or against. Your participation will still count toward quorum."
                  isSelected={selectedChoice === 'abstain'}
                  onSelect={() => setSelectedChoice('abstain')}
                  colorClass="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                />
              </div>
            </>
          )}

          {/* Submit Button */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {isElection
                  ? selectedCandidate
                    ? `Selected: ${candidates?.find(c => c.id === selectedCandidate)?.name}`
                    : 'No candidate selected'
                  : selectedChoice
                    ? `Selected: ${selectedChoice.charAt(0).toUpperCase() + selectedChoice.slice(1)}`
                    : 'No choice selected'
                }
              </p>
              <button
                onClick={() => setShowConfirmation(true)}
                disabled={!canSubmit}
                className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  canSubmit
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                }`}
              >
                Submit Vote
              </button>
            </div>
          </div>
        </div>

        {/* Accessibility Note */}
        <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <strong className="text-slate-700 dark:text-slate-300">Accessibility:</strong> Use Tab to navigate between options, Space or Enter to select, and Escape to cancel.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <VoteConfirmation
          type={isElection ? 'election' : 'proposal'}
          selection={
            isElection
              ? candidates?.find(c => c.id === selectedCandidate)?.name || ''
              : selectedChoice || ''
          }
          onConfirm={handleSubmit}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </div>
  )
}
