import { useState, useEffect, useCallback } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { CreditCard, Smartphone, X, Check, Loader2, AlertCircle } from 'lucide-react'

const stripeKey = document.querySelector<HTMLMetaElement>('meta[name="stripe-key"]')?.content || ''
const stripePromise = stripeKey ? loadStripe(stripeKey) : null

interface SavedCard {
  id: string
  brand: string
  last4: string
  expiryMonth: number
  expiryYear: number
  isDefault: boolean
}

export interface DuesPaymentModalProps {
  associationId: string
  invoiceId: string
  amount: number
  currency: string
  reference: string
  period: string
  onSuccess: () => void
  onClose: () => void
}

type PaymentTab = 'saved_card' | 'new_card' | 'twint'
type PaymentStatus = 'idle' | 'processing' | 'success' | 'error'

function brandIcon(brand: string) {
  const b = brand?.toLowerCase() || ''
  if (b.includes('visa')) return 'Visa'
  if (b.includes('master')) return 'MC'
  if (b.includes('amex')) return 'Amex'
  return brand || 'Card'
}

function DuesPaymentFormInner({ associationId, invoiceId, amount, currency, reference, period, onSuccess, onClose }: DuesPaymentModalProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [tab, setTab] = useState<PaymentTab>('saved_card')
  const [status, setStatus] = useState<PaymentStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [savedCards, setSavedCards] = useState<SavedCard[]>([])
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [cardsLoading, setCardsLoading] = useState(true)

  const getHeaders = () => {
    const t = localStorage.getItem('jwt-token') || localStorage.getItem('token')
    return { 'Authorization': `Bearer ${t}`, 'Content-Type': 'application/json' }
  }
  const baseUrl = `/api/v1/associations/${associationId}/member_dues/${invoiceId}`

  useEffect(() => {
    fetch('/api/v1/payment_methods', { headers: getHeaders() })
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data?.paymentMethods?.length > 0) {
          const cards = data.data.paymentMethods.map((pm: Record<string, unknown>) => ({
            id: pm.id as string,
            brand: pm.brand as string,
            last4: pm.last4 as string,
            expiryMonth: pm.expiryMonth as number,
            expiryYear: pm.expiryYear as number,
            isDefault: pm.isDefault as boolean,
          }))
          setSavedCards(cards)
          setSelectedCardId(cards.find((c: SavedCard) => c.isDefault)?.id || cards[0]?.id || null)
        } else {
          setTab('new_card')
        }
      })
      .catch(() => setTab('new_card'))
      .finally(() => setCardsLoading(false))
  }, [])

  const payWithSavedCard = useCallback(async () => {
    if (!selectedCardId) return
    setStatus('processing')
    setError(null)

    try {
      const res = await fetch(`${baseUrl}/pay_with_card`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ payment_method_id: selectedCardId }),
      })
      const data = await res.json()

      if (res.status === 401) throw new Error('Session expired. Please close this dialog and re-login.')
      if (!res.ok || !data.success) throw new Error(data.error || 'Payment failed')

      if (data.data.status === 'paid') {
        setStatus('success')
        setTimeout(onSuccess, 1500)
      } else if (data.data.status === 'requires_action' && stripe && data.data.client_secret) {
        const { error: stripeErr } = await stripe.confirmCardPayment(data.data.client_secret)
        if (stripeErr) throw new Error(stripeErr.message)

        const confirmRes = await fetch(`${baseUrl}/confirm_payment`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ payment_intent_id: data.data.payment_intent_id }),
        })
        const confirmData = await confirmRes.json()
        if (confirmData.data?.status === 'paid') {
          setStatus('success')
          setTimeout(onSuccess, 1500)
        } else {
          throw new Error('Payment not confirmed')
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed')
      setStatus('error')
    }
  }, [selectedCardId, stripe, baseUrl, onSuccess])

  const payWithNewCard = useCallback(async () => {
    if (!stripe || !elements) return
    setStatus('processing')
    setError(null)

    try {
      const res = await fetch(`${baseUrl}/pay_with_new_card`, {
        method: 'POST',
        headers: getHeaders(),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Payment setup failed')

      const clientSecret = data.data.client_secret
      const paymentIntentId = data.data.payment_intent_id

      const cardElement = elements.getElement(CardElement)
      if (!cardElement) throw new Error('Card element not found')

      const { error: stripeErr, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      })

      if (stripeErr) throw new Error(stripeErr.message)

      if (paymentIntent?.status === 'succeeded') {
        await fetch(`${baseUrl}/confirm_payment`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ payment_intent_id: paymentIntentId }),
        })
        setStatus('success')
        setTimeout(onSuccess, 1500)
      } else {
        throw new Error(`Unexpected status: ${paymentIntent?.status}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed')
      setStatus('error')
    }
  }, [stripe, elements, baseUrl, onSuccess])

  const initiateTwint = useCallback(async () => {
    if (!stripe) return
    setStatus('processing')
    setError(null)

    try {
      const res = await fetch(`${baseUrl}/pay_with_twint`, {
        method: 'POST',
        headers: getHeaders(),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'TWINT setup failed')

      const { error: stripeErr } = await stripe.confirmPayment({
        clientSecret: data.data.client_secret,
        confirmParams: { return_url: `${window.location.origin}/app/associations?payment_status=success` },
      })

      if (stripeErr) throw new Error(stripeErr.message)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'TWINT payment failed')
      setStatus('error')
    }
  }, [stripe, baseUrl])

  const tabs: { id: PaymentTab; label: string; icon: React.ReactNode }[] = [
    { id: 'saved_card', label: 'Saved Card', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'new_card', label: 'New Card', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'twint', label: 'TWINT', icon: <Smartphone className="w-4 h-4" /> },
  ]

  if (status === 'success') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Payment Successful</h3>
          <p className="text-slate-500 dark:text-slate-400">Your dues for {period} have been paid.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Pay Dues — {period}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {currency} {amount.toFixed(2)} &middot; Ref: {reference}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Payment method tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 px-6 gap-1 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setError(null); setStatus('idle') }}
              className={`flex items-center gap-2 px-3 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                tab === t.id
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Saved Card */}
          {tab === 'saved_card' && (
            <div>
              {cardsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                </div>
              ) : savedCards.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-slate-500 dark:text-slate-400 mb-3">No saved cards</p>
                  <button
                    onClick={() => setTab('new_card')}
                    className="text-indigo-600 dark:text-indigo-400 font-medium text-sm hover:underline"
                  >
                    Add a new card
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedCards.map(card => (
                    <label
                      key={card.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${
                        selectedCardId === card.id
                          ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="saved_card"
                        checked={selectedCardId === card.id}
                        onChange={() => setSelectedCardId(card.id)}
                        className="text-indigo-600"
                      />
                      <div className="flex-1">
                        <span className="font-mono text-sm font-medium text-slate-900 dark:text-white">
                          {brandIcon(card.brand)} ****{card.last4}
                        </span>
                        <span className="text-xs text-slate-500 ml-2">
                          {String(card.expiryMonth).padStart(2, '0')}/{card.expiryYear}
                        </span>
                      </div>
                      {card.isDefault && (
                        <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </label>
                  ))}
                  <button
                    onClick={() => setTab('new_card')}
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline mt-2"
                  >
                    + Use a different card
                  </button>
                  <button
                    onClick={payWithSavedCard}
                    disabled={status === 'processing' || !selectedCardId}
                    className="w-full mt-4 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {status === 'processing' ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                    ) : (
                      <>Pay {currency} {amount.toFixed(2)}</>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* New Card */}
          {tab === 'new_card' && (
            <div>
              <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <CardElement
                  options={{
                    hidePostalCode: true,
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#0f172a',
                        '::placeholder': { color: '#94a3b8' },
                      },
                      invalid: { color: '#ef4444' },
                    },
                  }}
                />
              </div>
              <button
                onClick={payWithNewCard}
                disabled={status === 'processing' || !stripe}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {status === 'processing' ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                ) : (
                  <>Pay {currency} {amount.toFixed(2)}</>
                )}
              </button>
            </div>
          )}

          {/* TWINT */}
          {tab === 'twint' && (
            <div className="text-center">
              <Smartphone className="w-12 h-12 text-purple-500 mx-auto mb-3" />
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                Pay with TWINT mobile payment
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mb-4">
                You will be redirected to complete the payment in your banking app.
              </p>
              <button
                onClick={initiateTwint}
                disabled={status === 'processing' || !stripe}
                className="py-3 px-6 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium rounded-xl transition-colors inline-flex items-center gap-2"
              >
                {status === 'processing' ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Connecting...</>
                ) : (
                  <>Pay {currency} {amount.toFixed(2)} with TWINT</>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function DuesPaymentModal(props: DuesPaymentModalProps) {
  if (!stripePromise) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <p className="text-red-600 dark:text-red-400 font-medium">Stripe is not configured.</p>
          <p className="text-sm text-slate-500 mt-2 mb-4">Payment processing is unavailable.</p>
          <button
            onClick={props.onClose}
            className="py-2 px-4 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise}>
      <DuesPaymentFormInner {...props} />
    </Elements>
  )
}
