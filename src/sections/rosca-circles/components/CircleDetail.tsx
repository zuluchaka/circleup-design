import {
  CircleDollarSign,
  Users,
  Calendar,
  Clock,
  Settings,
  Shield,
  ArrowRightLeft,
  CreditCard,
  UserPlus,
  ListOrdered,
  Gavel,
  AlertTriangle,
  Wallet,
  BarChart3,
  MessageSquare,
  UserCheck,
  FileText,
  SlidersHorizontal,
} from 'lucide-react'
import type {
  CircleDetailProps,
  CircleFrequency,
  CircleStatus,
  ParticipantStatus,
  ContributionStatus,
  PayoutScheduleStatus,
  InterventionStatus,
} from '@/../product/sections/rosca-circles/types'

const frequencyLabels: Record<CircleFrequency, string> = {
  weekly: 'Weekly',
  bi_weekly: 'Bi-weekly',
  monthly: 'Monthly',
}

const STATUS_COLORS: Record<CircleStatus, { bg: string; text: string; dot: string }> = {
  active: { bg: 'bg-emerald-50 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500' },
  forming: { bg: 'bg-amber-50 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-500' },
  completed: { bg: 'bg-slate-100 dark:bg-slate-700/50', text: 'text-slate-600 dark:text-slate-300', dot: 'bg-slate-400' },
  cancelled: { bg: 'bg-red-50 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', dot: 'bg-red-500' },
}

