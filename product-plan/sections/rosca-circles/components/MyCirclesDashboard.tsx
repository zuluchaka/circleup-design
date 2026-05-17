import type { MyCirclesProps, CircleFrequency, CircleStatus } from '../types'

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

export function MyCirclesDashboard({
  circles,
  participations,
  onViewCircle,
  onMakeContribution,
  onCreate,
}: MyCirclesProps) {
  const getParticipation = (circleId: string) => {
    return participations.find((p) => p.circleId === circleId)
  }

  const activeCircles = circles.filter((c) => c.status === 'active')
  const formingCircles = circles.filter((c) => c.status === 'forming')
  const completedCircles = circles.filter((c) => c.status === 'completed')

  // Calculate summary stats
  const totalContributed = participations.reduce((sum, p) => sum + p.totalContributed, 0)
  const upcomingPayouts = circles
    .filter((c) => c.status === 'active')
    .map((c) => {
      const participation = getParticipation(c.id)
      return participation && !participation.payoutReceived ? c : null
    })
    .filter(Boolean).length

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                My Circles
              </h1>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                Manage your rotating savings circles
              </p>
            </div>
            <button
              onClick={onCreate}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Circle
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">Active Circles</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {activeCircles.length}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Contributed</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              ${totalContributed.toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">Upcoming Payouts</p>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
              {upcomingPayouts}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">Completed</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {completedCircles.length}
            </p>
          </div>
        </div>

        {/* Active Circles */}
        {activeCircles.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Active Circles
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeCircles.map((circle) => {
                const participation = getParticipation(circle.id)
                const progress = (circle.currentCycle / circle.duration) * 100

                return (
                  <div
                    key={circle.id}
                    className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {circle.name}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {circle.associationName}
                          </p>
                        </div>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[circle.status]}`}>
                          {circle.status}
                        </span>
                      </div>

                      {/* Progress Ring */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative w-16 h-16">
                          <svg className="w-16 h-16 transform -rotate-90">
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="currentColor"
                              strokeWidth="6"
                              fill="none"
                              className="text-slate-200 dark:text-slate-700"
                            />
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="currentColor"
                              strokeWidth="6"
                              fill="none"
                              strokeDasharray={`${progress * 1.76} 176`}
                              className="text-indigo-600 dark:text-indigo-400"
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-slate-900 dark:text-white">
                            {circle.currentCycle}/{circle.duration}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Cycle {circle.currentCycle} of {circle.duration}
                          </p>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {circle.currency} {circle.contributionAmount.toLocaleString()} {frequencyLabels[circle.frequency]}
                          </p>
                        </div>
                      </div>

                      {/* Payout Position Badge */}
                      {participation && (
                        <div className="flex items-center gap-2 mb-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Position #{participation.payoutPosition || 'TBD'}
                          </span>
                          {participation.payoutReceived && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Paid Out
                            </span>
                          )}
                        </div>
                      )}

                      {/* Next Payment Due */}
                      {circle.nextContributionDue && (
                        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 mb-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-amber-600 dark:text-amber-400 uppercase tracking-wide font-medium">
                                Next Payment Due
                              </p>
                              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mt-0.5">
                                {new Date(circle.nextContributionDue).toLocaleDateString()}
                              </p>
                            </div>
                            <button
                              onClick={() => onMakeContribution?.(circle.id)}
                              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium transition-colors"
                            >
                              Pay Now
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <button
                        onClick={() => onViewCircle?.(circle.id)}
                        className="w-full py-2 px-4 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Forming Circles */}
        {formingCircles.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Forming
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {formingCircles.map((circle) => (
                <div
                  key={circle.id}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {circle.name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Starts {new Date(circle.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[circle.status]}`}>
                      {circle.status}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-500 dark:text-slate-400">Members</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {circle.currentParticipants}/{circle.maxParticipants}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className="h-2 rounded-full bg-amber-500"
                        style={{ width: `${(circle.currentParticipants / circle.maxParticipants) * 100}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => onViewCircle?.(circle.id)}
                    className="w-full py-2 px-4 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Completed Circles */}
        {completedCircles.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              Completed
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {completedCircles.map((circle) => {
                const participation = getParticipation(circle.id)

                return (
                  <div
                    key={circle.id}
                    className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 opacity-75"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {circle.name}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {circle.duration} cycles completed
                        </p>
                      </div>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[circle.status]}`}>
                        {circle.status}
                      </span>
                    </div>

                    {participation && (
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        <p>Total contributed: {circle.currency} {participation.totalContributed.toLocaleString()}</p>
                      </div>
                    )}

                    <button
                      onClick={() => onViewCircle?.(circle.id)}
                      className="w-full mt-4 py-2 px-4 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      View History
                    </button>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Empty State */}
        {circles.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">
              No circles yet
            </h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Create your first savings circle or browse existing circles to join
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={onCreate}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
              >
                Create Circle
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
