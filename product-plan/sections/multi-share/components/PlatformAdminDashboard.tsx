'use client'

import { useState } from 'react'
import type {
  PlatformMetrics,
  PlatformConfig,
  ComplianceAlert,
} from '../types'

interface PlatformAdminDashboardProps {
  metrics: PlatformMetrics
  config: PlatformConfig
  alerts: ComplianceAlert[]
  onPeriodChange?: (period: string) => void
  onExportReport?: (type: 'summary' | 'detailed' | 'compliance') => void
  onSelectAlert?: (alertId: string) => void
  onResolveAlert?: (alertId: string, resolution: string) => void
  onUpdateConfig?: (updates: Partial<PlatformConfig>) => void
}

export function PlatformAdminDashboard({
  metrics,
  config,
  alerts,
  onPeriodChange,
  onExportReport,
  onSelectAlert,
  onResolveAlert,
  onUpdateConfig,
}: PlatformAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'config'>('overview')
  const [selectedPeriod, setSelectedPeriod] = useState(metrics.period)

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period)
    onPeriodChange?.(period)
  }

  const openAlerts = alerts.filter(a => a.status === 'open' || a.status === 'investigating')
  const criticalAlerts = openAlerts.filter(a => a.severity === 'critical' || a.severity === 'high')

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Multi-Share Administration
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Platform-wide multi-share monitoring and configuration
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => handlePeriodChange(e.target.value)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="2026-01">January 2026</option>
                <option value="2025-12">December 2025</option>
                <option value="2025-11">November 2025</option>
              </select>

              <div className="relative">
                <button
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert Banner */}
        {criticalAlerts.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-red-900 dark:text-red-100">
                  {criticalAlerts.length} critical alert{criticalAlerts.length !== 1 ? 's' : ''} require attention
                </p>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Review suspicious activity patterns immediately
                </p>
              </div>
              <button
                onClick={() => setActiveTab('alerts')}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
              >
                View Alerts
              </button>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-800 mb-6">
          <nav className="flex gap-8">
            {(['overview', 'alerts', 'config'] as const).map((tab) => (
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
                {tab === 'overview' && 'Overview'}
                {tab === 'alerts' && (
                  <span className="flex items-center gap-2">
                    Compliance Alerts
                    {openAlerts.length > 0 && (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs">
                        {openAlerts.length}
                      </span>
                    )}
                  </span>
                )}
                {tab === 'config' && 'Configuration'}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                <p className="text-sm text-slate-600 dark:text-slate-400">Multi-Share Circles</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">
                    {metrics.overview.multiShareEnabledCircles}
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-500">
                    / {metrics.overview.totalCircles}
                  </span>
                </div>
                <p className="mt-1 text-sm text-indigo-600 dark:text-indigo-400">
                  {metrics.overview.multiShareAdoptionRate}% adoption
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Platform Shares</p>
                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                  {metrics.overview.totalPlatformShares.toLocaleString()}
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-500">
                  Avg {metrics.overview.averageSharesPerMember} per member
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                <p className="text-sm text-slate-600 dark:text-slate-400">Assets Under Management</p>
                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                  CHF {(metrics.overview.totalAUM / 1000000).toFixed(1)}M
                </p>
                <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">
                  +{metrics.trends.monthlyShareGrowth}% this month
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                <p className="text-sm text-slate-600 dark:text-slate-400">Share Request Approval</p>
                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                  {metrics.shareRequests.approvalRate}%
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-500">
                  {metrics.shareRequests.pendingRequests} pending
                </p>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Request Breakdown */}
              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Share Requests</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600 dark:text-slate-400">Increase Requests</span>
                      <span className="font-medium text-slate-900 dark:text-white">{metrics.shareRequests.increaseRequests}</span>
                    </div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${(metrics.shareRequests.increaseRequests / metrics.shareRequests.totalRequests) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600 dark:text-slate-400">Reduction Requests</span>
                      <span className="font-medium text-slate-900 dark:text-white">{metrics.shareRequests.reductionRequests}</span>
                    </div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${(metrics.shareRequests.reductionRequests / metrics.shareRequests.totalRequests) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600 dark:text-slate-400">Transfer Requests</span>
                      <span className="font-medium text-slate-900 dark:text-white">{metrics.shareRequests.transferRequests}</span>
                    </div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${(metrics.shareRequests.transferRequests / metrics.shareRequests.totalRequests) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400">
                  Average processing time: {metrics.shareRequests.averageProcessingTimeHours} hours
                </div>
              </div>

              {/* Risk Metrics */}
              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Risk & Concentration</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">High Concentration Circles</p>
                      <p className="text-xs text-slate-500 dark:text-slate-500">Single member holds &gt;30% shares</p>
                    </div>
                    <span className={`
                      text-2xl font-bold
                      ${metrics.concentration.circlesWithHighConcentration > 10
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-amber-600 dark:text-amber-400'
                      }
                    `}>
                      {metrics.concentration.circlesWithHighConcentration}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Avg Gini Coefficient</p>
                      <p className="text-xs text-slate-500 dark:text-slate-500">Share distribution equality</p>
                    </div>
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">
                      {metrics.concentration.averageGiniCoefficient}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Multi-Share Default Rate</p>
                      <p className="text-xs text-slate-500 dark:text-slate-500">vs {metrics.defaults.singleShareDefaultRate}% single-share</p>
                    </div>
                    <span className={`
                      text-2xl font-bold
                      ${metrics.defaults.multiShareDefaultRate > metrics.defaults.singleShareDefaultRate
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                      }
                    `}>
                      {metrics.defaults.multiShareDefaultRate}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trends */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Monthly Trends</h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">Share Growth</p>
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    +{metrics.trends.monthlyShareGrowth}%
                  </p>
                </div>
                <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                  <p className="text-sm text-indigo-700 dark:text-indigo-300">New Multi-Share Circles</p>
                  <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                    {metrics.trends.newMultiShareCircles}
                  </p>
                </div>
                <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                  <p className="text-sm text-amber-700 dark:text-amber-300">Members Adding Shares</p>
                  <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                    {metrics.trends.membersAddingShares}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-12 border border-slate-200 dark:border-slate-800 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-slate-900 dark:text-white">All Clear</p>
                <p className="text-slate-600 dark:text-slate-400 mt-1">No compliance alerts at this time</p>
              </div>
            ) : (
              alerts.map((alert) => {
                const severityColors = {
                  critical: 'border-red-500 bg-red-50 dark:bg-red-900/20',
                  high: 'border-orange-500 bg-orange-50 dark:bg-orange-900/20',
                  medium: 'border-amber-500 bg-amber-50 dark:bg-amber-900/20',
                  low: 'border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-800',
                }[alert.severity]

                const statusColors = {
                  open: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                  investigating: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
                  resolved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
                  dismissed: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
                }[alert.status]

                return (
                  <div
                    key={alert.id}
                    onClick={() => onSelectAlert?.(alert.id)}
                    className={`
                      bg-white dark:bg-slate-900 rounded-xl p-6 border-l-4 cursor-pointer
                      hover:shadow-lg transition-shadow
                      ${severityColors}
                    `}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`
                            inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium uppercase
                            ${statusColors}
                          `}>
                            {alert.status}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-500 uppercase">
                            {alert.severity} severity
                          </span>
                        </div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">{alert.title}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{alert.description}</p>

                        {alert.memberName && (
                          <div className="mt-3 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-medium">
                              {alert.memberName.charAt(0)}
                            </div>
                            <span className="text-sm text-slate-700 dark:text-slate-300">{alert.memberName}</span>
                            <span className="text-sm text-slate-500 dark:text-slate-500">
                              Trust Score: {alert.memberTrustScore}
                            </span>
                          </div>
                        )}

                        {alert.circleName && (
                          <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                            Circle: {alert.circleName}
                          </p>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Detected {new Date(alert.detectedAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-500">
                          Pattern Score: {(alert.details.patternScore * 100).toFixed(0)}%
                        </p>
                        {alert.assignedTo && (
                          <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">
                            Assigned to admin
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Notes */}
                    {alert.notes && alert.notes.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <p className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wide mb-2">Latest Note</p>
                        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg">
                          <p className="text-sm text-slate-700 dark:text-slate-300">{alert.notes[alert.notes.length - 1].content}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                            — {alert.notes[alert.notes.length - 1].authorName}, {new Date(alert.notes[alert.notes.length - 1].timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Resolution */}
                    {alert.resolution && (
                      <div className="mt-4 p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Resolution:</p>
                        <p className="text-sm text-emerald-700 dark:text-emerald-300">{alert.resolution}</p>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* Config Tab */}
        {activeTab === 'config' && (
          <div className="space-y-6">
            {/* Feature Toggle */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Multi-Share Feature</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Enable or disable multi-share functionality platform-wide
                  </p>
                </div>
                <button
                  onClick={() => onUpdateConfig?.({ multiShareFeatureEnabled: !config.multiShareFeatureEnabled })}
                  className={`
                    relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                    ${config.multiShareFeatureEnabled ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}
                  `}
                >
                  <span
                    className={`
                      pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                      ${config.multiShareFeatureEnabled ? 'translate-x-5' : 'translate-x-0'}
                    `}
                  />
                </button>
              </div>
            </div>

            {/* Limits Configuration */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Global Limits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Max Shares Per Member
                  </label>
                  <input
                    type="number"
                    value={config.globalMaxSharesPerMember}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    readOnly
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    Maximum shares any member can hold in a single circle
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Max Shares Per Circle
                  </label>
                  <input
                    type="number"
                    value={config.globalMaxSharesPerCircle}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    readOnly
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    Maximum total shares allowed in any circle
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Score Tiers */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Trust Score Requirements</h3>
              <div className="space-y-3">
                {config.trustScoreTiers.map((tier, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {tier.minShares}-{tier.maxShares} Shares
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Minimum Trust Score:</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{tier.minTrustScore}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Toggles */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Feature Options</h3>
              <div className="space-y-4">
                {[
                  { key: 'emergencyReductionEnabled', label: 'Emergency Share Reduction', description: 'Allow members to request expedited share reductions for hardship' },
                  { key: 'shareTransfersEnabled', label: 'Share Transfers', description: 'Allow members to transfer shares to other circle members' },
                  { key: 'waitlistEnabled', label: 'Share Waitlist', description: 'Enable waitlist when circles reach share capacity' },
                ].map((feature) => (
                  <div key={feature.key} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{feature.label}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{feature.description}</p>
                    </div>
                    <div className={`
                      w-3 h-3 rounded-full
                      ${config[feature.key as keyof PlatformConfig] ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}
                    `} />
                  </div>
                ))}
              </div>
            </div>

            {/* Last Updated */}
            <div className="text-sm text-slate-500 dark:text-slate-500 text-right">
              Last updated: {new Date(config.updatedAt).toLocaleString()} by {config.updatedBy}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
