import type { QuorumType } from '@/../product/sections/communication-and-events/types'

export interface QuorumIndicatorProps {
  presentCount: number
  proxyCount: number
  totalMembers: number
  quorumRequirement: number
  quorumType: QuorumType
  compact?: boolean
}

export default function QuorumIndicator({
  presentCount,
  proxyCount,
  totalMembers,
  quorumRequirement,
  quorumType,
  compact = false,
}: QuorumIndicatorProps) {
  const effectiveCount = presentCount + proxyCount

  const needed =
    quorumType === 'percentage'
      ? Math.ceil((quorumRequirement / 100) * totalMembers)
      : quorumRequirement

  const progress = needed > 0 ? Math.min((effectiveCount / needed) * 100, 100) : 0
  const percentage = totalMembers > 0 ? Math.round((effectiveCount / totalMembers) * 100) : 0
  const quorumMet = effectiveCount >= needed

  // Color based on progress toward quorum
  let barColor: string
  let borderColor: string
  let bgTint: string
  let labelColor: string

  if (quorumMet) {
    barColor = 'bg-green-500'
    borderColor = 'border-green-300'
    bgTint = 'bg-green-50 dark:bg-green-900/20'
    labelColor = 'text-green-700 dark:text-green-300'
  } else if (progress > 75) {
    barColor = 'bg-amber-500'
    borderColor = 'border-amber-300'
    bgTint = 'bg-amber-50 dark:bg-amber-900/20'
    labelColor = 'text-amber-700 dark:text-amber-300'
  } else {
    barColor = 'bg-red-500'
    borderColor = 'border-red-300'
    bgTint = 'bg-red-50 dark:bg-red-900/20'
    labelColor = 'text-red-700 dark:text-red-300'
  }

  if (compact) {
    return (
      <div className={`p-2 rounded-md border ${borderColor} ${bgTint}`}>
        <div className="flex items-center justify-between gap-3">
          <span className={`text-xs font-medium ${labelColor}`}>
            {quorumMet ? 'Quorum Met' : 'Quorum Not Met'}
          </span>
          <span className="text-xs text-gray-500">
            {effectiveCount}/{needed}
          </span>
        </div>
        <div className="mt-1.5 w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${barColor}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={`p-4 rounded-lg border-2 ${borderColor} ${bgTint}`}>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">
            Quorum {quorumMet ? 'Met' : 'Not Met'}
          </h4>
          <p className="text-sm text-gray-500 mt-0.5">
            {effectiveCount} of {needed} required ({percentage}%)
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {effectiveCount}/{needed}
          </p>
          <p className="text-xs text-gray-400">
            {quorumType === 'percentage'
              ? `${quorumRequirement}% of ${totalMembers}`
              : `${quorumRequirement} headcount`}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3 w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Breakdown */}
      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
        <span>
          <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1" />
          Present: {presentCount}
        </span>
        <span>
          <span className="inline-block w-2 h-2 rounded-full bg-purple-400 mr-1" />
          Proxy: {proxyCount}
        </span>
        <span>
          <span className="inline-block w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 mr-1" />
          Total members: {totalMembers}
        </span>
      </div>
    </div>
  )
}
