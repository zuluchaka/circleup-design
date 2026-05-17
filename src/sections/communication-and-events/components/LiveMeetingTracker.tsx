import { useState, useEffect } from 'react'
import type { LiveMeetingTrackerProps } from '@/../product/sections/communication-and-events/types'

export default function LiveMeetingTracker({
  agenda,
  items,
  onStartItem,
  onCompleteItem,
}: LiveMeetingTrackerProps) {
  const [elapsed, setElapsed] = useState(0)
  const currentItem = items.find(i => i.status === 'in_progress')
  const completedCount = items.filter(i => i.status === 'completed').length
  const nextItem = items.find(i => i.status === 'pending')

  // Timer for current item
  useEffect(() => {
    if (!currentItem?.startedAt) { setElapsed(0); return }
    const start = new Date(currentItem.startedAt).getTime()
    const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000))
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [currentItem?.id, currentItem?.startedAt])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const progressPercent = items.length > 0 ? (completedCount / items.length) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Live Meeting
          </h3>
          <span className="text-sm text-gray-500">
            {completedCount}/{items.length} items completed
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Current item */}
      {currentItem ? (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase">
              Now Discussing
            </span>
            <span className={`text-lg font-mono font-bold ${
              elapsed > (currentItem.estimatedDurationMinutes || 999) * 60
                ? 'text-red-600'
                : 'text-blue-600 dark:text-blue-400'
            }`}>
              {formatTime(elapsed)}
              {currentItem.estimatedDurationMinutes && (
                <span className="text-sm font-normal text-gray-400">
                  {' '}/ {currentItem.estimatedDurationMinutes}:00
                </span>
              )}
            </span>
          </div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            {currentItem.title}
          </h4>
          {currentItem.presenterName && (
            <p className="text-sm text-gray-500 mt-1">Presenter: {currentItem.presenterName}</p>
          )}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => onCompleteItem(currentItem.id)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
            >
              Complete Item
            </button>
          </div>
        </div>
      ) : agenda.status === 'in_progress' && nextItem ? (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
          <p className="text-gray-500 mb-3">Ready for next item</p>
          <button
            onClick={() => onStartItem(nextItem.id)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            Start: {nextItem.title}
          </button>
        </div>
      ) : null}

      {/* Item list */}
      <div className="space-y-1">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
              item.status === 'completed'
                ? 'bg-green-50 dark:bg-green-900/10 text-gray-500'
                : item.status === 'in_progress'
                ? 'bg-blue-50 dark:bg-blue-900/20 font-medium'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            <span className="w-6 text-center">
              {item.status === 'completed' ? (
                <span className="text-green-500">&#10003;</span>
              ) : item.status === 'in_progress' ? (
                <span className="text-blue-500">&#9654;</span>
              ) : (
                <span className="text-gray-300">{idx + 1}</span>
              )}
            </span>
            <span className="flex-1">{item.title}</span>
            {item.actualDurationMinutes && (
              <span className="text-xs text-gray-400">{item.actualDurationMinutes} min</span>
            )}
            {item.status === 'pending' && !currentItem && (
              <button
                onClick={() => onStartItem(item.id)}
                className="text-xs text-blue-600 hover:underline"
              >
                Start
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
