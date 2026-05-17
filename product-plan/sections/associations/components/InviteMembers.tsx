import { useState } from 'react'
import type { PendingInvitation, JoinRequest, InvitationChannel } from '../types'

export interface InviteMembersProps {
  pendingInvitations: PendingInvitation[]
  joinRequests: JoinRequest[]
  onSendInvite?: (channel: InvitationChannel, contact: string) => void
  onCancelInvitation?: (id: string) => void
  onResendInvitation?: (id: string) => void
  onApproveJoinRequest?: (id: string) => void
  onRejectJoinRequest?: (id: string) => void
  onBack?: () => void
}

type Tab = 'invite' | 'pending' | 'requests'

const channelOptions: { value: InvitationChannel; label: string; icon: string; placeholder: string }[] = [
  {
    value: 'email',
    label: 'Email',
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    placeholder: 'Enter email address',
  },
  {
    value: 'sms',
    label: 'SMS',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    placeholder: 'Enter phone number',
  },
  {
    value: 'whatsapp',
    label: 'WhatsApp',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    placeholder: 'Enter WhatsApp number',
  },
]

const channelStatusConfig: Record<InvitationChannel, { color: string; bgColor: string }> = {
  email: { color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  sms: { color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/30' },
  whatsapp: { color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`
  return formatDate(dateString)
}

export function InviteMembers({
  pendingInvitations,
  joinRequests,
  onSendInvite,
  onCancelInvitation,
  onResendInvitation,
  onApproveJoinRequest,
  onRejectJoinRequest,
  onBack,
}: InviteMembersProps) {
  const [activeTab, setActiveTab] = useState<Tab>('invite')
  const [selectedChannel, setSelectedChannel] = useState<InvitationChannel>('email')
  const [contactValue, setContactValue] = useState('')

  const handleSendInvite = () => {
    if (contactValue.trim()) {
      onSendInvite?.(selectedChannel, contactValue.trim())
      setContactValue('')
    }
  }

  const pendingCount = pendingInvitations.filter((i) => i.status === 'pending').length
  const requestCount = joinRequests.filter((r) => r.status === 'pending').length

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Invite Members
              </h1>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                Grow your community by inviting new members
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('invite')}
              className={`
                flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors
                ${activeTab === 'invite'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }
              `}
            >
              Send Invite
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`
                flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2
                ${activeTab === 'pending'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }
              `}
            >
              Pending
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.5 text-xs bg-slate-200 dark:bg-slate-700 rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`
                flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2
                ${activeTab === 'requests'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }
              `}
            >
              Requests
              {requestCount > 0 && (
                <span className="px-1.5 py-0.5 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
                  {requestCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'invite' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="space-y-6">
              {/* Channel Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-3">
                  Invitation Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {channelOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSelectedChannel(option.value)
                        setContactValue('')
                      }}
                      className={`
                        p-4 rounded-xl border-2 transition-colors text-center
                        ${selectedChannel === option.value
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                        }
                      `}
                    >
                      <svg className="w-6 h-6 mx-auto mb-2 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={option.icon} />
                      </svg>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Input */}
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  {selectedChannel === 'email' ? 'Email Address' : 'Phone Number'}
                </label>
                <div className="flex gap-3">
                  <input
                    type={selectedChannel === 'email' ? 'email' : 'tel'}
                    value={contactValue}
                    onChange={(e) => setContactValue(e.target.value)}
                    placeholder={channelOptions.find((c) => c.value === selectedChannel)?.placeholder}
                    className="flex-1 px-4 py-3 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleSendInvite}
                    disabled={!contactValue.trim()}
                    className="px-6 py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed rounded-xl transition-colors shadow-lg shadow-indigo-500/25 disabled:shadow-none"
                  >
                    Send Invite
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    <p>
                      Invitations expire after 30 days. The recipient will receive a link to join your association directly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pending' && (
          <div className="space-y-4">
            {pendingInvitations.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-slate-500 dark:text-slate-500">No pending invitations</p>
              </div>
            ) : (
              pendingInvitations.map((invitation) => {
                const channelConfig = channelStatusConfig[invitation.channel]
                return (
                  <div
                    key={invitation.id}
                    className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl ${channelConfig.bgColor} flex items-center justify-center flex-shrink-0`}>
                        <svg className={`w-5 h-5 ${channelConfig.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d={channelOptions.find((c) => c.value === invitation.channel)?.icon}
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 dark:text-white">
                          {invitation.email || invitation.phone}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                          Invited by {invitation.invitedBy} · {formatRelativeTime(invitation.invitedAt)}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">
                          Expires {formatDate(invitation.expiresAt)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onResendInvitation?.(invitation.id)}
                          className="px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                        >
                          Resend
                        </button>
                        <button
                          onClick={() => onCancelInvitation?.(invitation.id)}
                          className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-4">
            {joinRequests.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <p className="text-slate-500 dark:text-slate-500">No pending join requests</p>
              </div>
            ) : (
              joinRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4"
                >
                  <div className="flex items-start gap-4">
                    {request.userAvatarUrl ? (
                      <img
                        src={request.userAvatarUrl}
                        alt=""
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 font-medium text-lg">
                        {request.userName.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {request.userName}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-500">
                            {request.userEmail}
                          </p>
                        </div>
                        <span className="text-xs text-slate-400 dark:text-slate-600">
                          {formatRelativeTime(request.requestedAt)}
                        </span>
                      </div>
                      {request.message && (
                        <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                          <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                            "{request.message}"
                          </p>
                        </div>
                      )}
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => onApproveJoinRequest?.(request.id)}
                          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onRejectJoinRequest?.(request.id)}
                          className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  )
}
