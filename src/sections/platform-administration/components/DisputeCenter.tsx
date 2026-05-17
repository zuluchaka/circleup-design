import type { DisputeCenterProps } from '@/../product/sections/platform-administration/types'

const statusColors: Record<string, string> = {
  open: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  investigating: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  awaiting_response: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  resolved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  appealed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export function DisputeCenter({ disputes, onDisputeSelect }: DisputeCenterProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Dispute Center</h2>
        <span className="text-sm text-slate-500 dark:text-slate-400">{disputes.length} dispute{disputes.length !== 1 ? 's' : ''}</span>
      </div>
      {disputes.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">No disputes to review.</p>
      ) : (
        <div className="space-y-3">
          {disputes.map((d) => (
            <button
              key={d.id}
              onClick={() => onDisputeSelect?.(d.id)}
              className="w-full text-left rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-slate-900 dark:text-white">
                  {d.type.charAt(0).toUpperCase() + d.type.slice(1)} Dispute — {d.currency} {d.amount.toLocaleString()}
                </h3>
                <span className={`text-xs px-2 py-1 rounded-full ${statusColors[d.status] ?? 'bg-slate-100 text-slate-600'}`}>
                  {d.status.replace('_', ' ')}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span>Parties: {d.parties.map(p => p.userName).join(' vs ')}</span>
                <span>Evidence: {d.evidence.length}</span>
                <span>Filed: {new Date(d.createdAt).toLocaleDateString()}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