const participantStatusColors: Record<ParticipantStatus, string> = {
  active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  suspended: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  removed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

const contributionStatusColors: Record<ContributionStatus, string> = {
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

const scheduleStatusColors: Record<PayoutScheduleStatus, string> = {
  completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  upcoming: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  scheduled: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400',
}

const interventionStatusColors: Record<InterventionStatus, string> = {
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  active: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  repaid: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  written_off: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

const NAV_ITEMS = [
  { label: 'Participants', view: 'participants', icon: Users },
  { label: 'Payout Schedule', view: 'payout-schedule', icon: ListOrdered },
  { label: 'Bidding', view: 'bidding', icon: Gavel },
  { label: 'Position Swap', view: 'position-swap', icon: ArrowRightLeft },
  { label: 'Emergency Fund', view: 'emergency-fund', icon: Shield },
  { label: 'Treasurer', view: 'treasurer', icon: Wallet },
  { label: 'Risk Scores', view: 'risk-scores', icon: BarChart3 },
  { label: 'Disputes', view: 'disputes', icon: MessageSquare },
  { label: 'Documents', view: 'documents', icon: FileText },
  { label: 'Settings', view: 'settings', icon: SlidersHorizontal },
  { label: 'Cash Collection', view: 'cash-collection', icon: CreditCard },
  { label: 'Invite Members', view: 'invite', icon: UserPlus },
  { label: 'Waitlist', view: 'waitlist', icon: UserCheck },
]

export function CircleDetail({
  circle,
  participants,
  payoutSchedule,
  contributions,
  emergencyFundInterventions,
  currentUserId,
  currentUserRole,
  onBack,
  onMakeContribution,
  onViewParticipant,
  onInviteMembers,
  onManageCircle,
  onExportCalendar,
  onNavigate,
}: CircleDetailProps) {
  const isOrganizer = currentUserRole === 'organizer'
  const currentParticipant = participants.find((p) => p.userId === currentUserId)
  const completedCycles = Math.max(0, circle.currentCycle - 1)
  const progress = circle.duration > 0 ? Math.round((completedCycles / circle.duration) * 100) : 0
  const colors = STATUS_COLORS[circle.status] || STATUS_COLORS.active

  const fmt = (amount: number) =>
    `${circle.currency} ${amount.toLocaleString()}`

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CircleDollarSign className="w-6 h-6 text-indigo-500" />
                  {circle.name}
                </h1>
                <div className="mt-1 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  {circle.associationName && <span>{circle.associationName}</span>}
                  {circle.associationName && circle.organizerName && <span>&middot;</span>}
                  {circle.organizerName && <span>Organized by {circle.organizerName}</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${colors.bg} ${colors.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                {circle.status}
              </span>
              {onMakeContribution && circle.status === 'active' && (
                <button
                  onClick={onMakeContribution}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
                >
                  <CreditCard className="w-4 h-4" />
                  Pay Now
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Progress', value: `${progress}%`, sub: `Cycle ${circle.currentCycle}/${circle.duration}`, color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400' },
              { label: 'Members', value: `${participants.length}/${circle.maxParticipants}`, sub: `${circle.currentParticipants - participants.filter(p => p.status !== 'active').length} active`, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' },
              { label: 'Collected', value: fmt(circle.totalCollected), sub: `${fmt(circle.contributionAmount)} ${frequencyLabels[circle.frequency]?.toLowerCase() || circle.frequency}`, color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' },
              { label: 'Emergency Fund', value: fmt(circle.emergencyFundBalance), sub: `${circle.emergencyFundRate}% rate`, color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' },
            ].map((stat) => (
              <div key={stat.label} className={`rounded-xl px-4 py-3 ${stat.color}`}>
                <div className="text-2xl font-bold truncate">{stat.value}</div>
                <p className="text-sm font-medium mt-0.5 opacity-80">{stat.label}</p>
                {stat.sub && <p className="text-xs mt-0.5 opacity-60">{stat.sub}</p>}
              </div>
            ))}
          </div>

          {/* Quick Nav */}
          {onNavigate && (
            <div className="mt-6 flex flex-wrap gap-2">
              {NAV_ITEMS.map(({ label, view, icon: Icon }) => (
                <button
                  key={view}
                  onClick={() => onNavigate(view)}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
              {isOrganizer && onManageCircle && (
                <button
                  onClick={onManageCircle}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Manage
                </button>
              )}
              {onExportCalendar && (
                <button
                  onClick={onExportCalendar}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Export Calendar
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        {/* Description */}
        {circle.description && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
            <p className="text-slate-600 dark:text-slate-400 text-sm">{circle.description}</p>
          </div>
        )}

        {/* My Participation */}
        {currentParticipant && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">My Participation</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Position</p>
                <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                  #{currentParticipant.payoutPosition || (currentParticipant.role === 'organizer' ? '1' : 'TBD')}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Contributed</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                  {fmt(currentParticipant.totalContributed)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Payout</p>
                <p className="text-lg font-semibold">
                  {currentParticipant.payoutReceived ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Received
                    </span>
                  ) : (
                    <span className="text-slate-500 dark:text-slate-400">Pending</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Payment History</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{currentParticipant.paymentStats.onTime} on-time</span>
                  {currentParticipant.paymentStats.late > 0 && (
                    <span className="text-xs font-medium text-amber-600 dark:text-amber-400">{currentParticipant.paymentStats.late} late</span>
                  )}
                  {currentParticipant.paymentStats.missed > 0 && (
                    <span className="text-xs font-medium text-red-600 dark:text-red-400">{currentParticipant.paymentStats.missed} missed</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Circle Progress */}
        {circle.status === 'active' && circle.duration > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Progress</h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Cycle {circle.currentCycle} of {circle.duration}
              </span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Contribution</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {fmt(circle.contributionAmount)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Frequency</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {frequencyLabels[circle.frequency]}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Next Payout</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {circle.nextPayoutDate
                    ? new Date(circle.nextPayoutDate).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Members */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              Members ({participants.length}/{circle.maxParticipants})
            </h2>
            {isOrganizer && onInviteMembers && circle.currentParticipants < circle.maxParticipants && (
              <button
                onClick={onInviteMembers}
                className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Invite
              </button>
            )}
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {participants.map((participant) => (
              <button
                key={participant.id}
                className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
                onClick={() => onViewParticipant?.(participant.id)}
              >
                <div className="relative">
                  {participant.avatar ? (
                    <img
                      src={participant.avatar}
                      alt={participant.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-medium">
                      {(participant.name || '?').charAt(0)}
                    </div>
                  )}
                  {participant.role === 'organizer' && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-900 dark:text-white truncate">
                      {participant.name}
                    </p>
                    {participant.userId === currentUserId && (
                      <span className="text-xs text-indigo-600 dark:text-indigo-400">(You)</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Position #{participant.payoutPosition || (participant.role === 'organizer' ? '1' : 'TBD')}
                    <span className="mx-1">&middot;</span>
                    <span className="inline-flex items-center gap-0.5">
                      <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {participant.trustScore}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {participant.payoutReceived && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                      Paid
                    </span>
                  )}
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${participantStatusColors[participant.status]}`}>
                    {participant.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Payout Schedule */}
        {payoutSchedule.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-slate-400" />
                Payout Schedule
              </h2>
            </div>
            <div className="p-4">
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />
                <div className="space-y-3">
                  {payoutSchedule.map((entry) => (
                    <div
                      key={`${entry.cycle}-${entry.recipientId}`}
                      className={`relative pl-10 py-2 ${entry.isCurrent ? 'px-3 -mx-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/20' : ''}`}
                    >
                      <div
                        className={`absolute left-2.5 top-4 w-3 h-3 rounded-full border-2 ${
                          entry.status === 'completed'
                            ? 'bg-emerald-500 border-emerald-500'
                            : entry.isCurrent
                            ? 'bg-indigo-500 border-indigo-500'
                            : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600'
                        }`}
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {entry.recipientAvatar ? (
                            <img src={entry.recipientAvatar} alt={entry.recipientName} className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 text-sm font-medium">
                              {(entry.recipientName || '?').charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white text-sm">
                              {entry.recipientName}
                              {entry.recipientId === currentUserId && (
                                <span className="ml-2 text-xs text-indigo-600 dark:text-indigo-400">(You)</span>
                              )}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Cycle {entry.cycle} &middot; {new Date(entry.scheduledDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm text-slate-900 dark:text-white">
                            {fmt(entry.amount)}
                          </p>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${scheduleStatusColors[entry.status]}`}>
                            {entry.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Contributions */}
        {contributions.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-slate-400" />
                Recent Contributions
              </h2>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {contributions.slice(0, 10).map((contribution) => (
                <div key={contribution.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium text-sm text-slate-900 dark:text-white">{contribution.participantName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Cycle {contribution.cycle} &middot; {contribution.paidDate
                        ? new Date(contribution.paidDate).toLocaleDateString()
                        : new Date(contribution.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-900 dark:text-white font-mono">
                      {fmt(contribution.amount)}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${contributionStatusColors[contribution.status]}`}>
                      {contribution.status}
                      {contribution.isLate && ' (Late)'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Financial Summary + Circle Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Financial Summary */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Financial Summary</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">Total Collected</span>
                <span className="font-semibold text-sm text-emerald-600 dark:text-emerald-400">{fmt(circle.totalCollected)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">Total Disbursed</span>
                <span className="font-semibold text-sm text-slate-900 dark:text-white">{fmt(circle.totalDisbursed)}</span>
              </div>
              <div className="h-px bg-slate-200 dark:bg-slate-700" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">Emergency Fund</span>
                <span className="font-semibold text-sm text-amber-600 dark:text-amber-400">{fmt(circle.emergencyFundBalance)}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {circle.emergencyFundRate}% of contributions go to emergency fund
              </p>
            </div>
          </div>

          {/* Circle Settings */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Circle Settings</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Late Penalty</span>
                <span className="text-slate-900 dark:text-white">{circle.latePenaltyPercent}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Grace Period</span>
                <span className="text-slate-900 dark:text-white">{circle.gracePeriodDays} days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Visibility</span>
                <span className="text-slate-900 dark:text-white capitalize">{circle.visibility.replace('_', ' ')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Started</span>
                <span className="text-slate-900 dark:text-white">{new Date(circle.startDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Fund Interventions */}
        {emergencyFundInterventions.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Emergency Fund Activity
              </h2>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {emergencyFundInterventions.slice(0, 3).map((intervention) => (
                <div key={intervention.id} className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-slate-900 dark:text-white">
                      {intervention.defaultingParticipantName}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${interventionStatusColors[intervention.status]}`}>
                      {intervention.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Covered: {fmt(intervention.coveredAmount)}
                  </p>
                  {intervention.debtRemaining > 0 && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-500 dark:text-slate-400">Repayment</span>
                        <span className="text-slate-700 dark:text-slate-300">
                          {Math.round(((intervention.debtAmount - intervention.debtRemaining) / intervention.debtAmount) * 100)}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-600">
                        <div
                          className="h-1.5 rounded-full bg-emerald-500"
                          style={{ width: `${((intervention.debtAmount - intervention.debtRemaining) / intervention.debtAmount) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
