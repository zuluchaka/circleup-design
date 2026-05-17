import { useState } from 'react'
import type { ComplianceDashboardProps, AlertSeverity, AlertStatus, AlertType } from '../types'

const severityConfig: Record<AlertSeverity, { label: string; color: string; bg: string; border: string }> = {
  low: { label: 'Low', color: 'text-slate-600', bg: 'bg-slate-100 dark:bg-slate-800', border: 'border-l-slate-400' },
  medium: { label: 'Medium', color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30', border: 'border-l-amber-400' },
  high: { label: 'High', color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30', border: 'border-l-orange-500' },
  critical: { label: 'Critical', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30', border: 'border-l-red-500' },
}

const statusConfig: Record<AlertStatus, { label: string; color: string; bg: string }> = {
  open: { label: 'Open', color: 'text-red-700', bg: 'bg-red-100 dark:bg-red-900/30' },
  investigating: { label: 'Investigating', color: 'text-amber-700', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  resolved: { label: 'Resolved', color: 'text-emerald-700', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  false_positive: { label: 'False Positive', color: 'text-slate-600', bg: 'bg-slate-100 dark:bg-slate-800' },
  escalated: { label: 'Escalated', color: 'text-purple-700', bg: 'bg-purple-100 dark:bg-purple-900/30' },
}

const alertTypeIcons: Record<AlertType, string> = {
  aml: '🔍',
  fraud: '🚨',
  velocity: '⚡',
  pattern: '📊',
  kyc: '👤',
  sanction: '🚫',
}

export function ComplianceDashboard({
  alerts,
  gdprRequests,
  reports,
  onAlertClick,
  onRequestClick,
  onGenerateReport,
}: ComplianceDashboardProps) {
  const [activeTab, setActiveTab] = useState<'alerts' | 'gdpr' | 'reports'>('alerts')
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<AlertType | 'all'>('all')

  const openAlerts = alerts.filter(a => a.status === 'open' || a.status === 'investigating')
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && a.status !== 'resolved')
  const pendingGdpr = gdprRequests.filter(r => r.status !== 'completed' && r.status !== 'rejected')

  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter
    const matchesType = typeFilter === 'all' || alert.type === typeFilter
    return matchesSeverity && matchesType
  })

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Compliance Dashboard</h1>
              <p className="text-slate-400 mt-1">Monitor AML, KYC, and regulatory compliance</p>
            </div>
            {criticalAlerts.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-300 font-medium">{criticalAlerts.length} Critical Alert{criticalAlerts.length > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold text-white">{openAlerts.length}</div>
              <div className="text-slate-300 text-sm">Open Alerts</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold text-red-400">{criticalAlerts.length}</div>
              <div className="text-slate-300 text-sm">Critical</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold text-white">{pendingGdpr.length}</div>
              <div className="text-slate-300 text-sm">GDPR Requests</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold text-white">{reports.filter(r => r.status === 'pending_review').length}</div>
              <div className="text-slate-300 text-sm">Reports Pending</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6 bg-slate-800 rounded-lg p-1 w-fit">
            {(['alerts', 'gdpr', 'reports'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-white text-slate-900'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {tab === 'alerts' ? 'Compliance Alerts' : tab === 'gdpr' ? 'GDPR Requests' : 'Regulatory Reports'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Severity</label>
                <select
                  value={severityFilter}
                  onChange={e => setSeverityFilter(e.target.value as AlertSeverity | 'all')}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Type</label>
                <select
                  value={typeFilter}
                  onChange={e => setTypeFilter(e.target.value as AlertType | 'all')}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Types</option>
                  <option value="aml">AML</option>
                  <option value="fraud">Fraud</option>
                  <option value="velocity">Velocity</option>
                  <option value="pattern">Pattern</option>
                  <option value="kyc">KYC</option>
                  <option value="sanction">Sanction</option>
                </select>
              </div>
            </div>

            {/* Alerts List */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredAlerts.map(alert => (
                  <div
                    key={alert.id}
                    onClick={() => onAlertClick?.(alert.id)}
                    className={`p-5 border-l-4 ${severityConfig[alert.severity].border} cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl">
                          {alertTypeIcons[alert.type]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-bold uppercase ${severityConfig[alert.severity].color}`}>
                              {alert.type}
                            </span>
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs text-slate-500">Risk Score: {alert.riskScore}%</span>
                          </div>
                          <p className="font-medium text-slate-900 dark:text-white">{alert.description}</p>
                          {alert.userName && (
                            <p className="text-sm text-slate-500 mt-1">
                              User: <span className="font-medium text-slate-700 dark:text-slate-300">{alert.userName}</span>
                              {alert.transactionAmount && (
                                <span className="ml-2">
                                  Amount: <span className="font-medium">CHF {alert.transactionAmount.toLocaleString()}</span>
                                </span>
                              )}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-2 mt-2">
                            {alert.indicators.map((indicator, i) => (
                              <span key={i} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs rounded">
                                {indicator}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[alert.status].bg} ${statusConfig[alert.status].color}`}>
                          {statusConfig[alert.status].label}
                        </span>
                        <span className="text-xs text-slate-400">{formatTimeAgo(alert.createdAt)}</span>
                        {alert.assignedToName && (
                          <span className="text-xs text-slate-500">→ {alert.assignedToName}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* GDPR Tab */}
        {activeTab === 'gdpr' && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-4 px-5 text-xs font-semibold text-slate-500 uppercase">Request</th>
                  <th className="text-left py-4 px-5 text-xs font-semibold text-slate-500 uppercase">User</th>
                  <th className="text-left py-4 px-5 text-xs font-semibold text-slate-500 uppercase">Type</th>
                  <th className="text-left py-4 px-5 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="text-left py-4 px-5 text-xs font-semibold text-slate-500 uppercase">Deadline</th>
                  <th className="text-left py-4 px-5 text-xs font-semibold text-slate-500 uppercase">Assigned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {gdprRequests.map(request => {
                  const isOverdue = new Date(request.deadline) < new Date() && request.status !== 'completed'
                  return (
                    <tr
                      key={request.id}
                      onClick={() => onRequestClick?.(request.id)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                    >
                      <td className="py-4 px-5">
                        <p className="font-medium text-slate-900 dark:text-white">#{request.id.slice(-6)}</p>
                        <p className="text-xs text-slate-500">{formatDate(request.createdAt)}</p>
                      </td>
                      <td className="py-4 px-5">
                        <p className="font-medium text-slate-900 dark:text-white">{request.userName}</p>
                        <p className="text-xs text-slate-500">{request.userEmail}</p>
                      </td>
                      <td className="py-4 px-5">
                        <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-medium rounded capitalize">
                          {request.requestType}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          request.status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                          request.status === 'processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                          'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <span className={isOverdue ? 'text-red-600 font-medium' : 'text-slate-600 dark:text-slate-400'}>
                          {formatDate(request.deadline)}
                          {isOverdue && <span className="ml-1 text-xs">⚠️</span>}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-slate-600 dark:text-slate-400">
                        {request.assignedTo || '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => onGenerateReport?.('ad_hoc')}
                className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Generate Report
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-4 px-5 text-xs font-semibold text-slate-500 uppercase">Report</th>
                    <th className="text-left py-4 px-5 text-xs font-semibold text-slate-500 uppercase">Period</th>
                    <th className="text-left py-4 px-5 text-xs font-semibold text-slate-500 uppercase">Type</th>
                    <th className="text-left py-4 px-5 text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="text-left py-4 px-5 text-xs font-semibold text-slate-500 uppercase">Due Date</th>
                    <th className="text-left py-4 px-5 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {reports.map(report => (
                    <tr key={report.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-4 px-5">
                        <p className="font-medium text-slate-900 dark:text-white">{report.name}</p>
                      </td>
                      <td className="py-4 px-5 text-slate-600 dark:text-slate-400">
                        {formatDate(report.reportingPeriod.start)} - {formatDate(report.reportingPeriod.end)}
                      </td>
                      <td className="py-4 px-5">
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium rounded capitalize">
                          {report.type}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          report.status === 'submitted' || report.status === 'accepted' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                          report.status === 'pending_review' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                          report.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {report.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-slate-600 dark:text-slate-400">
                        {formatDate(report.dueDate)}
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex gap-2">
                          {report.fileUrl && (
                            <button className="px-3 py-1.5 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors">
                              Download
                            </button>
                          )}
                          <button className="px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
