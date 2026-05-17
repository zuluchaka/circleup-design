import { useState, useCallback } from 'react'
import type { NotificationChannel } from '@/../product/sections/communication-and-events/types'

interface TimingOption {
  key: string
  label: string
  enabled: boolean
  channels: NotificationChannel[]
  template: string
}

interface ReminderSettings {
  autoRemindNonResponders: boolean
  maxReminderCount: number
}

interface NotificationConfig {
  eventId: string
  timings: TimingOption[]
  reminderSettings: ReminderSettings
}

interface EventNotificationConfigProps {
  eventId: string
  onSave: (config: NotificationConfig) => void
}

const DEFAULT_TIMINGS: TimingOption[] = [
  {
    key: '7_days',
    label: '7 days before',
    enabled: true,
    channels: ['email'],
    template: 'Reminder: {event_title} is coming up on {event_date} at {event_location}. We look forward to seeing you!',
  },
  {
    key: '1_day',
    label: '1 day before',
    enabled: true,
    channels: ['email', 'push'],
    template: '{event_title} is tomorrow! Join us at {event_location} on {event_date}.',
  },
  {
    key: '2_hours',
    label: '2 hours before',
    enabled: false,
    channels: ['push'],
    template: '{event_title} starts in 2 hours at {event_location}. See you soon!',
  },
  {
    key: 'at_start',
    label: 'At event start',
    enabled: false,
    channels: ['push', 'in_app'],
    template: '{event_title} is starting now at {event_location}!',
  },
]

const AVAILABLE_CHANNELS: { key: NotificationChannel; label: string }[] = [
  { key: 'email', label: 'Email' },
  { key: 'push', label: 'Push Notification' },
  { key: 'in_app', label: 'In-App' },
]

const PLACEHOLDER_TOKENS = [
  { token: '{event_title}', description: 'Event name' },
  { token: '{event_date}', description: 'Event date and time' },
  { token: '{event_location}', description: 'Event location' },
]

