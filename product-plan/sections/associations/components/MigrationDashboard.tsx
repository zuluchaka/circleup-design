import { useState } from 'react'
import type {
  MigrationDashboardProps,
  MigrationPhase,
  PhaseStatus,
  ImportedMember,
  ImportedCircle,
  ValidationCheck,
  CheckStatus,
  InvitationFunnel,
  AuditEntry,
  MemberVerification,
  GoLiveConfig,
  ValidationReport,
} from '../types'

// ---------------------------------------------------------------------------
// Phase Indicator
// ---------------------------------------------------------------------------

function PhaseIcon({ phase, status }: { phase: number; status: PhaseStatus }) {
  const base = 'w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300'
  if (status === 'completed')
    return (
      <span className={`${base} bg-emerald-500 text-white shadow-md shadow-emerald-500/25`}>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
      </span>
    )
  if (status === 'in_progress')
    return <span className={`${base} bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 ring-4 ring-indigo-500/20`}>{phase}</span>
  return <span className={`${base} bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500`}>{phase}</span>
}

function PhaseConnector({ status }: { status: PhaseStatus }) {
  return (
    <div className="flex-1 h-0.5 mx-1">
      <div className={`h-full rounded-full transition-all duration-500 ${
        status === 'completed' ? 'bg-emerald-400' : 'bg-slate-200 dark:bg-slate-700'
      }`} />
    </div>
  )
}

