import type { CampaignDetailProps } from '@/../product/sections/projects-and-fundraising/types'

const categoryLabels: Record<string, { icon: string; label: string }> = {
  emergency: { icon: '🚨', label: 'Emergency Fund' },
  project: { icon: '🏗️', label: 'Project' },
  community: { icon: '🤝', label: 'Community' },
  education: { icon: '📚', label: 'Education' },
  health: { icon: '❤️‍🩹', label: 'Health' },
  infrastructure: { icon: '🏢', label: 'Infrastructure' },
  cultural: { icon: '🎭', label: 'Cultural' },
  other: { icon: '✨', label: 'Other' },
}

export function CampaignDetail({
  campaign,
  recentDonations,
  updates,
  stats,
  onDonate,
  onShare,
  onUpdateClick,
}: CampaignDetailProps) {
  const progress = Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100)
  const category = categoryLabels[campaign.category]

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    return formatDate(dateStr)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Section */}
      <div className="relative">
        <div className="h-64 sm:h-80 lg:h-96 overflow-hidden">
          <img
            src={campaign.coverImage}
            alt={campaign.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-8 max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full">
              {category.icon} {category.label}
            </span>
            {campaign.matchingConfig?.isActive && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500 text-white text-sm font-bold rounded-full animate-pulse">
                🎯 {campaign.matchingConfig.matchRatio}x Matching
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {campaign.title}
          </h1>
          <p className="mt-2 text-lg text-white/80">
            by <span className="font-medium text-white">{campaign.associationName}</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">About this campaign</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {campaign.description.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="text-slate-600 dark:text-slate-300 mb-4 last:mb-0 whitespace-pre-wrap">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            {/* Updates Section */}
            {updates.length > 0 && (
              <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Campaign Updates</h2>
                  <span className="text-sm text-slate-500">{updates.length} updates</span>
                </div>

                <div className="space-y-6">
                  {updates.map((update, index) => (
                    <article
                      key={update.id}
                      onClick={() => onUpdateClick?.(update.id)}
                      className={`relative cursor-pointer group ${index !== updates.length - 1 ? 'pb-6 border-b border-slate-100 dark:border-slate-800' : ''}`}
                    >
                      {update.isPinned && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium rounded-full mb-2">
                          📌 Pinned
                        </span>
                      )}
                      <div className="flex items-start gap-3">
                        {update.authorAvatar ? (
                          <img
                            src={update.authorAvatar}
                            alt={update.authorName}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                            <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                              {update.authorName.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-slate-900 dark:text-white">{update.authorName}</span>
                            <span className="text-sm text-slate-400">{formatTimeAgo(update.publishedAt)}</span>
                          </div>
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {update.title}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-300 mt-2 line-clamp-3">
                            {update.content.slice(0, 200)}...
                          </p>
                          {update.media.length > 0 && (
                            <div className="flex gap-2 mt-3 overflow-x-auto">
                              {update.media.slice(0, 3).map(media => (
                                <img
                                  key={media.id}
                                  src={media.url}
                                  alt={media.caption || 'Update image'}
                                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                                />
                              ))}
                              {update.media.length > 3 && (
                                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <span className="text-slate-500 font-medium">+{update.media.length - 3}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Recent Donors */}
            <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Donors</h2>
                <span className="text-sm text-slate-500">{campaign.donorCount} total</span>
              </div>

              {recentDonations.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                    <span className="text-2xl">💝</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400">Be the first to donate!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentDonations.map(donation => (
                    <div key={donation.id} className="flex items-start gap-3 p-3 -mx-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      {donation.isAnonymous ? (
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      ) : donation.donorAvatar ? (
                        <img
                          src={donation.donorAvatar}
                          alt={donation.donorName}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                          <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                            {donation.donorName.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-900 dark:text-white">
                            {donation.isAnonymous ? 'Anonymous' : donation.donorName}
                          </span>
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">
                            {donation.currency} {donation.amount.toLocaleString()}
                            {donation.matchedAmount > 0 && (
                              <span className="text-amber-500 ml-1 text-sm">
                                +{donation.matchedAmount} matched
                              </span>
                            )}
                          </span>
                        </div>
                        {donation.message && (
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                            "{donation.message}"
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-400">{formatTimeAgo(donation.createdAt)}</span>
                          {donation.isRecurring && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs rounded">
                              🔄 Monthly
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 sticky top-6">
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-end justify-between mb-2">
                  <div>
                    <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                      {campaign.currency} {campaign.raisedAmount.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    {Math.round(progress)}%
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                  raised of {campaign.currency} {campaign.goalAmount.toLocaleString()} goal
                </p>
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.donorCount}</div>
                  <div className="text-xs text-slate-500">Donors</div>
                </div>
                {stats.daysRemaining !== null && (
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.daysRemaining}</div>
                    <div className="text-xs text-slate-500">Days left</div>
                  </div>
                )}
              </div>

              {/* Matching Info */}
              {campaign.matchingConfig?.isActive && (
                <div className="mb-6 p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🎯</span>
                    <span className="font-bold text-amber-800 dark:text-amber-300">
                      {campaign.matchingConfig.matchRatio}x Matching Active!
                    </span>
                  </div>
                  <p className="text-sm text-amber-700 dark:text-amber-400 mb-2">
                    Every franc you donate is matched by <strong>{campaign.matchingConfig.sponsorName}</strong>
                  </p>
                  <div className="text-xs text-amber-600 dark:text-amber-500">
                    {campaign.currency} {campaign.matchingConfig.matchedSoFar.toLocaleString()} / {campaign.matchingConfig.matchCap.toLocaleString()} matched
                  </div>
                  <div className="h-2 bg-amber-200 dark:bg-amber-800 rounded-full overflow-hidden mt-2">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${(campaign.matchingConfig.matchedSoFar / campaign.matchingConfig.matchCap) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Donate Button */}
              {campaign.status === 'active' && (
                <button
                  onClick={() => onDonate?.()}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-lg rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  Donate Now
                </button>
              )}

              {campaign.status === 'completed' && (
                <div className="text-center py-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl font-bold">
                  ✨ Campaign Completed!
                </div>
              )}

              {/* Share Buttons */}
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 text-center">Share this campaign</p>
                <div className="flex justify-center gap-2">
                  {['facebook', 'twitter', 'linkedin', 'whatsapp'].map(platform => (
                    <button
                      key={platform}
                      onClick={() => onShare?.(platform)}
                      className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-center transition-colors"
                    >
                      {platform === 'facebook' && (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      )}
                      {platform === 'twitter' && (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      )}
                      {platform === 'linkedin' && (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      )}
                      {platform === 'whatsapp' && (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Campaign Info */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Campaign Details</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Created</dt>
                  <dd className="text-slate-900 dark:text-white font-medium">{formatDate(campaign.createdAt)}</dd>
                </div>
                {campaign.endDate && (
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Ends</dt>
                    <dd className="text-slate-900 dark:text-white font-medium">{formatDate(campaign.endDate)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-slate-500">Category</dt>
                  <dd className="text-slate-900 dark:text-white font-medium capitalize">{campaign.category}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Min. donation</dt>
                  <dd className="text-slate-900 dark:text-white font-medium">{campaign.currency} {campaign.minDonation}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Anonymous donations</dt>
                  <dd className="text-slate-900 dark:text-white font-medium">{campaign.allowAnonymous ? 'Allowed' : 'Not allowed'}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
