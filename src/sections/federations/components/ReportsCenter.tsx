import type { FederationReport, ReportType } from '@/../product/sections/federations/types'

interface ReportsCenterProps {
  reports: FederationReport[]
  onGenerateReport?: (type: ReportType) => void
  onScheduleReport?: (type: ReportType) => void
}

const reportStatusStyles = {
  completed: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
  generating: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  failed: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
}

const reportTypeIcons: Record<string, string> = {
  annual: '📊',
  financial: '💰',
  membership: '👥',
  circle_performance: '🔄',
  custom: '📋',
}

const reportTypes: { type: ReportType; label: string }[] = [
  { type: 'annual', label: 'Annual Report' },
  { type: 'financial', label: 'Financial Summary' },
  { type: 'membership', label: 'Membership Growth' },
  { type: 'circle_performance', label: 'Circle Performance' },
  { type: 'custom', label: 'Custom Report' },
]

export function ReportsCenter({ reports, onGenerateReport, onScheduleReport }: ReportsCenterProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">
          Reports Center
        </h3>
      </div>

      {/* Quick generate */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <p className="text-xs font-semibold text-slate-900 dark:text-white mb-3">Generate Report</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {reportTypes.map((rt) => (
            <button
              key={rt.type}
              onClick={() => onGenerateReport?.(rt.type)}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/10 transition-all text-center group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">{reportTypeIcons[rt.type]}</span>
              <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300">{rt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Existing reports */}
      <div className="space-y-2">
        <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Generated Reports</p>
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between gap-3 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-lg flex-shrink-0">{reportTypeIcons[report.type]}</span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white">{report.title}</h4>
                  <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${reportStatusStyles[report.status]}`}>
                    {report.status}
                  </span>
                  {report.scheduled && (
                    <span className="text-[8px] font-medium px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 flex items-center gap-0.5">
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
                      </svg>
                      Auto
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Period: {report.period}
                  {report.generatedAt && ` · Generated: ${new Date(report.generatedAt).toLocaleDateString()}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {report.status === 'generating' && (
                <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              )}
              {report.downloadUrl && (
                <a
                  href={report.downloadUrl}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download
                </a>
              )}
              <button
                onClick={() => onScheduleReport?.(report.type)}
                className="text-xs font-medium text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1.5 rounded hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
                title="Schedule recurring"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
