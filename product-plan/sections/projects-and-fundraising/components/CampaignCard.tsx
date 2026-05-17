import type { Campaign } from '../types'

interface CampaignCardProps {
  campaign: Campaign
  onClick?: () => void
}

const categoryIcons: Record<string, string> = {
  emergency: '🚨',
  project: '🏗️',
  community: '🤝',
  education: '📚',
  health: '❤️‍🩹',
  infrastructure: '🏢',
  cultural: '🎭',
  other: '✨',
}

const statusColors: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  completed: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  paused: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  draft: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export function CampaignCard({ campaign, onClick }: CampaignCardProps) {
  const progress = Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100)
  const daysRemaining = campaign.endDate
    ? Math.max(0, Math.ceil((new Date(campaign.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null

  return (
    <article
      onClick={onClick}
      className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5"
    >
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={campaign.coverImage}
          alt={campaign.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full text-xs font-medium text-slate-700 dark:text-slate-300">
          <span>{categoryIcons[campaign.category]}</span>
          <span className="capitalize">{campaign.category}</span>
        </div>

        {/* Status Badge */}
        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${statusColors[campaign.status]}`}>
          {campaign.status}
        </div>

        {/* Matching Badge */}
        {campaign.matchingConfig?.isActive && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-amber-500 text-white rounded-full text-xs font-bold shadow-lg animate-pulse">
            <span>🎯</span>
            <span>{campaign.matchingConfig.matchRatio}x Matching Active</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {campaign.title}
        </h3>

        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
          {campaign.description.slice(0, 120)}...
        </p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-sm">
          <div>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              {campaign.currency} {campaign.raisedAmount.toLocaleString()}
            </span>
            <span className="text-slate-400 dark:text-slate-500"> / {campaign.currency} {campaign.goalAmount.toLocaleString()}</span>
          </div>
          <span className="font-semibold text-slate-600 dark:text-slate-300">
            {Math.round(progress)}%
          </span>
        </div>

        {/* Footer Stats */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{campaign.donorCount} donors</span>
          </div>

          {daysRemaining !== null && campaign.status === 'active' && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{daysRemaining} days left</span>
            </div>
          )}

          {campaign.status === 'completed' && (
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Goal reached!</span>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
