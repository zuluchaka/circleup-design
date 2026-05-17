import React from 'react'
import type {
  Committee,
  CommitteeMember,
  CommitteeDirectoryProps,
  CommitteeStatus,
  CommitteeRole,
} from '../types'

// Helper functions
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function getStatusConfig(status: CommitteeStatus): { label: string; className: string } {
  const configs: Record<CommitteeStatus, { label: string; className: string }> = {
    active: { label: 'Active', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
    inactive: { label: 'Inactive', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
    dissolved: { label: 'Dissolved', className: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400' },
  }
  return configs[status]
}

function getRoleConfig(role: CommitteeRole): { label: string; className: string } {
  const configs: Record<CommitteeRole, { label: string; className: string }> = {
    chair: { label: 'Chair', className: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400' },
    vice_chair: { label: 'Vice Chair', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
    member: { label: 'Member', className: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300' },
  }
  return configs[role]
}

// Sub-components
function StatusBadge({ status }: { status: CommitteeStatus }) {
  const config = getStatusConfig(status)
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}

function RoleBadge({ role }: { role: CommitteeRole }) {
  const config = getRoleConfig(role)
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}

function CommitteeCard({
  committee,
  members,
  onView,
  onJoinRequest,
}: {
  committee: Committee
  members: CommitteeMember[]
  onView?: () => void
  onJoinRequest?: () => void
}) {
  const committeeMembers = members.filter(m => m.committeeId === committee.id)

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{committee.name}</h3>
              <StatusBadge status={committee.status} />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
              {committee.description}
            </p>
          </div>
          <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>

        {/* Leadership */}
        <div className="mb-4">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Leadership</p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-sm font-medium text-indigo-700 dark:text-indigo-400">
                {committee.chairName.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{committee.chairName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Chair</p>
              </div>
            </div>
            {committee.viceChairName && (
              <>
                <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-sm font-medium text-purple-700 dark:text-purple-400">
                    {committee.viceChairName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{committee.viceChairName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Vice Chair</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-slate-200 dark:border-slate-700 mb-4">
          <div className="text-center">
            <p className="text-xl font-semibold text-slate-900 dark:text-white">{committee.memberCount}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Members</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-semibold text-slate-900 dark:text-white">{committee.documentsCount}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Documents</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatDate(committee.nextMeetingDate)}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Next Meeting</p>
          </div>
        </div>

        {/* Meeting Schedule */}
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{committee.meetingSchedule}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onView}
            className="flex-1 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
          >
            View Details
          </button>
          {committee.isOpen && committee.status === 'active' && (
            <button
              onClick={onJoinRequest}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Request to Join
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function CommitteeDetailView({
  committee,
  members,
  onClose,
  onJoinRequest,
}: {
  committee: Committee
  members: CommitteeMember[]
  onClose: () => void
  onJoinRequest?: () => void
}) {
  const committeeMembers = members.filter(m => m.committeeId === committee.id)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{committee.name}</h2>
            <StatusBadge status={committee.status} />
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">About</h3>
            <p className="text-slate-600 dark:text-slate-400">{committee.description}</p>
          </div>

          {/* Meeting Info */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Meeting Schedule</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Schedule</p>
                  <p className="font-medium text-slate-900 dark:text-white">{committee.meetingSchedule}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Next Meeting</p>
                  <p className="font-medium text-slate-900 dark:text-white">{formatDate(committee.nextMeetingDate)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Members */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Members ({committeeMembers.length})
            </h3>
            <div className="space-y-2">
              {committeeMembers.map(member => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg"
                >
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-sm font-medium text-slate-600 dark:text-slate-400">
                    {member.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 dark:text-white truncate">{member.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Joined {formatDate(member.joinedAt)}
                    </p>
                  </div>
                  <RoleBadge role={member.role} />
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Documents ({committee.documentsCount})
            </h3>
            {committee.documentsCount > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">Meeting Minutes</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Last updated Jan 15, 2024</p>
                  </div>
                  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
                No documents available
              </p>
            )}
          </div>
        </div>
        {committee.isOpen && committee.status === 'active' && (
          <div className="sticky bottom-0 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 px-6 py-4">
            <button
              onClick={onJoinRequest}
              className="w-full px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Request to Join Committee
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function CreateCommitteeModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Create Committee</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Committee Name
            </label>
            <input
              type="text"
              placeholder="e.g., Finance Committee"
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe the purpose and responsibilities of this committee..."
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Chair
            </label>
            <input
              type="text"
              placeholder="Search for a member..."
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Meeting Schedule
            </label>
            <input
              type="text"
              placeholder="e.g., First Monday of each month at 7 PM"
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded border-slate-300 dark:border-slate-600 focus:ring-indigo-500" />
              <span className="text-sm text-slate-700 dark:text-slate-300">Allow members to request to join</span>
            </label>
          </div>
        </div>
        <div className="sticky bottom-0 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
            Create Committee
          </button>
        </div>
      </div>
    </div>
  )
}

// Main component
export function CommitteeDirectory({
  committees,
  committeeMembers,
  onRequestJoin,
  onViewCommittee,
  onCreateCommittee,
  onEditCommittee,
}: CommitteeDirectoryProps) {
  const [selectedCommittee, setSelectedCommittee] = React.useState<Committee | null>(null)
  const [showCreateModal, setShowCreateModal] = React.useState(false)
  const [filterStatus, setFilterStatus] = React.useState<CommitteeStatus | 'all'>('all')

  const filteredCommittees = committees.filter(committee => {
    if (filterStatus !== 'all' && committee.status !== filterStatus) return false
    return true
  })

  const activeCommittees = committees.filter(c => c.status === 'active')
  const totalMembers = committees.reduce((sum, c) => sum + c.memberCount, 0)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Committee Directory</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Browse and manage committees within your organization
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Committee
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Committees</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{committees.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Active</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{activeCommittees.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Members</p>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{totalMembers}</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit mb-6">
          {(['all', 'active', 'inactive'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize ${
                filterStatus === status
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {status} ({status === 'all'
                ? committees.length
                : committees.filter(c => c.status === status).length
              })
            </button>
          ))}
        </div>

        {/* Committee Grid */}
        {filteredCommittees.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCommittees.map(committee => (
              <CommitteeCard
                key={committee.id}
                committee={committee}
                members={committeeMembers}
                onView={() => {
                  setSelectedCommittee(committee)
                  onViewCommittee?.(committee.id)
                }}
                onJoinRequest={() => onRequestJoin?.(committee.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No Committees Found</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              {filterStatus !== 'all'
                ? 'No committees match your current filter.'
                : 'Create your first committee to organize member groups.'}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Committee
            </button>
          </div>
        )}
      </div>

      {/* Committee Detail Modal */}
      {selectedCommittee && (
        <CommitteeDetailView
          committee={selectedCommittee}
          members={committeeMembers}
          onClose={() => setSelectedCommittee(null)}
          onJoinRequest={() => onRequestJoin?.(selectedCommittee.id)}
        />
      )}

      {/* Create Committee Modal */}
      {showCreateModal && <CreateCommitteeModal onClose={() => setShowCreateModal(false)} />}
    </div>
  )
}
