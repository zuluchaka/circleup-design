import { useState, useMemo } from 'react'
import type { AtRiskAlert, Member, TrustScore, AlertStatus, RiskLevel } from '../types'
import { TrustScoreBadge } from './TrustScoreBadge'
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronRight,
  Phone,
  Mail,
  MessageSquare,
  UserX,
  Shield,
  TrendingDown,
  Calendar,
  Filter,
  ArrowUpRight,
  XCircle
} from 'lucide-react'

interface AtRiskMembersProps {
  alerts: AtRiskAlert[]
  members: Member[]
  trustScores: TrustScore[]
  onAcknowledge?: (alertId: string) => void
  onEscalate?: (alertId: string) => void
  onResolve?: (alertId: string) => void
  onContactMember?: (memberId: string, method: 'phone' | 'email' | 'message') => void
  onViewMember?: (memberId: string) => void
  onSuspendMember?: (memberId: string) => void
}

function getRiskConfig(level: RiskLevel) {
  switch (level) {
    case 'high':
      return {
        label: 'High Risk',
        icon: <AlertTriangle className="w-4 h-4" />,
        className: 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/50',
        borderColor: 'border-l-red-500',
        bgHover: 'hover:bg-red-50 dark:hover:bg-red-900/20'
      }
    case 'medium':
      return {
        label: 'Medium Risk',
        icon: <AlertCircle className="w-4 h-4" />,
        className: 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50',
        borderColor: 'border-l-amber-500',
        bgHover: 'hover:bg-amber-50 dark:hover:bg-amber-900/20'
      }
    default:
      return {
        label: 'Low Risk',
        icon: <Clock className="w-4 h-4" />,
        className: 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800',
        borderColor: 'border-l-slate-400',
        bgHover: 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
      }
  }
}