export function EventNotificationConfig({ eventId, onSave }: EventNotificationConfigProps) {
  const [timings, setTimings] = useState<TimingOption[]>(DEFAULT_TIMINGS)
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>({
    autoRemindNonResponders: false,
    maxReminderCount: 2,
  })
  const [previewTiming, setPreviewTiming] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const updateTiming = useCallback((key: string, updates: Partial<TimingOption>) => {
    setTimings(prev => prev.map(t => (t.key === key ? { ...t, ...updates } : t)))
  }, [])

  const toggleChannel = useCallback((timingKey: string, channel: NotificationChannel) => {
    setTimings(prev =>
      prev.map(t => {
        if (t.key !== timingKey) return t
        const channels = t.channels.includes(channel)
          ? t.channels.filter(c => c !== channel)
          : [...t.channels, channel]
        return { ...t, channels }
      })
    )
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      onSave({
        eventId,
        timings,
        reminderSettings,
      })
    } finally {
      setSaving(false)
    }
  }

  const resolveTemplate = (template: string): string => {
    return template
      .replace(/{event_title}/g, 'Annual General Meeting')
      .replace(/{event_date}/g, '15. April 2026, 18:00')
      .replace(/{event_location}/g, 'Community Hall, Zurich')
  }

  const previewEntry = previewTiming ? timings.find(t => t.key === previewTiming) : null

  return (
    <div className="space-y-4">
      {/* Notification Timings */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Notification Schedule</h3>
        <div className="space-y-4">
          {timings.map(timing => (
            <div
              key={timing.key}
              className={`rounded-lg border p-4 transition-colors ${
                timing.enabled
                  ? 'border-slate-200 dark:border-slate-700'
                  : 'border-slate-100 dark:border-slate-800 opacity-60'
              }`}
            >
              {/* Enable toggle + label */}
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={timing.enabled}
                    onChange={e => updateTiming(timing.key, { enabled: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {timing.label}
                  </span>
                </label>
                <button
                  onClick={() => setPreviewTiming(previewTiming === timing.key ? null : timing.key)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
                >
                  {previewTiming === timing.key ? 'Hide Preview' : 'Preview'}
                </button>
              </div>

              {timing.enabled && (
                <>
                  {/* Channels */}
                  <div className="mb-3">
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                      Channels
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_CHANNELS.map(ch => (
                        <button
                          key={ch.key}
                          onClick={() => toggleChannel(timing.key, ch.key)}
                          className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                            timing.channels.includes(ch.key)
                              ? 'bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-indigo-900 dark:text-indigo-300 dark:border-indigo-700'
                              : 'bg-white text-slate-500 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600 hover:border-indigo-300'
                          }`}
                        >
                          {ch.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message Template */}
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                      Message Template
                    </label>
                    <textarea
                      value={timing.template}
                      onChange={e => updateTiming(timing.key, { template: e.target.value })}
                      rows={3}
                      className="w-full text-sm border border-slate-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 resize-none"
                      placeholder="Enter notification message..."
                    />
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {PLACEHOLDER_TOKENS.map(p => (
                        <button
                          key={p.token}
                          onClick={() =>
                            updateTiming(timing.key, { template: timing.template + ' ' + p.token })
                          }
                          className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                          title={p.description}
                        >
                          {p.token}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Preview Section */}
      {previewEntry && (
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-indigo-200 dark:border-indigo-800 p-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
            Preview: {previewEntry.label}
          </h3>
          <div className="space-y-3">
            {previewEntry.channels.includes('email') && (
              <div className="rounded border border-slate-200 dark:border-slate-700 p-3">
                <div className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">Email</div>
                <div className="text-xs font-medium text-slate-900 dark:text-white mb-1">
                  Event Reminder
                </div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {resolveTemplate(previewEntry.template)}
                </div>
              </div>
            )}
            {previewEntry.channels.includes('push') && (
              <div className="rounded border border-slate-200 dark:border-slate-700 p-3">
                <div className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">
                  Push Notification
                </div>
                <div className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">
                  {resolveTemplate(previewEntry.template)}
                </div>
              </div>
            )}
            {previewEntry.channels.includes('in_app') && (
              <div className="rounded border border-slate-200 dark:border-slate-700 p-3">
                <div className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">In-App</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {resolveTemplate(previewEntry.template)}
                </div>
              </div>
            )}
            {previewEntry.channels.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-2">
                No channels selected. Choose at least one channel above.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Placeholder Tokens Reference */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Available Tokens</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {PLACEHOLDER_TOKENS.map(p => (
            <div key={p.token} className="flex items-center gap-2">
              <code className="text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">
                {p.token}
              </code>
              <span className="text-xs text-slate-500 dark:text-slate-400">{p.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reminder Settings */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Reminder Settings</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-900 dark:text-white">Auto-remind non-responders</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Automatically send reminders to members who haven&apos;t responded
              </p>
            </div>
            <button
              onClick={() =>
                setReminderSettings(prev => ({
                  ...prev,
                  autoRemindNonResponders: !prev.autoRemindNonResponders,
                }))
              }
              className={`relative w-10 h-5 rounded-full transition-colors ${
                reminderSettings.autoRemindNonResponders
                  ? 'bg-emerald-500'
                  : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  reminderSettings.autoRemindNonResponders ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </div>

          {reminderSettings.autoRemindNonResponders && (
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-700 dark:text-slate-300">Max reminders:</label>
              <input
                type="number"
                min={1}
                max={5}
                value={reminderSettings.maxReminderCount}
                onChange={e =>
                  setReminderSettings(prev => ({
                    ...prev,
                    maxReminderCount: Math.max(1, Math.min(5, Number(e.target.value))),
                  }))
                }
                className="w-16 text-sm border border-slate-300 dark:border-slate-600 rounded px-2 py-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              />
              <span className="text-xs text-slate-500 dark:text-slate-400">per member</span>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="text-sm px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 transition-colors"
        >
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>
    </div>
  )
}
