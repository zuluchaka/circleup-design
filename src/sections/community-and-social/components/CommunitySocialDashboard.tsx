import type {
  ReferralStats,
  UserBadge,
  BadgeProgress,
  LeaderboardEntry,
  ChallengeEnrollment,
  SavingsChallenge,
  CommunityImpact,
  SocialProofNotification,
  SuccessStory,
  CommunityEvent,
  EventRsvp,
  Milestone,
  AccountabilityPartner,
  MentorMatch,
} from '@/../product/sections/community-and-social/types'

// Icons
const Icons = {
  users: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  ),
  trophy: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  flame: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    </svg>
  ),
  chart: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  gift: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
    </svg>
  ),
  calendar: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  share: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  ),
  heart: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  arrowRight: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  arrowUp: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
  ),
  arrowDown: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  ),
  sparkles: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  link: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  ),
  copy: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  trendingUp: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  book: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  handshake: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
    </svg>
  ),
}

interface CommunitySocialDashboardProps {
  // Referrals
  referralStats: ReferralStats

  // Badges
  userBadges: UserBadge[]
  badgeProgress: BadgeProgress[]

  // Leaderboards
  leaderboardEntries: LeaderboardEntry[]
  currentUserId: string

  // Challenges
  savingsChallenges: SavingsChallenge[]
  challengeEnrollments: ChallengeEnrollment[]

  // Milestones
  milestones: Milestone[]

  // Mentorship
  mentorMatches: MentorMatch[]

  // Accountability
  accountabilityPartners: AccountabilityPartner[]

  // Impact
  communityImpact: CommunityImpact
  socialProofNotifications: SocialProofNotification[]

  // Stories
  successStories: SuccessStory[]

  // Events
  communityEvents: CommunityEvent[]
  eventRsvps: EventRsvp[]

  // Callbacks
  onShareReferralLink?: (channel: 'sms' | 'whatsapp' | 'email' | 'social') => void
  onCopyReferralLink?: () => void
  onViewBadges?: () => void
  onViewLeaderboard?: () => void
  onViewChallenges?: () => void
  onEnrollChallenge?: (challengeId: string) => void
  onViewStories?: () => void
  onViewEvents?: () => void
  onRsvpEvent?: (eventId: string) => void
  onViewMentorship?: () => void
  onViewPartners?: () => void
  onDismissNotification?: (notificationId: string) => void
}

// Badge tier colors
const tierColors = {
  bronze: 'from-amber-600 to-amber-700',
  silver: 'from-slate-400 to-slate-500',
  gold: 'from-yellow-500 to-amber-500',
  platinum: 'from-indigo-400 to-purple-500',
}

const tierBgColors = {
  bronze: 'bg-amber-100 dark:bg-amber-900/30',
  silver: 'bg-slate-100 dark:bg-slate-800/50',
  gold: 'bg-yellow-100 dark:bg-yellow-900/30',
  platinum: 'bg-indigo-100 dark:bg-indigo-900/30',
}

