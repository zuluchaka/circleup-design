'use client'

import { useState } from 'react'
import data from '@/../product/sections/multi-share/data.json'
import { MultiShare } from './components/MultiShare'
import type { MultiShareView } from './components/MultiShare'
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
  CalculatorScenario,
} from '@/../product/sections/multi-share/types'

// Type assertions for imported data
const circles = data.circles as Circle[]
const members = data.members as Member[]
const shareRequests = data.shareRequests as ShareRequest[]
const shareHistory = data.shareHistory as ShareHistoryEntry[]
const contributions = data.contributions as Contribution[]
const platformConfig = data.platformConfig as PlatformConfig
const platformMetrics = data.platformMetrics as PlatformMetrics
const complianceAlerts = data.complianceAlerts as ComplianceAlert[]
const shareDistributionExample = data.shareDistributionExample as ShareDistribution

export default function MultiSharePreview() {
  const [currentView, setCurrentView] = useState<MultiShareView>('circle-dashboard')

  // Get the active circle and current member for demo
  const activeCircle = circles[0] // Zurich Professionals Circle
  const currentMember = members[0] // Marco Bernasconi (organizer)
  const circleMembers = members.filter(m => m.circleId === activeCircle.id)
  const circlePendingRequests = shareRequests.filter(
    r => r.circleId === activeCircle.id && r.status === 'pending'
  )
  const currentCycleContributions = contributions.filter(
    c => c.circleId === activeCircle.id && c.cycle === activeCircle.currentCycle
  )
  const memberShareHistory = shareHistory.filter(h => h.circleId === activeCircle.id)

  // Personal summary data (user's circles)
  const userCircles = [
    { circle: circles[0], memberData: members[0] },
    { circle: circles[2], memberData: { ...members[0], id: 'member-020', circleId: 'circle-003', shares: 2 } as Member },
  ]
  const userPendingRequests = shareRequests.filter(r => r.status === 'pending')
  const totalMonthlyCommitment = userCircles.reduce(
    (sum, { circle, memberData }) => sum + circle.baseContribution * memberData.shares,
    0
  )
  const totalExpectedPayouts = userCircles.reduce(
    (sum, { circle, memberData }) => {
      const totalShares = circle.multiShareConfig.currentTotalShares
      const memberPortion = memberData.shares / totalShares
      const poolSize = totalShares * circle.baseContribution
      return sum + poolSize * memberPortion
    },
    0
  )

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      {/* View Selector */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
              Multi-Share Preview
            </h1>
            <div className="flex items-center gap-2">
              {([
                { id: 'circle-dashboard', label: 'Circle Dashboard' },
                { id: 'personal-summary', label: 'Personal Summary' },
                { id: 'admin-dashboard', label: 'Admin Dashboard' },
              ] as const).map((view) => (
                <button
                  key={view.id}
                  onClick={() => setCurrentView(view.id)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${currentView === view.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }
                  `}
                >
                  {view.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <MultiShare
        currentView={currentView}
        // Circle Dashboard Props
        circle={activeCircle}
        members={circleMembers}
        currentMember={currentMember}
        shareDistribution={shareDistributionExample}
        pendingRequests={circlePendingRequests}
        currentCycleContributions={currentCycleContributions}
        shareHistory={memberShareHistory}
        // Personal Summary Props
        userCircles={userCircles}
        userPendingRequests={userPendingRequests}
        totalMonthlyCommitment={totalMonthlyCommitment}
        totalExpectedPayouts={totalExpectedPayouts}
        // Admin Dashboard Props
        platformMetrics={platformMetrics}
        platformConfig={platformConfig}
        complianceAlerts={complianceAlerts}
        // Callbacks - Circle Dashboard
        onRequestShares={() => console.log('Request shares clicked')}
        onReduceShares={() => console.log('Reduce shares clicked')}
        onViewMember={(memberId) => console.log('View member:', memberId)}
        onApproveRequest={(requestId) => console.log('Approve request:', requestId)}
        onRejectRequest={(requestId) => console.log('Reject request:', requestId)}
        onMakePayment={() => console.log('Make payment clicked')}
        // Callbacks - Share Request Modal
        onSubmitShareRequest={(requestedShares, notes) =>
          console.log('Submit share request:', requestedShares, notes)
        }
        onCloseModal={() => console.log('Modal closed')}
        // Callbacks - Payment
        onPay={() => console.log('Payment submitted')}
        onConfigureSplitPayment={(schedule) => console.log('Split payment configured:', schedule)}
        // Callbacks - Personal Summary
        onCircleClick={(circleId) => console.log('Circle clicked:', circleId)}
        onExportAnnualSummary={() => console.log('Export annual summary')}
        // Callbacks - Admin Dashboard
        onPeriodChange={(period) => console.log('Period changed:', period)}
        onExportReport={(type) => console.log('Export report:', type)}
        onSelectAlert={(alertId) => console.log('Select alert:', alertId)}
        onResolveAlert={(alertId, resolution) =>
          console.log('Resolve alert:', alertId, resolution)
        }
        onUpdateConfig={(updates) => console.log('Update config:', updates)}
        // Callbacks - History
        onExportHistory={(format) => console.log('Export history:', format)}
      />
    </div>
  )
}
