import { useState } from 'react'
import type {
  PermissionMatrixProps,
  AccessMode,
  PermissionScope,
  FeatureDefinition,
} from '@/../product/sections/platform-administration/types'

const accessModeOrder: AccessMode[] = ['none', 'read', 'write', 'read_write']
const accessModeLabels: Record<AccessMode, string> = {
  none: 'No Access',
  read: 'Read',
  write: 'Write',
  read_write: 'Read & Write',
}
const accessModeColors: Record<AccessMode, { bg: string; text: string; cell: string }> = {
  none: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-400',
    cell: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  },
  read: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-400',
    cell: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  },
  write: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-400',
    cell: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
  },
  read_write: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    text: 'text-emerald-700 dark:text-emerald-400',
    cell: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800',
  },
}

const scopeLabels: Record<PermissionScope, string> = {
  federation: 'Federation',
  association: 'Association',
  circle: 'Circle',
}

function flattenFeatures(features: FeatureDefinition[]): FeatureDefinition[] {
  const result: FeatureDefinition[] = []
  for (const f of features) {
    result.push(f)
    if (f.children) {
      for (const child of f.children) {
        result.push(child)
      }
    }
  }
  return result
}

export function PermissionMatrix({
  matrix,
  accessRoles,
  templates,
  onCellChange,
  onSave,
  onDiscard,
  onApplyTemplate,
  onExport,
}: PermissionMatrixProps) {
  const [activeScope, setActiveScope] = useState<PermissionScope>(matrix.scope)
  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set())
  const [hasChanges, setHasChanges] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [selectedRole, setSelectedRole] = useState<string>('')

  const scopeFeatures = matrix.features.filter((f) => f.scope === activeScope)
  const allFeatures = flattenFeatures(scopeFeatures)

  const visibleFeatures = allFeatures.filter((f) => {
    if (!f.parentId) return true
    return expandedFeatures.has(f.parentId)
  })

  const toggleExpand = (featureId: string) => {
    const next = new Set(expandedFeatures)
    if (next.has(featureId)) {
      next.delete(featureId)
    } else {
      next.add(featureId)
    }
    setExpandedFeatures(next)
  }

  const cycleMode = (roleId: string, featureId: string, currentMode: AccessMode) => {
    const idx = accessModeOrder.indexOf(currentMode)
    const nextMode = accessModeOrder[(idx + 1) % accessModeOrder.length]
    onCellChange?.(roleId, featureId, nextMode)
    setHasChanges(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Permission Matrix
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Configure feature access by contextual role. Click cells to cycle access modes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <>
              <button
                onClick={() => { onDiscard?.(); setHasChanges(false) }}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Discard
              </button>
              <button
                onClick={() => { onSave?.(); setHasChanges(false) }}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </>
          )}
          <button
            onClick={onExport}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Export
          </button>
        </div>
      </div>

      {/* Scope Tabs */}
      <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-700">
        {(['federation', 'association', 'circle'] as PermissionScope[]).map((scope) => (
          <button
            key={scope}
            onClick={() => setActiveScope(scope)}
            className={`border-b-2 pb-3 text-sm font-medium transition-colors ${
              activeScope === scope
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            {scopeLabels[scope]}
          </button>
        ))}
      </div>

      {/* Legend & Template */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-3">
          {accessModeOrder.map((mode) => (
            <div key={mode} className="flex items-center gap-1.5">
              <div className={`h-3 w-3 rounded ${accessModeColors[mode].bg}`} />
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {accessModeLabels[mode]}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="">Apply Template...</option>
            {templates
              .filter((t) => t.scope === activeScope)
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} (v{t.version})
                </option>
              ))}
          </select>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="">To Role...</option>
            {matrix.rows.map((r) => (
              <option key={r.roleId} value={r.roleId}>
                {r.roleLabel}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              if (selectedTemplate && selectedRole) {
                onApplyTemplate?.(selectedTemplate, selectedRole)
                setHasChanges(true)
              }
            }}
            disabled={!selectedTemplate || !selectedRole}
            className="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Access Role Ceilings */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Access Role Ceilings
        </h3>
        <div className="mt-3 flex flex-wrap gap-4">
          {accessRoles.map((ar) => (
            <div key={ar.id} className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: ar.color === 'red' ? '#ef4444' : ar.color === 'indigo' ? '#6366f1' : '#94a3b8' }}
              />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {ar.label}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                ({ar.userCount.toLocaleString()} users)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Matrix Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800">
              <th className="sticky left-0 z-10 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-48">
                Feature
              </th>
              {matrix.rows.map((row) => (
                <th
                  key={row.roleId}
                  className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 min-w-[100px]"
                >
                  {row.roleLabel}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {visibleFeatures.map((feature) => {
              const hasChildren = scopeFeatures.some(
                (f) => f.children && f.children.length > 0 && f.id === feature.id
              )
              const isChild = !!feature.parentId
              const isExpanded = expandedFeatures.has(feature.id)

              return (
                <tr
                  key={feature.id}
                  className={`${isChild ? 'bg-slate-25 dark:bg-slate-850' : ''} hover:bg-slate-50 dark:hover:bg-slate-900/50`}
                >
                  <td className="sticky left-0 z-10 bg-white dark:bg-slate-800 px-4 py-2.5">
                    <div className={`flex items-center gap-2 ${isChild ? 'pl-6' : ''}`}>
                      {hasChildren && (
                        <button
                          onClick={() => toggleExpand(feature.id)}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                          <svg
                            className={`h-3.5 w-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      )}
                      <div>
                        <span className={`text-sm ${isChild ? 'text-slate-500 dark:text-slate-400' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                          {feature.name}
                        </span>
                        {feature.containsPersonalData && (
                          <span className="ml-1.5 inline-block rounded bg-purple-100 px-1 py-0.5 text-[9px] font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                            PII
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  {matrix.rows.map((row) => {
                    const cell = row.cells[feature.id]
                    const mode = cell?.accessMode ?? 'none'
                    const isInherited = cell?.isInherited ?? false
                    const colors = accessModeColors[mode]

                    return (
                      <td key={row.roleId} className="px-3 py-2.5 text-center">
                        <button
                          onClick={() => cycleMode(row.roleId, feature.id, mode)}
                          className={`inline-flex items-center justify-center rounded-md border px-2.5 py-1 text-[11px] font-medium transition-all hover:ring-2 hover:ring-indigo-300 dark:hover:ring-indigo-600 ${colors.cell} ${colors.text} ${isInherited ? 'opacity-60' : ''}`}
                          title={`${accessModeLabels[mode]}${isInherited ? ' (inherited)' : ''} — Click to change`}
                        >
                          {accessModeLabels[mode]}
                          {isInherited && (
                            <svg className="ml-1 h-2.5 w-2.5 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Unsaved indicator */}
      {hasChanges && (
        <div className="sticky bottom-0 rounded-lg border border-amber-300 bg-amber-50 p-3 dark:border-amber-700 dark:bg-amber-900/20">
          <div className="flex items-center justify-between">
            <p className="text-sm text-amber-700 dark:text-amber-400">
              You have unsaved changes to the permission matrix.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => { onDiscard?.(); setHasChanges(false) }}
                className="rounded px-3 py-1 text-sm font-medium text-amber-700 hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-900/30"
              >
                Discard
              </button>
              <button
                onClick={() => { onSave?.(); setHasChanges(false) }}
                className="rounded bg-amber-600 px-3 py-1 text-sm font-medium text-white hover:bg-amber-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