export function CommunitySocialDashboard({
  referralStats,
  userBadges,
  badgeProgress,
  leaderboardEntries,
  currentUserId,
  savingsChallenges,
  challengeEnrollments,
  milestones,
  mentorMatches,
  accountabilityPartners,
  communityImpact,
  socialProofNotifications,
  successStories,
  communityEvents,
  eventRsvps,
  onShareReferralLink,
  onCopyReferralLink,
  onViewBadges,
  onViewLeaderboard,
  onViewChallenges,
  onEnrollChallenge,
  onViewStories,
  onViewEvents,
  onRsvpEvent,
  onViewMentorship,
  onViewPartners,
  onDismissNotification,
}: CommunitySocialDashboardProps) {
  // Get user's leaderboard position
  const userLeaderboardEntry = leaderboardEntries.find(
    (e) => e.userId === currentUserId && e.category === 'total_saved'
  )

  // Get active challenges
  const activeChallenges = savingsChallenges.filter((c) => c.status === 'active')
  const enrolledChallengeIds = new Set(challengeEnrollments.map((e) => e.challengeId))

  // Get upcoming events
  const upcomingEvents = communityEvents
    .filter((e) => e.status === 'open' || e.status === 'full')
    .slice(0, 2)

  // Get featured stories
  const featuredStories = successStories.filter((s) => s.featured && s.status === 'approved').slice(0, 2)

  // Get active mentor matches
  const activeMentorships = mentorMatches.filter((m) => m.status === 'active')

  // Get active partners
  const activePartners = accountabilityPartners.filter((p) => p.status === 'active')

  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
    return num.toString()
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Format currency compactly for large amounts
  const formatCurrencyCompact = (amount: number) => {
    if (amount >= 1000000) return `CHF ${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `CHF ${(amount / 1000).toFixed(0)}K`
    return formatCurrency(amount)
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header with Community Impact */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-2xl p-6 text-white relative overflow-hidden">
        <h1 className="text-2xl font-bold mb-1">Community & Social</h1>
        <p className="text-indigo-200 text-sm mb-6">
          Together we're stronger. Celebrate achievements, connect with others, and grow together.
        </p>

        {/* Impact stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{formatCurrencyCompact(communityImpact.platform.totalSaved)}</p>
            <p className="text-indigo-200 text-sm">Total Saved</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{formatNumber(communityImpact.platform.totalMembersSaving)}</p>
            <p className="text-indigo-200 text-sm">Members Saving</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{formatNumber(communityImpact.platform.totalCirclesCompleted)}</p>
            <p className="text-indigo-200 text-sm">Circles Completed</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{communityImpact.platform.countriesServed}</p>
            <p className="text-indigo-200 text-sm">Countries</p>
          </div>
        </div>
      </div>

      {/* Social Proof Notifications */}
      {socialProofNotifications.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          {socialProofNotifications.slice(0, 3).map((notification) => (
            <div
              key={notification.id}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-full text-sm"
            >
              <span className="text-amber-600 dark:text-amber-400">{Icons.trendingUp}</span>
              <span className="text-slate-700 dark:text-slate-300 whitespace-nowrap">{notification.message}</span>
              <button
                onClick={() => onDismissNotification?.(notification.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Referral Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                {Icons.gift}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Referral Program</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Invite friends, earn rewards</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{referralStats.totalActive}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Active</p>
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{referralStats.totalJoined}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Joined</p>
            </div>
            <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {formatCurrency(referralStats.totalEarnings)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Earned</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onShareReferralLink?.('whatsapp')}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {Icons.share}
              Share Link
            </button>
            <button
              onClick={onCopyReferralLink}
              className="p-2 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              {Icons.copy}
            </button>
          </div>
        </div>

        {/* Badges Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
                {Icons.trophy}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Achievements</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{userBadges.length} badges earned</p>
              </div>
            </div>
            <button
              onClick={onViewBadges}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
            >
              {Icons.arrowRight}
            </button>
          </div>

          {/* Recent badges */}
          <div className="flex gap-2 mb-4">
            {userBadges.slice(0, 4).map((badge) => (
              <div
                key={badge.id}
                className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br ${tierColors[badge.badgeTier]} text-white shadow-lg`}
                title={badge.badgeName}
              >
                <span className="text-lg">{Icons.trophy}</span>
              </div>
            ))}
            {userBadges.length > 4 && (
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-sm font-medium">
                +{userBadges.length - 4}
              </div>
            )}
          </div>

          {/* Next badge progress */}
          {badgeProgress[0] && (
            <div className={`p-3 rounded-lg ${tierBgColors[badgeProgress[0].badgeTier]}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {badgeProgress[0].badgeName}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {badgeProgress[0].progressPercent.toFixed(0)}%
                </span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${tierColors[badgeProgress[0].badgeTier]} transition-all duration-500`}
                  style={{ width: `${badgeProgress[0].progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Leaderboard Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                {Icons.chart}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Leaderboard</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {userLeaderboardEntry ? `Rank #${userLeaderboardEntry.rank}` : 'Top savers'}
                </p>
              </div>
            </div>
            <button
              onClick={onViewLeaderboard}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
            >
              {Icons.arrowRight}
            </button>
          </div>

          {/* Top 3 */}
          <div className="space-y-2">
            {leaderboardEntries
              .filter((e) => e.category === 'total_saved')
              .slice(0, 3)
              .map((entry, index) => (
                <div
                  key={entry.id}
                  className={`flex items-center gap-3 p-2 rounded-lg ${
                    entry.userId === currentUserId
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800'
                      : 'bg-slate-50 dark:bg-slate-700/50'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0
                        ? 'bg-yellow-400 text-yellow-900'
                        : index === 1
                          ? 'bg-slate-300 text-slate-700'
                          : 'bg-amber-600 text-white'
                    }`}
                  >
                    {entry.rank}
                  </div>
                  <img src={entry.userAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{entry.userName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{entry.displayValue}</p>
                  </div>
                  {entry.rank < entry.previousRank && (
                    <span className="text-green-500">{Icons.arrowUp}</span>
                  )}
                  {entry.rank > entry.previousRank && (
                    <span className="text-red-500">{Icons.arrowDown}</span>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Challenges Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                {Icons.flame}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Challenges</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{activeChallenges.length} active</p>
              </div>
            </div>
            <button
              onClick={onViewChallenges}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
            >
              {Icons.arrowRight}
            </button>
          </div>

          <div className="space-y-3">
            {activeChallenges.slice(0, 2).map((challenge) => {
              const enrollment = challengeEnrollments.find((e) => e.challengeId === challenge.id)
              const isEnrolled = enrolledChallengeIds.has(challenge.id)

              return (
                <div key={challenge.id} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{challenge.name}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        challenge.difficulty === 'hard'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : challenge.difficulty === 'medium'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}
                    >
                      {challenge.difficulty}
                    </span>
                  </div>
                  {isEnrolled && enrollment ? (
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                        <span>Progress</span>
                        <span>{enrollment.progressPercent.toFixed(0)}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
                          style={{ width: `${enrollment.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => onEnrollChallenge?.(challenge.id)}
                      className="w-full text-center text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                    >
                      Join Challenge
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Events Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                {Icons.calendar}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Events</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{upcomingEvents.length} upcoming</p>
              </div>
            </div>
            <button
              onClick={onViewEvents}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
            >
              {Icons.arrowRight}
            </button>
          </div>

          <div className="space-y-3">
            {upcomingEvents.map((event) => {
              const rsvp = eventRsvps.find((r) => r.eventId === event.id)
              const eventDate = new Date(event.date)

              return (
                <div key={event.id} className="flex gap-3">
                  <div className="w-14 h-14 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                      {eventDate.toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-lg font-bold text-indigo-700 dark:text-indigo-300">
                      {eventDate.getDate()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{event.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{event.format === 'virtual' ? 'Online' : event.location.split(',')[0]}</p>
                    {rsvp ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 mt-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Registered
                      </span>
                    ) : event.status === 'full' ? (
                      <span className="text-xs text-red-500 mt-1">Full</span>
                    ) : (
                      <button
                        onClick={() => onRsvpEvent?.(event.id)}
                        className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline mt-1"
                      >
                        RSVP Now
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Success Stories Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg text-rose-600 dark:text-rose-400">
                {Icons.book}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Success Stories</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Real member journeys</p>
              </div>
            </div>
            <button
              onClick={onViewStories}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
            >
              {Icons.arrowRight}
            </button>
          </div>

          {featuredStories.length > 0 && (
            <div className="space-y-3">
              {featuredStories.map((story) => (
                <div key={story.id} className="flex gap-3">
                  <img src={story.authorAvatar} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-1">{story.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{story.authorName}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        {Icons.heart}
                        {story.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        {Icons.share}
                        {story.shares}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mentorship & Accountability Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Mentorship */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg text-cyan-600 dark:text-cyan-400">
                {Icons.users}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Mentorship</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {activeMentorships.length} active {activeMentorships.length === 1 ? 'connection' : 'connections'}
                </p>
              </div>
            </div>
            <button
              onClick={onViewMentorship}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
            >
              {Icons.arrowRight}
            </button>
          </div>

          {activeMentorships.length > 0 ? (
            <div className="space-y-3">
              {activeMentorships.slice(0, 2).map((match) => {
                const isMentor = match.mentorId === currentUserId
                const otherPerson = isMentor
                  ? { name: match.menteeName, avatar: match.menteeAvatar, role: 'Mentee' }
                  : { name: match.mentorName, avatar: match.mentorAvatar, role: 'Mentor' }

                return (
                  <div key={match.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <img src={otherPerson.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{otherPerson.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Your {otherPerson.role}</p>
                    </div>
                    <span className="text-xs text-slate-400">{match.messagesCount} messages</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Connect with experienced savers or help newcomers</p>
              <button
                onClick={onViewMentorship}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Explore Mentorship
              </button>
            </div>
          )}
        </div>

        {/* Accountability Partners */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg text-violet-600 dark:text-violet-400">
                {Icons.handshake}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Accountability Partners</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {activePartners.length} active {activePartners.length === 1 ? 'partner' : 'partners'}
                </p>
              </div>
            </div>
            <button
              onClick={onViewPartners}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
            >
              {Icons.arrowRight}
            </button>
          </div>

          {activePartners.length > 0 ? (
            <div className="space-y-3">
              {activePartners.slice(0, 2).map((partner) => (
                <div key={partner.id} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={partner.partnerAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{partner.partnerName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{partner.sharedGoal}</p>
                    </div>
                  </div>
                  {partner.myProgress && partner.partnerProgress && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-500 dark:text-slate-400">You</span>
                          <span className="text-slate-700 dark:text-slate-300">{partner.myProgress.progressPercent.toFixed(0)}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 transition-all duration-500"
                            style={{ width: `${partner.myProgress.progressPercent}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-500 dark:text-slate-400">Partner</span>
                          <span className="text-slate-700 dark:text-slate-300">{partner.partnerProgress.progressPercent.toFixed(0)}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-violet-500 transition-all duration-500"
                            style={{ width: `${partner.partnerProgress.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Find a partner to stay motivated together</p>
              <button
                onClick={onViewPartners}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Find a Partner
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recent Milestones */}
      {milestones.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800/50 p-5">
          <div className="flex items-center gap-2 mb-4">
            {Icons.sparkles}
            <h3 className="font-semibold text-slate-900 dark:text-white">Your Milestones</h3>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2">
            {milestones.slice(0, 5).map((milestone) => (
              <div
                key={milestone.id}
                className="flex-shrink-0 w-48 bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-3">
                  {Icons.trophy}
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">{milestone.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{milestone.displayValue}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                  {new Date(milestone.achievedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
