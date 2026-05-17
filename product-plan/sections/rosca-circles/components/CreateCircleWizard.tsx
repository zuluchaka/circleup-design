import { useState } from 'react'
import type {
  CreateCircleProps,
  CircleFrequency,
  PayoutMethod,
  CircleVisibility,
  Circle,
} from '../types'

const frequencyOptions: { value: CircleFrequency; label: string; description: string }[] = [
  { value: 'weekly', label: 'Weekly', description: 'Contributions every week' },
  { value: 'bi_weekly', label: 'Bi-weekly', description: 'Contributions every two weeks' },
  { value: 'monthly', label: 'Monthly', description: 'Contributions once a month' },
]

const payoutMethodOptions: { value: PayoutMethod; label: string; description: string }[] = [
  { value: 'fixed', label: 'Fixed Rotation', description: 'Predetermined order based on join date or position' },
  { value: 'random', label: 'Random', description: 'Random selection each cycle' },
  { value: 'bidding', label: 'Bidding', description: 'Members bid for earlier payout positions' },
  { value: 'lottery', label: 'Lottery', description: 'Fair chance lottery each cycle' },
  { value: 'trust_score', label: 'Trust-Based', description: 'Higher trust scores get priority' },
  { value: 'need_based', label: 'Need-Based', description: 'Organizer assigns based on member needs' },
]

const visibilityOptions: { value: CircleVisibility; label: string; description: string }[] = [
  { value: 'public', label: 'Public', description: 'Anyone can discover and request to join' },
  { value: 'private', label: 'Private', description: 'Hidden from discovery, join by invitation only' },
  { value: 'invite_only', label: 'Invite Only', description: 'Visible but requires invitation to join' },
]

type WizardStep = 'basics' | 'schedule' | 'allocation' | 'penalties' | 'review'

const steps: { id: WizardStep; label: string }[] = [
  { id: 'basics', label: 'Basics' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'allocation', label: 'Allocation' },
  { id: 'penalties', label: 'Penalties' },
  { id: 'review', label: 'Review' },
]

