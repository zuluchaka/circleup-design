import { useState, useMemo } from 'react'
import { Users, Search, UserPlus, Filter, Star, Crown, CheckCircle2 } from 'lucide-react'
import type { Circle, Participant, ParticipantStatus } from '@/../product/sections/rosca-circles/types'

interface CircleParticipantsProps {
  circle: Circle
  participants: Participant[]
  currentUserId: string
  canInvite?: boolean
  onBack?: () => void
  onInviteMembers?: () => void
  onViewParticipant?: (id: string) => void
}

type StatusFilter = 'all' | ParticipantStatus

const STATUS_COLORS: Record<ParticipantStatus, { bg: string; text: string; dot: string }> = {
  active: { bg: 'bg-emerald-50 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500' },
  suspended: { bg: 'bg-amber-50 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-500' },
  removed: { bg: 'bg-red-50 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', dot: 'bg-red-500' },
}

const statusFilters: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'removed', label: 'Removed' },
]

export function CircleParticipants({
  circle,
  participants,
  currentUserId,
  canInvite = false,
  onBack,
  onInviteMembers,
  onViewParticipant,
}: CircleParticipantsProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const activeCount = participants.filter(p => p.status === 'active').length
  const organizersCount = participants.filter(p => p.role === 'organizer').length
  const paidOutCount = participants.filter(p => p.payoutReceived).length

  const filteredParticipants = useMemo(() => {
    let list = statusFilter === 'all' ? participants : participants.filter(p => p.status === statusFilter)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(q))
    }
    // Sort: organizer first, then by payout position
    return [...list].sort((a, b) => {
      if (a.role === 'organizer' && b.role !== 'organizer') return -1
      if (b.role === 'organizer' && a.role !== 'organizer') return 1
      const aPos = a.payoutPosition ?? 999
      const bPos = b.payoutPosition ?? 999
      return aPos - bPos
    })
  }, [participants, statusFilter, searchQuery])

  const spotsLeft = circle.maxParticipants - participants.length

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
                  <Users className="w-6 h-6 text-indigo-500" />
                  Participants
                </h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {circle.name}
                </p>
              </div>
            </div>
            {canInvite && onInviteMembers && spotsLeft > 0 && (
              <button
                onClick={onInviteMembers}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
              >
                <UserPlus className="w-4 h-4" />
                Invite Members
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-4 gap-3">
            {[
              { label: 'Total', value: `${participants.length}/${circle.maxParticipants}`, color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' },
              { label: 'Active', value: activeCount, color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' },
              { label: 'Organizers', value: organizersCount, color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' },
              { label: 'Paid Out', value: paidOutCount, color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400' },
            ].map((stat) => (
              <div key={stat.label} className={`rounded-xl px-4 py-3 ${stat.color}`}>
                <div className="text-2xl font-bold truncate">{stat.value}</div>
                <p className="text-sm font-medium mt-0.5 opacity-80">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Search + Filters */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search participants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-500"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setStatusFilter(f.value)}
                  className={`flex-shrink-0 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                    statusFilter === f.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredParticipants.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              {participants.length === 0 ? (
                <Users className="w-8 h-8 text-slate-400" />
              ) : (
                <Filter className="w-8 h-8 text-slate-400" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              {participants.length === 0 ? 'No participants yet' : 'No participants found'}
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {participants.length === 0
                ? 'Invite members to join this circle.'
                : 'Try adjusting your search or filters'}
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">
              {filteredParticipants.length} {filteredParticipants.length === 1 ? 'participant' : 'participants'}
              {statusFilter !== 'all' || searchQuery ? ' found' : ''}
              {spotsLeft > 0 && statusFilter === 'all' && !searchQuery && (
                <span> &middot; {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} left</span>
              )}
            </p>
            <div className="space-y-3">
              {filteredParticipants.map(participant => (
                <ParticipantCard
                  key={participant.id}
                  participant={participant}
                  circle={circle}
                  isYou={participant.userId === currentUserId}
                  onClick={() => onViewParticipant?.(participant.id)}
                  fmt={fmt}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

function ParticipantCard({
  participant,
  circle,
  isYou,
  onClick,
  fmt,
}: {
  participant: Participant
  circle: Circle
  isYou: boolean
  onClick?: () => void
  fmt: (n: number) => string
}) {
  const colors = STATUS_COLORS[participant.status] || STATUS_COLORS.active
  const isOrganizer = participant.role === 'organizer'
  const position = participant.payoutPosition || (isOrganizer ? 1 : null)

  return (
    <button
      onClick={onClick}
      className="w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors text-left"
    >
      <div className="p-4 flex items-center gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {participant.avatar ? (
            <img
              src={participant.avatar}
              alt={participant.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold text-lg">
              {(participant.name || '?').charAt(0)}
            </div>
          )}
          {isOrganizer && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
              <Crown className="w-3 h-3 text-white" />
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-slate-900 dark:text-white truncate">
              {participant.name}
            </p>
            {isYou && (
              <span className="text-xs text-indigo-600 dark:text-indigo-400 flex-shrink-0">(You)</span>
            )}
            {isOrganizer && (
              <span className="text-xs font-medium text-amber-700 dark:text-amber-400 flex-shrink-0">Organizer</span>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
            {position ? `Position #${position}` : 'Position TBD'}
            <span className="mx-1">&middot;</span>
            <span className="inline-flex items-center gap-0.5">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              {participant.trustScore}
            </span>
            <span className="mx-1">&middot;</span>
            <span>Contributed {fmt(participant.totalContributed)}</span>
          </p>
        </div>

        {/* Badges */}
        <div className="hidden sm:flex items-center gap-2">
          {participant.payoutReceived && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-3 h-3" />
              Paid Out
            </span>
          )}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${colors.bg} ${colors.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
            {participant.status}
          </span>
        </div>

        {/* Arrow */}
        <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

      {/* Mobile badges row */}
      <div className="sm:hidden px-4 pb-3 flex flex-wrap items-center gap-2">
        {participant.payoutReceived && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="w-3 h-3" />
            Paid Out
          </span>
        )}
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${colors.bg} ${colors.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
          {participant.status}
        </span>
      </div>

      {/* Payment stats footer */}
      {circle.status !== 'forming' && (
        <div className="px-4 pb-3 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span className="text-emerald-600 dark:text-emerald-400">
            {participant.paymentStats.onTime} on-time
          </span>
          {participant.paymentStats.late > 0 && (
            <span className="text-amber-600 dark:text-amber-400">
              {participant.paymentStats.late} late
            </span>
          )}
          {participant.paymentStats.missed > 0 && (
            <span className="text-red-600 dark:text-red-400">
              {participant.paymentStats.missed} missed
            </span>
          )}
        </div>
      )}
    </button>
  )
}
