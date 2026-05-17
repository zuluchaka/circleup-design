import { useState } from 'react'
import { MessageSquare, Plus } from 'lucide-react'
import type {
  DisputeManagementProps,
  DisputeStatus,
  DisputePriority,
  DisputeType,
} from '@/../product/sections/rosca-circles/types'

const statusColors: Record<DisputeStatus, string> = {
  open: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  acknowledged: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  escalated: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  resolved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
}

const priorityColors: Record<DisputePriority, string> = {
  low: 'text-slate-600 dark:text-slate-400',
  medium: 'text-amber-600 dark:text-amber-400',
  high: 'text-red-600 dark:text-red-400',
}

const typeLabels: Record<DisputeType, string> = {
  payment_dispute: 'Payment Dispute',
  conduct: 'Member Conduct',
  fraud: 'Fraud',
  other: 'Other',
}

export function DisputeManagement({
  disputes,
  currentUserId: _currentUserId,
  isOrganizer,
  circle,
  onBack,
  onFileDispute,
  onAddEvidence: _onAddEvidence,
  onAcknowledge,
  onEscalate,
  onResolve,
}: DisputeManagementProps) {
  const [showNewDispute, setShowNewDispute] = useState(false)
  const [selectedDispute, setSelectedDispute] = useState<string | null>(null)
  const [actionNote, setActionNote] = useState('')
  const [newDispute, setNewDispute] = useState({
    againstId: '',
    type: 'payment_dispute' as DisputeType,
    subject: '',
    description: '',
  })

  const openDisputes = disputes.filter((d) => d.status !== 'resolved')
  const resolvedDisputes = disputes.filter((d) => d.status === 'resolved')
  const handleSubmitDispute = () => {
    onFileDispute?.(newDispute.againstId, newDispute.type, newDispute.subject, newDispute.description)
    setShowNewDispute(false)
    setNewDispute({ againstId: '', type: 'payment_dispute', subject: '', description: '' })
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between gap-4">
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
                  <MessageSquare className="w-6 h-6 text-indigo-500" />
                  Disputes
                </h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {circle ? `${circle.name} • ` : ''}File and track disputes
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowNewDispute(true)}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              File Dispute
            </button>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <div className="text-2xl font-bold">{disputes.length}</div>
              <p className="text-sm font-medium mt-0.5 opacity-80">Total</p>
            </div>
            <div className="rounded-xl px-4 py-3 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">
              <div className="text-2xl font-bold">{disputes.filter((d) => d.status === 'open').length}</div>
              <p className="text-sm font-medium mt-0.5 opacity-80">Open</p>
            </div>
            <div className="rounded-xl px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400">
              <div className="text-2xl font-bold">{disputes.filter((d) => d.status === 'escalated').length}</div>
              <p className="text-sm font-medium mt-0.5 opacity-80">Escalated</p>
            </div>
            <div className="rounded-xl px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400">
              <div className="text-2xl font-bold">{resolvedDisputes.length}</div>
              <p className="text-sm font-medium mt-0.5 opacity-80">Resolved</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* New Dispute Form */}
        {showNewDispute && (
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                File New Dispute
              </h2>
              <button
                onClick={() => setShowNewDispute(false)}
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
                  Dispute Type
                </label>
                <select
                  value={newDispute.type}
                  onChange={(e) => setNewDispute({ ...newDispute, type: e.target.value as DisputeType })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="payment_dispute">Payment Dispute</option>
                  <option value="conduct">Member Conduct</option>
                  <option value="fraud">Fraud</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={newDispute.subject}
                  onChange={(e) => setNewDispute({ ...newDispute, subject: e.target.value })}
                  placeholder="Brief description of the issue"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newDispute.description}
                  onChange={(e) => setNewDispute({ ...newDispute, description: e.target.value })}
                  rows={4}
                  placeholder="Provide detailed information about the dispute..."
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                onClick={handleSubmitDispute}
                disabled={!newDispute.subject || !newDispute.description}
                className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium transition-colors"
              >
                Submit Dispute
              </button>
            </div>
          </div>
        )}

        {/* Open Disputes */}
        {openDisputes.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Open Disputes ({openDisputes.length})
            </h2>
            <div className="space-y-4">
              {openDisputes.map((dispute) => (
                <div
                  key={dispute.id}
                  className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {dispute.subject}
                          </h3>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[dispute.status]}`}>
                            {dispute.status}
                          </span>
                          <span className={`text-sm font-medium ${priorityColors[dispute.priority]}`}>
                            {dispute.priority} priority
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                          {dispute.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                          <span>
                            <span className="font-medium">Filed by:</span> {dispute.filedByName}
                          </span>
                          <span>
                            <span className="font-medium">Against:</span> {dispute.againstName}
                          </span>
                          <span>
                            <span className="font-medium">Type:</span> {typeLabels[dispute.type]}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Evidence */}
                    {dispute.evidence.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Evidence ({dispute.evidence.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {dispute.evidence.map((ev) => (
                            <span
                              key={ev.id}
                              className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm"
                            >
                              {ev.filename}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Timeline */}
                    {dispute.timeline.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Timeline
                        </p>
                        <div className="space-y-2">
                          {dispute.timeline.map((entry, idx) => (
                            <div key={idx} className="flex items-start gap-3 text-sm">
                              <div className="w-2 h-2 mt-1.5 rounded-full bg-indigo-500" />
                              <div>
                                <span className="font-medium text-slate-900 dark:text-white capitalize">
                                  {entry.action}
                                </span>
                                <span className="text-slate-500 dark:text-slate-400">
                                  {' '}by {entry.actor} • {new Date(entry.timestamp).toLocaleString()}
                                </span>
                                {entry.note && (
                                  <p className="text-slate-600 dark:text-slate-400">{entry.note}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    {isOrganizer && (
                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                        {selectedDispute === dispute.id ? (
                          <div className="space-y-3">
                            <textarea
                              value={actionNote}
                              onChange={(e) => setActionNote(e.target.value)}
                              placeholder="Add a note for this action..."
                              rows={2}
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-indigo-500"
                            />
                            <div className="flex gap-2">
                              {dispute.status === 'open' && onAcknowledge && (
                                <button
                                  onClick={() => {
                                    onAcknowledge(dispute.id, actionNote)
                                    setSelectedDispute(null)
                                    setActionNote('')
                                  }}
                                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors"
                                >
                                  Acknowledge
                                </button>
                              )}
                              {dispute.status !== 'escalated' && onEscalate && (
                                <button
                                  onClick={() => {
                                    onEscalate(dispute.id, actionNote)
                                    setSelectedDispute(null)
                                    setActionNote('')
                                  }}
                                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition-colors"
                                >
                                  Escalate
                                </button>
                              )}
                              {onResolve && (
                                <button
                                  onClick={() => {
                                    onResolve(dispute.id, actionNote)
                                    setSelectedDispute(null)
                                    setActionNote('')
                                  }}
                                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-colors"
                                >
                                  Resolve
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setSelectedDispute(null)
                                  setActionNote('')
                                }}
                                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelectedDispute(dispute.id)}
                              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors"
                            >
                              Take Action
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="px-6 py-3 bg-slate-50 dark:bg-slate-700/30 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Filed: {new Date(dispute.createdAt).toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Updated: {new Date(dispute.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resolved Disputes */}
        {resolvedDisputes.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Resolved Disputes ({resolvedDisputes.length})
            </h2>
            <div className="space-y-4">
              {resolvedDisputes.map((dispute) => (
                <div
                  key={dispute.id}
                  className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 opacity-75"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {dispute.subject}
                        </h3>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[dispute.status]}`}>
                          {dispute.status}
                        </span>
                      </div>
                      {dispute.resolution && (
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          <span className="font-medium">Resolution:</span> {dispute.resolution}
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(dispute.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {disputes.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">
              No disputes
            </h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Your circle has no active or past disputes
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
