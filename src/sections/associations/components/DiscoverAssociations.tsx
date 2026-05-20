import { useState } from 'react'
import type { DiscoverableAssociation, AssociationType, EligibilityCheck } from '@/../product/sections/associations/types'
import { AssociationTypeBadge } from './AssociationTypeBadge'

export interface DiscoverAssociationsProps {
  associations: DiscoverableAssociation[]
  loading?: boolean
  error?: string | null
  onRequestToJoin?: (id: string, message: string) => Promise<void> | void
  onSearch?: (query: string) => void
  onBack?: () => void
}

const typeFilters: { value: AssociationType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'religious', label: 'Religious' },
  { value: 'professional', label: 'Professional' },
  { value: 'savings', label: 'Savings' },
  { value: 'social', label: 'Social' },
  { value: 'family', label: 'Family' },
]

export function DiscoverAssociations({
  associations,
  loading = false,
  error,
  onRequestToJoin,
  onSearch,
  onBack,
}: DiscoverAssociationsProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<AssociationType | 'all'>('all')
  const [joiningId, setJoiningId] = useState<string | null>(null)
  const [joinSuccess, setJoinSuccess] = useState<string | null>(null)
  const [joinError, setJoinError] = useState<string | null>(null)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [preCheckAssociation, setPreCheckAssociation] = useState<DiscoverableAssociation | null>(null)
  const [preCheckMessage, setPreCheckMessage] = useState('')

  const filteredAssociations = associations.filter((assoc) => {
    const matchesSearch =
      assoc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assoc.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'all' || assoc.type === selectedType
    const matchesVerified = !verifiedOnly || assoc.isVerified
    return matchesSearch && matchesType && matchesVerified
  })

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch?.(query)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Discover Associations
              </h1>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                Find and join communities that match your interests
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by name or description..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-500"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                className={`
                  flex-shrink-0 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors flex items-center gap-1.5
                  ${verifiedOnly
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }
                `}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Verified Only
              </button>
              {typeFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedType(filter.value)}
                  className={`
                    flex-shrink-0 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors
                    ${
                      selectedType === filter.value
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }
                  `}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Results */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 mx-auto mb-4 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-slate-500 dark:text-slate-400">Loading associations...</p>
          </div>
        ) : filteredAssociations.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No associations found
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 dark:text-slate-500 mb-6">
              {filteredAssociations.length} {filteredAssociations.length === 1 ? 'association' : 'associations'} found
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssociations.map((association) => {
                const statusColor = association.status === 'active'
                  ? 'bg-emerald-500'
                  : association.status === 'draft'
                  ? 'bg-amber-500'
                  : association.status === 'suspended'
                  ? 'bg-red-500'
                  : 'bg-slate-400'

                const statusAccent = association.status === 'active'
                  ? 'from-emerald-500 to-teal-500'
                  : association.status === 'draft'
                  ? 'from-amber-500 to-orange-500'
                  : association.status === 'suspended'
                  ? 'from-red-500 to-rose-500'
                  : 'from-slate-400 to-slate-500'

                return (
                <article
                  key={association.id}
                  className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300"
                >
                  {/* Status accent strip */}
                  <div className={`h-1 w-full bg-gradient-to-r ${statusAccent}`} />

                  {/* Top row: Reference + Status indicator */}
                  <div className="px-5 pt-4 pb-0 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${statusColor} ${association.status === 'active' ? 'animate-pulse' : ''}`} />
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {association.status === 'active' ? 'Active' : association.status === 'draft' ? 'Setting up' : association.status === 'suspended' ? 'Suspended' : 'Dissolved'}
                      </span>
                    </div>
                    {association.reference && (
                      <span className="text-[10px] font-mono tracking-wide text-slate-400 dark:text-slate-500">
                        {association.reference}
                      </span>
                    )}
                  </div>

                  {/* Logo + Name */}
                  <div className="px-5 pt-3 pb-0 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 ring-2 ring-white dark:ring-slate-900 shadow-sm">
                      {association.logo ? (
                        <img
                          src={association.logo}
                          alt={association.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-base font-bold">
                          {association.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 text-sm">
                        {association.name}
                      </h3>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {association.language.toUpperCase()}{association.country ? ` · ${association.country}` : ''}
                      </span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="px-5 pt-2.5 flex items-center gap-1.5 flex-wrap">
                    {association.isVerified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Verified Partner
                      </span>
                    )}
                    <AssociationTypeBadge type={association.type} />
                    <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      association.visibility === 'public'
                        ? 'bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400'
                        : 'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
                    }`}>
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {association.visibility === 'public' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        )}
                      </svg>
                      {association.visibility === 'public' ? 'Public' : 'Invite Only'}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="px-5 pt-3 flex-1">
                    <p className="text-[13px] leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
                      {association.description}
                    </p>
                  </div>

                  {/* Stats + Action */}
                  <div className="px-5 pt-4 pb-5 mt-auto">
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-medium">{association.memberCount}</span> {association.memberCount === 1 ? 'member' : 'members'}
                      </div>
                      {association.activeCircles > 0 && (
                        <>
                          <span className="w-px h-3 bg-slate-200 dark:bg-slate-700" />
                          <div className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">{association.activeCircles}</span> {association.activeCircles === 1 ? 'circle' : 'circles'}
                          </div>
                        </>
                      )}
                    </div>
                    {association.isMember ? (
                      <div className="w-full px-4 py-2.5 text-xs font-medium text-center text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl flex items-center justify-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Joined
                      </div>
                    ) : association.isPending ? (
                      <div className="w-full px-4 py-2.5 text-xs font-medium text-center text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl flex items-center justify-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Pending Approval
                      </div>
                    ) : joinSuccess === association.id ? (
                      <div className="w-full px-4 py-2.5 text-xs font-medium text-center text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl flex items-center justify-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Request Sent
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setJoinError(null)
                            setPreCheckMessage('')
                            setPreCheckAssociation(association)
                          }}
                          disabled={joiningId === association.id}
                          className="w-full px-4 py-2.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition-colors shadow-sm hover:shadow-md disabled:opacity-50 flex items-center justify-center gap-1.5"
                        >
                          {joiningId === association.id ? (
                            <>
                              <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                              Joining...
                            </>
                          ) : (
                            'Request to Join'
                          )}
                        </button>
                        {joinError && joiningId !== association.id && joinSuccess !== association.id && (
                          <p className="mt-1 text-[11px] text-red-600 dark:text-red-400 text-center">{joinError}</p>
                        )}
                      </>
                    )}
                  </div>
                </article>
                )
              })}
            </div>
          </>
        )}
      </main>

      {preCheckAssociation && (
        <PreCheckModal
          association={preCheckAssociation}
          message={preCheckMessage}
          onChangeMessage={setPreCheckMessage}
          processing={joiningId === preCheckAssociation.id}
          onClose={() => setPreCheckAssociation(null)}
          onSubmit={async () => {
            if (!preCheckAssociation) return
            setJoiningId(preCheckAssociation.id)
            setJoinError(null)
            try {
              await onRequestToJoin?.(preCheckAssociation.id, preCheckMessage.trim())
              setJoinSuccess(preCheckAssociation.id)
              setPreCheckAssociation(null)
              setPreCheckMessage('')
            } catch (e) {
              setJoinError(e instanceof Error ? e.message : 'Failed to join')
            } finally {
              setJoiningId(null)
            }
          }}
        />
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Pre-Check Modal — member-side eligibility view before submitting a request
// ---------------------------------------------------------------------------

interface PreCheckModalProps {
  association: DiscoverableAssociation
  message: string
  processing: boolean
  onChangeMessage: (value: string) => void
  onClose: () => void
  onSubmit: () => void
}

function PreCheckModal({
  association,
  message,
  processing,
  onChangeMessage,
  onClose,
  onSubmit,
}: PreCheckModalProps) {
  const checks = association.eligibilityPreview ?? []
  const passed = checks.filter((c) => c.status === 'passed').length
  const warnings = checks.filter((c) => c.status === 'warning' || c.status === 'manual').length
  const failed = checks.filter((c) => c.status === 'failed').length
  const verdict: 'auto-approve' | 'review' | 'block' =
    failed > 0 ? 'block' : warnings > 0 ? 'review' : 'auto-approve'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {association.logo ? (
              <img src={association.logo} alt="" className="w-12 h-12 rounded-xl object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <span className="text-lg font-bold text-indigo-700 dark:text-indigo-300">{association.name.charAt(0)}</span>
              </div>
            )}
            <div className="min-w-0">
              <p className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400">REQUEST TO JOIN</p>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white truncate">{association.name}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {association.country} · {association.memberCount.toLocaleString()} members · {association.activeCircles} circles
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 flex-shrink-0"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 space-y-5">
          {/* Verdict */}
          <PreCheckVerdict verdict={verdict} />

          {/* Eligibility checks */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Your eligibility</h4>
              {checks.length > 0 && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {passed} clear · {warnings} need attention · {failed} blocking
                </p>
              )}
            </div>
            {checks.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                This association has no automated eligibility rules. Submit a request and the president will review it manually.
              </p>
            ) : (
              <ul className="space-y-2">
                {checks.map((c) => (
                  <PreCheckRow key={c.id} check={c} />
                ))}
              </ul>
            )}
          </div>

          {/* Message */}
          <div>
            <label htmlFor="prejoin-message" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Why do you want to join?
            </label>
            <textarea
              id="prejoin-message"
              value={message}
              onChange={(e) => onChangeMessage(e.target.value)}
              placeholder="Introduce yourself to the president. Mention any ties to the community, referrals, or what you hope to contribute."
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 resize-y"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">Visible to the association president when they review your request.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 dark:border-slate-800 px-6 py-4 bg-slate-50 dark:bg-slate-900/60 flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={processing || verdict === 'block'}
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Sending...
              </>
            ) : verdict === 'block' ? (
              'Resolve blocking checks first'
            ) : (
              'Submit request'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function PreCheckVerdict({ verdict }: { verdict: 'auto-approve' | 'review' | 'block' }) {
  if (verdict === 'auto-approve') {
    return (
      <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3 flex items-start gap-3">
        <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
        <div>
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">You meet every eligibility rule</p>
          <p className="text-xs text-emerald-700/80 dark:text-emerald-300/80">The president will still see your request — most clear-eligibility applicants are approved within a day or two.</p>
        </div>
      </div>
    )
  }
  if (verdict === 'review') {
    return (
      <div className="rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/20 px-4 py-3 flex items-start gap-3">
        <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01M4.93 19h14.14a2 2 0 001.74-2.99l-7.07-12.25a2 2 0 00-3.48 0L3.19 16.01A2 2 0 004.93 19z" />
        </svg>
        <div>
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">Some checks need human review</p>
          <p className="text-xs text-amber-700/80 dark:text-amber-300/80">You can still submit — the president will weigh the flagged items below alongside your message.</p>
        </div>
      </div>
    )
  }
  return (
    <div className="rounded-xl border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/20 px-4 py-3 flex items-start gap-3">
      <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
      </svg>
      <div>
        <p className="text-sm font-semibold text-red-700 dark:text-red-300">Blocking eligibility issues</p>
        <p className="text-xs text-red-700/80 dark:text-red-300/80">Resolve the failed checks below before submitting. The Submit button will unlock once they're cleared.</p>
      </div>
    </div>
  )
}

function PreCheckRow({ check }: { check: EligibilityCheck }) {
  const tone = {
    passed: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50',
      icon: 'text-emerald-600 dark:text-emerald-400',
      label: 'text-emerald-700 dark:text-emerald-300',
      path: 'M5 13l4 4L19 7',
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50',
      icon: 'text-amber-600 dark:text-amber-400',
      label: 'text-amber-700 dark:text-amber-300',
      path: 'M12 9v2m0 4h.01M4.93 19h14.14a2 2 0 001.74-2.99l-7.07-12.25a2 2 0 00-3.48 0L3.19 16.01A2 2 0 004.93 19z',
    },
    failed: {
      bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50',
      icon: 'text-red-600 dark:text-red-400',
      label: 'text-red-700 dark:text-red-300',
      path: 'M6 18L18 6M6 6l12 12',
    },
    manual: {
      bg: 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700',
      icon: 'text-slate-500 dark:text-slate-400',
      label: 'text-slate-700 dark:text-slate-200',
      path: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093M12 17h.01',
    },
  }[check.status]

  return (
    <li className={`flex items-start gap-3 rounded-lg border p-3 ${tone.bg}`}>
      <div className={`w-6 h-6 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center flex-shrink-0 ${tone.icon}`}>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={tone.path} />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${tone.label}`}>{check.label}</p>
        {check.detail && (
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{check.detail}</p>
        )}
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-wider ${tone.label}`}>
        {check.status === 'manual' ? 'Action needed' : check.status}
      </span>
    </li>
  )
}
