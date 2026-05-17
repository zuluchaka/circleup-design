import { useState } from 'react'
import type { MigrationDashboardProps } from '@/../product/sections/associations/types'
import { PhaseTimeline, StatCard, InvitationFunnelChart } from './migration/DashboardHelpers'
import { MemberTable } from './migration/MemberTable'
import { CircleCard } from './migration/CircleCard'
import { ValidationReportPanel, VerificationPanel } from './migration/ValidationPanel'
import { GoLivePanel } from './migration/GoLivePanel'
import { AuditTrailPanel } from './migration/AuditTrailPanel'
import { CircleImportWizard } from './migration/CircleImportWizard'

// ---------------------------------------------------------------------------
// Main Dashboard
// ---------------------------------------------------------------------------

type TabId = 'overview' | 'members' | 'circles' | 'validation' | 'golive' | 'audit'

export function MigrationDashboard({
  session,
  association,
  members,
  circles,
  invitationFunnel,
  validationReport,
  verifications,
  goLiveConfig,
  auditTrail,
  onNavigatePhase,
  onResendInvitation,
  onEditMember,
  onGenerateCode,
  onConfirmCircleState,
  onImportAnotherCircle,
  onFinalizeAllCircles,
  onRunValidation,
  onAcknowledgeWarning,
  onResolveDispute,
  onGoLive,
  onScheduleGoLive,
  onEmergencyPause,
  onExportReport,
}: MigrationDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [showCircleWizard, setShowCircleWizard] = useState(false)

  const tabs: { id: TabId; label: string; count?: number }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'members', label: 'Members', count: members.length },
    { id: 'circles', label: 'Circles', count: circles.length },
    { id: 'validation', label: 'Validation', count: validationReport?.blockingErrors },
    { id: 'golive', label: 'Go Live' },
    { id: 'audit', label: 'Activity' },
  ]

  const registeredCount = members.filter((m) => m.invitationStatus === 'registered').length
  const issueCount = members.filter((m) => m.validationStatus === 'error').length

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-b from-indigo-600 to-indigo-700 dark:from-indigo-900 dark:to-indigo-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-16">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {association.logo ? (
                <div className="w-10 h-10 rounded-xl bg-white/20 overflow-hidden backdrop-blur-sm">
                  <div className="w-full h-full bg-white/10 flex items-center justify-center text-white/60 text-xs font-bold">
                    {association.name.split(' ').slice(0, 2).map((w) => w[0]).join('')}
                  </div>
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white text-xs font-bold backdrop-blur-sm">
                  {association.name.split(' ').slice(0, 2).map((w) => w[0]).join('')}
                </div>
              )}
              <div>
                <h1 className="text-lg font-bold text-white">{association.name}</h1>
                <p className="text-xs text-indigo-200">Migration in progress</p>
              </div>
            </div>
            <button
              onClick={() => onExportReport?.('pdf')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-200 hover:text-white border border-indigo-400/30 hover:border-indigo-300/50 rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export
            </button>
          </div>

          {/* Phase timeline */}
          <PhaseTimeline
            phases={session.phases}
            currentPhase={session.currentPhase}
            onNavigatePhase={onNavigatePhase}
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-10">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard
            label="Members"
            value={`${registeredCount}/${members.length}`}
            sublabel={`${Math.round((registeredCount / members.length) * 100)}% registered`}
            color="indigo"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>}
          />
          <StatCard
            label="Circles"
            value={circles.length}
            sublabel={`${circles.filter((c) => c.importStatus === 'validated').length} validated`}
            color="emerald"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 019 14.437V9.564z" /></svg>}
          />
          <StatCard
            label="Issues"
            value={issueCount + (validationReport?.blockingErrors ?? 0)}
            sublabel={issueCount > 0 ? `${issueCount} member errors` : 'No issues'}
            color={issueCount > 0 ? 'rose' : 'slate'}
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>}
          />
          <StatCard
            label="Disputes"
            value={verifications.filter((v) => v.status === 'disputed').length}
            sublabel={verifications.filter((v) => v.disputes.some((d) => d.status === 'pending_review')).length > 0 ? 'Pending review' : 'None pending'}
            color="amber"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>}
          />
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="border-b border-slate-200 dark:border-slate-800">
            <div className="flex overflow-x-auto px-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      tab.id === 'validation' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400' :
                      'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Association summary */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wider">Association</h3>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-lg font-bold text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                        {association.name.split(' ').slice(0, 2).map((w) => w[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900 dark:text-white">{association.name}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{association.description}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 text-[11px] font-semibold capitalize">{association.type}</span>
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-semibold">{association.city}, {association.country}</span>
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-semibold capitalize">{association.visibility.replace('_', '-')}</span>
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-semibold">{association.governance.roles.length} roles</span>
                        </div>
                        {/* Profile completeness */}
                        <div className="mt-3 flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${association.profileCompleteness}%` }} />
                          </div>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{association.profileCompleteness}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Invitation funnel */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wider">Invitation Funnel</h3>
                  <InvitationFunnelChart funnel={invitationFunnel} />
                </div>

                {/* Circles overview */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Circles</h3>
                    <button
                      onClick={() => setShowCircleWizard(true)}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      + Import Another
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {circles.map((c) => (
                      <CircleCard key={c.id} circle={c} onConfirmCircleState={onConfirmCircleState} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Members */}
            {activeTab === 'members' && (
              <MemberTable
                members={members}
                onResendInvitation={onResendInvitation}
                onEditMember={onEditMember}
                onGenerateCode={onGenerateCode}
              />
            )}

            {/* Circles detail */}
            {activeTab === 'circles' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400">{circles.length} circle{circles.length !== 1 ? 's' : ''} imported</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowCircleWizard(true)}
                      className="px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
                    >
                      + Import Another
                    </button>
                    {circles.every((c) => c.importStatus !== 'draft') && (
                      <button
                        onClick={onFinalizeAllCircles}
                        className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Finalize All
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {circles.map((c) => (
                    <CircleCard key={c.id} circle={c} onConfirmCircleState={onConfirmCircleState} />
                  ))}
                </div>
              </div>
            )}

            {/* Validation */}
            {activeTab === 'validation' && (
              <div className="space-y-8">
                <ValidationReportPanel
                  report={validationReport}
                  onAcknowledgeWarning={onAcknowledgeWarning}
                  onRunValidation={onRunValidation}
                />
                {verifications.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wider">Member Verifications</h3>
                    <VerificationPanel verifications={verifications} onResolveDispute={onResolveDispute} />
                  </div>
                )}
              </div>
            )}

            {/* Go Live */}
            {activeTab === 'golive' && (
              <GoLivePanel
                config={goLiveConfig}
                readinessSummary={validationReport?.readinessSummary}
                onGoLive={onGoLive}
                onScheduleGoLive={onScheduleGoLive}
                onEmergencyPause={onEmergencyPause}
              />
            )}

            {/* Audit trail */}
            {activeTab === 'audit' && (
              <AuditTrailPanel entries={auditTrail} />
            )}
          </div>
        </div>
      </div>

      {/* Bottom spacer */}
      <div className="h-16" />

      {/* Circle Import Wizard Modal */}
      {showCircleWizard && (
        <CircleImportWizard
          availableMembers={members}
          onClose={() => setShowCircleWizard(false)}
          onSaveCircle={(circle) => {
            onImportAnotherCircle?.()
            console.log('New circle data:', circle)
          }}
        />
      )}
    </div>
  )
}
