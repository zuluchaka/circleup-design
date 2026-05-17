import type { JSX } from 'react'
import type { CircleDocumentsProps, Document, DocumentCategory } from '@/../product/sections/documents/types'

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const categoryConfig: Record<DocumentCategory | 'all', { label: string; icon: JSX.Element; color: string }> = {
  all: {
    label: 'All Documents',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    color: 'slate',
  },
  agreements: {
    label: 'Agreements',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: 'indigo',
  },
  minutes: {
    label: 'Meeting Minutes',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    color: 'emerald',
  },
  financial: {
    label: 'Financial Reports',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    color: 'amber',
  },
  policies: {
    label: 'Policies',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: 'purple',
  },
  forms: {
    label: 'Forms',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    color: 'rose',
  },
}

function getCategoryStyles(category: string, isActive: boolean) {
  const colorMap: Record<string, { active: string; inactive: string }> = {
    slate: {
      active: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
      inactive: 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800',
    },
    indigo: {
      active: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
      inactive: 'text-slate-500 hover:bg-indigo-50 dark:text-slate-400 dark:hover:bg-indigo-900/20',
    },
    emerald: {
      active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
      inactive: 'text-slate-500 hover:bg-emerald-50 dark:text-slate-400 dark:hover:bg-emerald-900/20',
    },
    amber: {
      active: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
      inactive: 'text-slate-500 hover:bg-amber-50 dark:text-slate-400 dark:hover:bg-amber-900/20',
    },
    purple: {
      active: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
      inactive: 'text-slate-500 hover:bg-purple-50 dark:text-slate-400 dark:hover:bg-purple-900/20',
    },
    rose: {
      active: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
      inactive: 'text-slate-500 hover:bg-rose-50 dark:text-slate-400 dark:hover:bg-rose-900/20',
    },
  }
  const colors = colorMap[category] || colorMap.slate
  return isActive ? colors.active : colors.inactive
}

function getFileIcon(mimeType: string) {
  if (mimeType.includes('pdf')) {
    return (
      <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v5a2 2 0 002 2h5v9H6z" />
      </svg>
    )
  }
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
    return (
      <svg className="w-6 h-6 text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v5a2 2 0 002 2h5v9H6z" />
      </svg>
    )
  }
  if (mimeType.includes('word') || mimeType.includes('document')) {
    return (
      <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v5a2 2 0 002 2h5v9H6z" />
      </svg>
    )
  }
  return (
    <svg className="w-6 h-6 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v5a2 2 0 002 2h5v9H6z" />
    </svg>
  )
}

function DocumentRow({
  document,
  onClick,
  onDownload,
}: {
  document: Document
  onClick: () => void
  onDownload?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className="group flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
    >
      {/* Icon */}
      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
        {getFileIcon(document.mimeType)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {document.isStarred && (
            <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          )}
          <h3 className="font-medium text-slate-900 dark:text-white text-sm truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {document.title}
          </h3>
          {document.isAutoGenerated && (
            <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs rounded">
              Auto
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
          <span>{formatFileSize(document.fileSize)}</span>
          <span>·</span>
          <span>{formatDate(document.updatedAt)}</span>
          {document.uploadedBy && (
            <>
              <span>·</span>
              <span>by {document.uploadedBy.name}</span>
            </>
          )}
        </div>
      </div>

      {/* Status indicators */}
      <div className="hidden sm:flex items-center gap-2">
        {document.requiresAcknowledgment && (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <svg className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
              {document.acknowledgmentCount}/{document.totalMembers}
            </span>
          </div>
        )}
        {document.requiresSignature && (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
            <svg className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
              {document.signatureCount}/{document.totalMembers}
            </span>
          </div>
        )}
      </div>

      {/* Download button */}
      {onDownload && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDownload()
          }}
          className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
        >
          <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
      )}

      {/* Chevron */}
      <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  )
}

