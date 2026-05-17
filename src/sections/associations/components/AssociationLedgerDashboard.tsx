import { useState, useEffect, useMemo, useCallback } from 'react'
import { useAssociationLedger } from '../../hooks/useAssociationLedger'
import { SubscriptionPaymentModal } from './SubscriptionPaymentModal'
import type { LedgerEntry, FundCategory } from '@/../product/sections/associations/types'

interface BillingRecordItem {
  id: string
  reference: string
  status: string
  amount: number
  currency: string
  paymentMethod: string
  periodStart: string | null
  periodEnd: string | null
  paidAt: string | null
  description: string
  createdAt: string
}

interface AssociationLedgerDashboardProps {
  associationId: string
  onNavigate: (view: string) => void
  subscriptionTier?: string
  subscriptionCurrency?: string
  subscriptionPaidUntil?: string | null
  recentBillingRecords?: BillingRecordItem[]
  onSubscriptionPaid?: () => void
}

const TIER_COSTS: Record<string, number> = { free: 0, basic: 29.90, pro: 79.90 }
const TIER_LABELS: Record<string, string> = { free: 'Free', basic: 'Basic', pro: 'Professional' }

function getNextDueDate(dueDay: number): string {
  const now = new Date()
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), dueDay)
  const target = thisMonth > now ? thisMonth : new Date(now.getFullYear(), now.getMonth() + 1, dueDay)
  return target.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function getNextMonthDate(): string {
  const now = new Date()
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  return next.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

interface UpcomingPayment {
  label: string
  description: string
  amount: number
  currency: string
  dueDate: string
  type: 'subscription' | 'dues' | 'invoice'
  invoiceId?: string
  invoiceReference?: string
  hasQrBill?: boolean
}

function UpcomingPaymentRow({ payment, onPayNow, onViewQrBill }: { payment: UpcomingPayment; onPayNow?: () => void; onViewQrBill?: () => void }) {
  const typeColors = {
    subscription: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    dues: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    invoice: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  }
  return (
    <div className="flex items-center justify-between py-3 px-4">
      <div className="flex items-center gap-3 min-w-0">
        <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[payment.type]}`}>
          {payment.type === 'subscription' ? 'Platform' : payment.type === 'dues' ? 'Dues' : 'Invoice'}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{payment.label}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{payment.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-4">
        {onViewQrBill && (
          <button
            onClick={onViewQrBill}
            className="px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-lg transition-colors"
          >
            QR Bill
          </button>
        )}
        {onPayNow && (
          <button
            onClick={onPayNow}
            className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            Pay Now
          </button>
        )}
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            {payment.currency} {payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Due {payment.dueDate}</p>
        </div>
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
    </div>
  )
}

function DirectionBadge({ direction }: { direction: 'credit' | 'debit' }) {
  const isCredit = direction === 'credit'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
      isCredit
        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    }`}>
      {isCredit ? 'Credit' : 'Debit'}
    </span>
  )
}

function FundCard({ fund }: { fund: FundCategory }) {
  const progress = fund.targetAmount && fund.targetAmount > 0
    ? Math.min((fund.balance / fund.targetAmount) * 100, 100)
    : 0

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{fund.name}</h4>
        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
          {fund.currency} {fund.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      </div>
      {fund.purpose && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{fund.purpose}</p>
      )}
      {fund.targetAmount && fund.targetAmount > 0 && (
        <>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {progress.toFixed(0)}% of {fund.currency} {fund.targetAmount.toLocaleString()} target
          </p>
        </>
      )}
    </div>
  )
}

function TransactionRow({ entry }: { entry: LedgerEntry }) {
  const isCredit = entry.direction === 'credit'
  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 capitalize">
        {entry.entryType.replace(/_/g, ' ')}
      </td>
      <td className="px-4 py-3">
        <DirectionBadge direction={entry.direction} />
      </td>
      <td className={`px-4 py-3 text-sm text-right font-medium ${
        isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
      }`}>
        {isCredit ? '+' : '-'}{entry.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </td>
      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
        {entry.description || '-'}
      </td>
      <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
        {new Date(entry.postedAt).toLocaleDateString()}
      </td>
    </tr>
  )
}

