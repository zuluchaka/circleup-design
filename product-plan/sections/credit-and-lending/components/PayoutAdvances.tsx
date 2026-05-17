import { useState } from 'react'
import { Zap, Calendar, CheckCircle, Clock, AlertCircle, ChevronRight, CreditCard, Building2 } from 'lucide-react'
import type { PayoutAdvance, UpcomingPayout, PaymentMethod } from '../types'

export interface PayoutAdvancesProps {
  advances: PayoutAdvance[]
  upcomingPayouts: UpcomingPayout[]
  paymentMethods: PaymentMethod[]
  onRequestAdvance?: (payoutId: string, amount: number) => void
  onViewAdvance?: (advanceId: string) => void
  onCalculateEarlyRepayment?: (advanceId: string) => void
  onUpdateRepaymentSettings?: (advanceId: string, settings: { method: string; sourceId?: string }) => void
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-CH', { style: 'currency', currency: 'CHF' }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    eligible: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', icon: <Zap className="w-3.5 h-3.5" /> },
    pending: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', icon: <Clock className="w-3.5 h-3.5" /> },
    approved: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-400', icon: <CheckCircle className="w-3.5 h-3.5" /> },
    active: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-400', icon: <CheckCircle className="w-3.5 h-3.5" /> },
    repaid: { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-600 dark:text-slate-400', icon: <CheckCircle className="w-3.5 h-3.5" /> },
    defaulted: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', icon: <AlertCircle className="w-3.5 h-3.5" /> },
  }

  const style = styles[status] || styles.pending

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
      {style.icon}
      <span className="capitalize">{status}</span>
    </span>
  )
}

function AdvanceRequestModal({
  payout,
  paymentMethods,
  onClose,
  onSubmit,
}: {
  payout: UpcomingPayout
  paymentMethods: PaymentMethod[]
  onClose: () => void
  onSubmit: (amount: number) => void
}) {
  const maxAdvance = payout.amount * 0.75
  const [amount, setAmount] = useState(maxAdvance)
  const feePercentage = 3.0
  const fee = amount * (feePercentage / 100)
  const netAmount = amount - fee

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Request Advance</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          From {payout.circleName}
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Advance Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">CHF</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Math.min(maxAdvance, Math.max(0, Number(e.target.value))))}
                className="w-full pl-14 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <input
              type="range"
              min={100}
              max={maxAdvance}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full mt-2 accent-indigo-500"
            />
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span>CHF 100</span>
              <span>Max: {formatCurrency(maxAdvance)}</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Advance amount</span>
              <span className="text-slate-900 dark:text-white font-medium">{formatCurrency(amount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Fee ({feePercentage}%)</span>
              <span className="text-slate-900 dark:text-white font-medium">-{formatCurrency(fee)}</span>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-600 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="text-slate-900 dark:text-white font-medium">You receive</span>
                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(netAmount)}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-sm">
              <Calendar className="w-4 h-4" />
              <span>Repayment on {formatDate(payout.scheduledDate)}</span>
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
              Automatically deducted from your payout of {formatCurrency(payout.amount)}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(amount)}
            className="flex-1 px-4 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors"
          >
            Request Advance
          </button>
        </div>
      </div>
    </div>
  )
}

