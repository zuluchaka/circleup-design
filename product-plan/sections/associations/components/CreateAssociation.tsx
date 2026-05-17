import { useState } from 'react'
import type { AssociationType, AssociationVisibility } from '../types'

export interface CreateAssociationProps {
  onSubmit?: (data: CreateAssociationData) => void
  onCancel?: () => void
  onStartMigration?: () => void
}

export interface CreateAssociationData {
  name: string
  description: string
  type: AssociationType
  visibility: AssociationVisibility
  language: string
  culturalTerminology: string
}

type CreationMethod = 'scratch' | 'import' | null

type Step = 'method' | 'basics' | 'type' | 'visibility' | 'review'

const wizardSteps: { id: Step; title: string; description: string }[] = [
  { id: 'basics', title: 'Basics', description: 'Name and description' },
  { id: 'type', title: 'Type', description: 'Category and language' },
  { id: 'visibility', title: 'Visibility', description: 'Who can join' },
  { id: 'review', title: 'Review', description: 'Confirm details' },
]

const typeOptions: { value: AssociationType; label: string; icon: string; description: string }[] = [
  { value: 'cultural', label: 'Cultural', icon: '🎭', description: 'Heritage preservation and cultural activities' },
  { value: 'religious', label: 'Religious', icon: '🕊️', description: 'Faith-based community and spiritual support' },
  { value: 'professional', label: 'Professional', icon: '💼', description: 'Career networking and business opportunities' },
  { value: 'savings', label: 'Savings', icon: '💰', description: 'Collective savings and financial empowerment' },
  { value: 'social', label: 'Social', icon: '🤝', description: 'Social events and community building' },
  { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦', description: 'Extended family support network' },
]

const visibilityOptions: { value: AssociationVisibility; label: string; description: string; icon: string }[] = [
  {
    value: 'public',
    label: 'Public',
    description: 'Anyone can find and request to join your association',
    icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    value: 'private',
    label: 'Private',
    description: 'Hidden from search, members can only join via invitation',
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  },
  {
    value: 'invite_only',
    label: 'Invite Only',
    description: 'Visible in search but requires invitation to join',
    icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z',
  },
]

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
]

const terminologyOptions = [
  { value: 'circle', label: 'Circle', description: 'General term' },
  { value: 'susu', label: 'Susu', description: 'West African tradition' },
  { value: 'tontine', label: 'Tontine', description: 'French-speaking Africa' },
  { value: 'ekub', label: 'Ekub', description: 'Ethiopian tradition' },
  { value: 'chit', label: 'Chit Fund', description: 'South Asian tradition' },
  { value: 'paluwagan', label: 'Paluwagan', description: 'Filipino tradition' },
]

