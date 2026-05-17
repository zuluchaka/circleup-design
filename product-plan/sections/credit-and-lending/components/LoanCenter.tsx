import { useState } from 'react'
import {
  Wallet, Calendar, CheckCircle, Clock, AlertTriangle,
  ChevronDown, ChevronUp, CreditCard, Users, Building,
  ArrowRight, RefreshCw, Calculator
} from 'lucide-react'
import type { Loan, ScheduledPayment, Guarantor, CircleBacking } from '../types'

export interface LoanCenterProps {
  loans: Loan[]
  scheduledPayments: ScheduledPayment[]
  onViewLoan?: (loanId: string) => void
  onMakePayment?: (loanId: string, amount: number) => void
  onCalculateEarlyRepayment?: (loanId: string) => void
  onRequestRestructuring?: (loanId: string) => void
  onRefinance?: (loanId: string) => void
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-CH', { style: 'currency', currency: 'CHF' }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string }> = {
    active: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
    completed: { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-600 dark:text-slate-400' },
    pending: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
    defaulted: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400' },
    restructured: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-400' },
  }

  const style = styles[status] || styles.pending

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
      <span className="capitalize">{status}</span>
    </span>
  )
}

function ProgressRing({ progress, size = 48 }: { progress: number; size?: number }) {
  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-slate-200 dark:text-slate-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="text-indigo-500 transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold text-slate-900 dark:text-white">{Math.round(progress)}%</span>
      </div>
    </div>
  )
}

