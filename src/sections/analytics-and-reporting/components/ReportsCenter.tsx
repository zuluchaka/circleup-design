import type { ReportsCenterProps, ScheduledReport } from '@/../product/sections/analytics-and-reporting/types'
import { useState } from 'react'
import {
  FileText,
  Plus,
  Edit3,
  Trash2,
  Play,
  Pause,
  Calendar,
  Clock,
  Mail,
  RefreshCw,
  CheckCircle2,
  X,
  ChevronRight,
  Settings
} from 'lucide-react'

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getReportTypeLabel(type: ScheduledReport['type']): string {
  const labels: Record<ScheduledReport['type'], string> = {
    personal_statement: 'Personal Statement',
    circle_health: 'Circle Health',
    contribution_summary: 'Contribution Summary',
    association_summary: 'Association Summary',
    compliance: 'Compliance Report',
    federation_overview: 'Federation Overview'
  }
  return labels[type]
}

function getFrequencyLabel(frequency: ScheduledReport['frequency']): string {
  const labels: Record<ScheduledReport['frequency'], string> = {
    weekly: 'Weekly',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    annually: 'Annually'
  }
  return labels[frequency]
}

function getReportTypeIcon(type: ScheduledReport['type']) {
  switch (type) {
    case 'personal_statement':
      return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500'
    case 'circle_health':
      return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500'
    case 'contribution_summary':
      return 'bg-amber-100 dark:bg-amber-900/30 text-amber-500'
    case 'association_summary':
      return 'bg-purple-100 dark:bg-purple-900/30 text-purple-500'
    case 'compliance':
      return 'bg-red-100 dark:bg-red-900/30 text-red-500'
    case 'federation_overview':
      return 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-500'
    default:
      return 'bg-slate-100 dark:bg-slate-700 text-slate-500'
  }
}

