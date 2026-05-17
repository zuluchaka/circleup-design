import { useState, useEffect } from 'react'
import { Upload, CheckCircle2, AlertTriangle, Link2 } from 'lucide-react'
import { useHybridPayments } from '@/hooks/useHybridPayments'

interface PostfinanceImportFlowProps {
  associationId: string
  onComplete?: () => void
}

type Step = 'upload' | 'processing' | 'results'

export default function PostfinanceImportFlow({ associationId, onComplete }: PostfinanceImportFlowProps) {
  const {
    statementImport, loading, error,
    startStatementImport, loadStatementImport, manualMatch,
  } = useHybridPayments()

  const [step, setStep] = useState<Step>('upload')
  const [fileUrl, setFileUrl] = useState('')
  const [format, setFormat] = useState<'camt054' | 'csv'>('camt054')

  // Poll for import completion
  useEffect(() => {
    if (step !== 'processing' || !statementImport) return
    const si = statementImport.statement_import

    if (si.status === 'completed' || si.status === 'failed') {
      setStep('results')
      return
    }

    const interval = setInterval(() => {
      loadStatementImport(associationId, si.id)
    }, 3000)

    return () => clearInterval(interval)
  }, [step, statementImport, associationId, loadStatementImport])

  async function handleUpload() {
    const result = await startStatementImport(associationId, { file_url: fileUrl, format })
    if (result) setStep('processing')
  }

  async function handleManualMatch(transactionId: string, paymentId: string) {
    if (!statementImport) return
    await manualMatch(associationId, statementImport.statement_import.id, transactionId, paymentId)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 rounded-lg border bg-white p-6">
      <h2 className="text-lg font-semibold">PostFinance Statement Import</h2>

      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      {/* Upload */}
      {step === 'upload' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Statement File URL</label>
            <input
              type="url"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="https://..."
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Format</label>
            <div className="mt-1 flex space-x-4">
              <label className="flex items-center space-x-2">
                <input type="radio" checked={format === 'camt054'} onChange={() => setFormat('camt054')} />
                <span className="text-sm">camt.054 (XML)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" checked={format === 'csv'} onChange={() => setFormat('csv')} />
                <span className="text-sm">CSV</span>
              </label>
            </div>
          </div>
          <button
            onClick={handleUpload}
            disabled={!fileUrl || loading}
            className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Upload className="mr-2 h-4 w-4" />
            {loading ? 'Uploading...' : 'Import Statement'}
          </button>
        </div>
      )}

      {/* Processing */}
      {step === 'processing' && (
        <div className="py-8 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <p className="mt-4 text-sm text-gray-500">Processing statement and matching transactions...</p>
        </div>
      )}

      {/* Results */}
      {step === 'results' && statementImport && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
              <CheckCircle2 className="mx-auto h-6 w-6 text-green-500" />
              <div className="mt-1 text-2xl font-bold text-green-700">
                {statementImport.statement_import.matchedTransactions}
              </div>
              <div className="text-xs text-gray-500">Auto-Matched</div>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-center">
              <AlertTriangle className="mx-auto h-6 w-6 text-amber-500" />
              <div className="mt-1 text-2xl font-bold text-amber-700">
                {statementImport.statement_import.unmatchedTransactions}
              </div>
              <div className="text-xs text-gray-500">Need Manual Match</div>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <div className="mt-1 text-2xl font-bold">
                {statementImport.statement_import.matchRate}%
              </div>
              <div className="text-xs text-gray-500">Match Rate</div>
            </div>
          </div>

          {/* Match results table */}
          {statementImport.match_results && statementImport.match_results.length > 0 && (
            <div className="overflow-x-auto rounded border">
              <table className="min-w-full divide-y text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Transaction</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Match</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Tier</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {statementImport.match_results.map((r, i) => (
                    <tr key={i}>
                      <td className="px-4 py-2 font-mono text-xs">{r.transaction_id}</td>
                      <td className="px-4 py-2">
                        {r.payment_id ? (
                          <span className="text-green-600">Matched #{r.payment_id}</span>
                        ) : (
                          <span className="text-amber-600">Unmatched</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-xs">{r.tier || '-'}</td>
                      <td className="px-4 py-2">
                        {!r.payment_id && (
                          <button
                            onClick={() => {
                              const pid = prompt('Enter payment ID to match:')
                              if (pid) handleManualMatch(r.transaction_id, pid)
                            }}
                            className="flex items-center text-xs text-blue-600 hover:underline"
                          >
                            <Link2 className="mr-1 h-3 w-3" />
                            Manual Match
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button
            onClick={onComplete}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Done
          </button>
        </div>
      )}
    </div>
  )
}