function EligiblePayoutCard({
  advance,
  payout,
  onRequestAdvance,
}: {
  advance: PayoutAdvance
  payout?: UpcomingPayout
  onRequestAdvance: () => void
}) {
  return (
    <div className="p-5 bg-gradient-to-br from-emerald-50 to-indigo-50 dark:from-emerald-900/20 dark:to-indigo-900/20 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{advance.circleName}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Up to {formatCurrency(advance.maxAdvanceAmount || 0)}
          </p>
        </div>
        <StatusBadge status={advance.status} />
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
        <Calendar className="w-4 h-4" />
        <span>Payout on {formatDate(advance.scheduledPayoutDate)}</span>
        <span className="text-slate-400 dark:text-slate-500">•</span>
        <span>{formatCurrency(advance.scheduledPayoutAmount)}</span>
      </div>

      {advance.eligibilityFactors && (
        <div className="mb-4">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Why you qualify:</p>
          <div className="flex flex-wrap gap-2">
            {advance.eligibilityFactors.map((factor, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-slate-800 rounded-full text-xs text-slate-600 dark:text-slate-300">
                <CheckCircle className="w-3 h-3 text-emerald-500" />
                {factor}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onRequestAdvance}
        className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
      >
        <Zap className="w-4 h-4" />
        Request Advance
      </button>
    </div>
  )
}

function ActiveAdvanceCard({
  advance,
  onView,
}: {
  advance: PayoutAdvance
  onView: () => void
}) {
  const daysUntilRepayment = Math.ceil(
    (new Date(advance.repaymentDate || advance.scheduledPayoutDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{advance.circleName}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {formatCurrency(advance.advanceAmount || 0)}
          </p>
        </div>
        <StatusBadge status={advance.status} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
          <p className="text-xs text-slate-500 dark:text-slate-400">Fee paid</p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatCurrency(advance.feeAmount || 0)}</p>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
          <p className="text-xs text-slate-500 dark:text-slate-400">You received</p>
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{formatCurrency(advance.netAdvanceAmount || 0)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span className="text-sm text-amber-700 dark:text-amber-300">Repayment {formatDate(advance.repaymentDate || advance.scheduledPayoutDate)}</span>
        </div>
        <span className="text-sm font-medium text-amber-700 dark:text-amber-300">{daysUntilRepayment} days</span>
      </div>

      <button
        onClick={onView}
        className="w-full py-2.5 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 text-sm"
      >
        View Details
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}

function RepaidAdvanceCard({ advance }: { advance: PayoutAdvance }) {
  return (
    <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{advance.circleName}</p>
          <p className="text-xl font-bold text-slate-700 dark:text-slate-300 mt-1">
            {formatCurrency(advance.advanceAmount || 0)}
          </p>
        </div>
        <StatusBadge status={advance.status} />
      </div>

      <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
        <span>Repaid {formatDate(advance.repaidAt || advance.scheduledPayoutDate)}</span>
        <span>•</span>
        <span>Fee: {formatCurrency(advance.feeAmount || 0)}</span>
      </div>
    </div>
  )
}

export function PayoutAdvances({
  advances,
  upcomingPayouts,
  paymentMethods,
  onRequestAdvance,
  onViewAdvance,
}: PayoutAdvancesProps) {
  const [showRequestModal, setShowRequestModal] = useState<string | null>(null)

  const eligibleAdvances = advances.filter(a => a.status === 'eligible')
  const activeAdvances = advances.filter(a => a.status === 'active' || a.status === 'approved')
  const pastAdvances = advances.filter(a => a.status === 'repaid')

  const selectedPayout = showRequestModal
    ? upcomingPayouts.find(p => p.id === showRequestModal)
    : null

  const selectedAdvance = showRequestModal
    ? advances.find(a => a.payoutId === showRequestModal)
    : null

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Payout Advances</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Access your upcoming payouts early with instant approval
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Available to Advance</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(eligibleAdvances.reduce((sum, a) => sum + (a.maxAdvanceAmount || 0), 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Active Advances</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(activeAdvances.reduce((sum, a) => sum + (a.advanceAmount || 0), 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <CheckCircle className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Repaid</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(pastAdvances.reduce((sum, a) => sum + (a.advanceAmount || 0), 0))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Eligible Advances */}
      {eligibleAdvances.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Available Advances</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {eligibleAdvances.map((advance) => (
              <EligiblePayoutCard
                key={advance.id}
                advance={advance}
                payout={upcomingPayouts.find(p => p.id === advance.payoutId)}
                onRequestAdvance={() => setShowRequestModal(advance.payoutId)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Active Advances */}
      {activeAdvances.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Active Advances</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {activeAdvances.map((advance) => (
              <ActiveAdvanceCard
                key={advance.id}
                advance={advance}
                onView={() => onViewAdvance?.(advance.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Past Advances */}
      {pastAdvances.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Past Advances</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastAdvances.map((advance) => (
              <RepaidAdvanceCard key={advance.id} advance={advance} />
            ))}
          </div>
        </div>
      )}

      {/* Request Modal */}
      {showRequestModal && selectedPayout && (
        <AdvanceRequestModal
          payout={selectedPayout}
          paymentMethods={paymentMethods}
          onClose={() => setShowRequestModal(null)}
          onSubmit={(amount) => {
            onRequestAdvance?.(showRequestModal, amount)
            setShowRequestModal(null)
          }}
        />
      )}
    </div>
  )
}
