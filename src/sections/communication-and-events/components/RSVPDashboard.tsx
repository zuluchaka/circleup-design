import type { RSVPDashboardProps } from '@/../product/sections/communication-and-events/types'

export default function RSVPDashboard({
  invitations,
  stats,
  onSendReminder,
  onBulkInvite,
}: RSVPDashboardProps) {
  const nonResponders = invitations.filter(i => i.rsvpStatus === 'pending')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">RSVP Dashboard</h3>
        <button
          onClick={onBulkInvite}
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Send Invitations
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Attending', value: stats.attending, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Not Attending', value: stats.notAttending, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
          { label: 'Proxy', value: stats.proxy, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
          { label: 'Pending', value: stats.pending, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`p-3 rounded-lg ${bg}`}>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Predicted attendance */}
      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Predicted Attendance</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            ~{Math.round(stats.predictedAttendance)}
          </span>
        </div>
        <div className="mt-2 w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full"
            style={{ width: `${stats.total > 0 ? (stats.predictedAttendance / stats.total) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Invitations list */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          All Invitations ({stats.total})
        </h4>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {invitations.map(inv => (
            <div key={inv.id} className="flex items-center justify-between py-2">
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{inv.userName}</span>
                {inv.proxyToUserName && (
                  <span className="text-xs text-gray-400 ml-2">
                    (proxy to {inv.proxyToUserName})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  inv.rsvpStatus === 'attending' ? 'bg-green-100 text-green-700' :
                  inv.rsvpStatus === 'not_attending' ? 'bg-red-100 text-red-700' :
                  inv.rsvpStatus === 'proxy' ? 'bg-purple-100 text-purple-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {inv.rsvpStatus.replace('_', ' ')}
                </span>
                {inv.rsvpStatus === 'pending' && (
                  <button
                    onClick={() => onSendReminder(inv.userId)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Remind
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Non-responders summary */}
      {nonResponders.length > 0 && (
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            {nonResponders.length} member(s) have not yet responded
          </p>
        </div>
      )}
    </div>
  )
}
