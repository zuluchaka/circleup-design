import type { HowItWorksStep } from '../types'

const iconMap: Record<string, React.ReactNode> = {
  'plus-circle': (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  users: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  banknote: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  'refresh-cw': (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
}

function StepCard({ step, isLast }: { step: HowItWorksStep; isLast: boolean }) {
  return (
    <div className="relative flex-1 group">
      {/* Connector line (hidden on last item and mobile) */}
      {!isLast && (
        <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-indigo-300 to-transparent dark:from-indigo-700 -translate-y-1/2 z-0" />
      )}

      {/* Step content */}
      <div className="relative z-10 text-center lg:text-left">
        {/* Step number and icon */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 mb-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
              {iconMap[step.icon] || iconMap['plus-circle']}
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-400 text-slate-900 font-bold text-sm flex items-center justify-center shadow-lg">
              {step.step}
            </div>
          </div>
        </div>

        {/* Title and description */}
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          {step.title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs mx-auto lg:mx-0">
          {step.description}
        </p>
      </div>
    </div>
  )
}

interface HowItWorksSectionProps {
  steps: HowItWorksStep[]
  onCtaClick?: () => void
}

export function HowItWorksSection({ steps, onCtaClick }: HowItWorksSectionProps) {
  return (
    <section className="py-20 sm:py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-sm font-medium rounded-full mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            How Savings Circles Work
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A time-tested way to save together. Pool your money, take turns receiving the pot, and achieve your goals faster.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 mb-12">
          {steps.map((step, index) => (
            <StepCard key={step.step} step={step} isLast={index === steps.length - 1} />
          ))}
        </div>

        {/* Example visualization */}
        <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700/50 max-w-3xl mx-auto">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 text-center">
            Example: 6-Month Family Circle
          </h4>
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5, 6].map((member) => (
              <div key={member} className="flex flex-col items-center gap-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${member === 3 ? 'bg-amber-500 ring-4 ring-amber-200 dark:ring-amber-900' : 'bg-indigo-500'}`}>
                  {member}
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {member === 3 ? 'Your turn!' : `Month ${member}`}
                </span>
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-slate-600 dark:text-slate-400">
            <p>Each member contributes <span className="font-semibold text-slate-900 dark:text-white">CHF 200/month</span></p>
            <p>Each month, one member receives <span className="font-semibold text-amber-600 dark:text-amber-400">CHF 1,200</span></p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button
            onClick={onCtaClick}
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
          >
            Start Your Circle
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
