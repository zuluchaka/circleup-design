import { useState } from 'react'
import type {
  RoleManagerProps,
  PermissionScope,
  AccessMode,
} from '@/../product/sections/platform-administration/types'

const scopeColors: Record<PermissionScope, string> = {
  federation: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  association: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  circle: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
}

const accessModeLabels: Record<AccessMode, string> = {
  none: 'No Access',
  read: 'Read',
  write: 'Write',
  read_write: 'R&W',
}

const accessModeColors: Record<AccessMode, string> = {
  none: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  read: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  write: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  read_write: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
}

type Tab = 'access_roles' | 'contextual_roles' | 'sod_rules' | 'hierarchy'

export function RoleManager({
  accessRoles,
  contextualRoles,
  sodRules,
  onEditAccessRole,
  onCreateContextualRole,
  onEditContextualRole,
  onDeleteContextualRole,
  onBulkAssign,
  onCompareRoles,
}: RoleManagerProps) {
  const [activeTab, setActiveTab] = useState<Tab>('access_roles')
  const [scopeFilter, setScopeFilter] = useState<PermissionScope | 'all'>('all')
  const [compareSelection, setCompareSelection] = useState<string[]>([])

  const filteredContextualRoles =
    scopeFilter === 'all'
      ? contextualRoles
      : contextualRoles.filter((r) => r.scope === scopeFilter)

  const toggleCompare = (roleId: string) => {
    setCompareSelection((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId].slice(0, 2)
    )
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'access_roles', label: 'Access Roles' },
    { key: 'contextual_roles', label: 'Contextual Roles' },
    { key: 'sod_rules', label: 'Separation of Duties' },
    { key: 'hierarchy', label: 'Role Hierarchy' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Role Manager
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage access roles, contextual roles, and separation of duties
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onBulkAssign}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Bulk Assign
          </button>
          <button
            onClick={onCreateContextualRole}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Create Role
          </button>
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
          </button>
        ))}
      </div>

      {/* Access Roles Tab */}
      {activeTab === 'access_roles' && (
        <div className="grid gap-6 md:grid-cols-3">
          {accessRoles.map((role) => {
            const roleColors: Record<string, string> = {
              red: 'border-red-300 dark:border-red-700',
              indigo: 'border-indigo-300 dark:border-indigo-700',
              slate: 'border-slate-300 dark:border-slate-600',
            }
            const roleBg: Record<string, string> = {
              red: 'bg-red-50 dark:bg-red-900/10',
              indigo: 'bg-indigo-50 dark:bg-indigo-900/10',
              slate: 'bg-slate-50 dark:bg-slate-800',
            }
            return (
              <div
                key={role.id}
                className={`rounded-lg border-2 ${roleColors[role.color] ?? 'border-slate-300'} ${roleBg[role.color] ?? 'bg-white dark:bg-slate-800'} p-6`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: role.color === 'red' ? '#ef4444' : role.color === 'indigo' ? '#6366f1' : '#94a3b8' }}
                    />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {role.label}
                    </h3>
                  </div>
                  {role.isSystem && (
                    <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                      System
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {role.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">
                    {role.userCount.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">users</span>
                </div>
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Ceiling Permissions
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {Object.entries(role.ceilingPermissions).slice(0, 8).map(([feature, mode]) => (
                      <span
                        key={feature}
                        className={`rounded px-1.5 py-0.5 text-[9px] font-medium ${accessModeColors[mode as AccessMode]}`}
                        title={`${feature}: ${accessModeLabels[mode as AccessMode]}`}
                      >
                        {feature.split('.').pop()}
                      </span>
                    ))}
                    {Object.keys(role.ceilingPermissions).length > 8 && (
                      <span className="rounded px-1.5 py-0.5 text-[9px] font-medium bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                        +{Object.keys(role.ceilingPermissions).length - 8} more
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onEditAccessRole?.(role.id)}
                  className="mt-4 w-full rounded-lg border border-slate-300 py-2 text-sm font-medium text-slate-700 hover:bg-white dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Edit Ceiling Permissions
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Contextual Roles Tab */}
      {activeTab === 'contextual_roles' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {(['all', 'federation', 'association', 'circle'] as const).map((scope) => (
                <button
                  key={scope}
                  onClick={() => setScopeFilter(scope)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    scopeFilter === scope
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {scope === 'all' ? 'All Scopes' : scope.charAt(0).toUpperCase() + scope.slice(1)}
                </button>
              ))}
            </div>
            {compareSelection.length === 2 && (
              <button
                onClick={() => {
                  onCompareRoles?.(compareSelection)
                  setCompareSelection([])
                }}
                className="rounded-lg bg-purple-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-purple-700"
              >
                Compare Selected ({compareSelection.length})
              </button>
            )}
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800">
                  <th className="w-8 px-3 py-2.5" />
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Role
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Scope
                  </th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Users
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Type
                  </th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredContextualRoles.map((role) => (
                  <tr
                    key={role.id}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-900/50 ${compareSelection.includes(role.id) ? 'bg-purple-50 dark:bg-purple-900/10' : ''}`}
                  >
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={compareSelection.includes(role.id)}
                        onChange={() => toggleCompare(role.id)}
                        className="h-3.5 w-3.5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {role.label}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {role.description.slice(0, 60)}
                        {role.description.length > 60 ? '...' : ''}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${scopeColors[role.scope]}`}>
                        {role.scope}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {role.userCount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                          role.isCustom
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {role.isCustom ? 'Custom' : 'System'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEditContextualRole?.(role.id)}
                          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                          title="Edit"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        {role.isCustom && (
                          <button
                            onClick={() => onDeleteContextualRole?.(role.id)}
                            className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                            title="Delete"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SoD Rules Tab */}
      {activeTab === 'sod_rules' && (
        <div className="space-y-4">
          {sodRules.map((rule) => (
            <div
              key={rule.id}
              className={`rounded-lg border p-4 ${
                rule.violations > 0
                  ? 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/10'
                  : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      {rule.name}
                    </h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        rule.enforced
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {rule.enforced ? 'Enforced' : 'Advisory'}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${scopeColors[rule.scope]}`}>
                      {rule.scope}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {rule.description}
                  </p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span>
                      Conflicting: <code className="rounded bg-slate-100 px-1 dark:bg-slate-700">{rule.conflictingPermissions[0]}</code>
                      {' '}vs{' '}
                      <code className="rounded bg-slate-100 px-1 dark:bg-slate-700">{rule.conflictingPermissions[1]}</code>
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${rule.violations > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {rule.violations}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">violations</p>
                  <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                    Last checked: {new Date(rule.lastChecked).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Role Hierarchy Tab */}
      {activeTab === 'hierarchy' && (
        <div className="space-y-6">
          {accessRoles.map((ar) => {
            const arColor = ar.color === 'red' ? '#ef4444' : ar.color === 'indigo' ? '#6366f1' : '#94a3b8'
            const rolesByScope = contextualRoles.reduce(
              (acc, cr) => {
                if (!acc[cr.scope]) acc[cr.scope] = []
                acc[cr.scope].push(cr)
                return acc
              },
              {} as Record<string, typeof contextualRoles>
            )

            return (
              <div key={ar.id} className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full" style={{ backgroundColor: arColor }} />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {ar.label}
                  </h3>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    ({ar.userCount.toLocaleString()} users)
                  </span>
                </div>
                <div className="mt-4 ml-2 border-l-2 border-slate-200 pl-6 dark:border-slate-700 space-y-4">
                  {(['federation', 'association', 'circle'] as PermissionScope[]).map((scope) => (
                    <div key={scope}>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {scope} roles
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(rolesByScope[scope] ?? []).map((cr) => (
                          <div
                            key={cr.id}
                            className={`rounded-lg border px-3 py-1.5 ${scopeColors[scope]}`}
                          >
                            <span className="text-xs font-medium">{cr.label}</span>
                            <span className="ml-1 text-[10px] opacity-70">
                              ({cr.userCount.toLocaleString()})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
