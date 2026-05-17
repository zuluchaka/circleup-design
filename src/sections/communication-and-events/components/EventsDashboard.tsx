import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import * as dashApi from '@/services/eventDashboardApi'

const typeColors = ['bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-sky-500', 'bg-violet-500']

interface AnalyticsSummary {
  total_events: number
  upcoming: number
  completed: number
  cancelled: number
  meetings: number
  total_registrations: number
  total_attendances: number
  avg_attendance_rate: number
}

interface AssociationBreakdown {
  associationId: string
  associationName: string
  eventCount: number
  registrationCount: number
}

interface AdminEvent {
  id: string
  associationName: string
  title: string
  eventType: string
  status: string
  startDate: string
  endDate: string
  capacity: number
  registrationCount: number
  waitlistCount: number
  organizerName: string
  isMeeting: boolean
  meetingType: string
}

interface MemberEvent {
  id: string
  title: string
  type?: string
  eventType?: string
  status: string
  startDate: string
  endDate?: string
  registrationCount?: number
  capacity?: number
  organizer?: { name: string }
}

interface EventsDashboardProps {
  isAdmin?: boolean
  memberEvents?: MemberEvent[]
}

export function EventsDashboard({ isAdmin = false, memberEvents }: EventsDashboardProps) {
  const { token } = useAuth()
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
  const [byType, setByType] = useState<Record<string, number>>({})
  const [byMonth, setByMonth] = useState<Record<string, number>>({})
  const [byAssociation, setByAssociation] = useState<AssociationBreakdown[]>([])
  const [events, setEvents] = useState<AdminEvent[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [loading, setLoading] = useState(isAdmin)
  const [error, setError] = useState<string | null>(null)

  const loadAnalytics = useCallback(async () => {
    if (!token || !isAdmin) return
    setLoading(true)
    setError(null)
    try {
      const [analyticsData, eventsData] = await Promise.all([
        dashApi.fetchEventAnalytics(token),
        dashApi.fetchAdminEvents(token, statusFilter ? { status: statusFilter } : undefined),
      ])
      setSummary(analyticsData.summary)
      setByType(analyticsData.byType || {})
      setByMonth(analyticsData.byMonth || {})
      setByAssociation(analyticsData.byAssociation || [])
      setEvents(eventsData.events || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }, [token, isAdmin, statusFilter])

  useEffect(() => {
    if (isAdmin) loadAnalytics()
  }, [isAdmin, loadAnalytics])

  const handleCancel = async (eventId: string) => {
    if (!token) return
    const reason = prompt('Cancellation reason (optional):')
    try {
      await dashApi.cancelEvent(token, eventId, reason || undefined)
      loadAnalytics()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Cancel failed')
    }
  }

  // Member view — show summary from passed-in events
  if (!isAdmin) {
    const evts = memberEvents || []
    const now = new Date().toISOString()
    const upcoming = evts.filter(e => e.startDate > now && e.status !== 'cancelled')
    const past = evts.filter(e => e.startDate <= now || e.status === 'completed')
    const cancelled = evts.filter(e => e.status === 'cancelled')

    // Compute type breakdown from member events
    const memberByType: Record<string, number> = {}
    evts.forEach(e => {
      const t = e.eventType || e.type || 'other'
      memberByType[t] = (memberByType[t] || 0) + 1
    })
    const memberTypeEntries = Object.entries(memberByType).sort((a, b) => b[1] - a[1])
    const memberTypeTotal = memberTypeEntries.reduce((s, [, v]) => s + v, 0) || 1

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total Events" value={evts.length} />
          <StatCard label="Upcoming" value={upcoming.length} color="text-indigo-600 dark:text-indigo-400" />
          <StatCard label="Past" value={past.length} color="text-emerald-600 dark:text-emerald-400" />
          <StatCard label="Cancelled" value={cancelled.length} color="text-red-600 dark:text-red-400" />
        </div>

        {memberTypeEntries.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Events by Type</h3>
            <div className="space-y-3">
              {memberTypeEntries.map(([type, count], i) => (
                <div key={type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700 dark:text-slate-300 capitalize">{type}</span>
                    <span className="text-slate-500">{count}</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${typeColors[i % typeColors.length]}`}
                      style={{ width: `${(count / memberTypeTotal) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming events list */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Upcoming Events</h3>
          {upcoming.length > 0 ? (
            <div className="space-y-3">
              {upcoming.slice(0, 10).map(ev => (
                <div key={ev.id} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{ev.title}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(ev.startDate).toLocaleDateString('de-CH', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                      {ev.organizer?.name && ` \u00B7 ${ev.organizer.name}`}
                    </p>
                  </div>
                  <StatusBadge status={ev.status} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 py-4 text-center">No upcoming events</p>
          )}
        </div>

        {/* Past events */}
        {past.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Past Events</h3>
            <div className="space-y-3">
              {past.slice(0, 5).map(ev => (
                <div key={ev.id} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{ev.title}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(ev.startDate).toLocaleDateString('de-CH', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <StatusBadge status={ev.status} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Admin view — loading/error states
  if (loading && !summary) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error && !summary) {
    return (
      <div className="p-6 text-center text-red-600 dark:text-red-400">
        <p>{error}</p>
        <button onClick={loadAnalytics} className="mt-2 text-sm text-indigo-600 hover:underline">Retry</button>
      </div>
    )
  }

  const monthLabels = Object.keys(byMonth).sort()
  const maxMonthCount = Math.max(...Object.values(byMonth), 1)

  const typeEntries = Object.entries(byType).sort((a, b) => b[1] - a[1])
  const totalTypeCount = typeEntries.reduce((sum, [, v]) => sum + v, 0) || 1

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total Events" value={summary.total_events} />
          <StatCard label="Upcoming" value={summary.upcoming} color="text-indigo-600 dark:text-indigo-400" />
          <StatCard label="Completed" value={summary.completed} color="text-emerald-600 dark:text-emerald-400" />
          <StatCard label="Cancelled" value={summary.cancelled} color="text-red-600 dark:text-red-400" />
          <StatCard label="Meetings" value={summary.meetings} />
          <StatCard label="Registrations" value={summary.total_registrations} />
          <StatCard label="Attendances" value={summary.total_attendances} />
          <StatCard label="Avg Attendance" value={`${summary.avg_attendance_rate}%`} color="text-emerald-600 dark:text-emerald-400" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Events per Month (Last 12)</h3>
          {monthLabels.length > 0 ? (
            <div className="flex items-end gap-1 h-40">
              {monthLabels.map(month => {
                const count = byMonth[month] || 0
                const height = (count / maxMonthCount) * 100
                return (
                  <div key={month} className="flex-1 flex flex-col items-center justify-end gap-1">
                    <span className="text-xs text-slate-500">{count}</span>
                    <div
                      className="w-full bg-indigo-500 rounded-t"
                      style={{ height: `${Math.max(height, 4)}%` }}
                    />
                    <span className="text-[10px] text-slate-400 truncate w-full text-center">
                      {month.slice(5)}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-400 py-8 text-center">No data yet</p>
          )}
        </div>

        {/* By Type */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Events by Type</h3>
          {typeEntries.length > 0 ? (
            <div className="space-y-3">
              {typeEntries.map(([type, count], i) => (
                <div key={type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700 dark:text-slate-300 capitalize">{type}</span>
                    <span className="text-slate-500">{count}</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${typeColors[i % typeColors.length]}`}
                      style={{ width: `${(count / totalTypeCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 py-8 text-center">No data yet</p>
          )}
        </div>
      </div>

      {/* By Association */}
      {byAssociation.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Events by Association</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                  <th className="pb-2 font-medium">Association</th>
                  <th className="pb-2 font-medium text-right">Events</th>
                  <th className="pb-2 font-medium text-right">Registrations</th>
                </tr>
              </thead>
              <tbody>
                {byAssociation.map(a => (
                  <tr key={a.associationId} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-2 text-slate-900 dark:text-white">{a.associationName || 'Unknown'}</td>
                    <td className="py-2 text-right text-slate-600 dark:text-slate-300">{a.eventCount}</td>
                    <td className="py-2 text-right text-slate-600 dark:text-slate-300">{a.registrationCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admin Events Table */}
      {isAdmin && (
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">All Events</h3>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-sm border border-slate-300 dark:border-slate-600 rounded px-2 py-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              <option value="">All statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                  <th className="pb-2 font-medium">Title</th>
                  <th className="pb-2 font-medium">Association</th>
                  <th className="pb-2 font-medium">Type</th>
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium text-right">Reg.</th>
                  <th className="pb-2 font-medium text-right">Wait</th>
                  {isAdmin && <th className="pb-2 font-medium text-right">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {events.map(ev => (
                  <tr key={ev.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-2 text-slate-900 dark:text-white font-medium">
                      {ev.title}
                      {ev.isMeeting && (
                        <span className="ml-1 text-xs text-indigo-500">[{ev.meetingType}]</span>
                      )}
                    </td>
                    <td className="py-2 text-slate-600 dark:text-slate-300">{ev.associationName}</td>
                    <td className="py-2 capitalize text-slate-600 dark:text-slate-300">{ev.eventType}</td>
                    <td className="py-2 text-slate-600 dark:text-slate-300">
                      {ev.startDate ? new Date(ev.startDate).toLocaleDateString('de-CH') : '-'}
                    </td>
                    <td className="py-2">
                      <StatusBadge status={ev.status} />
                    </td>
                    <td className="py-2 text-right text-slate-600 dark:text-slate-300">
                      {ev.registrationCount}{ev.capacity ? `/${ev.capacity}` : ''}
                    </td>
                    <td className="py-2 text-right text-slate-600 dark:text-slate-300">{ev.waitlistCount}</td>
                    {isAdmin && (
                      <td className="py-2 text-right">
                        {ev.status !== 'cancelled' && ev.status !== 'completed' && (
                          <button
                            onClick={() => handleCancel(ev.id)}
                            className="text-xs text-red-600 hover:text-red-800 dark:text-red-400"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">No events found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${color || 'text-slate-900 dark:text-white'}`}>{value}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    published: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${styles[status] || styles.draft}`}>
      {status}
    </span>
  )
}
