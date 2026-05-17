import { useState, useMemo, useRef } from 'react'
import { FileText, Search, Upload, Filter } from 'lucide-react'
import type { Document, DocumentCategory } from '@/../product/sections/documents/types'
import { openExternal } from '@/platform/browser'

const CATEGORY_CONFIG: Record<string, { label: string; color: string; bgColor: string; darkBg: string }> = {
  agreements: { label: 'Agreements', color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30', darkBg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  minutes: { label: 'Minutes', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30', darkBg: 'bg-blue-50 dark:bg-blue-900/20' },
  financial: { label: 'Financial', color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-900/30', darkBg: 'bg-amber-50 dark:bg-amber-900/20' },
  policies: { label: 'Policies', color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900/30', darkBg: 'bg-purple-50 dark:bg-purple-900/20' },
  forms: { label: 'Forms', color: 'text-rose-600 dark:text-rose-400', bgColor: 'bg-rose-100 dark:bg-rose-900/30', darkBg: 'bg-rose-50 dark:bg-rose-900/20' },
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function isPdf(doc: Document): boolean {
  return doc.mimeType === 'application/pdf' || doc.fileName?.endsWith('.pdf')
}

interface Props {
  associationName: string
  documents: Document[]
  onBack: () => void
  onDeleteDocument?: (docId: string) => void
  onToggleStar?: (docId: string) => void
  onUploadDocument?: (file: File, meta: { title: string; description?: string; category?: string; visibility?: string }) => Promise<void>
  canManage?: boolean
}

export default function AssociationDocumentsView({ associationName, documents, onBack, onDeleteDocument, onToggleStar, onUploadDocument, canManage }: Props) {
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<DocumentCategory | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [showUpload, setShowUpload] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const selectedDoc = selectedDocId ? documents.find(d => d.id === selectedDocId) : null

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    documents.forEach(doc => {
      const cat = doc.category || 'other'
      counts[cat] = (counts[cat] || 0) + 1
    })
    return counts
  }, [documents])

  const totalSize = useMemo(() => documents.reduce((sum, d) => sum + (d.fileSize || 0), 0), [documents])
  const pdfCount = useMemo(() => documents.filter(isPdf).length, [documents])
  const recentDocs = useMemo(() =>
    [...documents].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
    [documents]
  )

  const filteredDocs = useMemo(() => {
    let result = documents
    if (filterCategory !== 'all') {
      result = result.filter(d => d.category === filterCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.description?.toLowerCase().includes(q) ||
        d.tags?.some(t => t.toLowerCase().includes(q))
      )
    }
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [documents, filterCategory, searchQuery])

  const pdfDocs = useMemo(() => filteredDocs.filter(isPdf), [filteredDocs])
  const otherDocs = useMemo(() => filteredDocs.filter(d => !isPdf(d)), [filteredDocs])

  // Document detail view
  if (selectedDoc) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedDocId(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-6 h-6 text-indigo-500" />
                  Document Detail
                </h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {associationName}
                </p>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedDoc.title}</h2>
                <div className="flex gap-2 shrink-0">
                  {selectedDoc.category && (
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${
                      CATEGORY_CONFIG[selectedDoc.category]?.bgColor || 'bg-slate-100 dark:bg-slate-800'
                    } ${CATEGORY_CONFIG[selectedDoc.category]?.color || 'text-slate-600 dark:text-slate-400'}`}>
                      {CATEGORY_CONFIG[selectedDoc.category]?.label || selectedDoc.category}
                    </span>
                  )}
                  {selectedDoc.permissions?.visibility === 'organizers_only' && (
                    <span className="px-2.5 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full">
                      Governance only
                    </span>
                  )}
                </div>
              </div>
              {selectedDoc.description && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{selectedDoc.description}</p>
              )}
              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                {selectedDoc.uploadedBy && (
                  <div>
                    <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Uploaded by</dt>
                    <dd className="mt-1 text-slate-900 dark:text-white">{selectedDoc.uploadedBy.name}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Date</dt>
                  <dd className="mt-1 text-slate-900 dark:text-white">
                    {new Date(selectedDoc.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </dd>
                </div>
                {selectedDoc.fileSize > 0 && (
                  <div>
                    <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">File size</dt>
                    <dd className="mt-1 text-slate-900 dark:text-white">{formatFileSize(selectedDoc.fileSize)}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Type</dt>
                  <dd className="mt-1 text-slate-900 dark:text-white">{selectedDoc.mimeType || 'Unknown'}</dd>
                </div>
              </dl>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-3 flex-wrap">
              {selectedDoc.fileUrl && isPdf(selectedDoc) && (
                <button
                  type="button"
                  onClick={() => { void openExternal({ url: selectedDoc.fileUrl }) }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View PDF
                </button>
              )}
              {selectedDoc.fileUrl && (
                <button
                  onClick={() => { void openExternal({ url: selectedDoc.fileUrl }) }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
              )}
              {onToggleStar && (
                <button
                  onClick={() => onToggleStar(selectedDoc.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    selectedDoc.isStarred
                      ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400'
                      : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600'
                  }`}
                >
                  <svg className="w-4 h-4" fill={selectedDoc.isStarred ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  {selectedDoc.isStarred ? 'Starred' : 'Star'}
                </button>
              )}
              {canManage && onDeleteDocument && (
                <button
                  onClick={() => {
                    if (confirm('Delete this document?')) {
                      onDeleteDocument(selectedDoc.id)
                      setSelectedDocId(null)
                    }
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 bg-white dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ml-auto"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              )}
            </div>

            {/* PDF inline preview */}
            {isPdf(selectedDoc) && selectedDoc.fileUrl && (
              <div className="p-6">
                <iframe
                  src={selectedDoc.fileUrl}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700"
                  style={{ height: '600px' }}
                  title={selectedDoc.title}
                />
              </div>
            )}

            {/* Acknowledgment/Signature status */}
            {(selectedDoc.requiresAcknowledgment || selectedDoc.requiresSignature) && (
              <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-6 text-sm">
                  {selectedDoc.requiresAcknowledgment && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-slate-600 dark:text-slate-400">
                        {selectedDoc.acknowledgmentCount || 0}/{selectedDoc.totalMembers || '?'} acknowledged
                      </span>
                    </div>
                  )}
                  {selectedDoc.requiresSignature && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      <span className="text-slate-600 dark:text-slate-400">
                        {selectedDoc.signatureCount || 0}/{selectedDoc.totalMembers || '?'} signed
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {selectedDoc.tags && selectedDoc.tags.length > 0 && (
              <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex flex-wrap gap-2">
                  {selectedDoc.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    )
  }

  // Category filter options
  const categoryFilters: { value: DocumentCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    ...Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => ({ value: key as DocumentCategory, label: cfg.label })),
  ]

  // Dashboard + list view
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Upload Modal */}
      {showUpload && onUploadDocument && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onUpload={async (file, meta) => {
            setUploading(true)
            setUploadError(null)
            try {
              await onUploadDocument(file, meta)
              setShowUpload(false)
            } catch (err) {
              setUploadError(err instanceof Error ? err.message : 'Upload failed')
            } finally {
              setUploading(false)
            }
          }}
          uploading={uploading}
          error={uploadError}
        />
      )}

      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-6 h-6 text-indigo-500" />
                  Documents
                </h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {associationName}
                </p>
              </div>
            </div>
            {canManage && onUploadDocument && (
              <button
                onClick={() => { setShowUpload(true); setUploadError(null) }}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
              >
                <Upload className="w-4 h-4" />
                Upload PDF
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-4 gap-3">
            {[
              { label: 'Total', value: documents.length, color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' },
              { label: 'PDFs', value: pdfCount, color: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' },
              { label: 'Size', value: formatFileSize(totalSize), color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' },
              { label: 'Categories', value: Object.keys(categoryCounts).length, color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400' },
            ].map((stat) => (
              <div key={stat.label} className={`rounded-xl px-4 py-3 ${stat.color}`}>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs font-medium mt-0.5 opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Search + Category Filters */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-500"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
              {categoryFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilterCategory(f.value)}
                  className={`flex-shrink-0 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                    filterCategory === f.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* View mode toggle */}
          <div className="mt-3 flex items-center justify-end">
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}
                title="List view"
              >
                <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}
                title="Grid view"
              >
                <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Document List */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredDocs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              {documents.length === 0 ? (
                <FileText className="w-8 h-8 text-slate-400" />
              ) : (
                <Filter className="w-8 h-8 text-slate-400" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              {documents.length === 0 ? 'No documents yet' : 'No documents found'}
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {documents.length === 0
                ? 'Upload a document to get started.'
                : 'Try adjusting your search or filters'}
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">
              {filteredDocs.length} {filteredDocs.length === 1 ? 'document' : 'documents'}
              {filterCategory !== 'all' || searchQuery ? ' found' : ''}
            </p>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocs.map(doc => (
                  <DocumentGridCard key={doc.id} doc={doc} onSelect={setSelectedDocId} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDocs.map(doc => (
                  <DocumentCard key={doc.id} doc={doc} onSelect={setSelectedDocId} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

function DocumentCard({ doc, onSelect }: { doc: Document; onSelect: (id: string) => void }) {
  const config = CATEGORY_CONFIG[doc.category] || { label: doc.category, color: 'text-slate-500 dark:text-slate-400', bgColor: 'bg-slate-100 dark:bg-slate-800' }
  const pdf = isPdf(doc)

  return (
    <button
      onClick={() => onSelect(doc.id)}
      className="w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors text-left"
    >
      <div className="p-4 flex items-center gap-4">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bgColor}`}>
          {pdf ? (
            <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
            </svg>
          ) : (
            <svg className={`w-6 h-6 ${config.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-slate-900 dark:text-white truncate">{doc.title}</p>
            {doc.isStarred && (
              <svg className="w-3.5 h-3.5 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
            {doc.uploadedBy?.name && <span>{doc.uploadedBy.name}</span>}
            {doc.fileSize > 0 && <span> &middot; {formatFileSize(doc.fileSize)}</span>}
            <span> &middot; {new Date(doc.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </p>
        </div>

        {/* Badges */}
        <div className="hidden sm:flex items-center gap-2">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${config.bgColor} ${config.color}`}>
            {config.label}
          </span>
          {pdf && (
            <span className="text-[10px] font-semibold uppercase px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full">
              PDF
            </span>
          )}
          {doc.permissions?.visibility === 'organizers_only' && (
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              Governance
            </span>
          )}
        </div>

        {/* Download + Arrow */}
        <div className="flex items-center gap-2 shrink-0">
          {doc.permissions?.canDownload !== false && doc.fileUrl && (
            <a
              href={doc.fileUrl}
              download={doc.fileName}
              onClick={e => e.stopPropagation()}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              title="Download"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </a>
          )}
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Mobile badges row */}
      <div className="sm:hidden px-4 pb-3 flex flex-wrap items-center gap-2">
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${config.bgColor} ${config.color}`}>
          {config.label}
        </span>
        {pdf && (
          <span className="text-[10px] font-semibold uppercase px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full">
            PDF
          </span>
        )}
        {doc.fileSize > 0 && (
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {formatFileSize(doc.fileSize)}
          </span>
        )}
      </div>
    </button>
  )
}

function DocumentListRow({ doc, onSelect }: { doc: Document; onSelect: (id: string) => void }) {
  const config = CATEGORY_CONFIG[doc.category] || { label: doc.category, color: 'text-slate-500 dark:text-slate-400', bgColor: 'bg-slate-100 dark:bg-slate-800' }
  const pdf = isPdf(doc)

  return (
    <button
      onClick={() => onSelect(doc.id)}
      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${config.bgColor}`}>
        {pdf ? (
          <svg className={`w-5 h-5 text-red-500`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
          </svg>
        ) : (
          <svg className={`w-5 h-5 ${config.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{doc.title}</p>
          {doc.isStarred && (
            <svg className="w-3.5 h-3.5 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-500">
          {doc.category && <span className="capitalize">{config.label}</span>}
          {doc.uploadedBy && <span> &middot; {doc.uploadedBy.name}</span>}
          {doc.fileSize > 0 && <span> &middot; {formatFileSize(doc.fileSize)}</span>}
          <span> &middot; {new Date(doc.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {pdf && (
          <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded">
            PDF
          </span>
        )}
        {doc.permissions?.canDownload !== false && doc.fileUrl && (
          <a
            href={doc.fileUrl}
            download={doc.fileName}
            onClick={e => e.stopPropagation()}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            title="Download"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>
        )}
        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  )
}

function DocumentGridCard({ doc, onSelect }: { doc: Document; onSelect: (id: string) => void }) {
  const config = CATEGORY_CONFIG[doc.category] || { label: doc.category, color: 'text-slate-500 dark:text-slate-400', bgColor: 'bg-slate-100 dark:bg-slate-800', darkBg: 'bg-slate-50 dark:bg-slate-800' }
  const pdf = isPdf(doc)

  return (
    <button
      onClick={() => onSelect(doc.id)}
      className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 text-left hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group"
    >
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${config.bgColor}`}>
        {pdf ? (
          <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
          </svg>
        ) : (
          <svg className={`w-6 h-6 ${config.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}
      </div>
      <div className="flex items-center gap-2 mb-1">
        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{doc.title}</p>
        {doc.isStarred && (
          <svg className="w-3.5 h-3.5 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        )}
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-500 mb-2">
        {doc.uploadedBy?.name} &middot; {new Date(doc.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </p>
      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${config.bgColor} ${config.color}`}>
          {config.label}
        </span>
        <div className="flex items-center gap-2">
          {pdf && (
            <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded">
              PDF
            </span>
          )}
          {doc.fileSize > 0 && (
            <span className="text-xs text-slate-400">{formatFileSize(doc.fileSize)}</span>
          )}
        </div>
      </div>
    </button>
  )
}

const CATEGORIES: { value: string; label: string }[] = [
  { value: 'agreements', label: 'Agreements' },
  { value: 'minutes', label: 'Minutes' },
  { value: 'financial', label: 'Financial' },
  { value: 'policies', label: 'Policies' },
  { value: 'forms', label: 'Forms' },
]

function UploadModal({ onClose, onUpload, uploading, error }: {
  onClose: () => void
  onUpload: (file: File, meta: { title: string; description?: string; category?: string; visibility?: string }) => void
  uploading: boolean
  error: string | null
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('agreements')
  const [visibility, setVisibility] = useState('all_members')
  const [dragOver, setDragOver] = useState(false)

  const handleFileSelect = (f: File) => {
    if (f.type !== 'application/pdf') {
      alert('Only PDF files are supported')
      return
    }
    setFile(f)
    if (!title) setTitle(f.name.replace(/\.pdf$/i, ''))
  }

  const handleSubmit = () => {
    if (!file || !title.trim()) return
    onUpload(file, { title: title.trim(), description: description.trim() || undefined, category, visibility })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Upload PDF Document</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Drop zone */}
          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              dragOver
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                : file
                  ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20'
                  : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => {
              e.preventDefault()
              setDragOver(false)
              const f = e.dataTransfer.files[0]
              if (f) handleFileSelect(f)
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFileSelect(f) }}
            />
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
                </svg>
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{file.name}</p>
                  <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); setFile(null) }}
                  className="ml-2 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <svg className="w-10 h-10 text-slate-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Drop a PDF file here, or <span className="text-indigo-600 dark:text-indigo-400 font-medium">browse</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">PDF files only</p>
              </>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Document title"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description (optional)</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Brief description of the document"
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Category + Visibility */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Visibility</label>
              <select
                value={visibility}
                onChange={e => setVisibility(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all_members">All Members</option>
                <option value="organizers_only">Governance Only</option>
              </select>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            disabled={uploading}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!file || !title.trim() || uploading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  )
}
