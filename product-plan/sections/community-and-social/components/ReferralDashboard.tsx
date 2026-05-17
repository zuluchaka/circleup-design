import type { ReferralDashboardProps, Referral, ReferralStatus } from '../types'

// Icons
const Icons = {
  copy: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  whatsapp: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
  email: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  sms: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  share: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  ),
  gift: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
    </svg>
  ),
  check: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  clock: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  bell: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  users: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  ),
}

const statusConfig: Record<ReferralStatus, { label: string; color: string; bgColor: string }> = {
  invited: {
    label: 'Invited',
    color: 'text-amber-700 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
  },
  joined: {
    label: 'Joined',
    color: 'text-blue-700 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  active: {
    label: 'Active',
    color: 'text-green-700 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
}

function ReferralRow({
  referral,
  onSendReminder,
}: {
  referral: Referral
  onSendReminder?: (referralId: string) => void
}) {
  const status = statusConfig[referral.status]
  const invitedDate = new Date(referral.invitedAt)

  return (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
      {/* Avatar */}
      {referral.refereeAvatar ? (
        <img src={referral.refereeAvatar} alt="" className="w-12 h-12 rounded-full object-cover" />
      ) : (
        <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
          {Icons.users}
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-medium text-slate-900 dark:text-white truncate">
            {referral.refereeName || referral.refereeEmail}
          </p>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.color} ${status.bgColor}`}>
            {status.label}
          </span>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Invited {invitedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Reward / Action */}
      <div className="text-right">
        {referral.status === 'active' && referral.rewardStatus === 'paid' ? (
          <div>
            <p className="font-semibold text-green-600 dark:text-green-400">
              +CHF {referral.rewardAmount.toFixed(0)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-end gap-1">
              {Icons.check}
              Paid
            </p>
          </div>
        ) : referral.status === 'active' && referral.rewardStatus === 'pending' ? (
          <div>
            <p className="font-semibold text-amber-600 dark:text-amber-400">
              +CHF {referral.rewardAmount.toFixed(0)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-end gap-1">
              {Icons.clock}
              Pending
            </p>
          </div>
        ) : referral.status === 'invited' ? (
          <button
            onClick={() => onSendReminder?.(referral.id)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
          >
            {Icons.bell}
            Remind
          </button>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">Awaiting first contribution</p>
        )}
      </div>
    </div>
  )
}

export function ReferralDashboard({
  referralStats,
  referrals,
  onShareLink,
  onCopyLink,
  onSendReminder,
}: ReferralDashboardProps) {
  // Sort referrals: most recent first
  const sortedReferrals = [...referrals].sort(
    (a, b) => new Date(b.invitedAt).getTime() - new Date(a.invitedAt).getTime()
  )

  // Filter by status for tabs
  const referralsByStatus = {
    all: sortedReferrals,
    invited: sortedReferrals.filter((r) => r.status === 'invited'),
    joined: sortedReferrals.filter((r) => r.status === 'joined'),
    active: sortedReferrals.filter((r) => r.status === 'active'),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Referral Program</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Invite friends to CircleUp and earn CHF 25 when they make their first contribution
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Invited</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{referralStats.totalInvited}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Joined</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{referralStats.totalJoined}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Active</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{referralStats.totalActive}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-4 text-white">
          <p className="text-sm text-amber-100 mb-1">Total Earned</p>
          <p className="text-3xl font-bold">CHF {referralStats.totalEarnings.toFixed(0)}</p>
          {referralStats.pendingEarnings > 0 && (
            <p className="text-xs text-amber-100 mt-1">+CHF {referralStats.pendingEarnings.toFixed(0)} pending</p>
          )}
        </div>
      </div>

      {/* Share Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-indigo-200 dark:border-indigo-800 p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
              {Icons.gift}
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Share your referral link</h2>
            <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <input
                type="text"
                readOnly
                value={referralStats.referralLink}
                className="flex-1 bg-transparent text-sm text-slate-600 dark:text-slate-400 outline-none truncate"
              />
              <button
                onClick={onCopyLink}
                className="flex-shrink-0 p-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                title="Copy link"
              >
                {Icons.copy}
              </button>
            </div>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={() => onShareLink?.('whatsapp')}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-xl font-medium transition-colors"
          >
            {Icons.whatsapp}
            WhatsApp
          </button>
          <button
            onClick={() => onShareLink?.('sms')}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
          >
            {Icons.sms}
            SMS
          </button>
          <button
            onClick={() => onShareLink?.('email')}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors"
          >
            {Icons.email}
            Email
          </button>
          <button
            onClick={() => onShareLink?.('social')}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
          >
            {Icons.share}
            Share
          </button>
        </div>

        {/* Referral Code */}
        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className="text-slate-500 dark:text-slate-400">Your code:</span>
          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 px-2 py-0.5 rounded">
            {referralStats.referralCode}
          </span>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">How it works</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold flex-shrink-0">
              1
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Share your link</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Send your unique referral link to friends and family</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold flex-shrink-0">
              2
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-white">They join a circle</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Your referral signs up and joins their first savings circle</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold flex-shrink-0">
              3
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-white">You both earn CHF 25</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">When they make their first contribution, you both get rewarded</p>
            </div>
          </div>
        </div>
      </div>

      {/* Referrals List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900 dark:text-white">Your Referrals</h3>
          <div className="flex gap-2 text-sm">
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300">
              All ({referralsByStatus.all.length})
            </span>
          </div>
        </div>

        {sortedReferrals.length > 0 ? (
          <div className="space-y-3">
            {sortedReferrals.map((referral) => (
              <ReferralRow key={referral.id} referral={referral} onSendReminder={onSendReminder} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4 text-slate-400">
              {Icons.users}
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-2">No referrals yet</p>
            <p className="text-sm text-slate-500 dark:text-slate-500">Share your link to start earning rewards!</p>
          </div>
        )}
      </div>
    </div>
  )
}
