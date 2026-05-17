import type { StatementsProps, Statement } from '@/../product/sections/analytics-and-reporting/types'
import { useState } from 'react'
import {
  FileText,
  Download,
  Trash2,
  Share2,
  Calendar,
  Filter,
  Plus,
  FileSpreadsheet,
  File,
  Clock,
  X
} from 'lucide-react'

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' }).format(amount)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const startMonth = startDate.toLocaleDateString('en-US', { month: 'short' })
  const endMonth = endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  return `${startMonth} - ${endMonth}`
}

function getFileIcon(format: Statement['format']) {
  switch (format) {
    case 'pdf':
      return <File className="w-5 h-5 text-red-500" />
    case 'csv':
      return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
    case 'xlsx':
      return <FileSpreadsheet className="w-5 h-5 text-indigo-500" />
    default:
      return <FileText className="w-5 h-5 text-slate-500" />
  }
}

function StatementCard({
  statement,
  onDownload,
  onDelete,
  onShare
}: {
  statement: Statement
  onDownload?: () => void
  onDelete?: () => void
  onShare?: () => void
}) {
  const typeLabels = {
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    annual: 'Annual',
    custom: 'Custom'
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-100 dark:bg-slate-700 rounded-xl group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors">
            {getFileIcon(statement.format)}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {statement.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {formatDateRange(statement.startDate, statement.endDate)}
            </p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
          statement.type === 'annual'
            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
            : statement.type === 'quarterly'
            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
            : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
        }`}>
          {typeLabels[statement.type]}
        </span>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 mb-4">
        <div>
          <p className="text-xs text-slate-400 mb-1">Contributions</p>
          <p className="font-semibold text-slate-900 dark:text-white text-sm">
            {formatCurrency(statement.summary.totalContributions)}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-1">Payouts</p>
          <p className="font-semibold text-emerald-600 dark:text-emerald-400 text-sm">
            {formatCurrency(statement.summary.totalPayoutsReceived)}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-1">Net Savings</p>
          <p className="font-semibold text-indigo-600 dark:text-indigo-400 text-sm">
            {formatCurrency(statement.summary.netSavings)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          <span>Generated {formatDate(statement.generatedAt)}</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 uppercase">
            {statement.format}
          </span>
          <span>{statement.fileSize}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onShare}
            className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
            title="Share statement"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Delete statement"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDownload}
            className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
            title="Download statement"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

function GenerateStatementModal({
  isOpen,
  onClose,
  reportTypes,
  exportFormats,
  onGenerate
}: {
  isOpen: boolean
  onClose: () => void
  reportTypes: StatementsProps['reportTypes']
  exportFormats: StatementsProps['exportFormats']
  onGenerate?: (type: string, startDate: string, endDate: string, format: string) => void
}) {
  const [selectedType, setSelectedType] = useState(reportTypes[0]?.id || '')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedFormat, setSelectedFormat] = useState('pdf')

  if (!isOpen) return null

  const handleGenerate = () => {
    onGenerate?.(selectedType, startDate, endDate, selectedFormat)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Generate Statement
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Report Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            >
              {reportTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Format */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Export Format
            </label>
            <div className="flex gap-3">
              {exportFormats.map(format => (
                <button
                  key={format.id}
                  onClick={() => setSelectedFormat(format.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                    selectedFormat === format.id
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400'
                      : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {format.id === 'pdf' && <File className="w-4 h-4" />}
                  {format.id === 'csv' && <FileSpreadsheet className="w-4 h-4" />}
                  {format.id === 'xlsx' && <FileSpreadsheet className="w-4 h-4" />}
                  <span className="font-medium uppercase text-sm">{format.id}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={!selectedType || !startDate || !endDate}
            className="px-6 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-xl transition-colors"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  )
}

export function Statements({
  statements,
  reportTypes,
  exportFormats,
  onGenerateStatement,
  onDownloadStatement,
  onDeleteStatement,
  onShareStatement
}: StatementsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterType, setFilterType] = useState<string>('all')

  const filteredStatements = filterType === 'all'
    ? statements
    : statements.filter(s => s.type === filterType)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Statements
            </h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Download and manage your transaction statements
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" />
            Generate Statement
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Filter className="w-4 h-4" />
            <span>Filter:</span>
          </div>
          <div className="flex gap-2">
            {['all', 'monthly', 'quarterly', 'annual', 'custom'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterType === type
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Statements Grid */}
        {filteredStatements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStatements.map(statement => (
              <StatementCard
                key={statement.id}
                statement={statement}
                onDownload={() => onDownloadStatement?.(statement.id)}
                onDelete={() => onDeleteStatement?.(statement.id)}
                onShare={() => onShareStatement?.(statement.id, '')}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No statements found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              {filterType === 'all'
                ? "You haven't generated any statements yet."
                : `No ${filterType} statements available.`}
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              Generate Your First Statement
            </button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-amber-50 dark:from-indigo-900/20 dark:to-amber-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
            Quick Generate
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onGenerateStatement?.('monthly', '', '', 'pdf')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
            >
              <Calendar className="w-4 h-4 text-indigo-500" />
              Last Month
            </button>
            <button
              onClick={() => onGenerateStatement?.('quarterly', '', '', 'pdf')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
            >
              <Calendar className="w-4 h-4 text-amber-500" />
              Last Quarter
            </button>
            <button
              onClick={() => onGenerateStatement?.('annual', '', '', 'pdf')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
            >
              <Calendar className="w-4 h-4 text-emerald-500" />
              Year-to-Date
            </button>
          </div>
        </div>
      </div>

      {/* Generate Statement Modal */}
      <GenerateStatementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reportTypes={reportTypes}
        exportFormats={exportFormats}
        onGenerate={onGenerateStatement}
      />
    </div>
  )
}
