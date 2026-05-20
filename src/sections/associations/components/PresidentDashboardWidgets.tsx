import { useState, useEffect } from 'react'
import type { JoinRequest, EligibilityCheck } from '@/../product/sections/associations/types'

interface BrData {
  id: string; status: string; reference: string; subscriptionTier: string
  contractEndDate: string | null; renewalDeadline: string | null
  renewalStatus: string | null; daysUntilRenewal: number | null
}

interface CmData {
  id: string; name: string; email: string; phone: string | null; responseSla: string
}

interface AccountData {
  totalBalance: number; currency: string
  fundBreakdown: { name: string; balance: number }[]
}

interface CircleSummary {
  id: string; name: string; status: string; currentCycle: number
  totalCycles: number; memberCount: number; organizerName: string
}

interface PresidentDashboardData {
  businessRelationship: BrData | null
  circleManager: CmData | null
  accountSummary: AccountData | null
  circles: CircleSummary[]
}

interface PresidentDashboardWidgetsProps {
  associationId: string
  onNavigate?: (path: string) => void
  onSendMessage?: () => void
  pendingJoinRequests?: JoinRequest[]
  pendingTransactionApprovalsCount?: number
  pendingDuesDisputesCount?: number
  onApproveJoinRequest?: (id: string) => Promise<void> | void
  onRejectJoinRequest?: (id: string, reason?: string) => Promise<void> | void
}

const statusColors: Record<string, { bg: string; color: string }> = {
  active: { bg: '#dcfce7', color: '#166534' },
  pending: { bg: '#f3f4f6', color: '#6b7280' },
  suspended: { bg: '#fee2e2', color: '#991b1b' },
  terminated: { bg: '#fee2e2', color: '#991b1b' },
}

