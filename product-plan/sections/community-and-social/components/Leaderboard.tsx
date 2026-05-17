import type {
  LeaderboardEntry,
  LeaderboardSettings,
  LeaderboardCategory,
  LeaderboardScope,
  LeaderboardPeriod,
  LeaderboardProps,
} from '../../../../product/sections/community-and-social/types'

// =============================================================================
// Icons
// =============================================================================

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

function ArrowUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  )
}

function ArrowDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12l7 7 7-7" />
    </svg>
  )
}

function MinusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" />
    </svg>
  )
}

function PiggyBankIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2h0V5z" />
      <path d="M2 9v1c0 1.1.9 2 2 2h1" />
      <path d="M16 11h0" />
    </svg>
  )
}

function FlameIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
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

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
    </svg>
  )
}

function CircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
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

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  )
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

// =============================================================================
// Helper Functions
// =============================================================================

const categoryConfig: Record<
  LeaderboardCategory,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  total_saved: { label: 'Total Saved', icon: PiggyBankIcon, color: 'indigo' },
  streak_length: { label: 'Payment Streak', icon: FlameIcon, color: 'amber' },
  on_time_percentage: { label: 'On-Time %', icon: ClockIcon, color: 'emerald' },
  referrals: { label: 'Referrals', icon: UsersIcon, color: 'violet' },
}

const scopeConfig: Record<LeaderboardScope, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  platform: { label: 'Platform', icon: GlobeIcon },
  association: { label: 'Association', icon: BuildingIcon },
  circle: { label: 'Circle', icon: CircleIcon },
}

const periodConfig: Record<LeaderboardPeriod, string> = {
  all_time: 'All Time',
  this_year: 'This Year',
  this_month: 'This Month',
  current_cycle: 'Current Cycle',
}

function getRankChange(current: number, previous: number): 'up' | 'down' | 'same' {
  if (previous === 0 || current === previous) return 'same'
  return current < previous ? 'up' : 'down'
}

function getRankBadgeStyle(rank: number): string {
  switch (rank) {
    case 1:
      return 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-200 dark:shadow-amber-900/30'
    case 2:
      return 'bg-gradient-to-br from-slate-300 to-slate-500 text-white shadow-lg shadow-slate-200 dark:shadow-slate-900/30'
    case 3:
      return 'bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-200 dark:shadow-orange-900/30'
    default:
      return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
  }
}

// =============================================================================
// Subcomponents
// =============================================================================

interface FilterDropdownProps {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
  icon?: React.ComponentType<{ className?: string }>
}