function RepaymentSchedule({ payments, loanId }: { payments: ScheduledPayment[]; loanId: string }) {
  const loanPayments = payments.filter(p => p.loanId === loanId)
  const [showAll, setShowAll] = useState(false)

  const displayPayments = showAll ? loanPayments : loanPayments.slice(0, 4)
  const upcomingIndex = loanPayments.findIndex(p => p.status === 'upcoming')

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Repayment Schedule</h4>
      <div className="space-y-2">
        {displayPayments.map((payment, index) => {
          const isUpcoming = payment.status === 'upcoming'
          const isPaid = payment.status === 'paid'

          return (
            <div
              key={payment.id}
              className={`flex items-center justify-between p-3 rounded-lg ${
                isUpcoming
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-800'
                  : isPaid
                  ? 'bg-slate-50 dark:bg-slate-700/50'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isPaid
                    ? 'bg-emerald-100 dark:bg-emerald-900/30'
                    : isUpcoming
                    ? 'bg-indigo-100 dark:bg-indigo-900/30'
                    : 'bg-slate-100 dark:bg-slate-700'
                }`}>
                  {isPaid ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : isUpcoming ? (
                    <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  ) : (
                    <span className="text-xs font-medium text-slate-500">{payment.paymentNumber}</span>
                  )}
                </div>
                <div>
                  <p className={`text-sm font-medium ${
                    isUpcoming ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-900 dark:text-white'
                  }`}>
                    Payment #{payment.paymentNumber}
                    {isUpcoming && <span className="ml-2 text-xs font-normal">Next due</span>}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(payment.dueDate)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${
                  isUpcoming ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-900 dark:text-white'
                }`}>
                  {formatCurrency(payment.totalAmount)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formatCurrency(payment.principalAmount)} + {formatCurrency(payment.interestAmount)} int.
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {loanPayments.length > 4 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-3 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1"
        >
          {showAll ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Show all {loanPayments.length} payments
            </>
          )}
        </button>
      )}
    </div>
  )
}

function GuarantorBadge({ guarantor }: { guarantor: Guarantor }) {
  return (
    <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
        {guarantor.memberName.split(' ').map(n => n[0]).join('')}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{guarantor.memberName}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Guarantees {formatCurrency(guarantor.guaranteedAmount)}</p>
      </div>
      {guarantor.status === 'confirmed' && (
        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
      )}
    </div>
  )
}

function CircleBackingBadge({ backing }: { backing: CircleBacking }) {
  return (
    <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
          <Users className="w-4 h-4 text-white" />
        </div>
        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{backing.circleName}</p>
      </div>
      <div className="text-right">
        <p className="text-xs text-slate-500 dark:text-slate-400">{backing.contributionHistory} contributions</p>
        <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{backing.onTimePercentage}% on-time</p>
      </div>
    </div>
  )
}

function LoanCard({
  loan,
  scheduledPayments,
  onViewLoan,
  onMakePayment,
  onCalculateEarlyRepayment,
  onRequestRestructuring,
  onRefinance,
}: {
  loan: Loan
  scheduledPayments: ScheduledPayment[]
  onViewLoan?: () => void
  onMakePayment?: (amount: number) => void
  onCalculateEarlyRepayment?: () => void
  onRequestRestructuring?: () => void
  onRefinance?: () => void
}) {
  const [isExpanded, setIsExpanded] = useState(loan.status === 'active')
  const progressPercent = (loan.paidAmount / loan.totalRepayment) * 100

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 capitalize">{loan.type} Loan</span>
              <StatusBadge status={loan.status} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{loan.purpose}</h3>
          </div>
          <ProgressRing progress={progressPercent} />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Principal</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">{formatCurrency(loan.principalAmount)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Interest Rate</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">{loan.interestRate}%</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Remaining</p>
            <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">{formatCurrency(loan.remainingBalance)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Monthly</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">{formatCurrency(loan.monthlyPayment)}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>{loan.paymentsCompleted} of {loan.paymentsCompleted + loan.paymentsRemaining} payments</span>
            <span>{formatCurrency(loan.paidAmount)} paid</span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Next Payment Alert */}
        {loan.status === 'active' && loan.nextPaymentDate && (
          <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-sm text-amber-700 dark:text-amber-300">
                Next payment: {formatDate(loan.nextPaymentDate)}
              </span>
            </div>
            <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
              {formatCurrency(loan.nextPaymentAmount || loan.monthlyPayment)}
            </span>
          </div>
        )}

        {/* Expand/Collapse */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 w-full flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Less details
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              More details
            </>
          )}
        </button>
      </div>

      {/* Expanded Section */}
      {isExpanded && (
        <div className="border-t border-slate-200 dark:border-slate-700 p-5 space-y-6">
          {/* Auto Repayment */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Auto-repayment</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{loan.repaymentSourceLabel}</p>
              </div>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              loan.autoRepaymentEnabled
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-600 dark:text-slate-400'
            }`}>
              {loan.autoRepaymentEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>

          {/* Guarantors */}
          {loan.guarantors.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Guarantors</h4>
              <div className="space-y-2">
                {loan.guarantors.map(guarantor => (
                  <GuarantorBadge key={guarantor.id} guarantor={guarantor} />
                ))}
              </div>
            </div>
          )}

          {/* Circle Backings */}
          {loan.circleBackings.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Backed by Circles</h4>
              <div className="space-y-2">
                {loan.circleBackings.map(backing => (
                  <CircleBackingBadge key={backing.circleId} backing={backing} />
                ))}
              </div>
            </div>
          )}

          {/* Repayment Schedule */}
          <RepaymentSchedule payments={scheduledPayments} loanId={loan.id} />

          {/* Action Buttons */}
          {loan.status === 'active' && (
            <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => onMakePayment?.(loan.monthlyPayment)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Wallet className="w-4 h-4" />
                Make Payment
              </button>
              <button
                onClick={onCalculateEarlyRepayment}
                className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <Calculator className="w-4 h-4" />
                Early Repayment
              </button>
              <button
                onClick={onRefinance}
                className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refinance
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function LoanCenter({
  loans,
  scheduledPayments,
  onViewLoan,
  onMakePayment,
  onCalculateEarlyRepayment,
  onRequestRestructuring,
  onRefinance,
}: LoanCenterProps) {
  const activeLoans = loans.filter(l => l.status === 'active')
  const completedLoans = loans.filter(l => l.status === 'completed')

  const totalOutstanding = activeLoans.reduce((sum, l) => sum + l.remainingBalance, 0)
  const totalPaid = loans.reduce((sum, l) => sum + l.paidAmount, 0)
  const nextPayment = activeLoans.find(l => l.nextPaymentDate)

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Loans</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal loans and track repayment progress
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Wallet className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Outstanding Balance</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(totalOutstanding)}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Repaid</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(totalPaid)}</p>
            </div>
          </div>
        </div>

        {nextPayment && (
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-amber-700 dark:text-amber-400">Next Payment</p>
                <p className="text-xl font-bold text-amber-800 dark:text-amber-300">
                  {formatDate(nextPayment.nextPaymentDate!)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Loans */}
      {activeLoans.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Active Loans</h2>
          <div className="space-y-4">
            {activeLoans.map(loan => (
              <LoanCard
                key={loan.id}
                loan={loan}
                scheduledPayments={scheduledPayments}
                onViewLoan={() => onViewLoan?.(loan.id)}
                onMakePayment={(amount) => onMakePayment?.(loan.id, amount)}
                onCalculateEarlyRepayment={() => onCalculateEarlyRepayment?.(loan.id)}
                onRequestRestructuring={() => onRequestRestructuring?.(loan.id)}
                onRefinance={() => onRefinance?.(loan.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Loans */}
      {completedLoans.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Completed Loans</h2>
          <div className="space-y-4">
            {completedLoans.map(loan => (
              <LoanCard
                key={loan.id}
                loan={loan}
                scheduledPayments={scheduledPayments}
                onViewLoan={() => onViewLoan?.(loan.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {loans.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
            <Wallet className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No loans yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            Apply for a personal loan backed by your circle participation
          </p>
          <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors">
            Apply for a Loan
          </button>
        </div>
      )}
    </div>
  )
}
