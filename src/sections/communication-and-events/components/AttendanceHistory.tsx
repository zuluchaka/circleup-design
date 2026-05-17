import { useState, useMemo } from 'react'
import type { AttendanceStatus } from '@/../product/sections/communication-and-events/types'

export interface AttendanceHistoryRecord {
  id: string
  eventId: string
  eventTitle: string
  eventDate: string
  status: AttendanceStatus
  checkedInAt?: string
  checkedInVia?: string
  proxyForUserName?: string
  notes?: string
}

export interface AttendanceHistoryProps {
  attendances: AttendanceHistoryRecord[]
  memberId: string
  memberName: string
}

const statusConfig: Record<AttendanceStatus, { label: string; bg: string; text: string }> = {
  present: { label: 'Present', bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300' },
  absent: { label: 'Absent', bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300' },
  excused: { label: 'Excused', bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300' },
  proxy: { label: 'Proxy', bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300' },
}

const allStatuses: (AttendanceStatus | 'all')[] = ['all', 'present', 'absent', 'excused', 'proxy']

export default function AttendanceHistory({
  attendances,
  memberName,
}: AttendanceHistoryProps) {
  const [filterStatus, setFilterStatus] = useState<AttendanceStatus | 'all'>('all')

  const stats = useMemo(() => {
    const total = attendances.length
    const attended = attendances.filter(a => a.status === 'present').length
    const proxyCount = attendances.filter(a => a.status === 'proxy').length
    const rate = total > 0 ? Math.round((attended / total) * 100) : 0
    return { total, attended, proxyCount, rate }
  }, [attendances])

  const filtered = useMemo(() => {
    if (filterStatus === 'all') return attendances
    return attendances.filter(a => a.status === filterStatus)
  }, [attendances, filterStatus])

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Attendance History
        </h3>
        <p className="text-sm text-gray-500 mt-0.5">{memberName}</p>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Meetings', value: stats.total, color: 'text-gray-700 dark:text-gray-200', bg: 'bg-gray-50 dark:bg-gray-800' },
          { label: 'Attended', value: stats.attended, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Attendance Rate', value: `${stats.rate}%`, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
          { label: 'As Proxy', value: stats.proxyCount, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`p-3 rounded-lg ${bg}`}>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2 flex-wrap">
        {allStatuses.map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              filterStatus === status
                ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            {status === 'all' ? 'All' : statusConfig[status].label}
            {status === 'all'
              ? ` (${attendances.length})`
              : ` (${attendances.filter(a => a.status === status).length})`}
          </button>
        ))}
      </div>

      {/* Attendance list */}
      {filtered.length === 0 ? (
        <p className="text-sm text-gray-400 py-4 text-center">No attendance records found</p>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {/* Header */}
          <div className="hidden sm:grid sm:grid-cols-4 gap-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <span>Date</span>
            <span>Event</span>
            <span>Status</span>
            <span>Check-in Time</span>
          </div>

          {filtered.map(record => {
            const cfg = statusConfig[record.status]
            return (
              <div
                key={record.id}
                className="py-3 sm:grid sm:grid-cols-4 sm:gap-4 sm:items-center space-y-1 sm:space-y-0"
              >
                {/* Date */}
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(record.eventDate).toLocaleDateString('de-CH', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>

                {/* Event title */}
                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {record.eventTitle}
                </div>

                {/* Status badge */}
                <div>
                  <span className={`inline-flex px-2 py-0.5 text-xs rounded-full ${cfg.bg} ${cfg.text}`}>
                    {cfg.label}
                  </span>
                  {record.proxyForUserName && (
                    <span className="text-xs text-gray-400 ml-1">
                      for {record.proxyForUserName}
                    </span>
                  )}
                </div>

                {/* Check-in time */}
                <div className="text-sm text-gray-500">
                  {record.checkedInAt
                    ? new Date(record.checkedInAt).toLocaleTimeString('de-CH', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '-'}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
