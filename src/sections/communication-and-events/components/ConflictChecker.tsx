import { useState, useEffect, useCallback } from 'react'
import type { Event } from '@/../product/sections/communication-and-events/types'

// ============================================
// Types
// ============================================

interface ProposedEvent {
  id?: string
  title: string
  startDate: string
  endDate: string
  type?: string
}

type ConflictSeverity = 'hard' | 'soft'

interface EventConflict {
  event: Event
  severity: ConflictSeverity
  overlapStart: string
  overlapEnd: string
}

type ResolutionAction = 'next_slot' | 'change_time' | 'proceed'

interface ConflictCheckerProps {
  associationId: string
  proposedEvent: ProposedEvent
  onResolve: (action: ResolutionAction, conflict: EventConflict) => void
}

// ============================================
// Helpers
// ============================================

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function computeOverlapPercent(
  proposedStart: Date,
  proposedEnd: Date,
  conflictStart: Date,
  conflictEnd: Date,
): number {
  const overlapBegin = Math.max(proposedStart.getTime(), conflictStart.getTime())
  const overlapFinish = Math.min(proposedEnd.getTime(), conflictEnd.getTime())
  if (overlapFinish <= overlapBegin) return 0
  const proposedDuration = proposedEnd.getTime() - proposedStart.getTime()
  if (proposedDuration <= 0) return 0
  return Math.round(((overlapFinish - overlapBegin) / proposedDuration) * 100)
}

// ============================================
// Component
// ============================================

export function ConflictChecker({
  associationId,
  proposedEvent,
  onResolve,
}: ConflictCheckerProps) {
  const [conflicts, setConflicts] = useState<EventConflict[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkConflicts = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        start_date: proposedEvent.startDate,
        end_date: proposedEvent.endDate,
      })
      if (proposedEvent.id) {
        params.set('exclude_event_id', proposedEvent.id)
      }

      const response = await fetch(
        `/api/associations/${associationId}/events/conflicts?${params.toString()}`,
      )

      if (!response.ok) {
        throw new Error('Failed to check for conflicts')
      }

      const data = await response.json()
      const conflictingEvents: Event[] = data.conflicts || []
      const proposedStart = new Date(proposedEvent.startDate)
      const proposedEnd = new Date(proposedEvent.endDate)

      const mapped: EventConflict[] = conflictingEvents.map((event) => {
        const cStart = new Date(event.startDate)
        const cEnd = new Date(event.endDate)
        const overlapPct = computeOverlapPercent(proposedStart, proposedEnd, cStart, cEnd)

        return {
          event,
          severity: overlapPct >= 75 ? 'hard' : 'soft',
          overlapStart: new Date(Math.max(proposedStart.getTime(), cStart.getTime())).toISOString(),
          overlapEnd: new Date(Math.min(proposedEnd.getTime(), cEnd.getTime())).toISOString(),
        }
      })

      setConflicts(mapped)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [associationId, proposedEvent.startDate, proposedEvent.endDate, proposedEvent.id])

  useEffect(() => {
    checkConflicts()
  }, [checkConflicts])

  // Timeline overlap bar
  function OverlapBar({ conflict }: { conflict: EventConflict }) {
    const proposedStart = new Date(proposedEvent.startDate).getTime()
    const proposedEnd = new Date(proposedEvent.endDate).getTime()
    const cStart = new Date(conflict.event.startDate).getTime()
    const cEnd = new Date(conflict.event.endDate).getTime()

    const rangeStart = Math.min(proposedStart, cStart)
    const rangeEnd = Math.max(proposedEnd, cEnd)
    const totalRange = rangeEnd - rangeStart || 1

    const pLeft = ((proposedStart - rangeStart) / totalRange) * 100
    const pWidth = ((proposedEnd - proposedStart) / totalRange) * 100
    const cLeft = ((cStart - rangeStart) / totalRange) * 100
    const cWidth = ((cEnd - cStart) / totalRange) * 100

    return (
      <div className="mt-3">
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Time overlap</p>
        <div className="relative h-6 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden">
          {/* Proposed event bar */}
          <div
            className="absolute top-0 h-3 bg-indigo-400 dark:bg-indigo-500 rounded"
            style={{ left: `${pLeft}%`, width: `${Math.max(pWidth, 1)}%` }}
          />
          {/* Conflicting event bar */}
          <div
            className="absolute bottom-0 h-3 bg-red-400 dark:bg-red-500 rounded"
            style={{ left: `${cLeft}%`, width: `${Math.max(cWidth, 1)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-1">
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            Your event
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            {conflict.event.title}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Conflict Check
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Checking &ldquo;{proposedEvent.title}&rdquo; for scheduling conflicts
        </p>
      </div>

      {/* Body */}
      <div className="p-5">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <svg className="animate-spin h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="ml-3 text-sm text-slate-500 dark:text-slate-400">
              Checking for conflicts...
            </span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            <button
              onClick={checkConflicts}
              className="mt-2 text-sm font-medium text-red-600 dark:text-red-400 hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && conflicts.length === 0 && (
          <div className="text-center py-8">
            <div className="w-14 h-14 bg-green-100 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
              No conflicts found
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              This time slot is available. You&apos;re good to go.
            </p>
          </div>
        )}

        {!loading && !error && conflicts.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl">
              <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-sm text-amber-700 dark:text-amber-400">
                {conflicts.length} conflict{conflicts.length !== 1 ? 's' : ''} detected with existing events
              </p>
            </div>

            {conflicts.map((conflict) => (
              <div
                key={conflict.event.id}
                className={`p-4 rounded-xl border ${
                  conflict.severity === 'hard'
                    ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                    : 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          conflict.severity === 'hard'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}
                      >
                        {conflict.severity === 'hard' ? 'Hard conflict' : 'Soft conflict'}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 capitalize">
                        {conflict.event.type}
                      </span>
                    </div>

                    <h4 className="font-medium text-slate-900 dark:text-white truncate">
                      {conflict.event.title}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                      {formatDateTime(conflict.event.startDate)} &ndash; {formatDateTime(conflict.event.endDate)}
                    </p>
                    {conflict.event.organizer && (
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        Organized by {conflict.event.organizer.name}
                      </p>
                    )}

                    <OverlapBar conflict={conflict} />
                  </div>
                </div>

                {/* Resolution suggestions */}
                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                    Resolution options
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => onResolve('next_slot', conflict)}
                      className="px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                    >
                      Move to next available slot
                    </button>
                    <button
                      onClick={() => onResolve('change_time', conflict)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                    >
                      Change time
                    </button>
                    <button
                      onClick={() => onResolve('proceed', conflict)}
                      className="px-3 py-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg transition-colors"
                    >
                      Proceed anyway
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
