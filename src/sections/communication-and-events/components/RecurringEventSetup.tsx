import { useState, useMemo } from 'react'

// ============================================
// Types
// ============================================

type Frequency = 'weekly' | 'biweekly' | 'monthly' | 'custom'

type EndType = 'never' | 'date' | 'count'

export interface RecurringPattern {
  frequency: Frequency
  daysOfWeek: number[] // 0 = Sunday ... 6 = Saturday
  dayOfMonth: number | null
  time: string // HH:mm
  startDate: string
  endDate: string | null
  endAfterCount: number | null
  exceptionDates: string[]
  customIntervalDays?: number
}

interface RecurringEventSetupProps {
  onSave: (pattern: RecurringPattern) => void
  initialPattern?: Partial<RecurringPattern>
}

// ============================================
// Helpers
// ============================================

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const FREQUENCY_OPTIONS: { value: Frequency; label: string; description: string }[] = [
  { value: 'weekly', label: 'Weekly', description: 'Repeats every week' },
  { value: 'biweekly', label: 'Bi-weekly', description: 'Repeats every two weeks' },
  { value: 'monthly', label: 'Monthly', description: 'Repeats once a month' },
  { value: 'custom', label: 'Custom', description: 'Set a custom interval' },
]

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

function formatPreviewDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function generatePreviewDates(
  frequency: Frequency,
  startDate: string,
  daysOfWeek: number[],
  dayOfMonth: number | null,
  endDate: string | null,
  endAfterCount: number | null,
  exceptionDates: string[],
  customIntervalDays?: number,
  maxCount = 5,
): Date[] {
  if (!startDate) return []

  const start = new Date(startDate)
  const dates: Date[] = []
  const exceptionSet = new Set(exceptionDates)
  const maxIterations = 200
  let iterations = 0

  if (frequency === 'monthly') {
    const targetDay = dayOfMonth || start.getDate()
    let current = new Date(start.getFullYear(), start.getMonth(), targetDay)
    if (current < start) current = addMonths(current, 1)

    while (dates.length < maxCount && iterations < maxIterations) {
      iterations++
      const dateStr = current.toISOString().split('T')[0]
      if (endDate && current > new Date(endDate)) break
      if (endAfterCount && dates.length >= endAfterCount) break
      if (!exceptionSet.has(dateStr)) {
        dates.push(new Date(current))
      }
      current = addMonths(current, 1)
    }
    return dates
  }

  // weekly / biweekly / custom
  const interval =
    frequency === 'custom' && customIntervalDays
      ? customIntervalDays
      : frequency === 'biweekly'
        ? 14
        : 7

  if (frequency === 'custom' || daysOfWeek.length === 0) {
    let current = new Date(start)
    while (dates.length < maxCount && iterations < maxIterations) {
      iterations++
      const dateStr = current.toISOString().split('T')[0]
      if (endDate && current > new Date(endDate)) break
      if (endAfterCount && dates.length >= endAfterCount) break
      if (!exceptionSet.has(dateStr)) {
        dates.push(new Date(current))
      }
      current = addDays(current, interval)
    }
    return dates
  }

  // Weekly / biweekly with specific days
  let weekStart = new Date(start)
  weekStart.setDate(weekStart.getDate() - weekStart.getDay()) // go to Sunday

  while (dates.length < maxCount && iterations < maxIterations) {
    for (const day of daysOfWeek.sort((a, b) => a - b)) {
      iterations++
      const candidate = addDays(weekStart, day)
      if (candidate < start) continue
      if (endDate && candidate > new Date(endDate)) return dates
      if (endAfterCount && dates.length >= endAfterCount) return dates
      const dateStr = candidate.toISOString().split('T')[0]
      if (!exceptionSet.has(dateStr)) {
        dates.push(candidate)
      }
      if (dates.length >= maxCount) return dates
    }
    weekStart = addDays(weekStart, interval)
  }

  return dates
}

// ============================================
// Component
// ============================================

