import { useState } from 'react'
import type { AuditReportGeneratorProps, AuditReport, Fund, ReportType, ReportFormat, ReportConfig } from '../types'

function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const reportTypeLabels: Record<ReportType, string> = {
  annual_summary: 'Annual Summary',
  transaction_detail: 'Transaction Detail',
  reconciliation: 'Reconciliation Report',
  compliance: 'Compliance Report',
}

const reportTypeDescriptions: Record<ReportType, string> = {
  annual_summary: 'Year-end financial overview with totals and key metrics',
  transaction_detail: 'Complete transaction-level breakdown for audit',
  reconciliation: 'Reconciliation history and discrepancy resolutions',
  compliance: 'Regulatory compliance documentation',
}

const formatLabels: Record<ReportFormat, string> = {
  pdf: 'PDF',
  excel: 'Excel',
  csv: 'CSV',
}

const statusColors = {
  pending: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
  processing: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

function ReportCard({
  report,
  onDownload,
}: {
  report: AuditReport
  onDownload?: (reportId: string) => void
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-white truncate">{report.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[report.status]}`}>
              {report.status}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {reportTypeLabels[report.reportType]}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded">
            {formatLabels[report.format]}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div>
          <p className="text-slate-500 dark:text-slate-400">Date Range</p>
          <p className="font-medium text-slate-900 dark:text-white">
            {formatDate(report.dateRangeStart)} - {formatDate(report.dateRangeEnd)}
          </p>
        </div>
        <div>
          <p className="text-slate-500 dark:text-slate-400">Generated</p>
          <p className="font-medium text-slate-900 dark:text-white">
            {formatDateTime(report.generatedAt)}
          </p>
        </div>
      </div>

      {report.summary && (
        <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl mb-4">
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <p className="text-slate-500 dark:text-slate-400">Contributions</p>
              <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(report.summary.totalContributions)}
              </p>
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400">Payouts</p>
              <p className="font-semibold text-slate-900 dark:text-white">
                {formatCurrency(report.summary.totalPayouts)}
              </p>
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400">Net Change</p>
              <p className={`font-semibold ${
                report.summary.netChange >= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {report.summary.netChange >= 0 ? '+' : ''}{formatCurrency(report.summary.netChange)}
              </p>
            </div>
          </div>
        </div>
      )}

      {report.status === 'processing' && report.estimatedCompletionAt && (
        <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 mb-4">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Generating report...</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span>By {report.generatedByName}</span>
          {report.fileSize && (
            <>
              <span>·</span>
              <span>{formatFileSize(report.fileSize)}</span>
            </>
          )}
        </div>
        {report.status === 'completed' && report.fileUrl && (
          <button
            onClick={() => onDownload?.(report.id)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
        )}
      </div>
    </div>
  )
}

function GenerateReportForm({
  funds,
  onGenerate,
  onCancel,
}: {
  funds: Fund[]
  onGenerate?: (config: ReportConfig) => void
  onCancel: () => void
}) {
  const [reportType, setReportType] = useState<ReportType>('annual_summary')
  const [selectedFunds, setSelectedFunds] = useState<string[]>([])
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [format, setFormat] = useState<ReportFormat>('pdf')

  const handleSubmit = () => {
    if (selectedFunds.length === 0 || !dateFrom || !dateTo) return

    onGenerate?.({
      reportType,
      fundIds: selectedFunds,
      dateRangeStart: dateFrom,
      dateRangeEnd: dateTo,
      format,
    })
  }

  const toggleFund = (fundId: string) => {
    setSelectedFunds((prev) =>
      prev.includes(fundId) ? prev.filter((id) => id !== fundId) : [...prev, fundId]
    )
  }

  const selectAllFunds = () => {
    setSelectedFunds(funds.map((f) => f.id))
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Generate New Report</h2>

      <div className="space-y-6">
        {/* Report Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Report Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(Object.keys(reportTypeLabels) as ReportType[]).map((type) => (
              <button
                key={type}
                onClick={() => setReportType(type)}
                className={`p-4 rounded-xl border-2 text-left transition-colors ${
                  reportType === type
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <p className={`font-medium ${
                  reportType === type
                    ? 'text-indigo-700 dark:text-indigo-400'
                    : 'text-slate-900 dark:text-white'
                }`}>
                  {reportTypeLabels[type]}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {reportTypeDescriptions[type]}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Fund Selection */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Select Funds
            </label>
            <button
              onClick={selectAllFunds}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
            >
              Select All
            </button>
          </div>
          <div className="space-y-2">
            {funds.map((fund) => (
              <label
                key={fund.id}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  selectedFunds.includes(fund.id)
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedFunds.includes(fund.id)}
                  onChange={() => toggleFund(fund.id)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                />
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">{fund.circleName}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Balance: {formatCurrency(fund.totalBalance, fund.currency)}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              From Date
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              To Date
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Export Format */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Export Format
          </label>
          <div className="flex gap-3">
            {(Object.keys(formatLabels) as ReportFormat[]).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  format === fmt
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {formatLabels[fmt]}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSubmit}
            disabled={selectedFunds.length === 0 || !dateFrom || !dateTo}
            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
          >
            Generate Report
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export function AuditReportGenerator({
  funds,
  reports,
  onGenerateReport,
  onDownloadReport,
  onScheduleReport,
}: AuditReportGeneratorProps) {
  const [showForm, setShowForm] = useState(false)

  const handleGenerate = (config: ReportConfig) => {
    onGenerateReport?.(config)
    setShowForm(false)
  }

  const completedReports = reports.filter((r) => r.status === 'completed')
  const processingReports = reports.filter((r) => r.status === 'processing')

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Audit Reports
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Generate comprehensive financial reports for compliance
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-sm font-medium text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Report
            </button>
          )}
        </div>

        {/* Report Form */}
        {showForm && (
          <div className="mb-8">
            <GenerateReportForm
              funds={funds}
              onGenerate={handleGenerate}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Processing Reports */}
        {processingReports.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              In Progress
            </h2>
            <div className="space-y-4">
              {processingReports.map((report) => (
                <ReportCard key={report.id} report={report} onDownload={onDownloadReport} />
              ))}
            </div>
          </div>
        )}

        {/* Report History */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Report History
          </h2>
          {completedReports.length > 0 ? (
            <div className="space-y-4">
              {completedReports.map((report) => (
                <ReportCard key={report.id} report={report} onDownload={onDownloadReport} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
              <svg className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg font-medium text-slate-900 dark:text-white">No reports generated yet</p>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Click "New Report" to generate your first audit report
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
