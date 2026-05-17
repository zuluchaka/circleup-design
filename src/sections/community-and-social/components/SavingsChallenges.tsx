import type {
  SavingsChallenge,
  ChallengeEnrollment,
  ChallengeDifficulty,
  ChallengeStatus,
  SavingsChallengesProps,
} from '@/../product/sections/community-and-social/types'

// =============================================================================
// Icons
// =============================================================================

function FlameIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  )
}

function ArrowUpCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="m16 12-4-4-4 4M12 16V8" />
    </svg>
  )
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function TargetIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}

function MedalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15" />
      <path d="M11 12 5.12 2.2" />
      <path d="m13 12 5.88-9.8" />
      <path d="M8 7h8" />
      <circle cx="12" cy="17" r="5" />
      <path d="M12 18v-2h-.5" />
    </svg>
  )
}

function GiftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  )
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  )
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4M19 17v4M3 5h4M17 19h4" />
    </svg>
  )
}

// =============================================================================
// Helper Functions
// =============================================================================

const challengeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  flame: FlameIcon,
  'arrow-up-circle': ArrowUpCircleIcon,
  users: UsersIcon,
  shield: ShieldIcon,
  target: TargetIcon,
}

function getChallengeIcon(icon: string): React.ComponentType<{ className?: string }> {
  return challengeIcons[icon] || TargetIcon
}

