import { useState, useEffect, useRef } from 'react'
import type { Member, MemberRole, MemberStatus } from '@/../product/sections/associations/types'
import { RoleBadge } from './RoleBadge'

export interface MemberDirectoryProps {
  members: Member[]
  currentUserRole: MemberRole
  onViewMember?: (id: string) => void
  onChangeMemberRole?: (memberId: string, newRole: MemberRole) => void
  onRemoveMember?: (id: string) => void
  onSuspendMember?: (id: string) => void
  onInviteMembers?: () => void
  onBack?: () => void
}

const statusConfig: Record<MemberStatus, { label: string; className: string }> = {
  active: {
    label: 'Active',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  pending: {
    label: 'Pending',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  suspended: {
    label: 'Suspended',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
  removed: {
    label: 'Removed',
    className: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  },
}

const roles: MemberRole[] = ['president', 'organizer', 'treasurer', 'secretary', 'member']

export function MemberDirectory({
  members,
  currentUserRole,
  onViewMember,
  onChangeMemberRole,
  onRemoveMember,
  onSuspendMember,
  onInviteMembers,
  onBack,
}: MemberDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<MemberRole | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<MemberStatus | 'all'>('all')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [confirmAction, setConfirmAction] = useState<{
    type: 'suspend' | 'remove'
    memberId: string
    memberName: string
  } | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // L18: Click-outside handler to close dropdown menu
  useEffect(() => {
    if (!openMenuId) return
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openMenuId])

  const isAdmin = currentUserRole === 'president' || currentUserRole === 'organizer'
  const canManageRoles = currentUserRole === 'president'

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'all' || member.role === roleFilter
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const handleConfirmAction = () => {
    if (!confirmAction) return
    if (confirmAction.type === 'suspend') {
      onSuspendMember?.(confirmAction.memberId)
    } else if (confirmAction.type === 'remove') {
      onRemoveMember?.(confirmAction.memberId)
    }
    setConfirmAction(null)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* L9: Confirmation Dialog */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              {confirmAction.type === 'suspend' ? 'Suspend Member' : 'Remove Member'}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              {confirmAction.type === 'suspend'
                ? `Are you sure you want to suspend ${confirmAction.memberName}? They will lose access to the association until reinstated.`
                : `Are you sure you want to remove ${confirmAction.memberName}? This action cannot be easily undone.`
              }
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                  confirmAction.type === 'suspend'
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {confirmAction.type === 'suspend' ? 'Suspend' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Members
              </h1>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                {members.length} {members.length === 1 ? 'member' : 'members'} in this association
              </p>
            </div>
            {isAdmin && (
              <button
                onClick={onInviteMembers}
                className="px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/25"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Invite Members
              </button>
            )}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-500"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as MemberRole | 'all')}
              className="px-4 py-2.5 text-sm text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Roles</option>
              {roles.map((role) => (
                <option key={role} value={role} className="capitalize">
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as MemberStatus | 'all')}
              className="px-4 py-2.5 text-sm text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </header>

      {/* Member List */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredMembers.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No members found
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider">
                      Dues Paid Until
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredMembers.map((member) => (
                    <tr
                      key={member.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <button
                          onClick={() => onViewMember?.(member.id)}
                          className="flex items-center gap-3 text-left hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                          {member.avatarUrl ? (
                            <img
                              src={member.avatarUrl}
                              alt=""
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 font-medium">
                              {member.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">
                              {member.name}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-500">
                              {member.email}
                            </p>
                          </div>
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        {canManageRoles && member.role !== 'president' ? (
                          <select
                            value={member.role}
                            onChange={(e) =>
                              onChangeMemberRole?.(member.id, e.target.value as MemberRole)
                            }
                            className="px-3 py-1.5 text-sm bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                          >
                            {roles.filter((r) => r !== 'president').map((role) => (
                              <option key={role} value={role}>
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <RoleBadge role={member.role} />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                            statusConfig[member.status].className
                          }`}
                        >
                          {statusConfig[member.status].label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {formatDate(member.joinedAt)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {member.duesPaidUntil ? formatDate(member.duesPaidUntil) : '—'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isAdmin && member.role !== 'president' && (
                          <div className="relative" ref={openMenuId === member.id ? menuRef : undefined}>
                            <button
                              onClick={() =>
                                setOpenMenuId(openMenuId === member.id ? null : member.id)
                              }
                              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                              </svg>
                            </button>

                            {openMenuId === member.id && (
                              <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-10">
                                <button
                                  onClick={() => {
                                    onViewMember?.(member.id)
                                    setOpenMenuId(null)
                                  }}
                                  className="w-full px-4 py-2 text-sm text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                >
                                  View Profile
                                </button>
                                {member.status === 'active' && (
                                  <button
                                    onClick={() => {
                                      setConfirmAction({ type: 'suspend', memberId: member.id, memberName: member.name })
                                      setOpenMenuId(null)
                                    }}
                                    className="w-full px-4 py-2 text-sm text-left text-amber-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                                  >
                                    Suspend Member
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    setConfirmAction({ type: 'remove', memberId: member.id, memberName: member.name })
                                    setOpenMenuId(null)
                                  }}
                                  className="w-full px-4 py-2 text-sm text-left text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                                >
                                  Remove Member
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile List */}
            <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {member.avatarUrl ? (
                      <img
                        src={member.avatarUrl}
                        alt=""
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 font-medium text-lg">
                        {member.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <button
                            onClick={() => onViewMember?.(member.id)}
                            className="font-medium text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          >
                            {member.name}
                          </button>
                          <p className="text-sm text-slate-500 dark:text-slate-500 truncate">
                            {member.email}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <RoleBadge role={member.role} />
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                              statusConfig[member.status].className
                            }`}
                          >
                            {statusConfig[member.status].label}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500">
                        <span>Joined {formatDate(member.joinedAt)}</span>
                        {member.duesPaidUntil && (
                          <span>Dues until {formatDate(member.duesPaidUntil)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
