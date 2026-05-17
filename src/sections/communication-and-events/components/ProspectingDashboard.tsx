import { useState, useMemo } from 'react'

// ============================================
// Prospecting Dashboard Types (Phase 6 — CM Events)
// ============================================

export interface ProspectingEvent {
  id: string
  eventId: string
  eventTitle?: string
  circleManagerId: string
  targetAudience: string
  budget: number
  actualCost: number
  conversionCount: number
  followUpStatus: string
  attendees: ProspectingEventAttendee[]
  attendanceRate?: number
  conversionRate?: number
  roi?: number
  createdAt?: string
}

export interface ProspectingEventAttendee {
  id: string
  name: string
  email: string
  phone?: string
  organizationName?: string
  attended: boolean
  converted: boolean
  followUpSentAt?: string
  notes?: string
}

type DateRange = 'all' | '7d' | '30d' | '90d'

interface ProspectingDashboardProps {
  events: ProspectingEvent[]
  onEventClick: (event: ProspectingEvent) => void
  onCreateEvent: () => void
}

export function ProspectingDashboard({
  events,
  onEventClick,
  onCreateEvent,
}: ProspectingDashboardProps) {
  const [dateRange, setDateRange] = useState<DateRange>('all')
  const [followUpFilter, setFollowUpFilter] = useState('')

  const filteredEvents = useMemo(() => {
    let result = events

    if (dateRange !== 'all') {
      const now = new Date()
      const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90
      const cutoff = new Date(now.getTime() - days * 86400000).toISOString()
      result = result.filter(e => (e.createdAt || '') >= cutoff)
    }

    if (followUpFilter) {
      result = result.filter(e => e.followUpStatus === followUpFilter)
    }

    return result
  }, [events, dateRange, followUpFilter])

  // Aggregated stats
  const stats = useMemo(() => {
    const totalEvents = filteredEvents.length
    const totalAttendees = filteredEvents.reduce((s, e) => s + e.attendees.length, 0)
    const totalAttended = filteredEvents.reduce(
      (s, e) => s + e.attendees.filter(a => a.attended).length, 0
    )
    const totalConversions = filteredEvents.reduce((s, e) => s + e.conversionCount, 0)
    const totalBudget = filteredEvents.reduce((s, e) => s + (e.budget || 0), 0)
    const totalCost = filteredEvents.reduce((s, e) => s + (e.actualCost || 0), 0)
    const conversionRate = totalAttended > 0 ? (totalConversions / totalAttended) * 100 : 0
    const roi = totalCost > 0 ? ((totalConversions * 100 - totalCost) / totalCost) * 100 : 0

    return {
      totalEvents,
      totalAttendees,
      totalAttended,
      totalConversions,
      totalBudget,
      totalCost,
      conversionRate,
      roi,
    }
  }, [filteredEvents])

  // Funnel data
  const funnelData = useMemo(() => {
    const invited = stats.totalAttendees
    const attended = stats.totalAttended
    const converted = stats.totalConversions
    const max = Math.max(invited, 1)
    return [
      { label: 'Invited', count: invited, pct: 100 },
      { label: 'Attended', count: attended, pct: (attended / max) * 100 },
      { label: 'Converted', count: converted, pct: (converted / max) * 100 },
    ]
  }, [stats])

  const followUpStatuses = useMemo(() => {
    const set = new Set<string>()
    events.forEach(e => { if (e.followUpStatus) set.add(e.followUpStatus) })
    return Array.from(set).sort()
  }, [events])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Prospecting Events
        </h2>
        <button
          onClick={onCreateEvent}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
        >
          + Create New Event
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Total Events" value={stats.totalEvents} />
        <StatCard
          label="Total Attendees"
          value={stats.totalAttendees}
          color="text-indigo-600 dark:text-indigo-400"
        />
        <StatCard
          label="Conversions"
          value={stats.totalConversions}
          color="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          label="Conversion Rate"
          value={`${stats.conversionRate.toFixed(1)}%`}
          color="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          label="Total Budget"
          value={`CHF ${stats.totalBudget.toLocaleString('de-CH', { minimumFractionDigits: 0 })}`}
        />
        <StatCard
          label="ROI"
          value={`${stats.roi >= 0 ? '+' : ''}${stats.roi.toFixed(1)}%`}
          color={stats.roi >= 0
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-red-600 dark:text-red-400'}
        />
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
          Conversion Funnel
        </h3>
        <div className="space-y-3">
          {funnelData.map((step, i) => {
            const colors = ['bg-indigo-500', 'bg-amber-500', 'bg-emerald-500']
            return (
              <div key={step.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700 dark:text-slate-300">{step.label}</span>
                  <span className="text-slate-500">{step.count}</span>
                </div>
                <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${colors[i]} transition-all duration-500`}
                    style={{ width: `${Math.max(step.pct, 2)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Filter:</span>
        <select
          value={dateRange}
          onChange={e => setDateRange(e.target.value as DateRange)}
          className="text-sm border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
        >
          <option value="all">All Time</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
        <select
          value={followUpFilter}
          onChange={e => setFollowUpFilter(e.target.value)}
          className="text-sm border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
        >
          <option value="">All Follow-up Statuses</option>
          {followUpStatuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {/* Events Table */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Events</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <th className="pb-2 font-medium">Title</th>
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium text-right">Attendees</th>
                <th className="pb-2 font-medium text-right">Conversions</th>
                <th className="pb-2 font-medium text-right">Budget</th>
                <th className="pb-2 font-medium">Follow-up</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map(ev => (
                <tr
                  key={ev.id}
                  onClick={() => onEventClick(ev)}
                  className="border-b border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <td className="py-2.5 text-slate-900 dark:text-white font-medium">
                    {ev.eventTitle || `Event ${ev.eventId}`}
                  </td>
                  <td className="py-2.5 text-slate-600 dark:text-slate-300">
                    {ev.createdAt
                      ? new Date(ev.createdAt).toLocaleDateString('de-CH', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })
                      : '-'}
                  </td>
                  <td className="py-2.5 text-right text-slate-600 dark:text-slate-300">
                    {ev.attendees.filter(a => a.attended).length}/{ev.attendees.length}
                  </td>
                  <td className="py-2.5 text-right text-slate-600 dark:text-slate-300">
                    {ev.conversionCount}
                  </td>
                  <td className="py-2.5 text-right text-slate-600 dark:text-slate-300">
                    CHF {ev.budget?.toLocaleString('de-CH', { minimumFractionDigits: 0 }) || '0'}
                  </td>
                  <td className="py-2.5">
                    <FollowUpBadge status={ev.followUpStatus} />
                  </td>
                </tr>
              ))}
              {filteredEvents.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No prospecting events found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
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

function FollowUpBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    sent: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
    not_started: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  }
  const style = styles[status] || styles.not_started
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${style}`}>
      {status ? status.replace(/_/g, ' ') : 'not started'}
    </span>
  )
}
