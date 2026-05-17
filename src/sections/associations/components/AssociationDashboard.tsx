import { useState, useEffect } from 'react'
import type { Association, Announcement, ActivityItem, Member, PendingInvitation, JoinRequest } from '@/../product/sections/associations/types'
import { RoleBadge } from './RoleBadge'
import { ActivityFeed } from './ActivityFeed'
import { AnnouncementCard } from './AnnouncementCard'
import { PresidentDashboardWidgets } from './PresidentDashboardWidgets'
import { AssociationLedgerDashboard } from './AssociationLedgerDashboard'

export interface AssociationDashboardProps {
  association: Association
  announcements: Announcement[]
  activityItems: ActivityItem[]
  recentMembers?: Member[]
  pendingInvitations?: number
  pendingInvitationsList?: PendingInvitation[]
  joinRequests?: number
  joinRequestsList?: JoinRequest[]
  onManageMembers?: () => void
  onManageSettings?: () => void
  onInviteMembers?: () => void
  onCreateCircle?: () => void
  onCreateAnnouncement?: (data: { title: string; content: string; priority: string; scheduledAt?: string }) => void
  onSaveDraftAnnouncement?: (data: { title: string; content: string; priority: string }) => void
  onEditAnnouncement?: (id: string) => void
  onDeleteAnnouncement?: (id: string) => void
  onViewAllActivity?: () => void
  onViewCircles?: () => void
  onViewFunds?: () => void
  onViewMember?: (memberId: string) => void
  onViewInvitations?: () => void
  onViewJoinRequests?: () => void
  onCancelInvitation?: (id: string) => void
  onResendInvitation?: (id: string) => void
  onApproveJoinRequest?: (id: string) => void
  onRejectJoinRequest?: (id: string) => void
  onRefreshActivity?: () => void
  onBack?: () => void
  documents?: Array<{
    id: string
    title: string
    description: string
    category: string
    permissions: { visibility: string }
    uploadedBy: { id: string; name: string } | null
    createdAt: string
  }>
  onViewDocuments?: () => void
  onViewDocument?: (docId: string) => void
  onNavigateFinancial?: (view: string) => void
  onSubscriptionPaid?: () => void
  onViewFinances?: () => void
  onViewMemberLedger?: () => void
}

