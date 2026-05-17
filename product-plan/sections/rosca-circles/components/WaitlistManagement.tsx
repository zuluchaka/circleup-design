import type { WaitlistManagementProps } from '../types'

export function WaitlistManagement({
  circle,
  waitlist,
  onPromote,
  onRemove,
  onNotify,
  onReorder,
}: WaitlistManagementProps) {
  const spotsAvailable = circle.maxParticipants - circle.currentParticipants

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Waitlist Management
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            {circle.name} • {waitlist.length} people waiting
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {waitlist.length}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">On Waitlist</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {spotsAvailable}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Spots Available</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {circle.currentParticipants}/{circle.maxParticipants}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Current Members</p>
            </div>
          </div>
        </div>

        {/* Waitlist */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Waitlist Queue
            </h2>
          </div>

          {waitlist.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-slate-500 dark:text-slate-400">
                No one is on the waitlist yet
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {waitlist.map((entry, idx) => (
                <div
                  key={entry.id}
                  className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Position */}
                    <div className="flex items-center gap-2">
                      {onReorder && idx > 0 && (
                        <button
                          onClick={() => onReorder(entry.id, idx - 1)}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                      )}
                      <span className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                        {idx + 1}
                      </span>
                      {onReorder && idx < waitlist.length - 1 && (
                        <button
                          onClick={() => onReorder(entry.id, idx + 1)}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex items-center gap-3 flex-1">
                      {entry.userAvatar ? (
                        <img
                          src={entry.userAvatar}
                          alt={entry.userName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 font-medium">
                          {entry.userName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {entry.userName}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {entry.userTrustScore}
                          </span>
                          <span>
                            Joined {new Date(entry.joinedWaitlistAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Notification Badge */}
                    {entry.notifyOnOpening && (
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        Notify on opening
                      </span>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {spotsAvailable > 0 && onPromote && (
                        <button
                          onClick={() => onPromote(entry.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
                        >
                          Promote
                        </button>
                      )}
                      {onNotify && (
                        <button
                          onClick={() => onNotify(entry.id)}
                          className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                          title="Send notification"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                        </button>
                      )}
                      {onRemove && (
                        <button
                          onClick={() => onRemove(entry.id)}
                          className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title="Remove from waitlist"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <h3 className="font-medium text-slate-900 dark:text-white mb-2">
            Waitlist Rules
          </h3>
          <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
            <li>• Members are added to the waitlist in the order they request to join</li>
            <li>• When a spot opens, the person at the top of the list is notified first</li>
            <li>• You can manually promote any member when spots are available</li>
            <li>• Promoted members start at the next payout position</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
