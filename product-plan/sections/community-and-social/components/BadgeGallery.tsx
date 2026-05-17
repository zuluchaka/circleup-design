import type { BadgeGalleryProps, Badge, UserBadge, BadgeProgress, BadgeTier, BadgeCategory } from '../types'

// Badge tier styling
const tierStyles: Record<BadgeTier, { gradient: string; border: string; shadow: string; text: string }> = {
  bronze: {
    gradient: 'from-amber-600 via-amber-500 to-amber-700',
    border: 'border-amber-400',
    shadow: 'shadow-amber-500/30',
    text: 'text-amber-700 dark:text-amber-400',
  },
  silver: {
    gradient: 'from-slate-400 via-slate-300 to-slate-500',
    border: 'border-slate-300',
    shadow: 'shadow-slate-400/30',
    text: 'text-slate-600 dark:text-slate-300',
  },
  gold: {
    gradient: 'from-yellow-500 via-amber-400 to-yellow-600',
    border: 'border-yellow-400',
    shadow: 'shadow-yellow-500/30',
    text: 'text-yellow-700 dark:text-yellow-400',
  },
  platinum: {
    gradient: 'from-indigo-500 via-purple-400 to-indigo-600',
    border: 'border-purple-400',
    shadow: 'shadow-purple-500/30',
    text: 'text-purple-700 dark:text-purple-400',
  },
}

const tierLabels: Record<BadgeTier, string> = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum',
}

const categoryLabels: Record<BadgeCategory, string> = {
  getting_started: 'Getting Started',
  consistency: 'Consistency',
  savings: 'Savings',
  completion: 'Completion',
  trust: 'Trust',
  referral: 'Referral',
  mentorship: 'Mentorship',
  goals: 'Goals',
  challenges: 'Challenges',
  community: 'Community',
}

