import React from 'react'
import type {
  Decision,
  DecisionArchiveProps,
  DecisionOutcome,
} from '../types'

// Helper functions
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatDateFull(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function getOutcomeConfig(outcome: DecisionOutcome): { label: string; className: string; icon: string } {
  const configs: Record<DecisionOutcome, { label: string; className: string; icon: string }> = {
    passed: {
      label: 'Passed',
      className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    rejected: {
      label: 'Rejected',
      className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    certified: {
      label: 'Certified',
      className: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
      icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
    },
    tied: {
      label: 'Tied',
      className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    quorum_not_met: {
      label: 'Quorum Not Met',
      className: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
      icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    },
  }
  return configs[outcome]
}

// Sub-components
function OutcomeBadge({ outcome }: { outcome: DecisionOutcome }) {
  const config = getOutcomeConfig(outcome)
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={config.icon} />
      </svg>
      {config.label}
    </span>
  )
}

function TypeBadge({ type }: { type: 'election' | 'proposal' }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
      type === 'election'
        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
    }`}>
      {type === 'election' ? 'Election' : 'Proposal'}
    </span>
  )
}

function DecisionCard({
  decision,
  onView,
  onSelect,
  isSelected,
}: {
  decision: Decision
  onView?: () => void
  onSelect?: () => void
  isSelected?: boolean
}) {
  const hasVotes = decision.votesFor !== undefined

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-xl border-2 overflow-hidden transition-all cursor-pointer ${
        isSelected
          ? 'border-indigo-500'
          : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600'
      }`}
      onClick={onSelect}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center flex-wrap gap-2">
            <TypeBadge type={decision.type} />
            <OutcomeBadge outcome={decision.outcome} />
          </div>
          {onSelect && (
            <div className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center ${
              isSelected
                ? 'border-indigo-500 bg-indigo-500'
                : 'border-slate-300 dark:border-slate-600'
            }`}>
              {isSelected && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          )}
        </div>

        <h3
          className="text-lg font-semibold text-slate-900 dark:text-white mb-2 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            onView?.()
          }}
        >
          {decision.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
          {decision.description}
        </p>

        {/* Vote Results */}
        {hasVotes && (
          <div className="mb-4">
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-slate-600 dark:text-slate-400">For: {decision.votesFor}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-slate-600 dark:text-slate-400">Against: {decision.votesAgainst}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span className="text-slate-600 dark:text-slate-400">Abstain: {decision.abstentions}</span>
              </span>
            </div>
          </div>
        )}

        {/* Election Winners */}
        {decision.winners && decision.winners.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Winners
            </p>
            <div className="space-y-2">
              {decision.winners.map(winner => (
                <div key={winner.positionId} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">{winner.positionTitle}</span>
                  <span className="font-medium text-slate-900 dark:text-white">{winner.winnerName}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(decision.decidedAt)}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {decision.participationRate}% participation
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function DecisionDetail({
  decision,
  onClose,
  onExport,
}: {
  decision: Decision
  onClose: () => void
  onExport?: (format: 'pdf' | 'csv') => void
}) {
  const hasVotes = decision.votesFor !== undefined
  const totalVotes = (decision.votesFor || 0) + (decision.votesAgainst || 0) + (decision.abstentions || 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TypeBadge type={decision.type} />
            <OutcomeBadge outcome={decision.outcome} />
          </div>
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
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{decision.title}</h2>
            <p className="text-slate-600 dark:text-slate-400">{decision.description}</p>
          </div>

          {/* Timeline */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Decision Made</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{formatDateFull(decision.decidedAt)}</p>
                </div>
              </div>
              {decision.certifiedAt && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Certified</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{formatDateFull(decision.certifiedAt)}</p>
                  </div>
                </div>
              )}
              {decision.implementedAt && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Implemented</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{formatDateFull(decision.implementedAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Vote Results */}
          {hasVotes && (
            <div>
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Vote Results</h3>
              <div className="space-y-3">
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                  {(decision.votesFor || 0) > 0 && (
                    <div
                      className="bg-emerald-500"
                      style={{ width: `${((decision.votesFor || 0) / totalVotes) * 100}%` }}
                    />
                  )}
                  {(decision.votesAgainst || 0) > 0 && (
                    <div
                      className="bg-red-500"
                      style={{ width: `${((decision.votesAgainst || 0) / totalVotes) * 100}%` }}
                    />
                  )}
                  {(decision.abstentions || 0) > 0 && (
                    <div
                      className="bg-slate-400"
                      style={{ width: `${((decision.abstentions || 0) / totalVotes) * 100}%` }}
                    />
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{decision.votesFor}</p>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300">For</p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{decision.votesAgainst}</p>
                    <p className="text-xs text-red-700 dark:text-red-300">Against</p>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-slate-600 dark:text-slate-400">{decision.abstentions}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Abstain</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Election Winners */}
          {decision.winners && decision.winners.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Elected Officials</h3>
              <div className="space-y-2">
                {decision.winners.map(winner => (
                  <div
                    key={winner.positionId}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{winner.winnerName}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{winner.positionTitle}</p>
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">{winner.voteCount} votes</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Participation */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <span className="text-slate-600 dark:text-slate-400">Participation Rate</span>
            <span className="text-xl font-bold text-slate-900 dark:text-white">{decision.participationRate}%</span>
          </div>
        </div>
        <div className="sticky bottom-0 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={() => onExport?.('pdf')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export PDF
          </button>
          <button
            onClick={() => onExport?.('csv')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>
    </div>
  )
}

function FilterBar({
  typeFilter,
  outcomeFilter,
  onTypeChange,
  onOutcomeChange,
}: {
  typeFilter: 'all' | 'election' | 'proposal'
  outcomeFilter: DecisionOutcome | 'all'
  onTypeChange: (type: 'all' | 'election' | 'proposal') => void
  onOutcomeChange: (outcome: DecisionOutcome | 'all') => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <label className="text-sm text-slate-600 dark:text-slate-400">Type:</label>
        <select
          value={typeFilter}
          onChange={(e) => onTypeChange(e.target.value as 'all' | 'election' | 'proposal')}
          className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">All Types</option>
          <option value="election">Elections</option>
          <option value="proposal">Proposals</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm text-slate-600 dark:text-slate-400">Outcome:</label>
        <select
          value={outcomeFilter}
          onChange={(e) => onOutcomeChange(e.target.value as DecisionOutcome | 'all')}
          className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">All Outcomes</option>
          <option value="passed">Passed</option>
          <option value="rejected">Rejected</option>
          <option value="certified">Certified</option>
          <option value="tied">Tied</option>
          <option value="quorum_not_met">Quorum Not Met</option>
        </select>
      </div>
    </div>
  )
}

// Main component
export function DecisionArchive({
  decisions,
  onViewDecision,
  onExport,
  onFilter,
}: DecisionArchiveProps) {
  const [typeFilter, setTypeFilter] = React.useState<'all' | 'election' | 'proposal'>('all')
  const [outcomeFilter, setOutcomeFilter] = React.useState<DecisionOutcome | 'all'>('all')
  const [selectedDecisions, setSelectedDecisions] = React.useState<Set<string>>(new Set())
  const [viewingDecision, setViewingDecision] = React.useState<Decision | null>(null)

  const filteredDecisions = decisions.filter(decision => {
    if (typeFilter !== 'all' && decision.type !== typeFilter) return false
    if (outcomeFilter !== 'all' && decision.outcome !== outcomeFilter) return false
    return true
  })

  const handleTypeChange = (type: 'all' | 'election' | 'proposal') => {
    setTypeFilter(type)
    onFilter?.({ type: type === 'all' ? undefined : type })
  }

  const handleOutcomeChange = (outcome: DecisionOutcome | 'all') => {
    setOutcomeFilter(outcome)
    onFilter?.({ outcome: outcome === 'all' ? undefined : outcome })
  }

  const toggleSelection = (decisionId: string) => {
    const newSelection = new Set(selectedDecisions)
    if (newSelection.has(decisionId)) {
      newSelection.delete(decisionId)
    } else {
      newSelection.add(decisionId)
    }
    setSelectedDecisions(newSelection)
  }

  const handleBulkExport = (format: 'pdf' | 'csv') => {
    onExport?.(format, Array.from(selectedDecisions))
  }

  // Stats
  const passedCount = decisions.filter(d => d.outcome === 'passed' || d.outcome === 'certified').length
  const rejectedCount = decisions.filter(d => d.outcome === 'rejected').length
  const avgParticipation = decisions.length > 0
    ? Math.round(decisions.reduce((sum, d) => sum + d.participationRate, 0) / decisions.length)
    : 0

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Decision Archive</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Historical record of all governance decisions
            </p>
          </div>
          {selectedDecisions.size > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {selectedDecisions.size} selected
              </span>
              <button
                onClick={() => handleBulkExport('pdf')}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Selected
              </button>
              <button
                onClick={() => setSelectedDecisions(new Set())}
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Decisions</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{decisions.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Passed</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{passedCount}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Rejected</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{rejectedCount}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Avg. Participation</p>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{avgParticipation}%</p>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <FilterBar
            typeFilter={typeFilter}
            outcomeFilter={outcomeFilter}
            onTypeChange={handleTypeChange}
            onOutcomeChange={handleOutcomeChange}
          />
        </div>

        {/* Decision Grid */}
        {filteredDecisions.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDecisions.map(decision => (
              <DecisionCard
                key={decision.id}
                decision={decision}
                onView={() => {
                  setViewingDecision(decision)
                  onViewDecision?.(decision.id)
                }}
                onSelect={() => toggleSelection(decision.id)}
                isSelected={selectedDecisions.has(decision.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No Decisions Found</h3>
            <p className="text-slate-600 dark:text-slate-400">
              {typeFilter !== 'all' || outcomeFilter !== 'all'
                ? 'No decisions match your current filters.'
                : 'Completed elections and proposals will appear here.'}
            </p>
          </div>
        )}
      </div>

      {/* Decision Detail Modal */}
      {viewingDecision && (
        <DecisionDetail
          decision={viewingDecision}
          onClose={() => setViewingDecision(null)}
          onExport={(format) => onExport?.(format, [viewingDecision.id])}
        />
      )}
    </div>
  )
}
