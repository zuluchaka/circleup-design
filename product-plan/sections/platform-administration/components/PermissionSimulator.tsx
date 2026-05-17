import { useState } from 'react'
import type {
  PermissionSimulatorProps,
  AccessMode,
} from '../types'

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

export function PermissionSimulator({
  users,
  features,
  simulation,
  onSelectUser,
  onAddChange,
  onRunSimulation,
  onApplySimulation,
  onClear,
}: PermissionSimulatorProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>(simulation?.userId ?? '')
  const [selectedFeature, setSelectedFeature] = useState<string>('')
  const [selectedMode, setSelectedMode] = useState<AccessMode>('read')
  const [pendingChanges, setPendingChanges] = useState<
    { featureId: string; featureName: string; mode: AccessMode }[]
  >(
    simulation?.proposedChanges.map((c) => ({
      featureId: c.featureId,
      featureName: c.featureName,
      mode: c.proposedMode,
    })) ?? []
  )

  const selectedUser = users.find((u) => u.userId === selectedUserId)

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId)
    onSelectUser?.(userId)
  }

  const handleAddChange = () => {
    if (!selectedFeature || !selectedMode) return
    const feat = features.find((f) => f.id === selectedFeature)
    if (!feat) return
    setPendingChanges((prev) => [
      ...prev.filter((c) => c.featureId !== selectedFeature),
      { featureId: selectedFeature, featureName: feat.name, mode: selectedMode },
    ])
    onAddChange?.(selectedFeature, selectedMode)
    setSelectedFeature('')
  }

  const removeChange = (featureId: string) => {
    setPendingChanges((prev) => prev.filter((c) => c.featureId !== featureId))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Permission Simulator
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Test permission changes before applying them. See the before/after impact.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setPendingChanges([]); onClear?.() }}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Clear
          </button>
          <button
            onClick={onRunSimulation}
            disabled={!selectedUserId || pendingChanges.length === 0}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Run Simulation
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Configuration Panel */}
        <div className="space-y-4">
          {/* User Selection */}
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              1. Select User
            </h2>
            <select
              value={selectedUserId}
              onChange={(e) => handleSelectUser(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300"
            >
              <option value="">Choose a user...</option>
              {users.map((u) => (
                <option key={u.userId} value={u.userId}>
                  {u.userName} ({u.accessRoleLabel})
                </option>
              ))}
            </select>
            {selectedUser && (
              <div className="mt-3 rounded bg-slate-50 p-3 dark:bg-slate-900/50">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {selectedUser.userName.split(' ').map((n) => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {selectedUser.userName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedUser.accessRoleLabel} • {selectedUser.contextualRoles.length} contextual roles
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Add Changes */}
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              2. Propose Changes
            </h2>
            <div className="mt-2 flex gap-2">
              <select
                value={selectedFeature}
                onChange={(e) => setSelectedFeature(e.target.value)}
                className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300"
              >
                <option value="">Select feature...</option>
                {features.filter((f) => !f.parentId).map((f) => (
                  <option key={f.id} value={f.id}>
                    [{f.scope}] {f.name}
                  </option>
                ))}
              </select>
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value as AccessMode)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300"
              >
                {(['none', 'read', 'write', 'read_write'] as AccessMode[]).map((m) => (
                  <option key={m} value={m}>{accessModeLabels[m]}</option>
                ))}
              </select>
              <button
                onClick={handleAddChange}
                disabled={!selectedFeature}
                className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                Add
              </button>
            </div>

            {pendingChanges.length > 0 && (
              <div className="mt-3 space-y-2">
                {pendingChanges.map((change) => (
                  <div
                    key={change.featureId}
                    className="flex items-center justify-between rounded bg-slate-50 px-3 py-2 dark:bg-slate-900/50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {change.featureName}
                      </span>
                      <span className="text-xs text-slate-400">→</span>
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${accessModeColors[change.mode]}`}>
                        {accessModeLabels[change.mode]}
                      </span>
                    </div>
                    <button
                      onClick={() => removeChange(change.featureId)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Simulation Results */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            3. Simulation Results
          </h2>

          {!simulation && (
            <div className="mt-8 text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
              </div>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                Select a user, add proposed changes, and click &ldquo;Run Simulation&rdquo; to see the impact.
              </p>
            </div>
          )}

          {simulation && (
            <div className="mt-4 space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded bg-emerald-50 p-3 text-center dark:bg-emerald-900/10">
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {simulation.gainedFeatures.length}
                  </p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400">Features Gained</p>
                </div>
                <div className="rounded bg-red-50 p-3 text-center dark:bg-red-900/10">
                  <p className="text-lg font-bold text-red-600 dark:text-red-400">
                    {simulation.lostFeatures.length}
                  </p>
                  <p className="text-[10px] text-red-600 dark:text-red-400">Features Lost</p>
                </div>
                <div className="rounded bg-amber-50 p-3 text-center dark:bg-amber-900/10">
                  <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                    {simulation.conflicts.length}
                  </p>
                  <p className="text-[10px] text-amber-600 dark:text-amber-400">Conflicts</p>
                </div>
              </div>

              {/* Before/After Comparison */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Permission Changes
                </p>
                <div className="mt-2 space-y-1">
                  {simulation.proposedChanges.map((change) => (
                    <div
                      key={change.featureId}
                      className="flex items-center justify-between rounded px-3 py-2 bg-slate-50 dark:bg-slate-900/50"
                    >
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {change.featureName}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`rounded px-1.5 py-0.5 text-[9px] font-medium ${accessModeColors[change.currentMode]}`}>
                          {accessModeLabels[change.currentMode]}
                        </span>
                        <span className="text-xs text-slate-400">→</span>
                        <span className={`rounded px-1.5 py-0.5 text-[9px] font-medium ${accessModeColors[change.proposedMode]}`}>
                          {accessModeLabels[change.proposedMode]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gained Features */}
              {simulation.gainedFeatures.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Features Gained
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {simulation.gainedFeatures.map((f) => (
                      <span key={f} className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Lost Features */}
              {simulation.lostFeatures.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
                    Features Lost
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {simulation.lostFeatures.map((f) => (
                      <span key={f} className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Conflicts */}
              {simulation.conflicts.length > 0 && (
                <div className="rounded border border-amber-300 bg-amber-50 p-3 dark:border-amber-700 dark:bg-amber-900/10">
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">Conflicts Detected</p>
                  <ul className="mt-1 space-y-1">
                    {simulation.conflicts.map((c, i) => (
                      <li key={i} className="text-xs text-amber-600 dark:text-amber-400">• {c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Apply Button */}
              <button
                onClick={onApplySimulation}
                disabled={simulation.conflicts.length > 0}
                className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {simulation.conflicts.length > 0
                  ? 'Resolve Conflicts Before Applying'
                  : 'Apply These Changes'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
