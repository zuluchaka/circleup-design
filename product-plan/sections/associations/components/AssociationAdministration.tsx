import type { Association, Member, PendingInvitation, JoinRequest, FederationMembership } from '../types'
import { RoleBadge } from './RoleBadge'
import {
  Users,
  Settings,
  Mail,
  BarChart3,
  MessageSquare,
  Building2,
  UserPlus,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  ArrowRight,
  Shield,
  Palette,
} from 'lucide-react'

export interface AssociationAdministrationAlert {
  id: string
  type: 'warning' | 'info' | 'success'
  title: string
  description: string
  timestamp: string
  actionLabel?: string
  actionId?: string
}

export interface AssociationAdministrationProps {
  association: Association
  members: Member[]
  pendingInvitations: PendingInvitation[]
  joinRequests: JoinRequest[]
  alerts: AssociationAdministrationAlert[]
  federationMembership?: FederationMembership | null

  // Navigation callbacks
  onManageMembers?: () => void
  onManageSettings?: () => void
  onManageBranding?: () => void
  onViewInvitations?: () => void
  onViewJoinRequests?: () => void
  onViewAnalytics?: () => void
  onManageCommunication?: () => void
  onViewFederation?: () => void
  onInviteMembers?: () => void

  // Alert actions
  onAlertAction?: (alertId: string, actionId: string) => void
  onDismissAlert?: (alertId: string) => void

  // Quick actions
  onCreateAnnouncement?: () => void
  onExportData?: () => void
  onViewAuditLog?: () => void

  onBack?: () => void
}