interface QrBillData {
  iban: string
  account_holder: string
  bank_name: string
  amount: number
  currency: string
  reference: string
  message: string
}

export function AssociationLedgerDashboard({ associationId, onNavigate, subscriptionTier, subscriptionCurrency, subscriptionPaidUntil, recentBillingRecords, onSubscriptionPaid }: AssociationLedgerDashboardProps) {
  const [paymentModal, setPaymentModal] = useState<{ tierName: string; tierId: string; amount: number; currency: string } | null>(null)
  const [duesPayInvoice, setDuesPayInvoice] = useState<{ id: string; reference: string; amount: number; currency: string } | null>(null)
  const [qrBillModal, setQrBillModal] = useState<{ invoiceRef: string; data: QrBillData | null; loading: boolean; error: string | null }>({ invoiceRef: '', data: null, loading: false, error: null })
  const [payingDues, setPayingDues] = useState(false)
  const { accountSummary, duesConfig, myInvoices, loading, error, loadLedger, loadDuesConfig, loadMyInvoices, payInvoice } = useAssociationLedger(associationId)

  useEffect(() => {
    loadLedger()
    loadDuesConfig()
    loadMyInvoices()
  }, [loadLedger, loadDuesConfig, loadMyInvoices])

  const handlePayDues = useCallback(async (invoiceId: string) => {
    setPayingDues(true)
    try {
      await payInvoice(invoiceId, { payment_method: 'manual' })
      setDuesPayInvoice(null)
      await loadMyInvoices()
    } catch (e) {
      // error state is handled by the hook
    } finally {
      setPayingDues(false)
    }
  }, [payInvoice, loadMyInvoices])

  const handleFetchQrBill = useCallback(async (invoiceId: string, invoiceRef: string) => {
    setQrBillModal({ invoiceRef, data: null, loading: true, error: null })
    try {
      const token = localStorage.getItem('jwt-token') || localStorage.getItem('token')
      if (!token) throw new Error('Not authenticated')
      const res = await fetch(`/api/v1/associations/${associationId}/member_dues/${invoiceId}/qr_bill`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error || 'Failed to load QR bill')
      setQrBillModal({ invoiceRef, data: json.data.qr_bill, loading: false, error: null })
    } catch (e) {
      setQrBillModal(prev => ({ ...prev, loading: false, error: e instanceof Error ? e.message : 'Failed to load QR bill' }))
    }
  }, [associationId])

  const upcomingPayments = useMemo(() => {
    const payments: UpcomingPayment[] = []

    // Platform subscription fee — show only if not already paid for the current period
    if (subscriptionTier) {
      const tier = subscriptionTier
      const cost = TIER_COSTS[tier] || 0
      const isPaidForCurrentPeriod = subscriptionPaidUntil && new Date(subscriptionPaidUntil) >= new Date()

      if (isPaidForCurrentPeriod && cost > 0) {
        payments.push({
          label: `${TIER_LABELS[tier] || tier} Subscription`,
          description: `Paid until ${new Date(subscriptionPaidUntil!).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`,
          amount: cost,
          currency: subscriptionCurrency || accountSummary?.currency || 'CHF',
          dueDate: getNextMonthDate(),
          type: 'subscription' as const,
        })
      } else {
        payments.push({
          label: `${TIER_LABELS[tier] || tier} Subscription`,
          description: cost === 0 ? 'Free plan — no monthly fee' : 'Monthly platform fee',
          amount: cost,
          currency: subscriptionCurrency || accountSummary?.currency || 'CHF',
          dueDate: getNextMonthDate(),
          type: 'subscription',
        })
      }
    }

    // Pending invoices (from actual generated invoices)
    if (myInvoices) {
      for (const inv of myInvoices) {
        if (inv.status === 'pending' || inv.status === 'overdue') {
          payments.push({
            label: inv.status === 'overdue' ? `Overdue — ${inv.reference}` : `Dues — ${inv.reference}`,
            description: inv.period || 'Dues payment',
            amount: inv.amount + (inv.lateFee || 0),
            currency: inv.currency || accountSummary?.currency || 'CHF',
            dueDate: new Date(inv.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
            type: 'invoice',
            invoiceId: inv.id,
            invoiceReference: inv.reference,
            hasQrBill: inv.hasQrBill,
          })
        }
      }
    }

    // Show generic dues info only when configured but no pending invoices exist
    const hasPendingInvoices = payments.some(p => p.type === 'invoice')
    if (!hasPendingInvoices && duesConfig && duesConfig.active && duesConfig.amount > 0) {
      payments.push({
        label: 'Member Dues',
        description: `${duesConfig.frequency.charAt(0).toUpperCase() + duesConfig.frequency.slice(1)} dues — no invoice yet`,
        amount: duesConfig.amount,
        currency: duesConfig.currency || accountSummary?.currency || 'CHF',
        dueDate: getNextDueDate(duesConfig.dueDay),
        type: 'dues',
      })
    }

    return payments
  }, [subscriptionTier, subscriptionCurrency, subscriptionPaidUntil, duesConfig, myInvoices, accountSummary])

  if (loading) return <Spinner />

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        <button onClick={() => loadLedger()} className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400">
          Try again
        </button>
      </div>
    )
  }

  const recentEntries = accountSummary?.recentEntries?.slice(0, 20) ?? []

  return (
    <div className="space-y-6">
      {/* Subscription Billing History — shown even without an association account */}
      {recentBillingRecords && recentBillingRecords.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Subscription Payments</h3>
          <div className="space-y-2">
            {recentBillingRecords.map(rec => (
              <div key={rec.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    rec.status === 'paid'
                      ? 'bg-emerald-100 dark:bg-emerald-900/30'
                      : rec.status === 'pending' || rec.status === 'invoiced'
                      ? 'bg-amber-100 dark:bg-amber-900/30'
                      : 'bg-slate-100 dark:bg-slate-800'
                  }`}>
                    {rec.status === 'paid' ? (
                      <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{rec.description}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {rec.reference} &middot; {rec.paymentMethod}
                      {rec.paidAt && ` · ${new Date(rec.paidAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{rec.currency} {rec.amount.toFixed(2)}</p>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                    rec.status === 'paid'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : rec.status === 'pending'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>{rec.status.charAt(0).toUpperCase() + rec.status.slice(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {!accountSummary && (
        <div className="text-center py-8">
          <p className="text-slate-500 dark:text-slate-400">No association account found.</p>
        </div>
      )}

      {accountSummary && (<>
      {/* Account Summary */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm opacity-80">Account Summary</p>
          {accountSummary.isRestricted && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-400/20 text-amber-100 border border-amber-400/30">
              Restricted
            </span>
          )}
        </div>
        <p className="text-xs opacity-60 mb-1">{accountSummary.accountNumber}</p>
        <p className="text-3xl font-bold">
          {accountSummary.currency} {accountSummary.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
        <p className="text-xs opacity-60 mt-2">Currency: {accountSummary.currency}</p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onNavigate('record-expense')}
          className="px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
          Record Expense
        </button>
        <button
          onClick={() => onNavigate('record-income')}
          className="px-4 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Record Income
        </button>
        <button
          onClick={() => onNavigate('transfer-funds')}
          className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Transfer Funds
        </button>
      </div>

      {/* Fund Categories */}
      {accountSummary.fundCategories.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Fund Categories</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {accountSummary.fundCategories.map(fund => (
              <FundCard key={fund.id} fund={fund} />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Payments */}
      <section>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Upcoming Payments</h3>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700">
          {upcomingPayments.length > 0 ? (
            <>
              {upcomingPayments.map((payment, i) => (
                <UpcomingPaymentRow
                  key={`${payment.type}-${i}`}
                  payment={payment}
                  onPayNow={
                    payment.type === 'subscription' && payment.amount > 0 && !(subscriptionPaidUntil && new Date(subscriptionPaidUntil) >= new Date())
                      ? () => setPaymentModal({ tierName: TIER_LABELS[subscriptionTier || 'free'] || subscriptionTier || 'Free', tierId: subscriptionTier || 'free', amount: payment.amount, currency: payment.currency })
                      : payment.type === 'invoice' && payment.invoiceId
                        ? () => setDuesPayInvoice({ id: payment.invoiceId!, reference: payment.invoiceReference || '', amount: payment.amount, currency: payment.currency })
                        : undefined
                  }
                  onViewQrBill={
                    payment.type === 'invoice' && payment.invoiceId && payment.hasQrBill
                      ? () => handleFetchQrBill(payment.invoiceId!, payment.invoiceReference || '')
                      : undefined
                  }
                />
              ))}
              {!duesConfig && myInvoices.length === 0 && (
                <div className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/30">
                  No member dues configured yet. Set up dues in the association settings.
                </div>
              )}
            </>
          ) : (
            <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-sm">
              No upcoming payments
            </div>
          )}
        </div>
      </section>

      {paymentModal && (
        <SubscriptionPaymentModal
          associationId={associationId}
          tierName={paymentModal.tierName}
          tierId={paymentModal.tierId}
          amount={paymentModal.amount}
          monthlyCost={paymentModal.amount}
          currency={paymentModal.currency}
          onSuccess={() => { setPaymentModal(null); onSubscriptionPaid?.() }}
          onClose={() => setPaymentModal(null)}
        />
      )}

      {/* Dues Payment Confirmation Modal */}
      {duesPayInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => !payingDues && setDuesPayInvoice(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full mx-4 p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Confirm Dues Payment</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Mark invoice <span className="font-medium">{duesPayInvoice.reference}</span> as paid?
            </p>
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Amount</span>
                <span className="font-semibold text-slate-900 dark:text-white">{duesPayInvoice.currency} {duesPayInvoice.amount.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDuesPayInvoice(null)}
                disabled={payingDues}
                className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePayDues(duesPayInvoice.id)}
                disabled={payingDues}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {payingDues ? 'Processing...' : `Pay ${duesPayInvoice.currency} ${duesPayInvoice.amount.toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Bill Modal */}
      {qrBillModal.invoiceRef && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => !qrBillModal.loading && setQrBillModal({ invoiceRef: '', data: null, loading: false, error: null })}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-lg w-full mx-4 p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">QR Bill — {qrBillModal.invoiceRef}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Pay via bank transfer using the details below</p>

            {qrBillModal.loading && (
              <div className="flex items-center justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" /></div>
            )}

            {qrBillModal.error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm p-3 rounded-lg mb-4">{qrBillModal.error}</div>
            )}

            {qrBillModal.data && (
              <div className="space-y-3">
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">IBAN</span>
                    <span className="font-mono font-medium text-slate-900 dark:text-white">{qrBillModal.data.iban}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Recipient</span>
                    <span className="font-medium text-slate-900 dark:text-white">{qrBillModal.data.account_holder}</span>
                  </div>
                  {qrBillModal.data.bank_name && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Bank</span>
                      <span className="text-slate-900 dark:text-white">{qrBillModal.data.bank_name}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Amount</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{qrBillModal.data.currency} {qrBillModal.data.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Reference</span>
                    <span className="font-mono text-slate-900 dark:text-white">{qrBillModal.data.reference}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Message</span>
                    <span className="text-slate-900 dark:text-white">{qrBillModal.data.message}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                  Use this reference when making a bank transfer. The payment will be confirmed once the transfer is received.
                </p>
              </div>
            )}

            <button
              onClick={() => setQrBillModal({ invoiceRef: '', data: null, loading: false, error: null })}
              className="mt-4 w-full px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Transactions</h3>
          <button
            onClick={() => onNavigate('reports')}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
          >
            View all
          </button>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {recentEntries.length === 0 ? (
            <div className="p-6 text-center text-slate-500 dark:text-slate-400">
              No transactions yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Direction</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {recentEntries.map(entry => (
                    <TransactionRow key={entry.id} entry={entry} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
      </>
      )}
    </div>
  )
}
