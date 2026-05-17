import type { AnnouncementsListProps, Announcement } from '@/../product/sections/communication-and-events/types'

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return formatDate(dateString)
}

function getPriorityStyles(priority: string) {
  switch (priority) {
    case 'urgent':
      return {
        badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        border: 'border-l-red-500',
        icon: 'text-red-500',
      }
    case 'high':
      return {
        badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        border: 'border-l-amber-500',
        icon: 'text-amber-500',
      }
    default:
      return {
        badge: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
        border: 'border-l-slate-300 dark:border-l-slate-600',
        icon: 'text-slate-400',
      }
  }
}

function AnnouncementCard({
  announcement,
  onAcknowledge,
  onView,
}: {
  announcement: Announcement
  onAcknowledge: (id: string) => void
  onView: (announcement: Announcement) => void
}) {
  const priorityStyles = getPriorityStyles(announcement.priority)
  const isAcknowledged = announcement.acknowledgedBy.includes('current-user')

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 border-l-4 ${priorityStyles.border} overflow-hidden hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-shadow cursor-pointer`}
      onClick={() => onView(announcement)}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <img
              src={announcement.author.avatar}
              alt=""
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium text-slate-900 dark:text-white">
                {announcement.author.name}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {formatRelativeTime(announcement.publishedAt || announcement.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(announcement.priority === 'high' || announcement.priority === 'urgent') && (
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${priorityStyles.badge}`}>
                {announcement.priority === 'urgent' ? 'Urgent' : 'Important'}
              </span>
            )}
            {announcement.status === 'scheduled' && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                Scheduled
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          {announcement.title}
        </h3>
        <div className="prose prose-sm prose-slate dark:prose-invert max-w-none mb-4">
          <p className="text-slate-600 dark:text-slate-300 line-clamp-3 whitespace-pre-line">
            {announcement.content.replace(/\*\*/g, '').replace(/\n\n/g, ' ')}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-4">
            {announcement.requiresAcknowledgment && (
              <div className="flex items-center gap-2 text-sm">
                <div className="flex -space-x-1">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-600 border-2 border-white dark:border-slate-800"
                    />
                  ))}
                </div>
                <span className="text-slate-500 dark:text-slate-400">
                  {announcement.acknowledgedBy.length} acknowledged
                </span>
              </div>
            )}
            {announcement.expiresAt && (
              <span className="text-xs text-slate-400 dark:text-slate-500">
                Expires {formatDate(announcement.expiresAt)}
              </span>
            )}
          </div>

          {announcement.requiresAcknowledgment && !isAcknowledged && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAcknowledge(announcement.id)
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Acknowledge
            </button>
          )}
          {announcement.requiresAcknowledgment && isAcknowledged && (
            <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Acknowledged
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export function Announcements({
  announcements,
  onAcknowledge,
  onView,
}: AnnouncementsListProps) {
  const urgentAnnouncements = announcements.filter(
    (a) => a.priority === 'urgent' && a.status === 'published'
  )
  const importantAnnouncements = announcements.filter(
    (a) => a.priority === 'high' && a.status === 'published'
  )
  const regularAnnouncements = announcements.filter(
    (a) => (a.priority === 'normal' || a.priority === 'low') && a.status === 'published'
  )

  const pendingAcknowledgments = announcements.filter(
    (a) => a.requiresAcknowledgment && !a.acknowledgedBy.includes('current-user') && a.status === 'published'
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Announcements
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {pendingAcknowledgments.length > 0
                ? `${pendingAcknowledgments.length} pending acknowledgment`
                : 'Stay informed about your community'}
            </p>
          </div>
        </div>

        {/* Pending Acknowledgments Alert */}
        {pendingAcknowledgments.length > 0 && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-xl">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-200">
                  Action Required
                </p>
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  You have {pendingAcknowledgments.length} announcement{pendingAcknowledgments.length !== 1 ? 's' : ''} that require your acknowledgment
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Urgent Announcements */}
        {urgentAnnouncements.length > 0 && (
          <div className="mb-8">
            <h2 className="flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400 uppercase tracking-wider mb-4">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Urgent
            </h2>
            <div className="space-y-4">
              {urgentAnnouncements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  onAcknowledge={onAcknowledge}
                  onView={onView}
                />
              ))}
            </div>
          </div>
        )}

        {/* Important Announcements */}
        {importantAnnouncements.length > 0 && (
          <div className="mb-8">
            <h2 className="flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-4">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Important
            </h2>
            <div className="space-y-4">
              {importantAnnouncements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  onAcknowledge={onAcknowledge}
                  onView={onView}
                />
              ))}
            </div>
          </div>
        )}

        {/* Regular Announcements */}
        {regularAnnouncements.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
              Recent Announcements
            </h2>
            <div className="space-y-4">
              {regularAnnouncements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  onAcknowledge={onAcknowledge}
                  onView={onView}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {announcements.filter((a) => a.status === 'published').length === 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
              No announcements
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Check back later for updates from your association
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
