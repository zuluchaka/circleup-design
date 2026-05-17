import { useState } from 'react'
import { FileText, Download } from 'lucide-react'
import { useHybridPayments } from '@/hooks/useHybridPayments'
import { saveFile } from '@/platform/downloads'

interface FinancialReportPanelProps {
  associationId: string
}

type ReportType = 'monthly' | 'agm'

export default function FinancialReportPanel({ associationId }: FinancialReportPanelProps) {
  const { financialReport, loading, error, loadMonthlyReport, loadAgmReport } = useHybridPayments()
  const [reportType, setReportType] = useState<ReportType>('monthly')
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)

  async function handleGenerate() {
    if (reportType === 'monthly') {
      await loadMonthlyReport(associationId, year, month)
    } else {
      await loadAgmReport(associationId, year)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const report = financialReport?.report as any

  return (
    <div className="space-y-6 rounded-lg border bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Financial Reports</h2>
        <FileText className="h-5 w-5 text-gray-400" />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500">Report Type</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value as ReportType)}
            className="mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="monthly">Monthly Closeout</option>
            <option value="agm">AGM / Year-End</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="mt-1 w-24 rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        {reportType === 'monthly' && (
          <div>
            <label className="block text-xs font-medium text-gray-500">Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
        )}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Report'}
        </button>
      </div>

      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      {/* Report display */}
      {report && (
        <div className="space-y-4">
          {/* Summary */}
          {report.summary && (
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="text-sm font-semibold text-gray-700">Summary</h3>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                <div>
                  <span className="text-xs text-gray-500">Total Amount</span>
                  <div className="text-xl font-bold">
                    {(report.summary.total_amount ?? 0).toFixed(2)} CHF
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Total Transactions</span>
                  <div className="text-xl font-bold">
                    {report.summary.total_transactions ?? 0}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* By Method Breakdown */}
          {report.by_method && (
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-semibold text-gray-700">By Payment Method</h3>
              <div className="mt-2 grid gap-3 sm:grid-cols-3">
                {Object.entries(report.by_method).map(
                  ([method, data]: [string, any]) => (
                    <div key={method} className="rounded border p-3">
                      <div className="text-xs font-medium uppercase text-gray-500">
                        {method.replace('_', ' ')}
                      </div>
                      <div className="text-lg font-bold">{data.amount.toFixed(2)} CHF</div>
                      <div className="text-xs text-gray-500">{data.count} transactions</div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Reconciliation */}
          {report.reconciliation && (
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-semibold text-gray-700">Reconciliation Status</h3>
              <div className="mt-2 text-sm text-gray-600">
                Rate: {report.reconciliation.rate}%
              </div>
            </div>
          )}

          {/* Integrity hash for AGM */}
          {report.integrity_hash && (
            <div className="rounded border bg-gray-50 p-3">
              <span className="text-xs font-medium text-gray-500">Integrity Hash (SHA-256): </span>
              <code className="break-all text-xs text-gray-600">{String(report.integrity_hash)}</code>
            </div>
          )}

          {/* Download button */}
          <button
            onClick={() => {
              const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
              void saveFile({
                blob,
                fileName: `financial-report-${reportType}-${year}${reportType === 'monthly' ? `-${month}` : ''}.json`,
                mimeType: 'application/json',
              })
            }}
            className="flex items-center text-sm text-blue-600 hover:underline"
          >
            <Download className="mr-1 h-4 w-4" />
            Download as JSON
          </button>
        </div>
      )}
    </div>
  )
}