// Icons for badges
const badgeIcons: Record<string, JSX.Element> = {
  footprints: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  'calendar-check': (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  'piggy-bank': (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  trophy: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  'shield-check': (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  'users-plus': (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
  ),
  flame: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    </svg>
  ),
  'graduation-cap': (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  ),
  target: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  sunrise: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  medal: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  'book-open': (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
}

const defaultIcon = (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
)

// Share icon
const shareIcon = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
)

// Lock icon
const lockIcon = (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
)

interface EarnedBadgeCardProps {
  userBadge: UserBadge
  badge?: Badge
  onShare?: () => void
  onView?: () => void
}

function EarnedBadgeCard({ userBadge, badge, onShare, onView }: EarnedBadgeCardProps) {
  const style = tierStyles[userBadge.badgeTier]
  const icon = badgeIcons[userBadge.badgeIcon] || defaultIcon

  return (
    <div
      className="relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-lg transition-all cursor-pointer group"
      onClick={onView}
    >
      {/* Badge circle */}
      <div className="flex justify-center mb-4">
        <div
          className={`w-20 h-20 rounded-full bg-gradient-to-br ${style.gradient} flex items-center justify-center text-white shadow-lg ${style.shadow} transform group-hover:scale-105 transition-transform`}
        >
          {icon}
        </div>
      </div>

      {/* Badge info */}
      <div className="text-center">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{userBadge.badgeName}</h3>
        <p className={`text-sm font-medium ${style.text}`}>{tierLabels[userBadge.badgeTier]}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Unlocked {new Date(userBadge.unlockedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Share button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onShare?.()
        }}
        className="absolute top-3 right-3 p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
      >
        {shareIcon}
      </button>

      {/* Shared indicator */}
      {userBadge.shared && (
        <div className="absolute top-3 left-3">
          <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
            Shared
          </span>
        </div>
      )}
    </div>
  )
}

interface LockedBadgeCardProps {
  badge: Badge
  progress?: BadgeProgress
  onView?: () => void
}

function LockedBadgeCard({ badge, progress, onView }: LockedBadgeCardProps) {
  const style = tierStyles[badge.tier]
  const icon = badgeIcons[badge.icon] || defaultIcon
  const hasProgress = progress && progress.progressPercent > 0

  return (
    <div
      className="relative bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 cursor-pointer group"
      onClick={onView}
    >
      {/* Badge circle (locked state) */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500">
            {icon}
          </div>
          {!hasProgress && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-200/80 dark:bg-slate-700/80 rounded-full">
              {lockIcon}
            </div>
          )}
          {hasProgress && (
            <svg className="absolute inset-0 w-20 h-20 -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-slate-300 dark:text-slate-600"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={`${(progress.progressPercent / 100) * 226.2} 226.2`}
                className={style.text}
              />
            </svg>
          )}
        </div>
      </div>

      {/* Badge info */}
      <div className="text-center">
        <h3 className="font-semibold text-slate-600 dark:text-slate-400 mb-1">{badge.name}</h3>
        <p className={`text-sm font-medium ${style.text} opacity-60`}>{tierLabels[badge.tier]}</p>
        <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">{badge.requirement}</p>

        {hasProgress && (
          <div className="mt-3">
            <div className="flex items-center justify-center gap-1 text-sm">
              <span className={style.text}>{progress.currentValue}</span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-500">{progress.targetValue}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{progress.progressPercent.toFixed(0)}% complete</p>
          </div>
        )}
      </div>
    </div>
  )
}

export function BadgeGallery({ badges, userBadges, badgeProgress, onShareBadge, onViewBadge }: BadgeGalleryProps) {
  // Create a map of earned badge IDs
  const earnedBadgeIds = new Set(userBadges.map((ub) => ub.badgeId))

  // Create a map of badge progress
  const progressMap = new Map(badgeProgress.map((bp) => [bp.badgeId, bp]))

  // Group badges by category
  const categories = [...new Set(badges.map((b) => b.category))]

  // Sort badges: earned first, then by tier (platinum > gold > silver > bronze)
  const tierOrder: Record<BadgeTier, number> = { platinum: 0, gold: 1, silver: 2, bronze: 3 }

  const sortedBadges = [...badges].sort((a, b) => {
    const aEarned = earnedBadgeIds.has(a.id)
    const bEarned = earnedBadgeIds.has(b.id)
    if (aEarned && !bEarned) return -1
    if (!aEarned && bEarned) return 1
    return tierOrder[a.tier] - tierOrder[b.tier]
  })

  // Get user badge for a badge ID
  const getUserBadge = (badgeId: string) => userBadges.find((ub) => ub.badgeId === badgeId)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Achievements</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Collect badges as you reach savings milestones and contribute to the community
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800/50">
        <div>
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{userBadges.length}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Badges Earned</p>
        </div>
        <div className="border-l border-amber-200 dark:border-amber-700 pl-6">
          <p className="text-3xl font-bold text-slate-600 dark:text-slate-400">{badges.length - userBadges.length}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">To Unlock</p>
        </div>
        <div className="border-l border-amber-200 dark:border-amber-700 pl-6">
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{badgeProgress.length}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">In Progress</p>
        </div>
      </div>

      {/* In Progress Section */}
      {badgeProgress.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">In Progress</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {badgeProgress.map((progress) => {
              const badge = badges.find((b) => b.id === progress.badgeId)
              if (!badge) return null
              return (
                <LockedBadgeCard
                  key={progress.badgeId}
                  badge={badge}
                  progress={progress}
                  onView={() => onViewBadge?.(progress.badgeId)}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Earned Badges */}
      {userBadges.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Your Collection</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {userBadges
              .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
              .map((userBadge) => {
                const badge = badges.find((b) => b.id === userBadge.badgeId)
                return (
                  <EarnedBadgeCard
                    key={userBadge.id}
                    userBadge={userBadge}
                    badge={badge}
                    onShare={() => onShareBadge?.(userBadge.badgeId)}
                    onView={() => onViewBadge?.(userBadge.badgeId)}
                  />
                )
              })}
          </div>
        </div>
      )}

      {/* All Badges by Category */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">All Badges</h2>
        <div className="space-y-8">
          {categories.map((category) => {
            const categoryBadges = sortedBadges.filter((b) => b.category === category)
            if (categoryBadges.length === 0) return null

            return (
              <div key={category}>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  {categoryLabels[category]}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {categoryBadges.map((badge) => {
                    const userBadge = getUserBadge(badge.id)
                    const progress = progressMap.get(badge.id)

                    if (userBadge) {
                      return (
                        <EarnedBadgeCard
                          key={badge.id}
                          userBadge={userBadge}
                          badge={badge}
                          onShare={() => onShareBadge?.(badge.id)}
                          onView={() => onViewBadge?.(badge.id)}
                        />
                      )
                    }

                    return (
                      <LockedBadgeCard
                        key={badge.id}
                        badge={badge}
                        progress={progress}
                        onView={() => onViewBadge?.(badge.id)}
                      />
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
