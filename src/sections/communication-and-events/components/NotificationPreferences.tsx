import type {
  NotificationPreferencesProps,
  NotificationPreference,
  NotificationCategory,
  NotificationChannel,
  NotificationFrequency,
} from '@/../product/sections/communication-and-events/types'

const categories: { value: NotificationCategory; label: string; description: string }[] = [
  { value: 'payments', label: 'Payments', description: 'Contribution reminders, payout notifications, payment confirmations' },
  { value: 'governance', label: 'Governance', description: 'Election announcements, proposal updates, voting reminders' },
  { value: 'social', label: 'Social', description: 'New members, milestones, community updates' },
  { value: 'announcements', label: 'Announcements', description: 'Important updates from association leadership' },
  { value: 'events', label: 'Events', description: 'Event reminders, registration confirmations, updates' },
  { value: 'messages', label: 'Messages', description: 'Direct messages and group chat notifications' },
]

const channels: { value: NotificationChannel; label: string; icon: React.ReactNode }[] = [
  {
    value: 'in_app',
    label: 'In-App',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
  {
    value: 'push',
    label: 'Push',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    value: 'email',
    label: 'Email',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    value: 'sms',
    label: 'SMS',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    value: 'whatsapp',
    label: 'WhatsApp',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
]

const frequencies: { value: NotificationFrequency; label: string; description: string }[] = [
  { value: 'instant', label: 'Instant', description: 'Get notified immediately' },
  { value: 'daily_digest', label: 'Daily Digest', description: 'One summary per day' },
  { value: 'weekly_summary', label: 'Weekly Summary', description: 'One summary per week' },
]

function PreferenceCard({
  preference,
  categoryInfo,
  onUpdate,
}: {
  preference: NotificationPreference
  categoryInfo: typeof categories[number]
  onUpdate: (updated: NotificationPreference) => void
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {categoryInfo.label}
            </h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preference.enabled}
                onChange={(e) => onUpdate({ ...preference, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600" />
            </label>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {categoryInfo.description}
          </p>
        </div>
      </div>

      {preference.enabled && (
        <>
          {/* Channels */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Delivery Channels
            </label>
            <div className="flex flex-wrap gap-2">
              {channels.map((channel) => {
                const isSelected = preference.channels.includes(channel.value)
                return (
                  <button
                    key={channel.value}
                    onClick={() => {
                      const newChannels = isSelected
                        ? preference.channels.filter((c) => c !== channel.value)
                        : [...preference.channels, channel.value]
                      onUpdate({ ...preference, channels: newChannels })
                    }}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {channel.icon}
                    {channel.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Frequency
            </label>
            <div className="grid grid-cols-3 gap-2">
              {frequencies.map((freq) => (
                <button
                  key={freq.value}
                  onClick={() => onUpdate({ ...preference, frequency: freq.value })}
                  className={`p-3 rounded-xl text-left transition-colors ${
                    preference.frequency === freq.value
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-800'
                      : 'bg-slate-50 dark:bg-slate-700 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-600'
                  }`}
                >
                  <p className="font-medium text-slate-900 dark:text-white text-sm">
                    {freq.label}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {freq.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export function NotificationPreferences({
  preferences,
  onUpdate,
  onSaveAll,
}: NotificationPreferencesProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Notification Preferences
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Control how and when you receive notifications
            </p>
          </div>
          <button
            onClick={onSaveAll}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save Changes
          </button>
        </div>

        {/* Quiet Hours */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 mb-6">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Quiet Hours
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Pause non-urgent notifications during these hours
              </p>

              <div className="flex items-center gap-4 mt-4">
                <div className="flex-1">
                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    defaultValue="22:00"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border-0 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <span className="text-slate-400 pt-5">to</span>
                <div className="flex-1">
                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    defaultValue="07:00"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border-0 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Preferences */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            By Category
          </h2>
          {categories.map((category) => {
            const pref = preferences.find((p) => p.category === category.value)
            if (!pref) return null

            return (
              <PreferenceCard
                key={category.value}
                preference={pref}
                categoryInfo={category}
                onUpdate={onUpdate}
              />
            )
          })}
        </div>

        {/* Email Unsubscribe */}
        <div className="mt-8 p-5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                You can also manage email preferences by clicking "Unsubscribe" at the bottom of any email we send you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