export function PresidentDashboardWidgets({
  associationId,
  onNavigate,
  onSendMessage,
  pendingJoinRequests = [],
  pendingTransactionApprovalsCount = 0,
  pendingDuesDisputesCount = 0,
  onApproveJoinRequest,
  onRejectJoinRequest,
}: PresidentDashboardWidgetsProps) {
  const [data, setData] = useState<PresidentDashboardData | null>(null)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  useEffect(() => {
    fetch(`/api/v1/associations/${associationId}/president_dashboard`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(json => {
        const d = json.data || json
        setData({ ...d, circles: d.circles || [] })
      })
      .catch(() => {})
  }, [associationId])

  const joinRequestCount = pendingJoinRequests.length
  const totalApprovalsCount = joinRequestCount + pendingTransactionApprovalsCount + pendingDuesDisputesCount
  const activeRequest = pendingJoinRequests.find(r => r.id === activeRequestId) ?? pendingJoinRequests[0] ?? null

  const openJoinRequestReview = (requestId?: string) => {
    if (requestId) setActiveRequestId(requestId)
    else setActiveRequestId(pendingJoinRequests[0]?.id ?? null)
    setReviewOpen(true)
  }

  const closeReview = () => {
    setReviewOpen(false)
    setRejectingId(null)
    setRejectReason('')
  }

  const handleApprove = async (id: string) => {
    setProcessingId(id)
    await onApproveJoinRequest?.(id)
    setProcessingId(null)
    const remaining = pendingJoinRequests.filter(r => r.id !== id)
    if (remaining.length === 0) closeReview()
    else setActiveRequestId(remaining[0].id)
  }

  const handleReject = async (id: string) => {
    setProcessingId(id)
    await onRejectJoinRequest?.(id, rejectReason.trim() || undefined)
    setProcessingId(null)
    setRejectingId(null)
    setRejectReason('')
    const remaining = pendingJoinRequests.filter(r => r.id !== id)
    if (remaining.length === 0) closeReview()
    else setActiveRequestId(remaining[0].id)
  }

  const br = data?.businessRelationship ?? null
  const cm = data?.circleManager ?? null
  const account = data?.accountSummary ?? null
  const showRenewal = br && br.daysUntilRenewal !== null && br.daysUntilRenewal <= 60

  const formatCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat('en-CH', { style: 'currency', currency, minimumFractionDigits: 0 }).format(amount)

  return (
    <div style={{ marginBottom: 24 }}>
      {/* Pending Approvals (Tailwind, sits above legacy cards) */}
      {totalApprovalsCount > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 mb-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 tracking-wider">PENDING APPROVALS</p>
              <p className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                {totalApprovalsCount} {totalApprovalsCount === 1 ? 'item needs' : 'items need'} your decision
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {joinRequestCount > 0 && (
              <button
                onClick={() => openJoinRequestReview()}
                className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium flex items-center gap-2 shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Request to join
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-bold">{joinRequestCount}</span>
              </button>
            )}
            {pendingTransactionApprovalsCount > 0 && (
              <button
                onClick={() => onNavigate?.(`/associations/${associationId}/transaction-approvals`)}
                className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium flex items-center gap-2"
              >
                Transactions
                <span className="px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-xs font-bold">{pendingTransactionApprovalsCount}</span>
              </button>
            )}
            {pendingDuesDisputesCount > 0 && (
              <button
                onClick={() => onNavigate?.(`/associations/${associationId}/dues-disputes`)}
                className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium flex items-center gap-2"
              >
                Dues disputes
                <span className="px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-xs font-bold">{pendingDuesDisputesCount}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Row 1: BR Status + CM Contact + Account Balance */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, marginBottom: 16 }}>
        {/* BR Status */}
        {br && (
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 14, color: '#666' }}>Business Relationship</h3>
              <span style={{ padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600, background: statusColors[br.status]?.bg || '#f3f4f6', color: statusColors[br.status]?.color || '#666' }}>
                {br.status.charAt(0).toUpperCase() + br.status.slice(1)}
              </span>
            </div>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Ref: {br.reference}</div>
            <div style={{ fontSize: 14 }}>
              <strong>{br.subscriptionTier.charAt(0).toUpperCase() + br.subscriptionTier.slice(1)}</strong> tier
            </div>
            {br.contractEndDate && (
              <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                Ends: {new Date(br.contractEndDate).toLocaleDateString()}
              </div>
            )}
            <button onClick={() => onNavigate?.(`/associations/${associationId}/subscription`)}
              style={{ marginTop: 12, background: 'none', border: '1px solid #E63946', color: '#E63946', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
              Manage Subscription
            </button>
          </div>
        )}

        {/* CM Contact */}
        {cm && (
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 14, color: '#666' }}>Circle Manager</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#E63946', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {cm.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{cm.name}</div>
                <div style={{ fontSize: 12, color: '#666' }}>{cm.email}</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Response SLA: {cm.responseSla}</div>
            <button onClick={onSendMessage}
              style={{ background: '#E63946', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
              Send Message
            </button>
          </div>
        )}

        {/* Account Balance */}
        {account && (
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 14, color: '#666' }}>Association Account</h3>
            <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
              {formatCurrency(account.totalBalance, account.currency)}
            </div>
            {account.fundBreakdown.length > 0 && (
              <div style={{ fontSize: 12 }}>
                {account.fundBreakdown.slice(0, 3).map((f, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', color: '#666', marginBottom: 2 }}>
                    <span>{f.name}</span>
                    <span>{formatCurrency(f.balance, account.currency)}</span>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => onNavigate?.(`/associations/${associationId}/ledger`)}
              style={{ marginTop: 12, background: 'none', border: '1px solid #E63946', color: '#E63946', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
              View Full Ledger
            </button>
          </div>
        )}
      </div>

      {/* Renewal Reminder */}
      {showRenewal && (
        <div style={{ background: '#fffbeb', border: '2px solid #f59e0b', borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, color: '#92400e' }}>Renewal Required</h3>
              <p style={{ margin: '4px 0 0', color: '#78350f' }}>
                Your contract renews in <strong>{br.daysUntilRenewal} days</strong>.
                Current tier: {br.subscriptionTier.charAt(0).toUpperCase() + br.subscriptionTier.slice(1)}.
              </p>
            </div>
            <button onClick={() => onNavigate?.(`/associations/${associationId}/subscription`)}
              style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}>
              Review Renewal
            </button>
          </div>
        </div>
      )}

      {/* Join Request Review Modal */}
      {reviewOpen && activeRequest && (
        <JoinRequestReviewModal
          requests={pendingJoinRequests}
          activeRequest={activeRequest}
          rejectingId={rejectingId}
          rejectReason={rejectReason}
          processingId={processingId}
          onSelect={(id) => setActiveRequestId(id)}
          onClose={closeReview}
          onStartReject={(id) => { setRejectingId(id); setRejectReason('') }}
          onCancelReject={() => { setRejectingId(null); setRejectReason('') }}
          onChangeReason={setRejectReason}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {/* Circles Table */}
      {data && data.circles.length > 0 && (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
          <h3 style={{ margin: '0 0 12px' }}>Circles Overview</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
                <th style={{ padding: '8px 4px' }}>Name</th>
                <th style={{ padding: '8px 4px' }}>Status</th>
                <th style={{ padding: '8px 4px' }}>Cycle</th>
                <th style={{ padding: '8px 4px' }}>Members</th>
                <th style={{ padding: '8px 4px' }}>Organizer</th>
              </tr>
            </thead>
            <tbody>
              {data.circles.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #f3f4f6', cursor: 'pointer' }}
                  onClick={() => onNavigate?.(`/circles/${c.id}`)}>
                  <td style={{ padding: '8px 4px', fontWeight: 500 }}>{c.name}</td>
                  <td style={{ padding: '8px 4px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 12, background: statusColors[c.status]?.bg || '#f3f4f6', color: statusColors[c.status]?.color || '#666' }}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ padding: '8px 4px' }}>{c.currentCycle}/{c.totalCycles}</td>
                  <td style={{ padding: '8px 4px' }}>{c.memberCount}</td>
                  <td style={{ padding: '8px 4px', color: '#666' }}>{c.organizerName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Join Request Review Modal
// ---------------------------------------------------------------------------

interface JoinRequestReviewModalProps {
  requests: JoinRequest[]
  activeRequest: JoinRequest
  rejectingId: string | null
  rejectReason: string
  processingId: string | null
  onSelect: (id: string) => void
  onClose: () => void
  onStartReject: (id: string) => void
  onCancelReject: () => void
  onChangeReason: (value: string) => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

function JoinRequestReviewModal({
  requests,
  activeRequest,
  rejectingId,
  rejectReason,
  processingId,
  onSelect,
  onClose,
  onStartReject,
  onCancelReject,
  onChangeReason,
  onApprove,
  onReject,
}: JoinRequestReviewModalProps) {
  const checks = activeRequest.eligibilityChecks ?? []
  const passed = checks.filter(c => c.status === 'passed').length
  const warnings = checks.filter(c => c.status === 'warning' || c.status === 'manual').length
  const failed = checks.filter(c => c.status === 'failed').length
  const verdict: 'auto-approve' | 'review' | 'block' =
    failed > 0 ? 'block' : warnings > 0 ? 'review' : 'auto-approve'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Review join requests</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {requests.length} pending {requests.length === 1 ? 'request' : 'requests'} · approve or reject with eligibility context
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-[260px_1fr] min-h-0">
          {/* Sidebar list */}
          <aside className="border-r border-slate-200 dark:border-slate-800 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/40">
            <ul className="divide-y divide-slate-200 dark:divide-slate-800">
              {requests.map((r) => {
                const isActive = r.id === activeRequest.id
                const failedCount = (r.eligibilityChecks ?? []).filter(c => c.status === 'failed').length
                const warnCount = (r.eligibilityChecks ?? []).filter(c => c.status === 'warning' || c.status === 'manual').length
                return (
                  <li key={r.id}>
                    <button
                      onClick={() => onSelect(r.id)}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-white dark:hover:bg-slate-800/60 transition-colors ${
                        isActive ? 'bg-white dark:bg-slate-800 border-l-2 border-indigo-500' : 'border-l-2 border-transparent'
                      }`}
                    >
                      {r.userAvatarUrl ? (
                        <img src={r.userAvatarUrl} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">{r.userName.charAt(0)}</span>
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{r.userName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{r.location ?? r.userEmail}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {failedCount > 0 && (
                          <span className="text-[10px] font-bold text-red-700 dark:text-red-400">{failedCount} fail</span>
                        )}
                        {warnCount > 0 && failedCount === 0 && (
                          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">{warnCount} warn</span>
                        )}
                        {failedCount === 0 && warnCount === 0 && (
                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">clear</span>
                        )}
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          </aside>

          {/* Detail */}
          <div className="overflow-y-auto p-6">
            {/* Applicant header */}
            <div className="flex items-start gap-4 mb-5">
              {activeRequest.userAvatarUrl ? (
                <img src={activeRequest.userAvatarUrl} alt="" className="w-16 h-16 rounded-2xl object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <span className="text-xl font-bold text-indigo-700 dark:text-indigo-300">{activeRequest.userName.charAt(0)}</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{activeRequest.userName}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{activeRequest.userEmail}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-600 dark:text-slate-300">
                  {activeRequest.location && (
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {activeRequest.location}
                    </span>
                  )}
                  {typeof activeRequest.trustScore === 'number' && (
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      Trust Score {activeRequest.trustScore}
                    </span>
                  )}
                  {typeof activeRequest.mutualMembersCount === 'number' && (
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {activeRequest.mutualMembersCount} mutual {activeRequest.mutualMembersCount === 1 ? 'member' : 'members'}
                    </span>
                  )}
                  <span>· Requested {new Date(activeRequest.requestedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
              <VerdictPill verdict={verdict} />
            </div>

            {/* Applicant message */}
            <div className="mb-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4">
              <p className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">APPLICANT MESSAGE</p>
              <p className="text-sm text-slate-700 dark:text-slate-200 italic">"{activeRequest.message}"</p>
            </div>

            {/* Eligibility pre-checks */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Eligibility pre-checks</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {passed} passed · {warnings} need review · {failed} blocking
                </p>
              </div>
              <ul className="space-y-2">
                {checks.length === 0 && (
                  <li className="text-sm text-slate-500 dark:text-slate-400">No eligibility rules configured for this association.</li>
                )}
                {checks.map((c) => (
                  <EligibilityRow key={c.id} check={c} />
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="border-t border-slate-200 dark:border-slate-800 px-6 py-4 bg-slate-50 dark:bg-slate-900/60">
          {rejectingId === activeRequest.id ? (
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <input
                type="text"
                value={rejectReason}
                onChange={(e) => onChangeReason(e.target.value)}
                placeholder="Reason (visible to applicant)"
                className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400"
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={onCancelReject}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Back
                </button>
                <button
                  onClick={() => onReject(activeRequest.id)}
                  disabled={processingId === activeRequest.id}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold disabled:opacity-50"
                >
                  Confirm reject
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {verdict === 'block' && 'Blocking checks failed — rejection recommended.'}
                {verdict === 'review' && 'Some checks need manual review before approval.'}
                {verdict === 'auto-approve' && 'All eligibility checks passed — safe to approve.'}
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => onStartReject(activeRequest.id)}
                  disabled={processingId === activeRequest.id}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
                >
                  Reject
                </button>
                <button
                  onClick={() => onApprove(activeRequest.id)}
                  disabled={processingId === activeRequest.id}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {processingId === activeRequest.id ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  Approve
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function VerdictPill({ verdict }: { verdict: 'auto-approve' | 'review' | 'block' }) {
  if (verdict === 'auto-approve') {
    return (
      <span className="flex-shrink-0 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
        All checks passed
      </span>
    )
  }
  if (verdict === 'review') {
    return (
      <span className="flex-shrink-0 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-semibold">
        Needs review
      </span>
    )
  }
  return (
    <span className="flex-shrink-0 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-semibold">
      Blocking issues
    </span>
  )
}

function EligibilityRow({ check }: { check: EligibilityCheck }) {
  const tone = {
    passed: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50',
      icon: 'text-emerald-600 dark:text-emerald-400',
      label: 'text-emerald-700 dark:text-emerald-300',
      path: 'M5 13l4 4L19 7',
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50',
      icon: 'text-amber-600 dark:text-amber-400',
      label: 'text-amber-700 dark:text-amber-300',
      path: 'M12 9v2m0 4h.01M4.93 19h14.14a2 2 0 001.74-2.99l-7.07-12.25a2 2 0 00-3.48 0L3.19 16.01A2 2 0 004.93 19z',
    },
    failed: {
      bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50',
      icon: 'text-red-600 dark:text-red-400',
      label: 'text-red-700 dark:text-red-300',
      path: 'M6 18L18 6M6 6l12 12',
    },
    manual: {
      bg: 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700',
      icon: 'text-slate-500 dark:text-slate-400',
      label: 'text-slate-700 dark:text-slate-200',
      path: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093M12 17h.01',
    },
  }[check.status]

  return (
    <li className={`flex items-start gap-3 rounded-lg border p-3 ${tone.bg}`}>
      <div className={`w-6 h-6 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center flex-shrink-0 ${tone.icon}`}>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={tone.path} />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${tone.label}`}>{check.label}</p>
        {check.detail && (
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{check.detail}</p>
        )}
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-wider ${tone.label}`}>
        {check.status === 'manual' ? 'Manual' : check.status}
      </span>
    </li>
  )
}