export function CreateCircleWizard({
  aiSuggestions,
  onSubmit,
  onCancel,
  onGetSuggestions,
}: CreateCircleProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('basics')
  const [formData, setFormData] = useState<Partial<Circle>>({
    name: '',
    description: '',
    contributionAmount: 100,
    currency: 'USD',
    frequency: 'monthly',
    duration: 12,
    maxParticipants: 12,
    payoutMethod: 'fixed',
    visibility: 'private',
    emergencyFundRate: 1,
    latePenaltyPercent: 5,
    gracePeriodDays: 3,
    language: 'English',
  })

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)

  const updateFormData = (updates: Partial<Circle>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const goToNextStep = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id)
    }
  }

  const goToPrevStep = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id)
    }
  }

  const handleSubmit = () => {
    onSubmit?.(formData)
  }

  const applySuggestions = () => {
    if (aiSuggestions?.suggestions) {
      updateFormData({
        maxParticipants: aiSuggestions.suggestions.recommendedMaxParticipants,
        payoutMethod: aiSuggestions.suggestions.recommendedPayoutMethod,
        emergencyFundRate: aiSuggestions.suggestions.recommendedEmergencyFundRate,
        gracePeriodDays: aiSuggestions.suggestions.recommendedGracePeriod,
        latePenaltyPercent: aiSuggestions.suggestions.recommendedPenaltyRate,
      })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Create New Circle
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Set up your rotating savings circle in a few simple steps
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex" aria-label="Progress">
            <ol className="flex items-center w-full">
              {steps.map((step, index) => (
                <li
                  key={step.id}
                  className={`relative flex-1 ${index !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}
                >
                  <div className="flex items-center">
                    <div
                      className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                        index < currentStepIndex
                          ? 'bg-indigo-600'
                          : index === currentStepIndex
                          ? 'bg-indigo-600'
                          : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    >
                      {index < currentStepIndex ? (
                        <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <span
                          className={`text-sm font-medium ${
                            index === currentStepIndex ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {index + 1}
                        </span>
                      )}
                    </div>
                    {index !== steps.length - 1 && (
                      <div
                        className={`absolute top-4 left-8 w-full h-0.5 ${
                          index < currentStepIndex ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                      />
                    )}
                  </div>
                  <span
                    className={`mt-2 block text-xs font-medium ${
                      index <= currentStepIndex
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Content */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          {/* Basics Step */}
          {currentStep === 'basics' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Circle Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData({ name: e.target.value })}
                  placeholder="e.g., Neighborhood Savings Club"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData({ description: e.target.value })}
                  rows={3}
                  placeholder="Describe the purpose and goals of your circle..."
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Contribution Amount *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <input
                      type="number"
                      value={formData.contributionAmount}
                      onChange={(e) => updateFormData({ contributionAmount: Number(e.target.value) })}
                      min={1}
                      className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => updateFormData({ currency: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="NGN">NGN - Nigerian Naira</option>
                    <option value="KES">KES - Kenyan Shilling</option>
                    <option value="GHS">GHS - Ghanaian Cedi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Visibility
                </label>
                <div className="grid gap-3">
                  {visibilityOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                        formData.visibility === option.value
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="visibility"
                        value={option.value}
                        checked={formData.visibility === option.value}
                        onChange={(e) => updateFormData({ visibility: e.target.value as CircleVisibility })}
                        className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{option.label}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Schedule Step */}
          {currentStep === 'schedule' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Contribution Frequency
                </label>
                <div className="grid gap-3">
                  {frequencyOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                        formData.frequency === option.value
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="frequency"
                        value={option.value}
                        checked={formData.frequency === option.value}
                        onChange={(e) => updateFormData({ frequency: e.target.value as CircleFrequency })}
                        className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{option.label}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Duration (Cycles)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => updateFormData({ duration: Number(e.target.value) })}
                    min={2}
                    max={52}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Each member receives one payout per cycle
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Max Participants
                  </label>
                  <input
                    type="number"
                    value={formData.maxParticipants}
                    onChange={(e) => updateFormData({ maxParticipants: Number(e.target.value) })}
                    min={2}
                    max={50}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Typically equals duration for full rotation
                  </p>
                </div>
              </div>

              {/* AI Suggestions Button */}
              <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-indigo-900 dark:text-indigo-100">Get AI Recommendations</p>
                    <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">
                      Based on similar successful circles, get optimal settings for your configuration.
                    </p>
                    <button
                      onClick={() =>
                        onGetSuggestions?.({
                          amount: formData.contributionAmount || 100,
                          frequency: formData.frequency as CircleFrequency,
                          duration: formData.duration || 12,
                        })
                      }
                      className="mt-3 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
                    >
                      Get Suggestions
                    </button>
                  </div>
                </div>
              </div>

              {/* AI Suggestions Display */}
              {aiSuggestions && (
                <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-emerald-900 dark:text-emerald-100">AI Recommendations</h3>
                    <span className="text-sm text-emerald-700 dark:text-emerald-300">
                      {aiSuggestions.suggestions.successProbability}% success probability
                    </span>
                  </div>
                  <ul className="space-y-2 text-sm text-emerald-800 dark:text-emerald-200">
                    <li>• Recommended members: {aiSuggestions.suggestions.recommendedMaxParticipants}</li>
                    <li>• Suggested payout method: {aiSuggestions.suggestions.recommendedPayoutMethod}</li>
                    <li>• Emergency fund rate: {aiSuggestions.suggestions.recommendedEmergencyFundRate}%</li>
                  </ul>
                  <button
                    onClick={applySuggestions}
                    className="mt-3 px-4 py-2 rounded-lg border border-emerald-600 text-emerald-700 dark:text-emerald-300 text-sm font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                  >
                    Apply Suggestions
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Allocation Step */}
          {currentStep === 'allocation' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Payout Allocation Method
                </label>
                <div className="grid gap-3">
                  {payoutMethodOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                        formData.payoutMethod === option.value
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payoutMethod"
                        value={option.value}
                        checked={formData.payoutMethod === option.value}
                        onChange={(e) => updateFormData({ payoutMethod: e.target.value as PayoutMethod })}
                        className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{option.label}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Emergency Fund Rate (%)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    value={formData.emergencyFundRate}
                    onChange={(e) => updateFormData({ emergencyFundRate: Number(e.target.value) })}
                    min={0}
                    max={10}
                    step={0.5}
                    className="flex-1"
                  />
                  <span className="w-12 text-center font-medium text-slate-900 dark:text-white">
                    {formData.emergencyFundRate}%
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  This percentage of each contribution goes to the emergency fund to cover defaults.
                </p>
              </div>
            </div>
          )}

          {/* Penalties Step */}
          {currentStep === 'penalties' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Grace Period (Days)
                </label>
                <input
                  type="number"
                  value={formData.gracePeriodDays}
                  onChange={(e) => updateFormData({ gracePeriodDays: Number(e.target.value) })}
                  min={0}
                  max={14}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Number of days after due date before penalties apply
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Late Payment Penalty (%)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    value={formData.latePenaltyPercent}
                    onChange={(e) => updateFormData({ latePenaltyPercent: Number(e.target.value) })}
                    min={0}
                    max={25}
                    step={1}
                    className="flex-1"
                  />
                  <span className="w-12 text-center font-medium text-slate-900 dark:text-white">
                    {formData.latePenaltyPercent}%
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Additional fee charged on late payments (goes to emergency fund)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Primary Language
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => updateFormData({ language: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="Portuguese">Portuguese</option>
                  <option value="Swahili">Swahili</option>
                  <option value="Arabic">Arabic</option>
                </select>
              </div>
            </div>
          )}

          {/* Review Step */}
          {currentStep === 'review' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                Review Your Circle
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Circle Name</p>
                  <p className="font-medium text-slate-900 dark:text-white mt-1">
                    {formData.name || 'Not set'}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Contribution</p>
                  <p className="font-medium text-slate-900 dark:text-white mt-1">
                    {formData.currency} {formData.contributionAmount?.toLocaleString()} {frequencyOptions.find((f) => f.value === formData.frequency)?.label}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Duration</p>
                  <p className="font-medium text-slate-900 dark:text-white mt-1">
                    {formData.duration} cycles
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Max Participants</p>
                  <p className="font-medium text-slate-900 dark:text-white mt-1">
                    {formData.maxParticipants} members
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Payout Method</p>
                  <p className="font-medium text-slate-900 dark:text-white mt-1">
                    {payoutMethodOptions.find((p) => p.value === formData.payoutMethod)?.label}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Emergency Fund</p>
                  <p className="font-medium text-slate-900 dark:text-white mt-1">
                    {formData.emergencyFundRate}% of contributions
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Late Penalty</p>
                  <p className="font-medium text-slate-900 dark:text-white mt-1">
                    {formData.latePenaltyPercent}% after {formData.gracePeriodDays} days
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Visibility</p>
                  <p className="font-medium text-slate-900 dark:text-white mt-1 capitalize">
                    {formData.visibility?.replace('_', ' ')}
                  </p>
                </div>
              </div>

              {formData.description && (
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Description</p>
                  <p className="text-slate-900 dark:text-white mt-1">{formData.description}</p>
                </div>
              )}

              {/* Total Payout Calculation */}
              <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                <p className="text-sm text-indigo-700 dark:text-indigo-300">Each member will receive:</p>
                <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100 mt-1">
                  {formData.currency}{' '}
                  {(
                    (formData.contributionAmount || 0) *
                    (formData.maxParticipants || 0) *
                    (1 - (formData.emergencyFundRate || 0) / 100)
                  ).toLocaleString()}
                </p>
                <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">
                  ({formData.maxParticipants} members × {formData.currency}{' '}
                  {formData.contributionAmount?.toLocaleString()}, minus {formData.emergencyFundRate}% emergency
                  fund)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6">
          <div>
            {currentStepIndex > 0 ? (
              <button
                onClick={goToPrevStep}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Back
              </button>
            ) : (
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
          <div>
            {currentStepIndex < steps.length - 1 ? (
              <button
                onClick={goToNextStep}
                className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
              >
                Create Circle
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
