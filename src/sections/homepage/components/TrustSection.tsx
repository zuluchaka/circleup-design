import type { TrustBadge, Partner } from '@/../product/sections/homepage/types'

const iconMap: Record<string, React.ReactNode> = {
  'shield-lock': (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  'badge-check': (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  'credit-card': (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  'shield-check': (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  'user-check': (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11l2 2 4-4" />
    </svg>
  ),
  key: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
  ),
}

function TrustBadgeCard({ badge }: { badge: TrustBadge }) {
  return (
    <div className="group bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 hover:border-indigo-300 dark:hover:border-indigo-600/50 transition-all duration-300 hover:shadow-lg text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
        {iconMap[badge.icon] || iconMap['shield-check']}
      </div>
      <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
        {badge.name}
      </h4>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        {badge.description}
      </p>
    </div>
  )
}

function PartnerLogo({ partner, onClick }: { partner: Partner; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50 hover:border-indigo-300 dark:hover:border-indigo-600/50 transition-all duration-200 cursor-pointer"
    >
      {/* Placeholder logo */}
      <div className="h-8 flex items-center justify-center text-slate-400 dark:text-slate-500 font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        {partner.name}
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
        {partner.description}
      </p>
    </div>
  )
}

interface TrustSectionProps {
  trustBadges: TrustBadge[]
  partners: Partner[]
  onPartnerClick?: (partnerId: string) => void
}

export function TrustSection({ trustBadges, partners, onPartnerClick }: TrustSectionProps) {
  return (
    <section className="py-20 sm:py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium rounded-full mb-4">
            Trust & Security
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Your Money, Your Safety
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            We take security seriously. Bank-level encryption, regulatory compliance, and trusted partners protect every transaction.
          </p>
        </div>

        {/* Trust badges grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {trustBadges.map((badge) => (
            <TrustBadgeCard key={badge.id} badge={badge} />
          ))}
        </div>

        {/* Partners section */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-12">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 text-center">
            Trusted Partners & Integrations
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {partners.map((partner) => (
              <PartnerLogo
                key={partner.id}
                partner={partner}
                onClick={() => onPartnerClick?.(partner.id)}
              />
            ))}
          </div>
        </div>

        {/* Compliance callout */}
        <div className="mt-12 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/50 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Swiss Compliant, Globally Trusted
              </h4>
              <p className="text-slate-600 dark:text-slate-400">
                CircleUp operates under Swiss FINMA regulations and is fully compliant with FADP and GDPR data protection requirements. Your data is stored securely in Swiss data centers.
              </p>
            </div>
            <div className="flex-shrink-0">
              <a
                href="#compliance"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
              >
                Learn More
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
