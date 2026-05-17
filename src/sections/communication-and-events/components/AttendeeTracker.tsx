import { useState, useMemo } from 'react'
import type { ProspectingEvent, ProspectingEventAttendee } from './ProspectingDashboard'

// ============================================
// Attendee Tracker (Phase 6 — CM Prospecting Events)
// ============================================

interface AttendeeTrackerProps {
  event: ProspectingEvent
  attendees: ProspectingEventAttendee[]
  onAddAttendee: (attendee: { name: string; email: string; phone?: string; organizationName?: string }) => void
  onUpdateAttendee: (id: string, updates: Partial<ProspectingEventAttendee>) => void
  onRecordConversion: (attendeeId: string) => void
  onSendFollowUp: (attendeeId: string) => void
}

export function AttendeeTracker({
  event,
  attendees,
  onAddAttendee,
  onUpdateAttendee,
  onRecordConversion,
  onSendFollowUp,
}: AttendeeTrackerProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newOrg, setNewOrg] = useState('')

  // Stats
  const stats = useMemo(() => {
    const total = attendees.length
    const present = attendees.filter(a => a.attended).length
    const converted = attendees.filter(a => a.converted).length
    const followUpPending = attendees.filter(a => a.attended && !a.followUpSentAt && !a.converted).length
    return { total, present, converted, followUpPending }
  }, [attendees])

  const handleAdd = () => {
    if (!newName.trim() || !newEmail.trim()) return
    onAddAttendee({
      name: newName.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim() || undefined,
      organizationName: newOrg.trim() || undefined,
    })
    setNewName('')
    setNewEmail('')
    setNewPhone('')
    setNewOrg('')
    setShowAddForm(false)
  }

  const handleMarkAllAttended = () => {
    attendees.forEach(a => {
      if (!a.attended) {
        onUpdateAttendee(a.id, { attended: true })
      }
    })
  }

  const handleSendFollowUpAll = () => {
    attendees.forEach(a => {
      if (a.attended && !a.followUpSentAt && !a.converted) {
        onSendFollowUp(a.id)
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Attendee Tracker
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {event.eventTitle || `Event ${event.eventId}`}
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
        >
          {showAddForm ? 'Cancel' : '+ Add Attendee'}
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Attendees" value={stats.total} />
        <StatCard label="Present" value={stats.present} color="text-indigo-600 dark:text-indigo-400" />
        <StatCard label="Converted" value={stats.converted} color="text-emerald-600 dark:text-emerald-400" />
        <StatCard
          label="Follow-up Pending"
          value={stats.followUpPending}
          color="text-amber-600 dark:text-amber-400"
        />
      </div>

      {/* Add Attendee Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Add New Attendee
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Name *
              </label>
              <input
                type="text"
                placeholder="Full name"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Phone
              </label>
              <input
                type="tel"
                placeholder="+41 79 123 45 67"
                value={newPhone}
                onChange={e => setNewPhone(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Organization
              </label>
              <input
                type="text"
                placeholder="Company or organization name"
                value={newOrg}
                onChange={e => setNewOrg(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleAdd}
              disabled={!newName.trim() || !newEmail.trim()}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors"
            >
              Add Attendee
            </button>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {attendees.length > 0 && (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleMarkAllAttended}
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Mark All Attended
          </button>
          <button
            onClick={handleSendFollowUpAll}
            disabled={stats.followUpPending === 0}
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send Follow-up to All ({stats.followUpPending})
          </button>
        </div>
      )}

      {/* Attendees Table */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium">Email</th>
                <th className="pb-2 font-medium">Organization</th>
                <th className="pb-2 font-medium text-center">Attended</th>
                <th className="pb-2 font-medium text-center">Converted</th>
                <th className="pb-2 font-medium text-center">Follow-up</th>
                <th className="pb-2 font-medium">Notes</th>
                <th className="pb-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendees.map(attendee => (
                <tr
                  key={attendee.id}
                  className="border-b border-slate-100 dark:border-slate-800"
                >
                  <td className="py-2.5 text-slate-900 dark:text-white font-medium">
                    {attendee.name}
                  </td>
                  <td className="py-2.5 text-slate-600 dark:text-slate-300">
                    {attendee.email}
                  </td>
                  <td className="py-2.5 text-slate-600 dark:text-slate-300">
                    {attendee.organizationName || '-'}
                  </td>
                  <td className="py-2.5 text-center">
                    <input
                      type="checkbox"
                      checked={attendee.attended}
                      onChange={e => onUpdateAttendee(attendee.id, { attended: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="py-2.5 text-center">
                    <input
                      type="checkbox"
                      checked={attendee.converted}
                      onChange={() => {
                        if (!attendee.converted) {
                          onRecordConversion(attendee.id)
                        }
                      }}
                      disabled={attendee.converted}
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-emerald-600 focus:ring-emerald-500 disabled:opacity-50"
                    />
                  </td>
                  <td className="py-2.5 text-center">
                    {attendee.followUpSentAt ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                        Sent
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 text-slate-500 dark:text-slate-400 text-xs max-w-[150px] truncate">
                    {attendee.notes || '-'}
                  </td>
                  <td className="py-2.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!attendee.converted && attendee.attended && (
                        <button
                          onClick={() => onRecordConversion(attendee.id)}
                          className="text-xs text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium"
                        >
                          Convert
                        </button>
                      )}
                      {!attendee.followUpSentAt && attendee.attended && (
                        <button
                          onClick={() => onSendFollowUp(attendee.id)}
                          className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                        >
                          Follow-up
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {attendees.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No attendees yet. Add one to get started.
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
