import { useState } from 'react'
import type {
  CircleManagementProps,
  ParticipantStatus,
  InvitationStatus,
  DisputeStatus,
} from '../types'

const participantStatusColors: Record<ParticipantStatus, string> = {
  active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  suspended: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  removed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

const invitationStatusColors: Record<InvitationStatus, string> = {
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  accepted: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  declined: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  expired: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400',
}

export function CircleManagement({
  circle,
  participants,
  waitlist,
  invitations,
  disputes,
  onPauseCircle,
  onExtendCircle,
  onRemoveMember,
  onSuspendMember,
  onPromoteFromWaitlist,
  onSendInvitation,
  onCancelInvitation,
}: CircleManagementProps) {
  const [activeTab, setActiveTab] = useState<'members' | 'waitlist' | 'invitations' | 'disputes' | 'settings'>('members')
  const [actionMemberId, setActionMemberId] = useState<string | null>(null)
  const [actionReason, setActionReason] = useState('')
  const [extensionCycles, setExtensionCycles] = useState(1)

  const participantsList = participants || []
  const invitationsList = invitations || []
  const disputesList = disputes || []
  const waitlistItems = waitlist || []

  const activeParticipants = participantsList.filter((p) => p.status === 'active')
  const pendingInvitations = invitationsList.filter((i) => i.status === 'pending')
  const openDisputes = disputesList.filter((d) => d.status !== 'resolved')

  const tabs = [
    { id: 'members', label: 'Members', count: activeParticipants.length },
    { id: 'waitlist', label: 'Waitlist', count: waitlistItems.length },
    { id: 'invitations', label: 'Invitations', count: pendingInvitations.length },
    { id: 'disputes', label: 'Disputes', count: openDisputes.length },
    { id: 'settings', label: 'Settings', count: null },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Manage Circle
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            {circle.name}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-6 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                {tab.label}
                {tab.count !== null && tab.count > 0 && (
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    activeTab === tab.id
                      ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Members ({participantsList.length}/{circle.maxParticipants})
                </h2>
                <button
                  onClick={() => setActiveTab('invitations')}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors"
                >
                  Invite Members
                </button>
              </div>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {participantsList.map((participant) => (
                <div key={participant.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {participant.avatar ? (
                        <img
                          src={participant.avatar}
                          alt={participant.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 font-medium">
                          {participant.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-slate-900 dark:text-white">
                            {participant.name}
                          </p>
                          {participant.role === 'organizer' && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                              Organizer
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Position #{participant.payoutPosition || 'TBD'} • Joined {new Date(participant.joinedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${participantStatusColors[participant.status]}`}>
                        {participant.status}
                      </span>
                      {participant.role !== 'organizer' && actionMemberId !== participant.id && (
                        <button
                          onClick={() => setActionMemberId(participant.id)}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  {actionMemberId === participant.id && (
                    <div className="mt-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                      <textarea
                        value={actionReason}
                        onChange={(e) => setActionReason(e.target.value)}
                        placeholder="Reason for action..."
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-indigo-500 mb-3"
                      />
                      <div className="flex gap-2">
                        {participant.status === 'active' && onSuspendMember && (
                          <button
                            onClick={() => {
                              onSuspendMember(participant.id, actionReason)
                              setActionMemberId(null)
                              setActionReason('')
                            }}
                            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium transition-colors"
                          >
                            Suspend
                          </button>
                        )}
                        {onRemoveMember && (
                          <button
                            onClick={() => {
                              onRemoveMember(participant.id, actionReason)
                              setActionMemberId(null)
                              setActionReason('')
                            }}
                            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
                          >
                            Remove
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setActionMemberId(null)
                            setActionReason('')
                          }}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Waitlist Tab */}
        {activeTab === 'waitlist' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Waitlist ({waitlistItems.length})
            </h2>
            {waitlistItems.length === 0 ? (
              <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                No one is on the waitlist
              </p>
            ) : (
              <div className="space-y-3">
                {waitlistItems.map((entry, idx) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-medium">
                        {idx + 1}
                      </span>
                      {entry.userAvatar ? (
                        <img src={entry.userAvatar} alt={entry.userName} className="w-10 h-10 rounded-full" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-400 font-medium">
                          {entry.userName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{entry.userName}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Trust Score: {entry.userTrustScore} • Joined {new Date(entry.joinedWaitlistAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {circle.currentParticipants < circle.maxParticipants && onPromoteFromWaitlist && (
                      <button
                        onClick={() => onPromoteFromWaitlist(entry.id)}
                        className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-colors"
                      >
                        Promote
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Invitations Tab */}
        {activeTab === 'invitations' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Pending Invitations ({pendingInvitations.length})
              </h2>
              {pendingInvitations.length === 0 ? (
                <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                  No pending invitations
                </p>
              ) : (
                <div className="space-y-3">
                  {pendingInvitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50"
                    >
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {invitation.invitedName || invitation.invitedEmail}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Sent via {invitation.channel} • Expires {new Date(invitation.expiresAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${invitationStatusColors[invitation.status]}`}>
                          {invitation.status}
                        </span>
                        {onCancelInvitation && (
                          <button
                            onClick={() => onCancelInvitation(invitation.id)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Circle Status */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Circle Status
              </h2>
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 mb-4">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    Current Status: <span className="capitalize">{circle.status}</span>
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Cycle {circle.currentCycle} of {circle.duration}
                  </p>
                </div>
                {onPauseCircle && circle.status === 'active' && (
                  <button
                    onClick={onPauseCircle}
                    className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm transition-colors"
                  >
                    Pause Circle
                  </button>
                )}
              </div>
            </div>

            {/* Extend Circle */}
            {onExtendCircle && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Extend Circle
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Add more cycles to the circle after the current rotation completes.
                </p>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    value={extensionCycles}
                    onChange={(e) => setExtensionCycles(Number(e.target.value))}
                    min={1}
                    max={12}
                    className="w-24 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-slate-600 dark:text-slate-400">additional cycles</span>
                  <button
                    onClick={() => onExtendCircle(extensionCycles)}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors"
                  >
                    Extend
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
