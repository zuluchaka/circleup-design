import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useAuth } from '@/contexts/AuthContext'
import { X, CreditCard, ShieldCheck } from 'lucide-react'

const stripeKey = document.querySelector<HTMLMetaElement>('meta[name="stripe-key"]')?.content || ''
const stripePromise = stripeKey ? loadStripe(stripeKey) : null

interface AddCardModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

type Step = 'input' | 'processing' | 'success' | 'error'

const API_BASE = '/api/v1/payment_methods'

function CardForm({ onClose, onSuccess }: Omit<AddCardModalProps, 'isOpen'>) {
  const stripe = useStripe()
  const elements = useElements()
  const { token } = useAuth()

  const [step, setStep] = useState<Step>('input')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements || !token) return

    setError(null)
    setStep('processing')

    try {
      // Step 1: Create SetupIntent
      const setupRes = await fetch(`${API_BASE}/setup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const setupData = await setupRes.json()

      if (!setupRes.ok || !setupData.data?.clientSecret) {
        throw new Error(setupData.error || 'Failed to create setup intent')
      }

      const clientSecret = setupData.data.clientSecret

      // Step 2: Confirm card setup with Stripe
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) throw new Error('Card element not found')

      const { error: stripeError, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: { card: cardElement },
      })

      if (stripeError) {
        throw new Error(stripeError.message || 'Card setup failed')
      }

      if (setupIntent?.status !== 'succeeded') {
        throw new Error(`Unexpected setup status: ${setupIntent?.status}`)
      }

      // Step 3: Verify card on backend (triggers CHF 1.00 charge)
      const verifyRes = await fetch(`${API_BASE}/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ setup_intent_id: setupIntent.id }),
      })
      const verifyData = await verifyRes.json()

      if (!verifyRes.ok) {
        throw new Error(verifyData.error || 'Card verification failed')
      }

      setStep('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Card verification failed')
      setStep('error')
    }
  }

  if (step === 'success') {
    return (
      <div className="text-center py-4">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
          <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Card Verified</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          Your card has been verified. The CHF 1.00 charge will be refunded within 3 days.
        </p>
        <button
          onClick={() => { onSuccess?.(); onClose() }}
          className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
        >
          Done
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4 flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700 dark:text-blue-300">
          A CHF 1.00 verification charge will be applied and automatically refunded within 3 days.
        </p>
      </div>

      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        Card Details
      </label>
      <div className="p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white mb-4">
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

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={step === 'processing'}
          className="flex-1 py-2.5 px-4 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || step === 'processing'}
          className="flex-1 py-2.5 px-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {step === 'processing' ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Verifying...
            </>
          ) : step === 'error' ? (
            'Retry'
          ) : (
            'Verify Card'
          )}
        </button>
      </div>

      <p className="mt-4 text-xs text-center text-slate-500 dark:text-slate-500">
        Test card: 4242 4242 4242 4242, any future expiry, any CVC
      </p>
    </form>
  )
}

export function AddCardModal({ isOpen, onClose, onSuccess }: AddCardModalProps) {
  if (!isOpen) return null

  if (!stripePromise) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
          <p className="text-red-600 dark:text-red-400 font-medium">Stripe is not configured.</p>
          <p className="text-sm text-slate-500 mt-2">Missing stripe-key meta tag.</p>
          <button
            onClick={onClose}
            className="mt-4 py-2 px-4 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Add Card</h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <Elements stripe={stripePromise}>
            <CardForm onClose={onClose} onSuccess={onSuccess} />
          </Elements>
        </div>
      </div>
    </div>
  )
}
