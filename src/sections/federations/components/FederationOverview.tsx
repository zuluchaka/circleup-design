import { useState } from 'react'
import type {
  FederationOverviewProps,
  Federation,
} from '@/../product/sections/federations/types'

type OverviewTab = 'dashboard' | 'financial' | 'compliance' | 'activity'

const tabDefs: { id: OverviewTab; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'financial', label: 'Financial Insights' },
  { id: 'compliance', label: 'Compliance & Governance' },
  { id: 'activity', label: 'Activity & Events' },
]

const severityStyles = {
  high: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/50',
  medium: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50',
  low: 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700',
}
const severityBadge = {
  high: 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300',
  medium: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300',
  low: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400',
}

function HealthGauge({ score, label, size = 'md' }: { score: number; label: string; size?: 'sm' | 'md' }) {
  const r = size === 'md' ? 32 : 22
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const dim = size === 'md' ? 80 : 56
  const color = score >= 80 ? 'text-emerald-500' : score >= 60 ? 'text-amber-500' : 'text-red-500'
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${dim} ${dim}`}>
          <circle cx={dim / 2} cy={dim / 2} r={r} fill="none" strokeWidth={size === 'md' ? 5 : 4} className="stroke-slate-200 dark:stroke-slate-700" />
          <circle cx={dim / 2} cy={dim / 2} r={r} fill="none" strokeWidth={size === 'md' ? 5 : 4}
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            className={color} style={{ stroke: 'currentColor' }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`${size === 'md' ? 'text-lg' : 'text-sm'} font-bold ${color}`}>{score}</span>
        </div>
      </div>
      <span className="text-[10px] text-slate-500 dark:text-slate-400 text-center leading-tight">{label}</span>
    </div>
  )
}

function FederationComparisonCard({
  fed,
  assocCount,
  memberCount,
  alertCount,
  totalFunds,
  complianceRate,
  onSelect,
}: {
  fed: Federation
  assocCount: number
  memberCount: number
  alertCount: number
  totalFunds: number
  complianceRate: number
  onSelect?: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className="w-full text-left bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-800 transition-all group"
    >
      <div className="flex items-start gap-3">
        <img src={fed.logo} alt={fed.name} className="w-10 h-10 rounded-lg object-cover border border-slate-100 dark:border-slate-700 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">{fed.name}</h3>
            <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
              fed.status === 'active' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
            }`}>{fed.status}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">{memberCount.toLocaleString()}</p>
              <p className="text-[9px] text-slate-500 dark:text-slate-400">Members</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">{assocCount}</p>
              <p className="text-[9px] text-slate-500 dark:text-slate-400">Assoc.</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">{fed.currency} {(totalFunds / 1000).toFixed(0)}k</p>
              <p className="text-[9px] text-slate-500 dark:text-slate-400">Funds</p>
            </div>
            <div>
              <p className={`text-xs font-bold ${complianceRate >= 80 ? 'text-emerald-600 dark:text-emerald-400' : complianceRate >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
                {complianceRate.toFixed(0)}%
              </p>
              <p className="text-[9px] text-slate-500 dark:text-slate-400">Compliance</p>
            </div>
            <div>
              <p className={`text-xs font-bold ${alertCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {alertCount}
              </p>
              <p className="text-[9px] text-slate-500 dark:text-slate-400">Alerts</p>
            </div>
          </div>
        </div>
        <HealthGauge score={fed.healthScore} label="" size="sm" />
      </div>
    </button>
  )
}