export function AssociationDashboard({
  association,
  announcements,
  activityItems,
  recentMembers = [],
  pendingInvitations = 0,
  pendingInvitationsList = [],
  joinRequests = 0,
  joinRequestsList = [],
  onManageMembers,
  onManageSettings,
  onInviteMembers,
  onCreateCircle,
  onCreateAnnouncement,
  onSaveDraftAnnouncement,
  onEditAnnouncement,
  onDeleteAnnouncement,
  onViewAllActivity,
  onViewCircles,
  onViewFunds,
  onViewMember,
  onViewInvitations,
  onViewJoinRequests,
  onCancelInvitation,
  onResendInvitation,
  onApproveJoinRequest,
  onRejectJoinRequest,
  onRefreshActivity,
  onBack,
  documents = [],
  onViewDocuments,
  onViewDocument,
  onNavigateFinancial,
  onSubscriptionPaid,
  onViewFinances,
  onViewMemberLedger,
}: AssociationDashboardProps) {
  const isAdmin = ['president', 'organizer', 'admin'].includes(association.myRole)
  const isTreasurer = association.myRole === 'treasurer'
  const isLeadership = isAdmin || isTreasurer || association.myRole === 'secretary'

  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newPriority, setNewPriority] = useState('medium')
  const [scheduledAt, setScheduledAt] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [memberSearch, setMemberSearch] = useState('')
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null)
  const [confirmReject, setConfirmReject] = useState<string | null>(null)

  useEffect(() => {
    if (!onRefreshActivity) return
    const interval = setInterval(() => onRefreshActivity(), 30000)
    return () => clearInterval(interval)
  }, [onRefreshActivity])

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-CH', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays}d ago`
    return formatShortDate(dateString)
  }

  const filteredInvitations = pendingInvitationsList.filter((i) => i.status === 'pending')
  const filteredRequests = joinRequestsList.filter((r) => r.status === 'pending')

  const resetForm = () => {
    setNewTitle('')
    setNewContent('')
    setNewPriority('medium')
    setScheduledAt('')
    setShowAnnouncementForm(false)
  }

  const handlePublishAnnouncement = () => {
    if (!newTitle.trim() || !newContent.trim()) return
    onCreateAnnouncement?.({
      title: newTitle,
      content: newContent,
      priority: newPriority,
      ...(scheduledAt ? { scheduledAt } : {}),
    })
    resetForm()
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Section */}
      <div className="relative">
        <div className="h-48 sm:h-64 lg:h-72 overflow-hidden">
          {association.coverImage ? (
            <img src={association.coverImage} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

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

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto flex items-end gap-4 sm:gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-white dark:border-slate-900 shadow-xl overflow-hidden bg-white dark:bg-slate-800 flex-shrink-0">
              {association.logo ? (
                <img src={association.logo} alt={association.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
                  {association.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">{association.name}</h1>
                <RoleBadge role={association.myRole} size="md" />
              </div>
              <p className="mt-1 text-sm sm:text-base text-white/80 line-clamp-2 max-w-2xl">{association.description}</p>
              {association.businessRelationship?.circleManagerName && (
                <p className="mt-1 text-xs sm:text-sm text-white/60 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Circle Manager: {association.businessRelationship.circleManagerName}
                </p>
              )}
            </div>
            {isLeadership && (
              <div className="hidden lg:flex gap-2">
                <button onClick={onCreateCircle} className="px-4 py-2 text-sm font-medium text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-colors">New Circle</button>
                <button onClick={onInviteMembers} className="px-4 py-2 text-sm font-medium text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-colors">Invite Members</button>
                <button onClick={onManageSettings} className="px-4 py-2 text-sm font-medium text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-colors">Settings</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-200 dark:divide-slate-800">
            <button onClick={onManageMembers} className="py-5 sm:py-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{association.memberCount}</p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Members</p>
            </button>
            <button onClick={onViewCircles} className="py-5 sm:py-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{association.activeCircles}</p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Active Circles</p>
            </button>
            <button onClick={onViewFunds} className="py-5 sm:py-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <p className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(association.totalFunds, association.currency)}</p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Total Funds</p>
            </button>
            <div className="py-5 sm:py-6 text-center">
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{formatDate(association.createdAt)}</p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Founded</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Mobile */}
      {isLeadership && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3">
          <div className="flex gap-2 overflow-x-auto">
            <button onClick={onCreateCircle} className="flex-shrink-0 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              New Circle
            </button>
            <button onClick={onInviteMembers} className="flex-shrink-0 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
              Invite
            </button>
            <button onClick={onManageMembers} className="flex-shrink-0 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Members
            </button>
            <button onClick={onManageSettings} className="flex-shrink-0 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Settings
            </button>
          </div>
        </div>
      )}

      {/* President Dashboard Widgets (AP-US011) */}
      {association.myRole === 'president' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <PresidentDashboardWidgets associationId={association.id} />
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
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Announcements</h2>
                {isAdmin && (
                  <button
                    onClick={() => setShowAnnouncementForm((v) => !v)}
                    className="px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    New
                  </button>
                )}
              </div>

              {showAnnouncementForm && (
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-indigo-200 dark:border-indigo-800 p-4 mb-4 space-y-3">
                  <input
                    type="text"
                    placeholder="Announcement title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <textarea
                    placeholder="Announcement content..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1">
                      <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Schedule (optional)</label>
                      <input
                        type="datetime-local"
                        value={scheduledAt}
                        onChange={(e) => setScheduledAt(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={resetForm}
                      className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    {onSaveDraftAnnouncement && (
                      <button
                        onClick={() => {
                          onSaveDraftAnnouncement({ title: newTitle, content: newContent, priority: newPriority })
                          resetForm()
                        }}
                        disabled={!newTitle.trim() || !newContent.trim()}
                        className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                      >
                        Save Draft
                      </button>
                    )}
                    <button
                      onClick={handlePublishAnnouncement}
                      disabled={!newTitle.trim() || !newContent.trim()}
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                    >
                      {scheduledAt ? 'Schedule' : 'Publish'}
                    </button>
                  </div>
                </div>
              )}

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
                    <div key={announcement.id}>
                      <AnnouncementCard
                        announcement={announcement}
                        onEdit={isAdmin ? () => onEditAnnouncement?.(announcement.id) : undefined}
                        onDelete={isAdmin ? () => setDeleteConfirmId(announcement.id) : undefined}
                      />
                      {deleteConfirmId === announcement.id && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mt-2 flex items-center justify-between">
                          <p className="text-sm text-red-700 dark:text-red-400">Delete this announcement?</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => { onDeleteAnnouncement?.(announcement.id); setDeleteConfirmId(null) }}
                              className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Invitations Sent */}
            {isLeadership && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Invitations Sent</h2>
                    {filteredInvitations.length > 0 && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
                        {filteredInvitations.length}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={onInviteMembers}
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                  >
                    Invite members
                  </button>
                </div>

                {filteredInvitations.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 text-center">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">No pending invitations</p>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredInvitations.slice(0, 5).map((invitation) => (
                        <div key={invitation.id} className="px-4 py-3">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                    {invitation.invitedName || invitation.email || invitation.phone}
                                  </p>
                                  {invitation.invitedName && invitation.email && (
                                    <p className="text-xs text-slate-500 dark:text-slate-500 truncate">
                                      {invitation.email}
                                    </p>
                                  )}
                                </div>
                                <span className="text-xs text-slate-400 dark:text-slate-600 flex-shrink-0">
                                  {formatRelativeTime(invitation.invitedAt)}
                                </span>
                              </div>
                              <div className="mt-2 flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full border border-amber-200 dark:border-amber-800/40">
                                  <span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />
                                  Awaiting response
                                </span>
                                {invitation.role && invitation.role !== 'member' && (
                                  <span className="px-1.5 py-0.5 text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full capitalize">
                                    {invitation.role}
                                  </span>
                                )}
                              </div>
                              <div className="mt-2 flex items-center gap-1.5">
                                <button
                                  onClick={() => onResendInvitation?.(invitation.id)}
                                  className="px-2.5 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md transition-colors"
                                >
                                  Resend
                                </button>
                                {confirmCancel === invitation.id ? (
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs text-slate-500">Cancel?</span>
                                    <button
                                      onClick={() => { onCancelInvitation?.(invitation.id); setConfirmCancel(null) }}
                                      className="px-2 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors"
                                    >
                                      Yes
                                    </button>
                                    <button
                                      onClick={() => setConfirmCancel(null)}
                                      className="px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                                    >
                                      No
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setConfirmCancel(invitation.id)}
                                    className="px-2.5 py-1 text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                                  >
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={onViewInvitations}
                      className="w-full px-4 py-3 text-center text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-t border-slate-100 dark:border-slate-800"
                    >
                      View all invitations{filteredInvitations.length > 5 ? ` (${filteredInvitations.length})` : ''}
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* Join Requests Received */}
            {isLeadership && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Join Requests</h2>
                    {filteredRequests.length > 0 && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                        {filteredRequests.length}
                      </span>
                    )}
                  </div>
                </div>

                {filteredRequests.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 text-center">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">No pending join requests</p>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredRequests.slice(0, 5).map((request) => (
                        <div key={request.id} className="px-4 py-3">
                          <div className="flex items-start gap-3">
                            {request.userAvatarUrl ? (
                              <img
                                src={request.userAvatarUrl}
                                alt=""
                                className="w-9 h-9 rounded-full object-cover flex-shrink-0 mt-0.5"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5 text-blue-600 dark:text-blue-400 text-sm font-medium">
                                {request.userName.charAt(0)}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                    {request.userName}
                                  </p>
                                  <p className="text-xs text-slate-500 dark:text-slate-500 truncate">
                                    {request.userEmail}
                                  </p>
                                </div>
                                <span className="text-xs text-slate-400 dark:text-slate-600 flex-shrink-0">
                                  {formatRelativeTime(request.requestedAt)}
                                </span>
                              </div>
                              <div className="mt-1.5">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full border border-blue-200 dark:border-blue-800/40">
                                  <span className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" />
                                  Awaiting approval
                                </span>
                              </div>
                              {request.message && (
                                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 italic line-clamp-2">
                                  &ldquo;{request.message}&rdquo;
                                </p>
                              )}
                              <div className="mt-2 flex items-center gap-1.5">
                                <button
                                  onClick={() => onApproveJoinRequest?.(request.id)}
                                  className="px-2.5 py-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
                                >
                                  Approve
                                </button>
                                {confirmReject === request.id ? (
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs text-slate-500">Decline?</span>
                                    <button
                                      onClick={() => { onRejectJoinRequest?.(request.id); setConfirmReject(null) }}
                                      className="px-2 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors"
                                    >
                                      Yes
                                    </button>
                                    <button
                                      onClick={() => setConfirmReject(null)}
                                      className="px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                                    >
                                      No
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setConfirmReject(request.id)}
                                    className="px-2.5 py-1 text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                                  >
                                    Decline
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={onViewJoinRequests}
                      className="w-full px-4 py-3 text-center text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-t border-slate-100 dark:border-slate-800"
                    >
                      View all requests{filteredRequests.length > 5 ? ` (${filteredRequests.length})` : ''}
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* Documents */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Documents</h2>
                  {documents.length > 0 && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full">
                      {documents.length}
                    </span>
                  )}
                </div>
                {onViewDocuments && (
                  <button onClick={onViewDocuments} className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">
                    View all
                  </button>
                )}
              </div>

              {documents.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 text-center">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">No documents yet</p>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {documents.slice(0, 5).map((doc) => (
                      <button key={doc.id} onClick={() => onViewDocument?.(doc.id)} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          doc.category === 'agreements' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                          doc.category === 'minutes' ? 'bg-blue-100 dark:bg-blue-900/30' :
                          doc.category === 'financial' ? 'bg-amber-100 dark:bg-amber-900/30' :
                          doc.category === 'policies' ? 'bg-purple-100 dark:bg-purple-900/30' :
                          'bg-slate-100 dark:bg-slate-800'
                        }`}>
                          <svg className={`w-4 h-4 ${
                            doc.category === 'agreements' ? 'text-emerald-600 dark:text-emerald-400' :
                            doc.category === 'minutes' ? 'text-blue-600 dark:text-blue-400' :
                            doc.category === 'financial' ? 'text-amber-600 dark:text-amber-400' :
                            doc.category === 'policies' ? 'text-purple-600 dark:text-purple-400' :
                            'text-slate-500 dark:text-slate-400'
                          }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{doc.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded-full capitalize ${
                              doc.category === 'agreements' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' :
                              doc.category === 'minutes' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
                              doc.category === 'financial' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' :
                              doc.category === 'policies' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' :
                              'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                            }`}>
                              {doc.category || 'general'}
                            </span>
                            {doc.permissions.visibility === 'organizers_only' && (
                              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full">
                                Governance only
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400 dark:text-slate-600">
                              {new Date(doc.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Financial Activity */}
            <section>
              <AssociationLedgerDashboard
                associationId={association.id}
                onNavigate={(view) => onNavigateFinancial?.(view)}
                subscriptionTier={association.businessRelationship?.subscriptionTier}
                subscriptionCurrency={association.businessRelationship?.feeAgreement?.currency as string | undefined}
                subscriptionPaidUntil={association.businessRelationship?.subscriptionPaidUntil}
                recentBillingRecords={association.businessRelationship?.recentBillingRecords}
                onSubscriptionPaid={onSubscriptionPaid}
              />
              <div className="mt-4 flex flex-wrap gap-3">
                {onViewFinances && (
                  <button
                    onClick={onViewFinances}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-sm font-medium rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    My Finances
                  </button>
                )}
                {(isAdmin || isTreasurer) && onViewMemberLedger && (
                  <button
                    onClick={onViewMemberLedger}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-sm font-medium rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    Member Ledger
                  </button>
                )}
              </div>
            </section>

            {/* Recent Members */}
            {recentMembers.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Members</h2>
                  <button onClick={onManageMembers} className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">View all</button>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <input
                      type="text"
                      placeholder="Search members..."
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {recentMembers
                      .filter((m) => m.status === 'active')
                      .filter((m) => !memberSearch || m.name.toLowerCase().includes(memberSearch.toLowerCase()) || m.email.toLowerCase().includes(memberSearch.toLowerCase()))
                      .slice(0, 5)
                      .map((member) => (
                      <button
                        key={member.id}
                        onClick={() => onViewMember?.(member.id)}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        {member.avatarUrl ? (
                          <img src={member.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 font-medium">
                            {member.name.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{member.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-500">
                            Joined {new Date(member.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                        <RoleBadge role={member.role} />
                      </button>
                    ))}
                    {memberSearch && recentMembers.filter((m) => m.status === 'active').filter((m) => m.name.toLowerCase().includes(memberSearch.toLowerCase()) || m.email.toLowerCase().includes(memberSearch.toLowerCase())).length === 0 && (
                      <div className="px-4 py-6 text-center text-sm text-slate-500">No members match your search</div>
                    )}
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ActivityFeed activities={activityItems} onViewAll={onViewAllActivity} />

            {/* Membership Pipeline */}
            {isLeadership && (pendingInvitations > 0 || joinRequests > 0) && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Membership Pipeline</h3>
                <div className="space-y-3">
                  {pendingInvitations > 0 && (
                    <button
                      onClick={onViewInvitations}
                      className="w-full flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                          <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-amber-800 dark:text-amber-300">Pending Invitations</span>
                      </div>
                      <span className="text-lg font-bold text-amber-600 dark:text-amber-400">{pendingInvitations}</span>
                    </button>
                  )}
                  {joinRequests > 0 && (
                    <button
                      onClick={onViewJoinRequests}
                      className="w-full flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Join Requests</span>
                      </div>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{joinRequests}</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Governance & Details */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Governance & Details</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500 dark:text-slate-500">Type</dt>
                  <dd className="text-slate-900 dark:text-white font-medium capitalize">{association.type}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500 dark:text-slate-500">Status</dt>
                  <dd>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${
                      association.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      association.status === 'draft' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                      'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        association.status === 'active' ? 'bg-emerald-500' :
                        association.status === 'draft' ? 'bg-amber-500' : 'bg-slate-400'
                      }`} />
                      {association.status ? association.status.charAt(0).toUpperCase() + association.status.slice(1) : 'Active'}
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500 dark:text-slate-500">Visibility</dt>
                  <dd className="text-slate-900 dark:text-white font-medium capitalize">{association.visibility.replace('_', ' ')}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500 dark:text-slate-500">Approval</dt>
                  <dd className="text-slate-900 dark:text-white font-medium">
                    {association.settings.requireApproval ? 'Admin Approval' : association.settings.allowPublicJoin ? 'Auto-Approve' : 'Invite Only'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500 dark:text-slate-500">Language</dt>
                  <dd className="text-slate-900 dark:text-white font-medium">{association.language.toUpperCase()}</dd>
                </div>
                {association.country && (
                  <div className="flex justify-between">
                    <dt className="text-slate-500 dark:text-slate-500">Country</dt>
                    <dd className="text-slate-900 dark:text-white font-medium">{association.country}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-slate-500 dark:text-slate-500">Terminology</dt>
                  <dd className="text-slate-900 dark:text-white font-medium capitalize">{association.settings.culturalTerminology}</dd>
                </div>
              </dl>
              {isLeadership && (
                <button
                  onClick={onManageSettings}
                  className="mt-4 w-full px-3 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-colors text-center"
                >
                  Manage Settings
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
