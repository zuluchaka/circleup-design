import { useState, useMemo } from 'react'
import type { MemberDirectoryProps, MemberRole, MemberStatus } from '../types'
import { TrustScoreBadge } from './TrustScoreBadge'
import { RoleBadge } from './RoleBadge'
import { StatusBadge } from './StatusBadge'
import { Search, UserPlus, MoreVertical, ChevronDown, Users, Filter, ArrowUpDown } from 'lucide-react'

export function MemberDirectory({
  members,
  trustScores,
  onViewMember,
  onEditRole,
  onSuspendMember,
  onRemoveMember,
  onInviteMembers
}: MemberDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<MemberRole | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<MemberStatus | 'all'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'score' | 'joined'>('name')
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  // Create a map for quick trust score lookup
  const scoreMap = useMemo(() => {
    const map = new Map<string, { score: number; trend: 'up' | 'down' | 'stable' }>()
    trustScores.forEach(ts => map.set(ts.memberId, { score: ts.score, trend: ts.trend }))
    return map
  }, [trustScores])

  // Filter and sort members
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
                  <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                Member Directory
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {members.length} members in this association
              </p>
            </div>
            <button
              onClick={() => onInviteMembers?.()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              Invite Members
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              {/* Role Filter */}
              <div className="relative">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as MemberRole | 'all')}
                  className="appearance-none pl-3 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Roles</option>
                  <option value="president">President</option>
                  <option value="treasurer">Treasurer</option>
                  <option value="secretary">Secretary</option>
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as MemberStatus | 'all')}
                  className="appearance-none pl-3 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'score' | 'joined')}
                  className="appearance-none pl-3 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="name">Sort by Name</option>
                  <option value="score">Sort by Trust Score</option>
                  <option value="joined">Sort by Join Date</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Member List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {/* Table Header - Desktop */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <div className="col-span-4">Member</div>
            <div className="col-span-2">Trust Score</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2">Joined</div>
            <div className="col-span-1"></div>
          </div>

          {/* Members */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredMembers.map((member) => {
              const trustData = scoreMap.get(member.id)

              return (
                <div
                  key={member.id}
                  className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  {/* Desktop Row */}
                  <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-4 items-center">
                    {/* Member Info */}
                    <div className="col-span-4 flex items-center gap-3">
                      <button
                        onClick={() => onViewMember?.(member.id)}
                        className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity"
                      >
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-slate-800"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold">
                            {member.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{member.name}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{member.email}</p>
                        </div>
                      </button>
                    </div>

                    {/* Trust Score */}
                    <div className="col-span-2">
                      {trustData && (
                        <TrustScoreBadge score={trustData.score} trend={trustData.trend} />
                      )}
                    </div>

                    {/* Role */}
                    <div className="col-span-2">
                      <RoleBadge role={member.role} />
                    </div>

                    {/* Status */}
                    <div className="col-span-1">
                      <StatusBadge status={member.status} />
                    </div>

                    {/* Joined */}
                    <div className="col-span-2 text-sm text-slate-600 dark:text-slate-400">
                      {formatDate(member.joinedAt)}
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex justify-end relative">
                      <button
                        onClick={() => setActiveMenu(activeMenu === member.id ? null : member.id)}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {activeMenu === member.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-10">
                          <button
                            onClick={() => {
                              onViewMember?.(member.id)
                              setActiveMenu(null)
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                          >
                            View Profile
                          </button>
                          {member.status === 'active' && (
                            <button
                              onClick={() => {
                                onSuspendMember?.(member.id)
                                setActiveMenu(null)
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-amber-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                              Suspend Member
                            </button>
                          )}
                          <button
                            onClick={() => {
                              onRemoveMember?.(member.id)
                              setActiveMenu(null)
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                          >
                            Remove Member
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mobile Card */}
                  <div className="lg:hidden p-4">
                    <div className="flex items-start justify-between gap-3">
                      <button
                        onClick={() => onViewMember?.(member.id)}
                        className="flex items-center gap-3 text-left"
                      >
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold text-lg">
                            {member.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{member.name}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{member.email}</p>
                        </div>
                      </button>
                      {trustData && (
                        <TrustScoreBadge score={trustData.score} trend={trustData.trend} size="sm" />
                      )}
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <RoleBadge role={member.role} size="sm" />
                      <StatusBadge status={member.status} />
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Joined {formatDate(member.joinedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Empty State */}
          {filteredMembers.length === 0 && (
            <div className="px-6 py-12 text-center">
              <Filter className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
              <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">No members found</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
