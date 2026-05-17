import type {
  SuccessStory,
  StoryCategory,
  SuccessStoriesProps,
} from '../../../../product/sections/community-and-social/types'

// =============================================================================
// Icons
// =============================================================================

function BookOpenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function GraduationCapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
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

function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
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

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}

function HeartFilledIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7 7-7Z" />
    </svg>
  )
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  )
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
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

function CircleCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
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

function PenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  )
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

// =============================================================================
// Helper Functions
// =============================================================================

const categoryConfig: Record<
  StoryCategory,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bgColor: string }
> = {
  first_home: {
    label: 'First Home',
    icon: HomeIcon,
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
  },
  education: {
    label: 'Education',
    icon: GraduationCapIcon,
    color: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-100 dark:bg-violet-900/30',
  },
  emergency_fund: {
    label: 'Emergency Fund',
    icon: ShieldIcon,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
  business: {
    label: 'Business',
    icon: BriefcaseIcon,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
  },
  family: {
    label: 'Family',
    icon: UsersIcon,
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-100 dark:bg-rose-900/30',
  },
}

function formatCurrency(amount: number): string {
  return `CHF ${amount.toLocaleString()}`
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

// =============================================================================
// Subcomponents
// =============================================================================

interface CategoryFilterProps {
  categories: StoryCategory[]
  activeCategory: StoryCategory | null
  onFilter: (category: StoryCategory | null) => void
}

function CategoryFilter({ categories, activeCategory, onFilter }: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
      <button
        onClick={() => onFilter(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
          activeCategory === null
            ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
      >
        All Stories
      </button>
      {categories.map((cat) => {
        const config = categoryConfig[cat]
        const Icon = config.icon
        return (
          <button
            key={cat}
            onClick={() => onFilter(cat)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === cat
                ? `${config.bgColor} ${config.color}`
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            {config.label}
          </button>
        )
      })}
    </div>
  )
}

interface FeaturedStoryCardProps {
  story: SuccessStory
  onLike?: (id: string) => void
  onShare?: (id: string) => void
  onView?: (id: string) => void
}

function FeaturedStoryCard({ story, onLike, onShare, onView }: FeaturedStoryCardProps) {
  const category = categoryConfig[story.category]
  const CategoryIcon = category.icon

  return (
    <div className="relative bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl overflow-hidden shadow-xl">
      {/* Featured Badge */}
      <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-amber-400 text-amber-900 px-3 py-1 rounded-full text-xs font-semibold">
        <StarIcon className="w-3.5 h-3.5" />
        Featured Story
      </div>

      <div className="p-6 sm:p-8 pt-14">
        {/* Author */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src={story.authorAvatar}
            alt={story.authorName}
            className="w-12 h-12 rounded-full ring-2 ring-white/30"
          />
          <div>
            <p className="font-semibold text-white">{story.authorName}</p>
            <div className="flex items-center gap-1 text-indigo-200 text-sm">
              <MapPinIcon className="w-3.5 h-3.5" />
              {story.authorLocation}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white mb-3`}>
          <CategoryIcon className="w-3.5 h-3.5" />
          {category.label}
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{story.title}</h2>
        <p className="text-indigo-100 mb-6 line-clamp-3">{story.summary}</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <PiggyBankIcon className="w-5 h-5 mx-auto text-indigo-200 mb-1" />
            <p className="text-lg font-bold text-white">{formatCurrency(story.amountSaved)}</p>
            <p className="text-xs text-indigo-200">Saved</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <CalendarIcon className="w-5 h-5 mx-auto text-indigo-200 mb-1" />
            <p className="text-lg font-bold text-white">{story.timeframe}</p>
            <p className="text-xs text-indigo-200">Duration</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <CircleCheckIcon className="w-5 h-5 mx-auto text-indigo-200 mb-1" />
            <p className="text-lg font-bold text-white">{story.circlesCompleted}</p>
            <p className="text-xs text-indigo-200">Circles</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onLike?.(story.id)}
              className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors"
            >
              <HeartFilledIcon className="w-5 h-5 text-rose-400" />
              <span className="text-sm font-medium">{formatNumber(story.likes)}</span>
            </button>
            <button
              onClick={() => onShare?.(story.id)}
              className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors"
            >
              <ShareIcon className="w-5 h-5" />
              <span className="text-sm font-medium">{formatNumber(story.shares)}</span>
            </button>
          </div>
          <button
            onClick={() => onView?.(story.id)}
            className="flex items-center gap-1 bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-indigo-50 transition-colors"
          >
            Read Story
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

interface StoryCardProps {
  story: SuccessStory
  onLike?: (id: string) => void
  onShare?: (id: string) => void
  onView?: (id: string) => void
}

function StoryCard({ story, onLike, onShare, onView }: StoryCardProps) {
  const category = categoryConfig[story.category]
  const CategoryIcon = category.icon

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <img
            src={story.authorAvatar}
            alt={story.authorName}
            className="w-10 h-10 rounded-full ring-2 ring-white dark:ring-slate-700"
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-800 dark:text-white truncate">{story.authorName}</p>
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm">
              <MapPinIcon className="w-3.5 h-3.5" />
              {story.authorLocation}
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${category.bgColor} ${category.color}`}
          >
            <CategoryIcon className="w-3.5 h-3.5" />
            {category.label}
          </span>
        </div>

        {/* Content */}
        <h3 className="font-semibold text-slate-800 dark:text-white mb-2">{story.title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">{story.summary}</p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
          <div className="flex items-center gap-1.5">
            <PiggyBankIcon className="w-4 h-4" />
            {formatCurrency(story.amountSaved)}
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarIcon className="w-4 h-4" />
            {story.timeframe}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onLike?.(story.id)}
              className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
            >
              <HeartIcon className="w-5 h-5" />
              <span className="text-sm">{formatNumber(story.likes)}</span>
            </button>
            <button
              onClick={() => onShare?.(story.id)}
              className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
            >
              <ShareIcon className="w-5 h-5" />
              <span className="text-sm">{formatNumber(story.shares)}</span>
            </button>
          </div>
          <button
            onClick={() => onView?.(story.id)}
            className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline flex items-center gap-0.5"
          >
            Read more
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function SuccessStories({
  stories,
  onSubmitStory,
  onLikeStory,
  onShareStory,
  onViewStory,
  onFilterCategory,
}: SuccessStoriesProps) {
  // Get approved stories only
  const approvedStories = stories.filter((s) => s.status === 'approved')

  // Separate featured and regular stories
  const featuredStories = approvedStories.filter((s) => s.featured)
  const regularStories = approvedStories.filter((s) => !s.featured)

  // Get unique categories
  const categories = Array.from(new Set(approvedStories.map((s) => s.category)))

  // Calculate stats
  const totalLikes = approvedStories.reduce((sum, s) => sum + s.likes, 0)
  const totalShares = approvedStories.reduce((sum, s) => sum + s.shares, 0)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 text-white mb-4 shadow-lg shadow-rose-200 dark:shadow-rose-900/30">
            <BookOpenIcon className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">Success Stories</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Real stories from members who achieved their dreams
          </p>
        </div>

        {/* Share Your Story CTA */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-5 sm:p-6 border border-amber-200 dark:border-amber-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0">
              <PenIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-800 dark:text-white mb-1">Share Your Story</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Inspire others by sharing how CircleUp helped you achieve your financial goals
              </p>
            </div>
            <button
              onClick={onSubmitStory}
              className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium text-sm transition-colors"
            >
              Submit Your Story
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 text-center">
            <p className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">
              {approvedStories.length}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Stories Shared</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 text-center">
            <p className="text-2xl sm:text-3xl font-bold text-rose-600 dark:text-rose-400">
              {formatNumber(totalLikes)}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Likes</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 text-center">
            <p className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {formatNumber(totalShares)}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Times Shared</p>
          </div>
        </div>

        {/* Category Filter */}
        <CategoryFilter categories={categories} activeCategory={null} onFilter={(cat) => onFilterCategory?.(cat!)} />

        {/* Featured Stories */}
        {featuredStories.length > 0 && (
          <div className="space-y-4">
            {featuredStories.map((story) => (
              <FeaturedStoryCard
                key={story.id}
                story={story}
                onLike={onLikeStory}
                onShare={onShareStory}
                onView={onViewStory}
              />
            ))}
          </div>
        )}

        {/* Regular Stories */}
        {regularStories.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {regularStories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                onLike={onLikeStory}
                onShare={onShareStory}
                onView={onViewStory}
              />
            ))}
          </div>
        ) : approvedStories.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <BookOpenIcon className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
            <p className="text-slate-600 dark:text-slate-400">No stories yet</p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
              Be the first to share your success story!
            </p>
            <button
              onClick={onSubmitStory}
              className="mt-4 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm transition-colors"
            >
              Share Your Story
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default SuccessStories
