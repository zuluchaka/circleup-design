import { useState } from 'react'
import type { RegisterPageProps } from '@/../product/sections/login/types'
import { AuthLayout } from './AuthLayout'
import { SocialButtons } from './SocialButtons'
import { PasswordInput } from './PasswordInput'

export function RegisterForm({
  heroContent,
  languages,
  passwordRequirements,
  currentLanguage,
  onRegister,
  onGoogleRegister,
  onAppleRegister,
  onNavigateToLogin,
  onLanguageChange,
}: RegisterPageProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [showReferral, setShowReferral] = useState(false)
  const [tosAccepted, setTosAccepted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [emailExists, setEmailExists] = useState(false)

  const validateEmail = (val: string) => {
    if (!val) return 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Please enter a valid email address'
    return ''
  }

  const handleEmailChange = (val: string) => {
    setEmail(val)
    setEmailExists(false)
    const err = validateEmail(val)
    setErrors((prev) => (err ? { ...prev, email: err } : { ...prev, email: '' }))

    // Demo: simulate existing account detection
    if (val === 'amina.diallo@gmail.com' || val === 'fatou.barry@icloud.com') {
      setEmailExists(true)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!firstName.trim()) newErrors.firstName = 'First name is required'
    if (!lastName.trim()) newErrors.lastName = 'Last name is required'
    const emailErr = validateEmail(email)
    if (emailErr) newErrors.email = emailErr
    if (!password || password.length < 8) newErrors.password = 'Password does not meet requirements'
    if (!tosAccepted) newErrors.tos = 'You must accept the Terms of Service and Privacy Policy'

    setErrors(newErrors)
    if (Object.values(newErrors).some(Boolean)) return

    setLoading(true)
    try {
      const result = await onRegister?.({
        email,
        password,
        firstName,
        lastName,
        referralCode: referralCode || undefined,
      })
      if (result && !result.success) {
        setErrors({ form: result.error || 'Registration failed. Please try again.' })
      }
    } catch {
      setErrors({ form: 'An unexpected error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      heroContent={heroContent}
      languages={languages}
      currentLanguage={currentLanguage}
      onLanguageChange={onLanguageChange}
    >
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
          Create your account
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
          Join your community&apos;s savings circles and associations.
        </p>

        {/* Social signup */}
        <SocialButtons onGoogle={onGoogleRegister} onApple={onAppleRegister} label="sign_up" />

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            or
          </span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        </div>

        {/* Email exists warning */}
        {emailExists && (
          <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 mt-0.5 shrink-0">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Account exists. Log in instead?
              </p>
              <div className="flex gap-3 mt-1.5">
                <button
                  onClick={() => onNavigateToLogin?.()}
                  className="text-xs text-amber-700 dark:text-amber-300 underline hover:no-underline font-medium"
                >
                  Go to login
                </button>
                <span className="text-xs text-amber-400">|</span>
                <button className="text-xs text-amber-700 dark:text-amber-300 underline hover:no-underline">
                  Reset password
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="text"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value)
                  setErrors((prev) => ({ ...prev, firstName: '' }))
                }}
                placeholder="First name"
                className={`w-full px-4 py-3 text-sm bg-white dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all ${
                  errors.firstName
                    ? 'border-red-300 dark:border-red-700'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {errors.firstName && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value)
                  setErrors((prev) => ({ ...prev, lastName: '' }))
                }}
                placeholder="Last name"
                className={`w-full px-4 py-3 text-sm bg-white dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all ${
                  errors.lastName
                    ? 'border-red-300 dark:border-red-700'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {errors.lastName && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="Email address"
              className={`w-full px-4 py-3 text-sm bg-white dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all ${
                errors.email
                  ? 'border-red-300 dark:border-red-700'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.email}</p>
            )}
          </div>

          <PasswordInput
            value={password}
            onChange={(val) => {
              setPassword(val)
              setErrors((prev) => ({ ...prev, password: '' }))
            }}
            requirements={passwordRequirements}
          />

          {/* Referral code */}
          {!showReferral ? (
            <button
              type="button"
              onClick={() => setShowReferral(true)}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium flex items-center gap-1.5 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
              Have a referral code?
            </button>
          ) : (
            <div className="relative">
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                placeholder="Enter referral code"
                className="w-full px-4 py-3 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all font-mono"
              />
              {referralCode && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-amber-600 dark:text-amber-400 font-medium">
                  +25 Trust Score
                </span>
              )}
            </div>
          )}

          {/* ToS consent */}
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={tosAccepted}
              onChange={(e) => {
                setTosAccepted(e.target.checked)
                setErrors((prev) => ({ ...prev, tos: '' }))
              }}
              className={`w-4 h-4 mt-0.5 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500/40 dark:bg-slate-800 ${
                errors.tos ? 'border-red-400' : ''
              }`}
            />
            <span className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              I agree to the{' '}
              <a href="/docs/terms-of-service.pdf" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-indigo-600 dark:text-indigo-400 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/docs/privacy-policy.pdf" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-indigo-600 dark:text-indigo-400 hover:underline">
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.tos && <p className="text-xs text-red-600 dark:text-red-400 -mt-2">{errors.tos}</p>}

          {errors.form && (
            <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-sm text-red-700 dark:text-red-300">{errors.form}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all active:scale-[0.98] shadow-sm shadow-indigo-600/25"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        {/* Login link */}
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          Already have an account?{' '}
          <button
            onClick={() => onNavigateToLogin?.()}
            className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </AuthLayout>
  )
}
