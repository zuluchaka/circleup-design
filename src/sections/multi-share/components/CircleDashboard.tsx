'use client'

import { useState } from 'react'
import type { JSX } from 'react'
import type {
  Circle,
  Member,
  ShareRequest,
  ShareDistribution,
  Contribution,
} from '@/../product/sections/multi-share/types'

interface CircleDashboardProps {
  circle: Circle
  members: Member[]
  currentMember: Member
  shareDistribution: ShareDistribution
  pendingRequests: ShareRequest[]
  currentCycleContributions: Contribution[]
  onRequestShares?: () => void
  onReduceShares?: () => void
  onViewMember?: (memberId: string) => void
  onApproveRequest?: (requestId: string) => void
  onRejectRequest?: (requestId: string) => void
  onMakePayment?: () => void
}

export function CircleDashboard({
  circle,
  members,
  currentMember,
  shareDistribution,
  pendingRequests,
  currentCycleContributions,
  onRequestShares,
  onReduceShares: _onReduceShares,
  onViewMember,
  onApproveRequest,
  onRejectRequest,
  onMakePayment,
}: CircleDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'requests'>('overview')

  const isOrganizer = currentMember.role === 'organizer'
  const cycleProgress = (circle.currentCycle / circle.totalCycles) * 100
  // Calculate pool status
  const totalExpectedPool = circle.multiShareConfig.currentTotalShares * circle.baseContribution
  const collectedAmount = currentCycleContributions
    .filter(c => c.status === 'completed')
    .reduce((sum, c) => sum + c.breakdown.sharesContribution, 0)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {circle.name}
                </h1>
                <span className={`
                  inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${circle.status === 'active'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : circle.status === 'forming'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                    : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
                  }
                `}>
                  {circle.status.charAt(0).toUpperCase() + circle.status.slice(1)}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {circle.associationName} · {circle.frequency.replace('_', '-')} · {circle.currency} {circle.baseContribution} base
              </p>
            </div>

            <div className="flex items-center gap-3">
              {currentMember.shares < currentMember.maxEligibleShares && !currentMember.pendingShareRequest && (
                <button
                  onClick={onRequestShares}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Request Shares
                </button>
              )}
              {currentMember.pendingShareRequest && (
                <span className="inline-flex items-center px-4 py-2 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 font-medium">
                  <svg className="w-4 h-4 mr-2 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  Request Pending
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Your Share Status Card */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <p className="text-indigo-200 text-sm font-medium uppercase tracking-wide">Your Position</p>
                <div className="mt-2 flex items-baseline gap-4">
                  <span className="text-5xl font-bold">{currentMember.shares}</span>
                  <span className="text-2xl text-indigo-200">/ {circle.multiShareConfig.maxSharesPerMember} shares</span>
                </div>
                <p className="mt-2 text-indigo-200">
                  {currentMember.sharePercentage.toFixed(1)}% of circle · Payout position #{currentMember.payoutPosition}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur">
                  <p className="text-indigo-200 text-sm">Monthly Contribution</p>
                  <p className="text-2xl font-bold mt-1">
                    {circle.currency} {(currentMember.shares * circle.baseContribution).toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur">
                  <p className="text-indigo-200 text-sm">Expected Payout</p>
                  <p className="text-2xl font-bold mt-1">
                    {circle.currency} {(currentMember.shares * totalExpectedPool / circle.multiShareConfig.currentTotalShares).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {currentMember.shares < currentMember.maxEligibleShares && (
              <div className="mt-6 pt-4 border-t border-indigo-500/30">
                <p className="text-indigo-200 text-sm">
                  Based on your Trust Score of {currentMember.trustScore}, you&apos;re eligible for up to {currentMember.maxEligibleShares} shares
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-800 mb-6">
          <nav className="flex gap-8">
            {(['overview', 'members', 'requests'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  pb-4 text-sm font-medium border-b-2 transition-colors
                  ${activeTab === tab
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }
                `}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'requests' && pendingRequests.length > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white text-xs">
                    {pendingRequests.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Circle Progress */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cycle Progress */}
              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Circle Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600 dark:text-slate-400">Cycle {circle.currentCycle} of {circle.totalCycles}</span>
                      <span className="font-medium text-slate-900 dark:text-white">{cycleProgress.toFixed(0)}%</span>
                    </div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${cycleProgress}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Total Collected</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">
                        {circle.currency} {circle.totalCollected.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Total Disbursed</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">
                        {circle.currency} {circle.totalDisbursed.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Emergency Fund</p>
                      <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                        {circle.currency} {circle.emergencyFundBalance.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Cycle Status */}
              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Cycle {circle.currentCycle} Collection</h3>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {circle.currency} {collectedAmount.toLocaleString()} / {totalExpectedPool.toLocaleString()}
                  </span>
                </div>

                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${(collectedAmount / totalExpectedPool) * 100}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {currentCycleContributions.slice(0, 4).map((contribution) => {
                    const member = members.find(m => m.id === contribution.memberId)
                    return (
                      <div
                        key={contribution.id}
                        className={`
                          p-3 rounded-lg border
                          ${contribution.status === 'completed'
                            ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800'
                            : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700'
                          }
                        `}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-medium">
                            {member?.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                              {member?.name.split(' ')[0]}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {contribution.shareCount} shares
                            </p>
                          </div>
                          {contribution.status === 'completed' && (
                            <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Payment CTA for current member */}
                {currentCycleContributions.find(c => c.memberId === currentMember.id && c.status === 'pending') && (
                  <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <p className="font-medium text-amber-900 dark:text-amber-100">Your contribution is due</p>
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                          {currentMember.shares} shares × {circle.currency} {circle.baseContribution} = {circle.currency} {(currentMember.shares * circle.baseContribution).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={onMakePayment}
                        className="inline-flex items-center px-4 py-2 rounded-lg bg-amber-600 text-white font-medium hover:bg-amber-700 transition-colors"
                      >
                        Pay Now
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Share Distribution */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Share Distribution</h3>

                {/* Donut Chart Visual */}
                <div className="relative mx-auto w-48 h-48 mb-6">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {shareDistribution.members.reduce((acc, member) => {
                      const circumference = 2 * Math.PI * 40
                      const offset = acc.offset
                      const length = (member.percentage / 100) * circumference

                      acc.elements.push(
                        <circle
                          key={member.name}
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke={member.color}
                          strokeWidth="20"
                          strokeDasharray={`${length} ${circumference}`}
                          strokeDashoffset={-offset}
                          className="transition-all duration-500"
                        />
                      )
                      acc.offset += length
                      return acc
                    }, { elements: [] as JSX.Element[], offset: 0 }).elements}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-slate-900 dark:text-white">{shareDistribution.totalShares}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Total Shares</p>
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {shareDistribution.members.slice(0, 6).map((member) => (
                    <div key={member.name} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: member.color }}
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{member.name}</span>
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {member.shares} ({member.percentage.toFixed(1)}%)
                      </span>
                    </div>
                  ))}
                </div>

                {/* Concentration Warning */}
                {shareDistribution.concentrationMetrics.warning && (
                  <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      {shareDistribution.concentrationMetrics.warning}
                    </p>
                  </div>
                )}
              </div>

              {/* Multi-Share Config Info */}
              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Circle Settings</h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-slate-600 dark:text-slate-400">Max Shares/Member</dt>
                    <dd className="font-medium text-slate-900 dark:text-white">{circle.multiShareConfig.maxSharesPerMember}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-600 dark:text-slate-400">Total Shares Limit</dt>
                    <dd className="font-medium text-slate-900 dark:text-white">{circle.multiShareConfig.totalSharesLimit}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-600 dark:text-slate-400">Approval Mode</dt>
                    <dd className="font-medium text-slate-900 dark:text-white capitalize">
                      {circle.multiShareConfig.approvalMode.replace('_', ' ')}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-600 dark:text-slate-400">Payout Mode</dt>
                    <dd className="font-medium text-slate-900 dark:text-white capitalize">
                      {circle.multiShareConfig.payoutMode}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-600 dark:text-slate-400">Share Transfers</dt>
                    <dd className="font-medium text-slate-900 dark:text-white">
                      {circle.multiShareConfig.allowTransfers ? 'Allowed' : 'Not Allowed'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Member</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Shares</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Trust Score</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Payout</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Contribution</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {members.map((member) => (
                    <tr
                      key={member.id}
                      onClick={() => onViewMember?.(member.id)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-medium">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{member.name}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{member.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium">
                            {member.shares} shares
                          </span>
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            ({member.sharePercentage.toFixed(1)}%)
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                member.trustScore >= 800 ? 'bg-emerald-500' :
                                member.trustScore >= 600 ? 'bg-amber-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${member.trustScore / 10}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{member.trustScore}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">#{member.payoutPosition}</p>
                          <p className={`text-sm ${
                            member.payoutStatus === 'received'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}>
                            {member.payoutStatus === 'received' ? 'Received' : 'Pending'}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {circle.currency} {(member.shares * circle.baseContribution).toLocaleString()}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {member.contributionStats.onTime} on-time
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {member.pendingShareRequest ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                            Request Pending
                          </span>
                        ) : member.kycStatus === 'enhanced' ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400">
                            Basic
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-4">
            {pendingRequests.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-12 border border-slate-200 dark:border-slate-800 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-slate-600 dark:text-slate-400">No pending share requests</p>
              </div>
            ) : (
              pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-medium text-lg">
                        {request.memberName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">{request.memberName}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Requesting to {request.type === 'increase' ? 'increase' : 'reduce'} from {request.currentShares} to {request.newTotal} shares
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                          Trust Score: {request.memberTrustScore} · Requested {new Date(request.requestedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Contribution Impact</p>
                        <p className={`font-semibold ${
                          request.contributionImpact.difference > 0
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {request.contributionImpact.difference > 0 ? '+' : ''}{circle.currency} {request.contributionImpact.difference.toLocaleString()}/cycle
                        </p>
                      </div>

                      {isOrganizer && request.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onApproveRequest?.(request.id)}
                            className="inline-flex items-center px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => onRejectRequest?.(request.id)}
                            className="inline-flex items-center px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {request.notes && (
                    <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        <span className="font-medium">Note:</span> {request.notes}
                      </p>
                    </div>
                  )}

                  {request.isEmergency && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium text-red-800 dark:text-red-200">Emergency Request</span>
                        <span className="text-sm text-red-600 dark:text-red-400 capitalize">
                          - {request.emergencyReason?.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  )
}