const difficultyConfig: Record<ChallengeDifficulty, { label: string; color: string; bgColor: string }> = {
  easy: {
    label: 'Easy',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
  medium: {
    label: 'Medium',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
  },
  hard: {
    label: 'Hard',
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-100 dark:bg-rose-900/30',
  },
}

const statusConfig: Record<ChallengeStatus, { label: string; color: string; bgColor: string }> = {
  upcoming: {
    label: 'Upcoming',
    color: 'text-slate-600 dark:text-slate-400',
    bgColor: 'bg-slate-100 dark:bg-slate-800',
  },
  active: {
    label: 'Active',
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
  },
  completed: {
    label: 'Completed',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function getDaysRemaining(endDate: string): number {
  const now = new Date()
  const end = new Date(endDate)
  const diff = end.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

// =============================================================================
// Subcomponents
// =============================================================================

interface ActiveChallengeCardProps {
  enrollment: ChallengeEnrollment
  onViewChallenge?: (id: string) => void
  onViewLeaderboard?: (id: string) => void
}

function ActiveChallengeCard({ enrollment, onViewChallenge, onViewLeaderboard }: ActiveChallengeCardProps) {
  const Icon = getChallengeIcon(enrollment.challengeIcon)
  const isComplete = enrollment.status === 'completed'

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border-2 transition-all ${
        isComplete
          ? 'border-emerald-200 dark:border-emerald-700'
          : 'border-indigo-200 dark:border-indigo-700'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            isComplete
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
          }`}
        >
          <Icon className="w-6 h-6" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-800 dark:text-white truncate">{enrollment.challengeName}</h3>
            {isComplete && <CheckCircleIcon className="w-5 h-5 text-emerald-500 shrink-0" />}
          </div>

          {/* Progress */}
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">
                {enrollment.currentValue} / {enrollment.targetValue}
              </span>
              <span
                className={`font-semibold ${
                  isComplete ? 'text-emerald-600 dark:text-emerald-400' : 'text-indigo-600 dark:text-indigo-400'
                }`}
              >
                {enrollment.progressPercent.toFixed(0)}%
              </span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  isComplete
                    ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                    : 'bg-gradient-to-r from-indigo-400 to-indigo-500'
                }`}
                style={{ width: `${Math.min(100, enrollment.progressPercent)}%` }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <TrophyIcon className="w-3.5 h-3.5" />
              <span>Rank #{enrollment.rank}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onViewLeaderboard?.(enrollment.challengeId)}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Leaderboard
              </button>
              <button
                onClick={() => onViewChallenge?.(enrollment.challengeId)}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ChallengeCardProps {
  challenge: SavingsChallenge
  isEnrolled: boolean
  onEnroll?: (id: string) => void
  onViewChallenge?: (id: string) => void
}

function ChallengeCard({ challenge, isEnrolled, onEnroll, onViewChallenge }: ChallengeCardProps) {
  const Icon = getChallengeIcon(challenge.icon)
  const difficulty = difficultyConfig[challenge.difficulty]
  const status = statusConfig[challenge.status]
  const daysRemaining = getDaysRemaining(challenge.endDate)

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white shrink-0">
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.bgColor} ${status.color}`}>
                {status.label}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${difficulty.bgColor} ${difficulty.color}`}>
                {difficulty.label}
              </span>
            </div>
            <h3 className="font-semibold text-slate-800 dark:text-white">{challenge.name}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
              {challenge.shortDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 sm:p-5 space-y-4">
        {/* Target & Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <TargetIcon className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {challenge.targetValue} {challenge.targetUnit}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}
            </span>
          </div>
        </div>

        {/* Participants & Time */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <UsersIcon className="w-4 h-4" />
            <span>{challenge.participantCount} participants</span>
          </div>
          {challenge.status === 'active' && (
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <ClockIcon className="w-4 h-4" />
              <span>{daysRemaining} days left</span>
            </div>
          )}
        </div>

        {/* Reward */}
        <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
          <GiftIcon className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <div>
            <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">Reward</p>
            <p className="text-sm text-amber-800 dark:text-amber-200">
              {challenge.reward.type === 'badge' && 'Special Badge'}
              {challenge.reward.type === 'bonus' && `CHF ${challenge.reward.bonusAmount} Bonus`}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isEnrolled ? (
            <button
              onClick={() => onViewChallenge?.(challenge.id)}
              className="flex-1 py-2.5 px-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              View Progress
            </button>
          ) : challenge.status === 'active' ? (
            <button
              onClick={() => onEnroll?.(challenge.id)}
              className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm transition-colors"
            >
              Join Challenge
            </button>
          ) : challenge.status === 'upcoming' ? (
            <button className="flex-1 py-2.5 px-4 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-xl font-medium text-sm cursor-not-allowed">
              Starts {formatDate(challenge.startDate)}
            </button>
          ) : (
            <button className="flex-1 py-2.5 px-4 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-xl font-medium text-sm cursor-not-allowed">
              Challenge Ended
            </button>
          )}
          <button
            onClick={() => onViewChallenge?.(challenge.id)}
            className="py-2.5 px-4 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  color: string
}

function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function SavingsChallenges({
  challenges,
  enrollments,
  onEnroll,
  onViewChallenge,
  onViewLeaderboard,
}: SavingsChallengesProps) {
  // Get enrolled challenge IDs
  const enrolledIds = new Set(enrollments.map((e) => e.challengeId))

  // Separate active enrollments from completed
  const activeEnrollments = enrollments.filter((e) => e.status === 'in_progress')
  const completedEnrollments = enrollments.filter((e) => e.status === 'completed')

  // Filter available challenges (not enrolled)
  const availableChallenges = challenges.filter((c) => !enrolledIds.has(c.id))

  // Calculate stats
  const completedCount = completedEnrollments.length
  const activeCount = activeEnrollments.length
  const totalParticipations = enrollments.length

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white mb-4 shadow-lg shadow-amber-200 dark:shadow-amber-900/30">
            <SparklesIcon className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">Savings Challenges</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Push your limits and earn rewards
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <StatCard
            icon={MedalIcon}
            label="Completed"
            value={completedCount.toString()}
            color="bg-emerald-500"
          />
          <StatCard
            icon={FlameIcon}
            label="In Progress"
            value={activeCount.toString()}
            color="bg-amber-500"
          />
          <StatCard
            icon={ChartIcon}
            label="All Time"
            value={totalParticipations.toString()}
            color="bg-indigo-500"
          />
        </div>

        {/* Active Challenges */}
        {activeEnrollments.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <FlameIcon className="w-5 h-5 text-amber-500" />
              Your Active Challenges
            </h2>
            <div className="space-y-3">
              {activeEnrollments.map((enrollment) => (
                <ActiveChallengeCard
                  key={enrollment.id}
                  enrollment={enrollment}
                  onViewChallenge={onViewChallenge}
                  onViewLeaderboard={onViewLeaderboard}
                />
              ))}
            </div>
          </div>
        )}

        {/* Completed Challenges */}
        {completedEnrollments.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
              Completed Challenges
            </h2>
            <div className="space-y-3">
              {completedEnrollments.map((enrollment) => (
                <ActiveChallengeCard
                  key={enrollment.id}
                  enrollment={enrollment}
                  onViewChallenge={onViewChallenge}
                  onViewLeaderboard={onViewLeaderboard}
                />
              ))}
            </div>
          </div>
        )}

        {/* Available Challenges */}
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <TargetIcon className="w-5 h-5 text-indigo-500" />
            Available Challenges
          </h2>
          {availableChallenges.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {availableChallenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  isEnrolled={enrolledIds.has(challenge.id)}
                  onEnroll={onEnroll}
                  onViewChallenge={onViewChallenge}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <MedalIcon className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
              <p className="text-slate-600 dark:text-slate-400">You've joined all available challenges!</p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                Check back later for new ones
              </p>
            </div>
          )}
        </div>

        {/* All Challenges Section */}
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <TrophyIcon className="w-5 h-5 text-amber-500" />
            All Challenges
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {challenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                isEnrolled={enrolledIds.has(challenge.id)}
                onEnroll={onEnroll}
                onViewChallenge={onViewChallenge}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SavingsChallenges