export function CreateAssociation({ onSubmit, onCancel, onStartMigration }: CreateAssociationProps) {
  const [currentStep, setCurrentStep] = useState<Step>('method')
  const [creationMethod, setCreationMethod] = useState<CreationMethod>(null)
  const [formData, setFormData] = useState<CreateAssociationData>({
    name: '',
    description: '',
    type: 'cultural',
    visibility: 'public',
    language: 'en',
    culturalTerminology: 'circle',
  })

  const wizardStepIndex = wizardSteps.findIndex((s) => s.id === currentStep)
  const isMethodStep = currentStep === 'method'

  const handleChange = (field: keyof CreateAssociationData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const canProceed = () => {
    if (isMethodStep) return creationMethod !== null
    switch (currentStep) {
      case 'basics':
        return formData.name.trim().length >= 3 && formData.description.trim().length >= 10
      case 'type':
        return formData.type && formData.language
      case 'visibility':
        return formData.visibility
      default:
        return true
    }
  }

  const goNext = () => {
    if (isMethodStep) {
      if (creationMethod === 'import') {
        onStartMigration?.()
        return
      }
      setCurrentStep('basics')
      return
    }
    const nextIndex = wizardStepIndex + 1
    if (nextIndex < wizardSteps.length) {
      setCurrentStep(wizardSteps[nextIndex].id)
    }
  }

  const goBack = () => {
    if (isMethodStep) return
    if (currentStep === 'basics') {
      setCurrentStep('method')
      return
    }
    const prevIndex = wizardStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(wizardSteps[prevIndex].id)
    }
  }

  const handleSubmit = () => {
    onSubmit?.(formData)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onCancel}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
              Create Association
            </h1>
            <div className="w-9" />
          </div>

          {/* Progress — only show for scratch wizard steps */}
          {!isMethodStep && (
            <div className="flex items-center gap-2">
              {wizardSteps.map((step, index) => (
                <div key={step.id} className="flex-1">
                  <div
                    className={`
                      h-1.5 rounded-full transition-colors
                      ${index <= wizardStepIndex
                        ? 'bg-indigo-600'
                        : 'bg-slate-200 dark:bg-slate-700'
                      }
                    `}
                  />
                  <p className={`
                    mt-2 text-xs font-medium transition-colors hidden sm:block
                    ${index === wizardStepIndex
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : index < wizardStepIndex
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-400 dark:text-slate-600'
                    }
                  `}>
                    {step.title}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
          {/* Method Selection Step */}
          {isMethodStep && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  How would you like to get started?
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Create a brand new association or import an existing one with all its members and circles.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Create from Scratch */}
                <button
                  onClick={() => setCreationMethod('scratch')}
                  className={`
                    p-6 rounded-xl border-2 transition-all text-left flex flex-col items-start gap-4
                    ${creationMethod === 'scratch'
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-lg shadow-indigo-500/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }
                  `}
                >
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center
                    ${creationMethod === 'scratch'
                      ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }
                  `}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <span className="block font-semibold text-slate-900 dark:text-white text-base">
                      Create from Scratch
                    </span>
                    <span className="block text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Start fresh with a guided wizard to set up your association step by step
                    </span>
                  </div>
                </button>

                {/* Import Existing Association */}
                <button
                  onClick={() => setCreationMethod('import')}
                  className={`
                    p-6 rounded-xl border-2 transition-all text-left flex flex-col items-start gap-4
                    ${creationMethod === 'import'
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-lg shadow-indigo-500/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }
                  `}
                >
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center
                    ${creationMethod === 'import'
                      ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }
                  `}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <div>
                    <span className="block font-semibold text-slate-900 dark:text-white text-base">
                      Import Existing Association
                    </span>
                    <span className="block text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Migrate an existing association with members, circles, and financial data
                    </span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {currentStep === 'basics' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Let's start with the basics
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Give your association a name and description that reflects its purpose.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Association Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g., Nigerian Professionals Network"
                  className="w-full px-4 py-3 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
                <p className="mt-2 text-xs text-slate-500">Minimum 3 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe your association's purpose, goals, and who it's for..."
                  rows={4}
                  className="w-full px-4 py-3 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 resize-none"
                />
                <p className="mt-2 text-xs text-slate-500">Minimum 10 characters</p>
              </div>
            </div>
          )}

          {currentStep === 'type' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  What type of association is this?
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Choose a category that best describes your community.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {typeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleChange('type', option.value)}
                    className={`
                      p-4 rounded-xl border-2 transition-colors text-left
                      ${formData.type === option.value
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }
                    `}
                  >
                    <span className="text-2xl block mb-2">{option.icon}</span>
                    <span className="block font-medium text-slate-900 dark:text-white">
                      {option.label}
                    </span>
                    <span className="block text-xs text-slate-500 dark:text-slate-500 mt-1">
                      {option.description}
                    </span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Primary Language
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => handleChange('language', e.target.value)}
                    className="w-full px-4 py-3 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  >
                    {languageOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Cultural Terminology
                  </label>
                  <select
                    value={formData.culturalTerminology}
                    onChange={(e) => handleChange('culturalTerminology', e.target.value)}
                    className="w-full px-4 py-3 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  >
                    {terminologyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label} ({option.description})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'visibility' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Who can join?
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Control how people discover and join your association.
                </p>
              </div>

              <div className="space-y-3">
                {visibilityOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleChange('visibility', option.value)}
                    className={`
                      w-full p-4 rounded-xl border-2 transition-colors text-left flex items-start gap-4
                      ${formData.visibility === option.value
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }
                    `}
                  >
                    <div className={`
                      w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                      ${formData.visibility === option.value
                        ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }
                    `}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={option.icon} />
                      </svg>
                    </div>
                    <div>
                      <span className="block font-medium text-slate-900 dark:text-white">
                        {option.label}
                      </span>
                      <span className="block text-sm text-slate-500 dark:text-slate-500 mt-0.5">
                        {option.description}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 'review' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Review your association
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Make sure everything looks good before creating.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                      {formData.name.charAt(0) || '?'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white text-lg">
                        {formData.name || 'Untitled'}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm">
                          {typeOptions.find((t) => t.value === formData.type)?.icon}
                        </span>
                        <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                          {formData.type}
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">·</span>
                        <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                          {formData.visibility.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-500 dark:text-slate-500 mb-1">
                    Description
                  </h4>
                  <p className="text-slate-900 dark:text-white">
                    {formData.description || 'No description'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 dark:text-slate-500 mb-1">
                      Language
                    </h4>
                    <p className="text-slate-900 dark:text-white">
                      {languageOptions.find((l) => l.value === formData.language)?.label}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 dark:text-slate-500 mb-1">
                      Terminology
                    </h4>
                    <p className="text-slate-900 dark:text-white capitalize">
                      {formData.culturalTerminology}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between">
            {!isMethodStep && (
              <button
                onClick={goBack}
                className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Back
              </button>
            )}
            {isMethodStep && <div />}

            {currentStep === 'review' ? (
              <button
                onClick={handleSubmit}
                className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-lg shadow-indigo-500/25"
              >
                Create Association
              </button>
            ) : (
              <button
                onClick={goNext}
                disabled={!canProceed()}
                className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed rounded-xl transition-colors shadow-lg shadow-indigo-500/25 disabled:shadow-none"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