function FilterDropdown({ label, value, options, onChange, icon: Icon }: FilterDropdownProps) {
  return (
    <div className="relative">
      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2 pr-8 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 ${
            Icon ? 'pl-9' : 'pl-3'
          }`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
    </div>
  )
}

interface LeaderboardRowProps {
  entry: LeaderboardEntry
  isCurrentUser: boolean
  category: LeaderboardCategory
}

function LeaderboardRow({ entry, isCurrentUser, category }: LeaderboardRowProps) {
  const rankChange = getRankChange(entry.rank, entry.previousRank)
  const config = categoryConfig[category]

  return (
    <div
      className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl transition-all ${
        isCurrentUser
          ? 'bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-700'
          : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
    >
      {/* Rank Badge */}
      <div
        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 ${getRankBadgeStyle(
          entry.rank
        )}`}
      >
        {entry.rank === 1 && <TrophyIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
        {entry.rank !== 1 && entry.rank}
      </div>

      {/* Avatar & Name */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <img
          src={entry.userAvatar}
          alt={entry.userName}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-slate-700 shrink-0"
        />
        <div className="min-w-0">
          <p
            className={`font-semibold truncate ${
              isCurrentUser ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-800 dark:text-slate-100'
            }`}
          >
            {entry.userName}
            {isCurrentUser && <span className="text-xs ml-1.5 font-normal">(You)</span>}
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            {rankChange === 'up' && (
              <>
                <ArrowUpIcon className="w-3 h-3 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">
                  +{entry.previousRank - entry.rank}
                </span>
              </>
            )}
            {rankChange === 'down' && (
              <>
                <ArrowDownIcon className="w-3 h-3 text-rose-500" />
                <span className="text-rose-600 dark:text-rose-400">-{entry.rank - entry.previousRank}</span>
              </>
            )}
            {rankChange === 'same' && (
              <>
                <MinusIcon className="w-3 h-3" />
                <span>No change</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Value */}
      <div className="text-right shrink-0">
        <p className={`font-bold text-lg ${config.color === 'indigo' ? 'text-indigo-600 dark:text-indigo-400' : ''} ${config.color === 'amber' ? 'text-amber-600 dark:text-amber-400' : ''} ${config.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' : ''} ${config.color === 'violet' ? 'text-violet-600 dark:text-violet-400' : ''}`}>
          {entry.displayValue}
        </p>
      </div>
    </div>
  )
}

interface SettingsPanelProps {
  settings: LeaderboardSettings
  onUpdateSettings?: (settings: LeaderboardSettings) => void
}

function SettingsPanel({ settings, onUpdateSettings }: SettingsPanelProps) {
  const handleToggleVisibility = () => {
    onUpdateSettings?.({ ...settings, visibleOnLeaderboard: !settings.visibleOnLeaderboard })
  }

  const handleToggleRealName = () => {
    onUpdateSettings?.({ ...settings, showRealName: !settings.showRealName })
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-4">
      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
        <SettingsIcon className="w-5 h-5" />
        <span className="font-semibold">Privacy Settings</span>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleToggleVisibility}
          className="w-full flex items-center justify-between p-3 bg-white dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
        >
          <div className="flex items-center gap-3">
            {settings.visibleOnLeaderboard ? (
              <EyeIcon className="w-5 h-5 text-indigo-500" />
            ) : (
              <EyeOffIcon className="w-5 h-5 text-slate-400" />
            )}
            <div className="text-left">
              <p className="font-medium text-slate-800 dark:text-slate-100">Appear on Leaderboards</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Others can see your ranking
              </p>
            </div>
          </div>
          <div
            className={`w-11 h-6 rounded-full transition-colors relative ${
              settings.visibleOnLeaderboard ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                settings.visibleOnLeaderboard ? 'translate-x-5.5' : 'translate-x-0.5'
              }`}
            />
          </div>
        </button>

        <button
          onClick={handleToggleRealName}
          className="w-full flex items-center justify-between p-3 bg-white dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
        >
          <div className="flex items-center gap-3">
            <UsersIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            <div className="text-left">
              <p className="font-medium text-slate-800 dark:text-slate-100">Show Real Name</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Display your full name instead of username
              </p>
            </div>
          </div>
          <div
            className={`w-11 h-6 rounded-full transition-colors relative ${
              settings.showRealName ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                settings.showRealName ? 'translate-x-5.5' : 'translate-x-0.5'
              }`}
            />
          </div>
        </button>
      </div>
    </div>
  )
}

// =============================================================================
// Category Tab Button
// =============================================================================

interface CategoryTabProps {
  category: LeaderboardCategory
  isActive: boolean
  onClick: () => void
}

function CategoryTab({ category, isActive, onClick }: CategoryTabProps) {
  const config = categoryConfig[category]
  const Icon = config.icon

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
        isActive
          ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 shadow-sm'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline">{config.label}</span>
    </button>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function Leaderboard({
  entries,
  settings,
  currentUserId,
  onUpdateSettings,
  onFilterCategory,
  onFilterScope,
  onFilterPeriod,
}: LeaderboardProps) {
  // Get unique categories from entries for tabs
  const categories = Array.from(new Set(entries.map((e) => e.category)))
  const activeCategory = categories[0] || 'total_saved'

  // Get current user's entry
  const currentUserEntry = entries.find((e) => e.userId === currentUserId)

  // Filter entries for current category (simulated - in real app would be server-filtered)
  const filteredEntries = entries.filter((e) => e.category === activeCategory)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white mb-4 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30">
            <TrophyIcon className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">Leaderboard</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">See how you rank among fellow savers</p>
        </div>

        {/* User's Position Card */}
        {currentUserEntry && (
          <div className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl p-4 sm:p-6 text-white shadow-xl shadow-indigo-200 dark:shadow-indigo-900/30">
            <p className="text-indigo-100 text-sm font-medium mb-3">Your Position</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white/20 flex items-center justify-center font-bold text-2xl">
                  #{currentUserEntry.rank}
                </div>
                <div>
                  <p className="font-semibold text-lg">{currentUserEntry.userName}</p>
                  <p className="text-indigo-100 text-sm">{currentUserEntry.displayValue}</p>
                </div>
              </div>
              <div className="text-right">
                {getRankChange(currentUserEntry.rank, currentUserEntry.previousRank) === 'up' && (
                  <div className="flex items-center gap-1 text-emerald-200">
                    <ArrowUpIcon className="w-5 h-5" />
                    <span className="font-semibold">
                      +{currentUserEntry.previousRank - currentUserEntry.rank}
                    </span>
                  </div>
                )}
                {getRankChange(currentUserEntry.rank, currentUserEntry.previousRank) === 'down' && (
                  <div className="flex items-center gap-1 text-rose-200">
                    <ArrowDownIcon className="w-5 h-5" />
                    <span className="font-semibold">
                      -{currentUserEntry.rank - currentUserEntry.previousRank}
                    </span>
                  </div>
                )}
                {getRankChange(currentUserEntry.rank, currentUserEntry.previousRank) === 'same' && (
                  <p className="text-indigo-200 text-sm">Holding steady</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
          {(Object.keys(categoryConfig) as LeaderboardCategory[]).map((cat) => (
            <CategoryTab
              key={cat}
              category={cat}
              isActive={cat === activeCategory}
              onClick={() => onFilterCategory?.(cat)}
            />
          ))}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-3">
          <FilterDropdown
            label="Scope"
            value="platform"
            options={Object.entries(scopeConfig).map(([value, config]) => ({
              value,
              label: config.label,
            }))}
            onChange={(value) => onFilterScope?.(value as LeaderboardScope)}
            icon={GlobeIcon}
          />
          <FilterDropdown
            label="Period"
            value="all_time"
            options={Object.entries(periodConfig).map(([value, label]) => ({
              value,
              label,
            }))}
            onChange={(value) => onFilterPeriod?.(value as LeaderboardPeriod)}
            icon={CalendarIcon}
          />
        </div>

        {/* Leaderboard List */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700">
            <h2 className="font-semibold text-slate-800 dark:text-slate-100">
              Top Savers · {categoryConfig[activeCategory].label}
            </h2>
          </div>
          <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => (
                <LeaderboardRow
                  key={entry.id}
                  entry={entry}
                  isCurrentUser={entry.userId === currentUserId}
                  category={activeCategory}
                />
              ))
            ) : (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                <TrophyIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No rankings available yet</p>
                <p className="text-sm mt-1">Start saving to appear on the leaderboard!</p>
              </div>
            )}
          </div>
        </div>

        {/* Privacy Settings */}
        <SettingsPanel settings={settings} onUpdateSettings={onUpdateSettings} />
      </div>
    </div>
  )
}

export default Leaderboard
