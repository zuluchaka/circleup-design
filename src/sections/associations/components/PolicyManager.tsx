import type { FederationPolicy } from '@/../product/sections/associations/types'
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  Archive,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  Eye,
  Download,
} from 'lucide-react'
import { useState } from 'react'

export interface PolicyManagerProps {
  policies: FederationPolicy[]
  onCreatePolicy?: () => void
  onEditPolicy?: (policyId: string) => void
  onViewAcknowledgments?: (policyId: string) => void
  onArchivePolicy?: (policyId: string) => void
  onDeletePolicy?: (policyId: string) => void
  onExportPolicy?: (policyId: string) => void
  onBack?: () => void
}

export function PolicyManager({
  policies,
  onCreatePolicy,
  onEditPolicy,
  onViewAcknowledgments,
  onArchivePolicy,
  onDeletePolicy,
  onExportPolicy,
  onBack,
}: PolicyManagerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getCategoryConfig = (category: string) => {
    switch (category) {
      case 'governance':
        return {
          color: 'bg-indigo-100 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
          label: 'Governance',
        }
      case 'finance':
        return {
          color: 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          label: 'Finance',
        }
      case 'membership':
        return {
          color: 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          label: 'Membership',
        }
      case 'operations':
        return {
          color: 'bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
          label: 'Operations',
        }
      default:
        return {
          color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
          label: category,
        }
    }
  }

  // Filter policies
  const filteredPolicies = policies.filter((policy) => {
    const matchesSearch = policy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         policy.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || policy.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  // Calculate stats
  const totalPolicies = policies.length
  const requiredPolicies = policies.filter(p => p.isRequired).length
  const fullyAcknowledged = policies.filter(p => p.acknowledgments >= p.totalChapters).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-50 dark:from-slate-950 dark:via-amber-950/10 dark:to-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b-2 border-amber-200 dark:border-amber-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              )}
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  Policy Manager
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Create, distribute, and track federation policies
                </p>
              </div>
            </div>
            <button
              onClick={onCreatePolicy}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Policy
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/20 rounded-xl p-4 border-2 border-indigo-200 dark:border-indigo-800">
              <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-1">Total Policies</div>
              <div className="text-3xl font-bold text-indigo-900 dark:text-indigo-100">{totalPolicies}</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20 rounded-xl p-4 border-2 border-red-200 dark:border-red-800">
              <div className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Required</div>
              <div className="text-3xl font-bold text-red-900 dark:text-red-100">{requiredPolicies}</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20 rounded-xl p-4 border-2 border-emerald-200 dark:border-emerald-800">
              <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-1">Fully Acknowledged</div>
              <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">{fullyAcknowledged}</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search policies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {['all', 'governance', 'finance', 'membership', 'operations'].map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-colors capitalize whitespace-nowrap ${
                    categoryFilter === category
                      ? 'bg-amber-600 dark:bg-amber-500 text-white'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Policy List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredPolicies.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-xl py-16 text-center">
            <FileText className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              No policies found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {searchQuery || categoryFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first policy'}
            </p>
            {!searchQuery && categoryFilter === 'all' && (
              <button
                onClick={onCreatePolicy}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Your First Policy
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPolicies.map((policy) => {
              const categoryConfig = getCategoryConfig(policy.category)
              const completionRate = (policy.acknowledgments / policy.totalChapters) * 100
              const isFullyAcknowledged = policy.acknowledgments >= policy.totalChapters

              return (
                <div
                  key={policy.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-amber-200 dark:border-amber-800 shadow-lg hover:shadow-2xl transition-all overflow-hidden group"
                >
                  {/* Policy Header */}
                  <div className="p-6 border-b-2 border-amber-100 dark:border-amber-900/50">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                            {policy.title}
                          </h3>
                          {policy.isRequired && (
                            <span className="px-2.5 py-1 bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-300 text-xs font-bold rounded-full border-2 border-red-200 dark:border-red-800 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Required
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 capitalize ${categoryConfig.color}`}>
                            {categoryConfig.label}
                          </span>
                          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                            Version {policy.version}
                          </span>
                        </div>
                      </div>

                      {/* Actions Menu */}
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === policy.id ? null : policy.id)}
                          className="p-2 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </button>
                        {openMenuId === policy.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border-2 border-slate-200 dark:border-slate-700 py-1 z-10">
                            <button
                              onClick={() => {
                                onEditPolicy?.(policy.id)
                                setOpenMenuId(null)
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4" />
                              Edit Policy
                            </button>
                            <button
                              onClick={() => {
                                onViewAcknowledgments?.(policy.id)
                                setOpenMenuId(null)
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Acknowledgments
                            </button>
                            <button
                              onClick={() => {
                                onExportPolicy?.(policy.id)
                                setOpenMenuId(null)
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              Export
                            </button>
                            <div className="border-t border-slate-200 dark:border-slate-700 my-1" />
                            <button
                              onClick={() => {
                                onArchivePolicy?.(policy.id)
                                setOpenMenuId(null)
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 text-amber-600 dark:text-amber-400 flex items-center gap-2"
                            >
                              <Archive className="w-4 h-4" />
                              Archive
                            </button>
                            <button
                              onClick={() => {
                                onDeletePolicy?.(policy.id)
                                setOpenMenuId(null)
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 text-red-600 dark:text-red-400 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Policy Content Preview */}
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                      {policy.content}
                    </p>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span>Effective {formatDate(policy.effectiveDate)}</span>
                      </div>
                      <span>·</span>
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span>Updated {formatDate(policy.updatedAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Acknowledgment Progress */}
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {isFullyAcknowledged ? (
                          <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        )}
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          Chapter Acknowledgments
                        </span>
                      </div>
                      <button
                        onClick={() => onViewAcknowledgments?.(policy.id)}
                        className="text-sm font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                      >
                        View Details
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">
                          {policy.acknowledgments} of {policy.totalChapters} chapters
                        </span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {Math.round(completionRate)}%
                        </span>
                      </div>
                      <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            isFullyAcknowledged
                              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                              : 'bg-gradient-to-r from-amber-500 to-amber-600'
                          }`}
                          style={{ width: `${completionRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// Helper component for Calendar icon
function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}
