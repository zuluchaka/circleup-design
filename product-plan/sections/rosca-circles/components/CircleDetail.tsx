import type {
  CircleDetailProps,
  CircleFrequency,
  CircleStatus,
  ParticipantStatus,
  ContributionStatus,
  PayoutScheduleStatus,
  InterventionStatus,
} from '../types'

const frequencyLabels: Record<CircleFrequency, string> = {
  weekly: 'Weekly',
  bi_weekly: 'Bi-weekly',
  monthly: 'Monthly',
}

const statusColors: Record<CircleStatus, string> = {
  forming: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  completed: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
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

export function CircleDetail({
  circle,
  participants,
  payoutSchedule,
  contributions,
  emergencyFundInterventions,
  currentUserId,
  currentUserRole,
  onMakeContribution,
  onViewParticipant,
  onInviteMembers,
  onManageCircle,
  onExportCalendar,
}: CircleDetailProps) {
  const isOrganizer = currentUserRole === 'organizer'
  const currentParticipant = participants.find((p) => p.userId === currentUserId)
  const progress = (circle.currentCycle / circle.duration) * 100

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  {circle.name}
                </h1>
                <span className={`px-2.5 py-0.5 text-sm font-medium rounded-full ${statusColors[circle.status]}`}>
                  {circle.status}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400">{circle.description}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
                <span>{circle.associationName}</span>
                <span>•</span>
                <span>Organized by {circle.organizerName}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {onMakeContribution && circle.status === 'active' && (
                <button
                  onClick={onMakeContribution}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
                >
                  Make Contribution
                </button>
              )}
              {onExportCalendar && (
                <button
                  onClick={onExportCalendar}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Export Calendar
                </button>
              )}
              {isOrganizer && onManageCircle && (
                <button
                  onClick={onManageCircle}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Manage Circle
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Circle Progress */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Circle Progress
              </h2>
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-slate-200 dark:text-slate-700"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${progress * 2.51} 251`}
                      className="text-indigo-600 dark:text-indigo-400"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-slate-900 dark:text-white">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Current Cycle</p>
                    <p className="text-xl font-semibold text-slate-900 dark:text-white">
                      {circle.currentCycle} of {circle.duration}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Contribution</p>
                    <p className="text-xl font-semibold text-slate-900 dark:text-white">
                      {circle.currency} {circle.contributionAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Frequency</p>
                    <p className="text-lg font-medium text-slate-900 dark:text-white">
                      {frequencyLabels[circle.frequency]}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Next Payout</p>
                    <p className="text-lg font-medium text-slate-900 dark:text-white">
                      {circle.nextPayoutDate
                        ? new Date(circle.nextPayoutDate).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Member Roster */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Members ({participants.length}/{circle.maxParticipants})
                </h2>
                {isOrganizer && onInviteMembers && circle.currentParticipants < circle.maxParticipants && (
                  <button
                    onClick={onInviteMembers}
                    className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                  >
                    Invite Members
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
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
                          {participant.name.charAt(0)}
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
                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <span>Position #{participant.payoutPosition || 'TBD'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {participant.trustScore}
                        </span>
                      </div>
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
                  </div>
                ))}
              </div>
            </div>

            {/* Payout Schedule Timeline */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Payout Schedule
              </h2>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />
                <div className="space-y-4">
                  {payoutSchedule.map((entry, idx) => (
                    <div
                      key={`${entry.cycle}-${entry.recipientId}`}
                      className={`relative pl-10 ${entry.isCurrent ? 'py-3 -mx-2 px-12 rounded-lg bg-indigo-50 dark:bg-indigo-900/20' : ''}`}
                    >
                      <div
                        className={`absolute left-2.5 w-3 h-3 rounded-full border-2 ${
                          entry.status === 'completed'
                            ? 'bg-emerald-500 border-emerald-500'
                            : entry.isCurrent
                            ? 'bg-indigo-500 border-indigo-500'
                            : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600'
                        }`}
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {entry.recipientAvatar ? (
                            <img
                              src={entry.recipientAvatar}
                              alt={entry.recipientName}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 text-sm font-medium">
                              {entry.recipientName.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">
                              {entry.recipientName}
                              {entry.recipientId === currentUserId && (
                                <span className="ml-2 text-xs text-indigo-600 dark:text-indigo-400">(You)</span>
                              )}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              Cycle {entry.cycle} • {new Date(entry.scheduledDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {circle.currency} {entry.amount.toLocaleString()}
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

            {/* Recent Contributions */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Recent Contributions
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left py-3 px-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                        Member
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                        Cycle
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                        Amount
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                        Date
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {contributions.slice(0, 10).map((contribution) => (
                      <tr key={contribution.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="py-3 px-2">
                          <span className="font-medium text-slate-900 dark:text-white">
                            {contribution.participantName}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-slate-600 dark:text-slate-400">
                          {contribution.cycle}
                        </td>
                        <td className="py-3 px-2 font-medium text-slate-900 dark:text-white">
                          {circle.currency} {contribution.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-2 text-slate-600 dark:text-slate-400">
                          {contribution.paidDate
                            ? new Date(contribution.paidDate).toLocaleDateString()
                            : new Date(contribution.dueDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${contributionStatusColors[contribution.status]}`}>
                            {contribution.status}
                            {contribution.isLate && ' (Late)'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Financial Summary */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Financial Summary
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Total Collected</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {circle.currency} {circle.totalCollected.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Total Disbursed</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {circle.currency} {circle.totalDisbursed.toLocaleString()}
                  </span>
                </div>
                <div className="h-px bg-slate-200 dark:bg-slate-700" />
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Emergency Fund</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    {circle.currency} {circle.emergencyFundBalance.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {circle.emergencyFundRate}% of contributions go to emergency fund
                </p>
              </div>
            </div>

            {/* My Participation */}
            {currentParticipant && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  My Participation
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Payout Position</span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      #{currentParticipant.payoutPosition || 'TBD'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Total Contributed</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {circle.currency} {currentParticipant.totalContributed.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Payout Received</span>
                    {currentParticipant.payoutReceived ? (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Yes
                      </span>
                    ) : (
                      <span className="text-slate-500 dark:text-slate-400">Pending</span>
                    )}
                  </div>
                  <div className="h-px bg-slate-200 dark:bg-slate-700" />
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Payment History</p>
                    <div className="flex gap-2">
                      <div className="flex-1 text-center p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                        <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                          {currentParticipant.paymentStats.onTime}
                        </p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">On Time</p>
                      </div>
                      <div className="flex-1 text-center p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                        <p className="text-lg font-semibold text-amber-600 dark:text-amber-400">
                          {currentParticipant.paymentStats.late}
                        </p>
                        <p className="text-xs text-amber-600 dark:text-amber-400">Late</p>
                      </div>
                      <div className="flex-1 text-center p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                        <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                          {currentParticipant.paymentStats.missed}
                        </p>
                        <p className="text-xs text-red-600 dark:text-red-400">Missed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Circle Settings */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Circle Settings
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Late Penalty</span>
                  <span className="text-slate-900 dark:text-white">
                    {circle.latePenaltyPercent}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Grace Period</span>
                  <span className="text-slate-900 dark:text-white">
                    {circle.gracePeriodDays} days
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Visibility</span>
                  <span className="text-slate-900 dark:text-white capitalize">
                    {circle.visibility.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Language</span>
                  <span className="text-slate-900 dark:text-white">
                    {circle.language}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Started</span>
                  <span className="text-slate-900 dark:text-white">
                    {new Date(circle.startDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Emergency Fund Interventions */}
            {emergencyFundInterventions.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Emergency Fund Activity
                </h2>
                <div className="space-y-3">
                  {emergencyFundInterventions.slice(0, 3).map((intervention) => (
                    <div
                      key={intervention.id}
                      className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-slate-900 dark:text-white">
                          {intervention.defaultingParticipantName}
                        </span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${interventionStatusColors[intervention.status]}`}>
                          {intervention.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Covered: {circle.currency} {intervention.coveredAmount.toLocaleString()}
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
                              style={{
                                width: `${((intervention.debtAmount - intervention.debtRemaining) / intervention.debtAmount) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