function getStatusConfig(status: AlertStatus) {
  switch (status) {
    case 'open':
      return { label: 'Open', icon: <AlertCircle className="w-3 h-3" />, className: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' }
    case 'acknowledged':
      return { label: 'Acknowledged', icon: <Clock className="w-3 h-3" />, className: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30' }
    case 'escalated':
      return { label: 'Escalated', icon: <ArrowUpRight className="w-3 h-3" />, className: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30' }
    case 'resolved':
      return { label: 'Resolved', icon: <CheckCircle2 className="w-3 h-3" />, className: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30' }
  }
}

export function AtRiskMembers({
  alerts,
  members,
  trustScores,
  onAcknowledge,
  onEscalate,
  onResolve,
  onContactMember,
  onViewMember,
  onSuspendMember
}: AtRiskMembersProps) {
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<AlertStatus | 'all'>('all')
  const [filterRisk, setFilterRisk] = useState<RiskLevel | 'all'>('all')

  // Create lookup maps
  const memberMap = useMemo(() => {
    const map = new Map<string, Member>()
    members.forEach(m => map.set(m.id, m))
    return map
  }, [members])

  const scoreMap = useMemo(() => {
    const map = new Map<string, TrustScore>()
    trustScores.forEach(ts => map.set(ts.memberId, ts))
    return map
  }, [trustScores])

  // Filter and sort alerts
  const filteredAlerts = useMemo(() => {
    return alerts
      .filter(alert => {
        const matchesStatus = filterStatus === 'all' || alert.status === filterStatus
        const matchesRisk = filterRisk === 'all' || alert.riskLevel === filterRisk
        return matchesStatus && matchesRisk
      })
      .sort((a, b) => {
        // Sort by risk level first, then by date
        const riskOrder = { high: 0, medium: 1, low: 2 }
        if (riskOrder[a.riskLevel] !== riskOrder[b.riskLevel]) {
          return riskOrder[a.riskLevel] - riskOrder[b.riskLevel]
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
  }, [alerts, filterStatus, filterRisk])

  const stats = useMemo(() => ({
    total: alerts.length,
    open: alerts.filter(a => a.status === 'open').length,
    high: alerts.filter(a => a.riskLevel === 'high').length,
    medium: alerts.filter(a => a.riskLevel === 'medium').length
  }), [alerts])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-xl">
                  <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                At-Risk Members
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Members flagged by the AI for potential issues
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Alerts</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4">
              <p className="text-sm text-blue-600 dark:text-blue-400">Open</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.open}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/30 rounded-xl p-4">
              <p className="text-sm text-red-600 dark:text-red-400">High Risk</p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">{stats.high}</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/30 rounded-xl p-4">
              <p className="text-sm text-amber-600 dark:text-amber-400">Medium Risk</p>
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{stats.medium}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as AlertStatus | 'all')}
              className="appearance-none pl-3 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="escalated">Escalated</option>
              <option value="resolved">Resolved</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value as RiskLevel | 'all')}
              className="appearance-none pl-3 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Risk Levels</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Alert List */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="space-y-4">
          {filteredAlerts.map((alert) => {
            const member = memberMap.get(alert.memberId)
            const score = scoreMap.get(alert.memberId)
            const riskConfig = getRiskConfig(alert.riskLevel)
            const statusConfig = getStatusConfig(alert.status)
            const isExpanded = expandedAlert === alert.id

            return (
              <div
                key={alert.id}
                className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden border-l-4 ${riskConfig.borderColor}`}
              >
                {/* Alert Header */}
                <button
                  onClick={() => setExpandedAlert(isExpanded ? null : alert.id)}
                  className={`w-full px-4 sm:px-6 py-4 text-left ${riskConfig.bgHover} transition-colors`}
                >
                  <div className="flex items-start sm:items-center gap-4">
                    {/* Member Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {member?.avatar ? (
                        <img
                          src={member.avatar}
                          alt={alert.memberName}
                          className="w-10 h-10 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 font-semibold shrink-0">
                          {alert.memberName.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900 dark:text-white truncate">
                          {alert.memberName}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className={`inline-flex items-center gap-1 rounded-full text-xs font-medium px-2 py-0.5 ${riskConfig.className}`}>
                            {riskConfig.icon}
                            {riskConfig.label}
                          </span>
                          <span className={`inline-flex items-center gap-1 rounded-full text-xs font-medium px-2 py-0.5 ${statusConfig.className}`}>
                            {statusConfig.icon}
                            {statusConfig.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Score & Expand */}
                    <div className="flex items-center gap-3 shrink-0">
                      {score && (
                        <TrustScoreBadge score={score.score} trend={score.trend} />
                      )}
                      <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                  </div>

                  {/* Risk Indicators Preview */}
                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <TrendingDown className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="truncate">{alert.riskIndicators[0]}</span>
                    {alert.riskIndicators.length > 1 && (
                      <span className="text-slate-400">+{alert.riskIndicators.length - 1} more</span>
                    )}
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-4 sm:px-6 pb-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="pt-4 space-y-4">
                      {/* Risk Indicators */}
                      <div>
                        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-red-500" />
                          Risk Indicators
                        </h4>
                        <ul className="space-y-1.5">
                          {alert.riskIndicators.map((indicator, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                              {indicator}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Recommended Actions */}
                      <div>
                        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          Recommended Actions
                        </h4>
                        <ul className="space-y-1.5">
                          {alert.recommendedActions.map((action, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Alert Date */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Calendar className="w-4 h-4" />
                        Alert created: {new Date(alert.createdAt).toLocaleDateString()}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        {/* Contact Actions */}
                        <div className="flex gap-1">
                          <button
                            onClick={() => onContactMember?.(alert.memberId, 'phone')}
                            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="Call member"
                          >
                            <Phone className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onContactMember?.(alert.memberId, 'email')}
                            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="Email member"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onContactMember?.(alert.memberId, 'message')}
                            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="Message member"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex-1" />

                        {/* Status Actions */}
                        {alert.status === 'open' && (
                          <button
                            onClick={() => onAcknowledge?.(alert.id)}
                            className="px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          >
                            Acknowledge
                          </button>
                        )}
                        {(alert.status === 'open' || alert.status === 'acknowledged') && (
                          <button
                            onClick={() => onEscalate?.(alert.id)}
                            className="px-3 py-1.5 text-sm font-medium text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50 hover:bg-amber-200 dark:hover:bg-amber-900/70 rounded-lg transition-colors"
                          >
                            Escalate
                          </button>
                        )}
                        {alert.status !== 'resolved' && (
                          <button
                            onClick={() => onResolve?.(alert.id)}
                            className="px-3 py-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/50 hover:bg-emerald-200 dark:hover:bg-emerald-900/70 rounded-lg transition-colors"
                          >
                            Resolve
                          </button>
                        )}

                        <button
                          onClick={() => onViewMember?.(alert.memberId)}
                          className="px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                        >
                          View Profile
                        </button>

                        {member?.status === 'active' && (
                          <button
                            onClick={() => onSuspendMember?.(alert.memberId)}
                            className="px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <UserX className="w-4 h-4" />
                            Suspend
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {/* Empty State */}
          {filteredAlerts.length === 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 px-6 py-12 text-center">
              <Filter className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
              <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">
                No alerts found
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {filterStatus !== 'all' || filterRisk !== 'all'
                  ? 'Try adjusting your filter criteria'
                  : 'No at-risk members have been flagged'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
