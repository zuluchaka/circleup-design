import { useState } from 'react'
import {
  TrendingUp, TrendingDown, AlertTriangle, DollarSign,
  Phone, Mail, ArrowUpRight, FileText, Download, Users,
  AlertCircle, Clock, CheckCircle, ChevronRight
} from 'lucide-react'
import type { PortfolioMetrics, CollectionItem, EarlyWarningIndicator, RiskLevel } from '../types'

export interface PortfolioDashboardProps {
  metrics: PortfolioMetrics
  onViewCollectionItem?: (itemId: string) => void
  onCollectionAction?: (itemId: string, action: 'call' | 'email' | 'escalate' | 'write_off') => void
  onViewWarningDetails?: (warningId: string) => void
  onExportReport?: (format: 'pdf' | 'csv' | 'excel') => void
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-CH', { style: 'currency', currency: 'CHF' }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function MetricCard({
  title,
  value,
  subValue,
  icon,
  trend,
  trendLabel,
}: {
  title: string
  value: string
  subValue?: string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendLabel?: string
}) {
  return (
    <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
          {icon}
        </div>
        {trend && trendLabel && (
          <span className={`flex items-center gap-1 text-xs font-medium ${
            trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' :
            trend === 'down' ? 'text-red-600 dark:text-red-400' :
            'text-slate-500'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> :
             trend === 'down' ? <TrendingDown className="w-3 h-3" /> : null}
            {trendLabel}
          </span>
        )}
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
      {subValue && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subValue}</p>
      )}
    </div>
  )
}

function RiskDistributionChart({ distribution }: { distribution: { low: { count: number; amount: number; percentage: number }; medium: { count: number; amount: number; percentage: number }; high: { count: number; amount: number; percentage: number } } }) {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Low Risk</span>
          </div>
          <span className="text-sm font-medium text-slate-900 dark:text-white">
            {distribution.low.count} loans ({distribution.low.percentage.toFixed(1)}%)
          </span>
        </div>
        <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full"
            style={{ width: `${distribution.low.percentage}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {formatCurrency(distribution.low.amount)}
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Medium Risk</span>
          </div>
          <span className="text-sm font-medium text-slate-900 dark:text-white">
            {distribution.medium.count} loans ({distribution.medium.percentage.toFixed(1)}%)
          </span>
        </div>
        <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 rounded-full"
            style={{ width: `${distribution.medium.percentage}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {formatCurrency(distribution.medium.amount)}
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm text-slate-700 dark:text-slate-300">High Risk</span>
          </div>
          <span className="text-sm font-medium text-slate-900 dark:text-white">
            {distribution.high.count} loans ({distribution.high.percentage.toFixed(1)}%)
          </span>
        </div>
        <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-500 rounded-full"
            style={{ width: `${distribution.high.percentage}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {formatCurrency(distribution.high.amount)}
        </p>
      </div>
    </div>
  )
}

function CollectionQueueItem({
  item,
  onView,
  onAction,
}: {
  item: CollectionItem
  onView: () => void
  onAction: (action: 'call' | 'email' | 'escalate' | 'write_off') => void
}) {
  const statusStyles: Record<string, { bg: string; text: string }> = {
    first_notice_sent: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
    second_notice_sent: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400' },
    payment_plan_offered: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-400' },
    payment_plan_active: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
    escalated: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400' },
    legal_action: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400' },
  }

  const style = statusStyles[item.status] || statusStyles.first_notice_sent
  const displayStatus = item.status.replace(/_/g, ' ')

  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-medium text-slate-900 dark:text-white">{item.borrowerName}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Loan {item.loanId}</p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text} capitalize`}>
          {displayStatus}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Amount</p>
          <p className="text-sm font-semibold text-red-600 dark:text-red-400">{formatCurrency(item.amount)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Days Overdue</p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.daysOverdue}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Last Contact</p>
          <p className="text-sm font-medium text-slate-900 dark:text-white">{formatDate(item.lastContactAt)}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onAction('call')}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        >
          <Phone className="w-4 h-4" />
          Call
        </button>
        <button
          onClick={() => onAction('email')}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        >
          <Mail className="w-4 h-4" />
          Email
        </button>
        <button
          onClick={onView}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function EarlyWarningItem({
  warning,
  onView,
}: {
  warning: EarlyWarningIndicator
  onView: () => void
}) {
  const riskColors: Record<RiskLevel, { bg: string; text: string; border: string }> = {
    low: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
    medium: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
    high: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', border: 'border-red-200 dark:border-red-800' },
  }

  const indicatorLabels: Record<string, string> = {
    missed_circle_contribution: 'Missed circle contribution',
    credit_score_decline: 'Credit score decline',
    payment_pattern_change: 'Payment pattern change',
    reduced_engagement: 'Reduced engagement',
  }

  const colors = riskColors[warning.riskLevel]

  return (
    <button
      onClick={onView}
      className={`w-full p-4 rounded-xl border text-left transition-colors hover:shadow-md ${colors.bg} ${colors.border}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className={`w-4 h-4 ${colors.text}`} />
          <span className={`text-sm font-medium ${colors.text}`}>
            {indicatorLabels[warning.indicator] || warning.indicator}
          </span>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${colors.bg} ${colors.text}`}>
          {warning.riskLevel}
        </span>
      </div>
      <p className="font-medium text-slate-900 dark:text-white">{warning.borrowerName}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
        Detected {formatDate(warning.detectedAt)}
      </p>
    </button>
  )
}

export function PortfolioDashboard({
  metrics,
  onViewCollectionItem,
  onCollectionAction,
  onViewWarningDetails,
  onExportReport,
}: PortfolioDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'collections' | 'warnings'>('overview')

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Portfolio Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Monitor loan portfolio health, risk, and collections
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onExportReport?.('pdf')}
            className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Outstanding"
          value={formatCurrency(metrics.totalLoansOutstanding + metrics.totalAdvancesOutstanding)}
          subValue={`${metrics.totalActiveLoans} loans, ${metrics.totalActiveAdvances} advances`}
          icon={<DollarSign className="w-5 h-5 text-slate-600 dark:text-slate-400" />}
        />
        <MetricCard
          title="Average Loan"
          value={formatCurrency(metrics.averageLoanAmount)}
          subValue={`${metrics.averageInterestRate.toFixed(1)}% avg rate`}
          icon={<FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />}
        />
        <MetricCard
          title="Delinquency Rate"
          value={`${metrics.delinquencyRate.toFixed(1)}%`}
          subValue={formatCurrency(metrics.collectionsAmount) + ' in collections'}
          icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
          trend={metrics.delinquencyRate > 3 ? 'down' : 'up'}
          trendLabel={metrics.delinquencyRate > 3 ? 'Above target' : 'On track'}
        />
        <MetricCard
          title="Default Rate"
          value={`${metrics.defaultRate.toFixed(1)}%`}
          subValue={formatCurrency(metrics.writeOffsYTD) + ' YTD write-offs'}
          icon={<AlertCircle className="w-5 h-5 text-red-500" />}
          trend={metrics.defaultRate > 1 ? 'down' : 'up'}
          trendLabel={metrics.defaultRate > 1 ? 'Elevated' : 'Healthy'}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'collections', label: 'Collections', badge: metrics.collectionQueue.length },
          { id: 'warnings', label: 'Early Warnings', badge: metrics.earlyWarningIndicators.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {tab.label}
            {tab.badge ? (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id
                  ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
              }`}>
                {tab.badge}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Risk Distribution */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Risk Distribution</h3>
            <RiskDistributionChart distribution={metrics.riskDistribution} />
          </div>

          {/* Quick Stats */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Portfolio Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <span className="text-slate-600 dark:text-slate-400">Active Loans</span>
                <span className="font-semibold text-slate-900 dark:text-white">{metrics.totalActiveLoans}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <span className="text-slate-600 dark:text-slate-400">Loan Outstanding</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(metrics.totalLoansOutstanding)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <span className="text-slate-600 dark:text-slate-400">Active Advances</span>
                <span className="font-semibold text-slate-900 dark:text-white">{metrics.totalActiveAdvances}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <span className="text-slate-600 dark:text-slate-400">Advances Outstanding</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(metrics.totalAdvancesOutstanding)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <span className="text-amber-700 dark:text-amber-400">In Collections</span>
                <span className="font-semibold text-amber-700 dark:text-amber-400">{formatCurrency(metrics.collectionsAmount)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <span className="text-red-700 dark:text-red-400">YTD Write-offs</span>
                <span className="font-semibold text-red-700 dark:text-red-400">{formatCurrency(metrics.writeOffsYTD)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'collections' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-500 dark:text-slate-400">
              {metrics.collectionQueue.length} accounts in collection queue
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.collectionQueue.map(item => (
              <CollectionQueueItem
                key={item.id}
                item={item}
                onView={() => onViewCollectionItem?.(item.id)}
                onAction={(action) => onCollectionAction?.(item.id, action)}
              />
            ))}
          </div>
          {metrics.collectionQueue.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Collection queue empty</h3>
              <p className="text-slate-500 dark:text-slate-400">No accounts currently in collections</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'warnings' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-500 dark:text-slate-400">
              {metrics.earlyWarningIndicators.length} early warning signals detected
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.earlyWarningIndicators.map(warning => (
              <EarlyWarningItem
                key={warning.id}
                warning={warning}
                onView={() => onViewWarningDetails?.(warning.id)}
              />
            ))}
          </div>
          {metrics.earlyWarningIndicators.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No warnings</h3>
              <p className="text-slate-500 dark:text-slate-400">All borrowers are showing healthy behavior</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