export function CircleDocuments({
  documents,
  folders: _folders,
  documentSpace,
  circle,
  selectedCategory = 'all',
  onDocumentClick,
  onDownload,
  onCategorySelect,
  onUpload,
  onManageRetention,
}: CircleDocumentsProps) {
  // Filter documents by category
  const filteredDocuments = selectedCategory === 'all'
    ? documents.filter(d => !d.isArchived)
    : documents.filter(d => d.category === selectedCategory && !d.isArchived)

  // Group by category for stats
  const documentsByCategory = documents.reduce((acc, doc) => {
    if (!doc.isArchived) {
      acc[doc.category] = (acc[doc.category] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  // Storage percentage
  const storagePercentage = Math.round(
    (documentSpace.storageUsedBytes / documentSpace.storageQuotaBytes) * 100
  )

  const categories: (DocumentCategory | 'all')[] = ['all', 'agreements', 'minutes', 'financial', 'policies', 'forms']

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {circle.name}
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                {circle.memberCount} members · {documentSpace.totalDocuments} documents
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Categories */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                <h2 className="font-semibold text-slate-900 dark:text-white text-sm">
                  Categories
                </h2>
              </div>
              <div className="p-2">
                {categories.map((category) => {
                  const config = categoryConfig[category]
                  const count = category === 'all'
                    ? documents.filter(d => !d.isArchived).length
                    : documentsByCategory[category] || 0

                  return (
                    <button
                      key={category}
                      onClick={() => onCategorySelect?.(category)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${getCategoryStyles(config.color, selectedCategory === category)}`}
                    >
                      <span className="flex items-center gap-2">
                        {config.icon}
                        {config.label}
                      </span>
                      <span className="text-xs opacity-60">{count}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Storage */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
              <h2 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
                Storage
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Used</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {formatFileSize(documentSpace.storageUsedBytes)}
                  </span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      storagePercentage > 90 ? 'bg-red-500' : storagePercentage > 70 ? 'bg-amber-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${storagePercentage}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formatFileSize(documentSpace.storageQuotaBytes - documentSpace.storageUsedBytes)} available
                </p>
              </div>

              {/* Retention Policy */}
              {documentSpace.retentionPolicy.enabled && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Retention Policy
                    </span>
                    <button
                      onClick={onManageRetention}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Manage
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    Archive after {documentSpace.retentionPolicy.archiveAfterDays} days
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <button
              onClick={onUpload}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Document
            </button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Current Category Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className={`p-2 rounded-lg ${getCategoryStyles(categoryConfig[selectedCategory].color, true)}`}>
                  {categoryConfig[selectedCategory].icon}
                </span>
                <h2 className="font-semibold text-slate-900 dark:text-white">
                  {categoryConfig[selectedCategory].label}
                </h2>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  ({filteredDocuments.length})
                </span>
              </div>
            </div>

            {/* Documents List */}
            {filteredDocuments.length > 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700 overflow-hidden">
                {filteredDocuments.map((doc) => (
                  <DocumentRow
                    key={doc.id}
                    document={doc}
                    onClick={() => onDocumentClick?.(doc)}
                    onDownload={() => onDownload?.(doc)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {categoryConfig[selectedCategory].icon}
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
                  No {selectedCategory === 'all' ? 'documents' : categoryConfig[selectedCategory].label.toLowerCase()}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-4">
                  {selectedCategory === 'all'
                    ? 'Upload your first document to get started'
                    : `No ${categoryConfig[selectedCategory].label.toLowerCase()} have been uploaded yet`
                  }
                </p>
                <button
                  onClick={onUpload}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload Document
                </button>
              </div>
            )}

            {/* Auto-generated Documents Section */}
            {selectedCategory === 'financial' && (
              <div className="mt-6">
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Auto-generated Records
                </h3>
                <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10 rounded-2xl border border-amber-200 dark:border-amber-800/30 p-4">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Contribution receipts and payout confirmations are automatically generated and stored here when transactions occur.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
