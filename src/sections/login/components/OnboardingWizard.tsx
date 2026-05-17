import { useState } from 'react'
import type { OnboardingWizardProps } from '@/../product/sections/login/types'

const icons: Record<string, React.ReactNode> = {
  camera: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  phone: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
  user: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  'map-pin': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  globe: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  ),
}

export function OnboardingWizard({
  user,
  steps,
  trustScoreConfig,
  onStepComplete,
  onSkip,
  onComplete,
}: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [values, setValues] = useState<Record<string, string>>({})
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const step = steps[currentStep]
  const totalBonus = steps.reduce((sum, s) => sum + s.trustScoreBonus, 0)
  const earnedBonus = Array.from(completedSteps).reduce(
    (sum, id) => sum + (steps.find((s) => s.id === id)?.trustScoreBonus ?? 0),
    0
  )
  const currentScore = trustScoreConfig.defaultScore + earnedBonus
  const progressPercent = ((currentStep + (completedSteps.has(step?.id) ? 1 : 0)) / steps.length) * 100

  const handleNext = async () => {
    if (loading) return
    setLoading(true)
    setError(null)
    try {
      if (step && values[step.id]) {
        const result = await onStepComplete?.(step.id, values[step.id])
        if (result && !result.success) {
          setError(result.error || 'Failed to save. Please try again.')
          return
        }
        setCompletedSteps((prev) => new Set([...prev, step.id]))
      }

      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        const result = await onComplete?.()
        if (result && !result.success) {
          setError(result.error || 'Failed to complete onboarding. Please try again.')
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSkipStep = async () => {
    if (loading) return
    setLoading(true)
    setError(null)
    try {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        const result = await onComplete?.()
        if (result && !result.success) {
          setError(result.error || 'Failed to complete onboarding. Please try again.')
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 py-10">
      <div className="w-full max-w-[520px]">
        {/* Header */}
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-slate-900 dark:text-white">CircleUp</span>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-1">
          Complete your profile
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-8">
          Welcome, {user.firstName}! A complete profile builds trust with your community.
        </p>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {Math.round(progressPercent)}% complete
            </span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Trust Score card */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-5 mb-8 text-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-indigo-200 font-medium uppercase tracking-wider">
                Your Trust Score
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold">{currentScore}</span>
                <span className="text-sm text-indigo-200">/ {trustScoreConfig.maxScore}</span>
              </div>
            </div>
            {step && values[step.id] && (
              <div className="text-right">
                <p className="text-xs text-indigo-200">After this step</p>
                <p className="text-lg font-bold text-amber-300">+{step.trustScoreBonus}</p>
              </div>
            )}
          </div>
          <div className="h-1.5 bg-indigo-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${(currentScore / trustScoreConfig.maxScore) * 100}%` }}
            />
          </div>
          <p className="text-xs text-indigo-200 mt-2">
            Complete all steps to earn +{totalBonus} bonus points
          </p>
        </div>

        {/* Step card */}
        {step && (
          <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center shrink-0 text-indigo-600 dark:text-indigo-400">
                {icons[step.icon] ?? icons.user}
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  {step.description}
                </p>
              </div>
            </div>

            {/* Input based on field type */}
            {step.field === 'profilePhoto' && (
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 overflow-hidden">
                  {values[step.id] ? (
                    <img src={values[step.id]} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  )}
                </div>
                <button
                  onClick={() => setValues({ ...values, [step.id]: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200' })}
                  className="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                >
                  Upload photo
                </button>
              </div>
            )}

            {step.field === 'phone' && (
              <input
                type="tel"
                value={values[step.id] ?? ''}
                onChange={(e) => setValues({ ...values, [step.id]: e.target.value })}
                placeholder="+41 79 123 4567"
                className="w-full px-4 py-3 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
              />
            )}

            {step.field === 'bio' && (
              <textarea
                value={values[step.id] ?? ''}
                onChange={(e) => setValues({ ...values, [step.id]: e.target.value })}
                placeholder="Tell your community about yourself..."
                rows={3}
                className="w-full px-4 py-3 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all resize-none"
              />
            )}

            {step.field === 'location' && (
              <input
                type="text"
                value={values[step.id] ?? ''}
                onChange={(e) => setValues({ ...values, [step.id]: e.target.value })}
                placeholder="Zürich, Switzerland"
                className="w-full px-4 py-3 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
              />
            )}

            {step.field === 'language' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {['English', 'Français', 'Deutsch', 'Italiano', 'Português'].map((lang, i) => {
                  const codes = ['en', 'fr', 'de', 'it', 'pt']
                  const flags = ['🇬🇧', '🇫🇷', '🇩🇪', '🇮🇹', '🇵🇹']
                  return (
                    <button
                      key={lang}
                      onClick={() => setValues({ ...values, [step.id]: codes[i] })}
                      className={`flex items-center gap-2 px-3 py-2.5 text-sm rounded-xl border transition-all ${
                        values[step.id] === codes[i]
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500/30'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <span>{flags[i]}</span>
                      <span>{lang}</span>
                    </button>
                  )
                })}
              </div>
            )}

            {/* Bonus badge */}
            <div className="flex items-center gap-1.5 mt-4">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                +{step.trustScoreBonus} Trust Score points
              </span>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSkipStep}
            disabled={loading}
            className="flex-1 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750 transition-all disabled:opacity-50"
          >
            Skip
          </button>
          <button
            onClick={handleNext}
            disabled={loading || !step || !values[step.id]}
            className="flex-[2] py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-semibold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-indigo-600/25"
          >
            {loading ? 'Saving...' : currentStep === steps.length - 1 ? 'Finish setup' : 'Continue'}
          </button>
        </div>

        {/* Skip all */}
        <button
          onClick={() => onSkip?.()}
          className="w-full text-center text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 mt-4 py-2 transition-colors"
        >
          Skip for now — I&apos;ll complete my profile later
        </button>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-1.5 mt-6">
          {steps.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrentStep(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentStep
                  ? 'w-6 bg-indigo-600'
                  : completedSteps.has(s.id)
                    ? 'bg-indigo-400'
                    : 'bg-slate-300 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
