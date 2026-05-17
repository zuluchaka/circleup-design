import type { FederationListProps } from '@/../product/sections/federations/types'

const statusStyles = {
  active: { badge: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-400' },
  forming: { badge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300', dot: 'bg-amber-400' },
  dissolved: { badge: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300', dot: 'bg-red-400' },
}

const governanceLabels = {
  democratic: 'Democratic',
  representative: 'Representative',
  consensus: 'Consensus',
}

function HealthScoreRing({ score }: { score: number }) {
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 80 ? 'text-emerald-500' : score >= 60 ? 'text-amber-500' : 'text-red-500'

  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={radius} fill="none" strokeWidth={4} className="stroke-slate-200 dark:stroke-slate-700" />
        <circle
          cx="32" cy="32" r={radius} fill="none" strokeWidth={4}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${color} transition-all duration-700`}
          style={{ stroke: 'currentColor' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-sm font-bold ${color}`}>{score}</span>
      </div>
    </div>
  )
}

export function FederationList({ federations, onSelectFederation, onCreateFederation }: FederationListProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Federations</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Manage your umbrella organizations and their child associations
              </p>
            </div>
            <button
              onClick={onCreateFederation}
              className="text-sm font-medium px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Create Federation
            </button>
          </div>
        </div>
      </div>

      {/* Federation cards */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {federations.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center">
              <svg className="w-7 h-7 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No federations yet</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
              Create a federation to coordinate multiple associations under a unified governance structure.
            </p>
            <button
              onClick={onCreateFederation}
              className="text-sm font-medium px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              Create Your First Federation
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {federations.map((fed) => {
              const styles = statusStyles[fed.status]
              return (
                <button
                  key={fed.id}
                  onClick={() => onSelectFederation?.(fed.id)}
                  className="w-full text-left bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-800 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={fed.logo}
                      alt={fed.name}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-100 dark:border-slate-700 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {fed.name}
                        </h2>
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full flex items-center gap-1 ${styles.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
                          {fed.status}
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 capitalize">
                          {governanceLabels[fed.governanceType]}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">{fed.description}</p>

                      {/* Stats row */}
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3">
                        <div>
                          <span className="text-lg font-bold text-slate-900 dark:text-white">{fed.totalMembers.toLocaleString()}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">members</span>
                        </div>
                        <div>
                          <span className="text-lg font-bold text-slate-900 dark:text-white">{fed.totalAssociations}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">associations</span>
                        </div>
                        <div>
                          <span className="text-lg font-bold text-slate-900 dark:text-white">{fed.totalActiveCircles}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">circles</span>
                        </div>
                        <div>
                          <span className="text-lg font-bold text-slate-900 dark:text-white">{fed.currency} {fed.totalFunds.toLocaleString()}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">in funds</span>
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">
                        Founded {new Date(fed.foundedAt).toLocaleDateString('en', { month: 'long', year: 'numeric' })}
                      </p>
                    </div>

                    {/* Health score ring */}
                    <div className="hidden sm:block">
                      <HealthScoreRing score={fed.healthScore} />
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center self-center ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-5 h-5 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
