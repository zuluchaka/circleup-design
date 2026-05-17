import { useState } from 'react'
import { ListOrdered, Calendar, CheckCircle2, Clock, Wallet } from 'lucide-react'
import type {
  PayoutScheduleProps,
  PayoutScheduleStatus,
  CircleFrequency,
} from '@/../product/sections/rosca-circles/types'

const STATUS_COLORS: Record<PayoutScheduleStatus, { bg: string; text: string; dot: string }> = {
  completed: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    text: 'text-emerald-700 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  upcoming: {
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    text: 'text-indigo-700 dark:text-indigo-400',
    dot: 'bg-indigo-500',
  },
  scheduled: {
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-700 dark:text-slate-400',
    dot: 'bg-slate-400',
  },
}

const FREQUENCY_LABELS: Record<CircleFrequency, string> = {
  weekly: 'Weekly',
  bi_weekly: 'Bi-weekly',
  monthly: 'Monthly',
}

type Filter = 'all' | 'upcoming' | 'completed' | 'mine'

export function PayoutSchedule({
  circle,
  schedule,
  currentUserId,
  onBack,
  onRequestSwap,
  onExportCalendar,
}: PayoutScheduleProps) {
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')

  const myEntry = schedule.find((s) => s.recipientId === currentUserId)
  const upcomingEntries = schedule.filter((s) => s.status === 'upcoming' || s.status === 'scheduled')
  const completedEntries = schedule.filter((s) => s.status === 'completed')

  const getDaysUntil = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const filteredSchedule = schedule.filter((entry) => {
    if (filter === 'upcoming' && entry.status === 'completed') return false
    if (filter === 'completed' && entry.status !== 'completed') return false
    if (filter === 'mine' && entry.recipientId !== currentUserId) return false
    if (search && !(entry.recipientName || '').toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: schedule.length },
    { key: 'upcoming', label: 'Upcoming', count: upcomingEntries.length },
    { key: 'completed', label: 'Completed', count: completedEntries.length },
    { key: 'mine', label: 'My Payout', count: myEntry ? 1 : 0 },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ListOrdered className="w-6 h-6 text-indigo-500" />
                  Payout Schedule
                </h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {circle.name} • {FREQUENCY_LABELS[circle.frequency]} payouts
                </p>
              </div>
            </div>
            {onExportCalendar && (
              <button
                onClick={onExportCalendar}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Export
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400">
              <div className="text-2xl font-bold">{completedEntries.length}</div>
              <p className="text-sm font-medium mt-0.5 opacity-80">Completed</p>
            </div>
            <div className="rounded-xl px-4 py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400">
              <div className="text-2xl font-bold">{upcomingEntries.length}</div>
              <p className="text-sm font-medium mt-0.5 opacity-80">Remaining</p>
            </div>
            <div className="rounded-xl px-4 py-3 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">
              <div className="text-2xl font-bold truncate">
                {myEntry ? `#${myEntry.cycle}` : '—'}
              </div>
              <p className="text-sm font-medium mt-0.5 opacity-80">My Position</p>
            </div>
            <div className="rounded-xl px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
              <div className="text-2xl font-bold truncate">
                {circle.currency} {(circle.contributionAmount * circle.maxParticipants).toLocaleString()}
              </div>
              <p className="text-sm font-medium mt-0.5 opacity-80">Per Payout</p>
            </div>
          </div>

          {/* Search + Filters */}
          <div className="mt-6 space-y-3">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by recipient..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                    filter === f.key
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {f.label}
                  {f.count > 0 && (
                    <span className={`ml-0.5 px-1.5 py-0.5 text-xs rounded-full ${
                      filter === f.key
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      {f.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* My Payout Highlight */}
        {myEntry && filter !== 'completed' && (
          <div className={`rounded-xl p-6 ${
            myEntry.status === 'completed'
              ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
              : 'bg-gradient-to-r from-indigo-500 to-purple-600'
          }`}>
            {myEntry.status === 'completed' ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
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
                    <p className="text-indigo-100 text-sm flex items-center gap-1.5">
                      <Wallet className="w-4 h-4" /> Your Payout Position
                    </p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-4xl font-bold">#{myEntry.cycle}</span>
                      <span className="text-indigo-200">of {circle.duration}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-indigo-100 text-sm">Expected Payout</p>
                    <p className="text-3xl font-bold mt-1">
                      {circle.currency} {myEntry.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-lg bg-white/10 backdrop-blur">
                    <p className="text-indigo-100 text-xs uppercase tracking-wide">Scheduled Date</p>
                    <p className="text-base font-semibold mt-1">
                      {new Date(myEntry.scheduledDate).toLocaleDateString('en-US', {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/10 backdrop-blur">
                    <p className="text-indigo-100 text-xs uppercase tracking-wide flex items-center gap-1"><Clock className="w-3 h-3" /> Countdown</p>
                    <p className="text-2xl font-bold mt-1">{getDaysUntil(myEntry.scheduledDate)} days</p>
                  </div>
                </div>
                {onRequestSwap && myEntry.status !== 'upcoming' && (
                  <button
                    onClick={() => onRequestSwap?.(myEntry.recipientId)}
                    className="mt-4 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white font-medium text-sm transition-colors"
                  >
                    Request Position Swap
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Schedule list */}
        {filteredSchedule.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <ListOrdered className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium">No payouts found</p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Try adjusting your filters or search.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSchedule.map((entry) => {
              const isMe = entry.recipientId === currentUserId
              const isCurrent = entry.isCurrent
              const statusStyle = STATUS_COLORS[entry.status]

              return (
                <div
                  key={`${entry.cycle}-${entry.recipientId}`}
                  className={`bg-white dark:bg-slate-900 rounded-xl border p-5 transition-colors ${
                    isCurrent
                      ? 'border-indigo-300 dark:border-indigo-700 ring-2 ring-indigo-100 dark:ring-indigo-900/30'
                      : isMe
                      ? 'border-amber-300 dark:border-amber-800'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="flex-shrink-0 relative">
                        {entry.recipientAvatar ? (
                          <img
                            src={entry.recipientAvatar}
                            alt={entry.recipientName}
                            className={`w-12 h-12 rounded-full object-cover ${isMe ? 'ring-2 ring-amber-500' : ''}`}
                          />
                        ) : (
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${
                            isMe
                              ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 ring-2 ring-amber-500'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}>
                            {(entry.recipientName || '?').charAt(0)}
                          </div>
                        )}
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {entry.cycle}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={`font-semibold ${isMe ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>
                            {entry.recipientName}
                          </p>
                          {isMe && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-medium">
                              You
                            </span>
                          )}
                          {isCurrent && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-medium">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          Cycle {entry.cycle} • {new Date(entry.scheduledDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 sm:ml-auto">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                        {entry.status}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {circle.currency} {entry.amount.toLocaleString()}
                      </span>
                      {onRequestSwap && !isMe && entry.status !== 'completed' && myEntry?.status !== 'completed' && (
                        <button
                          onClick={() => onRequestSwap(entry.recipientId)}
                          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
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
        )}
      </main>
    </div>
  )
}
