import type { CircleDiscoveryProps, CircleFilters, CircleFrequency, CircleStatus, PayoutMethod } from '../types'

const frequencyLabels: Record<CircleFrequency, string> = {
  weekly: 'Weekly',
  bi_weekly: 'Bi-weekly',
  monthly: 'Monthly',
}

const statusColors: Record<CircleStatus, string> = {
  forming: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  completed: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

const payoutMethodLabels: Record<PayoutMethod, string> = {
  fixed: 'Fixed Rotation',
  random: 'Random',
  bidding: 'Bidding',
  lottery: 'Lottery',
  trust_score: 'Trust-Based',
  need_based: 'Need-Based',
}

export function CircleDiscovery({
  circles,
  recommendations,
  onViewCircle,
  onJoinCircle,
  onJoinWaitlist,
  onFilter,
  onSearch,
}: CircleDiscoveryProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Discover Circles
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Find and join rotating savings circles that match your goals
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
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
                  placeholder="Search circles by name, organizer, or description..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  onChange={(e) => onSearch?.(e.target.value)}
                />
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <select
                className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500"
                onChange={(e) =>
                  onFilter?.({ frequency: e.target.value as CircleFrequency })
                }
              >
                <option value="">All Frequencies</option>
                <option value="weekly">Weekly</option>
                <option value="bi_weekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
              </select>

              <select
                className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500"
                onChange={(e) =>
                  onFilter?.({ status: e.target.value as CircleStatus })
                }
              >
                <option value="">All Statuses</option>
                <option value="forming">Forming</option>
                <option value="active">Active</option>
              </select>

              <select
                className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500"
                onChange={(e) =>
                  onFilter?.({ payoutMethod: e.target.value as PayoutMethod })
                }
              >
                <option value="">All Payout Methods</option>
                <option value="fixed">Fixed Rotation</option>
                <option value="bidding">Bidding</option>
                <option value="lottery">Lottery</option>
                <option value="trust_score">Trust-Based</option>
              </select>
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        {recommendations && recommendations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-amber-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Recommended for You
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recommendations.slice(0, 3).map((rec) => (
                <div
                  key={rec.circleId}
                  className="bg-gradient-to-br from-indigo-50 to-amber-50 dark:from-indigo-900/20 dark:to-amber-900/20 rounded-xl p-4 border border-indigo-200 dark:border-indigo-800"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {rec.circleName}
                    </h3>
                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                      {rec.matchScore}% match
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <p>
                      {rec.contributionAmount.toLocaleString()} •{' '}
                      {frequencyLabels[rec.frequency]}
                    </p>
                    <p>{rec.spotsAvailable} spots available</p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {rec.matchReasons.slice(0, 2).map((reason, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => onViewCircle?.(rec.circleId)}
                    className="mt-4 w-full py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors"
                  >
                    View Circle
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Circles Grid */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            All Circles ({circles.length})
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {circles.map((circle) => (
              <div
                key={circle.id}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Card Header */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                        {circle.name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        by {circle.organizerName}
                      </p>
                    </div>
                    <span
                      className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[circle.status]}`}
                    >
                      {circle.status}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  {/* Contribution Amount */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Contribution
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {circle.currency}{' '}
                      {circle.contributionAmount.toLocaleString()}
                    </span>
                  </div>

                  {/* Frequency */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Frequency
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {frequencyLabels[circle.frequency]}
                    </span>
                  </div>

                  {/* Members */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Members
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {circle.currentParticipants}/{circle.maxParticipants}
                    </span>
                  </div>

                  {/* Payout Method */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Payout
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {payoutMethodLabels[circle.payoutMethod]}
                    </span>
                  </div>

                  {/* Organizer Trust Score */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Organizer Rating
                    </span>
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4 text-amber-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-slate-700 dark:text-slate-300">
                        {circle.organizerTrustScore}
                      </span>
                    </div>
                  </div>

                  {/* Start Date */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Starts
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {new Date(circle.startDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 pt-0 flex gap-2">
                  <button
                    onClick={() => onViewCircle?.(circle.id)}
                    className="flex-1 py-2 px-4 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    View Details
                  </button>
                  {circle.currentParticipants < circle.maxParticipants ? (
                    <button
                      onClick={() => onJoinCircle?.(circle.id)}
                      className="flex-1 py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors"
                    >
                      Join
                    </button>
                  ) : (
                    <button
                      onClick={() => onJoinWaitlist?.(circle.id)}
                      className="flex-1 py-2 px-4 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm transition-colors"
                    >
                      Waitlist
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {circles.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto w-12 h-12 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">
              No circles found
            </h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
