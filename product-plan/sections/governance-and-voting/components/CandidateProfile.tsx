import React from 'react'
import type {
  Candidate,
  Endorsement,
  Position,
  Election,
  CandidateProfileProps,
} from '../types'

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

// Sub-components
function EndorsementCard({ endorsement }: { endorsement: Endorsement }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-sm font-medium text-indigo-700 dark:text-indigo-400 flex-shrink-0">
          {endorsement.endorserName.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className="font-medium text-slate-900 dark:text-white">{endorsement.endorserName}</p>
            <span className="text-xs text-slate-500 dark:text-slate-400">{formatRelativeTime(endorsement.createdAt)}</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">{endorsement.statement}</p>
        </div>
      </div>
    </div>
  )
}

function QualificationItem({ qualification }: { qualification: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <p className="text-sm text-slate-700 dark:text-slate-300">{qualification}</p>
    </div>
  )
}

function EndorseModal({
  candidateName,
  onClose,
  onSubmit,
}: {
  candidateName: string
  onClose: () => void
  onSubmit: (statement: string) => void
}) {
  const [statement, setStatement] = React.useState('')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Endorse {candidateName}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Share why you support this candidate. Your endorsement will be visible to all members.
          </p>
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Your endorsement statement
            </label>
            <textarea
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              rows={4}
              placeholder="I endorse this candidate because..."
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (statement.trim()) {
                  onSubmit(statement)
                  onClose()
                }
              }}
              disabled={!statement.trim()}
              className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                statement.trim()
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              Submit Endorsement
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function AskQuestionModal({
  candidateName,
  onClose,
  onSubmit,
}: {
  candidateName: string
  onClose: () => void
  onSubmit: (question: string) => void
}) {
  const [question, setQuestion] = React.useState('')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Ask {candidateName} a Question</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Your question will be sent to the candidate and their response will be shared publicly.
          </p>
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Your question
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={4}
              placeholder="What is your position on..."
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (question.trim()) {
                  onSubmit(question)
                  onClose()
                }
              }}
              disabled={!question.trim()}
              className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                question.trim()
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              Submit Question
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main component
export function CandidateProfile({
  candidate,
  endorsements,
  position,
  election,
  onEndorse,
  onAskQuestion,
  onShare,
}: CandidateProfileProps) {
  const [showEndorseModal, setShowEndorseModal] = React.useState(false)
  const [showQuestionModal, setShowQuestionModal] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<'platform' | 'qualifications' | 'endorsements'>('platform')

  const handleShare = () => {
    onShare?.(candidate.id)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 dark:from-indigo-900 dark:to-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <img
              src={candidate.photoUrl}
              alt={candidate.name}
              className="w-32 h-32 rounded-2xl object-cover border-4 border-white/20 shadow-xl"
            />
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-3 mb-3">
                <h1 className="text-3xl font-bold text-white">{candidate.name}</h1>
                {candidate.isIncumbent && (
                  <span className="inline-flex items-center px-3 py-1 bg-white/20 text-white text-sm rounded-full">
                    Incumbent
                  </span>
                )}
              </div>
              <p className="text-indigo-100 mb-2">
                Candidate for <span className="font-semibold">{position.title}</span>
              </p>
              <p className="text-indigo-200 text-sm mb-4">
                {election.title} • Voting ends {formatDate(election.votingEndDate)}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <div className="flex items-center gap-1.5 text-white">
                  <svg className="w-5 h-5 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  <span className="font-semibold">{candidate.endorsementCount}</span>
                  <span className="text-indigo-200">endorsements</span>
                </div>
                <span className="text-indigo-300">•</span>
                <span className="text-indigo-200 text-sm">
                  Nominated {formatDate(candidate.nominatedAt)}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setShowEndorseModal(true)}
                className="px-6 py-2.5 bg-white text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors"
              >
                Endorse
              </button>
              <button
                onClick={handleShare}
                className="px-6 py-2.5 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 w-fit mb-8">
          {(['platform', 'qualifications', 'endorsements'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {tab}
              {tab === 'endorsements' && (
                <span className="ml-1.5 text-xs">({endorsements.length})</span>
              )}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'platform' && (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Platform Statement</h2>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                    {candidate.platformStatement}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'qualifications' && (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  Qualifications ({candidate.qualifications.length})
                </h2>
                <div className="space-y-3">
                  {candidate.qualifications.map((qualification, index) => (
                    <QualificationItem key={index} qualification={qualification} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'endorsements' && (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Endorsements ({endorsements.length})
                  </h2>
                  <button
                    onClick={() => setShowEndorseModal(true)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Endorsement
                  </button>
                </div>
                {endorsements.length > 0 ? (
                  <div className="space-y-3">
                    {endorsements.map(endorsement => (
                      <EndorsementCard key={endorsement.id} endorsement={endorsement} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      No endorsements yet. Be the first to endorse this candidate.
                    </p>
                    <button
                      onClick={() => setShowEndorseModal(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Endorse {candidate.name}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Position Info */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Position Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Position</p>
                  <p className="font-medium text-slate-900 dark:text-white">{position.title}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Term Length</p>
                  <p className="font-medium text-slate-900 dark:text-white">{position.termLength} year{position.termLength > 1 ? 's' : ''}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Term Limit</p>
                  <p className="font-medium text-slate-900 dark:text-white">{position.termLimitCount} consecutive terms</p>
                </div>
                {position.responsibilities.length > 0 && (
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Responsibilities</p>
                    <ul className="space-y-1">
                      {position.responsibilities.slice(0, 4).map((resp, index) => (
                        <li key={index} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                          <span className="text-indigo-500 mt-0.5">•</span>
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Ask a Question */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Have a Question?</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Ask {candidate.name.split(' ')[0]} about their positions or plans for the role.
              </p>
              <button
                onClick={() => setShowQuestionModal(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Ask a Question
              </button>
            </div>

            {/* Election Info */}
            <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-6">
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Election Info</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Status</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    election.status === 'voting'
                      ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400'
                      : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Voting Ends</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{formatDate(election.votingEndDate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Votes Cast</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{election.votescast}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showEndorseModal && (
        <EndorseModal
          candidateName={candidate.name}
          onClose={() => setShowEndorseModal(false)}
          onSubmit={(statement) => onEndorse?.(candidate.id, statement)}
        />
      )}
      {showQuestionModal && (
        <AskQuestionModal
          candidateName={candidate.name}
          onClose={() => setShowQuestionModal(false)}
          onSubmit={(question) => onAskQuestion?.(candidate.id, question)}
        />
      )}
    </div>
  )
}
