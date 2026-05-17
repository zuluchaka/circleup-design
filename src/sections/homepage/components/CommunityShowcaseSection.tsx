import type { CulturalCommunity } from '@/../product/sections/homepage/types'

function formatNumber(num: number) {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  }
  return num.toString()
}

function CommunityCard({
  community,
  onClick,
}: {
  community: CulturalCommunity
  onClick?: () => void
}) {
  return (
    <div
      className="group relative bg-white dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50 hover:border-indigo-300 dark:hover:border-indigo-600/50 transition-all duration-300 hover:shadow-xl cursor-pointer"
      onClick={onClick}
    >
      {/* Image placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-indigo-500/20 to-amber-500/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />

        {/* Decorative pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='20' cy='20' r='3'/%3E%3C/g%3E%3C/svg%3E")`
          }}
        />

        {/* Community icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>

        {/* Member count badge */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/90 dark:bg-slate-900/90 rounded-full text-sm font-medium text-slate-900 dark:text-white">
            <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            {formatNumber(community.memberCount)} members
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
            {community.name}
          </h3>
          <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
            {community.localName}
          </p>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
          {community.description}
        </p>

        {/* Countries */}
        <div className="flex flex-wrap gap-1">
          {community.countries.slice(0, 3).map((country) => (
            <span
              key={country}
              className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 text-xs rounded-full"
            >
              {country}
            </span>
          ))}
          {community.countries.length > 3 && (
            <span className="px-2 py-0.5 text-slate-500 dark:text-slate-500 text-xs">
              +{community.countries.length - 3} more
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

interface CommunityShowcaseSectionProps {
  communities: CulturalCommunity[]
  onCommunityClick?: (communityId: string) => void
}

export function CommunityShowcaseSection({
  communities,
  onCommunityClick,
}: CommunityShowcaseSectionProps) {
  return (
    <section className="py-20 sm:py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-medium rounded-full mb-4">
            Global Communities
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Your Tradition, Digitized
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Savings circles go by many names around the world. Whatever you call it, CircleUp supports your community's tradition.
          </p>
        </div>

        {/* Communities grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {communities.map((community) => (
            <CommunityCard
              key={community.id}
              community={community}
              onClick={() => onCommunityClick?.(community.id)}
            />
          ))}
        </div>

        {/* Global reach callout */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
            <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-slate-700 dark:text-slate-300">
              <span className="font-semibold">40,000+</span> members across{' '}
              <span className="font-semibold">23 countries</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
