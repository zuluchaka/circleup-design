import { useState } from 'react'
import { Settings, Users, Clock, Mail, AlertTriangle } from 'lucide-react'
import type {
  CircleManagementProps,
  ParticipantStatus,
  InvitationStatus,
} from '@/../product/sections/rosca-circles/types'

const participantStatusColors: Record<ParticipantStatus, string> = {
  active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  suspended: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  removed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

const invitationStatusColors: Record<InvitationStatus, string> = {
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  sent: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
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
  onBack,
  onRemoveMember,
  onSuspendMember,
  onPromoteFromWaitlist,
  onSendInvitation,
  onCancelInvitation,
}: CircleManagementProps) {
  const [activeTab, setActiveTab] = useState<'members' | 'waitlist' | 'invitations' | 'disputes'>('members')
  const [actionMemberId, setActionMemberId] = useState<string | null>(null)
  const [actionReason, setActionReason] = useState('')
  const [inviteEmailInput, setInviteEmailInput] = useState('')
  const [inviteEmails, setInviteEmails] = useState<string[]>([])
  const [inviteMessage, setInviteMessage] = useState('')
  const [inviteSending, setInviteSending] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null)

  const addInviteEmails = (raw: string) => {
    const parsed = raw.split(/[,;\s]+/).map(e => e.trim().toLowerCase()).filter(e => e && e.includes('@'))
    const unique = parsed.filter(e => !inviteEmails.includes(e))
    if (unique.length > 0) setInviteEmails(prev => [...prev, ...unique])
  }

  const handleInviteKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ';') {
      e.preventDefault()
      if (inviteEmailInput.trim()) {
        addInviteEmails(inviteEmailInput)
        setInviteEmailInput('')
      }
    } else if (e.key === 'Backspace' && !inviteEmailInput && inviteEmails.length > 0) {
      setInviteEmails(prev => prev.slice(0, -1))
    }
  }

  const handleInviteBlur = () => {
    if (inviteEmailInput.trim()) {
      addInviteEmails(inviteEmailInput)
      setInviteEmailInput('')
    }
  }

  const handleInvitePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    addInviteEmails(e.clipboardData.getData('text'))
    setInviteEmailInput('')
  }

  const removeInviteEmail = (emailToRemove: string) => {
    setInviteEmails(prev => prev.filter(e => e !== emailToRemove))
  }

  const hasInviteRecipient = inviteEmails.length > 0 || (inviteEmailInput.trim().includes('@'))

  const participantsList = participants || []
  const invitationsList = invitations || []
  const disputesList = disputes || []
  const waitlistItems = waitlist || []

  const activeParticipants = participantsList.filter((p) => p.status === 'active')
  const pendingInvitations = invitationsList.filter((i) => i.status === 'pending' || i.status === 'sent')
  const openDisputes = disputesList.filter((d) => d.status !== 'resolved')

  const tabs: { id: 'members' | 'waitlist' | 'invitations' | 'disputes'; label: string; count: number | null; icon: typeof Users }[] = [
    { id: 'members', label: 'Members', count: activeParticipants.length, icon: Users },
    { id: 'waitlist', label: 'Waitlist', count: waitlistItems.length, icon: Clock },
    { id: 'invitations', label: 'Invitations', count: pendingInvitations.length, icon: Mail },
    { id: 'disputes', label: 'Disputes', count: openDisputes.length, icon: AlertTriangle },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Settings className="w-6 h-6 text-indigo-500" />
                  Circle Participants
                </h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {circle.name}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Members', value: `${activeParticipants.length}/${circle.maxParticipants}`, color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' },
              { label: 'Waitlist', value: waitlistItems.length, color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400' },
              { label: 'Pending Invites', value: pendingInvitations.length, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' },
              { label: 'Open Disputes', value: openDisputes.length, color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' },
            ].map((stat) => (
              <div key={stat.label} className={`rounded-xl px-4 py-3 ${stat.color}`}>
                <div className="text-2xl font-bold truncate">{stat.value}</div>
                <p className="text-sm font-medium mt-0.5 opacity-80">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Tab pills */}
          <div className="mt-6 flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                  {tab.count !== null && tab.count > 0 && (
                    <span className={`ml-0.5 px-1.5 py-0.5 text-xs rounded-full ${
                      activeTab === tab.id
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
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
                          {(participant.name || '?').charAt(0)}
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
                          Position #{participant.payoutPosition || (participant.role === 'organizer' ? '1' : 'TBD')} • Joined {new Date(participant.joinedAt).toLocaleDateString()}
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
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
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
                          {(entry.userName || '?').charAt(0)}
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
            {/* Send Invitation Form */}
            {onSendInvitation && (
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Send Invitation
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Email Addresses
                    </label>
                    <div
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 flex flex-wrap gap-1.5 items-center cursor-text"
                      onClick={(e) => {
                        const input = (e.currentTarget as HTMLElement).querySelector('input')
                        input?.focus()
                      }}
                    >
                      {inviteEmails.map((addr) => (
                        <span
                          key={addr}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-sm"
                        >
                          {addr}
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeInviteEmail(addr) }}
                            className="ml-0.5 text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-200"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        value={inviteEmailInput}
                        onChange={(e) => { setInviteEmailInput(e.target.value); setInviteError(null); setInviteSuccess(null) }}
                        onKeyDown={handleInviteKeyDown}
                        onBlur={handleInviteBlur}
                        onPaste={handleInvitePaste}
                        placeholder={inviteEmails.length === 0 ? 'Enter emails separated by commas or press Enter' : ''}
                        className="flex-1 min-w-[200px] bg-transparent outline-none text-slate-900 dark:text-white placeholder-slate-400 text-sm py-0.5"
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Press Enter or comma to add. Paste multiple emails at once.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Personal Message <span className="text-slate-400">(optional)</span>
                    </label>
                    <textarea
                      value={inviteMessage}
                      onChange={(e) => setInviteMessage(e.target.value)}
                      rows={2}
                      placeholder="Add a personal note..."
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  {inviteError && (
                    <p className="text-sm text-red-600 dark:text-red-400">{inviteError}</p>
                  )}
                  {inviteSuccess && (
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">{inviteSuccess}</p>
                  )}
                  <button
                    onClick={() => {
                      const allEmails = [...inviteEmails]
                      if (inviteEmailInput.trim().includes('@')) {
                        allEmails.push(inviteEmailInput.trim().toLowerCase())
                      }
                      if (allEmails.length === 0) {
                        setInviteError('Please enter at least one email address')
                        return
                      }
                      setInviteSending(true)
                      setInviteError(null)
                      setInviteSuccess(null)
                      const msg = inviteMessage || undefined
                      const results: { sent: string[]; failed: string[] } = { sent: [], failed: [] }
                      let chain = Promise.resolve()
                      for (const email of allEmails) {
                        chain = chain.then(() =>
                          Promise.resolve(onSendInvitation(email, undefined, msg))
                            .then(() => { results.sent.push(email) })
                            .catch(() => { results.failed.push(email) })
                        )
                      }
                      chain.then(() => {
                        if (results.sent.length > 0) {
                          setInviteEmails([])
                          setInviteEmailInput('')
                          setInviteMessage('')
                          setInviteSuccess(
                            results.sent.length === 1
                              ? `Invitation sent to ${results.sent[0]}`
                              : `${results.sent.length} invitations sent`
                          )
                        }
                        if (results.failed.length > 0) {
                          setInviteEmails(results.failed)
                          setInviteError(
                            results.failed.length === 1
                              ? `Failed to invite ${results.failed[0]}`
                              : `Failed to invite ${results.failed.length} address(es)`
                          )
                        }
                      }).finally(() => { setInviteSending(false) })
                    }}
                    disabled={inviteSending || !hasInviteRecipient}
                    className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium transition-colors"
                  >
                    {inviteSending ? 'Sending...' : inviteEmails.length > 1
                      ? `Send ${inviteEmails.length} Invitations`
                      : 'Send Invitation'}
                  </button>
                </div>
              </div>
            )}

            {/* Pending Invitations List */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
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

      </main>
    </div>
  )
}
