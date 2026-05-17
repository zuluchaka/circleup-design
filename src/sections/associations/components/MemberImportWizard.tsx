import { useState, useEffect, useRef, useCallback } from 'react'
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react'
import { useHybridPayments } from '@/hooks/useHybridPayments'

interface MemberImportWizardProps {
  associationId: string
  onComplete?: () => void
}

type Step = 'upload' | 'mapping' | 'processing' | 'complete'

const MAPPABLE_FIELDS = [
  { key: 'email', label: 'Email', required: true },
  { key: 'first_name', label: 'First Name' },
  { key: 'last_name', label: 'Last Name' },
  { key: 'phone', label: 'Phone' },
  { key: 'role', label: 'Role' },
  { key: 'membership_type', label: 'Membership Type' },
]

export default function MemberImportWizard({ associationId, onComplete }: MemberImportWizardProps) {
  const {
    importJob, importPreview, loading, error,
    startMemberImport, loadImportPreview, checkImportStatus,
  } = useHybridPayments()

  const [step, setStep] = useState<Step>('upload')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileUrl, setFileUrl] = useState('')
  const [fileFormat, setFileFormat] = useState<'csv' | 'xlsx'>('csv')
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({})
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file')
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Poll for import progress
  useEffect(() => {
    if (step !== 'processing' || !importJob) return
    const job = importJob.import_job

    if (job.status === 'completed' || job.status === 'failed') {
      setStep('complete')
      return
    }

    const interval = setInterval(() => {
      checkImportStatus(associationId, job.id)
    }, 2000)

    return () => clearInterval(interval)
  }, [step, importJob, associationId, checkImportStatus])

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file)
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (ext === 'xlsx' || ext === 'xls') {
      setFileFormat('xlsx')
    } else {
      setFileFormat('csv')
    }
  }, [])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFileSelect(file)
  }, [handleFileSelect])

  async function handleUpload() {
    // For file upload mode, we'd need to upload the file first
    // For now, use file URL if in URL mode, or create an object URL for file mode
    const url = uploadMode === 'url' ? fileUrl : ''

    const job = await startMemberImport(associationId, {
      file_url: url,
      file_format: fileFormat,
      // If selectedFile, the API layer should handle FormData upload
      ...(selectedFile ? { file: selectedFile } : {}),
    })
    if (job) {
      await loadImportPreview(associationId, job.id)
      setStep('mapping')
    }
  }

  async function handleStartImport() {
    if (!importJob) return
    await startMemberImport(associationId, {
      file_url: fileUrl,
      file_format: fileFormat,
      column_mapping: columnMapping,
    })
    setStep('processing')
  }

  const canUpload = uploadMode === 'file' ? !!selectedFile : !!fileUrl

  return (
    <div className="mx-auto max-w-2xl space-y-6 rounded-lg border bg-white dark:bg-slate-900 dark:border-slate-800 p-6">
      {/* Step indicator */}
      <div className="flex items-center justify-between text-sm">
        {(['upload', 'mapping', 'processing', 'complete'] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center">
            <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
              step === s ? 'bg-indigo-600 text-white' : i < ['upload', 'mapping', 'processing', 'complete'].indexOf(step) ? 'bg-emerald-500 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-400'
            }`}>
              {i + 1}
            </span>
            <span className="ml-2 hidden capitalize sm:inline text-slate-700 dark:text-slate-300">{s}</span>
          </div>
        ))}
      </div>

      {error && <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400">{error}</div>}

      {/* Step: Upload (L10: File upload instead of URL) */}
      {step === 'upload' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Upload Member List</h3>

          {/* Upload mode toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setUploadMode('file')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                uploadMode === 'file'
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Upload File
            </button>
            <button
              onClick={() => setUploadMode('url')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                uploadMode === 'url'
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              From URL
            </button>
          </div>

          {uploadMode === 'file' ? (
            <>
              {/* Drag & Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors
                  ${dragActive
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : selectedFile
                      ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
                  }
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileSelect(file)
                  }}
                />
                {selectedFile ? (
                  <div className="space-y-2">
                    <FileSpreadsheet className="h-8 w-8 mx-auto text-emerald-500" />
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedFile.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {(selectedFile.size / 1024).toFixed(1)} KB · {fileFormat.toUpperCase()}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedFile(null)
                      }}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Choose a different file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 mx-auto text-slate-400" />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Drag & drop your file here, or click to browse
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Supports CSV and XLSX files
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">File URL</label>
                <input
                  type="url"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="https://..."
                  className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">File Format</label>
                <div className="mt-1 flex space-x-4">
                  {(['csv', 'xlsx'] as const).map((fmt) => (
                    <label key={fmt} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="format"
                        checked={fileFormat === fmt}
                        onChange={() => setFileFormat(fmt)}
                        className="text-indigo-600"
                      />
                      <FileSpreadsheet className="h-4 w-4 text-slate-500" />
                      <span className="text-sm uppercase text-slate-700 dark:text-slate-300">{fmt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          <button
            onClick={handleUpload}
            disabled={!canUpload || loading}
            className="flex items-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            <Upload className="mr-2 h-4 w-4" />
            {loading ? 'Uploading...' : 'Upload & Preview'}
          </button>
        </div>
      )}

      {/* Step: Column Mapping */}
      {step === 'mapping' && importPreview && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Map Columns</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Match your file columns to member fields.</p>

          {MAPPABLE_FIELDS.map((field) => (
            <div key={field.key} className="flex items-center gap-3">
              <label className="w-36 text-sm font-medium text-slate-700 dark:text-slate-300">
                {field.label}{field.required && <span className="text-red-500"> *</span>}
              </label>
              <select
                value={columnMapping[field.key] || ''}
                onChange={(e) => setColumnMapping({ ...columnMapping, [field.key]: e.target.value })}
                className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
              >
                <option value="">-- Skip --</option>
                {importPreview.headers.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
          ))}

          {importPreview.sample_rows.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    {importPreview.headers.map((h) => (
                      <th key={h} className="px-3 py-2 text-left font-medium text-slate-500 dark:text-slate-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {importPreview.sample_rows.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j} className="px-3 py-2 text-slate-700 dark:text-slate-300">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button
            onClick={handleStartImport}
            disabled={!columnMapping.email || loading}
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            Start Import
          </button>
        </div>
      )}

      {/* Step: Processing */}
      {step === 'processing' && importJob && (
        <div className="space-y-4 text-center">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Importing Members...</h3>
          <div className="mx-auto h-2 w-full max-w-md overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full bg-indigo-500 transition-all"
              style={{ width: `${importJob.import_job.progressPercentage}%` }}
            />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {importJob.import_job.processedRows} of {importJob.import_job.totalRows} rows processed
          </p>
        </div>
      )}

      {/* Step: Complete */}
      {step === 'complete' && importJob && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            {importJob.import_job.status === 'completed' ? (
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            ) : (
              <AlertCircle className="h-6 w-6 text-red-500" />
            )}
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {importJob.import_job.status === 'completed' ? 'Import Complete' : 'Import Failed'}
            </h3>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 text-center">
              <div className="text-2xl font-bold text-emerald-600">{importJob.import_job.processedRows}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Processed</div>
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 text-center">
              <div className="text-2xl font-bold text-red-600">{importJob.import_job.failedRows}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Failed</div>
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{importJob.import_job.totalRows}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Total Rows</div>
            </div>
          </div>

          {importJob.import_job.errorsLog.length > 0 && (
            <div className="max-h-40 overflow-y-auto rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-3">
              <h4 className="mb-2 text-sm font-medium text-red-700 dark:text-red-400">Errors:</h4>
              {importJob.import_job.errorsLog.map((err, i) => (
                <p key={i} className="text-xs text-red-600 dark:text-red-400">Row {err.row}: {err.error}</p>
              ))}
            </div>
          )}

          <button
            onClick={onComplete}
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            Done
          </button>
        </div>
      )}
    </div>
  )
}
