import { useState } from 'react'
import type { CampaignCreatorProps, CampaignCategory, CampaignVisibility } from '../types'

type Step = 'basics' | 'goals' | 'media' | 'settings' | 'preview'

const categories: { value: CampaignCategory; label: string; icon: string; description: string }[] = [
  { value: 'emergency', label: 'Emergency', icon: '🚨', description: 'Urgent relief and crisis support' },
  { value: 'project', label: 'Project', icon: '🏗️', description: 'Specific initiatives or builds' },
  { value: 'community', label: 'Community', icon: '🤝', description: 'General community support' },
  { value: 'education', label: 'Education', icon: '📚', description: 'Learning and scholarships' },
  { value: 'health', label: 'Health', icon: '❤️‍🩹', description: 'Medical and wellness' },
  { value: 'infrastructure', label: 'Infrastructure', icon: '🏢', description: 'Buildings and facilities' },
  { value: 'cultural', label: 'Cultural', icon: '🎭', description: 'Arts and heritage' },
  { value: 'other', label: 'Other', icon: '✨', description: 'Other campaigns' },
]

export function CampaignCreator({
  existingCampaign,
  onSave,
  onPublish,
  onCancel,
}: CampaignCreatorProps) {
  const [currentStep, setCurrentStep] = useState<Step>('basics')

  // Form state
  const [title, setTitle] = useState(existingCampaign?.title || '')
  const [description, setDescription] = useState(existingCampaign?.description || '')
  const [category, setCategory] = useState<CampaignCategory>(existingCampaign?.category || 'project')
  const [goalAmount, setGoalAmount] = useState(existingCampaign?.goalAmount?.toString() || '')
  const [currency, setCurrency] = useState(existingCampaign?.currency || 'CHF')
  const [startDate, setStartDate] = useState(existingCampaign?.startDate?.slice(0, 10) || '')
  const [endDate, setEndDate] = useState(existingCampaign?.endDate?.slice(0, 10) || '')
  const [coverImage, setCoverImage] = useState(existingCampaign?.coverImage || '')
  const [visibility, setVisibility] = useState<CampaignVisibility>(existingCampaign?.visibility || 'public')
  const [allowAnonymous, setAllowAnonymous] = useState(existingCampaign?.allowAnonymous ?? true)
  const [minDonation, setMinDonation] = useState(existingCampaign?.minDonation?.toString() || '10')
  const [suggestedAmounts, setSuggestedAmounts] = useState(
    existingCampaign?.suggestedAmounts?.join(', ') || '25, 50, 100, 250, 500'
  )

  const steps: { key: Step; label: string; icon: string }[] = [
    { key: 'basics', label: 'Basics', icon: '📝' },
    { key: 'goals', label: 'Goals', icon: '🎯' },
    { key: 'media', label: 'Media', icon: '🖼️' },
    { key: 'settings', label: 'Settings', icon: '⚙️' },
    { key: 'preview', label: 'Preview', icon: '👀' },
  ]

  const currentStepIndex = steps.findIndex(s => s.key === currentStep)

  const handleSave = () => {
    const campaign = {
      title,
      description,
      category,
      goalAmount: parseFloat(goalAmount),
      currency,
      startDate: startDate ? new Date(startDate).toISOString() : undefined,
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
      coverImage,
      visibility,
      allowAnonymous,
      minDonation: parseFloat(minDonation),
      suggestedAmounts: suggestedAmounts.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n)),
    }
    onSave?.(campaign)
  }

  const handlePublish = () => {
    const campaign = {
      title,
      description,
      category,
      goalAmount: parseFloat(goalAmount),
      currency,
      startDate: startDate ? new Date(startDate).toISOString() : undefined,
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
      coverImage,
      visibility,
      allowAnonymous,
      minDonation: parseFloat(minDonation),
      suggestedAmounts: suggestedAmounts.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n)),
      status: 'active' as const,
    }
    onPublish?.(campaign)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                {existingCampaign ? 'Edit Campaign' : 'Create Campaign'}
              </h1>
              <p className="text-sm text-slate-500">
                {steps[currentStepIndex].icon} Step {currentStepIndex + 1} of {steps.length}: {steps[currentStepIndex].label}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 mt-6">
            {steps.map((step, index) => (
              <button
                key={step.key}
                onClick={() => setCurrentStep(step.key)}
                className="flex-1 group"
              >
                <div
                  className={`h-2 rounded-full transition-colors ${
                    index <= currentStepIndex
                      ? 'bg-indigo-600'
                      : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                />
                <span className={`text-xs mt-1 hidden sm:block transition-colors ${
                  index === currentStepIndex
                    ? 'text-indigo-600 dark:text-indigo-400 font-medium'
                    : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                }`}>
                  {step.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Basics Step */}
        {currentStep === 'basics' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Campaign Details</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Give your campaign a compelling title"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={6}
                  placeholder="Describe your campaign, its goals, and how the funds will be used..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-slate-500 mt-1">Use paragraphs to make it easier to read</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {categories.map(cat => (
                    <button
                      key={cat.value}
                      onClick={() => setCategory(cat.value)}
                      className={`p-4 rounded-xl text-center transition-all ${
                        category === cat.value
                          ? 'bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-500 ring-2 ring-indigo-500/20'
                          : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <span className="text-2xl block mb-1">{cat.icon}</span>
                      <span className={`text-sm font-medium ${
                        category === cat.value
                          ? 'text-indigo-700 dark:text-indigo-300'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}>
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Goals Step */}
        {currentStep === 'goals' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Fundraising Goals</h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Goal Amount *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={goalAmount}
                      onChange={e => setGoalAmount(e.target.value)}
                      placeholder="50000"
                      min="100"
                      className="w-full pl-4 pr-20 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <select
                      value={currency}
                      onChange={e => setCurrency(e.target.value)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent text-slate-600 dark:text-slate-400 font-medium focus:outline-none"
                    >
                      <option value="CHF">CHF</option>
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Minimum Donation
                  </label>
                  <input
                    type="number"
                    value={minDonation}
                    onChange={e => setMinDonation(e.target.value)}
                    min="1"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Suggested Amounts
                </label>
                <input
                  type="text"
                  value={suggestedAmounts}
                  onChange={e => setSuggestedAmounts(e.target.value)}
                  placeholder="25, 50, 100, 250, 500"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-xs text-slate-500 mt-1">Comma-separated amounts shown as quick options</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    End Date (optional)
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">Leave blank for ongoing campaigns</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Media Step */}
        {currentStep === 'media' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Campaign Media</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={e => setCoverImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {coverImage && (
                <div className="relative rounded-xl overflow-hidden">
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23e2e8f0" width="100" height="100"/><text fill="%2394a3b8" x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="12">Invalid URL</text></svg>'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              )}

              <div className="p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-2">Drop images here or click to upload</p>
                <p className="text-xs text-slate-500">PNG, JPG up to 10MB</p>
                <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                  Upload Images
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Settings Step */}
        {currentStep === 'settings' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Campaign Settings</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Visibility
                </label>
                <div className="space-y-3">
                  {[
                    { value: 'public', label: 'Public', description: 'Anyone can view and donate', icon: '🌍' },
                    { value: 'members', label: 'Members Only', description: 'Only association members can donate', icon: '👥' },
                    { value: 'invited', label: 'Invite Only', description: 'Only invited people can view', icon: '✉️' },
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setVisibility(option.value as CampaignVisibility)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all ${
                        visibility === option.value
                          ? 'bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-500'
                          : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-2xl">{option.icon}</span>
                      <div>
                        <span className={`font-medium block ${
                          visibility === option.value
                            ? 'text-indigo-700 dark:text-indigo-300'
                            : 'text-slate-900 dark:text-white'
                        }`}>
                          {option.label}
                        </span>
                        <span className="text-sm text-slate-500">{option.description}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div>
                  <label className="font-medium text-slate-900 dark:text-white">Allow Anonymous Donations</label>
                  <p className="text-sm text-slate-500">Donors can choose to hide their identity</p>
                </div>
                <button
                  onClick={() => setAllowAnonymous(!allowAnonymous)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    allowAnonymous ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      allowAnonymous ? 'left-8' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preview Step */}
        {currentStep === 'preview' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
              {/* Preview Card */}
              <div className="relative h-48">
                {coverImage ? (
                  <img src={coverImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                    <span className="text-slate-400">No cover image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 dark:bg-slate-900/90 rounded-full text-xs font-medium">
                  {categories.find(c => c.value === category)?.icon} {category}
                </span>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {title || 'Campaign Title'}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-3">
                  {description || 'Campaign description will appear here...'}
                </p>

                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
                  <div className="h-full w-0 bg-indigo-500 rounded-full" />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {currency} 0 raised
                  </span>
                  <span className="text-slate-500">
                    of {currency} {parseInt(goalAmount || '0').toLocaleString()} goal
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-3">
                <span className="text-xl">💡</span>
                <div>
                  <p className="font-medium text-amber-800 dark:text-amber-300">Ready to launch?</p>
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    Save as draft to continue editing later, or publish to make your campaign live.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => {
              const stepOrder: Step[] = ['basics', 'goals', 'media', 'settings', 'preview']
              const prevIndex = stepOrder.indexOf(currentStep) - 1
              if (prevIndex >= 0) setCurrentStep(stepOrder[prevIndex])
            }}
            disabled={currentStep === 'basics'}
            className="px-6 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="px-6 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Save Draft
            </button>

            {currentStep === 'preview' ? (
              <button
                onClick={handlePublish}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold rounded-xl shadow-lg transition-all"
              >
                🚀 Publish Campaign
              </button>
            ) : (
              <button
                onClick={() => {
                  const stepOrder: Step[] = ['basics', 'goals', 'media', 'settings', 'preview']
                  const nextIndex = stepOrder.indexOf(currentStep) + 1
                  if (nextIndex < stepOrder.length) setCurrentStep(stepOrder[nextIndex])
                }}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