function ReportCard({
  report,
  onEdit,
  onDelete,
  onToggleStatus,
  onRunNow
}: {
  report: ScheduledReport
  onEdit?: () => void
  onDelete?: () => void
  onToggleStatus?: () => void
  onRunNow?: () => void
}) {
  const isPaused = report.status === 'paused'
  const iconClass = getReportTypeIcon(report.type)

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl border transition-all ${
      isPaused
        ? 'border-slate-200 dark:border-slate-700 opacity-75'
        : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md'
    }`}>
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${iconClass}`}>
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {report.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {getReportTypeLabel(report.type)}
              </p>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
            isPaused
              ? 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
          }`}>
            {isPaused ? 'Paused' : 'Active'}
          </span>
        </div>

        {/* Report Details */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Calendar className="w-3.5 h-3.5" />
              Frequency
            </div>
            <p className="font-medium text-slate-700 dark:text-slate-300 text-sm">
              {getFrequencyLabel(report.frequency)}
              {report.dayOfMonth && ` (Day ${report.dayOfMonth})`}
              {report.dayOfWeek && ` (${report.dayOfWeek})`}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Mail className="w-3.5 h-3.5" />
              Recipients
            </div>
            <p className="font-medium text-slate-700 dark:text-slate-300 text-sm">
              {report.recipients.length} recipient{report.recipients.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Scope Info */}
        {(report.circleName || report.associationName) && (
          <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 mb-4">
            <p className="text-xs text-indigo-600 dark:text-indigo-400">
              {report.circleName && `Circle: ${report.circleName}`}
              {report.associationName && `Association: ${report.associationName}`}
            </p>
          </div>
        )}

        {/* Schedule Info */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Last: {formatDate(report.lastGenerated)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Next: {formatDate(report.nextGeneration)}</span>
          </div>
        </div>

        {/* Format Badge */}
        <div className="flex items-center justify-between">
          <span className="px-2 py-1 rounded text-xs font-medium uppercase bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
            {report.format}
          </span>
          <p className="text-xs text-slate-400">
            Created by {report.createdBy}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-b-xl">
        <button
          onClick={onRunNow}
          className="flex items-center gap-1.5 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
        >
          <Play className="w-4 h-4" />
          Run Now
        </button>
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleStatus}
            className={`p-2 rounded-lg transition-colors ${
              isPaused
                ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                : 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20'
            }`}
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
          <button
            onClick={onEdit}
            className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

function CreateReportModal({
  isOpen,
  onClose,
  reportTypes,
  exportFormats,
  circleParticipations: _circleParticipations,
  onCreate
}: {
  isOpen: boolean
  onClose: () => void
  reportTypes: ReportsCenterProps['reportTypes']
  exportFormats: ReportsCenterProps['exportFormats']
  circleParticipations: ReportsCenterProps['circleParticipations']
  onCreate?: () => void
}) {
  const [step, setStep] = useState(1)
  const [selectedType, setSelectedType] = useState('')
  const [selectedFrequency, setSelectedFrequency] = useState('monthly')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Schedule New Report
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Step {step} of 3
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
                Select report type:
              </p>
              {reportTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => {
                    setSelectedType(type.id)
                    setStep(2)
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    selectedType === type.id
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                  }`}
                >
                  <div className="text-left">
                    <p className="font-medium text-slate-900 dark:text-white">
                      {type.name}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {type.description}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Report Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Monthly Personal Statement"
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Frequency
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['weekly', 'monthly', 'quarterly', 'annually'].map(freq => (
                    <button
                      key={freq}
                      onClick={() => setSelectedFrequency(freq)}
                      className={`px-4 py-3 rounded-xl border-2 transition-all ${
                        selectedFrequency === freq
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400'
                          : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {freq.charAt(0).toUpperCase() + freq.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Export Format
                </label>
                <div className="flex gap-3">
                  {exportFormats.map(format => (
                    <button
                      key={format.id}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 hover:border-indigo-500 text-slate-600 dark:text-slate-400 transition-all"
                    >
                      <FileText className="w-4 h-4" />
                      <span className="font-medium uppercase text-sm">{format.id}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Recipients (Email addresses)
                </label>
                <textarea
                  placeholder="Enter email addresses, one per line"
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                />
                <p className="text-xs text-slate-400 mt-2">
                  Reports will be emailed to these addresses when generated
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="font-medium text-emerald-700 dark:text-emerald-400">Ready to schedule</span>
                </div>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  Your report will be generated {selectedFrequency} and sent to the specified recipients.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            className="px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            {step > 1 ? 'Back' : 'Cancel'}
          </button>
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={() => {
                onCreate?.()
                onClose()
              }}
              className="px-6 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-colors"
            >
              Schedule Report
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function ReportsCenter({
  scheduledReports,
  reportTypes,
  exportFormats,
  circleParticipations,
  onCreateReport,
  onEditReport,
  onDeleteReport,
  onToggleReportStatus,
  onRunReportNow
}: ReportsCenterProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'paused'>('all')

  const filteredReports = filterStatus === 'all'
    ? scheduledReports
    : scheduledReports.filter(r => r.status === filterStatus)

  const activeCount = scheduledReports.filter(r => r.status === 'active').length
  const pausedCount = scheduledReports.filter(r => r.status === 'paused').length

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Reports Center
            </h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Schedule and manage automated reports
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" />
            Schedule Report
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Reports</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              {scheduledReports.length}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Active</p>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {activeCount}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Paused</p>
            <p className="text-3xl font-bold text-slate-400">
              {pausedCount}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Settings className="w-4 h-4" />
            <span>Status:</span>
          </div>
          <div className="flex gap-2">
            {(['all', 'active', 'paused'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Reports Grid */}
        {filteredReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReports.map(report => (
              <ReportCard
                key={report.id}
                report={report}
                onEdit={() => onEditReport?.(report.id)}
                onDelete={() => onDeleteReport?.(report.id)}
                onToggleStatus={() => onToggleReportStatus?.(report.id)}
                onRunNow={() => onRunReportNow?.(report.id)}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              {filterStatus === 'all' ? 'No scheduled reports' : `No ${filterStatus} reports`}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
              {filterStatus === 'all'
                ? 'Schedule your first automated report to stay informed about your circles and savings.'
                : `You don't have any ${filterStatus} reports at the moment.`}
            </p>
            {filterStatus === 'all' && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-colors"
              >
                <Plus className="w-4 h-4" />
                Schedule Your First Report
              </button>
            )}
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 p-6 bg-gradient-to-r from-slate-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-900/20 rounded-2xl border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-500" />
            Report Types Available
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {reportTypes.map(type => (
              <div
                key={type.id}
                className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <p className="font-medium text-slate-900 dark:text-white text-sm">
                  {type.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {type.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Report Modal */}
      <CreateReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reportTypes={reportTypes}
        exportFormats={exportFormats}
        circleParticipations={circleParticipations}
        onCreate={onCreateReport}
      />
    </div>
  )
}
