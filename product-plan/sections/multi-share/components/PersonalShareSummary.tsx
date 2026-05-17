'use client'

import type { Circle, Member, ShareRequest } from '../types'

interface PersonalShareSummaryProps {
  circles: {
    circle: Circle
    memberData: Member
  }[]
  pendingRequests: ShareRequest[]
  totalMonthlyCommitment: number
  totalExpectedPayouts: number
  onCircleClick?: (circleId: string) => void
  onExportAnnualSummary?: () => void
}

export function PersonalShareSummary({
  circles,
  pendingRequests,
  totalMonthlyCommitment,
  totalExpectedPayouts,
  onCircleClick,
  onExportAnnualSummary,
}: PersonalShareSummaryProps) {
  const totalShares = circles.reduce((sum, { memberData }) => sum + memberData.shares, 0)
  const totalContributed = circles.reduce((sum, { memberData }) => sum + memberData.totalContributed, 0)

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h2 className="text-lg font-medium text-indigo-200">My Share Portfolio</h2>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-5xl font-bold">{totalShares}</span>
              <span className="text-xl text-indigo-200">Total Shares</span>
            </div>
            <p className="mt-2 text-indigo-200">
              Across {circles.length} active circle{circles.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white/10 rounded-xl backdrop-blur">
              <p className="text-sm text-indigo-200">Monthly Commitment</p>
              <p className="text-xl font-bold mt-1">
                CHF {totalMonthlyCommitment.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-white/10 rounded-xl backdrop-blur">
              <p className="text-sm text-indigo-200">Expected Payouts</p>
              <p className="text-xl font-bold mt-1">
                CHF {totalExpectedPayouts.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-white/10 rounded-xl backdrop-blur">
              <p className="text-sm text-indigo-200">Total Contributed</p>
              <p className="text-xl font-bold mt-1">
                CHF {totalContributed.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-white/10 rounded-xl backdrop-blur">
              <p className="text-sm text-indigo-200">Pending Requests</p>
              <p className="text-xl font-bold mt-1">
                {pendingRequests.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Circle Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">My Circles</h3>
          {onExportAnnualSummary && (
            <button
              onClick={onExportAnnualSummary}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Annual Summary
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {circles.map(({ circle, memberData }) => {
            const monthlyAmount = memberData.shares * circle.baseContribution
            const expectedPayout = (memberData.shares / circle.multiShareConfig.currentTotalShares) *
              (circle.multiShareConfig.currentTotalShares * circle.baseContribution)
            const pendingRequest = pendingRequests.find(r => r.circleId === circle.id)

            return (
              <div
                key={circle.id}
                onClick={() => onCircleClick?.(circle.id)}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{circle.name}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{circle.associationName}</p>
                  </div>
                  <span className={`
                    inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                    ${circle.status === 'active'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }
                  `}>
                    {circle.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wide">Shares</p>
                    <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{memberData.shares}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">of {circle.multiShareConfig.currentTotalShares}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wide">Monthly</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">
                      {circle.currency} {monthlyAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wide">Payout</p>
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      #{memberData.payoutPosition}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      {memberData.payoutStatus === 'received' ? 'Received' : 'Pending'}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                    <span>Cycle {circle.currentCycle} of {circle.totalCycles}</span>
                    <span>{Math.round((circle.currentCycle / circle.totalCycles) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${(circle.currentCycle / circle.totalCycles) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Expected Payout */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Expected Payout</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {circle.currency} {expectedPayout.toLocaleString()}
                  </span>
                </div>

                {/* Pending Request Badge */}
                {pendingRequest && (
                  <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      <span className="text-sm font-medium text-amber-900 dark:text-amber-100">
                        {pendingRequest.type === 'increase' ? 'Increase' : 'Reduction'} request pending
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Pending Requests Section */}
      {pendingRequests.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Pending Requests</h3>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {pendingRequests.map((request) => (
              <div key={request.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${request.type === 'increase'
                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                    }
                  `}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={request.type === 'increase'
                          ? 'M5 10l7-7m0 0l7 7m-7-7v18'
                          : 'M19 14l-7 7m0 0l-7-7m7 7V3'
                        }
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{request.circleName}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {request.type === 'increase' ? 'Increase' : 'Reduce'} from {request.currentShares} to {request.newTotal} shares
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {new Date(request.requestedAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Awaiting approval</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Avg. Trust Score</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {Math.round(circles.reduce((sum, { memberData }) => sum + memberData.trustScore, 0) / circles.length)}
              </p>
            </div>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${Math.round(circles.reduce((sum, { memberData }) => sum + memberData.trustScore, 0) / circles.length / 10)}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">On-Time Payments</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {circles.reduce((sum, { memberData }) => sum + memberData.contributionStats.onTime, 0)}
              </p>
            </div>
          </div>
          <p className="text-sm text-emerald-600 dark:text-emerald-400">
            {circles.reduce((sum, { memberData }) => sum + memberData.contributionStats.late, 0)} late payments
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Payouts Received</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {circles.filter(({ memberData }) => memberData.payoutStatus === 'received').length}
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            of {circles.length} circles
          </p>
        </div>
      </div>
    </div>
  )
}
