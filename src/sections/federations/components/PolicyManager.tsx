import type { FederationPolicy, ComplianceItem } from '@/../product/sections/federations/types'

interface PolicyManagerProps {
  policies: FederationPolicy[]
  complianceItems: ComplianceItem[]
  onCreatePolicy?: () => void
  onEditPolicy?: (id: string) => void
}

const enforcementStyles = {
  mandatory: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
  recommended: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  optional: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400',
}

const categoryIcons: Record<string, string> = {
  governance: '🏛️',
  finance: '💰',
  membership: '👥',
  operations: '⚙️',
}

const complianceStatusStyles = {
  compliant: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
  non_compliant: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
  pending_review: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
}

export function PolicyManager({ policies, complianceItems, onCreatePolicy, onEditPolicy }: PolicyManagerProps) {
  const activePolicies = policies.filter((p) => p.status === 'active')
  const draftPolicies = policies.filter((p) => p.status === 'draft')

  return (
    <div className="space-y-6">
      {/* Policies */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">
            Governance Policies ({policies.length})
          </h3>
          <button
            onClick={onCreatePolicy}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Policy
          </button>
        </div>

        {draftPolicies.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Drafts</p>
            {draftPolicies.map((policy) => (
              <div
                key={policy.id}
                className="bg-amber-50/50 dark:bg-amber-950/10 border border-dashed border-amber-300 dark:border-amber-800/50 rounded-xl p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span>{categoryIcons[policy.category] || '📋'}</span>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{policy.title}</h4>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{policy.description}</p>
                  </div>
                  <button
                    onClick={() => onEditPolicy?.(policy.id)}
                    className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 px-2 py-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors flex-shrink-0"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-3">
          {activePolicies.map((policy) => (
            <div
              key={policy.id}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span>{categoryIcons[policy.category] || '📋'}</span>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{policy.title}</h4>
                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${enforcementStyles[policy.enforcementLevel]}`}>
                      {policy.enforcementLevel}
                    </span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500">v{policy.version}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{policy.description}</p>
                </div>
                <button
                  onClick={() => onEditPolicy?.(policy.id)}
                  className="text-xs font-medium text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                  Edit
                </button>
              </div>

              {/* Compliance tracker */}
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Acknowledged:</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {policy.acknowledgedCount}/{policy.totalAssociations}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Compliant:</span>
                    <span className={`text-xs font-bold ${
                      policy.compliantCount === policy.totalAssociations
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-amber-600 dark:text-amber-400'
                    }`}>
                      {policy.compliantCount}/{policy.totalAssociations}
                    </span>
                  </div>
                </div>
                {policy.nonCompliantAssociations.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {policy.nonCompliantAssociations.map((name) => (
                      <span key={name} className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30">
                        {name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Dashboard */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">
          Compliance Tracking
        </h3>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Association</th>
                  <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Policy</th>
                  <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide hidden sm:table-cell">Deadline</th>
                  <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide hidden md:table-cell">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {complianceItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3 text-xs font-medium text-slate-900 dark:text-white">{item.associationName}</td>
                    <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400">{item.policyTitle}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${complianceStatusStyles[item.status]}`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 hidden sm:table-cell">
                      {item.deadline ? new Date(item.deadline).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 hidden md:table-cell max-w-[200px] truncate">
                      {item.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
