import type { EmergencyFundProps, InterventionStatus } from '@/../product/sections/rosca-circles/types'

const statusColors: Record<InterventionStatus, string> = {
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  active: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  repaid: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  written_off: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

export function EmergencyFundPanel({
  circle,
  interventions,
  currentUserId,
  onMakeRepayment,
  onViewDetails,
}: EmergencyFundProps) {
  const totalCovered = interventions.reduce((sum, i) => sum + i.coveredAmount, 0)
  const totalRepaid = interventions.reduce(
    (sum, i) => sum + (i.debtAmount - i.debtRemaining),
    0
  )

  const myInterventions = interventions.filter(
    (i) => i.defaultingParticipantId === currentUserId
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Emergency Fund
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            {circle.name} • Protection against member defaults
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Fund Overview */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-6 text-white mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-amber-100">Current Balance</p>
              <p className="text-3xl font-bold">
                {circle.currency} {circle.emergencyFundBalance.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
            <div>
              <p className="text-amber-100 text-sm">Contribution Rate</p>
              <p className="text-xl font-semibold">{circle.emergencyFundRate}%</p>
            </div>
            <div>
              <p className="text-amber-100 text-sm">Total Covered</p>
              <p className="text-xl font-semibold">{circle.currency} {totalCovered.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-amber-100 text-sm">Repaid</p>
              <p className="text-xl font-semibold">{circle.currency} {totalRepaid.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* My Interventions (if any) */}
        {myInterventions.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 p-6 mb-8">
            <h2 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Your Outstanding Debt
            </h2>

            {myInterventions.map((intervention) => (
              <div
                key={intervention.id}
                className="bg-white dark:bg-slate-800 rounded-lg p-4 mb-4 last:mb-0"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      Cycle {intervention.cycle} Default Coverage
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Covered on {new Date(intervention.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[intervention.status]}`}>
                    {intervention.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Covered</p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {circle.currency} {intervention.coveredAmount.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Repaid</p>
                    <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {circle.currency} {(intervention.debtAmount - intervention.debtRemaining).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-900/30">
                    <p className="text-xs text-red-600 dark:text-red-400">Remaining</p>
                    <p className="font-semibold text-red-600 dark:text-red-400">
                      {circle.currency} {intervention.debtRemaining.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Repayment Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-slate-500 dark:text-slate-400">Repayment Progress</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {Math.round(((intervention.debtAmount - intervention.debtRemaining) / intervention.debtAmount) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-600">
                    <div
                      className="h-2 rounded-full bg-emerald-500"
                      style={{
                        width: `${((intervention.debtAmount - intervention.debtRemaining) / intervention.debtAmount) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Due by: {new Date(intervention.repaymentDueDate).toLocaleDateString()}
                  </p>
                  {intervention.status === 'active' && onMakeRepayment && (
                    <button
                      onClick={() => onMakeRepayment(intervention.id, intervention.debtRemaining)}
                      className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors"
                    >
                      Make Repayment
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* All Interventions */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Intervention History ({interventions.length})
          </h2>

          {interventions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-slate-500 dark:text-slate-400">
                No emergency fund interventions have been needed
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {interventions.map((intervention) => (
                <div
                  key={intervention.id}
                  className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  onClick={() => onViewDetails?.(intervention.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {intervention.defaultingParticipantName}
                        {intervention.defaultingParticipantId === currentUserId && (
                          <span className="ml-2 text-sm text-indigo-600 dark:text-indigo-400">(You)</span>
                        )}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Cycle {intervention.cycle} • {new Date(intervention.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[intervention.status]}`}>
                      {intervention.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Covered:</span>{' '}
                      <span className="font-medium text-slate-900 dark:text-white">
                        {circle.currency} {intervention.coveredAmount.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Outstanding:</span>{' '}
                      <span className={`font-medium ${intervention.debtRemaining > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {circle.currency} {intervention.debtRemaining.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Mini Progress Bar */}
                  {intervention.debtAmount > 0 && (
                    <div className="mt-3">
                      <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-600">
                        <div
                          className="h-1.5 rounded-full bg-emerald-500"
                          style={{
                            width: `${((intervention.debtAmount - intervention.debtRemaining) / intervention.debtAmount) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Repayment History */}
                  {intervention.repayments.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                        Recent Repayments
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {intervention.repayments.slice(0, 3).map((repayment, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                          >
                            {circle.currency} {repayment.amount.toLocaleString()} • {new Date(repayment.paidAt).toLocaleDateString()}
                          </span>
                        ))}
                        {intervention.repayments.length > 3 && (
                          <span className="text-xs px-2 py-1 text-slate-500 dark:text-slate-400">
                            +{intervention.repayments.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* How It Works */}
        <div className="mt-8 p-6 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
          <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-3">
            How the Emergency Fund Works
          </h3>
          <ul className="space-y-2 text-sm text-indigo-800 dark:text-indigo-200">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-200 dark:bg-indigo-800 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
              <span>{circle.emergencyFundRate}% of each contribution is set aside in the emergency fund</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-200 dark:bg-indigo-800 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
              <span>When a member defaults, the fund covers their missed contribution</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-200 dark:bg-indigo-800 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
              <span>The defaulting member must repay the fund before receiving any payout</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-200 dark:bg-indigo-800 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
              <span>This protects all members from the impact of individual defaults</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
