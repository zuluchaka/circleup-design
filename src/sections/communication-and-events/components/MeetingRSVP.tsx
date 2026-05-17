import { useState } from 'react'
import type { MeetingInvitation, MeetingRSVPStatus, UserReference } from '@/../product/sections/communication-and-events/types'

export interface MeetingRSVPProps {
  invitation: MeetingInvitation
  members: UserReference[]
  onRespond: (invitationId: string, rsvpStatus: MeetingRSVPStatus, proxyToUserId?: string) => void
  onDelegateProxy: (invitationId: string, proxyToUserId: string) => void
}

export default function MeetingRSVP({
  invitation,
  members,
  onRespond,
  onDelegateProxy,
}: MeetingRSVPProps) {
  const [selectedStatus, setSelectedStatus] = useState<MeetingRSVPStatus>(
    invitation.rsvpStatus !== 'pending' ? invitation.rsvpStatus : 'attending'
  )
  const [proxyUserId, setProxyUserId] = useState<string>(invitation.proxyToUserId || '')
  const [proxySearch, setProxySearch] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(invitation.rsvpStatus !== 'pending')

  const eligibleMembers = members.filter(
    m => m.id !== invitation.userId && m.name.toLowerCase().includes(proxySearch.toLowerCase())
  )

  const selectedProxyName = members.find(m => m.id === proxyUserId)?.name

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      if (selectedStatus === 'proxy' && proxyUserId) {
        onDelegateProxy(invitation.id, proxyUserId)
      }
      onRespond(invitation.id, selectedStatus, selectedStatus === 'proxy' ? proxyUserId : undefined)
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  const canSubmit =
    selectedStatus !== 'pending' &&
    (selectedStatus !== 'proxy' || proxyUserId !== '') &&
    !submitting

  const statusOptions: { value: MeetingRSVPStatus; label: string; description: string }[] = [
    { value: 'attending', label: 'Attending', description: 'I will attend this meeting' },
    { value: 'not_attending', label: 'Not Attending', description: 'I cannot attend this meeting' },
    { value: 'proxy', label: 'Delegate Proxy', description: 'Another member will attend on my behalf' },
  ]

  if (submitted && invitation.rsvpStatus !== 'pending') {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your RSVP</h3>
        <div className={`p-4 rounded-lg border-2 ${
          invitation.rsvpStatus === 'attending'
            ? 'border-green-300 bg-green-50 dark:bg-green-900/20'
            : invitation.rsvpStatus === 'not_attending'
            ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
            : 'border-purple-300 bg-purple-50 dark:bg-purple-900/20'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {invitation.rsvpStatus === 'attending' && 'You are attending'}
                {invitation.rsvpStatus === 'not_attending' && 'You are not attending'}
                {invitation.rsvpStatus === 'proxy' && `Proxy delegated to ${invitation.proxyToUserName}`}
              </p>
              {invitation.respondedAt && (
                <p className="text-xs text-gray-500 mt-1">
                  Responded {new Date(invitation.respondedAt).toLocaleDateString('de-CH')}
                </p>
              )}
            </div>
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              invitation.rsvpStatus === 'attending' ? 'bg-green-100 text-green-700' :
              invitation.rsvpStatus === 'not_attending' ? 'bg-red-100 text-red-700' :
              'bg-purple-100 text-purple-700'
            }`}>
              {invitation.rsvpStatus.replace('_', ' ')}
            </span>
          </div>
        </div>
        <button
          onClick={() => setSubmitted(false)}
          className="text-sm text-blue-600 hover:underline"
        >
          Change response
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">RSVP to Meeting</h3>

      {/* Status radio buttons */}
      <div className="space-y-3">
        {statusOptions.map(option => (
          <label
            key={option.value}
            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              selectedStatus === option.value
                ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <input
              type="radio"
              name="rsvp_status"
              value={option.value}
              checked={selectedStatus === option.value}
              onChange={() => setSelectedStatus(option.value)}
              className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {option.label}
              </span>
              <p className="text-xs text-gray-500 mt-0.5">{option.description}</p>
            </div>
          </label>
        ))}
      </div>

      {/* Proxy member selector */}
      {selectedStatus === 'proxy' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Select proxy delegate
          </label>
          <input
            type="text"
            placeholder="Search members..."
            value={proxySearch}
            onChange={e => setProxySearch(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {selectedProxyName && (
            <div className="flex items-center gap-2 p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
              <span className="text-sm text-indigo-700 dark:text-indigo-300">
                Selected: {selectedProxyName}
              </span>
              <button
                onClick={() => setProxyUserId('')}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            </div>
          )}
          <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md divide-y divide-gray-200 dark:divide-gray-700">
            {eligibleMembers.length === 0 ? (
              <p className="p-3 text-sm text-gray-400">No matching members found</p>
            ) : (
              eligibleMembers.map(member => (
                <button
                  key={member.id}
                  onClick={() => {
                    setProxyUserId(member.id)
                    setProxySearch('')
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    proxyUserId === member.id
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  <span className="font-medium">{member.name}</span>
                  {member.role && (
                    <span className="text-xs text-gray-400 ml-2">{member.role}</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {submitting ? 'Submitting...' : 'Submit RSVP'}
      </button>
    </div>
  )
}
