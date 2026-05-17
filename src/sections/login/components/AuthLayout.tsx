import { useState } from 'react'
import type { HeroContent, Language } from '@/../product/sections/login/types'

interface AuthLayoutProps {
  heroContent: HeroContent
  languages: Language[]
  currentLanguage?: string
  onLanguageChange?: (code: string) => void
  children: React.ReactNode
}

export function AuthLayout({
  heroContent,
  languages,
  currentLanguage = 'en',
  onLanguageChange,
  children,
}: AuthLayoutProps) {
  const [langOpen, setLangOpen] = useState(false)
  const activeLang = languages.find((l) => l.code === currentLanguage) ?? languages[0]

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950">
      {/* Hero Panel */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[540px] flex-col justify-between relative overflow-hidden bg-indigo-600 dark:bg-indigo-700 p-10 text-white">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 540 900" fill="none">
            <circle cx="450" cy="100" r="200" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="800" r="300" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="270" cy="450" r="150" stroke="currentColor" strokeWidth="0.5" />
            {Array.from({ length: 8 }).map((_, i) => (
              <line
                key={i}
                x1={0}
                y1={i * 120}
                x2={540}
                y2={i * 120 + 60}
                stroke="currentColor"
                strokeWidth="0.3"
              />
            ))}
          </svg>
        </div>

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-16">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight">CircleUp</span>
          </div>

          {/* Headline */}
          <p className="text-indigo-200 text-sm font-medium uppercase tracking-widest mb-3">
            {heroContent.tagline}
          </p>
          <h1 className="text-3xl xl:text-4xl font-bold leading-tight mb-4">
            {heroContent.headline}
          </h1>
          <p className="text-indigo-100 text-base leading-relaxed mb-10 max-w-md">
            {heroContent.description}
          </p>

          {/* Stats */}
          <div className="flex gap-8 mb-10">
            {heroContent.stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-indigo-200 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 border-t border-white/15 pt-6">
          <blockquote className="text-sm leading-relaxed text-indigo-100 italic mb-4">
            &ldquo;{heroContent.testimonial.quote}&rdquo;
          </blockquote>
          <div className="flex items-center gap-3">
            <img
              src={heroContent.testimonial.avatar}
              alt={heroContent.testimonial.author}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-white/20"
            />
            <div>
              <p className="text-sm font-medium">{heroContent.testimonial.author}</p>
              <p className="text-xs text-indigo-200">{heroContent.testimonial.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Panel */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-h-0">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 lg:px-10 lg:py-6">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <span className="text-base font-semibold text-slate-900 dark:text-white">CircleUp</span>
          </div>
          <div className="hidden lg:block" />

          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span>{activeLang.flag}</span>
              <span>{activeLang.label}</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transition-transform ${langOpen ? 'rotate-180' : ''}`}>
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {langOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                <div className="absolute right-0 top-full mt-1 z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-1 min-w-[160px]">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange?.(lang.code)
                        setLangOpen(false)
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                        lang.code === currentLanguage
                          ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Form content */}
        <div className="flex-1 flex items-center justify-center px-6 pb-10 lg:px-10">
          <div className="w-full max-w-[420px]">{children}</div>
        </div>
      </div>
    </div>
  )
}
