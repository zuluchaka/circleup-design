import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import * as dashApi from '@/services/eventDashboardApi'
import type { EventType } from '@/../product/sections/communication-and-events/types'
import { saveFile } from '@/platform/downloads'

interface AdminEvent {
  id: string
  associationId: string
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
  createdAt: string
}

interface Filters {
  associationId: string
  eventType: string
  status: string
  dateFrom: string
  dateTo: string
}

interface AdminEventsOverviewProps {
  onEventClick: (eventId: string) => void
  onCancelEvent: (eventId: string) => void
  onRescheduleEvent: (eventId: string, startDate: string, endDate: string) => void
}

const PAGE_SIZE = 20

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  published: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
}

const EVENT_TYPES: EventType[] = ['meeting', 'celebration', 'fundraiser', 'workshop', 'social', 'other']

export function AdminEventsOverview({
  onEventClick,
  onCancelEvent,
  onRescheduleEvent,
}: AdminEventsOverviewProps) {
  const { token } = useAuth()
  const [events, setEvents] = useState<AdminEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<Filters>({
    associationId: '',
    eventType: '',
    status: '',
    dateFrom: '',
    dateTo: '',
  })
  const [page, setPage] = useState(1)
  const [associations, setAssociations] = useState<{ id: string; name: string }[]>([])

  // Cancel confirmation modal
  const [cancelTarget, setCancelTarget] = useState<AdminEvent | null>(null)
  const [cancelReason, setCancelReason] = useState('')

  // Reschedule modal
  const [rescheduleTarget, setRescheduleTarget] = useState<AdminEvent | null>(null)
  const [rescheduleStart, setRescheduleStart] = useState('')
  const [rescheduleEnd, setRescheduleEnd] = useState('')

  const loadEvents = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const params: Record<string, string> = {}
      if (filters.associationId) params.association_id = filters.associationId
      if (filters.status) params.status = filters.status
      if (filters.dateFrom) params.from = filters.dateFrom
      if (filters.dateTo) params.to = filters.dateTo

      const data = await dashApi.fetchAdminEvents(token, Object.keys(params).length > 0 ? params : undefined)
      let evts: AdminEvent[] = data.events || []

      // Client-side filter for event type (not supported by backend params)
      if (filters.eventType) {
        evts = evts.filter(e => e.eventType === filters.eventType)
      }

      // Extract unique associations for the filter dropdown
      const assocMap = new Map<string, string>()
      evts.forEach(e => {
        if (e.associationId && e.associationName) {
          assocMap.set(e.associationId, e.associationName)
        }
      })
      setAssociations(Array.from(assocMap, ([id, name]) => ({ id, name })))
      setEvents(evts)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load events')
    } finally {
      setLoading(false)
    }
  }, [token, filters])

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  useEffect(() => {
    setPage(1)
  }, [filters])

  const totalPages = Math.max(1, Math.ceil(events.length / PAGE_SIZE))
  const pagedEvents = events.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleCancelConfirm = async () => {
    if (!cancelTarget || !token) return
    try {
      await dashApi.cancelEvent(token, cancelTarget.id, cancelReason || undefined)
      onCancelEvent(cancelTarget.id)
      setCancelTarget(null)
      setCancelReason('')
      loadEvents()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Cancel failed')
    }
  }

  const handleRescheduleConfirm = async () => {
    if (!rescheduleTarget || !token || !rescheduleStart || !rescheduleEnd) return
    try {
      await dashApi.rescheduleEvent(token, rescheduleTarget.id, rescheduleStart, rescheduleEnd)
      onRescheduleEvent(rescheduleTarget.id, rescheduleStart, rescheduleEnd)
      setRescheduleTarget(null)
      setRescheduleStart('')
      setRescheduleEnd('')
      loadEvents()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Reschedule failed')
    }
  }

  const handleExportCsv = async () => {
    const header = ['Title', 'Association', 'Type', 'Date', 'Status', 'Registrations', 'Capacity', 'Waitlist']
    const rows = events.map(e => [
      e.title,
      e.associationName,
      e.eventType,
      e.startDate ? new Date(e.startDate).toLocaleDateString('de-CH') : '',
      e.status,
      String(e.registrationCount),
      e.capacity ? String(e.capacity) : '',
      String(e.waitlistCount),
    ])
    const csv = [header, ...rows].map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    await saveFile({
      blob,
      fileName: `events-export-${new Date().toISOString().slice(0, 10)}.csv`,
      mimeType: 'text/csv',
    })
  }

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  if (loading && events.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error && events.length === 0) {
    return (
      <div className="p-6 text-center text-red-600 dark:text-red-400">
        <p>{error}</p>
        <button onClick={loadEvents} className="mt-2 text-sm text-indigo-600 hover:underline">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-500 dark:text-slate-400">Association</label>
            <select
              value={filters.associationId}
              onChange={e => updateFilter('associationId', e.target.value)}
              className="text-sm border border-slate-300 dark:border-slate-600 rounded px-2 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              <option value="">All associations</option>
              {associations.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-500 dark:text-slate-400">Type</label>
            <select
              value={filters.eventType}
              onChange={e => updateFilter('eventType', e.target.value)}
              className="text-sm border border-slate-300 dark:border-slate-600 rounded px-2 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              <option value="">All types</option>
              {EVENT_TYPES.map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-500 dark:text-slate-400">Status</label>
            <select
              value={filters.status}
              onChange={e => updateFilter('status', e.target.value)}
              className="text-sm border border-slate-300 dark:border-slate-600 rounded px-2 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              <option value="">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-500 dark:text-slate-400">From</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={e => updateFilter('dateFrom', e.target.value)}
              className="text-sm border border-slate-300 dark:border-slate-600 rounded px-2 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-500 dark:text-slate-400">To</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={e => updateFilter('dateTo', e.target.value)}
              className="text-sm border border-slate-300 dark:border-slate-600 rounded px-2 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            />
          </div>

          <button
            onClick={handleExportCsv}
            className="ml-auto text-sm px-3 py-1.5 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            Export CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded p-3">
          {error}
        </div>
      )}

      {/* Events Table */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
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
                <th className="pb-2 font-medium text-right">Capacity</th>
                <th className="pb-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedEvents.map(ev => (
                <tr key={ev.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-2 text-slate-900 dark:text-white font-medium">
                    <button
                      onClick={() => onEventClick(ev.id)}
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 text-left"
                    >
                      {ev.title}
                      {ev.isMeeting && (
                        <span className="ml-1 text-xs text-indigo-500">[{ev.meetingType}]</span>
                      )}
                    </button>
                  </td>
                  <td className="py-2 text-slate-600 dark:text-slate-300">{ev.associationName}</td>
                  <td className="py-2 capitalize text-slate-600 dark:text-slate-300">{ev.eventType}</td>
                  <td className="py-2 text-slate-600 dark:text-slate-300">
                    {ev.startDate ? new Date(ev.startDate).toLocaleDateString('de-CH') : '-'}
                  </td>
                  <td className="py-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLES[ev.status] || STATUS_STYLES.draft}`}>
                      {ev.status}
                    </span>
                  </td>
                  <td className="py-2 text-right text-slate-600 dark:text-slate-300">
                    {ev.registrationCount}
                  </td>
                  <td className="py-2 text-right text-slate-600 dark:text-slate-300">
                    {ev.capacity || '-'}
                  </td>
                  <td className="py-2 text-right space-x-2">
                    <button
                      onClick={() => onEventClick(ev.id)}
                      className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
                    >
                      View
                    </button>
                    {ev.status !== 'cancelled' && ev.status !== 'completed' && (
                      <>
                        <button
                          onClick={() => {
                            setRescheduleTarget(ev)
                            setRescheduleStart(ev.startDate ? ev.startDate.slice(0, 16) : '')
                            setRescheduleEnd(ev.endDate ? ev.endDate.slice(0, 16) : '')
                          }}
                          className="text-xs text-amber-600 hover:text-amber-800 dark:text-amber-400"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => setCancelTarget(ev)}
                          className="text-xs text-red-600 hover:text-red-800 dark:text-red-400"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {pagedEvents.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No events found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, events.length)} of {events.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-600 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`text-xs px-2 py-1 rounded border ${
                    p === page
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-600 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Cancel Event</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              Are you sure you want to cancel <strong>{cancelTarget.title}</strong>? This action will notify all registrants.
            </p>
            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Reason (optional)</label>
            <textarea
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              rows={3}
              className="w-full text-sm border border-slate-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 mb-4"
              placeholder="Provide a reason for cancellation..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setCancelTarget(null); setCancelReason('') }}
                className="text-sm px-3 py-1.5 rounded border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Keep Event
              </button>
              <button
                onClick={handleCancelConfirm}
                className="text-sm px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Reschedule Event</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              Set new dates for <strong>{rescheduleTarget.title}</strong>.
            </p>
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">New Start Date & Time</label>
                <input
                  type="datetime-local"
                  value={rescheduleStart}
                  onChange={e => setRescheduleStart(e.target.value)}
                  className="w-full text-sm border border-slate-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">New End Date & Time</label>
                <input
                  type="datetime-local"
                  value={rescheduleEnd}
                  onChange={e => setRescheduleEnd(e.target.value)}
                  className="w-full text-sm border border-slate-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setRescheduleTarget(null); setRescheduleStart(''); setRescheduleEnd('') }}
                className="text-sm px-3 py-1.5 rounded border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleRescheduleConfirm}
                disabled={!rescheduleStart || !rescheduleEnd}
                className="text-sm px-3 py-1.5 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
