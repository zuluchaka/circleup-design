import { useMemo } from 'react'
import type { Event, EventType } from '@/../product/sections/communication-and-events/types'

// ============================================
// Types
// ============================================

interface AttendanceDataPoint {
  eventId: string
  presentCount: number
  totalMembers: number
}

interface CircleAttendancePatternsProps {
  circleId: string
  events: Event[]
  attendanceData: AttendanceDataPoint[]
}

// ============================================
// Helpers
// ============================================

function formatShortDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function getDayName(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', { weekday: 'long' })
}

function getEventTypeLabel(type: EventType): string {
  const labels: Record<EventType, string> = {
    meeting: 'Meeting',
    celebration: 'Celebration',
    fundraiser: 'Fundraiser',
    workshop: 'Workshop',
    social: 'Social',
    other: 'Other',
  }
  return labels[type] || type
}

// ============================================
// Component
// ============================================

export function CircleAttendancePatterns({
  events,
  attendanceData,
}: CircleAttendancePatternsProps) {
  const attendanceMap = useMemo(() => {
    const map = new Map<string, AttendanceDataPoint>()
    for (const d of attendanceData) {
      map.set(d.eventId, d)
    }
    return map
  }, [attendanceData])

  // Events sorted chronologically that have attendance data
  const eventsWithAttendance = useMemo(
    () =>
      events
        .filter((e) => attendanceMap.has(e.id))
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()),
    [events, attendanceMap],
  )

  // Attendance rates per event
  const rates = useMemo(
    () =>
      eventsWithAttendance.map((e) => {
        const d = attendanceMap.get(e.id)!
        return {
          event: e,
          rate: d.totalMembers > 0 ? d.presentCount / d.totalMembers : 0,
          present: d.presentCount,
          total: d.totalMembers,
        }
      }),
    [eventsWithAttendance, attendanceMap],
  )

  // Summary stats
  const avgRate = useMemo(() => {
    if (rates.length === 0) return 0
    return rates.reduce((sum, r) => sum + r.rate, 0) / rates.length
  }, [rates])

  const trend = useMemo(() => {
    if (rates.length < 2) return 'stable' as const
    const half = Math.floor(rates.length / 2)
    const firstHalfAvg =
      rates.slice(0, half).reduce((s, r) => s + r.rate, 0) / half
    const secondHalfAvg =
      rates.slice(half).reduce((s, r) => s + r.rate, 0) / (rates.length - half)
    if (secondHalfAvg - firstHalfAvg > 0.05) return 'up' as const
    if (firstHalfAvg - secondHalfAvg > 0.05) return 'down' as const
    return 'stable' as const
  }, [rates])

  const mostPopularType = useMemo(() => {
    if (rates.length === 0) return null
    const byType = new Map<EventType, { total: number; count: number }>()
    for (const r of rates) {
      const prev = byType.get(r.event.type) || { total: 0, count: 0 }
      byType.set(r.event.type, {
        total: prev.total + r.rate,
        count: prev.count + 1,
      })
    }
    let best: EventType | null = null
    let bestAvg = 0
    for (const [type, { total, count }] of byType) {
      const avg = total / count
      if (avg > bestAvg) {
        bestAvg = avg
        best = type
      }
    }
    return best
  }, [rates])

  const peakDay = useMemo(() => {
    if (rates.length === 0) return null
    const byDay = new Map<string, { total: number; count: number }>()
    for (const r of rates) {
      const day = getDayName(r.event.startDate)
      const prev = byDay.get(day) || { total: 0, count: 0 }
      byDay.set(day, { total: prev.total + r.rate, count: prev.count + 1 })
    }
    let best: string | null = null
    let bestAvg = 0
    for (const [day, { total, count }] of byDay) {
      const avg = total / count
      if (avg > bestAvg) {
        bestAvg = avg
        best = day
      }
    }
    return best
  }, [rates])

  // Member engagement breakdown using per-member data approximation
  // For a true breakdown we'd need per-member attendance; here we simulate
  // based on the data we have
  const engagement = useMemo(() => {
    if (rates.length === 0 || attendanceData.length === 0) {
      return { regular: 0, occasional: 0, rare: 0 }
    }
    // Use the most recent event's totalMembers as the member count
    const lastData = attendanceData[attendanceData.length - 1]
    const totalMembers = lastData.totalMembers
    if (totalMembers === 0) return { regular: 0, occasional: 0, rare: 0 }

    // Estimate using average attendance rate
    const regularCount = Math.round(totalMembers * Math.min(avgRate, 0.75))
    const occasionalCount = Math.round(
      totalMembers * Math.min(Math.max(avgRate - 0.25, 0), 0.5),
    )
    const rareCount = Math.max(totalMembers - regularCount - occasionalCount, 0)

    return { regular: regularCount, occasional: occasionalCount, rare: rareCount }
  }, [rates, attendanceData, avgRate])

  // Top 3 events by attendance rate
  const topEvents = useMemo(
    () => [...rates].sort((a, b) => b.rate - a.rate).slice(0, 3),
    [rates],
  )

  // Recommendations
  const recommendations = useMemo(() => {
    const tips: string[] = []

    if (peakDay) {
      const peakDayRates = rates.filter(
        (r) => getDayName(r.event.startDate) === peakDay,
      )
      const otherRates = rates.filter(
        (r) => getDayName(r.event.startDate) !== peakDay,
      )
      if (peakDayRates.length > 0 && otherRates.length > 0) {
        const peakAvg =
          peakDayRates.reduce((s, r) => s + r.rate, 0) / peakDayRates.length
        const otherAvg =
          otherRates.reduce((s, r) => s + r.rate, 0) / otherRates.length
        const diff = Math.round((peakAvg - otherAvg) * 100)
        if (diff > 5) {
          tips.push(
            `${peakDay} events have ${diff}% higher attendance than other days`,
          )
        }
      }
    }

    if (mostPopularType) {
      tips.push(
        `${getEventTypeLabel(mostPopularType)} events tend to draw the most attendees`,
      )
    }

    if (trend === 'down') {
      tips.push(
        'Attendance has been declining recently. Consider surveying members for preferences.',
      )
    } else if (trend === 'up') {
      tips.push('Attendance is trending upward. Keep up the great work!')
    }

    if (avgRate < 0.5) {
      tips.push(
        'Consider sending reminders 24 hours before events to boost attendance',
      )
    }

    if (tips.length === 0) {
      tips.push('Keep organizing diverse events to maintain engagement')
    }

    return tips
  }, [peakDay, mostPopularType, trend, avgRate, rates])

  // Max rate for chart scaling
  const maxRate = useMemo(
    () => Math.max(...rates.map((r) => r.rate), 0.01),
    [rates],
  )

  if (rates.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
          No attendance data yet
        </h3>
        <p className="text-slate-500 dark:text-slate-400">
          Attendance patterns will appear here once events have been held
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Avg Attendance</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {Math.round(avgRate * 100)}%
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Trend</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-2xl font-bold text-slate-900 dark:text-white capitalize">
              {trend}
            </p>
            {trend === 'up' && (
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            )}
            {trend === 'down' && (
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
            {trend === 'stable' && (
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
              </svg>
            )}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Most Popular Type</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {mostPopularType ? getEventTypeLabel(mostPopularType) : '--'}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Peak Day</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {peakDay || '--'}
          </p>
        </div>
      </div>

      {/* Attendance Over Time Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Attendance Over Time
        </h3>
        <div className="flex items-end gap-1 h-40">
          {rates.map((r) => {
            const heightPct = (r.rate / maxRate) * 100
            const ratePct = Math.round(r.rate * 100)
            return (
              <div
                key={r.event.id}
                className="flex-1 flex flex-col items-center group relative"
              >
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                  <div className="bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                    <p className="font-medium">{r.event.title}</p>
                    <p>
                      {r.present}/{r.total} ({ratePct}%)
                    </p>
                  </div>
                </div>
                {/* Bar */}
                <div
                  className={`w-full rounded-t transition-all ${
                    r.rate >= 0.75
                      ? 'bg-green-500 dark:bg-green-400'
                      : r.rate >= 0.5
                        ? 'bg-indigo-500 dark:bg-indigo-400'
                        : r.rate >= 0.25
                          ? 'bg-amber-500 dark:bg-amber-400'
                          : 'bg-red-400 dark:bg-red-500'
                  }`}
                  style={{ height: `${Math.max(heightPct, 4)}%` }}
                />
                {/* Label */}
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 truncate w-full text-center">
                  {formatShortDate(r.event.startDate)}
                </p>
              </div>
            )
          })}
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs text-slate-400 dark:text-slate-500">
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-green-500" /> 75%+
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" /> 50-74%
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> 25-49%
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-red-400" /> &lt;25%
          </span>
        </div>
      </div>

      {/* Member Engagement Breakdown */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Member Engagement
        </h3>
        <div className="space-y-4">
          {[
            {
              label: 'Regular',
              description: '> 75% attendance',
              count: engagement.regular,
              color: 'bg-green-500 dark:bg-green-400',
              textColor: 'text-green-600 dark:text-green-400',
            },
            {
              label: 'Occasional',
              description: '25-75% attendance',
              count: engagement.occasional,
              color: 'bg-amber-500 dark:bg-amber-400',
              textColor: 'text-amber-600 dark:text-amber-400',
            },
            {
              label: 'Rare',
              description: '< 25% attendance',
              count: engagement.rare,
              color: 'bg-red-400 dark:bg-red-500',
              textColor: 'text-red-600 dark:text-red-400',
            },
          ].map((tier) => {
            const total =
              engagement.regular + engagement.occasional + engagement.rare
            const pct = total > 0 ? (tier.count / total) * 100 : 0
            return (
              <div key={tier.label}>
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {tier.label}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 ml-2">
                      ({tier.description})
                    </span>
                  </div>
                  <span className={`text-sm font-medium ${tier.textColor}`}>
                    {tier.count} members
                  </span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${tier.color} transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Best Performing Events */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Best Performing Events
        </h3>
        {topEvents.length > 0 ? (
          <div className="space-y-3">
            {topEvents.map((r, idx) => (
              <div
                key={r.event.id}
                className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl"
              >
                <span className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 dark:text-white truncate">
                    {r.event.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formatShortDate(r.event.startDate)} &middot;{' '}
                    {getEventTypeLabel(r.event.type)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {Math.round(r.rate * 100)}%
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {r.present}/{r.total}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No events with attendance data
          </p>
        )}
      </div>

      {/* Recommendations */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Recommendations
        </h3>
        <div className="space-y-3">
          {recommendations.map((tip, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/20 rounded-xl"
            >
              <svg
                className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <p className="text-sm text-slate-700 dark:text-slate-300">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
