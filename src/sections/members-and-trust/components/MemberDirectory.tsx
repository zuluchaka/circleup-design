import { useState, useMemo } from 'react'
import type { MemberDirectoryProps, MemberRole, MemberStatus } from '@/../product/sections/members-and-trust/types'
import { TrustScoreBadge } from './TrustScoreBadge'
import { RoleBadge } from './RoleBadge'
import { StatusBadge } from './StatusBadge'
import { Search, UserPlus, MoreVertical, Users, Filter, ArrowUpDown } from 'lucide-react'

type RoleFilter = MemberRole | 'all'
type StatusFilter = MemberStatus | 'all'

const roleFilters: { value: RoleFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'president', label: 'President' },
  { value: 'treasurer', label: 'Treasurer' },
  { value: 'secretary', label: 'Secretary' },
  { value: 'admin', label: 'Admin' },
  { value: 'member', label: 'Member' },
]

const statusFilters: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'suspended', label: 'Suspended' },
]

export function MemberDirectory({
  members,
  trustScores,
  onViewMember,
  onEditRole: _onEditRole,
  onSuspendMember,
  onRemoveMember,
  onInviteMembers,
  onBack,
}: MemberDirectoryProps & { onBack?: () => void }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [sortBy, setSortBy] = useState<'name' | 'score' | 'joined'>('name')
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  const scoreMap = useMemo(() => {
    const map = new Map<string, { score: number; trend: 'up' | 'down' | 'stable' }>()
    trustScores.forEach(ts => map.set(ts.memberId, { score: ts.score, trend: ts.trend }))
    return map
  }, [trustScores])

  const filteredMembers = useMemo(() => {
    return members
      .filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             member.email.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesRole = roleFilter === 'all' || member.role === roleFilter
        const matchesStatus = statusFilter === 'all' || member.status === statusFilter
        return matchesSearch && matchesRole && matchesStatus
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'score':
            return (scoreMap.get(b.id)?.score ?? 0) - (scoreMap.get(a.id)?.score ?? 0)
          case 'joined':
            return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
          default:
            return a.name.localeCompare(b.name)
        }
      })
  }, [members, searchQuery, roleFilter, statusFilter, sortBy, scoreMap])

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const stats = useMemo(() => ({
    total: members.length,
    active: members.filter(m => m.status === 'active').length,
    pending: members.filter(m => m.status === 'pending').length,
    suspended: members.filter(m => m.status === 'suspended').length,
  }), [members])

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
                  Members
                </h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {members.length} members in this association
                </p>
              </div>
            </div>
            <button
              onClick={() => onInviteMembers?.()}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              Invite Members
            </button>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-4 gap-3">
            {[
              { label: 'Total', value: stats.total, color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' },
              { label: 'Active', value: stats.active, color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' },
              { label: 'Pending', value: stats.pending, color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' },
              { label: 'Suspended', value: stats.suspended, color: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' },
            ].map((stat) => (
              <div key={stat.label} className={`rounded-xl px-4 py-3 ${stat.color}`}>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs font-medium mt-0.5 opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Search + Filters */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-500"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
              {roleFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setRoleFilter(f.value)}
                  className={`flex-shrink-0 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                    roleFilter === f.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary filters row */}
          <div className="mt-3 flex items-center gap-3">
            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
              {statusFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setStatusFilter(f.value)}
                  className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    statusFilter === f.value
                      ? 'bg-slate-700 dark:bg-slate-200 text-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="ml-auto flex gap-2">
              {(['name', 'score', 'joined'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    sortBy === s
                      ? 'bg-slate-700 dark:bg-slate-200 text-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {s === 'name' && <ArrowUpDown className="w-3 h-3" />}
                  {s === 'name' ? 'Name' : s === 'score' ? 'Trust Score' : 'Joined'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Member List */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredMembers.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              {members.length === 0 ? (
                <Users className="w-8 h-8 text-slate-400" />
              ) : (
                <Filter className="w-8 h-8 text-slate-400" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              {members.length === 0 ? 'No members yet' : 'No members found'}
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {members.length === 0
                ? 'Invite members to get started.'
                : 'Try adjusting your search or filters'}
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">
              {filteredMembers.length} {filteredMembers.length === 1 ? 'member' : 'members'}
              {roleFilter !== 'all' || statusFilter !== 'all' || searchQuery ? ' found' : ''}
            </p>
            <div className="space-y-3">
              {filteredMembers.map((member) => {
                const trustData = scoreMap.get(member.id)

                return (
                  <div
                    key={member.id}
                    className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                  >
                    <div className="p-4 flex items-center gap-4">
                      {/* Avatar */}
                      <button
                        onClick={() => onViewMember?.(member.id)}
                        className="flex-shrink-0 hover:opacity-80 transition-opacity"
                      >
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-slate-800"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold text-lg">
                            {(member.name || '?').charAt(0)}
                          </div>
                        )}
                      </button>

                      {/* Info */}
                      <button
                        onClick={() => onViewMember?.(member.id)}
                        className="flex-1 min-w-0 text-left"
                      >
                        <p className="font-medium text-slate-900 dark:text-white truncate">{member.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{member.email}</p>
                      </button>

                      {/* Badges */}
                      <div className="hidden sm:flex items-center gap-2">
                        {trustData && (
                          <TrustScoreBadge score={trustData.score} trend={trustData.trend} size="sm" />
                        )}
                        <RoleBadge role={member.role} size="sm" />
                        <StatusBadge status={member.status} />
                      </div>

                      {/* Joined date */}
                      <span className="hidden md:block text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                        {formatDate(member.joinedAt)}
                      </span>

                      {/* Actions */}
                      <div className="relative flex-shrink-0">
                        <button
                          onClick={() => setActiveMenu(activeMenu === member.id ? null : member.id)}
                          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {activeMenu === member.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-10">
                            <button
                              onClick={() => { onViewMember?.(member.id); setActiveMenu(null) }}
                              className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                              View Profile
                            </button>
                            {member.status === 'active' && (
                              <button
                                onClick={() => { onSuspendMember?.(member.id); setActiveMenu(null) }}
                                className="w-full px-4 py-2 text-left text-sm text-amber-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                              >
                                Suspend Member
                              </button>
                            )}
                            <button
                              onClick={() => { onRemoveMember?.(member.id); setActiveMenu(null) }}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                              Remove Member
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Mobile badges row */}
                    <div className="sm:hidden px-4 pb-3 flex flex-wrap items-center gap-2">
                      {trustData && (
                        <TrustScoreBadge score={trustData.score} trend={trustData.trend} size="sm" />
                      )}
                      <RoleBadge role={member.role} size="sm" />
                      <StatusBadge status={member.status} />
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        Joined {formatDate(member.joinedAt)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
