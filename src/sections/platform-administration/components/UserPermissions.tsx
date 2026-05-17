import { useState } from 'react'
import type {
  UserPermissionsProps,
  AccessMode,
  PermissionScope,
  OverrideStatus,
} from '@/../product/sections/platform-administration/types'

const accessModeLabels: Record<AccessMode, string> = {
  none: 'No Access',
  read: 'Read',
  write: 'Write',
  read_write: 'Read & Write',
}

const accessModeColors: Record<AccessMode, string> = {
  none: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  read: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  write: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  read_write: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
}

const scopeColors: Record<PermissionScope, string> = {
  federation: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  association: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  circle: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
}

const overrideStatusColors: Record<OverrideStatus, string> = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  expired: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  revoked: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

type Tab = 'effective' | 'overrides' | 'history'

export function UserPermissions({
  user,
  effectivePermissions,
  overrides,
  permissionSources,
  auditEntries,
  onCreateOverride,
  onRevokeOverride,
  onCreateTemporaryGrant,
}: UserPermissionsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('effective')
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null)

  const activeOverrides = overrides.filter((o) => o.status === 'active')
  const temporaryOverrides = activeOverrides.filter((o) => o.isTemporary)

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'effective', label: 'Effective Permissions' },
    { key: 'overrides', label: 'Overrides', count: activeOverrides.length },
    { key: 'history', label: 'History' },
  ]

  // Group permissions by scope
  const permissionsByScope = Object.entries(effectivePermissions).reduce(
    (acc, [feature, mode]) => {
      const scope = feature.split('.')[0] as string
      const scopeKey = scope === 'federation' || scope === 'association' || scope === 'circle' ? scope : 'other'
      if (!acc[scopeKey]) acc[scopeKey] = []
      acc[scopeKey].push({ feature, mode })
      return acc
    },
    {} as Record<string, { feature: string; mode: AccessMode }[]>
  )

  return (
    <div className="space-y-6">
      {/* User Header */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 shrink-0 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
            {user.userAvatar ? (
              <img src={user.userAvatar} alt={user.userName} className="h-full w-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-slate-500 dark:text-slate-400">
                {user.userName.split(' ').map((n) => n[0]).join('')}
              </span>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                {user.userName}
              </h1>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                user.accessRole === 'admin'
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  : user.accessRole === 'standard_user'
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}>
                {user.accessRoleLabel}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{user.userEmail}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {user.contextualRoles.map((cr, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${scopeColors[cr.scope]}`}
                >
                  <span>{cr.roleName}</span>
                  <span className="opacity-60">@ {cr.scopeName}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {user.overrideCount}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Overrides</p>
            </div>
            <div>
              <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
                {user.temporaryGrantCount}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Temp Grants</p>
            </div>
            <div>
              <p className={`text-xl font-bold ${user.anomalyCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {user.anomalyCount}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Anomalies</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-700">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`border-b-2 pb-3 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="ml-1.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-indigo-100 px-1 text-[10px] font-bold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Effective Permissions Tab */}
      {activeTab === 'effective' && (
        <div className="space-y-6">
          {(['federation', 'association', 'circle'] as const).map((scope) => {
            const perms = permissionsByScope[scope]
            if (!perms || perms.length === 0) return null
            return (
              <div key={scope} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${scopeColors[scope]}`}>
                    {scope}
                  </span>
                  Features
                </h3>
                <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
                  {perms.map(({ feature, mode }) => {
                    const sources = permissionSources[feature] ?? []
                    const isExpanded = expandedFeature === feature
                    return (
                      <div key={feature}>
                        <button
                          onClick={() => setExpandedFeature(isExpanded ? null : feature)}
                          className="flex w-full items-center justify-between py-2.5 hover:bg-slate-50 dark:hover:bg-slate-900/50 px-2 rounded"
                        >
                          <span className="text-sm text-slate-700 dark:text-slate-300">
                            {feature.split('.').slice(1).join(' > ')}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${accessModeColors[mode]}`}>
                              {accessModeLabels[mode]}
                            </span>
                            <svg
                              className={`h-3.5 w-3.5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </button>
                        {isExpanded && sources.length > 0 && (
                          <div className="mb-2 ml-4 rounded bg-slate-50 p-3 dark:bg-slate-900/50">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                              Permission Sources
                            </p>
                            <div className="space-y-1.5">
                              {sources.map((src, i) => (
                                <div key={i} className="flex items-center justify-between">
                                  <span className="text-xs text-slate-600 dark:text-slate-400">
                                    {src.source}
                                  </span>
                                  <span className={`rounded px-1.5 py-0.5 text-[9px] font-medium ${accessModeColors[src.mode]}`}>
                                    {accessModeLabels[src.mode]}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <div className="mt-2 flex gap-2">
                              <button
                                onClick={() => onCreateOverride?.(feature, 'read_write', 'Manual override')}
                                className="rounded px-2 py-1 text-[10px] font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
                              >
                                + Grant Override
                              </button>
                              <button
                                onClick={() => onCreateTemporaryGrant?.(feature, 'read_write', '2026-03-01T00:00:00Z', 'Temporary grant')}
                                className="rounded px-2 py-1 text-[10px] font-medium text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/20"
                              >
                                + Temporary Grant
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Overrides Tab */}
      {activeTab === 'overrides' && (
        <div className="space-y-4">
          {temporaryOverrides.length > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-900/10">
              <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                Temporary Grants ({temporaryOverrides.length})
              </h3>
              <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                These grants will automatically expire.
              </p>
            </div>
          )}
          <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Feature</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Scope</th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Previous</th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Override</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Reason</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {overrides.map((ov) => (
                  <tr key={ov.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{ov.featureName}</p>
                      {ov.isTemporary && (
                        <p className="text-[10px] text-amber-600 dark:text-amber-400">
                          Expires {ov.expiresAt ? new Date(ov.expiresAt).toLocaleDateString() : 'N/A'}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${scopeColors[ov.scopeType]}`}>
                        {ov.scopeName}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${accessModeColors[ov.previousMode]}`}>
                        {accessModeLabels[ov.previousMode]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${accessModeColors[ov.accessMode]}`}>
                        {accessModeLabels[ov.accessMode]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px] truncate" title={ov.reason}>
                        {ov.reason}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">
                        by {ov.grantedByName}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${overrideStatusColors[ov.status]}`}>
                        {ov.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {ov.status === 'active' && (
                        <button
                          onClick={() => onRevokeOverride?.(ov.id)}
                          className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          {auditEntries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700"
            >
              <div className="mt-0.5 h-8 w-8 shrink-0 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  {entry.actorName.split(' ').map((n) => n[0]).join('')}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {entry.actorName}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {entry.actionType.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {entry.targetName}
                  {entry.scopeName && ` • ${entry.scopeName}`}
                </p>
                {entry.reason && (
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500 italic">
                    &ldquo;{entry.reason}&rdquo;
                  </p>
                )}
                <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                  {new Date(entry.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
