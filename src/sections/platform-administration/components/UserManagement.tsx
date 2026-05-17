import { Search, Shield, Ban, CheckCircle2, AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import type { UserManagementProps } from '@/../product/sections/platform-administration/types'

export type { UserManagementProps }

// Mock user data for the interface
const mockUsers = [
  {
    id: 'user-001',
    name: 'Elena Rossi',
    email: 'elena.rossi@example.com',
    avatar: 'https://i.pravatar.cc/150?u=elena',
    status: 'active' as const,
    trustScore: 92,
    joinedAt: '2025-03-15',
    totalContributions: 12500,
    circlesCount: 3,
    lastActive: '2026-01-13T09:30:00Z',
  },
  {
    id: 'user-002',
    name: 'Thomas Keller',
    email: 'thomas.keller@example.com',
    avatar: 'https://i.pravatar.cc/150?u=thomas',
    status: 'suspended' as const,
    trustScore: 45,
    joinedAt: '2025-11-22',
    totalContributions: 3200,
    circlesCount: 1,
    lastActive: '2026-01-10T14:20:00Z',
  },
  {
    id: 'user-003',
    name: 'Maria Santos',
    email: 'maria.santos@example.com',
    avatar: 'https://i.pravatar.cc/150?u=maria',
    status: 'active' as const,
    trustScore: 88,
    joinedAt: '2025-01-08',
    totalContributions: 24000,
    circlesCount: 5,
    lastActive: '2026-01-13T11:15:00Z',
  },
  {
    id: 'user-004',
    name: 'Lucas Müller',
    email: 'lucas.muller@example.com',
    avatar: 'https://i.pravatar.cc/150?u=lucas',
    status: 'pending_verification' as const,
    trustScore: 0,
    joinedAt: '2026-01-12',
    totalContributions: 0,
    circlesCount: 0,
    lastActive: '2026-01-12T08:00:00Z',
  },
]

export function UserManagement({ onSearch, onUserSelect, onUserAction }: UserManagementProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'pending_verification'>('all')

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch?.(query)
  }

  const handleUserClick = (user: typeof mockUsers[0]) => {
    setSelectedUser(user)
    onUserSelect?.(user.id)
  }

  const handleAction = (action: string) => {
    if (selectedUser) {
      onUserAction?.(selectedUser.id, action)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Search and manage platform users</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filters */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'active', 'suspended', 'pending_verification'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status as any)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User List */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="font-semibold text-slate-900 dark:text-white">
                {filteredUsers.length} Users Found
              </h2>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleUserClick(user)}
                  className={`w-full px-5 py-4 text-left transition-colors ${
                    selectedUser?.id === user.id
                      ? 'bg-indigo-50 dark:bg-indigo-900/20'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900 dark:text-white truncate">
                          {user.name}
                        </p>
                        {user.status === 'active' && user.trustScore > 80 && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        )}
                        {user.status === 'suspended' && (
                          <Ban className="h-4 w-4 text-red-500" />
                        )}
                        {user.status === 'pending_verification' && (
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                        {user.email}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                        <span>Trust: {user.trustScore}%</span>
                        <span>{user.circlesCount} circles</span>
                        <span>CHF {user.totalContributions.toLocaleString()}</span>
                      </div>
                    </div>
                    <div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : user.status === 'suspended'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>
                        {user.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* User Details Panel */}
          <div className="space-y-6">
            {selectedUser ? (
              <>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                  <div className="text-center">
                    <img
                      src={selectedUser.avatar}
                      alt={selectedUser.name}
                      className="w-20 h-20 rounded-full mx-auto mb-4"
                    />
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                      {selectedUser.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {selectedUser.email}
                    </p>
                    <div className="mt-4">
                      <div className="text-sm text-slate-500 mb-1">Trust Score</div>
                      <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                        {selectedUser.trustScore}%
                      </div>
                      <div className="mt-2 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            selectedUser.trustScore >= 80
                              ? 'bg-emerald-500'
                              : selectedUser.trustScore >= 50
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${selectedUser.trustScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Details</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Member Since</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {new Date(selectedUser.joinedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Contributions</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        CHF {selectedUser.totalContributions.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Active Circles</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {selectedUser.circlesCount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Last Active</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {new Date(selectedUser.lastActive).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Actions</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleAction('view_profile')}
                      className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                    >
                      View Full Profile
                    </button>
                    {selectedUser.status === 'active' && (
                      <button
                        onClick={() => handleAction('suspend')}
                        className="w-full px-4 py-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-sm font-medium"
                      >
                        Suspend Account
                      </button>
                    )}
                    {selectedUser.status === 'suspended' && (
                      <button
                        onClick={() => handleAction('reactivate')}
                        className="w-full px-4 py-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors text-sm font-medium"
                      >
                        Reactivate Account
                      </button>
                    )}
                    {selectedUser.status === 'pending_verification' && (
                      <button
                        onClick={() => handleAction('verify')}
                        className="w-full px-4 py-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors text-sm font-medium"
                      >
                        Verify Account
                      </button>
                    )}
                    <button
                      onClick={() => handleAction('view_transactions')}
                      className="w-full px-4 py-2 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
                    >
                      View Transactions
                    </button>
                    <button
                      onClick={() => handleAction('contact')}
                      className="w-full px-4 py-2 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
                    >
                      Contact User
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
                <Shield className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400">
                  Select a user to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