function PhaseTimeline({
  phases,
  currentPhase,
  onNavigatePhase,
}: {
  phases: MigrationPhase[]
  currentPhase: number
  onNavigatePhase?: (phase: number) => void
}) {
  return (
    <div className="flex items-center w-full max-w-2xl mx-auto">
      {phases.map((p, i) => (
        <div key={p.phase} className="contents">
          <button
            onClick={() => p.status !== 'locked' && onNavigatePhase?.(p.phase)}
            disabled={p.status === 'locked'}
            className="flex flex-col items-center gap-1.5 group relative"
          >
            <PhaseIcon phase={p.phase} status={p.status} />
            <span className={`text-[11px] font-medium whitespace-nowrap transition-colors ${
              p.status === 'in_progress' ? 'text-indigo-600 dark:text-indigo-400' :
              p.status === 'completed' ? 'text-slate-700 dark:text-slate-300' :
              'text-slate-400 dark:text-slate-500'
            }`}>
              {p.name}
            </span>
            {p.status === 'completed' && p.completedAt && (
              <span className="text-[10px] text-slate-400 dark:text-slate-500 hidden sm:block">
                {new Date(p.completedAt).toLocaleDateString('en-CH', { month: 'short', day: 'numeric' })}
              </span>
            )}
          </button>
          {i < phases.length - 1 && <PhaseConnector status={phases[i].status} />}
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Stat Card
// ---------------------------------------------------------------------------

function StatCard({
  label,
  value,
  sublabel,
  color = 'slate',
  icon,
}: {
  label: string
  value: string | number
  sublabel?: string
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate'
  icon: React.ReactNode
}) {
  const colorMap = {
    indigo: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50',
    amber: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/50',
    rose: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/50',
    slate: 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-800',
  }
  return (
    <div className={`rounded-xl border p-4 ${colorMap[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider opacity-70">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {sublabel && <p className="text-xs opacity-60 mt-0.5">{sublabel}</p>}
        </div>
        <div className="opacity-40">{icon}</div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Invitation Funnel
// ---------------------------------------------------------------------------

function InvitationFunnelChart({ funnel }: { funnel: InvitationFunnel }) {
  const stages = [
    { label: 'Imported', value: funnel.total, color: 'bg-slate-400' },
    { label: 'Invited', value: funnel.invited, color: 'bg-indigo-400' },
    { label: 'Delivered', value: funnel.delivered, color: 'bg-indigo-500' },
    { label: 'Opened', value: funnel.opened, color: 'bg-amber-400' },
    { label: 'Registered', value: funnel.registered, color: 'bg-emerald-400' },
    { label: 'Active', value: funnel.active, color: 'bg-emerald-600' },
  ]
  const max = stages[0].value
  return (
    <div className="space-y-2">
      {stages.map((s) => (
        <div key={s.label} className="flex items-center gap-3">
          <span className="text-xs text-slate-500 dark:text-slate-400 w-20 text-right font-medium">{s.label}</span>
          <div className="flex-1 h-6 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${s.color} rounded-full transition-all duration-700 flex items-center justify-end pr-2`}
              style={{ width: `${Math.max((s.value / max) * 100, 8)}%` }}
            >
              <span className="text-[11px] font-bold text-white">{s.value}</span>
            </div>
          </div>
          <span className="text-xs text-slate-400 w-10 text-right">{max > 0 ? Math.round((s.value / max) * 100) : 0}%</span>
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Member Table
// ---------------------------------------------------------------------------

function statusBadge(status: string) {
  const map: Record<string, string> = {
    registered: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    delivered: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400',
    opened: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
    clicked: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
    bounced: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400',
    not_sent: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    code_generated: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400',
    sent: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400',
  }
  const labels: Record<string, string> = {
    registered: 'Registered',
    delivered: 'Delivered',
    opened: 'Opened',
    clicked: 'Clicked',
    bounced: 'Bounced',
    not_sent: 'Not Sent',
    code_generated: 'Code',
    sent: 'Sent',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${map[status] || map.not_sent}`}>
      {labels[status] || status}
    </span>
  )
}

function validationDot(status: string) {
  if (status === 'valid') return <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
  if (status === 'warning') return <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
  return <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
}

function MemberTable({
  members,
  onResendInvitation,
  onEditMember,
  onGenerateCode,
}: {
  members: ImportedMember[]
  onResendInvitation?: (id: string, channel: 'email' | 'email_sms' | 'invitation_code' | null) => void
  onEditMember?: (id: string, field: string, value: string) => void
  onGenerateCode?: (id: string) => void
}) {
  const [filter, setFilter] = useState<'all' | 'registered' | 'pending' | 'issues'>('all')
  const filtered = members.filter((m) => {
    if (filter === 'registered') return m.invitationStatus === 'registered'
    if (filter === 'pending') return m.invitationStatus !== 'registered' && m.validationStatus !== 'error'
    if (filter === 'issues') return m.validationStatus === 'error' || m.invitationStatus === 'bounced'
    return true
  })
  const counts = {
    all: members.length,
    registered: members.filter((m) => m.invitationStatus === 'registered').length,
    pending: members.filter((m) => m.invitationStatus !== 'registered' && m.validationStatus !== 'error').length,
    issues: members.filter((m) => m.validationStatus === 'error' || m.invitationStatus === 'bounced').length,
  }

  return (
    <div>
      <div className="flex items-center gap-1 mb-4 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit">
        {(['all', 'registered', 'pending', 'issues'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              filter === f
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {f === 'all' ? 'All' : f === 'registered' ? 'Registered' : f === 'pending' ? 'Pending' : 'Issues'}
            <span className="ml-1 opacity-60">{counts[f]}</span>
          </button>
        ))}
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
              <th className="text-left px-4 py-2.5 font-semibold text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider">Member</th>
              <th className="text-left px-4 py-2.5 font-semibold text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider hidden md:table-cell">Role</th>
              <th className="text-left px-4 py-2.5 font-semibold text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider hidden lg:table-cell">Contact</th>
              <th className="text-center px-4 py-2.5 font-semibold text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider">Data</th>
              <th className="text-center px-4 py-2.5 font-semibold text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider">Invitation</th>
              <th className="text-right px-4 py-2.5 font-semibold text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {m.firstName[0]}{m.lastName[0]}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white text-sm">{m.firstName} {m.lastName}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {m.importSource === 'manual' ? 'Manual' : 'File'} &middot; {m.joinDate ? new Date(m.joinDate).getFullYear() : ''}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{m.mappedRole}</span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <div className="text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
                    <p>{m.email || <span className="italic text-slate-400">No email</span>}</p>
                    <p className="text-slate-400">{m.phone}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">{validationDot(m.validationStatus)}</td>
                <td className="px-4 py-3 text-center">{statusBadge(m.invitationStatus)}</td>
                <td className="px-4 py-3 text-right">
                  {m.invitationStatus === 'bounced' && (
                    <button
                      onClick={() => onResendInvitation?.(m.id, 'email')}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                    >
                      Resend
                    </button>
                  )}
                  {!m.email && m.invitationStatus !== 'registered' && (
                    <button
                      onClick={() => onGenerateCode?.(m.id)}
                      className="text-xs text-violet-600 dark:text-violet-400 hover:underline font-medium"
                    >
                      Gen Code
                    </button>
                  )}
                  {m.validationStatus === 'error' && (
                    <button
                      onClick={() => onEditMember?.(m.id, 'email', '')}
                      className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-medium"
                    >
                      Fix
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Circle Cards
// ---------------------------------------------------------------------------

function CircleCard({
  circle,
  onConfirmCircleState,
}: {
  circle: ImportedCircle
  onConfirmCircleState?: (id: string) => void
}) {
  const completedPositions = circle.positions.filter((p) => p.status === 'paid_out').length
  const progress = (completedPositions / circle.totalPositions) * 100

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">{circle.name}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {circle.currency} {circle.contributionAmount.toLocaleString()} &middot; {circle.frequency === 'weekly' ? 'Weekly' : circle.frequency === 'bi_weekly' ? 'Bi-weekly' : 'Monthly'}
            </p>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
            circle.importStatus === 'validated'
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
              : circle.importStatus === 'active'
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
          }`}>
            {circle.importStatus === 'validated' ? 'Validated' : circle.importStatus === 'active' ? 'Active' : 'Draft'}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
            <span>Cycle {circle.currentCycle} of {circle.totalPositions}</span>
            <span>{completedPositions} paid out</span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Position grid */}
        <div className="flex flex-wrap gap-1 mb-4">
          {circle.positions.map((pos) => (
            <div
              key={pos.position}
              title={`${pos.memberName} — Position ${pos.position}`}
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all ${
                pos.status === 'paid_out'
                  ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
                  : pos.position === circle.currentCycle
                  ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
              }`}
            >
              {pos.position}
            </div>
          ))}
        </div>

        {/* Financial summary */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold">Collected</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{circle.currency} {circle.financialSummary.totalCollected.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold">Paid Out</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{circle.currency} {circle.financialSummary.totalPaidOut.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold">Emergency</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{circle.currency} {circle.financialSummary.emergencyFundBalance}</p>
          </div>
        </div>

        {/* Outstanding obligations */}
        {circle.financialSummary.outstandingObligations.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[10px] uppercase tracking-wider text-rose-500 font-semibold mb-1.5">Outstanding</p>
            {circle.financialSummary.outstandingObligations.map((o) => (
              <div key={`${o.memberId}-${o.cycle}`} className="flex items-center justify-between text-xs py-1">
                <span className="text-slate-600 dark:text-slate-400">{o.memberName} (Cycle {o.cycle})</span>
                <span className="font-semibold text-rose-600 dark:text-rose-400">{circle.currency} {o.amount}</span>
              </div>
            ))}
          </div>
        )}

        {/* Warnings */}
        {circle.validationWarnings.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            {circle.validationWarnings.map((w) => (
              <div key={w.code} className="flex items-start gap-2 text-xs">
                {w.acknowledged ? (
                  <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                ) : (
                  <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01" /></svg>
                )}
                <div>
                  <p className="text-slate-600 dark:text-slate-400">{w.message}</p>
                  {w.acknowledged && (
                    <p className="text-slate-400 dark:text-slate-500 mt-0.5 italic">Acknowledged: {w.acknowledgedReason}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {circle.importStatus === 'draft' && (
        <button
          onClick={() => onConfirmCircleState?.(circle.id)}
          className="w-full py-2.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-950/50 transition-colors border-t border-slate-200 dark:border-slate-700"
        >
          Validate &amp; Confirm
        </button>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Validation Section
// ---------------------------------------------------------------------------

function ValidationReportPanel({
  report,
  onAcknowledgeWarning,
  onRunValidation,
}: {
  report: ValidationReport | null
  onAcknowledgeWarning?: (id: string, reason: string) => void
  onRunValidation?: () => void
}) {
  if (!report) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <p className="text-slate-500 dark:text-slate-400 mb-4">Validation hasn't been run yet</p>
        <button
          onClick={onRunValidation}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-500/20"
        >
          Run Final Validation
        </button>
      </div>
    )
  }

  const checkIcon = (status: CheckStatus) => {
    if (status === 'passed') return <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
    if (status === 'warning') return <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
    return <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
  }

  return (
    <div>
      {/* Progress header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            report.overallStatus === 'all_passed' ? 'bg-emerald-100 dark:bg-emerald-900/40' :
            report.overallStatus === 'warnings_present' ? 'bg-amber-100 dark:bg-amber-900/40' :
            'bg-rose-100 dark:bg-rose-900/40'
          }`}>
            {report.overallStatus === 'all_passed' ? checkIcon('passed') : report.overallStatus === 'warnings_present' ? checkIcon('warning') : checkIcon('error')}
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">
              {report.passed} of {report.totalChecks} checks passed
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {report.blockingErrors > 0 && <span className="text-rose-500">{report.blockingErrors} blocking</span>}
              {report.blockingErrors > 0 && report.warnings > 0 && ' · '}
              {report.warnings > 0 && <span className="text-amber-500">{report.warnings} warnings</span>}
              {report.blockingErrors === 0 && report.warnings === 0 && <span className="text-emerald-500">All clear</span>}
            </p>
          </div>
        </div>
        <button
          onClick={onRunValidation}
          className="px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg transition-colors"
        >
          Re-run
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            report.overallStatus === 'all_passed' ? 'bg-emerald-500' :
            report.overallStatus === 'warnings_present' ? 'bg-amber-500' : 'bg-rose-500'
          }`}
          style={{ width: `${(report.passed / report.totalChecks) * 100}%` }}
        />
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {report.sections.map((section) => (
          <div key={section.name} className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/50">
              <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{section.name}</h4>
              <span className={`text-[11px] font-semibold ${
                section.status === 'passed' ? 'text-emerald-500' :
                section.status === 'has_warnings' ? 'text-amber-500' : 'text-rose-500'
              }`}>
                {section.checks.filter((c) => c.status === 'passed').length}/{section.checks.length} passed
              </span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {section.checks.map((check) => (
                <div key={check.id} className="flex items-start gap-3 px-4 py-2.5">
                  <div className="mt-0.5">{checkIcon(check.status)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 dark:text-slate-300">{check.description}</p>
                    {check.details && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{check.details}</p>
                    )}
                    {check.acknowledged && (
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 italic">
                        Acknowledged by {check.acknowledgedBy}: {check.acknowledgedReason}
                      </p>
                    )}
                  </div>
                  {check.status === 'warning' && !check.acknowledged && (
                    <button
                      onClick={() => onAcknowledgeWarning?.(check.id, '')}
                      className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline whitespace-nowrap"
                    >
                      Acknowledge
                    </button>
                  )}
                  {check.status === 'error' && check.fixLink && (
                    <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 whitespace-nowrap">Fix required</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Verification & Disputes
// ---------------------------------------------------------------------------

function VerificationPanel({
  verifications,
  onResolveDispute,
}: {
  verifications: MemberVerification[]
  onResolveDispute?: (disputeId: string, accepted: boolean, resolution: string) => void
}) {
  const verified = verifications.filter((v) => v.status === 'verified').length
  const disputed = verifications.filter((v) => v.status === 'disputed').length
  const pending = verifications.filter((v) => v.status === 'pending').length

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-xs text-slate-600 dark:text-slate-400">{verified} verified</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-xs text-slate-600 dark:text-slate-400">{pending} pending</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span className="text-xs text-slate-600 dark:text-slate-400">{disputed} disputed</span>
        </div>
      </div>
      <div className="space-y-3">
        {verifications.map((v) => (
          <div key={v.id} className={`rounded-xl border p-4 ${
            v.status === 'disputed'
              ? 'border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20'
              : v.status === 'verified'
              ? 'border-slate-200 dark:border-slate-700'
              : 'border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                  {v.memberName.split(' ').map((n) => n[0]).join('')}
                </div>
                <span className="font-medium text-sm text-slate-900 dark:text-white">{v.memberName}</span>
              </div>
              <span className={`text-[11px] font-semibold ${
                v.status === 'verified' ? 'text-emerald-500' :
                v.status === 'disputed' ? 'text-rose-500' : 'text-amber-500'
              }`}>
                {v.status === 'verified' ? 'Verified' : v.status === 'disputed' ? 'Disputed' : 'Pending'}
              </span>
            </div>
            {v.disputes.length > 0 && v.disputes.map((d) => (
              <div key={d.id} className="mt-3 pt-3 border-t border-rose-200 dark:border-rose-800/50">
                <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1">{d.field}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Current: {d.currentValue}</p>
                <p className="text-xs text-slate-700 dark:text-slate-300 italic mb-2">"{d.memberClaim}"</p>
                {d.status === 'pending_review' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => onResolveDispute?.(d.id, true, '')}
                      className="px-3 py-1 text-[11px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 rounded-md hover:bg-emerald-200 dark:hover:bg-emerald-900/60 transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => onResolveDispute?.(d.id, false, '')}
                      className="px-3 py-1 text-[11px] font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Go-Live Panel
// ---------------------------------------------------------------------------

function GoLivePanel({
  config,
  readinessSummary,
  onGoLive,
  onScheduleGoLive,
  onEmergencyPause,
}: {
  config: GoLiveConfig
  readinessSummary?: {
    associationName: string
    totalMembers: number
    registeredMembers: number
    activeCircles: number
    totalMonthlyContributions: number
    estimatedFirstPaymentDate: string
  }
  onGoLive?: () => void
  onScheduleGoLive?: (date: string) => void
  onEmergencyPause?: () => void
}) {
  return (
    <div>
      {/* Readiness summary */}
      {readinessSummary && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 mb-6">
          <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Readiness Summary</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{readinessSummary.registeredMembers}/{readinessSummary.totalMembers}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">Members</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{readinessSummary.activeCircles}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">Circles</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">CHF {readinessSummary.totalMonthlyContributions.toLocaleString()}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">Monthly</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{new Date(readinessSummary.estimatedFirstPaymentDate).toLocaleDateString('en-CH', { month: 'short', day: 'numeric' })}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">First Payment</p>
            </div>
          </div>
        </div>
      )}

      {/* Checklist */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 mb-6">
        <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Post-Migration Checklist</h4>
        <div className="space-y-2.5">
          {config.postMigrationChecklist.map((item) => (
            <div key={item.item} className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                item.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-900/40' :
                item.status === 'in_progress' ? 'bg-indigo-100 dark:bg-indigo-900/40' :
                'bg-slate-100 dark:bg-slate-800'
              }`}>
                {item.status === 'completed' ? (
                  <svg className="w-3 h-3 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                ) : item.status === 'in_progress' ? (
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.item}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onGoLive}
          disabled={!config.readyToGoLive}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
            config.readyToGoLive
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/25'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
          }`}
        >
          {config.readyToGoLive ? 'Go Live Now' : `Go Live (${config.blockingIssues} issues remaining)`}
        </button>
        <button
          onClick={() => onScheduleGoLive?.('')}
          disabled={!config.readyToGoLive}
          className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all ${
            config.readyToGoLive
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30'
              : 'border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
          }`}
        >
          Schedule Go-Live
        </button>
      </div>
      {config.emergencyPauseAvailable && (
        <button
          onClick={onEmergencyPause}
          className="w-full mt-3 py-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors border border-rose-200 dark:border-rose-900/50"
        >
          Emergency: Pause Migration
        </button>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Audit Trail
// ---------------------------------------------------------------------------

function AuditTrailPanel({ entries }: { entries: AuditEntry[] }) {
  const actionIcons: Record<string, string> = {
    migration_started: '🚀',
    association_created: '🏛️',
    document_uploaded: '📄',
    file_uploaded: '📁',
    mapping_confirmed: '🔗',
    validation_run: '✅',
    roles_assigned: '👥',
    invitations_sent: '✉️',
    circle_created: '⭕',
    warning_acknowledged: '⚠️',
    dispute_received: '❗',
  }

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-700" />
      <div className="space-y-0">
        {entries.map((entry) => (
          <div key={entry.id} className="relative flex items-start gap-4 pl-9 py-3">
            <div className="absolute left-2.5 top-4 w-3 h-3 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-600" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  <span className="mr-1.5">{actionIcons[entry.action] || '•'}</span>
                  {entry.description}
                </p>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 whitespace-nowrap">
                  {new Date(entry.timestamp).toLocaleDateString('en-CH', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{entry.actor}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Dashboard
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Circle Import Wizard
// ---------------------------------------------------------------------------

type WizardStep = 'config' | 'members' | 'midcycle' | 'review'

function CircleImportWizard({
  availableMembers,
  onClose,
  onSaveCircle,
}: {
  availableMembers: ImportedMember[]
  onClose: () => void
  onSaveCircle?: (circle: Partial<ImportedCircle>) => void
}) {
  const [step, setStep] = useState<WizardStep>('config')
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('CHF')
  const [frequency, setFrequency] = useState<'weekly' | 'bi_weekly' | 'monthly'>('monthly')
  const [positions, setPositions] = useState('')
  const [payoutMethod, setPayoutMethod] = useState<'fixed' | 'random' | 'bidding' | 'trust_score'>('fixed')
  const [isMidCycle, setIsMidCycle] = useState(false)
  const [currentCycle, setCurrentCycle] = useState('1')
  const [nextPaymentDate, setNextPaymentDate] = useState('')
  const [gracePeriod, setGracePeriod] = useState('3')
  const [lateFeeType, setLateFeeType] = useState<'none' | 'fixed' | 'percentage'>('none')
  const [lateFeeAmount, setLateFeeAmount] = useState('')
  const [emergencyFundRate, setEmergencyFundRate] = useState('5')
  const [customRules, setCustomRules] = useState<string[]>([])
  const [newRule, setNewRule] = useState('')
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [positionOrder, setPositionOrder] = useState<string[]>([])

  const posCount = parseInt(positions) || 0
  const contribAmount = parseFloat(amount) || 0
  const totalValue = contribAmount * posCount
  const payoutPerCycle = contribAmount * posCount
  const efPerMember = contribAmount * (parseFloat(emergencyFundRate) / 100)

  const steps: { id: WizardStep; label: string; number: number }[] = [
    { id: 'config', label: 'Configuration', number: 1 },
    { id: 'members', label: 'Members & Positions', number: 2 },
    { id: 'midcycle', label: 'Mid-Cycle State', number: 3 },
    { id: 'review', label: 'Review', number: 4 },
  ]

  const canProceedConfig = name.trim() && contribAmount > 0 && posCount >= 3 && posCount <= 50
  const canProceedMembers = selectedMembers.length === posCount

  const toggleMember = (id: string) => {
    setSelectedMembers((prev) => {
      if (prev.includes(id)) {
        setPositionOrder((po) => po.filter((p) => p !== id))
        return prev.filter((m) => m !== id)
      }
      if (prev.length >= posCount) return prev
      setPositionOrder((po) => [...po, id])
      return [...prev, id]
    })
  }

  const movePosition = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...positionOrder]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= newOrder.length) return
    ;[newOrder[index], newOrder[swapIndex]] = [newOrder[swapIndex], newOrder[index]]
    setPositionOrder(newOrder)
  }

  const addRule = () => {
    if (newRule.trim() && customRules.length < 5) {
      setCustomRules([...customRules, newRule.trim()])
      setNewRule('')
    }
  }

  const handleSave = () => {
    onSaveCircle?.({
      name,
      contributionAmount: contribAmount,
      currency,
      frequency,
      totalPositions: posCount,
      payoutMethod,
      isMidCycle,
      currentCycle: parseInt(currentCycle) || 1,
      nextPaymentDueDate: nextPaymentDate,
      gracePeriod: parseInt(gracePeriod) || 3,
      lateFeeType,
      lateFeeAmount: parseFloat(lateFeeAmount) || 0,
      emergencyFundRate: parseFloat(emergencyFundRate) || 5,
      customRules,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-16 px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Import New Circle</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Step {steps.find((s) => s.id === step)?.number} of 4 — {steps.find((s) => s.id === step)?.label}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-1 px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
          {steps.map((s, i) => (
            <div key={s.id} className="contents">
              <button
                onClick={() => {
                  if (s.id === 'config') setStep('config')
                  if (s.id === 'members' && canProceedConfig) setStep('members')
                  if (s.id === 'midcycle' && canProceedMembers) setStep('midcycle')
                  if (s.id === 'review' && canProceedMembers) setStep('review')
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  step === s.id
                    ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step === s.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}>
                  {s.number}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < steps.length - 1 && <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700 mx-1" />}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Step 1: Configuration */}
          {step === 'config' && (
            <div className="space-y-5">
              {/* Circle name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Circle Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tontine Familiale Mensuelle"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Amount & Currency */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Contribution Amount</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="500"
                    min="1"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                  >
                    <option value="CHF">CHF</option>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="XAF">XAF</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>

              {/* Frequency & Positions */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as typeof frequency)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="bi_weekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Positions (3–50)</label>
                  <input
                    type="number"
                    value={positions}
                    onChange={(e) => setPositions(e.target.value)}
                    placeholder="12"
                    min="3"
                    max="50"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Payout Method */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Payout Method</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {([
                    { value: 'fixed', label: 'Fixed Order', desc: 'Set rotation' },
                    { value: 'random', label: 'Random', desc: 'Drawn each cycle' },
                    { value: 'bidding', label: 'Bidding', desc: 'Members bid' },
                    { value: 'trust_score', label: 'Trust Score', desc: 'Score-based' },
                  ] as const).map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setPayoutMethod(m.value)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        payoutMethod === m.value
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <p className={`text-xs font-semibold ${payoutMethod === m.value ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>{m.label}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{m.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mid-Cycle toggle */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mid-Cycle Import</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">This circle is already in progress</p>
                  </div>
                  <div
                    onClick={() => setIsMidCycle(!isMidCycle)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${isMidCycle ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${isMidCycle ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                </label>
                {isMidCycle && (
                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Current Cycle</label>
                      <input
                        type="number"
                        value={currentCycle}
                        onChange={(e) => setCurrentCycle(e.target.value)}
                        min="1"
                        max={positions || '50'}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Next Payment Due</label>
                      <input
                        type="date"
                        value={nextPaymentDate}
                        onChange={(e) => setNextPaymentDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Late payment rules */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Late Payment Rules</label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Grace Period (days)</label>
                    <input
                      type="number"
                      value={gracePeriod}
                      onChange={(e) => setGracePeriod(e.target.value)}
                      min="0"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Late Fee Type</label>
                    <select
                      value={lateFeeType}
                      onChange={(e) => setLateFeeType(e.target.value as typeof lateFeeType)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                    >
                      <option value="none">None</option>
                      <option value="fixed">Fixed Amount</option>
                      <option value="percentage">Percentage</option>
                    </select>
                  </div>
                  {lateFeeType !== 'none' && (
                    <div>
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                        {lateFeeType === 'fixed' ? `Fee (${currency})` : 'Fee (%)'}
                      </label>
                      <input
                        type="number"
                        value={lateFeeAmount}
                        onChange={(e) => setLateFeeAmount(e.target.value)}
                        placeholder={lateFeeType === 'fixed' ? '10' : '2'}
                        min="0"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Emergency Fund */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Emergency Fund Rate (%)</label>
                <input
                  type="number"
                  value={emergencyFundRate}
                  onChange={(e) => setEmergencyFundRate(e.target.value)}
                  min="0"
                  max="20"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Custom rules */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Custom Rules ({customRules.length}/5)</label>
                {customRules.map((rule, i) => (
                  <div key={i} className="flex items-center gap-2 mb-1.5">
                    <span className="flex-1 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg">{rule}</span>
                    <button onClick={() => setCustomRules(customRules.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-rose-500 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
                {customRules.length < 5 && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newRule}
                      onChange={(e) => setNewRule(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addRule()}
                      placeholder="e.g. Members must attend quarterly meeting"
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                    />
                    <button onClick={addRule} className="px-3 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors">Add</button>
                  </div>
                )}
              </div>

              {/* Auto-calculated preview */}
              {canProceedConfig && (
                <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 p-4">
                  <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-2">Auto-Calculated</p>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-lg font-bold text-indigo-700 dark:text-indigo-400">{currency} {totalValue.toLocaleString()}</p>
                      <p className="text-[10px] text-indigo-500 dark:text-indigo-400/70 uppercase tracking-wider">Total Value</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-indigo-700 dark:text-indigo-400">{currency} {payoutPerCycle.toLocaleString()}</p>
                      <p className="text-[10px] text-indigo-500 dark:text-indigo-400/70 uppercase tracking-wider">Per Cycle</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-indigo-700 dark:text-indigo-400">{currency} {efPerMember.toFixed(0)}</p>
                      <p className="text-[10px] text-indigo-500 dark:text-indigo-400/70 uppercase tracking-wider">EF / Member</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Member Selection & Payout Order */}
          {step === 'members' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Select <span className="font-bold text-slate-900 dark:text-white">{posCount}</span> members and assign payout positions
                </p>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  selectedMembers.length === posCount
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {selectedMembers.length}/{posCount} selected
                </span>
              </div>

              {/* Available members */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-800 max-h-52 overflow-y-auto">
                {availableMembers.map((m) => {
                  const isSelected = selectedMembers.includes(m.id)
                  return (
                    <button
                      key={m.id}
                      onClick={() => toggleMember(m.id)}
                      disabled={!isSelected && selectedMembers.length >= posCount}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        isSelected
                          ? 'bg-indigo-50 dark:bg-indigo-950/20'
                          : selectedMembers.length >= posCount
                          ? 'opacity-40 cursor-not-allowed'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 dark:border-slate-600'
                      }`}>
                        {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                        {m.firstName[0]}{m.lastName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{m.firstName} {m.lastName}</p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500">{m.mappedRole}</p>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Payout Order */}
              {positionOrder.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Payout Order</p>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-800">
                    {positionOrder.map((memberId, i) => {
                      const member = availableMembers.find((m) => m.id === memberId)
                      if (!member) return null
                      return (
                        <div key={memberId} className="flex items-center gap-3 px-4 py-2.5">
                          <span className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400">
                            {i + 1}
                          </span>
                          <p className="flex-1 text-sm font-medium text-slate-900 dark:text-white">{member.firstName} {member.lastName}</p>
                          <div className="flex gap-1">
                            <button
                              onClick={() => movePosition(i, 'up')}
                              disabled={i === 0}
                              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
                            >
                              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                            </button>
                            <button
                              onClick={() => movePosition(i, 'down')}
                              disabled={i === positionOrder.length - 1}
                              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
                            >
                              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Mid-Cycle State */}
          {step === 'midcycle' && (
            <div className="space-y-5">
              {!isMidCycle ? (
                <div className="text-center py-12">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-7 h-7 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">No Mid-Cycle State Needed</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">This circle will start fresh from cycle 1.</p>
                </div>
              ) : (
                <>
                  <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 p-4">
                    <div className="flex gap-2">
                      <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                      <div>
                        <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">Mid-Cycle Import Active</p>
                        <p className="text-xs text-amber-700 dark:text-amber-400/80 mt-0.5">
                          This circle is on cycle {currentCycle} of {posCount}. Mark which positions have already been paid out.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Payout Status by Position</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">Positions before cycle {currentCycle} should be marked as paid out.</p>
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-800">
                      {positionOrder.map((memberId, i) => {
                        const member = availableMembers.find((m) => m.id === memberId)
                        if (!member) return null
                        const isPaidOut = i + 1 < parseInt(currentCycle)
                        return (
                          <div key={memberId} className="flex items-center gap-3 px-4 py-3">
                            <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                              isPaidOut
                                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
                                : i + 1 === parseInt(currentCycle)
                                ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/30'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                            }`}>
                              {i + 1}
                            </span>
                            <p className="flex-1 text-sm font-medium text-slate-900 dark:text-white">{member.firstName} {member.lastName}</p>
                            <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                              isPaidOut
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                                : i + 1 === parseInt(currentCycle)
                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400'
                                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                            }`}>
                              {isPaidOut ? 'Paid Out' : i + 1 === parseInt(currentCycle) ? 'Current' : 'Pending'}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 4: Review */}
          {step === 'review' && (
            <div className="space-y-5">
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">{name || 'Untitled Circle'}</h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Contribution</span>
                    <span className="font-medium text-slate-900 dark:text-white">{currency} {contribAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Frequency</span>
                    <span className="font-medium text-slate-900 dark:text-white capitalize">{frequency.replace('_', '-')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Positions</span>
                    <span className="font-medium text-slate-900 dark:text-white">{posCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Payout Method</span>
                    <span className="font-medium text-slate-900 dark:text-white capitalize">{payoutMethod.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Total Value</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{currency} {totalValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Mid-Cycle</span>
                    <span className="font-medium text-slate-900 dark:text-white">{isMidCycle ? `Cycle ${currentCycle}` : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Grace Period</span>
                    <span className="font-medium text-slate-900 dark:text-white">{gracePeriod} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Emergency Fund</span>
                    <span className="font-medium text-slate-900 dark:text-white">{emergencyFundRate}%</span>
                  </div>
                </div>
              </div>

              {/* Members list */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Payout Order ({positionOrder.length} members)</h4>
                <div className="space-y-1.5">
                  {positionOrder.map((memberId, i) => {
                    const member = availableMembers.find((m) => m.id === memberId)
                    if (!member) return null
                    const isPaidOut = isMidCycle && i + 1 < parseInt(currentCycle)
                    return (
                      <div key={memberId} className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${
                          isPaidOut ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}>
                          {i + 1}
                        </span>
                        <span className="text-sm text-slate-700 dark:text-slate-300">{member.firstName} {member.lastName}</span>
                        {isPaidOut && <span className="text-[10px] text-emerald-500 font-medium ml-auto">Paid out</span>}
                      </div>
                    )
                  })}
                </div>
              </div>

              {customRules.length > 0 && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Custom Rules</h4>
                  <ul className="space-y-1">
                    {customRules.map((rule, i) => (
                      <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <span className="text-indigo-500 mt-0.5">•</span>
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
          <button
            onClick={() => {
              if (step === 'config') onClose()
              else if (step === 'members') setStep('config')
              else if (step === 'midcycle') setStep('members')
              else setStep('midcycle')
            }}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            {step === 'config' ? 'Cancel' : 'Back'}
          </button>
          {step === 'review' ? (
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-500/20"
            >
              Import Circle
            </button>
          ) : (
            <button
              onClick={() => {
                if (step === 'config' && canProceedConfig) setStep('members')
                else if (step === 'members' && canProceedMembers) setStep('midcycle')
                else if (step === 'midcycle') setStep('review')
              }}
              disabled={
                (step === 'config' && !canProceedConfig) ||
                (step === 'members' && !canProceedMembers)
              }
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

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
