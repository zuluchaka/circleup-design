import { useState } from 'react'
import type { DonationFlowProps, RecurringFrequency } from '@/../product/sections/projects-and-fundraising/types'

type Step = 'amount' | 'details' | 'payment' | 'confirmation'

export function DonationFlow({
  campaign,
  suggestedAmounts,
  onSubmit,
  onCancel,
}: DonationFlowProps) {
  const [currentStep, setCurrentStep] = useState<Step>('amount')
  const [amount, setAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurringFrequency, setRecurringFrequency] = useState<RecurringFrequency>('monthly')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const selectedAmount = amount || (customAmount ? parseFloat(customAmount) : 0)
  const matchedAmount = campaign.matchingConfig?.isActive
    ? selectedAmount * campaign.matchingConfig.matchRatio
    : 0
  const totalImpact = selectedAmount + matchedAmount

  const steps: { key: Step; label: string }[] = [
    { key: 'amount', label: 'Amount' },
    { key: 'details', label: 'Details' },
    { key: 'payment', label: 'Payment' },
    { key: 'confirmation', label: 'Confirm' },
  ]

  const currentStepIndex = steps.findIndex(s => s.key === currentStep)

  const canProceed = () => {
    switch (currentStep) {
      case 'amount':
        return selectedAmount >= campaign.minDonation
      case 'details':
        return isAnonymous || (name.trim() && email.trim())
      case 'payment':
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    const stepOrder: Step[] = ['amount', 'details', 'payment', 'confirmation']
    const nextIndex = stepOrder.indexOf(currentStep) + 1
    if (nextIndex < stepOrder.length) {
      setCurrentStep(stepOrder[nextIndex])
    }
  }

  const handleBack = () => {
    const stepOrder: Step[] = ['amount', 'details', 'payment', 'confirmation']
    const prevIndex = stepOrder.indexOf(currentStep) - 1
    if (prevIndex >= 0) {
      setCurrentStep(stepOrder[prevIndex])
    }
  }

  const handleSubmit = () => {
    onSubmit?.({
      campaignId: campaign.id,
      amount: selectedAmount,
      currency: campaign.currency,
      isAnonymous,
      isRecurring,
      recurringFrequency: isRecurring ? recurringFrequency : undefined,
      message: message || undefined,
      donorName: isAnonymous ? 'Anonymous' : name,
      donorEmail: email,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white">
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-xl font-bold">Donate to Campaign</h2>
          <p className="text-indigo-100 text-sm mt-1 line-clamp-1">{campaign.title}</p>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-6">
            {steps.map((step, index) => (
              <div key={step.key} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    index <= currentStepIndex
                      ? 'bg-white text-indigo-600'
                      : 'bg-indigo-500/50 text-white/70'
                  }`}
                >
                  {index < currentStepIndex ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 sm:w-12 h-1 mx-1 rounded transition-colors ${
                      index < currentStepIndex ? 'bg-white' : 'bg-indigo-500/50'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Amount Step */}
          {currentStep === 'amount' && (
            <div className="space-y-6">
              {campaign.matchingConfig?.isActive && (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold">
                    <span>🎯</span>
                    <span>{campaign.matchingConfig.matchRatio}x Matching Active!</span>
                  </div>
                  <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                    Your donation will be matched by {campaign.matchingConfig.sponsorName}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Select amount ({campaign.currency})
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {suggestedAmounts.map(amt => (
                    <button
                      key={amt}
                      onClick={() => {
                        setAmount(amt)
                        setCustomAmount('')
                      }}
                      className={`py-3 px-4 rounded-xl font-bold text-lg transition-all ${
                        amount === amt
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {amt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Or enter custom amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                    {campaign.currency}
                  </span>
                  <input
                    type="number"
                    min={campaign.minDonation}
                    step="1"
                    value={customAmount}
                    onChange={e => {
                      setCustomAmount(e.target.value)
                      setAmount(null)
                    }}
                    placeholder={`Min. ${campaign.minDonation}`}
                    className="w-full pl-14 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-lg font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div>
                  <label className="font-medium text-slate-900 dark:text-white">Make it recurring</label>
                  <p className="text-sm text-slate-500">Support consistently every month</p>
                </div>
                <button
                  onClick={() => setIsRecurring(!isRecurring)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    isRecurring ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      isRecurring ? 'left-8' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {isRecurring && (
                <select
                  value={recurringFrequency}
                  onChange={e => setRecurringFrequency(e.target.value as RecurringFrequency)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              )}

              {selectedAmount > 0 && (
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Your donation</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {campaign.currency} {selectedAmount.toLocaleString()}
                    </span>
                  </div>
                  {matchedAmount > 0 && (
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-amber-600 dark:text-amber-400">+ Matched amount</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">
                        {campaign.currency} {matchedAmount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-indigo-200 dark:border-indigo-800">
                    <span className="font-bold text-indigo-700 dark:text-indigo-300">Total impact</span>
                    <span className="text-xl font-extrabold text-indigo-700 dark:text-indigo-300">
                      {campaign.currency} {totalImpact.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Details Step */}
          {currentStep === 'details' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div>
                  <label className="font-medium text-slate-900 dark:text-white">Donate anonymously</label>
                  <p className="text-sm text-slate-500">Your name won't appear publicly</p>
                </div>
                <button
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    isAnonymous ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      isAnonymous ? 'left-8' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {!isAnonymous && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Your name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Email address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">We'll send your receipt here</p>
                  </div>
                </>
              )}

              {isAnonymous && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email for receipt *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">Only used for your receipt, kept private</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Leave a message (optional)
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={3}
                  placeholder="Write a note of encouragement..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* Payment Step */}
          {currentStep === 'payment' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Select payment method
                </label>
                <div className="space-y-3">
                  {[
                    { id: 'card', label: 'Credit/Debit Card', icon: '💳' },
                    { id: 'twint', label: 'TWINT', icon: '📱' },
                    { id: 'bank', label: 'Bank Transfer', icon: '🏦' },
                  ].map(method => (
                    <button
                      key={method.id}
                      className="w-full flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors text-left"
                    >
                      <span className="text-2xl">{method.icon}</span>
                      <span className="font-medium text-slate-900 dark:text-white">{method.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  🔒 Your payment is secured with 256-bit SSL encryption
                </p>
              </div>
            </div>
          )}

          {/* Confirmation Step */}
          {currentStep === 'confirmation' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Confirm your donation</h3>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {campaign.currency} {selectedAmount.toLocaleString()}
                  </span>
                </div>
                {matchedAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-amber-600">+ Matched</span>
                    <span className="font-bold text-amber-600">
                      {campaign.currency} {matchedAmount.toLocaleString()}
                    </span>
                  </div>
                )}
                {isRecurring && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Frequency</span>
                    <span className="font-medium text-slate-900 dark:text-white capitalize">{recurringFrequency}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Donor</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {isAnonymous ? 'Anonymous' : name}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-900 dark:text-white">Total Impact</span>
                  <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                    {campaign.currency} {totalImpact.toLocaleString()}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 text-center">
                By completing this donation, you agree to our Terms of Service and Privacy Policy.
                {isRecurring && ' You can cancel your recurring donation at any time.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex gap-3">
          {currentStep !== 'amount' && (
            <button
              onClick={handleBack}
              className="flex-1 py-3 px-4 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Back
            </button>
          )}
          {currentStep === 'confirmation' ? (
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition-all"
            >
              Complete Donation
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
