import type { HeroSectionProps, TrustBadge } from '../types'

const iconMap: Record<string, React.ReactNode> = {
  'shield-lock': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  'badge-check': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  'credit-card': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
}

function TrustBadgeItem({ badge }: { badge: TrustBadge }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm border border-white/10 hover:bg-white/15 transition-colors">
      <span className="text-amber-400">
        {iconMap[badge.icon] || iconMap['badge-check']}
      </span>
      <span className="font-medium">{badge.name}</span>
    </div>
  )
}

// Hero illustration component - abstract savings circle visualization
function HeroIllustration() {
  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center">
      {/* Central circle */}
      <div className="relative">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 w-72 h-72 lg:w-80 lg:h-80 rounded-full border-2 border-dashed border-indigo-400/30 animate-spin-slow" />

        {/* Middle ring with gradient */}
        <div className="absolute inset-4 w-64 h-64 lg:w-72 lg:h-72 rounded-full bg-gradient-to-br from-indigo-500/20 to-amber-500/20 backdrop-blur-sm border border-white/10" />

        {/* Inner solid circle */}
        <div className="relative w-72 h-72 lg:w-80 lg:h-80 flex items-center justify-center">
          <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-800 shadow-2xl shadow-indigo-500/30 flex items-center justify-center border border-indigo-400/20">
            {/* Center content */}
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-white mb-1">CHF</div>
              <div className="text-2xl lg:text-3xl font-bold text-amber-400">28.5M</div>
              <div className="text-indigo-200 text-sm mt-1">Total Saved</div>
            </div>
          </div>
        </div>

        {/* Floating member avatars around the circle */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-4 border-indigo-900 flex items-center justify-center text-white font-bold shadow-lg animate-float-1">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>

        <div className="absolute top-1/4 -right-4 w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-4 border-indigo-900 flex items-center justify-center text-white font-bold shadow-lg animate-float-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <div className="absolute bottom-1/4 -right-2 w-11 h-11 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 border-4 border-indigo-900 flex items-center justify-center text-white font-bold shadow-lg animate-float-3">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>

        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 border-4 border-indigo-900 flex items-center justify-center text-white font-bold shadow-lg animate-float-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>

        <div className="absolute top-1/4 -left-4 w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 border-4 border-indigo-900 flex items-center justify-center text-white font-bold shadow-lg animate-float-5">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>

        <div className="absolute bottom-1/4 -left-2 w-11 h-11 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-4 border-indigo-900 flex items-center justify-center text-white font-bold shadow-lg animate-float-6">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export function HeroSection({
  content,
  trustBadges,
  onPrimaryClick,
  onSecondaryClick,
}: HeroSectionProps) {
  const displayBadges = trustBadges.filter(b => content.trustBadgeIds.includes(b.id))

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background gradient - richer colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900" />

      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl animate-pulse-slow animation-delay-200" />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl animate-pulse-slow animation-delay-100" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left side - Text content */}
          <div className="text-center lg:text-left">
            {/* Trust badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-8 animate-fade-in">
              {displayBadges.map(badge => (
                <TrustBadgeItem key={badge.id} badge={badge} />
              ))}
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white tracking-tight mb-6 animate-fade-in-up">
              <span className="block">{content.headline.split(',')[0]},</span>
              <span className="block bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">
                {content.headline.split(',')[1] || 'Grow Together'}
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0 animate-fade-in-up animation-delay-100">
              {content.subHeadline}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 animate-fade-in-up animation-delay-200">
              <button
                onClick={onPrimaryClick}
                className="group px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/25 hover:shadow-amber-400/40 hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                {content.primaryCta.text}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <button
                onClick={onSecondaryClick}
                className="group px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl backdrop-blur-sm transition-all duration-300 border border-white/20 hover:border-white/30 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                {content.secondaryCta.text}
              </button>
            </div>

            {/* Social proof */}
            <div className="mt-10 flex flex-wrap justify-center lg:justify-start items-center gap-6 animate-fade-in-up animation-delay-200">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 border-2 border-indigo-900 flex items-center justify-center text-white text-xs font-bold"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-sm text-slate-300">
                <span className="font-semibold text-white">45,000+</span> members saving together
              </div>
            </div>
          </div>

          {/* Right side - Illustration */}
          <div className="hidden lg:block animate-fade-in animation-delay-100">
            <HeroIllustration />
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-24 text-white dark:text-slate-950" viewBox="0 0 1440 96" fill="currentColor" preserveAspectRatio="none">
          <path d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,80C1120,85,1280,75,1360,69.3L1440,64L1440,96L1360,96C1280,96,1120,96,960,96C800,96,640,96,480,96C320,96,160,96,80,96L0,96Z" />
        </svg>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, -8px); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes float-4 {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, -10px); }
        }
        @keyframes float-5 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes float-6 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .animate-spin-slow { animation: spin-slow 30s linear infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-float-1 { animation: float-1 3s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 3.5s ease-in-out infinite 0.2s; }
        .animate-float-3 { animation: float-3 4s ease-in-out infinite 0.4s; }
        .animate-float-4 { animation: float-4 3.2s ease-in-out infinite 0.6s; }
        .animate-float-5 { animation: float-5 3.8s ease-in-out infinite 0.3s; }
        .animate-float-6 { animation: float-6 3.3s ease-in-out infinite 0.5s; }
        .animation-delay-100 { animation-delay: 0.1s; }
        .animation-delay-200 { animation-delay: 0.2s; }
      `}</style>
    </section>
  )
}
