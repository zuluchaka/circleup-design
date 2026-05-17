import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import type { Circle } from '@/../product/sections/rosca-circles/types'
import {
  Search,
  CircleDollarSign,
  Calendar,
  Clock,
  Plus,
  Filter,
} from 'lucide-react'

interface AssociationCirclesViewProps {
  associationId: string
  associationName?: string
  onViewCircle?: (circleId: string) => void
  onBack?: () => void
  canManage?: boolean
  onCreateCircle?: () => void
}

type StatusFilter = 'all' | 'active' | 'forming' | 'completed'

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  active: { bg: 'bg-emerald-50 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500' },
  forming: { bg: 'bg-amber-50 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-500' },
  completed: { bg: 'bg-slate-100 dark:bg-slate-700/50', text: 'text-slate-600 dark:text-slate-300', dot: 'bg-slate-400' },
  cancelled: { bg: 'bg-red-50 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', dot: 'bg-red-500' },
}

const FREQUENCY_LABELS: Record<string, string> = {
  weekly: 'Weekly',
  bi_weekly: 'Bi-weekly',
  monthly: 'Monthly',
}

const statusFilters: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'forming', label: 'Forming' },
  { value: 'completed', label: 'Completed' },
]

export default function AssociationCirclesView({
  associationId,
  associationName,
  onViewCircle,
  onBack,
  canManage,
  onCreateCircle,
}: AssociationCirclesViewProps) {
  const { token } = useAuth()
  const [circles, setCircles] = useState<Circle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const fetchCircles = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/v1/associations/${associationId}/circles`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to load circles')
      const json = await res.json()
      setCircles(json.data?.circles || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load circles')
    } finally {
      setLoading(false)
    }
  }, [token, associationId])

  useEffect(() => {
    fetchCircles()
  }, [fetchCircles])

  const activeCircles = circles.filter(c => c.status === 'active')
  const formingCircles = circles.filter(c => c.status === 'forming')
  const completedCircles = circles.filter(c => c.status === 'completed')
  const totalMembers = circles.reduce((sum, c) => sum + (c.currentParticipants || 0), 0)
  const totalCollected = circles.reduce((sum, c) => sum + (c.totalCollected || 0), 0)
  const currency = circles[0]?.currency || 'CHF'

  const fmt = (amount: number) =>
    `${currency} ${amount.toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  const fmtDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const filteredCircles = (() => {
    let list = statusFilter === 'all' ? circles : circles.filter(c => c.status === statusFilter)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.organizerName?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
      )
    }
    return list
  })()

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
                  Circles
                </h1>
                {associationName && (
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {associationName}
                  </p>
                )}
              </div>
            </div>
            {canManage && onCreateCircle && (
              <button
                onClick={onCreateCircle}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                New Circle
              </button>
            )}
          </div>

          {/* Stats */}
          {!loading && (
            <div className="mt-6 grid grid-cols-4 gap-3">
              {[
                { label: 'Total', value: circles.length, color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' },
                { label: 'Active', value: activeCircles.length, color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' },
                { label: 'Forming', value: formingCircles.length, color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' },
                { label: 'Members', value: totalMembers, color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400' },
              ].map((stat) => (
                <div key={stat.label} className={`rounded-xl px-4 py-3 ${stat.color}`}>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs font-medium mt-0.5 opacity-80">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Search + Filters */}
          {!loading && (
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
          )}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
            <button onClick={fetchCircles} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium">Retry</button>
          </div>
        ) : filteredCircles.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              {circles.length === 0 ? (
                <CircleDollarSign className="w-8 h-8 text-slate-400" />
              ) : (
                <Filter className="w-8 h-8 text-slate-400" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              {circles.length === 0 ? 'No circles yet' : 'No circles found'}
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {circles.length === 0
                ? 'Create a circle to get started.'
                : 'Try adjusting your search or filters'}
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">
              {filteredCircles.length} {filteredCircles.length === 1 ? 'circle' : 'circles'}
              {statusFilter !== 'all' || searchQuery ? ' found' : ''}
              {totalCollected > 0 && statusFilter === 'all' && !searchQuery && (
                <span> &middot; {fmt(totalCollected)} collected</span>
              )}
            </p>
            <div className="space-y-3">
              {filteredCircles.map(circle => (
                <CircleCard key={circle.id} circle={circle} onClick={() => onViewCircle?.(circle.id)} fmt={fmt} fmtDate={fmtDate} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

function CircleCard({ circle, onClick, fmt, fmtDate }: {
  circle: Circle
  onClick?: () => void
  fmt: (n: number) => string
  fmtDate: (s: string | null) => string
}) {
  const colors = STATUS_COLORS[circle.status] || STATUS_COLORS.active
  const progress = circle.duration > 0 ? Math.round((circle.currentCycle / circle.duration) * 100) : 0
  const spotsLeft = (circle.maxParticipants || 0) - (circle.currentParticipants || 0)

  return (
    <button
      onClick={onClick}
      className="w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors text-left"
    >
      <div className="p-4 flex items-center gap-4">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colors.bg}`}>
          <CircleDollarSign className={`w-6 h-6 ${colors.text}`} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-slate-900 dark:text-white truncate">{circle.name}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
            {fmt(circle.contributionAmount)} {FREQUENCY_LABELS[circle.frequency] || circle.frequency}
            <span> &middot; {circle.currentParticipants}/{circle.maxParticipants} members</span>
            {circle.organizerName && <span> &middot; {circle.organizerName}</span>}
          </p>
        </div>

        {/* Badges */}
        <div className="hidden sm:flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${colors.bg} ${colors.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
            {circle.status}
          </span>
          {circle.totalCollected > 0 && (
            <span className="text-sm font-semibold font-mono text-emerald-600 dark:text-emerald-400">
              {fmt(circle.totalCollected)}
            </span>
          )}
        </div>

        {/* Arrow */}
        <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

      {/* Progress bar for active circles */}
      {circle.status === 'active' && circle.duration > 0 && (
        <div className="px-4 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
            </div>
            <span className="text-[10px] text-slate-400 whitespace-nowrap">Cycle {circle.currentCycle}/{circle.duration}</span>
          </div>
        </div>
      )}

      {/* Mobile badges + extra info row */}
      <div className="sm:hidden px-4 pb-3 flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${colors.bg} ${colors.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
          {circle.status}
        </span>
        {circle.totalCollected > 0 && (
          <span className="text-xs font-semibold font-mono text-emerald-600 dark:text-emerald-400">
            {fmt(circle.totalCollected)}
          </span>
        )}
        {spotsLeft > 0 && circle.status === 'forming' && (
          <span className="text-xs text-amber-600 dark:text-amber-400">{spotsLeft} spots left</span>
        )}
      </div>

      {/* Date info */}
      {(circle.startDate || circle.nextContributionDue) && (
        <div className="hidden sm:flex px-4 pb-3 items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
          {circle.startDate && (
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Started {fmtDate(circle.startDate)}</span>
          )}
          {circle.nextContributionDue && (
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Next due {fmtDate(circle.nextContributionDue)}</span>
          )}
          {spotsLeft > 0 && circle.status === 'forming' && (
            <span className="text-amber-600 dark:text-amber-400">{spotsLeft} spots left</span>
          )}
        </div>
      )}
    </button>
  )
}
