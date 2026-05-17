import { useState, useEffect } from 'react'
import type { Event } from '@/../product/sections/communication-and-events/types'

export interface ConsolidatedCalendarProps {
  token: string
  fetchAllMyEvents: (token: string) => Promise<{ events: ConsolidatedEvent[] }>
  onEventClick: (event: ConsolidatedEvent) => void
}

export interface ConsolidatedEvent extends Event {
  associationName: string
}

type ViewMode = 'list' | 'month'

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function getAssociationColor(name: string): string {
  const colors = [
    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

function groupEventsByDate(events: ConsolidatedEvent[]): Map<string, ConsolidatedEvent[]> {
  const grouped = new Map<string, ConsolidatedEvent[]>()
  for (const event of events) {
    const dateKey = new Date(event.startDate).toISOString().slice(0, 10)
    const existing = grouped.get(dateKey) || []
    existing.push(event)
    grouped.set(dateKey, existing)
  }
  return grouped
}

export function ConsolidatedCalendar({
  token,
  fetchAllMyEvents,
  onEventClick,
}: ConsolidatedCalendarProps) {
  const [events, setEvents] = useState<ConsolidatedEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<ViewMode>('list')
  const [filterAssociation, setFilterAssociation] = useState<string>('all')

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    fetchAllMyEvents(token)
      .then(data => {
        if (!cancelled) setEvents(data.events)
      })
      .catch(err => {
        if (!cancelled) setError(err.message || 'Failed to load events')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => { cancelled = true }
  }, [token, fetchAllMyEvents])

  const associationNames = Array.from(new Set(events.map(e => e.associationName))).sort()

  const filteredEvents =
    filterAssociation === 'all'
      ? events
      : events.filter(e => e.associationName === filterAssociation)

  const groupedEvents = groupEventsByDate(filteredEvents)
  const sortedDates = Array.from(groupedEvents.keys()).sort()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Events</h2>
        <div className="flex items-center gap-3">
          {/* Association Filter */}
          <select
            value={filterAssociation}
            onChange={e => setFilterAssociation(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-700 border-0 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Associations</option>
            {associationNames.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>

          {/* View Toggle */}
          <div className="flex bg-slate-100 dark:bg-slate-700 rounded-xl p-1">
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                view === 'list'
                  ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setView('month')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                view === 'month'
                  ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Events Count */}
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {filteredEvents.length} upcoming event{filteredEvents.length !== 1 ? 's' : ''}{' '}
        {filterAssociation !== 'all' && `in ${filterAssociation}`}
      </p>

      {filteredEvents.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
          <svg className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-slate-500 dark:text-slate-400">No upcoming events</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map(dateKey => {
            const dayEvents = groupedEvents.get(dateKey) || []
            const displayDate = new Date(dateKey + 'T00:00:00')
            const isToday = dateKey === new Date().toISOString().slice(0, 10)

            return (
              <div key={dateKey}>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className={`text-sm font-semibold ${
                    isToday
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    {isToday ? 'Today' : displayDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </h3>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                </div>

                <div className="space-y-3">
                  {dayEvents.map(event => (
                    <button
                      key={event.id}
                      onClick={() => onEventClick(event)}
                      className="w-full text-left bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getAssociationColor(event.associationName)}`}>
                              {event.associationName}
                            </span>
                            {event.status === 'cancelled' && (
                              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                Cancelled
                              </span>
                            )}
                          </div>
                          <p className="font-medium text-slate-900 dark:text-white truncate">
                            {event.title}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {formatTime(event.startDate)}
                            {event.endDate && ` - ${formatTime(event.endDate)}`}
                          </p>
                        </div>
                        <svg className="w-5 h-5 text-slate-400 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