export function FederationOverview({
  federations,
  childAssociations,
  leaders,
  funds,
  alerts,
  announcements,
  events,
  cashFlowHistories,
  policies,
  duesInvoices,
  budgets,
  transfers,
  elections,
  reports,
  aggregatedMembers,
  complianceItems,
  onSelectFederation,
  onCreateFederation,
  onAcknowledgeAlert,
  onGenerateReport,
}: FederationOverviewProps) {
  const [activeTab, setActiveTab] = useState<OverviewTab>('dashboard')

  // Aggregate totals
  const totalMembers = federations.reduce((s, f) => s + f.totalMembers, 0)
  const totalAssociations = federations.reduce((s, f) => s + f.totalAssociations, 0)
  const totalCircles = federations.reduce((s, f) => s + f.totalActiveCircles, 0)
  const avgHealthScore = federations.length > 0 ? Math.round(federations.reduce((s, f) => s + f.healthScore, 0) / federations.length) : 0
  const totalFundsAll = funds.reduce((s, f) => s + f.balance, 0)
  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged)
  const overdueInvoices = duesInvoices.filter((i) => i.status === 'overdue')
  const pendingTransfers = transfers.filter((t) => t.status === 'pending_approval')
  const nonCompliant = complianceItems.filter((c) => c.status === 'non_compliant')
  const upcomingEvents = events.filter((e) => e.status === 'upcoming')
  const upcomingElections = elections.filter((e) => e.status === 'upcoming' || e.status === 'nomination' || e.status === 'voting')
  const totalBudgeted = budgets.reduce((s, b) => s + b.totalBudget, 0)
  const totalSpent = budgets.reduce((s, b) => s + b.totalSpent, 0)

  // Per-federation metrics for comparison
  const fedMetrics = federations.map((fed) => {
    const fedAssoc = childAssociations.filter((a) => a.federationId === fed.id)
    const fedAlerts = alerts.filter((a) => a.federationId === fed.id && !a.acknowledged)
    const fedFunds = funds.filter((f) => f.federationId === fed.id)
    const fedComp = complianceItems.filter((c) => c.federationId === fed.id)
    const compliantCount = fedComp.filter((c) => c.status === 'compliant').length
    const complianceRate = fedComp.length > 0 ? (compliantCount / fedComp.length) * 100 : 100
    return {
      fed,
      assocCount: fedAssoc.length,
      memberCount: fed.totalMembers,
      alertCount: fedAlerts.length,
      totalFunds: fedFunds.reduce((s, f) => s + f.balance, 0),
      complianceRate,
    }
  })

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 dark:from-slate-950 dark:via-indigo-950/80 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-semibold text-indigo-300 uppercase tracking-widest mb-1">Federation Management</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">All Federations Overview</h1>
              <p className="text-sm text-slate-400 mt-2">
                Cross-federation insights, reporting, and compliance monitoring
              </p>
            </div>
            <button
              onClick={onCreateFederation}
              className="text-sm font-medium px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors flex items-center gap-2 flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New Federation
            </button>
          </div>

          {/* Global stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
            {[
              { label: 'Federations', value: federations.length.toString() },
              { label: 'Total Members', value: totalMembers.toLocaleString() },
              { label: 'Associations', value: totalAssociations.toString() },
              { label: 'Active Circles', value: totalCircles.toString() },
              { label: 'Avg Health', value: `${avgHealthScore}/100`, highlight: avgHealthScore >= 80 },
              { label: 'Active Alerts', value: unacknowledgedAlerts.length.toString(), warn: unacknowledgedAlerts.length > 0 },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 px-4 py-3">
                <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">{stat.label}</p>
                <p className={`text-xl font-bold mt-0.5 ${
                  'warn' in stat && stat.warn ? 'text-red-400' :
                  'highlight' in stat && stat.highlight ? 'text-emerald-400' :
                  'text-white'
                }`}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex gap-0 overflow-x-auto scrollbar-none -mb-px">
            {tabDefs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300'
                }`}
              >
                {tab.label}
                {tab.id === 'compliance' && nonCompliant.length > 0 && (
                  <span className="ml-1.5 w-4 h-4 inline-flex items-center justify-center rounded-full bg-red-500 text-white text-[8px] font-bold">
                    {nonCompliant.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* =========== DASHBOARD TAB =========== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Federation comparison cards */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">Federations at a Glance</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {fedMetrics.map((m) => (
                  <FederationComparisonCard key={m.fed.id} {...m} onSelect={() => onSelectFederation?.(m.fed.id)} />
                ))}
              </div>
            </div>

            {/* Health score comparison */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Health Score Comparison</h3>
              <div className="flex items-end justify-center gap-8 flex-wrap">
                {federations.map((fed) => (
                  <HealthGauge key={fed.id} score={fed.healthScore} label={fed.name.split(' ').slice(0, 3).join(' ')} />
                ))}
                <HealthGauge score={avgHealthScore} label="Average" />
              </div>
            </div>

            {/* Side-by-side: Alerts + Upcoming */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Alerts */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">
                    Active Alerts
                    {unacknowledgedAlerts.length > 0 && (
                      <span className="ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300">
                        {unacknowledgedAlerts.length}
                      </span>
                    )}
                  </h3>
                </div>
                {unacknowledgedAlerts.length === 0 ? (
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-5 text-center">
                    <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">All clear across all federations</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {unacknowledgedAlerts.slice(0, 6).map((alert) => {
                      const fedName = federations.find((f) => f.id === alert.federationId)?.name || ''
                      return (
                        <div key={alert.id} className={`${severityStyles[alert.severity]} border rounded-xl p-3`}>
                          <div className="flex items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-[8px] font-bold uppercase px-1 py-0.5 rounded ${severityBadge[alert.severity]}`}>{alert.severity}</span>
                                <span className="text-[8px] font-medium px-1 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 truncate max-w-[120px]">
                                  {fedName.split(' ').slice(0, 2).join(' ')}
                                </span>
                              </div>
                              <p className="text-xs font-semibold text-slate-900 dark:text-white mt-1">{alert.title}</p>
                              <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-1">{alert.description}</p>
                            </div>
                            <button
                              onClick={() => onAcknowledgeAlert?.(alert.id)}
                              className="text-[10px] font-medium px-2 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex-shrink-0"
                            >
                              Ack
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Upcoming events & elections */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">Upcoming Activity</h3>
                {upcomingElections.length > 0 && (
                  <div className="space-y-2">
                    {upcomingElections.map((elec) => {
                      const fedName = federations.find((f) => f.id === elec.federationId)?.name || ''
                      return (
                        <div key={elec.id} className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/50 rounded-xl p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                            </svg>
                            <span className="text-[9px] font-bold uppercase text-indigo-600 dark:text-indigo-400">Election</span>
                            <span className="text-[8px] font-medium px-1 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">{fedName.split(' ').slice(0, 2).join(' ')}</span>
                          </div>
                          <p className="text-xs font-semibold text-slate-900 dark:text-white">{elec.title}</p>
                          {elec.votingStart && (
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                              Voting: {new Date(elec.votingStart).toLocaleDateString('en', { month: 'short', day: 'numeric' })} — {new Date(elec.votingEnd!).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
                {upcomingEvents.slice(0, 4).map((evt) => {
                  const fedName = federations.find((f) => f.id === evt.federationId)?.name || ''
                  return (
                    <div key={evt.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                        </svg>
                        <span className="text-[8px] font-medium px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">{fedName.split(' ').slice(0, 2).join(' ')}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">{evt.title}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {new Date(evt.date).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })} &middot; {evt.location}
                      </p>
                    </div>
                  )
                })}
                {upcomingEvents.length === 0 && upcomingElections.length === 0 && (
                  <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">No upcoming activity</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent announcements */}
            {announcements.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">Latest Announcements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {announcements.slice(0, 4).map((ann) => {
                    const fedName = federations.find((f) => f.id === ann.federationId)?.name || ''
                    return (
                      <div key={ann.id} className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 border-l-4 ${
                        ann.priority === 'high' ? 'border-l-red-500' : ann.priority === 'medium' ? 'border-l-amber-500' : 'border-l-slate-300 dark:border-l-slate-600'
                      } p-3`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[7px] font-bold uppercase px-1 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">Fed</span>
                          <span className="text-[9px] text-slate-400 dark:text-slate-500">{fedName.split(' ').slice(0, 3).join(' ')}</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">{ann.title}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{ann.content}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========== FINANCIAL TAB =========== */}
        {activeTab === 'financial' && (
          <div className="space-y-6">
            {/* Cross-federation financial summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl p-4 text-white">
                <p className="text-xs font-medium text-indigo-200 uppercase tracking-wide">Total Funds (All)</p>
                <p className="text-2xl font-bold mt-1">{totalFundsAll.toLocaleString()}</p>
                <p className="text-xs text-indigo-200 mt-1">{funds.length} fund accounts</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Budgeted</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalBudgeted.toLocaleString()}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{budgets.length} budgets</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total Spent</p>
                <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">{totalSpent.toLocaleString()}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{totalBudgeted > 0 ? `${(totalSpent / totalBudgeted * 100).toFixed(0)}% of budget` : '—'}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Overdue Dues</p>
                <p className={`text-2xl font-bold mt-1 ${overdueInvoices.length > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>{overdueInvoices.length}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{duesInvoices.length} total invoices</p>
              </div>
            </div>

            {/* Per-federation financial breakdown */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">Financial Breakdown by Federation</h3>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Federation</th>
                        <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-right">Fund Balance</th>
                        <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-right hidden sm:table-cell">Budget</th>
                        <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-right hidden sm:table-cell">Spent</th>
                        <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-center hidden md:table-cell">Budget %</th>
                        <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-center">Dues Status</th>
                        <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-center hidden md:table-cell">Net Flow</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                      {federations.map((fed) => {
                        const fedFunds = funds.filter((f) => f.federationId === fed.id)
                        const fedBudget = budgets.find((b) => b.federationId === fed.id)
                        const fedInvoices = duesInvoices.filter((i) => i.federationId === fed.id)
                        const fedOverdue = fedInvoices.filter((i) => i.status === 'overdue').length
                        const fedPaid = fedInvoices.filter((i) => i.status === 'paid').length
                        const balance = fedFunds.reduce((s, f) => s + f.balance, 0)
                        const cashFlow = cashFlowHistories.find((h) => h.federationId === fed.id)
                        const netFlow = cashFlow ? cashFlow.entries.reduce((s, e) => s + e.income - e.expenses, 0) : 0
                        const budgetPct = fedBudget && fedBudget.totalBudget > 0 ? (fedBudget.totalSpent / fedBudget.totalBudget * 100) : 0

                        return (
                          <tr key={fed.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer" onClick={() => onSelectFederation?.(fed.id)}>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <img src={fed.logo} alt="" className="w-6 h-6 rounded object-cover flex-shrink-0" />
                                <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">{fed.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">{fed.currency} {balance.toLocaleString()}</span>
                            </td>
                            <td className="px-4 py-3 text-right hidden sm:table-cell">
                              <span className="text-xs text-slate-600 dark:text-slate-300 font-mono">
                                {fedBudget ? `${fedBudget.currency} ${fedBudget.totalBudget.toLocaleString()}` : '—'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right hidden sm:table-cell">
                              <span className="text-xs text-slate-600 dark:text-slate-300 font-mono">
                                {fedBudget ? `${fedBudget.currency} ${fedBudget.totalSpent.toLocaleString()}` : '—'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center hidden md:table-cell">
                              {fedBudget ? (
                                <div className="flex items-center gap-1.5 justify-center">
                                  <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${budgetPct >= 90 ? 'bg-red-500' : budgetPct >= 80 ? 'bg-amber-500' : 'bg-indigo-500'}`} style={{ width: `${Math.min(budgetPct, 100)}%` }} />
                                  </div>
                                  <span className={`text-[10px] font-bold ${budgetPct >= 80 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}`}>{budgetPct.toFixed(0)}%</span>
                                </div>
                              ) : <span className="text-[10px] text-slate-400">—</span>}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">{fedPaid}p</span>
                                {fedOverdue > 0 && <span className="text-[9px] font-bold text-red-600 dark:text-red-400">{fedOverdue}o</span>}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center hidden md:table-cell">
                              <span className={`text-xs font-bold font-mono ${netFlow >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                {netFlow >= 0 ? '+' : ''}{(netFlow / 1000).toFixed(0)}k
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Funds at risk */}
            {funds.filter((f) => f.belowThreshold).length > 0 && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 rounded-xl p-4">
                <h4 className="text-xs font-semibold text-red-700 dark:text-red-300 uppercase tracking-wide mb-2">Funds Below Threshold</h4>
                <div className="space-y-2">
                  {funds.filter((f) => f.belowThreshold).map((fund) => {
                    const fedName = federations.find((f2) => f2.id === fund.federationId)?.name || ''
                    return (
                      <div key={fund.id} className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-medium text-slate-900 dark:text-white">{fund.name}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 ml-2">({fedName.split(' ').slice(0, 2).join(' ')})</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-red-600 dark:text-red-400">{fund.currency} {fund.balance.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-400 ml-2">min: {fund.currency} {fund.minimumThreshold.toLocaleString()}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Pending transfers */}
            {pendingTransfers.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">Pending Approvals ({pendingTransfers.length})</h3>
                <div className="space-y-2">
                  {pendingTransfers.map((xfer) => {
                    const fedName = federations.find((f) => f.id === xfer.federationId)?.name || ''
                    return (
                      <div key={xfer.id} className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-3 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] font-bold uppercase px-1 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">{xfer.type}</span>
                            <span className="text-[8px] text-slate-400">{fedName.split(' ').slice(0, 2).join(' ')}</span>
                          </div>
                          <p className="text-xs font-semibold text-slate-900 dark:text-white mt-1">
                            {xfer.currency} {xfer.amount.toLocaleString()} — {xfer.purpose.slice(0, 60)}
                          </p>
                        </div>
                        <span className="text-[9px] font-bold uppercase px-2 py-1 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex-shrink-0">Awaiting</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========== COMPLIANCE TAB =========== */}
        {activeTab === 'compliance' && (
          <div className="space-y-6">
            {/* Compliance summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">Active Policies</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{policies.filter((p) => p.status === 'active').length}</p>
                <p className="text-[10px] text-slate-400 mt-1">{policies.length} total</p>
              </div>
              <div className={`rounded-xl border p-4 text-center ${
                nonCompliant.length > 0 ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/50' : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50'
              }`}>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">Non-Compliant</p>
                <p className={`text-3xl font-bold mt-1 ${nonCompliant.length > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>{nonCompliant.length}</p>
                <p className="text-[10px] text-slate-400 mt-1">{complianceItems.length} tracked</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">Leaders</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{leaders.length}</p>
                <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">
                  {leaders.filter((l) => l.termStatus === 'expiring_soon').length} terms expiring
                </p>
              </div>
            </div>

            {/* Compliance items table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Compliance Tracker (All Federations)</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="px-4 py-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Federation</th>
                      <th className="px-4 py-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Association</th>
                      <th className="px-4 py-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase hidden sm:table-cell">Policy</th>
                      <th className="px-4 py-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase text-center">Status</th>
                      <th className="px-4 py-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase hidden md:table-cell">Details</th>
                      <th className="px-4 py-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase hidden md:table-cell">Deadline</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                    {complianceItems.map((item) => {
                      const fedName = federations.find((f) => f.id === item.federationId)?.name || ''
                      const statusStyle = item.status === 'compliant' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                        : item.status === 'non_compliant' ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
                        : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                      return (
                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                          <td className="px-4 py-2 text-xs text-slate-500 dark:text-slate-400">{fedName.split(' ').slice(0, 3).join(' ')}</td>
                          <td className="px-4 py-2 text-xs font-medium text-slate-900 dark:text-white">{item.associationName}</td>
                          <td className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hidden sm:table-cell">{item.policyTitle}</td>
                          <td className="px-4 py-2 text-center">
                            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${statusStyle}`}>{item.status.replace('_', ' ')}</span>
                          </td>
                          <td className="px-4 py-2 text-[10px] text-slate-500 dark:text-slate-400 max-w-[200px] truncate hidden md:table-cell">{item.details}</td>
                          <td className="px-4 py-2 text-[10px] text-slate-500 dark:text-slate-400 hidden md:table-cell">{item.deadline ? new Date(item.deadline).toLocaleDateString() : '—'}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Policies by federation */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">Policies by Federation</h3>
              {federations.map((fed) => {
                const fedPolicies = policies.filter((p) => p.federationId === fed.id && p.status === 'active')
                if (fedPolicies.length === 0) return null
                return (
                  <div key={fed.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <img src={fed.logo} alt="" className="w-5 h-5 rounded object-cover" />
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{fed.name}</h4>
                      <span className="text-[9px] text-slate-400">{fedPolicies.length} active</span>
                    </div>
                    <div className="space-y-2">
                      {fedPolicies.map((pol) => (
                        <div key={pol.id} className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`text-[8px] font-bold uppercase px-1 py-0.5 rounded ${
                              pol.enforcementLevel === 'mandatory' ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
                              : pol.enforcementLevel === 'recommended' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                            }`}>{pol.enforcementLevel}</span>
                            <span className="text-xs text-slate-700 dark:text-slate-200 truncate">{pol.title}</span>
                          </div>
                          <span className={`text-[10px] font-bold flex-shrink-0 ${
                            pol.compliantCount === pol.totalAssociations ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                          }`}>{pol.compliantCount}/{pol.totalAssociations}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* =========== ACTIVITY TAB =========== */}
        {activeTab === 'activity' && (
          <div className="space-y-6">
            {/* Reports */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">Reports (All Federations)</h3>
                <button
                  onClick={() => onGenerateReport?.('annual')}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                  Generate Report
                </button>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="px-4 py-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Report</th>
                        <th className="px-4 py-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase hidden sm:table-cell">Federation</th>
                        <th className="px-4 py-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Period</th>
                        <th className="px-4 py-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase text-center">Status</th>
                        <th className="px-4 py-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                      {reports.map((rpt) => {
                        const fedName = federations.find((f) => f.id === rpt.federationId)?.name || ''
                        return (
                          <tr key={rpt.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                            <td className="px-4 py-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm">
                                  {rpt.type === 'annual' ? '📊' : rpt.type === 'financial' ? '💰' : rpt.type === 'membership' ? '👥' : rpt.type === 'circle_performance' ? '🔄' : '📋'}
                                </span>
                                <div>
                                  <p className="text-xs font-semibold text-slate-900 dark:text-white">{rpt.title}</p>
                                  {rpt.scheduled && (
                                    <span className="text-[8px] text-indigo-600 dark:text-indigo-400">Auto-scheduled</span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-2 text-xs text-slate-500 dark:text-slate-400 hidden sm:table-cell">{fedName.split(' ').slice(0, 3).join(' ')}</td>
                            <td className="px-4 py-2 text-xs text-slate-600 dark:text-slate-300">{rpt.period}</td>
                            <td className="px-4 py-2 text-center">
                              <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                rpt.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                                : rpt.status === 'generating' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                                : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
                              }`}>{rpt.status}</span>
                            </td>
                            <td className="px-4 py-2 text-center">
                              {rpt.downloadUrl ? (
                                <a href={rpt.downloadUrl} className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline">Download</a>
                              ) : rpt.status === 'generating' ? (
                                <div className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
                              ) : (
                                <span className="text-[10px] text-slate-400">—</span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Members overview */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">Member Distribution</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">Total Members</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{totalMembers.toLocaleString()}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">Federation Leaders</p>
                  <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{leaders.length}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">Cross-Assoc Members</p>
                  <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                    {aggregatedMembers.filter((m) => m.associations.length > 1).length}
                  </p>
                </div>
              </div>
            </div>

            {/* All events timeline */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">All Events</h3>
              <div className="space-y-2">
                {events.map((evt) => {
                  const fedName = federations.find((f) => f.id === evt.federationId)?.name || ''
                  const statusStyle = evt.status === 'upcoming' ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                    : evt.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                    : evt.status === 'draft' ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
                  return (
                    <div key={evt.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 flex items-center gap-3">
                      <div className="text-center flex-shrink-0 w-12">
                        <p className="text-lg font-bold text-slate-900 dark:text-white">{new Date(evt.date).getDate()}</p>
                        <p className="text-[9px] text-slate-500 dark:text-slate-400 uppercase">{new Date(evt.date).toLocaleDateString('en', { month: 'short' })}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs font-semibold text-slate-900 dark:text-white">{evt.title}</p>
                          <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${statusStyle}`}>{evt.status}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">{fedName.split(' ').slice(0, 3).join(' ')}</span>
                          <span className="text-[10px] text-slate-400">{evt.location}</span>
                          {evt.rsvpCount > 0 && <span className="text-[10px] text-slate-400">{evt.rsvpCount} RSVP</span>}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
