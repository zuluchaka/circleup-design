import type {
  PayoutScheduleProps,
  PayoutScheduleStatus,
  CircleFrequency,
} from '../types'

const statusColors: Record<PayoutScheduleStatus, string> = {
  completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  upcoming: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  scheduled: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400',
}

const frequencyLabels: Record<CircleFrequency, string> = {
  weekly: 'Weekly',
  bi_weekly: 'Bi-weekly',
  monthly: 'Monthly',
}

export function PayoutSchedule({
  circle,
  schedule,
  currentUserId,
  onRequestSwap,
  onExportCalendar,
}: PayoutScheduleProps) {
  const myEntry = schedule.find((s) => s.recipientId === currentUserId)
  const currentEntry = schedule.find((s) => s.isCurrent)
  const upcomingEntries = schedule.filter((s) => s.status === 'upcoming' || s.status === 'scheduled')
  const completedEntries = schedule.filter((s) => s.status === 'completed')

  // Calculate days until my payout
  const getDaysUntil = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                Payout Schedule
              </h1>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                {circle.name} • {frequencyLabels[circle.frequency]} payouts
              </p>
            </div>
            {onExportCalendar && (
              <button
                onClick={onExportCalendar}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Export to Calendar
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* My Payout Highlight */}
        {myEntry && (
          <div className="mb-8">
            <div className={`rounded-xl p-6 ${
              myEntry.status === 'completed'
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
                : 'bg-gradient-to-r from-indigo-500 to-purple-600'
            }`}>
              {myEntry.status === 'completed' ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                      <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400">Your Payout</p>
                      <p className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                        Received on {new Date(myEntry.scheduledDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                    {circle.currency} {myEntry.amount.toLocaleString()}
                  </p>
                </div>
              ) : (
                <div className="text-white">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-indigo-100">Your Payout Position</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-4xl font-bold">#{myEntry.cycle}</span>
                        <span className="text-indigo-200">of {circle.duration}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-indigo-100">Expected Payout</p>
                      <p className="text-3xl font-bold mt-1">
                        {circle.currency} {myEntry.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 p-4 rounded-lg bg-white/10 backdrop-blur">
                      <p className="text-indigo-100 text-sm">Scheduled Date</p>
                      <p className="text-lg font-semibold">
                        {new Date(myEntry.scheduledDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-white/10 backdrop-blur text-center">
                      <p className="text-indigo-100 text-sm">Countdown</p>
                      <p className="text-2xl font-bold">
                        {getDaysUntil(myEntry.scheduledDate)} days
                      </p>
                    </div>
                  </div>
                  {onRequestSwap && myEntry.status !== 'upcoming' && (
                    <button
                      onClick={() => onRequestSwap?.(myEntry.recipientId)}
                      className="mt-4 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white font-medium transition-colors"
                    >
                      Request Position Swap
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Current/Next Payout */}
        {currentEntry && currentEntry.recipientId !== currentUserId && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Current Cycle
            </h2>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-indigo-200 dark:border-indigo-800 p-6">
              <div className="flex items-center gap-4">
                {currentEntry.recipientAvatar ? (
                  <img
                    src={currentEntry.recipientAvatar}
                    alt={currentEntry.recipientName}
                    className="w-14 h-14 rounded-full object-cover ring-4 ring-indigo-100 dark:ring-indigo-900/40"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center ring-4 ring-indigo-50 dark:ring-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xl font-semibold">
                    {currentEntry.recipientName.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 dark:text-white text-lg">
                    {currentEntry.recipientName}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400">
                    Receiving payout on {new Date(currentEntry.scheduledDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColors[currentEntry.status]}`}>
                    {currentEntry.status}
                  </span>
                  <p className="text-xl font-bold text-slate-900 dark:text-white mt-2">
                    {circle.currency} {currentEntry.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Schedule Timeline */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
            Full Schedule
          </h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />

            <div className="space-y-6">
              {schedule.map((entry, idx) => {
                const isMe = entry.recipientId === currentUserId
                const isCurrent = entry.isCurrent

                return (
                  <div
                    key={`${entry.cycle}-${entry.recipientId}`}
                    className={`relative pl-16 ${isCurrent ? 'py-4 -mx-4 px-20 rounded-lg bg-indigo-50 dark:bg-indigo-900/20' : ''}`}
                  >
                    {/* Timeline dot */}
                    <div
                      className={`absolute left-4 w-4 h-4 rounded-full border-2 ${
                        entry.status === 'completed'
                          ? 'bg-emerald-500 border-emerald-500'
                          : isCurrent
                          ? 'bg-indigo-500 border-indigo-500 ring-4 ring-indigo-100 dark:ring-indigo-900/40'
                          : isMe
                          ? 'bg-amber-500 border-amber-500'
                          : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600'
                      }`}
                    />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {entry.recipientAvatar ? (
                          <img
                            src={entry.recipientAvatar}
                            alt={entry.recipientName}
                            className={`w-10 h-10 rounded-full object-cover ${isMe ? 'ring-2 ring-amber-500' : ''}`}
                          />
                        ) : (
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                            isMe
                              ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 ring-2 ring-amber-500'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                          }`}>
                            {entry.recipientName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className={`font-medium ${isMe ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>
                              {entry.recipientName}
                              {isMe && <span className="ml-1 text-sm">(You)</span>}
                            </p>
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Cycle {entry.cycle} • {new Date(entry.scheduledDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[entry.status]}`}>
                          {entry.status}
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {circle.currency} {entry.amount.toLocaleString()}
                        </span>
                        {onRequestSwap && !isMe && entry.status !== 'completed' && myEntry?.status !== 'completed' && (
                          <button
                            onClick={() => onRequestSwap(entry.recipientId)}
                            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            Swap
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {completedEntries.length}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Completed</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 text-center">
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {upcomingEntries.length}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Remaining</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {circle.currency} {(circle.contributionAmount * circle.maxParticipants).toLocaleString()}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Per Payout</p>
          </div>
        </div>
      </div>
    </div>
  )
}
