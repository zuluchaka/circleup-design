import { useState } from 'react'
import type { AttendanceSheetProps, AttendanceStatus } from '@/../product/sections/communication-and-events/types'

export default function AttendanceSheet({
  attendances,
  quorum,
  onMarkAttendance,
}: AttendanceSheetProps) {
  const [localStatuses, setLocalStatuses] = useState<Record<string, AttendanceStatus>>({})
  const [saving, setSaving] = useState(false)

  const getStatus = (userId: string, current: AttendanceStatus): AttendanceStatus =>
    localStatuses[userId] || current

  const handleStatusChange = (userId: string, status: AttendanceStatus) => {
    setLocalStatuses(prev => ({ ...prev, [userId]: status }))
  }

  const handleSaveAll = async () => {
    setSaving(true)
    const records = Object.entries(localStatuses).map(([userId, status]) => ({
      userId,
      status,
    }))
    if (records.length > 0) {
      await onMarkAttendance(records)
      setLocalStatuses({})
    }
    setSaving(false)
  }

  const hasChanges = Object.keys(localStatuses).length > 0

  const statusColors: Record<AttendanceStatus, string> = {
    present: 'bg-green-100 text-green-700 border-green-300',
    absent: 'bg-red-100 text-red-700 border-red-300',
    excused: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    proxy: 'bg-purple-100 text-purple-700 border-purple-300',
  }

  return (
    <div className="space-y-6">
      {/* Quorum indicator */}
      <div className={`p-4 rounded-lg border-2 ${
        quorum.met
          ? 'border-green-300 bg-green-50 dark:bg-green-900/20'
          : 'border-red-300 bg-red-50 dark:bg-red-900/20'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Quorum {quorum.met ? 'Met' : 'Not Met'}
            </h4>
            <p className="text-sm text-gray-500">
              {quorum.presentCount} present of {quorum.totalMembers} members
              ({quorum.percentage}%)
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {quorum.presentCount}/{quorum.needed}
            </p>
            <p className="text-xs text-gray-400">needed</p>
          </div>
        </div>
        <div className="mt-3 w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${quorum.met ? 'bg-green-500' : 'bg-red-400'}`}
            style={{ width: `${Math.min(quorum.percentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Attendance list */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Attendance Roll</h3>
        {hasChanges && (
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        )}
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {attendances.map(a => {
          const currentStatus = getStatus(a.userId, a.status)
          return (
            <div key={a.id || a.userId} className="flex items-center justify-between py-3">
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{a.userName}</span>
                {a.proxyForUserName && (
                  <span className="text-xs text-purple-500 ml-2">
                    (proxy for {a.proxyForUserName})
                  </span>
                )}
                {a.checkedInAt && (
                  <span className="text-xs text-gray-400 ml-2">
                    {new Date(a.checkedInAt).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
                {a.notes && (
                  <p className="text-xs text-gray-400 mt-0.5">{a.notes}</p>
                )}
              </div>
              <div className="flex gap-1">
                {(['present', 'absent', 'excused', 'proxy'] as AttendanceStatus[]).map(status => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(a.userId, status)}
                    className={`px-2 py-1 text-xs rounded border transition-colors ${
                      currentStatus === status
                        ? statusColors[status]
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-500'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
