import type { FederationMembership } from '../types'
import {
  Search,
  Filter,
  Building2,
  Users,
  TrendingUp,
  Mail,
  Phone,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  Ban,
  ChevronRight,
  Download,
} from 'lucide-react'
import { useState } from 'react'

export interface ChapterDirectoryProps {
  chapters: FederationMembership[]
  onChapterClick?: (associationId: string) => void
  onApprove?: (membershipId: string) => void
  onSuspend?: (membershipId: string) => void
  onRemove?: (membershipId: string) => void
  onContactAdmin?: (associationId: string) => void
  onExport?: () => void
  onBack?: () => void
}

export function ChapterDirectory({
  chapters,
  onChapterClick,
  onApprove,
  onSuspend,
  onRemove,
  onContactAdmin,
  onExport,
  onBack,
}: ChapterDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          icon: CheckCircle,
          color: 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          label: 'Active',
        }
      case 'pending':
        return {
          icon: Clock,
          color: 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          label: 'Pending',
        }
      case 'suspended':
        return {
          icon: AlertCircle,
          color: 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
          label: 'Suspended',
        }
      case 'withdrawn':
        return {
          icon: Ban,
          color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
          label: 'Withdrawn',
        }
      default:
        return {
          icon: CheckCircle,
          color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
          label: status,
        }
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'chapter':
        return 'bg-indigo-100 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300'
      case 'affiliate':
        return 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300'
      case 'observer':
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
    }
  }

  // Filter chapters
  const filteredChapters = chapters.filter((chapter) => {
    const matchesSearch = chapter.associationName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || chapter.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Calculate stats
  const activeCount = chapters.filter(c => c.status === 'active').length
  const pendingCount = chapters.filter(c => c.status === 'pending').length
  const totalMembers = chapters.reduce((sum, c) => sum + c.memberCount, 0)
  const totalCircles = chapters.reduce((sum, c) => sum + c.activeCircles, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50 dark:from-slate-950 dark:via-indigo-950/20 dark:to-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b-2 border-indigo-200 dark:border-indigo-800 shadow-sm">
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
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/30 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  Chapter Directory
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Manage all member associations
                </p>
              </div>
            </div>
            <button
              onClick={onExport}
              className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-slate-100 dark:text-slate-900 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/20 rounded-xl p-4 border-2 border-indigo-200 dark:border-indigo-800">
              <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-1">Total Chapters</div>
              <div className="text-3xl font-bold text-indigo-900 dark:text-indigo-100">{chapters.length}</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20 rounded-xl p-4 border-2 border-emerald-200 dark:border-emerald-800">
              <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-1">Active</div>
              <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">{activeCount}</div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20 rounded-xl p-4 border-2 border-amber-200 dark:border-amber-800">
              <div className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-1">Total Members</div>
              <div className="text-3xl font-bold text-amber-900 dark:text-amber-100">{totalMembers.toLocaleString()}</div>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/30 dark:to-slate-800/20 rounded-xl p-4 border-2 border-slate-200 dark:border-slate-700">
              <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Active Circles</div>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{totalCircles}</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search chapters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'active', 'pending', 'suspended'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-colors capitalize ${
                    statusFilter === status
                      ? 'bg-indigo-600 dark:bg-indigo-500 text-white'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                  }`}
                >
                  {status}
                  {status === 'pending' && pendingCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-full">
                      {pendingCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chapter List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 shadow-xl overflow-hidden">
          {filteredChapters.length === 0 ? (
            <div className="py-16 text-center">
              <Building2 className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                No chapters found
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredChapters.map((chapter) => {
                const statusConfig = getStatusConfig(chapter.status)
                const StatusIcon = statusConfig.icon

                return (
                  <div
                    key={chapter.id}
                    className="p-6 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/10 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* Chapter Logo */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 border-2 border-indigo-200 dark:border-indigo-800">
                        {chapter.associationLogo ? (
                          <img
                            src={chapter.associationLogo}
                            alt={chapter.associationName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                            {chapter.associationName.charAt(0)}
                          </div>
                        )}
                      </div>

                      {/* Chapter Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1 min-w-0">
                            <button
                              onClick={() => onChapterClick?.(chapter.associationId)}
                              className="text-xl font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate block"
                            >
                              {chapter.associationName}
                            </button>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 ${statusConfig.color} flex items-center gap-1.5`}>
                                <StatusIcon className="w-3.5 h-3.5" />
                                {statusConfig.label}
                              </span>
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${getRoleBadgeColor(chapter.role)}`}>
                                {chapter.role}
                              </span>
                            </div>
                          </div>

                          {/* Actions Menu */}
                          <div className="relative">
                            <button
                              onClick={() => setOpenMenuId(openMenuId === chapter.id ? null : chapter.id)}
                              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                              <MoreVertical className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            </button>
                            {openMenuId === chapter.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border-2 border-slate-200 dark:border-slate-700 py-1 z-10">
                                <button
                                  onClick={() => {
                                    onContactAdmin?.(chapter.associationId)
                                    setOpenMenuId(null)
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100"
                                >
                                  Contact Admin
                                </button>
                                {chapter.status === 'pending' && (
                                  <button
                                    onClick={() => {
                                      onApprove?.(chapter.id)
                                      setOpenMenuId(null)
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 text-emerald-600 dark:text-emerald-400"
                                  >
                                    Approve
                                  </button>
                                )}
                                {chapter.status === 'active' && (
                                  <button
                                    onClick={() => {
                                      onSuspend?.(chapter.id)
                                      setOpenMenuId(null)
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 text-amber-600 dark:text-amber-400"
                                  >
                                    Suspend
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    onRemove?.(chapter.id)
                                    setOpenMenuId(null)
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 text-red-600 dark:text-red-400"
                                >
                                  Remove
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                            <div>
                              <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                {chapter.memberCount.toLocaleString()}
                              </div>
                              <div className="text-xs text-slate-600 dark:text-slate-400">Members</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                            <div>
                              <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                {chapter.activeCircles}
                              </div>
                              <div className="text-xs text-slate-600 dark:text-slate-400">Circles</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                            <div>
                              <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                {formatDate(chapter.joinedAt)}
                              </div>
                              <div className="text-xs text-slate-600 dark:text-slate-400">Joined</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                            <div>
                              <div className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                                {chapter.chapterAdminName}
                              </div>
                              <div className="text-xs text-slate-600 dark:text-slate-400">Admin</div>
                            </div>
                          </div>
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
    </div>
  )
}

// Helper component for Calendar icon
function Calendar({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}
