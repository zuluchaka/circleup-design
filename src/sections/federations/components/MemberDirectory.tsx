import { useState } from 'react'
import type { AggregatedMember } from '@/../product/sections/federations/types'

interface MemberDirectoryProps {
  members: AggregatedMember[]
  onExportMembers?: (format: 'csv' | 'pdf') => void
  onSearchMember?: (query: string) => void
}

const statusStyles = {
  active: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
  suspended: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
  inactive: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400',
}

function TrustBadge({ score }: { score: number }) {
  const color = score >= 800 ? 'text-emerald-600 dark:text-emerald-400' :
    score >= 600 ? 'text-amber-600 dark:text-amber-400' :
    'text-red-600 dark:text-red-400'
  return (
    <span className={`text-xs font-mono font-bold ${color}`}>{score}</span>
  )
}

export function MemberDirectory({ members, onExportMembers, onSearchMember }: MemberDirectoryProps) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'federation_leaders' | 'multi_assoc'>('all')

  const filtered = members.filter((m) => {
    const matchesQuery = !query || m.name.toLowerCase().includes(query.toLowerCase()) || m.email.toLowerCase().includes(query.toLowerCase())
    const matchesFilter =
      filter === 'all' ? true :
      filter === 'federation_leaders' ? m.federationRole !== null :
      filter === 'multi_assoc' ? m.associations.length > 1 : true
    return matchesQuery && matchesFilter
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">
          Member Directory ({members.length})
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onExportMembers?.('csv')}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
          >
            Export CSV
          </button>
          <button
            onClick={() => onExportMembers?.('pdf')}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); onSearchMember?.(e.target.value) }}
            placeholder="Search members by name or email..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 dark:focus:border-indigo-700 transition-all"
          />
        </div>
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
          {[
            { key: 'all', label: 'All' },
            { key: 'federation_leaders', label: 'Leaders' },
            { key: 'multi_assoc', label: 'Multi-Assoc' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as typeof filter)}
              className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
                filter === f.key
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Member list */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Member</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide hidden sm:table-cell">Associations</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-center">Trust</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-center hidden md:table-cell">Circles</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filtered.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {member.photo ? (
                        <img src={member.photo} alt={member.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-slate-900 dark:text-white">{member.name}</p>
                          {member.federationRole && (
                            <span className="text-[8px] font-bold uppercase px-1 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                              {member.federationRole}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {member.associations.map((assoc) => (
                        <span key={assoc.name} className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                          {assoc.name.length > 25 ? assoc.name.slice(0, 25) + '...' : assoc.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center"><TrustBadge score={member.trustScore} /></td>
                  <td className="px-4 py-3 text-center hidden md:table-cell">
                    <span className="text-xs text-slate-600 dark:text-slate-300">{member.totalCircles}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${statusStyles[member.status]}`}>
                      {member.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">No members match your search</p>
          </div>
        )}
      </div>
    </div>
  )
}
