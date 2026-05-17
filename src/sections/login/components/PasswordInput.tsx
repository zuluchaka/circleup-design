import { useState, useMemo } from 'react'
import type { PasswordRequirement } from '@/../product/sections/login/types'

interface PasswordInputProps {
  value: string
  onChange: (value: string) => void
  requirements: PasswordRequirement[]
  placeholder?: string
  showRequirements?: boolean
}

export function PasswordInput({
  value,
  onChange,
  requirements,
  placeholder = 'Password',
  showRequirements = true,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false)
  const [focused, setFocused] = useState(false)

  const checks = useMemo(
    () =>
      requirements.map((req) => ({
        ...req,
        passed: new RegExp(req.regex).test(value),
      })),
    [value, requirements]
  )

  const passedCount = checks.filter((c) => c.passed).length
  const strength = value.length === 0 ? 0 : passedCount / requirements.length

  const strengthLabel =
    strength === 0 ? '' : strength < 0.5 ? 'Weak' : strength < 1 ? 'Fair' : 'Strong'
  const strengthColor =
    strength < 0.5
      ? 'bg-red-500'
      : strength < 1
        ? 'bg-amber-500'
        : 'bg-emerald-500'

  return (
    <div>
      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-11 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          {visible ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>

      {showRequirements && value.length > 0 && (focused || value.length > 0) && (
        <div className="mt-3 space-y-2">
          {/* Strength bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex gap-0.5">
              {requirements.map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-all duration-300 ${
                    i < passedCount ? strengthColor : 'bg-transparent'
                  }`}
                />
              ))}
            </div>
            {strengthLabel && (
              <span
                className={`text-xs font-medium ${
                  strength < 0.5
                    ? 'text-red-600 dark:text-red-400'
                    : strength < 1
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {strengthLabel}
              </span>
            )}
          </div>

          {/* Requirement checklist */}
          <div className="space-y-1">
            {checks.map((check) => (
              <div key={check.id} className="flex items-center gap-2 text-xs">
                <div
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all ${
                    check.passed
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                >
                  {check.passed && (
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4L3.25 5.75L6.5 2.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span
                  className={
                    check.passed
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-slate-500 dark:text-slate-400'
                  }
                >
                  {check.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
