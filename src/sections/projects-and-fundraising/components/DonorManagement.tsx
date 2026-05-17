import { useState } from 'react'
import type { DonorManagementProps, DonorTier } from '@/../product/sections/projects-and-fundraising/types'

const tierConfig: Record<DonorTier, { label: string; icon: string; color: string; bgColor: string }> = {
  bronze: {
    label: 'Bronze',
    icon: '🥉',
    color: 'text-amber-700 dark:text-amber-500',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
  },
  silver: {
    label: 'Silver',
    icon: '🥈',
    color: 'text-slate-600 dark:text-slate-400',
    bgColor: 'bg-slate-200 dark:bg-slate-700',
  },
  gold: {
    label: 'Gold',
    icon: '🥇',
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
  },
  platinum: {
    label: 'Platinum',
    icon: '💎',
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
  },
}

export function DonorManagement({
  donors,
  stats,
  onDonorClick,
  onExport,
  onSendThankYou,
}: DonorManagementProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [tierFilter, setTierFilter] = useState<DonorTier | 'all'>('all')
  const [selectedDonors, setSelectedDonors] = useState<string[]>([])

  const filteredDonors = donors.filter(donor => {
    const matchesSearch = donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTier = tierFilter === 'all' || donor.tier === tierFilter
    return matchesSearch && matchesTier
  })

  const toggleDonorSelection = (donorId: string) => {
    setSelectedDonors(prev =>
      prev.includes(donorId)
        ? prev.filter(id => id !== donorId)
        : [...prev, donorId]
    )
  }

  const toggleAllSelection = () => {
    if (selectedDonors.length === filteredDonors.length) {
      setSelectedDonors([])
    } else {
      setSelectedDonors(filteredDonors.map(d => d.id))
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Donor Management</h1>
              <p className="text-slate-500 mt-1">Manage and engage with your supporters</p>
            </div>

            <div className="flex gap-2">
              {selectedDonors.length > 0 && (
                <button
                  onClick={() => onSendThankYou?.(selectedDonors)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Thank {selectedDonors.length} Donor{selectedDonors.length > 1 ? 's' : ''}
                </button>
              )}
              <button
                onClick={() => onExport?.()}
                className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
            <div className="text-sm text-slate-500 mb-1">Total Donors</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalDonors}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
            <div className="text-sm text-slate-500 mb-1">Recurring</div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.recurringDonors}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
            <div className="text-sm text-slate-500 mb-1">Avg. Donation</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">CHF {stats.averageDonation}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
            <div className="text-sm text-slate-500 mb-1">Retention Rate</div>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{(stats.retentionRate * 100).toFixed(0)}%</div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 col-span-2 lg:col-span-1">
            <div className="text-sm text-slate-500 mb-2">Tier Breakdown</div>
            <div className="flex gap-2">
              {Object.entries(stats.tierBreakdown).map(([tier, count]) => (
                <div key={tier} className="flex items-center gap-1 text-xs">
                  <span>{tierConfig[tier as DonorTier].icon}</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search donors..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Tier Filter */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setTierFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  tierFilter === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                All Tiers
              </button>
              {(['platinum', 'gold', 'silver', 'bronze'] as DonorTier[]).map(tier => (
                <button
                  key={tier}
                  onClick={() => setTierFilter(tier)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    tierFilter === tier
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{tierConfig[tier].icon}</span>
                  <span className="hidden sm:inline">{tierConfig[tier].label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Donors Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-4 px-5">
                    <input
                      type="checkbox"
                      checked={selectedDonors.length === filteredDonors.length && filteredDonors.length > 0}
                      onChange={toggleAllSelection}
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th className="text-left py-4 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Donor</th>
                  <th className="text-left py-4 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Tier</th>
                  <th className="text-right py-4 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Given</th>
                  <th className="text-right py-4 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Donations</th>
                  <th className="text-left py-4 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Last Donation</th>
                  <th className="text-left py-4 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredDonors.map(donor => (
                  <tr
                    key={donor.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                    onClick={() => onDonorClick?.(donor.id)}
                  >
                    <td className="py-4 px-5" onClick={e => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedDonors.includes(donor.id)}
                        onChange={() => toggleDonorSelection(donor.id)}
                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        {donor.avatar ? (
                          <img src={donor.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                              {donor.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{donor.name}</p>
                          <p className="text-sm text-slate-500">{donor.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${tierConfig[donor.tier].bgColor} ${tierConfig[donor.tier].color}`}>
                        {tierConfig[donor.tier].icon}
                        {tierConfig[donor.tier].label}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <span className="font-bold text-slate-900 dark:text-white">
                        CHF {donor.totalDonated.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right text-slate-600 dark:text-slate-400 hidden md:table-cell">
                      {donor.donationCount}
                    </td>
                    <td className="py-4 px-5 text-slate-500 hidden lg:table-cell">
                      {formatDate(donor.lastDonation)}
                    </td>
                    <td className="py-4 px-5 hidden lg:table-cell">
                      {donor.isRecurringDonor ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-medium">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Recurring
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">One-time</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredDonors.length === 0 && (
            <div className="text-center py-12">
              <div className="w-12 h-12 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-slate-500 dark:text-slate-400">No donors found matching your criteria</p>
            </div>
          )}
        </div>

        {/* Pagination placeholder */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-slate-500">
            Showing {filteredDonors.length} of {donors.length} donors
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
