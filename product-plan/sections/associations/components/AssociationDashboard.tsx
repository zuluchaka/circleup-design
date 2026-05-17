import type { Association, Announcement, ActivityItem, Member } from '../types'
import { RoleBadge } from './RoleBadge'
import { ActivityFeed } from './ActivityFeed'
import { AnnouncementCard } from './AnnouncementCard'

export interface AssociationDashboardProps {
  association: Association
  announcements: Announcement[]
  activityItems: ActivityItem[]
  recentMembers?: Member[]
  onManageMembers?: () => void
  onManageSettings?: () => void
  onInviteMembers?: () => void
  onCreateAnnouncement?: () => void
  onEditAnnouncement?: (id: string) => void
  onDeleteAnnouncement?: (id: string) => void
  onViewAllActivity?: () => void
  onViewCircles?: () => void
  onViewFunds?: () => void
  onBack?: () => void
}

export function AssociationDashboard({
  association,
  announcements,
  activityItems,
  recentMembers = [],
  onManageMembers,
  onManageSettings,
  onInviteMembers,
  onCreateAnnouncement,
  onEditAnnouncement,
  onDeleteAnnouncement,
  onViewAllActivity,
  onViewCircles,
  onViewFunds,
  onBack,
}: AssociationDashboardProps) {
  const isAdmin = association.myRole === 'president' || association.myRole === 'admin'

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-CH', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Section */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-48 sm:h-64 lg:h-72 overflow-hidden">
          {association.coverImage ? (
            <img
              src={association.coverImage}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="absolute top-4 left-4 p-2 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-lg text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        )}

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto flex items-end gap-4 sm:gap-6">
            {/* Logo */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-white dark:border-slate-900 shadow-xl overflow-hidden bg-white dark:bg-slate-800 flex-shrink-0">
              {association.logo ? (
                <img
                  src={association.logo}
                  alt={association.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
                  {association.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">
                  {association.name}
                </h1>
                <RoleBadge role={association.myRole} size="md" />
              </div>
              <p className="mt-1 text-sm sm:text-base text-white/80 line-clamp-2 max-w-2xl">
                {association.description}
              </p>
            </div>

            {/* Actions - Desktop */}
            {isAdmin && (
              <div className="hidden lg:flex gap-2">
                <button
                  onClick={onInviteMembers}
                  className="px-4 py-2 text-sm font-medium text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-colors"
                >
                  Invite Members
                </button>
                <button
                  onClick={onManageSettings}
                  className="px-4 py-2 text-sm font-medium text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-colors"
                >
                  Settings
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-200 dark:divide-slate-800">
            <button
              onClick={onManageMembers}
              className="py-5 sm:py-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                {association.memberCount}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Members</p>
            </button>
            <button
              onClick={onViewCircles}
              className="py-5 sm:py-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                {association.activeCircles}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Active Circles</p>
            </button>
            <button
              onClick={onViewFunds}
              className="py-5 sm:py-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <p className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {formatCurrency(association.totalFunds, association.currency)}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Total Funds</p>
            </button>
            <div className="py-5 sm:py-6 text-center">
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                {formatDate(association.createdAt)}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Founded</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Mobile */}
      {isAdmin && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={onInviteMembers}
              className="flex-shrink-0 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Invite
            </button>
            <button
              onClick={onManageMembers}
              className="flex-shrink-0 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Members
            </button>
            <button
              onClick={onManageSettings}
              className="flex-shrink-0 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Announcements */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Announcements
                </h2>
                {isAdmin && (
                  <button
                    onClick={onCreateAnnouncement}
                    className="px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New
                  </button>
                )}
              </div>

              {announcements.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                  </div>
                  <p className="text-slate-500 dark:text-slate-500">No announcements yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <AnnouncementCard
                      key={announcement.id}
                      announcement={announcement}
                      onEdit={isAdmin ? () => onEditAnnouncement?.(announcement.id) : undefined}
                      onDelete={isAdmin ? () => onDeleteAnnouncement?.(announcement.id) : undefined}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Recent Members */}
            {recentMembers.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Recent Members
                  </h2>
                  <button
                    onClick={onManageMembers}
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                  >
                    View all
                  </button>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                  {recentMembers.slice(0, 5).map((member) => (
                    <div key={member.id} className="px-4 py-3 flex items-center gap-3">
                      {member.avatarUrl ? (
                        <img
                          src={member.avatarUrl}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 font-medium">
                          {member.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          {member.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                          Joined {new Date(member.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <RoleBadge role={member.role} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ActivityFeed activities={activityItems} onViewAll={onViewAllActivity} />

            {/* Association Info Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Details</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500 dark:text-slate-500">Type</dt>
                  <dd className="text-slate-900 dark:text-white font-medium capitalize">
                    {association.type}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500 dark:text-slate-500">Visibility</dt>
                  <dd className="text-slate-900 dark:text-white font-medium capitalize">
                    {association.visibility.replace('_', ' ')}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500 dark:text-slate-500">Language</dt>
                  <dd className="text-slate-900 dark:text-white font-medium">
                    {association.language.toUpperCase()}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500 dark:text-slate-500">Country</dt>
                  <dd className="text-slate-900 dark:text-white font-medium">
                    {association.country}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500 dark:text-slate-500">Terminology</dt>
                  <dd className="text-slate-900 dark:text-white font-medium capitalize">
                    {association.settings.culturalTerminology}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
