import { useState } from 'react'
import { SlidersHorizontal, Play, Pause, Clock, Users, CircleDollarSign, Repeat } from 'lucide-react'
import type { Circle, CircleFrequency } from '@/../product/sections/rosca-circles/types'

interface CircleSettingsProps {
  circle: Circle
  isOrganizer?: boolean
  onBack?: () => void
  onPauseCircle?: () => void | Promise<void>
  onResumeCircle?: () => void | Promise<void>
  onExtendCircle?: (additionalCycles: number) => void | Promise<void>
}

const frequencyLabels: Record<CircleFrequency, string> = {
  weekly: 'Weekly',
  bi_weekly: 'Bi-weekly',
  monthly: 'Monthly',
}

const statusColors: Record<string, string> = {
  active: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400',
  forming: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
  paused: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
  completed: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
  cancelled: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400',
}

export function CircleSettings({
  circle,
  isOrganizer = false,
  onBack,
  onPauseCircle,
  onResumeCircle,
  onExtendCircle,
}: CircleSettingsProps) {
  const [extensionCycles, setExtensionCycles] = useState(1)
  const [busy, setBusy] = useState(false)

  const currency = circle.currency || 'CHF'
  const contributionLabel = `${currency} ${Number(circle.contributionAmount || 0).toLocaleString()}`
  const frequencyLabel = frequencyLabels[circle.frequency] || circle.frequency
  const startDate = circle.startDate ? new Date(circle.startDate).toLocaleDateString() : '—'

  const handle = async (fn?: () => void | Promise<void>) => {
    if (!fn) return
    setBusy(true)
    try { await fn() } finally { setBusy(false) }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-6 h-6 text-indigo-500" />
                Settings
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {circle.name} • Circle configuration
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className={`rounded-xl px-4 py-3 ${statusColors[circle.status] || statusColors.forming}`}>
              <div className="text-xl font-bold truncate capitalize">{circle.status}</div>
              <p className="text-sm font-medium mt-0.5 opacity-80">Status</p>
            </div>
            <div className="rounded-xl px-4 py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400">
              <div className="text-xl font-bold truncate">{circle.currentCycle}/{circle.duration}</div>
              <p className="text-sm font-medium mt-0.5 opacity-80">Cycle</p>
            </div>
            <div className="rounded-xl px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400">
              <div className="text-xl font-bold truncate">{contributionLabel}</div>
              <p className="text-sm font-medium mt-0.5 opacity-80">Contribution</p>
            </div>
            <div className="rounded-xl px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
              <div className="text-xl font-bold truncate">{frequencyLabel}</div>
              <p className="text-sm font-medium mt-0.5 opacity-80">Frequency</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Circle Status */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Circle Status</h2>
          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">
                Current Status: <span className="capitalize">{circle.status}</span>
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Cycle {circle.currentCycle} of {circle.duration}
              </p>
            </div>
            {isOrganizer && circle.status === 'active' && onPauseCircle && (
              <button
                disabled={busy}
                onClick={() => handle(onPauseCircle)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-medium text-sm transition-colors"
              >
                <Pause className="w-4 h-4" />
                Pause Circle
              </button>
            )}
            {isOrganizer && (circle.status as string) === 'paused' && onResumeCircle && (
              <button
                disabled={busy}
                onClick={() => handle(onResumeCircle)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium text-sm transition-colors"
              >
                <Play className="w-4 h-4" />
                Resume Circle
              </button>
            )}
          </div>
        </div>

        {/* Circle Configuration (read-only) */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Configuration</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
              <CircleDollarSign className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
              <div>
                <dt className="text-xs text-slate-500 dark:text-slate-400">Contribution Amount</dt>
                <dd className="text-sm font-medium text-slate-900 dark:text-white">{contributionLabel}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
              <Repeat className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
              <div>
                <dt className="text-xs text-slate-500 dark:text-slate-400">Frequency</dt>
                <dd className="text-sm font-medium text-slate-900 dark:text-white">{frequencyLabel}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
              <Clock className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
              <div>
                <dt className="text-xs text-slate-500 dark:text-slate-400">Duration</dt>
                <dd className="text-sm font-medium text-slate-900 dark:text-white">{circle.duration} cycles</dd>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
              <Users className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
              <div>
                <dt className="text-xs text-slate-500 dark:text-slate-400">Max Participants</dt>
                <dd className="text-sm font-medium text-slate-900 dark:text-white">{circle.maxParticipants}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
              <Clock className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
              <div>
                <dt className="text-xs text-slate-500 dark:text-slate-400">Start Date</dt>
                <dd className="text-sm font-medium text-slate-900 dark:text-white">{startDate}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
              <CircleDollarSign className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
              <div>
                <dt className="text-xs text-slate-500 dark:text-slate-400">Emergency Fund Rate</dt>
                <dd className="text-sm font-medium text-slate-900 dark:text-white">{circle.emergencyFundRate}%</dd>
              </div>
            </div>
          </dl>
        </div>

        {/* Extend Circle */}
        {isOrganizer && onExtendCircle && (
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Extend Circle</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Add more cycles to the circle after the current rotation completes.
            </p>
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={extensionCycles}
                onChange={(e) => setExtensionCycles(Number(e.target.value))}
                min={1}
                max={12}
                className="w-24 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-600 dark:text-slate-400">additional cycles</span>
              <button
                disabled={busy || extensionCycles < 1}
                onClick={() => handle(() => onExtendCircle(extensionCycles))}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium text-sm transition-colors"
              >
                Extend
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
