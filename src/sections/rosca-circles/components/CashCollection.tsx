import { useState } from 'react'
import { HandCoins } from 'lucide-react'
import type { CashCollectionProps } from '@/../product/sections/rosca-circles/types'

export function CashCollection({
  circle,
  participants,
  currentCycle,
  records,
  onBack,
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

  const reconciledCount = currentCycleRecords.filter((r) => r.reconciled).length
  const pendingCount = currentCycleRecords.filter((r) => !r.reconciled).length
  const notCollectedCount = activeParticipants.length - currentCycleRecords.length
  const percentCollected = expectedTotal > 0 ? Math.round((totalCollected / expectedTotal) * 100) : 0

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                <HandCoins className="w-6 h-6 text-indigo-500" />
                Cash Collection
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {circle.name} • Cycle {currentCycle}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400">
              <div className="text-xl font-bold truncate">
                {circle.currency} {totalCollected.toLocaleString()}
              </div>
              <p className="text-sm font-medium mt-0.5 opacity-80">Collected ({percentCollected}%)</p>
            </div>
            <div className="rounded-xl px-4 py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400">
              <div className="text-xl font-bold truncate">{reconciledCount}</div>
              <p className="text-sm font-medium mt-0.5 opacity-80">Reconciled</p>
            </div>
            <div className="rounded-xl px-4 py-3 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">
              <div className="text-xl font-bold truncate">{pendingCount}</div>
              <p className="text-sm font-medium mt-0.5 opacity-80">Pending</p>
            </div>
            <div className="rounded-xl px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <div className="text-xl font-bold truncate">{notCollectedCount}</div>
              <p className="text-sm font-medium mt-0.5 opacity-80">Not Collected</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Progress Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Cycle {currentCycle} Progress
            </h2>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {currentCycleRecords.length} of {activeParticipants.length} collected
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-500 dark:text-slate-400">
              {circle.currency} {totalCollected.toLocaleString()} of {circle.currency} {expectedTotal.toLocaleString()}
            </span>
            <span className="font-medium text-slate-900 dark:text-white">{percentCollected}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-3 rounded-full bg-emerald-500 transition-all"
              style={{ width: `${Math.min(percentCollected, 100)}%` }}
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Record Collection Form */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
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
                        {participant.name} (Position #{participant.payoutPosition || (participant.role === 'organizer' ? '1' : 'TBD')})
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
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
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
        <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
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
      </main>
    </div>
  )
}
