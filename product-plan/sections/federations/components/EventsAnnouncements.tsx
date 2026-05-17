import type { FederationEvent, FederationAnnouncement } from '../types'

interface EventsAnnouncementsProps {
  events: FederationEvent[]
  announcements: FederationAnnouncement[]
  onCreateEvent?: () => void
  onCreateAnnouncement?: () => void
}

const eventTypeIcons: Record<string, string> = {
  agm: '🏛️',
  cultural: '🎭',
  workshop: '📚',
  social: '🤝',
  training: '🎓',
}

const eventStatusStyles = {
  draft: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400',
  upcoming: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300',
  completed: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
  cancelled: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
}

const priorityStyles = {
  high: 'border-l-red-500',
  medium: 'border-l-amber-500',
  low: 'border-l-slate-400 dark:border-l-slate-600',
}

export function EventsAnnouncements({ events, announcements, onCreateEvent, onCreateAnnouncement }: EventsAnnouncementsProps) {
  return (
    <div className="space-y-6">
      {/* Events */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">
            Federation Events ({events.length})
          </h3>
          <button
            onClick={onCreateEvent}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Event
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {events.map((event) => {
            const rsvpPercent = event.capacity > 0 ? (event.rsvpCount / event.capacity * 100) : 0
            return (
              <div
                key={event.id}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">{eventTypeIcons[event.type] || '📅'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{event.title}</h4>
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${eventStatusStyles[event.status]}`}>
                        {event.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{event.description}</p>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[10px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                        </svg>
                        {new Date(event.date).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                        </svg>
                        {event.location}
                      </span>
                    </div>

                    {/* RSVP bar */}
                    {event.capacity > 0 && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">
                            {event.rsvpCount} / {event.capacity} RSVP
                          </span>
                          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">{rsvpPercent.toFixed(0)}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${rsvpPercent >= 90 ? 'bg-amber-500' : 'bg-indigo-500'}`}
                            style={{ width: `${Math.min(rsvpPercent, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* RSVP by association */}
                    {event.rsvpByAssociation.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {event.rsvpByAssociation.map((r) => (
                          <span
                            key={r.associationName}
                            className="text-[8px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                          >
                            {r.associationName.split(' ')[0]}: {r.count}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Announcements */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">
            Announcements ({announcements.length})
          </h3>
          <button
            onClick={onCreateAnnouncement}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46" />
            </svg>
            New Announcement
          </button>
        </div>

        <div className="space-y-2">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 border-l-4 ${priorityStyles[ann.priority]} p-4`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                      Federation
                    </span>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{ann.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{ann.content}</p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500 dark:text-slate-400">
                    <span>{ann.authorName} ({ann.authorRole})</span>
                    <span>{new Date(ann.publishedAt).toLocaleDateString()}</span>
                    {ann.expiresAt && (
                      <span>Expires: {new Date(ann.expiresAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
