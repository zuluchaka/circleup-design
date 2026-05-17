import { useState } from 'react'
import type { CircleDiscoveryProps, CircleFrequency, CircleStatus } from '@/../product/sections/rosca-circles/types'

const frequencyLabels: Record<CircleFrequency, string> = {
  weekly: 'Weekly',
  bi_weekly: 'Bi-weekly',
  monthly: 'Monthly',
}

const statusFilters: { value: CircleStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'forming', label: 'Forming' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
]

const frequencyFilters: { value: CircleFrequency | 'all'; label: string }[] = [
  { value: 'all', label: 'All Frequencies' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'bi_weekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
]

const statusColors: Record<string, { dot: string; accent: string; badge: string }> = {
  forming: {
    dot: 'bg-amber-500',
    accent: 'from-amber-500 to-orange-500',
    badge: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  active: {
    dot: 'bg-emerald-500 animate-pulse',
    accent: 'from-emerald-500 to-teal-500',
    badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  completed: {
    dot: 'bg-slate-400',
    accent: 'from-slate-400 to-slate-500',
    badge: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  },
  cancelled: {
    dot: 'bg-red-500',
    accent: 'from-red-500 to-rose-500',
    badge: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
}

export function CircleDiscovery({
  circles,
  recommendations,
  onViewCircle,
  onJoinCircle,
  onJoinWaitlist,
}: CircleDiscoveryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<CircleStatus | 'all'>('all')
  const [selectedFrequency, setSelectedFrequency] = useState<CircleFrequency | 'all'>('all')

  const filtered = circles.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.organizerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus
    const matchesFrequency = selectedFrequency === 'all' || c.frequency === selectedFrequency
    return matchesSearch && matchesStatus && matchesFrequency
  })

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Discover Circles
            </h1>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              Find and join rotating savings circles that match your goals
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, organizer, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-500"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
              {statusFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setSelectedStatus(f.value)}
                  className={`flex-shrink-0 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                    selectedStatus === f.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto">
            {frequencyFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setSelectedFrequency(f.value)}
                className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  selectedFrequency === f.value
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Results */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Recommended for You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.slice(0, 3).map((rec) => (
                <article
                  key={rec.circleId}
                  onClick={() => onViewCircle?.(rec.circleId)}
                  className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-indigo-200 dark:border-indigo-800 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer"
                >
                  <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-amber-500" />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {rec.circleName}
                      </h3>
                      <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                        {rec.matchScore}% match
                      </span>
                    </div>
                    <p className="text-[13px] text-slate-500 dark:text-slate-400">
                      {rec.contributionAmount.toLocaleString()} &middot; {frequencyLabels[rec.frequency]} &middot; {rec.spotsAvailable} spots left
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {rec.matchReasons.slice(0, 2).map((reason, idx) => (
                        <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No circles found
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 dark:text-slate-500 mb-6">
              {filtered.length} {filtered.length === 1 ? 'circle' : 'circles'} found
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((circle) => {
                const colors = statusColors[circle.status] || statusColors.forming
                const spotsLeft = circle.maxParticipants - circle.currentParticipants
                const isFull = spotsLeft <= 0

                return (
                  <article
                    key={circle.id}
                    className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300"
                  >
                    {/* Status accent strip */}
                    <div className={`h-1 w-full bg-gradient-to-r ${colors.accent}`} />

                    {/* Top row: Status + Visibility */}
                    <div className="px-5 pt-4 pb-0 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 capitalize">
                          {circle.status}
                        </span>
                      </div>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        circle.visibility === 'public'
                          ? 'bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400'
                          : 'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
                      }`}>
                        {circle.visibility === 'public' ? 'Public' : 'Invite Only'}
                      </span>
                    </div>

                    {/* Icon + Name */}
                    <div className="px-5 pt-3 pb-0 flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 ring-2 ring-white dark:ring-slate-900 shadow-sm">
                        <div className="w-full h-full bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-white text-base font-bold">
                          {circle.name.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 text-sm">
                          {circle.name}
                        </h3>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          by {circle.organizerName}
                        </span>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="px-5 pt-2.5 flex items-center gap-1.5 flex-wrap">
                      <span className={`inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full ${colors.badge}`}>
                        {circle.status}
                      </span>
                      <span className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                        {frequencyLabels[circle.frequency]}
                      </span>
                      {circle.organizerTrustScore > 0 && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {circle.organizerTrustScore}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <div className="px-5 pt-3 flex-1">
                      <p className="text-[13px] leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
                        {circle.description || `${circle.currency} ${circle.contributionAmount.toLocaleString()} contribution per cycle`}
                      </p>
                    </div>

                    {/* Stats + Action */}
                    <div className="px-5 pt-4 pb-5 mt-auto">
                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4">
                        <div className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="font-medium">{circle.currentParticipants}/{circle.maxParticipants}</span> members
                        </div>
                        <span className="w-px h-3 bg-slate-200 dark:bg-slate-700" />
                        <div className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium">{circle.currency} {circle.contributionAmount.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => onViewCircle?.(circle.id)}
                          className="flex-1 px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          View Details
                        </button>
                        {isFull ? (
                          <button
                            onClick={() => onJoinWaitlist?.(circle.id)}
                            className="flex-1 px-4 py-2.5 text-xs font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors shadow-sm hover:shadow-md"
                          >
                            Join Waitlist
                          </button>
                        ) : (
                          <button
                            onClick={() => onJoinCircle?.(circle.id)}
                            className="flex-1 px-4 py-2.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm hover:shadow-md"
                          >
                            Join Circle
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
