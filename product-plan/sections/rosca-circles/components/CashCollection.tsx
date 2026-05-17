import { useState } from 'react'
import type { CashCollectionProps } from '../types'

export function CashCollection({
  circle,
  participants,
  currentCycle,
  records,
  onRecordCollection,
  onReconcile,
  onPrintReceipt,
}: CashCollectionProps) {
  const [selectedParticipant, setSelectedParticipant] = useState('')
  const [amount, setAmount] = useState(circle.contributionAmount)
  const [location, setLocation] = useState('')
  const [notes, setNotes] = useState('')

  const activeParticipants = participants.filter((p) => p.status === 'active')
  const currentCycleRecords = records.filter((r) => r.cycle === currentCycle)
  const totalCollected = currentCycleRecords.reduce((sum, r) => sum + r.amount, 0)
  const expectedTotal = activeParticipants.length * circle.contributionAmount

  const handleSubmit = () => {
    if (selectedParticipant && amount > 0 && location) {
      onRecordCollection?.(selectedParticipant, amount, location, notes || undefined)
      setSelectedParticipant('')
      setAmount(circle.contributionAmount)
      setLocation('')
      setNotes('')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Cash Collection
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            {circle.name} • Cycle {currentCycle}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Collection Progress */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Cycle {currentCycle} Progress
            </h2>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {currentCycleRecords.length} of {activeParticipants.length} collected
            </span>
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-slate-500 dark:text-slate-400">
                {circle.currency} {totalCollected.toLocaleString()} collected
              </span>
              <span className="font-medium text-slate-900 dark:text-white">
                {Math.round((totalCollected / expectedTotal) * 100)}%
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-3 rounded-full bg-emerald-500"
                style={{ width: `${(totalCollected / expectedTotal) * 100}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {currentCycleRecords.filter((r) => r.reconciled).length}
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">Reconciled</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
              <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                {currentCycleRecords.filter((r) => !r.reconciled).length}
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300">Pending</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-700">
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {activeParticipants.length - currentCycleRecords.length}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">Not Collected</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Record Collection Form */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Record Cash Collection
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Select Member
                </label>
                <select
                  value={selectedParticipant}
                  onChange={(e) => setSelectedParticipant(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Choose a member...</option>
                  {activeParticipants
                    .filter((p) => !currentCycleRecords.some((r) => r.participantId === p.id))
                    .map((participant) => (
                      <option key={participant.id} value={participant.id}>
                        {participant.name} (Position #{participant.payoutPosition || 'TBD'})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Amount Collected
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    {circle.currency}
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    min={1}
                    className="w-full pl-14 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Expected: {circle.currency} {circle.contributionAmount.toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Collection Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Community Center, Member's Home"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Any additional notes..."
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={!selectedParticipant || amount <= 0 || !location}
                className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium transition-colors"
              >
                Record Collection
              </button>
            </div>
          </div>

          {/* Recent Collections */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Recent Collections
            </h2>

            {currentCycleRecords.length === 0 ? (
              <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                No collections recorded yet for this cycle
              </p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {currentCycleRecords.map((record) => (
                  <div
                    key={record.id}
                    className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {record.participantName}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {record.location} • {new Date(record.collectedAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {circle.currency} {record.amount.toLocaleString()}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          record.reconciled
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                          {record.reconciled ? 'Reconciled' : 'Pending'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>Receipt: {record.receiptNumber}</span>
                      <span>Collected by: {record.collectedByName}</span>
                    </div>

                    {record.notes && (
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 italic">
                        "{record.notes}"
                      </p>
                    )}

                    <div className="mt-3 flex gap-2">
                      {!record.reconciled && onReconcile && (
                        <button
                          onClick={() => onReconcile(record.id)}
                          className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                          Mark Reconciled
                        </button>
                      )}
                      {onPrintReceipt && (
                        <button
                          onClick={() => onPrintReceipt(record.id)}
                          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          Print Receipt
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
          <h3 className="font-medium text-indigo-900 dark:text-indigo-100 mb-2">
            Cash Collection Best Practices
          </h3>
          <ul className="space-y-1 text-sm text-indigo-800 dark:text-indigo-200">
            <li>• Always issue a receipt when collecting cash</li>
            <li>• Reconcile records with physical cash daily</li>
            <li>• Deposit collected cash within 24 hours</li>
            <li>• Keep records in a secure location</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
