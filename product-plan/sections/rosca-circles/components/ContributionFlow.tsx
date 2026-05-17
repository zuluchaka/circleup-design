import { useState } from 'react'
import type {
  ContributionFlowProps,
  PaymentMethodType,
  ContributionStatus,
} from '../types'

const paymentMethodIcons: Record<PaymentMethodType, string> = {
  card: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
  bank_account: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  sepa_debit: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
  mobile_money: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
}

const statusColors: Record<ContributionStatus, string> = {
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

export function ContributionFlow({
  circle,
  participant,
  contribution,
  paymentMethods,
  onSubmitPayment,
  onPartialPayment,
  onPayForMember,
  onSetupAutoPay,
  onCancel,
}: ContributionFlowProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    paymentMethods.find((pm) => pm.isDefault)?.id || paymentMethods[0]?.id
  )
  const [isPartialPayment, setIsPartialPayment] = useState(false)
  const [partialAmount, setPartialAmount] = useState(contribution.amount)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const selectedMethod = paymentMethods.find((pm) => pm.id === selectedPaymentMethod)
  const amountDue = contribution.isPartialPayment
    ? contribution.remainingBalance || contribution.amount
    : contribution.amount
  const isLate = contribution.isLate
  const penaltyAmount = isLate ? (contribution.amount * circle.latePenaltyPercent) / 100 : 0
  const totalDue = amountDue + penaltyAmount

  const handlePayment = () => {
    if (isPartialPayment && partialAmount < totalDue) {
      onPartialPayment?.(selectedPaymentMethod, partialAmount)
    } else {
      onSubmitPayment?.(selectedPaymentMethod, totalDue)
    }
    setShowConfirmation(true)
    setIsProcessing(true)
  }

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 text-center">
          {isProcessing ? (
            <>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center animate-pulse">
                <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Processing Payment
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Please wait while we process your payment...
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Payment Successful
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                Your contribution of {circle.currency} {(isPartialPayment ? partialAmount : totalDue).toLocaleString()} has been processed.
              </p>
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 text-left mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-slate-500 dark:text-slate-400">Receipt #</span>
                  <span className="font-mono text-slate-900 dark:text-white">RCP-{Date.now()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-500 dark:text-slate-400">Circle</span>
                  <span className="text-slate-900 dark:text-white">{circle.name}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-500 dark:text-slate-400">Cycle</span>
                  <span className="text-slate-900 dark:text-white">{contribution.cycle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Date</span>
                  <span className="text-slate-900 dark:text-white">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
              <button
                onClick={onCancel}
                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
              >
                Done
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                Make Contribution
              </h1>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                {circle.name} • Cycle {contribution.cycle}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Payment Summary Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Payment Summary
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Contribution Amount</span>
              <span className="font-medium text-slate-900 dark:text-white">
                {circle.currency} {contribution.amount.toLocaleString()}
              </span>
            </div>

            {contribution.isPartialPayment && (
              <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                <span>Previously Paid</span>
                <span>- {circle.currency} {(contribution.amount - (contribution.remainingBalance || 0)).toLocaleString()}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Emergency Fund ({circle.emergencyFundRate}%)</span>
              <span className="text-slate-700 dark:text-slate-300">
                {circle.currency} {contribution.emergencyFundPortion.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Platform Fee</span>
              <span className="text-slate-700 dark:text-slate-300">
                {circle.currency} {contribution.platformFee.toLocaleString()}
              </span>
            </div>

            {isLate && (
              <div className="flex items-center justify-between text-red-600 dark:text-red-400">
                <span className="flex items-center gap-2">
                  Late Penalty ({circle.latePenaltyPercent}%)
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </span>
                <span>+ {circle.currency} {penaltyAmount.toLocaleString()}</span>
              </div>
            )}

            <div className="h-px bg-slate-200 dark:bg-slate-700" />

            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 dark:text-white">Total Due</span>
              <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                {circle.currency} {totalDue.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Due Date */}
          <div className={`mt-4 p-3 rounded-lg ${isLate ? 'bg-red-50 dark:bg-red-900/20' : 'bg-slate-50 dark:bg-slate-700/50'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className={`w-5 h-5 ${isLate ? 'text-red-500' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className={isLate ? 'text-red-700 dark:text-red-300' : 'text-slate-700 dark:text-slate-300'}>
                  Due: {new Date(contribution.dueDate).toLocaleDateString()}
                </span>
              </div>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[contribution.status]}`}>
                {contribution.status}
                {isLate && ' (Late)'}
              </span>
            </div>
          </div>
        </div>

        {/* Partial Payment Option */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isPartialPayment}
              onChange={(e) => setIsPartialPayment(e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              <span className="font-medium text-slate-900 dark:text-white">Make Partial Payment</span>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Pay what you can now and complete the rest later
              </p>
            </div>
          </label>

          {isPartialPayment && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Amount to Pay
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{circle.currency}</span>
                <input
                  type="number"
                  value={partialAmount}
                  onChange={(e) => setPartialAmount(Number(e.target.value))}
                  min={1}
                  max={totalDue}
                  className="w-full pl-14 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Remaining after payment: {circle.currency} {(totalDue - partialAmount).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Payment Method Selection */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Payment Method
          </h2>

          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedPaymentMethod === method.id
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedPaymentMethod === method.id}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <div className="flex-1 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                    <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={paymentMethodIcons[method.type]} />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {method.brand ? `${method.brand} ` : ''}{method.type.replace('_', ' ')} •••• {method.last4}
                    </p>
                    {method.expiryMonth && method.expiryYear && (
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Expires {method.expiryMonth}/{method.expiryYear}
                      </p>
                    )}
                  </div>
                </div>
                {method.isDefault && (
                  <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">Default</span>
                )}
              </label>
            ))}
          </div>

          {/* Setup Auto-Pay */}
          {onSetupAutoPay && (
            <button
              onClick={onSetupAutoPay}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Set Up Auto-Pay
            </button>
          )}
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={!selectedPaymentMethod}
          className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium text-lg transition-colors"
        >
          Pay {circle.currency} {(isPartialPayment ? partialAmount : totalDue).toLocaleString()}
        </button>

        <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
          By clicking Pay, you authorize a charge to your {selectedMethod?.type.replace('_', ' ')} ending in {selectedMethod?.last4}
        </p>
      </div>
    </div>
  )
}
