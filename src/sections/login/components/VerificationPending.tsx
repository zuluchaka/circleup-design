import { useState } from 'react'
import type { VerificationPendingPageProps } from '@/../product/sections/login/types'

export function VerificationPending({
  email,
  resendsRemaining: initialResends,
  onResend,
  onChangeEmail,
}: VerificationPendingPageProps) {
  const [resendsRemaining, setResendsRemaining] = useState(initialResends)
  const [justResent, setJustResent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleResend = async () => {
    if (resendsRemaining <= 0 || loading) return
    setLoading(true)
    setError(null)
    try {
      const result = await onResend?.()
      if (result && !result.success) {
        setError(result.error || 'Failed to resend email. Please try again.')
      } else {
        setResendsRemaining((r) => r - 1)
        setJustResent(true)
        setTimeout(() => setJustResent(false), 3000)
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-6">
      <div className="w-full max-w-[440px] text-center">
        {/* Logo */}
        <div className="flex items-center gap-2.5 justify-center mb-12">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-slate-900 dark:text-white">CircleUp</span>
        </div>

        {/* Mail icon with animated pulse */}
        <div className="relative inline-flex mb-6">
          <div className="absolute inset-0 rounded-3xl bg-indigo-200 dark:bg-indigo-800 animate-ping opacity-20" />
          <div className="relative w-16 h-16 rounded-3xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600 dark:text-indigo-400">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Verify your email
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
          We sent a verification link to
        </p>
        <p className="text-sm font-medium text-slate-900 dark:text-white mb-6">
          {email}
        </p>

        {/* Success feedback */}
        {justResent && (
          <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-sm text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Verification email resent!
          </div>
        )}

        {/* Instructions card */}
        <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 mb-6 text-left">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Next steps:
          </p>
          <ol className="space-y-2.5">
            <li className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400">
              <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
              Open your email inbox
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400">
              <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
              Click the verification link in the email from CircleUp
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400">
              <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
              Complete your profile to boost your Trust Score
            </li>
          </ol>
        </div>

        {/* Spam tip */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl p-3 mb-6 flex items-start gap-2.5 text-left">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 mt-0.5 shrink-0">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-xs text-amber-700 dark:text-amber-400">
            Can&apos;t find the email? Check your spam or junk folder. The link expires in 24 hours.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleResend}
            disabled={resendsRemaining <= 0 || loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-indigo-600/25"
          >
            {loading
              ? 'Sending...'
              : resendsRemaining > 0
                ? `Resend email (${resendsRemaining} remaining)`
                : 'Resend limit reached — try again later'}
          </button>
          <button
            onClick={() => onChangeEmail?.()}
            className="w-full py-3 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium transition-colors"
          >
            Use a different email
          </button>
        </div>
      </div>
    </div>
  )
}
