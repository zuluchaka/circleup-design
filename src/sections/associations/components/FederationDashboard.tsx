import type { Federation, FederationMembership, FederationPolicy, FederationAnnouncement, FederationMetrics } from '@/../product/sections/associations/types'
import {
  Building2,
  Users,
  TrendingUp,
  FileText,
  MessageSquare,
  ChevronRight,
  CheckCircle,
  BarChart3,
  Plus,
  Send,
} from 'lucide-react'

export interface FederationDashboardProps {
  federation: Federation
  chapters: FederationMembership[]
  policies: FederationPolicy[]
  announcements: FederationAnnouncement[]
  metrics: FederationMetrics

  onChapterClick?: (associationId: string) => void
  onCreatePolicy?: () => void
  onBroadcast?: () => void
  onInviteChapter?: () => void
  onViewReports?: () => void
  onViewChapterDirectory?: () => void
  onViewPolicyManager?: () => void
  onViewAnnouncements?: () => void
  onBack?: () => void
}

export function FederationDashboard({
  federation,
  chapters,
  policies,
  announcements,
  metrics,
  onChapterClick,
  onCreatePolicy,
  onBroadcast,
  onInviteChapter,
  onViewReports,
  onViewChapterDirectory,
  onViewPolicyManager,
  onViewAnnouncements,
  onBack,
}: FederationDashboardProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300'
      case 'pending':
        return 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300'
      case 'suspended':
        return 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-300'
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
    }
  }

  const activeChapters = chapters.filter(c => c.status === 'active')
  const pendingChapters = chapters.filter(c => c.status === 'pending')
  const recentPolicies = policies.slice(0, 3)
  const recentAnnouncements = announcements.slice(0, 3)

  // Top performing chapters
  const topChapters = metrics.chapterPerformance
    .sort((a, b) => b.healthScore - a.healthScore)
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50 dark:from-slate-950 dark:via-indigo-950/20 dark:to-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 dark:from-indigo-900 dark:via-indigo-800 dark:to-indigo-900 border-b-4 border-amber-400 dark:border-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white mt-1"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              )}
              <div className="flex items-center gap-4">
                {federation.logo && (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-2xl border-2 border-amber-400 dark:border-amber-500">
                    <img src={federation.logo} alt={federation.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">
                      {federation.name}
                    </h1>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(federation.status)}`}>
                      {federation.status}
                    </span>
                  </div>
                  <p className="text-indigo-100 dark:text-indigo-200 max-w-2xl">
                    {federation.description}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-indigo-200 dark:text-indigo-300">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      <span className="capitalize">{federation.type} Federation</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Founded {formatDate(federation.foundedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden sm:flex gap-2">
              <button
                onClick={onInviteChapter}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors shadow-lg flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Invite Chapter
              </button>
              <button
                onClick={onBroadcast}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors border border-white/20 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Broadcast
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/30 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              {pendingChapters.length > 0 && (
                <span className="px-2 py-1 bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 text-xs font-bold rounded-full">
                  +{pendingChapters.length} pending
                </span>
              )}
            </div>
            <div className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-1">
              {activeChapters.length}
            </div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Active Chapters
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              {metrics.memberGrowth > 0 && (
                <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +{metrics.memberGrowth}%
                </span>
              )}
            </div>
            <div className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-1">
              {formatNumber(metrics.totalMembers)}
            </div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Members
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/30 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <div className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-1">
              {metrics.activeCircles}
            </div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Active Circles
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-1">
              {metrics.averageCircleHealth}
            </div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Avg. Health Score
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Performing Chapters */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 shadow-lg overflow-hidden">
            <div className="p-6 border-b-2 border-indigo-100 dark:border-indigo-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/30 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    Top Performing Chapters
                  </h2>
                </div>
                <button
                  onClick={onViewChapterDirectory}
                  className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {topChapters.map((chapter, index) => (
                <button
                  key={chapter.associationId}
                  onClick={() => onChapterClick?.(chapter.associationId)}
                  className="w-full px-6 py-4 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                      #{index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {chapter.associationName}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {chapter.memberCount} members · {chapter.activeCircles} circles
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {chapter.healthScore}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Health Score
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Policies */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 shadow-lg overflow-hidden">
            <div className="p-6 border-b-2 border-indigo-100 dark:border-indigo-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    Active Policies
                  </h2>
                </div>
                <button
                  onClick={onViewPolicyManager}
                  className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1"
                >
                  Manage
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {recentPolicies.map((policy) => {
                const completionRate = (policy.acknowledgments / policy.totalChapters) * 100
                return (
                  <div key={policy.id} className="px-6 py-4">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                            {policy.title}
                          </h3>
                          {policy.isRequired && (
                            <span className="px-2 py-0.5 bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-300 text-xs font-bold rounded-full">
                              Required
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                          {policy.category} · v{policy.version} · Effective {formatDate(policy.effectiveDate)}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Acknowledgments</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {policy.acknowledgments}/{policy.totalChapters}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all"
                          style={{ width: `${completionRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
              <div className="px-6 py-4">
                <button
                  onClick={onCreatePolicy}
                  className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-colors text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create New Policy
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 shadow-lg overflow-hidden">
          <div className="p-6 border-b-2 border-indigo-100 dark:border-indigo-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/30 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Recent Announcements
                </h2>
              </div>
              <button
                onClick={onViewAnnouncements}
                className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {recentAnnouncements.map((announcement) => (
              <div key={announcement.id} className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                    {announcement.authorName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                        {announcement.title}
                      </h3>
                      <span className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {formatDate(announcement.publishedAt)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                      {announcement.content}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <span>By {announcement.authorName}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {announcement.readCount} read
                      </span>
                      <span>·</span>
                      <span>{announcement.targetChapters === 'all' ? 'All chapters' : `${announcement.targetChapters.length} chapters`}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-900 dark:to-indigo-800 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={onViewReports}
              className="p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl border border-white/20 transition-colors text-white text-left group"
            >
              <BarChart3 className="w-6 h-6 mb-3 text-amber-300" />
              <div className="font-semibold mb-1">View Reports</div>
              <div className="text-sm text-indigo-200">Detailed analytics & insights</div>
            </button>
            <button
              onClick={onViewChapterDirectory}
              className="p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl border border-white/20 transition-colors text-white text-left group"
            >
              <Building2 className="w-6 h-6 mb-3 text-amber-300" />
              <div className="font-semibold mb-1">Chapter Directory</div>
              <div className="text-sm text-indigo-200">Manage all member associations</div>
            </button>
            <button
              onClick={onViewPolicyManager}
              className="p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl border border-white/20 transition-colors text-white text-left group"
            >
              <FileText className="w-6 h-6 mb-3 text-amber-300" />
              <div className="font-semibold mb-1">Policy Manager</div>
              <div className="text-sm text-indigo-200">Create & distribute policies</div>
            </button>
            <button
              onClick={onBroadcast}
              className="p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl border border-white/20 transition-colors text-white text-left group"
            >
              <Send className="w-6 h-6 mb-3 text-amber-300" />
              <div className="font-semibold mb-1">Broadcast Message</div>
              <div className="text-sm text-indigo-200">Send to all chapters</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper component for Calendar icon (lucide-react doesn't have it, so we create a simple one)
function Calendar({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}
