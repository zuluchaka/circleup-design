import { useState } from 'react'
import type { PositionSwapProps, SwapRequestStatus } from '../types'

const statusColors: Record<SwapRequestStatus, string> = {
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  approved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

export function PositionSwap({
  circleId,
  participants,
  currentUserId,
  pendingRequests,
  onSubmitRequest,
  onRespondToRequest,
}: PositionSwapProps) {
  const [selectedParticipant, setSelectedParticipant] = useState('')
  const [reason, setReason] = useState('')
  const [showNewRequest, setShowNewRequest] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [respondingTo, setRespondingTo] = useState<string | null>(null)

  const currentParticipant = participants.find((p) => p.userId === currentUserId)
  const availableForSwap = participants.filter(
    (p) => p.userId !== currentUserId && p.status === 'active' && !p.payoutReceived
  )

  const myRequests = pendingRequests.filter((r) => r.requesterId === currentUserId)
  const requestsToMe = pendingRequests.filter(
    (r) => r.targetId === currentUserId && r.status === 'pending'
  )

  const handleSubmit = () => {
    if (selectedParticipant && reason) {
      onSubmitRequest?.(selectedParticipant, reason)
      setSelectedParticipant('')
      setReason('')
      setShowNewRequest(false)
    }
  }

  const handleRespond = (requestId: string, approved: boolean) => {
    onRespondToRequest?.(requestId, approved, approved ? undefined : rejectReason)
    setRespondingTo(null)
    setRejectReason('')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Position Swap
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Request to swap your payout position with another member
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Position */}
        {currentParticipant && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Your Current Position
            </h2>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  #{currentParticipant.payoutPosition || '?'}
                </span>
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  {currentParticipant.payoutReceived ? (
                    <span className="text-emerald-600 dark:text-emerald-400">
                      You've already received your payout
                    </span>
                  ) : (
                    `Payout Position ${currentParticipant.payoutPosition || 'TBD'}`
                  )}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {currentParticipant.payoutReceived
                    ? 'Swapping is no longer available'
                    : 'You can request to swap with another member'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Incoming Swap Requests */}
        {requestsToMe.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 p-6 mb-6">
            <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Pending Requests ({requestsToMe.length})
            </h2>
            <div className="space-y-4">
              {requestsToMe.map((request) => (
                <div
                  key={request.id}
                  className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-amber-100 dark:border-amber-900"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {request.requesterName} wants to swap positions
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        Their position: #{request.requesterPosition} → Your position: #{request.targetPosition}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                        <span className="font-medium">Reason:</span> {request.reason}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[request.status]}`}>
                      {request.status}
                    </span>
                  </div>

                  {respondingTo === request.id ? (
                    <div className="mt-4 space-y-3">
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Reason for declining (optional)"
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRespond(request.id, true)}
                          className="flex-1 py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-colors"
                        >
                          Accept Swap
                        </button>
                        <button
                          onClick={() => handleRespond(request.id, false)}
                          className="flex-1 py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition-colors"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => setRespondingTo(null)}
                          className="py-2 px-4 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => setRespondingTo(request.id)}
                        className="py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors"
                      >
                        Respond
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Outgoing Requests */}
        {myRequests.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Your Swap Requests
            </h2>
            <div className="space-y-3">
              {myRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50"
                >
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      Swap with {request.targetName}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Position #{request.requesterPosition} ↔ #{request.targetPosition}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      Requested {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[request.status]}`}>
                      {request.status}
                    </span>
                    {request.rejectionReason && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                        {request.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Swap Request */}
        {!currentParticipant?.payoutReceived && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            {!showNewRequest ? (
              <button
                onClick={() => setShowNewRequest(true)}
                className="w-full py-3 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 font-medium hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Request New Position Swap
              </button>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    New Swap Request
                  </h2>
                  <button
                    onClick={() => setShowNewRequest(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Select Member to Swap With
                    </label>
                    <div className="space-y-2">
                      {availableForSwap.length === 0 ? (
                        <p className="text-sm text-slate-500 dark:text-slate-400 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                          No members available for swapping
                        </p>
                      ) : (
                        availableForSwap.map((participant) => (
                          <label
                            key={participant.id}
                            className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                              selectedParticipant === participant.id
                                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                          >
                            <input
                              type="radio"
                              name="swapTarget"
                              value={participant.id}
                              checked={selectedParticipant === participant.id}
                              onChange={(e) => setSelectedParticipant(e.target.value)}
                              className="text-indigo-600 focus:ring-indigo-500"
                            />
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
                            <div className="flex-1">
                              <p className="font-medium text-slate-900 dark:text-white">
                                {participant.name}
                              </p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                Position #{participant.payoutPosition || 'TBD'}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                                <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                {participant.trustScore}
                              </div>
                            </div>
                          </label>
                        ))
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Reason for Swap Request *
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={3}
                      placeholder="Explain why you need to swap positions..."
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={!selectedParticipant || !reason}
                    className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium transition-colors"
                  >
                    Submit Swap Request
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-6 p-4 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <h3 className="font-medium text-slate-900 dark:text-white mb-2">
            How Position Swapping Works
          </h3>
          <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
            <li>• Submit a swap request to another member who hasn't received their payout yet</li>
            <li>• The other member must accept your request for the swap to happen</li>
            <li>• Once accepted, your payout positions are exchanged</li>
            <li>• The circle organizer may need to approve certain swaps</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
