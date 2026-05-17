'use client'

import { useState } from 'react'
import type {
  Circle,
  Member,
  ShareRequest,
  ShareDistribution,
  Contribution,
  ShareHistoryEntry,
  PlatformMetrics,
  PlatformConfig,
  ComplianceAlert,
} from '@/../product/sections/multi-share/types'

import { CircleDashboard } from './CircleDashboard'
import { ShareRequestModal } from './ShareRequestModal'
import { ShareHistoryTimeline } from './ShareHistoryTimeline'
import { ContributionPayment } from './ContributionPayment'
import { PersonalShareSummary } from './PersonalShareSummary'
import { PlatformAdminDashboard } from './PlatformAdminDashboard'

// View types for the multi-share section
export type MultiShareView =
  | 'circle-dashboard'
  | 'personal-summary'
  | 'admin-dashboard'

export interface MultiShareProps {
  // View selection
  currentView: MultiShareView

  // Circle Dashboard Props
  circle?: Circle
  members?: Member[]
  currentMember?: Member
  shareDistribution?: ShareDistribution
  pendingRequests?: ShareRequest[]
  currentCycleContributions?: Contribution[]
  shareHistory?: ShareHistoryEntry[]

  // Personal Summary Props
  userCircles?: { circle: Circle; memberData: Member }[]
  userPendingRequests?: ShareRequest[]
  totalMonthlyCommitment?: number
  totalExpectedPayouts?: number

  // Admin Dashboard Props
  platformMetrics?: PlatformMetrics
  platformConfig?: PlatformConfig
  complianceAlerts?: ComplianceAlert[]

  // Callbacks - Circle Dashboard
  onRequestShares?: () => void
  onReduceShares?: () => void
  onViewMember?: (memberId: string) => void
  onApproveRequest?: (requestId: string) => void
  onRejectRequest?: (requestId: string) => void
  onMakePayment?: () => void

  // Callbacks - Share Request Modal
  onSubmitShareRequest?: (requestedShares: number, notes?: string) => void
  onCloseModal?: () => void

  // Callbacks - Payment
  onPay?: () => void
  onConfigureSplitPayment?: (schedule: { date: string; amount: number }[]) => void

  // Callbacks - Personal Summary
  onCircleClick?: (circleId: string) => void
  onExportAnnualSummary?: () => void

  // Callbacks - Admin Dashboard
  onPeriodChange?: (period: string) => void
  onExportReport?: (type: 'summary' | 'detailed' | 'compliance') => void
  onSelectAlert?: (alertId: string) => void
  onResolveAlert?: (alertId: string, resolution: string) => void
  onUpdateConfig?: (updates: Partial<PlatformConfig>) => void

  // Callbacks - History
  onExportHistory?: (format: 'csv' | 'pdf') => void
}

export function MultiShare({
  currentView,
  circle,
  members,
  currentMember,
  shareDistribution,
  pendingRequests,
  currentCycleContributions,
  shareHistory,
  userCircles,
  userPendingRequests,
  totalMonthlyCommitment,
  totalExpectedPayouts,
  platformMetrics,
  platformConfig,
  complianceAlerts,
  onRequestShares,
  onReduceShares,
  onViewMember,
  onApproveRequest,
  onRejectRequest,
  onMakePayment,
  onSubmitShareRequest,
  onCloseModal,
  onPay,
  onConfigureSplitPayment,
  onCircleClick,
  onExportAnnualSummary,
  onPeriodChange,
  onExportReport,
  onSelectAlert,
  onResolveAlert,
  onUpdateConfig,
  onExportHistory,
}: MultiShareProps) {
  const [showShareRequestModal, setShowShareRequestModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showHistoryPanel, setShowHistoryPanel] = useState(false)

  const handleRequestShares = () => {
    setShowShareRequestModal(true)
    onRequestShares?.()
  }

  const handleMakePayment = () => {
    setShowPaymentModal(true)
    onMakePayment?.()
  }

  const handleCloseShareModal = () => {
    setShowShareRequestModal(false)
    onCloseModal?.()
  }

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false)
    onCloseModal?.()
  }

  // Render based on current view
  if (currentView === 'admin-dashboard' && platformMetrics && platformConfig && complianceAlerts) {
    return (
      <PlatformAdminDashboard
        metrics={platformMetrics}
        config={platformConfig}
        alerts={complianceAlerts}
        onPeriodChange={onPeriodChange}
        onExportReport={onExportReport}
        onSelectAlert={onSelectAlert}
        onResolveAlert={onResolveAlert}
        onUpdateConfig={onUpdateConfig}
      />
    )
  }

  if (currentView === 'personal-summary' && userCircles) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
        <PersonalShareSummary
          circles={userCircles}
          pendingRequests={userPendingRequests || []}
          totalMonthlyCommitment={totalMonthlyCommitment || 0}
          totalExpectedPayouts={totalExpectedPayouts || 0}
          onCircleClick={onCircleClick}
          onExportAnnualSummary={onExportAnnualSummary}
        />
      </div>
    )
  }

  // Default: Circle Dashboard view
  if (circle && members && currentMember && shareDistribution && currentCycleContributions) {
    const currentContribution = currentCycleContributions.find(
      c => c.memberId === currentMember.id && c.status === 'pending'
    )

    return (
      <>
        <CircleDashboard
          circle={circle}
          members={members}
          currentMember={currentMember}
          shareDistribution={shareDistribution}
          pendingRequests={pendingRequests || []}
          currentCycleContributions={currentCycleContributions}
          onRequestShares={handleRequestShares}
          onReduceShares={onReduceShares}
          onViewMember={onViewMember}
          onApproveRequest={onApproveRequest}
          onRejectRequest={onRejectRequest}
          onMakePayment={handleMakePayment}
        />

        {/* Share History Panel */}
        {showHistoryPanel && shareHistory && (
          <div className="fixed inset-0 z-40 flex justify-end">
            <div
              className="absolute inset-0 bg-slate-900/50"
              onClick={() => setShowHistoryPanel(false)}
            />
            <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 shadow-xl overflow-y-auto">
              <div className="sticky top-0 bg-white dark:bg-slate-900 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Share History</h2>
                <button
                  onClick={() => setShowHistoryPanel(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <ShareHistoryTimeline
                  history={shareHistory}
                  onExport={onExportHistory}
                />
              </div>
            </div>
          </div>
        )}

        {/* Share Request Modal */}
        {showShareRequestModal && (
          <ShareRequestModal
            member={currentMember}
            circle={circle}
            onSubmit={onSubmitShareRequest}
            onClose={handleCloseShareModal}
          />
        )}

        {/* Payment Modal */}
        {showPaymentModal && currentContribution && (
          <ContributionPayment
            contribution={currentContribution}
            circle={circle}
            onPay={onPay}
            onConfigureSplitPayment={onConfigureSplitPayment}
            onClose={handleClosePaymentModal}
          />
        )}
      </>
    )
  }

  // Fallback empty state
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <p className="text-slate-600 dark:text-slate-400">No data available for this view</p>
      </div>
    </div>
  )
}