export function RecurringEventSetup({
  onSave,
  initialPattern,
}: RecurringEventSetupProps) {
  const [frequency, setFrequency] = useState<Frequency>(
    initialPattern?.frequency || 'weekly',
  )
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(
    initialPattern?.daysOfWeek || [],
  )
  const [dayOfMonth, setDayOfMonth] = useState<number | null>(
    initialPattern?.dayOfMonth ?? null,
  )
  const [time, setTime] = useState(initialPattern?.time || '09:00')
  const [startDate, setStartDate] = useState(initialPattern?.startDate || '')
  const [endType, setEndType] = useState<EndType>(
    initialPattern?.endAfterCount
      ? 'count'
      : initialPattern?.endDate
        ? 'date'
        : 'never',
  )
  const [endDate, setEndDate] = useState(initialPattern?.endDate || '')
  const [endAfterCount, setEndAfterCount] = useState<number>(
    initialPattern?.endAfterCount || 10,
  )
  const [exceptionDates, setExceptionDates] = useState<string[]>(
    initialPattern?.exceptionDates || [],
  )
  const [newException, setNewException] = useState('')
  const [customIntervalDays, setCustomIntervalDays] = useState<number>(
    initialPattern?.customIntervalDays || 7,
  )

  const toggleDay = (day: number) => {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    )
  }

  const addException = () => {
    if (newException && !exceptionDates.includes(newException)) {
      setExceptionDates((prev) => [...prev, newException].sort())
      setNewException('')
    }
  }

  const removeException = (date: string) => {
    setExceptionDates((prev) => prev.filter((d) => d !== date))
  }

  const previewDates = useMemo(
    () =>
      generatePreviewDates(
        frequency,
        startDate,
        daysOfWeek,
        dayOfMonth,
        endType === 'date' ? endDate : null,
        endType === 'count' ? endAfterCount : null,
        exceptionDates,
        customIntervalDays,
      ),
    [frequency, startDate, daysOfWeek, dayOfMonth, endDate, endAfterCount, endType, exceptionDates, customIntervalDays],
  )

  const handleSave = () => {
    const pattern: RecurringPattern = {
      frequency,
      daysOfWeek,
      dayOfMonth: frequency === 'monthly' ? dayOfMonth : null,
      time,
      startDate,
      endDate: endType === 'date' ? endDate : null,
      endAfterCount: endType === 'count' ? endAfterCount : null,
      exceptionDates,
      ...(frequency === 'custom' ? { customIntervalDays } : {}),
    }
    onSave(pattern)
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Recurring Event Setup
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Configure the repeating schedule for this event
        </p>
      </div>

      <div className="p-5 space-y-6">
        {/* Frequency */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Frequency
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {FREQUENCY_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`flex flex-col p-3 rounded-xl cursor-pointer transition-colors ${
                  frequency === opt.value
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-800'
                    : 'bg-slate-50 dark:bg-slate-700 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-600'
                }`}
                onClick={() => setFrequency(opt.value)}
              >
                <input
                  type="radio"
                  name="frequency"
                  value={opt.value}
                  checked={frequency === opt.value}
                  onChange={() => setFrequency(opt.value)}
                  className="sr-only"
                />
                <span className="font-medium text-slate-900 dark:text-white text-sm">
                  {opt.label}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {opt.description}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Custom interval */}
        {frequency === 'custom' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Repeat every N days
            </label>
            <input
              type="number"
              min={1}
              value={customIntervalDays}
              onChange={(e) => setCustomIntervalDays(parseInt(e.target.value, 10) || 1)}
              className="w-32 px-4 py-3 bg-slate-50 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}

        {/* Day-of-week checkboxes (weekly/biweekly) */}
        {(frequency === 'weekly' || frequency === 'biweekly') && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Days of the week
            </label>
            <div className="flex gap-2">
              {DAY_LABELS.map((label, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleDay(idx)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                    daysOfWeek.includes(idx)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Day-of-month selector (monthly) */}
        {frequency === 'monthly' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Day of month
            </label>
            <select
              value={dayOfMonth ?? ''}
              onChange={(e) =>
                setDayOfMonth(e.target.value ? parseInt(e.target.value, 10) : null)
              }
              className="w-32 px-4 py-3 bg-slate-50 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Auto</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Time */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Time
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-40 px-4 py-3 bg-slate-50 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Start date */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Start date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-48 px-4 py-3 bg-slate-50 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* End condition */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Ends
          </label>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="endType"
                checked={endType === 'never'}
                onChange={() => setEndType('never')}
                className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">Never</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="endType"
                checked={endType === 'date'}
                onChange={() => setEndType('date')}
                className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">On date</span>
              {endType === 'date' && (
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="ml-2 px-3 py-2 bg-slate-50 dark:bg-slate-700 border-0 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              )}
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="endType"
                checked={endType === 'count'}
                onChange={() => setEndType('count')}
                className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">After</span>
              {endType === 'count' && (
                <>
                  <input
                    type="number"
                    min={1}
                    value={endAfterCount}
                    onChange={(e) => setEndAfterCount(parseInt(e.target.value, 10) || 1)}
                    className="w-20 ml-2 px-3 py-2 bg-slate-50 dark:bg-slate-700 border-0 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    occurrences
                  </span>
                </>
              )}
            </label>
          </div>
        </div>

        {/* Exception dates */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Exception dates (skip these dates)
          </label>
          <div className="flex items-center gap-2 mb-3">
            <input
              type="date"
              value={newException}
              onChange={(e) => setNewException(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-700 border-0 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={addException}
              disabled={!newException}
              className="px-3 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-colors disabled:opacity-40"
            >
              Add
            </button>
          </div>
          {exceptionDates.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {exceptionDates.map((date) => (
                <span
                  key={date}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-lg"
                >
                  {date}
                  <button
                    type="button"
                    onClick={() => removeException(date)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Preview */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Preview (next {previewDates.length} occurrences)
          </label>
          {previewDates.length > 0 ? (
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 space-y-2">
              {previewDates.map((date, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300"
                >
                  <span className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-xs font-medium">
                    {idx + 1}
                  </span>
                  <span>{formatPreviewDate(date)} at {time}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 dark:text-slate-500">
              Select a start date to see preview
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-5 border-t border-slate-200 dark:border-slate-700 flex justify-end">
        <button
          onClick={handleSave}
          disabled={!startDate}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Save Pattern
        </button>
      </div>
    </div>
  )
}