export function AssociationAdministration({
  association,
  members,
  pendingInvitations,
  joinRequests,
  alerts,
  federationMembership,
  onManageMembers,
  onManageSettings,
  onManageBranding,
  onViewInvitations,
  onViewJoinRequests,
  onViewAnalytics,
  onManageCommunication,
  onViewFederation,
  onInviteMembers,
  onAlertAction,
  onDismissAlert,
  onCreateAnnouncement,
  onExportData,
  onViewAuditLog,
  onBack,
}: AssociationAdministrationProps) {
  const isAdmin = association.myRole === 'president' || association.myRole === 'admin' || association.myRole === 'treasurer'

  // Calculate statistics
  const activeMembers = members.filter(m => m.status === 'active').length
  const pendingMembersCount = members.filter(m => m.status === 'pending').length
  const pendingInvitationsCount = pendingInvitations.filter(i => i.status === 'pending').length
  const joinRequestsCount = joinRequests.filter(r => r.status === 'pending').length

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-CH', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getAlertIcon = (type: 'warning' | 'info' | 'success') => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="w-5 h-5" />
      case 'success':
        return <CheckCircle className="w-5 h-5" />
      case 'info':
        return <Clock className="w-5 h-5" />
    }
  }

  const getAlertColors = (type: 'warning' | 'info' | 'success') => {
    switch (type) {
      case 'warning':
        return 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100'
      case 'success':
        return 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
      case 'info':
        return 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100'
    }
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-950/20 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Access Denied
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            You need to be an administrator to access this page.
          </p>
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-slate-100 dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start justify-between gap-4">
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
              <div className="flex items-center gap-3">
                {association.logo && (
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img src={association.logo} alt={association.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    Administration
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    {association.name}
                    <span className="inline-block">
                      <RoleBadge role={association.myRole} />
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Members</div>
              <Users className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{activeMembers}</div>
            {pendingMembersCount > 0 && (
              <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                +{pendingMembersCount} pending
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Circles</div>
              <TrendingUp className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{association.activeCircles}</div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Funds</div>
              <BarChart3 className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {formatCurrency(association.totalFunds, association.currency)}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending Actions</div>
              <AlertCircle className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {pendingInvitationsCount + joinRequestsCount}
            </div>
            {(pendingInvitationsCount > 0 || joinRequestsCount > 0) && (
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {joinRequestsCount > 0 && `${joinRequestsCount} join requests`}
                {joinRequestsCount > 0 && pendingInvitationsCount > 0 && ', '}
                {pendingInvitationsCount > 0 && `${pendingInvitationsCount} invites`}
              </div>
            )}
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="mb-8 space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`rounded-lg border p-4 ${getAlertColors(alert.type)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-medium mb-1">{alert.title}</h3>
                        <p className="text-sm opacity-90">{alert.description}</p>
                      </div>
                      <button
                        onClick={() => onDismissAlert?.(alert.id)}
                        className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors flex-shrink-0"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    {alert.actionLabel && alert.actionId && (
                      <button
                        onClick={() => onAlertAction?.(alert.id, alert.actionId)}
                        className="mt-2 text-sm font-medium hover:underline inline-flex items-center gap-1"
                      >
                        {alert.actionLabel}
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Admin Sections */}
        <div className="space-y-6">
          {/* Member Management */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Member Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={onManageMembers}
                className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 hover:border-slate-300 dark:hover:border-slate-700 transition-colors text-left group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-950/30 flex items-center justify-center">
                    <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Member Directory</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  View and manage all {activeMembers} members
                </p>
              </button>

              <button
                onClick={onInviteMembers}
                className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 hover:border-slate-300 dark:hover:border-slate-700 transition-colors text-left group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Invite Members</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Send invitations via SMS, email, or WhatsApp
                </p>
              </button>

              <button
                onClick={onViewJoinRequests}
                className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 hover:border-slate-300 dark:hover:border-slate-700 transition-colors text-left group relative"
              >
                {joinRequestsCount > 0 && (
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">
                    {joinRequestsCount}
                  </div>
                )}
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Join Requests</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {joinRequestsCount > 0 ? `${joinRequestsCount} pending approval` : 'No pending requests'}
                </p>
              </button>
            </div>
          </div>

          {/* Settings & Branding */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Settings & Branding</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={onManageSettings}
                className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 hover:border-slate-300 dark:hover:border-slate-700 transition-colors text-left group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">General Settings</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Configure association details and preferences
                </p>
              </button>

              <button
                onClick={onManageBranding}
                className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 hover:border-slate-300 dark:hover:border-slate-700 transition-colors text-left group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center">
                    <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Branding</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Customize logo, colors, and visual identity
                </p>
              </button>

              <button
                onClick={onViewInvitations}
                className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 hover:border-slate-300 dark:hover:border-slate-700 transition-colors text-left group relative"
              >
                {pendingInvitationsCount > 0 && (
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center">
                    {pendingInvitationsCount}
                  </div>
                )}
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Pending Invitations</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {pendingInvitationsCount > 0 ? `${pendingInvitationsCount} invites sent` : 'No pending invitations'}
                </p>
              </button>
            </div>
          </div>

          {/* Analytics & Communication */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Analytics & Communication</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={onViewAnalytics}
                className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 hover:border-slate-300 dark:hover:border-slate-700 transition-colors text-left group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-950/30 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Analytics & Reports</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  View member growth, engagement, and trends
                </p>
              </button>

              <button
                onClick={onManageCommunication}
                className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 hover:border-slate-300 dark:hover:border-slate-700 transition-colors text-left group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-950/30 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Communication</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Manage announcements and member messaging
                </p>
              </button>

              <button
                onClick={onCreateAnnouncement}
                className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 hover:border-slate-300 dark:hover:border-slate-700 transition-colors text-left group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Create Announcement</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Post important updates to all members
                </p>
              </button>
            </div>
          </div>

          {/* Federation Management */}
          {federationMembership && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Federation</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={onViewFederation}
                  className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 hover:border-slate-300 dark:hover:border-slate-700 transition-colors text-left group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-950/30 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Federation Dashboard</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Member of {federationMembership.associationName}
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Advanced Options */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Advanced</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={onExportData}
                className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 hover:border-slate-300 dark:hover:border-slate-700 transition-colors text-left group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Export Data</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Download member lists and reports
                </p>
              </button>

              <button
                onClick={onViewAuditLog}
                className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 hover:border-slate-300 dark:hover:border-slate-700 transition-colors text-left group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Audit Log</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  View all administrative actions
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
