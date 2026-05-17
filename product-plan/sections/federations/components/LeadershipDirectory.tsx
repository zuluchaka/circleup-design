import type { FederationLeader } from '../types'

interface LeadershipDirectoryProps {
  leaders: FederationLeader[]
  onAssignRole?: () => void
  onTransferRole?: (leaderId: string) => void
}

const termStatusStyles = {
  active: { badge: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-400' },
  expiring_soon: { badge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300', dot: 'bg-amber-400' },
  expired: { badge: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300', dot: 'bg-red-400' },
}

export function LeadershipDirectory({ leaders, onAssignRole, onTransferRole }: LeadershipDirectoryProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">
          Leadership Team
        </h3>
        <button
          onClick={onAssignRole}
          className="text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
          </svg>
          Assign Role
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {leaders.map((leader) => {
          const termStyles = termStatusStyles[leader.termStatus]
          const termEnd = new Date(leader.termEnd)
          const daysLeft = Math.ceil((termEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

          return (
            <div
              key={leader.id}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-3">
                <img
                  src={leader.photo}
                  alt={leader.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 dark:border-slate-700 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{leader.name}</h4>
                  <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{leader.roleLabel}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{leader.email}</p>
                </div>
              </div>

              {/* Term info */}
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium">Term</span>
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded flex items-center gap-1 ${termStyles.badge}`}>
                    <span className={`w-1 h-1 rounded-full ${termStyles.dot}`} />
                    {leader.termStatus.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {new Date(leader.termStart).toLocaleDateString('en', { month: 'short', year: 'numeric' })} — {termEnd.toLocaleDateString('en', { month: 'short', year: 'numeric' })}
                </p>
                {leader.termStatus === 'expiring_soon' && (
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-medium">
                    {daysLeft > 0 ? `${daysLeft} days remaining` : 'Term expired'}
                  </p>
                )}
              </div>

              {/* Permissions */}
              <div className="mt-3">
                <div className="flex flex-wrap gap-1">
                  {leader.permissions.slice(0, 4).map((perm) => (
                    <span
                      key={perm}
                      className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 uppercase"
                    >
                      {perm}
                    </span>
                  ))}
                  {leader.permissions.length > 4 && (
                    <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                      +{leader.permissions.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onTransferRole?.(leader.id)}
                  className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 px-2 py-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
                >
                  Transfer Role
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
