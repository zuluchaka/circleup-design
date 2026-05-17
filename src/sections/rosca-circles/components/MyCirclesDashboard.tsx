import { useState, useMemo } from 'react'
import { CircleDollarSign, Search, Plus, Compass, Filter } from 'lucide-react'
import type {
  MyCirclesProps,
  CircleFrequency,
  CircleStatus,
  Circle,
  Participant,
} from '@/../product/sections/rosca-circles/types'

const frequencyLabels: Record<CircleFrequency, string> = {
  weekly: 'Weekly',
  bi_weekly: 'Bi-weekly',
  monthly: 'Monthly',
}

const statusColors: Record<CircleStatus, string> = {
  forming: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  paused: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400',
  completed: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

type StatusFilter = 'all' | CircleStatus

const statusFilters: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'forming', label: 'Forming' },
  { value: 'completed', label: 'Completed' },
]

export function MyCirclesDashboard({
  circles,
  participations,
  canCreate = false,
  onViewCircle,
  onMakeContribution,
  onCreate,
  onDiscoverCircles,
}: MyCirclesProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const getParticipation = (circleId: string) => {
    return participations.find((p) => p.circleId === circleId)
  }

  const activeCircles = circles.filter((c) => c.status === 'active')
  const completedCircles = circles.filter((c) => c.status === 'completed')

  const totalContributed = participations.reduce((sum, p) => sum + (p.totalContributed ?? 0), 0)
  const primaryCurrency = circles.length > 0 ? circles[0].currency : 'CHF'
  const upcomingPayouts = circles
    .filter((c) => c.status === 'active')
    .map((c) => {
      const participation = getParticipation(c.id)
      return participation && !participation.payoutReceived ? c : null
    })
    .filter(Boolean).length

  const totalFundsCollected = circles.reduce((sum, c) => sum + c.totalCollected, 0)

  const formatAmount = (amount: number, currency: string) =>
    `${currency} ${amount.toLocaleString()}`

  const filteredCircles = useMemo(() => {
    let list = statusFilter === 'all' ? circles : circles.filter(c => c.status === statusFilter)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.associationName?.toLowerCase().includes(q) ||
        c.organizerName?.toLowerCase().includes(q)
      )
    }
    return list
  }, [circles, statusFilter, searchQuery])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CircleDollarSign className="w-6 h-6 text-indigo-500" />
                My Circles
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {circles.length} {circles.length === 1 ? 'circle' : 'circles'} you belong to
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onDiscoverCircles}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                <Compass className="w-4 h-4" />
                <span className="hidden sm:inline">Discover</span>
              </button>
              {canCreate && (
                <button
                  onClick={onCreate}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Create Circle</span>
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: 'Active Circles', value: activeCircles.length, color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' },
              { label: 'Total Contributed', value: formatAmount(totalContributed, primaryCurrency), color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' },
              { label: 'Total Funds', value: formatAmount(totalFundsCollected, primaryCurrency), color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400' },
              { label: 'Upcoming Payouts', value: upcomingPayouts, color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' },
              { label: 'Completed', value: completedCircles.length, color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' },
            ].map((stat) => (
              <div key={stat.label} className={`rounded-xl px-4 py-3 ${stat.color}`}>
                <div className="text-2xl font-bold truncate">{stat.value}</div>
                <p className="text-sm font-medium mt-0.5 opacity-80">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search circles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-500"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {circles.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <CircleDollarSign className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No circles yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
              {canCreate
                ? 'Create your first savings circle or browse existing circles to join.'
                : 'Browse existing circles to join and start saving with your community.'}
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={onDiscoverCircles}
                className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                Browse Circles
              </button>
              {canCreate && (
                <button
                  onClick={onCreate}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
                >
                  Create Your Own
                </button>
              )}
            </div>
          </div>
        ) : filteredCircles.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Filter className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No circles found
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">
              {filteredCircles.length} {filteredCircles.length === 1 ? 'circle' : 'circles'}
              {statusFilter !== 'all' || searchQuery ? ' found' : ''}
            </p>
            <div className="space-y-3">
              {filteredCircles.map((circle) => (
                <CircleCard
                  key={circle.id}
                  circle={circle}
                  participation={getParticipation(circle.id)}
                  onView={() => onViewCircle?.(circle.id)}
                  onContribute={() => onMakeContribution?.(circle.id)}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

function CircleCard({ circle, participation, onView, onContribute }: {
  circle: Circle
  participation?: Participant
  onView: () => void
  onContribute: () => void
}) {
  const completedCycles = Math.max(0, circle.currentCycle - 1)
  const progress = circle.duration > 0 ? Math.round((completedCycles / circle.duration) * 100) : 0
  const spotsLeft = (circle.maxParticipants || 0) - (circle.currentParticipants || 0)

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
      <div className="p-4 flex items-center gap-4">
        {circle.status === 'active' && circle.duration > 0 ? (
          <div className="relative w-12 h-12 flex-shrink-0">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none"
                className="text-slate-200 dark:text-slate-700" />
              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none"
                strokeDasharray={`${progress * 1.257} 125.7`}
                className="text-indigo-600 dark:text-indigo-400" strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-900 dark:text-white">
              {circle.currentCycle}/{circle.duration}
            </span>
          </div>
        ) : (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
            circle.status === 'forming' ? 'bg-amber-50 dark:bg-amber-900/20' :
            circle.status === 'completed' ? 'bg-slate-100 dark:bg-slate-800' :
            'bg-emerald-50 dark:bg-emerald-900/20'
          }`}>
            <CircleDollarSign className={`w-6 h-6 ${
              circle.status === 'forming' ? 'text-amber-600 dark:text-amber-400' :
              circle.status === 'completed' ? 'text-slate-400' :
              'text-emerald-600 dark:text-emerald-400'
            }`} />
          </div>
        )}

        <button onClick={onView} className="flex-1 min-w-0 text-left">
          <p className="font-medium text-slate-900 dark:text-white truncate">{circle.name}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
            {circle.associationName && <span>{circle.associationName} &middot; </span>}
            {circle.currency} {circle.contributionAmount.toLocaleString()} {frequencyLabels[circle.frequency]}
            <span> &middot; {circle.currentParticipants}/{circle.maxParticipants} members</span>
          </p>
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[circle.status]}`}>
            {circle.status}
          </span>
          {participation && circle.status === 'active' && (
            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400">
              #{participation.payoutPosition || 'TBD'}
            </span>
          )}
          {participation?.payoutReceived && (
            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400">
              Paid Out
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {circle.status === 'active' && circle.nextContributionDue && (
            <button
              onClick={(e) => { e.stopPropagation(); onContribute() }}
              className="hidden sm:inline-flex px-3 py-1.5 text-xs font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors"
            >
              Pay Now
            </button>
          )}
          <button onClick={onView} className="p-1 text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {circle.status === 'active' && circle.duration > 0 && (
        <div className="px-4 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
            </div>
            <span className="text-[10px] text-slate-400 whitespace-nowrap">
              Cycle {completedCycles}/{circle.duration}
            </span>
          </div>
        </div>
      )}

      {circle.status === 'forming' && (
        <div className="px-4 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full transition-all"
                style={{ width: `${(circle.currentParticipants / circle.maxParticipants) * 100}%` }} />
            </div>
            <span className="text-[10px] text-slate-400 whitespace-nowrap">
              {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Full'}
            </span>
          </div>
        </div>
      )}

      {circle.status === 'active' && circle.nextContributionDue && (
        <div className="sm:hidden px-4 pb-3">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <div>
              <p className="text-[10px] text-amber-600 dark:text-amber-400 uppercase font-medium">Next Payment</p>
              <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                {new Date(circle.nextContributionDue).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={onContribute}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium transition-colors"
            >
              Pay Now
            </button>
          </div>
        </div>
      )}

      <div className="sm:hidden px-4 pb-3 flex flex-wrap items-center gap-2">
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[circle.status]}`}>
          {circle.status}
        </span>
        {participation && circle.status === 'active' && (
          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400">
            Position #{participation.payoutPosition || 'TBD'}
          </span>
        )}
        {participation?.payoutReceived && (
          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400">
            Paid Out
          </span>
        )}
        {participation && circle.status === 'completed' && (
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Contributed: {circle.currency} {(participation.totalContributed ?? 0).toLocaleString()}
          </span>
        )}
      </div>
    </div>
  )
}
