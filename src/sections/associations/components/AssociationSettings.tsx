import { useState, useEffect, useCallback } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Settings } from 'lucide-react'
import type { Association, AssociationType, AssociationVisibility } from '@/../product/sections/associations/types'
import { SubscriptionPaymentModal } from './SubscriptionPaymentModal'

const stripeKey = document.querySelector<HTMLMetaElement>('meta[name="stripe-key"]')?.content || ''
const stripePromise = stripeKey ? loadStripe(stripeKey) : null

export interface AssociationSettingsProps {
  association: Association
  onSave?: (updates: Partial<Association>) => void | Promise<void>
  onTierChange?: (newTier: string) => Promise<void>
  onUploadLogo?: () => void
  onUploadCover?: () => void
  onUploadDocument?: (file: File, category: string) => void
  onBack?: () => void
}

type Tab = 'general' | 'relationship' | 'address' | 'finance' | 'structure' | 'documents' | 'branding' | 'privacy'

const tabs: { id: Tab; label: string; icon: string }[] = [
  {
    id: 'general',
    label: 'General',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
  },
  {
    id: 'relationship',
    label: 'Relationship',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
  {
    id: 'address',
    label: 'Address & Contact',
    icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    id: 'structure',
    label: 'Structure',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  },
  {
    id: 'documents',
    label: 'Documents',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
  {
    id: 'branding',
    label: 'Branding',
    icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
  {
    id: 'privacy',
    label: 'Privacy',
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  },
]

const typeOptions: { value: AssociationType; label: string; icon: string }[] = [
  { value: 'cultural', label: 'Cultural', icon: '🎭' },
  { value: 'religious', label: 'Religious', icon: '🕊️' },
  { value: 'professional', label: 'Professional', icon: '💼' },
  { value: 'savings', label: 'Savings', icon: '💰' },
  { value: 'social', label: 'Social', icon: '🤝' },
  { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
]

const visibilityOptions: { value: AssociationVisibility; label: string; description: string }[] = [
  { value: 'public', label: 'Public', description: 'Anyone can find and request to join' },
  { value: 'private', label: 'Private', description: 'Hidden from search, invite only' },
  { value: 'invite_only', label: 'Invite Only', description: 'Visible but requires invitation to join' },
]

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
]

const terminologyOptions = [
  { value: 'circle', label: 'Circle' },
  { value: 'susu', label: 'Susu (West African)' },
  { value: 'tontine', label: 'Tontine (French-speaking Africa)' },
  { value: 'ekub', label: 'Ekub (Ethiopian)' },
  { value: 'chit', label: 'Chit Fund (South Asian)' },
  { value: 'paluwagan', label: 'Paluwagan (Filipino)' },
]

const currencyOptions = [
  { value: 'CHF', label: 'CHF - Swiss Franc' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'GBP', label: 'GBP - British Pound' },
]

const countryOptions = [
  { value: '', label: 'Select country...' },
  { value: 'CH', label: 'Switzerland' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'IT', label: 'Italy' },
  { value: 'AT', label: 'Austria' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'US', label: 'United States' },
  { value: 'PT', label: 'Portugal' },
  { value: 'ES', label: 'Spain' },
  { value: 'BE', label: 'Belgium' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'LU', label: 'Luxembourg' },
]

const documentCategories = [
  { value: 'bylaws', label: 'Bylaws / Statutes' },
  { value: 'constitution', label: 'Constitution' },
  { value: 'code_of_conduct', label: 'Code of Conduct' },
  { value: 'financial_policy', label: 'Financial Policy' },
  { value: 'other', label: 'Other' },
]

const subscriptionTiers = [
  { id: 'free', name: 'Free', cost: 0, members: 25, circles: 2, popular: false, features: ['Circle management', 'Member directory', 'Basic reporting'] },
  { id: 'basic', name: 'Basic', cost: 29.90, members: 100, circles: 10, popular: true, features: ['Everything in Free', 'Advanced analytics', 'Standard support', 'Export to CSV'] },
  { id: 'pro', name: 'Professional', cost: 79.90, members: 500, circles: 50, popular: false, features: ['Everything in Basic', 'Priority support', 'Custom branding', 'API access'] },
]

const inputClass = 'w-full px-4 py-3 text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow hover:shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500'
const labelClass = 'block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5'
const helpClass = 'mt-1.5 text-xs text-slate-500 dark:text-slate-500'

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${checked ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}`}
    >
      <span className={`pointer-events-none inline-block h-[22px] w-[22px] transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  )
}

interface SavedCardInfo {
  id: string
  brand: string
  last4: string
  expiryMonth: number
  expiryYear: number
  isDefault: boolean
}

function AddCardForm({ onCardAdded, onCancel }: { onCardAdded: () => void; onCancel: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAddCard = useCallback(async () => {
    if (!stripe || !elements) return
    setAdding(true)
    setError(null)

    const token = localStorage.getItem('jwt-token') || localStorage.getItem('token')
    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }

    try {
      // Step 1: Create SetupIntent
      const setupRes = await fetch('/api/v1/payment_methods/setup', { method: 'POST', headers })
      const setupData = await setupRes.json()
      if (!setupRes.ok || !setupData.success) throw new Error(setupData.error || 'Failed to create setup intent')

      const clientSecret = setupData.data.clientSecret

      // Step 2: Confirm card setup with Stripe Elements
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) throw new Error('Card element not ready')

      const { error: stripeErr, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: { card: cardElement },
      })

      if (stripeErr) throw new Error(stripeErr.message)
      if (!setupIntent || setupIntent.status !== 'succeeded') throw new Error('Card setup did not complete')

      // Step 3: Verify card on backend (saves to DB, charges CHF 1.00 verification)
      const verifyRes = await fetch('/api/v1/payment_methods/verify', {
        method: 'POST',
        headers,
        body: JSON.stringify({ setup_intent_id: setupIntent.id }),
      })
      const verifyData = await verifyRes.json()
      if (!verifyRes.ok || !verifyData.success) throw new Error(verifyData.error || 'Card verification failed')

      onCardAdded()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add card')
    } finally {
      setAdding(false)
    }
  }, [stripe, elements, onCardAdded])

  return (
    <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
      <p className="text-sm font-medium text-slate-900 dark:text-white mb-3">Add a new card</p>
      {error && (
        <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-xs text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}
      <div className="mb-3 p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
        <CardElement
          options={{
            hidePostalCode: true,
            style: {
              base: { fontSize: '15px', color: '#0f172a', '::placeholder': { color: '#94a3b8' } },
              invalid: { color: '#ef4444' },
            },
          }}
        />
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-500 mb-3">
        A CHF 1.00 verification charge will be applied and refunded within 3 days.
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleAddCard}
          disabled={adding || !stripe}
          className="flex-1 py-2 px-4 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors"
        >
          {adding ? 'Verifying...' : 'Add Card'}
        </button>
        <button
          onClick={onCancel}
          disabled={adding}
          className="py-2 px-4 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

function PaymentMethodsInner() {
  const [cards, setCards] = useState<SavedCardInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const token = localStorage.getItem('jwt-token') || localStorage.getItem('token')
  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }

  const loadCards = useCallback(() => {
    setLoading(true)
    fetch('/api/v1/payment_methods', { headers })
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data?.paymentMethods) {
          setCards(data.data.paymentMethods.map((pm: Record<string, unknown>) => ({
            id: pm.id as string,
            brand: pm.brand as string,
            last4: pm.last4 as string,
            expiryMonth: pm.expiryMonth as number,
            expiryYear: pm.expiryYear as number,
            isDefault: pm.isDefault as boolean,
          })))
        } else {
          setCards([])
        }
      })
      .catch(() => setCards([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { loadCards() }, [loadCards])

  const removeCard = async (cardId: string) => {
    setRemoving(cardId)
    try {
      await fetch(`/api/v1/payment_methods/${cardId}`, { method: 'DELETE', headers })
      loadCards()
    } finally {
      setRemoving(null)
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Loading payment methods...</p>
  }

  return (
    <div className="space-y-2">
      {cards.length === 0 && !showAddForm && (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">No saved payment methods.</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Add a card to pay for subscription fees.</p>
        </div>
      )}
      {cards.map(card => (
        <div key={card.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-7 bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
              {card.brand?.slice(0, 4) || 'Card'}
            </div>
            <div>
              <span className="font-mono text-sm font-medium text-slate-900 dark:text-white">****{card.last4}</span>
              <span className="text-xs text-slate-500 ml-2">{String(card.expiryMonth).padStart(2, '0')}/{card.expiryYear}</span>
            </div>
            {card.isDefault && (
              <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">Default</span>
            )}
          </div>
          <button
            onClick={() => removeCard(card.id)}
            disabled={removing === card.id}
            className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
          >
            {removing === card.id ? 'Removing...' : 'Remove'}
          </button>
        </div>
      ))}
      {showAddForm ? (
        <AddCardForm
          onCardAdded={() => { setShowAddForm(false); loadCards() }}
          onCancel={() => setShowAddForm(false)}
        />
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full py-2.5 px-4 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Card
        </button>
      )}
    </div>
  )
}

function PaymentMethodsSection() {
  if (!stripePromise) {
    return (
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">Payment processing is not configured.</p>
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise}>
      <PaymentMethodsInner />
    </Elements>
  )
}

export function AssociationSettings({
  association,
  onSave,
  onTierChange,
  onUploadLogo,
  onUploadCover,
  onUploadDocument,
  onBack,
}: AssociationSettingsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('general')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [changingTier, setChangingTier] = useState(false)
  const currentTier = association.businessRelationship?.subscriptionTier || 'free'
  const [paymentModal, setPaymentModal] = useState<{
    tierName: string; tierId: string; amount: number; monthlyCost: number; currency: string
  } | null>(null)
  const [selectedDocCategory, setSelectedDocCategory] = useState('bylaws')

  const [formData, setFormData] = useState({
    // General
    name: association.name,
    description: association.description,
    type: association.type,
    language: association.language,
    culturalTerminology: association.settings.culturalTerminology,
    status: association.status || 'active',
    foundedAt: association.foundedAt || '',
    registrationNumber: association.registrationNumber || '',
    // Address
    street: association.street || '',
    postalCode: association.postalCode || '',
    city: association.city || '',
    country: association.country || '',
    // Contact
    website: association.website || '',
    contactEmail: association.contactEmail || '',
    contactPhone: association.contactPhone || '',
    // Finance
    currency: association.currency || 'CHF',
    postfinanceIban: association.postfinanceIban || '',
    bankName: association.bankName || '',
    accountHolderName: association.accountHolderName || '',
    duesAmount: association.settings.duesAmount || 0,
    duesFrequency: association.settings.duesFrequency || 'monthly',
    fiscalYearStartMonth: association.settings.fiscalYearStartMonth || 1,
    // Privacy
    visibility: association.visibility,
    allowPublicJoin: association.settings.allowPublicJoin,
    requireApproval: association.settings.requireApproval,
  })

  const handleChange = (field: string, value: string | boolean | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setSaving(true)
    setSaved(false)
    try {
      await onSave?.({
        name: formData.name,
        description: formData.description,
        association_type: formData.type,
        visibility: formData.visibility,
        language: formData.language,
        country: formData.country,
        status: formData.status,
        street: formData.street,
        postal_code: formData.postalCode,
        city: formData.city,
        website: formData.website,
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone,
        currency: formData.currency,
        founded_at: formData.foundedAt || null,
        registration_number: formData.registrationNumber,
        postfinance_iban: formData.postfinanceIban,
        bank_name: formData.bankName,
        account_holder_name: formData.accountHolderName,
        settings: {
          culturalTerminology: formData.culturalTerminology,
          allowPublicJoin: formData.allowPublicJoin,
          requireApproval: formData.requireApproval,
          duesAmount: formData.duesAmount,
          duesFrequency: formData.duesFrequency,
          fiscalYearStartMonth: formData.fiscalYearStartMonth,
        },
      } as unknown as Partial<Association>)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleDocUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf,.doc,.docx,.txt'
    input.onchange = () => {
      const file = input.files?.[0]
      if (file) onUploadDocument?.(file, selectedDocCategory)
    }
    input.click()
  }

  const statusConfig: Record<string, { label: string; color: string }> = {
    draft: { label: 'Draft', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    active: { label: 'Active', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
    suspended: { label: 'Suspended', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    dissolved: { label: 'Dissolved', color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
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
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                  {association.logo ? (
                    <img src={association.logo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-lg font-bold">
                      {(association.name || '?').charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Settings className="w-6 h-6 text-indigo-500" />
                    Settings
                  </h1>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {association.name}
                  </p>
                </div>
              </div>
            </div>
            <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
              statusConfig[formData.status]?.color || 'bg-slate-100 text-slate-600'
            }`}>
              {statusConfig[formData.status]?.label || 'Active'}
            </span>
          </div>

          {/* Tab navigation as pills */}
          <div className="mt-6 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <svg className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 lg:p-8">
            {/* ==================== GENERAL ==================== */}
            {activeTab === 'general' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">General Information</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Basic details about your association</p>
                </div>
                <div>
                  <label className={labelClass}>Association Name</label>
                  <input type="text" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Description</label>
                  <textarea value={formData.description} onChange={(e) => handleChange('description', e.target.value)} rows={4} className={`${inputClass} resize-none`} />
                </div>

                <div>
                  <label className={labelClass}>Association Type</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {typeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleChange('type', option.value)}
                        className={`p-4 rounded-xl border-2 transition-colors text-left ${
                          formData.type === option.value
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <span className="text-2xl block mb-1">{option.icon}</span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Primary Language</label>
                    <select value={formData.language} onChange={(e) => handleChange('language', e.target.value)} className={inputClass}>
                      {languageOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Cultural Terminology</label>
                    <select value={formData.culturalTerminology} onChange={(e) => handleChange('culturalTerminology', e.target.value)} className={inputClass}>
                      {terminologyOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Status & Registration</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Status</label>
                      <select value={formData.status} onChange={(e) => handleChange('status', e.target.value)} className={inputClass}>
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Registration Number</label>
                      <input type="text" value={formData.registrationNumber} onChange={(e) => handleChange('registrationNumber', e.target.value)} placeholder="e.g., CHE-123.456.789" className={inputClass} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className={labelClass}>Founded Date</label>
                    <input type="date" value={formData.foundedAt} onChange={(e) => handleChange('foundedAt', e.target.value)} className={inputClass} />
                  </div>
                </div>
              </div>
            )}

            {/* ==================== RELATIONSHIP ==================== */}
            {activeTab === 'relationship' && (
              <div className="space-y-8">
                {association.businessRelationship ? (
                  <>
                    {/* Circle Manager */}
                    <div>
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                          <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Circle Manager</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Your assigned Mafao Circle Manager</p>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-5 flex items-center gap-4 ring-1 ring-indigo-100 dark:ring-indigo-800/30">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white text-base">{association.businessRelationship.circleManagerName}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Relationship: {association.businessRelationship.relationshipType}</p>
                        </div>
                      </div>
                    </div>

                    {/* Business Relationship */}
                    <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                          <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Business Relationship</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Details of your Mafao service agreement</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 ring-1 ring-slate-100 dark:ring-slate-700/50">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Reference</p>
                          <p className="font-mono font-semibold text-slate-900 dark:text-white">{association.businessRelationship.reference}</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 ring-1 ring-slate-100 dark:ring-slate-700/50">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Status</p>
                          <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                            association.businessRelationship.status === 'active'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                          }`}>
                            {association.businessRelationship.status.charAt(0).toUpperCase() + association.businessRelationship.status.slice(1)}
                          </span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 ring-1 ring-slate-100 dark:ring-slate-700/50">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Subscription Tier</p>
                          <p className="font-semibold text-slate-900 dark:text-white capitalize">{association.businessRelationship.subscriptionTier || 'Free'}</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 ring-1 ring-slate-100 dark:ring-slate-700/50">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Started</p>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {association.businessRelationship.startedAt
                              ? new Date(association.businessRelationship.startedAt).toLocaleDateString()
                              : 'Pending'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Association Account */}
                    {association.associationAccount && (
                      <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Association Account</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Your financial account managed by Mafao</p>
                          </div>
                        </div>
                        {/* Balance highlight card */}
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-5 mb-4 ring-1 ring-emerald-100 dark:ring-emerald-800/30">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">Current Balance</p>
                          <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                            {association.associationAccount.balance.toLocaleString('en', { minimumFractionDigits: 2 })}
                            <span className="text-base font-semibold ml-1.5">{association.associationAccount.currency}</span>
                          </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 ring-1 ring-slate-100 dark:ring-slate-700/50">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Account Number</p>
                            <p className="font-mono font-semibold text-slate-900 dark:text-white text-sm">{association.associationAccount.accountNumber}</p>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 ring-1 ring-slate-100 dark:ring-slate-700/50">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Status</p>
                            <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                              association.associationAccount.status === 'active'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            }`}>
                              {association.associationAccount.status.charAt(0).toUpperCase() + association.associationAccount.status.slice(1)}
                            </span>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 ring-1 ring-slate-100 dark:ring-slate-700/50">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Currency</p>
                            <p className="font-semibold text-slate-900 dark:text-white">{association.associationAccount.currency}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No Circle Manager Assigned</h3>
                    <p className="text-slate-500 dark:text-slate-400">A Circle Manager will be assigned to your association shortly. Contact support if you need assistance.</p>
                  </div>
                )}
              </div>
            )}

            {/* ==================== ADDRESS & CONTACT ==================== */}
            {activeTab === 'address' && (
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                      <svg className="w-4 h-4 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Address</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Official registered address of the association</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>Street</label>
                      <input type="text" value={formData.street} onChange={(e) => handleChange('street', e.target.value)} placeholder="e.g., Bahnhofstrasse 42" className={inputClass} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className={labelClass}>Postal Code</label>
                        <input type="text" value={formData.postalCode} onChange={(e) => handleChange('postalCode', e.target.value)} placeholder="8001" className={inputClass} />
                      </div>
                      <div className="col-span-2">
                        <label className={labelClass}>City</label>
                        <input type="text" value={formData.city} onChange={(e) => handleChange('city', e.target.value)} placeholder="Zurich" className={inputClass} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Country</label>
                      <select value={formData.country} onChange={(e) => handleChange('country', e.target.value)} className={inputClass}>
                        {countryOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                      <svg className="w-4 h-4 text-sky-600 dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Contact Information</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">How people can reach your association</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>Website</label>
                      <input type="url" value={formData.website} onChange={(e) => handleChange('website', e.target.value)} placeholder="https://www.example.com" className={inputClass} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Contact Email</label>
                        <input type="email" value={formData.contactEmail} onChange={(e) => handleChange('contactEmail', e.target.value)} placeholder="info@association.ch" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Phone Number</label>
                        <input type="tel" value={formData.contactPhone} onChange={(e) => handleChange('contactPhone', e.target.value)} placeholder="+41 44 123 45 67" className={inputClass} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== FINANCE ==================== */}
            {activeTab === 'finance' && (
              <div className="space-y-8">
                {/* Subscription Plan */}
                {association.businessRelationship && (
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                        <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Subscription Plan</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Your Mafao platform subscription</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {subscriptionTiers.map((tier) => {
                        const isCurrent = tier.id === currentTier
                        const currentIdx = subscriptionTiers.findIndex(t => t.id === currentTier)
                        const tierIdx = subscriptionTiers.findIndex(t => t.id === tier.id)
                        return (
                          <div
                            key={tier.id}
                            className={`relative rounded-2xl p-5 border-2 transition-all ${
                              isCurrent
                                ? 'border-indigo-500 bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-900/30 dark:to-slate-800 dark:border-indigo-400 shadow-md shadow-indigo-500/10'
                                : tier.popular && !isCurrent
                                ? 'border-purple-200 dark:border-purple-700 bg-white dark:bg-slate-800 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md transition-shadow'
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md transition-shadow'
                            }`}
                          >
                            {isCurrent && (
                              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white text-[11px] font-bold uppercase tracking-wider rounded-full shadow-lg shadow-indigo-500/30">
                                Current
                              </span>
                            )}
                            {tier.popular && !isCurrent && (
                              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[11px] font-bold uppercase tracking-wider rounded-full shadow-lg shadow-purple-500/30">
                                Recommended
                              </span>
                            )}
                            <h4 className="text-base font-bold text-slate-900 dark:text-white mt-2">{tier.name}</h4>
                            <div className="mt-3 mb-4">
                              {tier.cost === 0 ? (
                                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">Free</span>
                              ) : (
                                <>
                                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400 align-top">CHF</span>
                                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white ml-1">{tier.cost.toFixed(2)}</span>
                                  <span className="text-sm text-slate-500 dark:text-slate-400">/mo</span>
                                </>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mb-4 text-xs text-slate-500 dark:text-slate-400">
                              <span className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                {tier.members}
                              </span>
                              <span className="w-px h-3 bg-slate-300 dark:bg-slate-600" />
                              <span className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                {tier.circles} circles
                              </span>
                            </div>
                            <ul className="space-y-2 mb-5">
                              {tier.features.map((f, i) => (
                                <li key={i} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                                  <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </div>
                                  {f}
                                </li>
                              ))}
                            </ul>
                            {!isCurrent && (onTierChange || true) && (
                              <button
                                onClick={async () => {
                                  setChangingTier(true)
                                  try {
                                    const token = localStorage.getItem('jwt-token') || localStorage.getItem('token')
                                    const res = await fetch(`/api/v1/associations/${association.id}/upgrade_subscription`, {
                                      method: 'POST',
                                      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ tier: tier.id }),
                                    })
                                    const data = await res.json()
                                    if (!res.ok) {
                                      alert(data.error || data.message || 'Failed to change subscription tier')
                                      return
                                    }
                                    if (data.data?.paymentRequired) {
                                      setPaymentModal({
                                        tierName: tier.name,
                                        tierId: tier.id,
                                        amount: data.data.amount,
                                        monthlyCost: data.data.monthlyCost,
                                        currency: data.data.currency || 'CHF',
                                      })
                                    } else {
                                      await onTierChange?.(tier.id)
                                    }
                                  } catch (err) {
                                    alert(err instanceof Error ? err.message : 'Failed to change subscription tier')
                                  } finally {
                                    setChangingTier(false)
                                  }
                                }}
                                disabled={changingTier}
                                className={`w-full py-2.5 px-4 text-sm font-semibold rounded-xl transition-all disabled:opacity-50 ${
                                  tierIdx > currentIdx
                                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/30'
                                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                {changingTier ? (
                                  <span className="flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                    Processing...
                                  </span>
                                ) : tierIdx > currentIdx ? `Upgrade to ${tier.name}` : `Downgrade to ${tier.name}`}
                              </button>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Payment Methods */}
                {association.businessRelationship && (
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Payment Methods</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Saved cards for subscription payments</p>
                      </div>
                    </div>
                    <PaymentMethodsSection />
                  </div>
                )}

                {paymentModal && (
                  <SubscriptionPaymentModal
                    associationId={association.id}
                    tierName={paymentModal.tierName}
                    tierId={paymentModal.tierId}
                    amount={paymentModal.amount}
                    monthlyCost={paymentModal.monthlyCost}
                    currency={paymentModal.currency}
                    onSuccess={() => { setPaymentModal(null); onTierChange?.(paymentModal.tierId) }}
                    onClose={() => setPaymentModal(null)}
                  />
                )}

                <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Currency & Fiscal Year</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Default financial settings for your association</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Default Currency</label>
                      <select value={formData.currency} onChange={(e) => handleChange('currency', e.target.value)} className={inputClass}>
                        {currencyOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Fiscal Year Start</label>
                      <select value={formData.fiscalYearStartMonth} onChange={(e) => handleChange('fiscalYearStartMonth', parseInt(e.target.value))} className={inputClass}>
                        {['January','February','March','April','May','June','July','August','September','October','November','December'].map((m, i) => (
                          <option key={i + 1} value={i + 1}>{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Membership Dues</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Configure membership fee collection</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Dues Amount</label>
                      <input type="number" min="0" step="1" value={formData.duesAmount} onChange={(e) => handleChange('duesAmount', parseFloat(e.target.value) || 0)} placeholder="0" className={inputClass} />
                      <p className={helpClass}>Set to 0 for no membership dues</p>
                    </div>
                    <div>
                      <label className={labelClass}>Dues Frequency</label>
                      <select value={formData.duesFrequency} onChange={(e) => handleChange('duesFrequency', e.target.value)} className={inputClass}>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="annual">Annual</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Bank Account</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">PostFinance or bank account for receiving funds</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>IBAN</label>
                      <input type="text" value={formData.postfinanceIban} onChange={(e) => handleChange('postfinanceIban', e.target.value.toUpperCase())} placeholder="CH93 0076 2011 6238 5295 7" className={inputClass} />
                      <p className={helpClass}>Swiss IBAN format: CH followed by digits</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Bank Name</label>
                        <input type="text" value={formData.bankName} onChange={(e) => handleChange('bankName', e.target.value)} placeholder="PostFinance" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Account Holder</label>
                        <input type="text" value={formData.accountHolderName} onChange={(e) => handleChange('accountHolderName', e.target.value)} placeholder="Association name" className={inputClass} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== STRUCTURE ==================== */}
            {activeTab === 'structure' && (
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Governance Structure</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Your association's organizational structure</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { role: 'President', description: 'Head of the association, leads meetings and decisions', required: true, color: 'from-indigo-500 to-purple-500', bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-600 dark:text-indigo-400' },
                    { role: 'Secretary', description: 'Manages correspondence, records, and meeting minutes', required: false, color: 'from-sky-500 to-cyan-500', bg: 'bg-sky-100 dark:bg-sky-900/30', text: 'text-sky-600 dark:text-sky-400' },
                    { role: 'Treasurer', description: 'Manages finances, budget, and financial reporting', required: false, color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400' },
                    { role: 'Admin', description: 'Platform administration and member management', required: false, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400' },
                  ].map((pos) => (
                    <div key={pos.role} className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl ring-1 ring-slate-100 dark:ring-slate-700/50 hover:ring-slate-200 dark:hover:ring-slate-600 transition-all">
                      <div className={`w-10 h-10 rounded-xl ${pos.bg} flex items-center justify-center flex-shrink-0`}>
                        <svg className={`w-5 h-5 ${pos.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-900 dark:text-white">{pos.role}</p>
                          {pos.required && (
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-full">Required</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{pos.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                      <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Committees</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Committees are managed in the Administration section</p>
                    </div>
                  </div>
                  <button
                    onClick={onBack}
                    className="px-5 py-2.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-xl transition-all hover:shadow-sm"
                  >
                    Go to Administration
                  </button>
                </div>
              </div>
            )}

            {/* ==================== DOCUMENTS ==================== */}
            {activeTab === 'documents' && (
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Association Documents</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Upload and manage your association's governing documents</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {documentCategories.map((cat, idx) => {
                    const colors = [
                      'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
                      'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
                      'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
                      'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
                      'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400',
                    ]
                    return (
                      <div key={cat.value} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl ring-1 ring-slate-100 dark:ring-slate-700/50 hover:ring-slate-200 dark:hover:ring-slate-600 transition-all group">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl ${colors[idx % colors.length].split(' ').slice(0, 2).join(' ')} flex items-center justify-center flex-shrink-0`}>
                            <svg className={`w-5 h-5 ${colors[idx % colors.length].split(' ').slice(2).join(' ')}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white text-sm">{cat.label}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500">No file uploaded</p>
                          </div>
                        </div>
                        <button
                          onClick={() => { setSelectedDocCategory(cat.value); handleDocUpload() }}
                          className="px-4 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-xl transition-all opacity-70 group-hover:opacity-100 flex items-center gap-1.5"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          Upload
                        </button>
                      </div>
                    )
                  })}
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 ring-1 ring-slate-100 dark:ring-slate-700/50">
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Supported formats: PDF, DOC, DOCX, TXT. Maximum 10MB per file.
                  </p>
                </div>
              </div>
            )}

            {/* ==================== BRANDING ==================== */}
            {activeTab === 'branding' && (
              <div className="space-y-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-pink-600 dark:text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Branding</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Customize your association's visual identity</p>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 ring-1 ring-slate-100 dark:ring-slate-700/50">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 block">Logo</label>
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white dark:bg-slate-700 flex-shrink-0 ring-2 ring-slate-200 dark:ring-slate-600 shadow-sm">
                      {association.logo ? (
                        <img src={association.logo} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                          {association.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <button onClick={onUploadLogo} className="px-5 py-2.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-xl transition-all hover:shadow-sm flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Upload New Logo
                      </button>
                      <p className={helpClass}>Recommended: 200x200px, PNG or JPG</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 ring-1 ring-slate-100 dark:ring-slate-700/50">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 block">Cover Image</label>
                  <div className="space-y-4">
                    <div className="aspect-[3/1] rounded-xl overflow-hidden bg-white dark:bg-slate-700 ring-2 ring-slate-200 dark:ring-slate-600 shadow-sm">
                      {association.coverImage ? (
                        <img src={association.coverImage} alt="Cover" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={onUploadCover} className="px-5 py-2.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-xl transition-all hover:shadow-sm flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Upload New Cover
                      </button>
                      <p className="text-xs text-slate-500 dark:text-slate-500">Recommended: 1200x400px, PNG or JPG</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== PRIVACY ==================== */}
            {activeTab === 'privacy' && (
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                      <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Visibility</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Control who can find and join your association</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {visibilityOptions.map((option) => {
                      const selected = formData.visibility === option.value
                      const icons: Record<string, string> = {
                        public: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
                        private: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
                        invite_only: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
                      }
                      return (
                        <label
                          key={option.value}
                          className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                            selected
                              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 shadow-sm shadow-indigo-500/10'
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-sm'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            selected ? 'bg-indigo-100 dark:bg-indigo-900/30' : 'bg-slate-100 dark:bg-slate-800'
                          }`}>
                            <svg className={`w-5 h-5 ${selected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icons[option.value] || icons.public} />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-slate-900 dark:text-white">{option.label}</p>
                              {selected && (
                                <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{option.description}</p>
                          </div>
                          <input
                            type="radio"
                            name="visibility"
                            value={option.value}
                            checked={selected}
                            onChange={(e) => handleChange('visibility', e.target.value)}
                            className="sr-only"
                          />
                        </label>
                      )
                    })}
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                      <svg className="w-4 h-4 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Membership Access</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">How new members can join</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="flex items-center justify-between cursor-pointer p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Allow public join requests</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Let users request to join without an invitation</p>
                      </div>
                      <Toggle checked={formData.allowPublicJoin} onChange={(v) => handleChange('allowPublicJoin', v)} />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Require approval for new members</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Admins must approve all new membership requests</p>
                      </div>
                      <Toggle checked={formData.requireApproval} onChange={(v) => handleChange('requireApproval', v)} />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== SAVE BUTTON ==================== */}
            {activeTab !== 'structure' && activeTab !== 'documents' && (
              <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {saved && (
                    <span className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400 font-medium animate-fade-in">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Changes saved successfully
                    </span>
                  )}
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30"
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Saving...
                    </span>
                  ) : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
