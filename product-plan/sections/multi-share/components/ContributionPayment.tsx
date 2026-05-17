'use client'

import { useState } from 'react'
import type { Contribution, Circle } from '../types'

interface ContributionPaymentProps {
  contribution: Contribution
  circle: Circle
  onPay?: () => void
  onConfigureSplitPayment?: (schedule: { date: string; amount: number }[]) => void
  onClose?: () => void
}

export function ContributionPayment({
  contribution,
  circle,
  onPay,
  onConfigureSplitPayment,
  onClose,
}: ContributionPaymentProps) {
  const [paymentMethod, setPaymentMethod] = useState<'full' | 'split'>('full')
  const [splitOption, setSplitOption] = useState<'2' | '4'>('2')
  const [isProcessing, setIsProcessing] = useState(false)

  const dueDate = new Date(contribution.dueDate)
  const daysUntilDue = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  const isOverdue = daysUntilDue < 0

  const handlePayment = async () => {
    setIsProcessing(true)
    try {
      if (paymentMethod === 'split') {
        const splits = splitOption === '2' ? 2 : 4
        const amountPerSplit = contribution.breakdown.totalDue / splits
        const schedule = Array.from({ length: splits }, (_, i) => ({
          date: new Date(Date.now() + (i * 7 * 24 * 60 * 60 * 1000)).toISOString(),
          amount: amountPerSplit,
        }))
        onConfigureSplitPayment?.(schedule)
      } else {
        onPay?.()
      }
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className={`
          px-6 py-5
          ${isOverdue
            ? 'bg-gradient-to-r from-red-600 to-red-700'
            : 'bg-gradient-to-r from-indigo-600 to-indigo-700'
          }
        `}>
          <div className="flex items-center justify-between">
            <div className="text-white">
              <p className="text-sm font-medium opacity-80">Cycle {contribution.cycle} Contribution</p>
              <h2 className="text-2xl font-bold mt-1">{circle.name}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Due Date Badge */}
          <div className="mt-4">
            {isOverdue ? (
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium">
                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {Math.abs(daysUntilDue)} days overdue
              </div>
            ) : daysUntilDue <= 3 ? (
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium">
                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Due in {daysUntilDue} days
              </div>
            ) : (
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium">
                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Due {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Amount Summary */}
          <div className="text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">Total Amount Due</p>
            <p className="text-4xl font-bold text-slate-900 dark:text-white mt-1">
              {circle.currency} {contribution.breakdown.totalDue.toLocaleString()}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
              {contribution.shareCount} shares × {circle.currency} {contribution.baseAmount}
            </p>
          </div>

          {/* Breakdown */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Shares Contribution</span>
              <span className="font-medium text-slate-900 dark:text-white">
                {circle.currency} {contribution.breakdown.sharesContribution.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Emergency Fund (1%)</span>
              <span className="font-medium text-slate-900 dark:text-white">
                {circle.currency} {contribution.breakdown.emergencyFund.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Platform Fee</span>
              <span className="font-medium text-slate-900 dark:text-white">
                {circle.currency} {contribution.breakdown.platformFee.toLocaleString()}
              </span>
            </div>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between">
              <span className="font-semibold text-slate-900 dark:text-white">Total</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                {circle.currency} {contribution.breakdown.totalDue.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment Options */}
          {contribution.breakdown.totalDue >= 1000 && (
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Payment Option</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPaymentMethod('full')}
                  className={`
                    p-4 rounded-xl border-2 text-left transition-all
                    ${paymentMethod === 'full'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }
                  `}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`
                      w-4 h-4 rounded-full border-2
                      ${paymentMethod === 'full'
                        ? 'border-indigo-600 bg-indigo-600'
                        : 'border-slate-300 dark:border-slate-600'
                      }
                    `}>
                      {paymentMethod === 'full' && (
                        <svg className="w-full h-full text-white" viewBox="0 0 12 12">
                          <circle cx="6" cy="6" r="3" fill="currentColor" />
                        </svg>
                      )}
                    </div>
                    <span className="font-medium text-slate-900 dark:text-white">Pay in Full</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    One-time payment
                  </p>
                </button>

                <button
                  onClick={() => setPaymentMethod('split')}
                  className={`
                    p-4 rounded-xl border-2 text-left transition-all
                    ${paymentMethod === 'split'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }
                  `}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`
                      w-4 h-4 rounded-full border-2
                      ${paymentMethod === 'split'
                        ? 'border-indigo-600 bg-indigo-600'
                        : 'border-slate-300 dark:border-slate-600'
                      }
                    `}>
                      {paymentMethod === 'split' && (
                        <svg className="w-full h-full text-white" viewBox="0 0 12 12">
                          <circle cx="6" cy="6" r="3" fill="currentColor" />
                        </svg>
                      )}
                    </div>
                    <span className="font-medium text-slate-900 dark:text-white">Split Payment</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Pay in installments
                  </p>
                </button>
              </div>

              {paymentMethod === 'split' && (
                <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Split into:</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSplitOption('2')}
                      className={`
                        p-3 rounded-lg border text-center transition-all
                        ${splitOption === '2'
                          ? 'border-indigo-600 bg-indigo-100 dark:bg-indigo-900/30'
                          : 'border-slate-200 dark:border-slate-700'
                        }
                      `}
                    >
                      <p className="font-medium text-slate-900 dark:text-white">2 Payments</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {circle.currency} {(contribution.breakdown.totalDue / 2).toLocaleString()} each
                      </p>
                    </button>
                    <button
                      onClick={() => setSplitOption('4')}
                      className={`
                        p-3 rounded-lg border text-center transition-all
                        ${splitOption === '4'
                          ? 'border-indigo-600 bg-indigo-100 dark:bg-indigo-900/30'
                          : 'border-slate-200 dark:border-slate-700'
                        }
                      `}
                    >
                      <p className="font-medium text-slate-900 dark:text-white">4 Payments</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {circle.currency} {(contribution.breakdown.totalDue / 4).toLocaleString()} each
                      </p>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Payment Methods */}
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Payment Method</p>
            <div className="space-y-2">
              <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="w-10 h-6 rounded bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center mr-3">
                  <span className="text-white text-xs font-bold">VISA</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">•••• 4242</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Expires 12/26</p>
                </div>
                <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <button className="w-full p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                + Add new payment method
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`
              w-full py-3 rounded-xl font-semibold text-white transition-all
              ${isOverdue
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-indigo-600 hover:bg-indigo-700'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : paymentMethod === 'split' ? (
              `Pay First Installment (${circle.currency} ${(contribution.breakdown.totalDue / (splitOption === '2' ? 2 : 4)).toLocaleString()})`
            ) : (
              `Pay ${circle.currency} ${contribution.breakdown.totalDue.toLocaleString()}`
            )}
          </button>

          <p className="text-xs text-center text-slate-500 dark:text-slate-500 mt-3">
            Secure payment processed by Stripe. Your data is encrypted.
          </p>
        </div>
      </div>
    </div>
  )
}
