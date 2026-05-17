import type { CycleProgressProps } from '@/../product/sections/rosca-circles/types'

const statusColors: Record<string, string> = {
  confirmed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  not_started: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
}

export function CircleCycleProgress({
  data,
  circle,
  isOrganizer,
  onTriggerPayout,
  onRetryPayment,
}: CycleProgressProps) {
  const progressPercent = Math.min(data.collectionProgress * 100, 100)
  const currency = circle.currency || 'CHF'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Cycle {data.cycle} of {data.totalCycles}
          </h3>
          {data.dueDate && (
            <p className="text-sm text-slate-500">Due: {new Date(data.dueDate).toLocaleDateString()}</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {Math.round(progressPercent)}%
          </p>
          <p className="text-sm text-slate-500">collected</p>
        </div>
      </div>

      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
        <div
          className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-500">Confirmed</p>
          <p className="text-xl font-bold text-emerald-600">{data.confirmedCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-500">Pending</p>
          <p className="text-xl font-bold text-amber-600">{data.pendingCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-500">Failed</p>
          <p className="text-xl font-bold text-red-600">{data.failedCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-500">Collected</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            {currency} {data.collectedTotal.toLocaleString()}
          </p>
        </div>
      </div>

      {data.payoutRecipient && (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-800 dark:text-indigo-300">Payout Recipient</p>
              <p className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">{data.payoutRecipient.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-indigo-600 dark:text-indigo-400">Amount</p>
              <p className="text-lg font-bold text-indigo-900 dark:text-indigo-100">
                {currency} {data.payoutAmount.toLocaleString()}
              </p>
            </div>
          </div>
          {isOrganizer && !data.payoutTriggered && progressPercent >= 100 && (
            <button
              onClick={onTriggerPayout}
              className="mt-3 w-full bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Trigger Payout
            </button>
          )}
        </div>
      )}

      <div>
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Member Payments</h4>
        <div className="space-y-2">
          {data.paymentGrid.map((entry) => (
            <div
              key={entry.memberId}
              className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {entry.memberName}
                </span>
                {entry.isLate && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Late</span>
                )}
                {entry.failureReason && (
                  <span className="text-xs text-red-500">{entry.failureReason}</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {entry.amount > 0 && (
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {currency} {entry.amount.toLocaleString()}
                  </span>
                )}
                <span className={`text-xs px-2 py-1 rounded-full ${statusColors[entry.status] || statusColors.not_started}`}>
                  {entry.status.replace('_', ' ')}
                </span>
                {entry.canRetry && onRetryPayment && (
                  <button
                    onClick={() => onRetryPayment(entry.memberId)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                  >
                    Retry
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
