import { useState, useRef, useCallback, useEffect } from 'react'
import type { PendingInvitation, JoinRequest, InvitationChannel, MemberRole, MembershipType } from '@/../product/sections/associations/types'

export interface InviteMembersProps {
  pendingInvitations: PendingInvitation[]
  joinRequests: JoinRequest[]
  loading?: boolean
  error?: string | null
  onSendInvite?: (data: {
    emails: string[]
    channel: InvitationChannel
    role?: MemberRole
    membershipType?: MembershipType
    message?: string
  }) => Promise<void> | void
  onCancelInvitation?: (id: string) => Promise<void> | void
  onResendInvitation?: (id: string) => Promise<void> | void
  onApproveJoinRequest?: (id: string) => Promise<void> | void
  onRejectJoinRequest?: (id: string) => Promise<void> | void
  onOpenBulkImport?: () => void
  onBack?: () => void
}

type Tab = 'invite' | 'pending' | 'requests'

interface EmailChip {
  email: string
  valid: boolean
  alreadyMember?: boolean
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const roleOptions: { value: MemberRole; label: string }[] = [
  { value: 'member', label: 'Member' },
  { value: 'organizer', label: 'Organizer' },
  { value: 'treasurer', label: 'Treasurer' },
  { value: 'secretary', label: 'Secretary' },
]

const membershipTypeOptions: { value: MembershipType; label: string }[] = [
  { value: 'regular', label: 'Regular' },
  { value: 'student', label: 'Student' },
  { value: 'senior', label: 'Senior' },
  { value: 'honorary', label: 'Honorary' },
  { value: 'family', label: 'Family' },
]

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

function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  confirmVariant = 'danger',
  onConfirm,
  onCancel,
}: {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  confirmVariant?: 'danger' | 'primary'
  onConfirm: () => void
  onCancel: () => void
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-sm mx-4 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
              confirmVariant === 'danger'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export function InviteMembers({
  pendingInvitations,
  joinRequests,
  loading: externalLoading,
  error: externalError,
  onSendInvite,
  onCancelInvitation,
  onResendInvitation,
  onApproveJoinRequest,
  onRejectJoinRequest,
  onOpenBulkImport,
  onBack,
}: InviteMembersProps) {
  const [activeTab, setActiveTab] = useState<Tab>('invite')
  const [emailChips, setEmailChips] = useState<EmailChip[]>([])
  const [inputValue, setInputValue] = useState('')
  const [selectedRole, setSelectedRole] = useState<MemberRole>('member')
  const [selectedMembershipType, setSelectedMembershipType] = useState<MembershipType>('regular')
  const [personalMessage, setPersonalMessage] = useState('')
  const [showOptions, setShowOptions] = useState(false)
  const [sending, setSending] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)
  const [confirmAction, setConfirmAction] = useState<{
    type: 'cancel' | 'reject'
    id: string
    label: string
  } | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const error = externalError || localError

  // Clear success message after 4 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  const addEmails = useCallback((raw: string) => {
    const parts = raw.split(/[,;\s\n]+/).filter(Boolean)
    const newChips: EmailChip[] = []

    for (const part of parts) {
      const email = part.trim().toLowerCase()
      if (!email) continue
      if (emailChips.some((c) => c.email === email) || newChips.some((c) => c.email === email)) continue

      newChips.push({
        email,
        valid: EMAIL_REGEX.test(email),
      })
    }

    if (newChips.length > 0) {
      setEmailChips((prev) => [...prev, ...newChips])
    }
  }, [emailChips])

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === 'Tab') {
      e.preventDefault()
      if (inputValue.trim()) {
        addEmails(inputValue)
        setInputValue('')
      }
    } else if (e.key === 'Backspace' && !inputValue && emailChips.length > 0) {
      setEmailChips((prev) => prev.slice(0, -1))
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text')
    addEmails(text)
    setInputValue('')
  }

  const removeChip = (email: string) => {
    setEmailChips((prev) => prev.filter((c) => c.email !== email))
  }

  const validEmails = emailChips.filter((c) => c.valid)
  const invalidEmails = emailChips.filter((c) => !c.valid)

  const handleSendInvite = async () => {
    // Also add any remaining input
    if (inputValue.trim()) {
      addEmails(inputValue)
      setInputValue('')
    }

    const emails = validEmails.map((c) => c.email)
    if (emails.length === 0) {
      setLocalError('Please enter at least one valid email address')
      return
    }

    setSending(true)
    setLocalError(null)
    setSuccessMessage(null)

    try {
      await onSendInvite?.({
        emails,
        channel: 'email',
        role: selectedRole !== 'member' ? selectedRole : undefined,
        membershipType: selectedMembershipType !== 'regular' ? selectedMembershipType : undefined,
        message: personalMessage.trim() || undefined,
      })
      setSuccessMessage(
        emails.length === 1
          ? `Invitation sent to ${emails[0]}`
          : `${emails.length} invitations sent successfully`
      )
      setEmailChips([])
      setPersonalMessage('')
      setSelectedRole('member')
      setSelectedMembershipType('regular')
      setShowOptions(false)
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : 'Failed to send invitation')
    } finally {
      setSending(false)
    }
  }

  const handleConfirmAction = async () => {
    if (!confirmAction) return
    try {
      if (confirmAction.type === 'cancel') {
        await onCancelInvitation?.(confirmAction.id)
      } else if (confirmAction.type === 'reject') {
        await onRejectJoinRequest?.(confirmAction.id)
      }
    } finally {
      setConfirmAction(null)
    }
  }

  const pendingCount = pendingInvitations.filter((i) => i.status === 'pending').length
  const requestCount = joinRequests.filter((r) => r.status === 'pending').length
  const isLoading = externalLoading || sending

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Confirm Dialog */}
      <ConfirmDialog
        open={!!confirmAction}
        title={confirmAction?.type === 'cancel' ? 'Cancel Invitation' : 'Decline Request'}
        message={
          confirmAction?.type === 'cancel'
            ? 'Are you sure you want to cancel this invitation? The recipient will no longer be able to join.'
            : 'Are you sure you want to decline this join request? The user will not be notified.'
        }
        confirmLabel={confirmAction?.type === 'cancel' ? 'Cancel Invitation' : 'Decline'}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmAction(null)}
      />

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
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Invite Members
              </h1>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                Grow your community by inviting new members
              </p>
            </div>
            {onOpenBulkImport && (
              <button
                onClick={onOpenBulkImport}
                className="px-4 py-2.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Bulk Import
              </button>
            )}
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
              {/* Success Toast */}
              {successMessage && (
                <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                  <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">{successMessage}</p>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                  <button
                    onClick={() => setLocalError(null)}
                    className="ml-auto text-red-400 hover:text-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Channel Info (L5: email only, SMS/WhatsApp labeled as Coming Soon) */}
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-3">
                  Invitation Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    className="p-4 rounded-xl border-2 border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 transition-colors text-center"
                  >
                    <svg className="w-6 h-6 mx-auto mb-2 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">Email</span>
                  </button>
                  <div className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-center opacity-60 cursor-not-allowed relative">
                    <svg className="w-6 h-6 mx-auto mb-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-500">SMS</span>
                    <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 text-[10px] font-medium bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-full">
                      Soon
                    </span>
                  </div>
                  <div className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-center opacity-60 cursor-not-allowed relative">
                    <svg className="w-6 h-6 mx-auto mb-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-500">WhatsApp</span>
                    <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 text-[10px] font-medium bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-full">
                      Soon
                    </span>
                  </div>
                </div>
              </div>

              {/* Multi-Email Input with Chips (L1) */}
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Email Addresses
                </label>
                <div
                  className="min-h-[52px] px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500 cursor-text flex flex-wrap gap-2 items-center"
                  onClick={() => inputRef.current?.focus()}
                >
                  {emailChips.map((chip) => (
                    <span
                      key={chip.email}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm ${
                        chip.valid
                          ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                          : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
                      }`}
                    >
                      {chip.email}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeChip(chip.email)
                        }}
                        className="ml-0.5 hover:opacity-70"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    onPaste={handlePaste}
                    onBlur={() => {
                      if (inputValue.trim()) {
                        addEmails(inputValue)
                        setInputValue('')
                      }
                    }}
                    placeholder={emailChips.length === 0 ? 'Enter email addresses (comma or space separated)' : ''}
                    className="flex-1 min-w-[200px] bg-transparent border-0 outline-none text-slate-900 dark:text-white placeholder:text-slate-500 text-sm py-1"
                  />
                </div>
                {/* Chip summary */}
                {emailChips.length > 0 && (
                  <div className="mt-2 flex items-center gap-3 text-xs">
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {validEmails.length} valid
                    </span>
                    {invalidEmails.length > 0 && (
                      <span className="text-red-600 dark:text-red-400">
                        {invalidEmails.length} invalid
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Optional Settings Toggle */}
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
              >
                <svg
                  className={`w-4 h-4 transition-transform ${showOptions ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {showOptions ? 'Hide options' : 'Role, type & message options'}
              </button>

              {showOptions && (
                <div className="space-y-4 pl-4 border-l-2 border-indigo-200 dark:border-indigo-800">
                  {/* Role Selection (L3) */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Role
                      </label>
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value as MemberRole)}
                        className="w-full px-3 py-2.5 text-sm text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500"
                      >
                        {roleOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Membership Type
                      </label>
                      <select
                        value={selectedMembershipType}
                        onChange={(e) => setSelectedMembershipType(e.target.value as MembershipType)}
                        className="w-full px-3 py-2.5 text-sm text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500"
                      >
                        {membershipTypeOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Personal Message (L4) */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Personal Message <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                      value={personalMessage}
                      onChange={(e) => setPersonalMessage(e.target.value)}
                      placeholder="Add a personal note to the invitation email..."
                      rows={3}
                      maxLength={500}
                      className="w-full px-3 py-2.5 text-sm text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 resize-none placeholder:text-slate-500"
                    />
                    <p className="mt-1 text-xs text-slate-400 text-right">
                      {personalMessage.length}/500
                    </p>
                  </div>
                </div>
              )}

              {/* Send Button (L15: loading state) */}
              <button
                onClick={handleSendInvite}
                disabled={isLoading || (emailChips.length === 0 && !inputValue.trim())}
                className="w-full px-6 py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed rounded-xl transition-colors shadow-lg shadow-indigo-500/25 disabled:shadow-none flex items-center justify-center gap-2"
              >
                {sending && (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {sending
                  ? 'Sending...'
                  : validEmails.length > 1
                    ? `Send ${validEmails.length} Invitations`
                    : 'Send Invite'
                }
              </button>

              {/* Info */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <p>
                      Invitations are sent via email. Recipients must have a CircleUp account to accept.
                    </p>
                    <p>
                      Tip: Paste multiple emails separated by commas, spaces, or newlines.
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
              pendingInvitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      {/* L16: Show invitee name prominently */}
                      {invitation.invitedName && (
                        <p className="font-medium text-slate-900 dark:text-white">
                          {invitation.invitedName}
                        </p>
                      )}
                      <p className={`text-sm ${invitation.invitedName ? 'text-slate-500 dark:text-slate-500' : 'font-medium text-slate-900 dark:text-white'}`}>
                        {invitation.email || invitation.phone}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <p className="text-sm text-slate-500 dark:text-slate-500">
                          Invited by {invitation.invitedBy} · {formatRelativeTime(invitation.invitedAt)}
                        </p>
                        {invitation.role && invitation.role !== 'member' && (
                          <span className="px-1.5 py-0.5 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full capitalize">
                            {invitation.role}
                          </span>
                        )}
                        {invitation.resendCount && invitation.resendCount > 0 && (
                          <span className="px-1.5 py-0.5 text-xs text-slate-400 dark:text-slate-600">
                            Resent {invitation.resendCount}x
                          </span>
                        )}
                      </div>
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
                        onClick={() => setConfirmAction({ type: 'cancel', id: invitation.id, label: invitation.email || '' })}
                        className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))
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
                          onClick={() => setConfirmAction({ type: 'reject', id: request.id, label: request.userName })}
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
