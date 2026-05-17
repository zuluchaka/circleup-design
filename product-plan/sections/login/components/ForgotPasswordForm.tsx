import { useState } from 'react'
import type { ForgotPasswordPageProps } from '../types'
import { AuthLayout } from './AuthLayout'

export function ForgotPasswordForm({
  heroContent,
  languages,
  currentLanguage,
  onSubmit,
  onNavigateToLogin,
  onLanguageChange,
}: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    onSubmit?.(email)
    setSubmitted(true)
  }

  return (
    <AuthLayout
      heroContent={heroContent}
      languages={languages}
      currentLanguage={currentLanguage}
      onLanguageChange={onLanguageChange}
    >
      {!submitted ? (
        <div>
          <button
            onClick={() => onNavigateToLogin?.()}
            className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 mb-6 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            Back to sign in
          </button>

          <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mb-5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600 dark:text-indigo-400">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            Reset your password
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Enter the email address linked to your account and we&apos;ll send you a reset link.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full px-4 py-3 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
            />
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all active:scale-[0.98] shadow-sm shadow-indigo-600/25"
            >
              Send reset link
            </button>
          </form>
        </div>
      ) : (
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mx-auto mb-5">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 dark:text-emerald-400">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Check your email
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
            We&apos;ve sent a password reset link to
          </p>
          <p className="text-sm font-medium text-slate-900 dark:text-white mb-6">{email}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-8">
            The link will expire in 1 hour. If you don&apos;t see the email, check your spam folder.
          </p>

          <button
            onClick={() => onNavigateToLogin?.()}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all active:scale-[0.98] shadow-sm shadow-indigo-600/25"
          >
            Back to sign in
          </button>
        </div>
      )}
    </AuthLayout>
  )
}
