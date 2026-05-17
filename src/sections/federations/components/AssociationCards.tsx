import { useState } from 'react'
import type { ChildAssociation } from '@/../product/sections/federations/types'

interface AssociationCardsProps {
  associations: ChildAssociation[]
  onViewAssociation?: (id: string) => void
  onCompareAssociations?: (ids: string[]) => void
  onAddAssociation?: () => void
  onUnlinkAssociation?: (id: string) => void
}

const duesStatusStyles = {
  paid: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
  pending: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  overdue: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
}

const statusDot = {
  active: 'bg-emerald-400',
  suspended: 'bg-red-400',
  pending: 'bg-amber-400',
}

function ComplianceBar({ score }: { score: number }) {
  const color = score >= 85 ? 'bg-emerald-500' : score >= 70 ? 'bg-amber-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 w-7 text-right">{score}</span>
    </div>
  )
}

export function AssociationCards({
  associations,
  onViewAssociation,
  onCompareAssociations,
  onAddAssociation,
  onUnlinkAssociation,
}: AssociationCardsProps) {
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [isCompareMode, setIsCompareMode] = useState(false)

  const toggleCompare = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : prev.length < 4 ? [...prev, id] : prev
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">
          Child Associations ({associations.length})
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setIsCompareMode(!isCompareMode); setCompareIds([]) }}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
              isCompareMode
                ? 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-700'
            }`}
          >
            {isCompareMode ? `Comparing (${compareIds.length}/4)` : 'Compare'}
          </button>
          {isCompareMode && compareIds.length >= 2 && (
            <button
              onClick={() => onCompareAssociations?.(compareIds)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              Compare Selected
            </button>
          )}
          <button
            onClick={onAddAssociation}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Link Association
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {associations.map((assoc) => (
          <div
            key={assoc.id}
            className={`bg-white dark:bg-slate-800 rounded-xl border ${
              isCompareMode && compareIds.includes(assoc.id)
                ? 'border-indigo-400 dark:border-indigo-500 ring-2 ring-indigo-100 dark:ring-indigo-900/30'
                : 'border-slate-200 dark:border-slate-700'
            } p-4 hover:shadow-md transition-all group`}
          >
            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
              {isCompareMode && (
                <input
                  type="checkbox"
                  checked={compareIds.includes(assoc.id)}
                  onChange={() => toggleCompare(assoc.id)}
                  className="mt-1 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500"
                />
              )}
              <img
                src={assoc.logo}
                alt={assoc.name}
                className="w-10 h-10 rounded-lg object-cover border border-slate-100 dark:border-slate-700 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{assoc.name}</h4>
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDot[assoc.status]}`} />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {assoc.city}, {assoc.country} &middot; {assoc.language.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Metrics grid */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="text-center">
                <p className="text-lg font-bold text-slate-900 dark:text-white">{assoc.memberCount}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">Members</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-slate-900 dark:text-white">{assoc.activeCircles}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">Circles</p>
              </div>
              <div className="text-center">
                <p className={`text-lg font-bold ${
                  assoc.memberGrowthPercent >= 0
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {assoc.memberGrowthPercent > 0 ? '+' : ''}{assoc.memberGrowthPercent}%
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">Growth</p>
              </div>
            </div>

            {/* Dues status */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium">Dues</span>
              <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${duesStatusStyles[assoc.duesStatus]}`}>
                {assoc.duesStatus}
              </span>
            </div>

            {/* Compliance bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium">Compliance</span>
              </div>
              <ComplianceBar score={assoc.complianceScore} />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                President: {assoc.presidentName}
              </p>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onViewAssociation?.(assoc.id)}
                  className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 px-2 py-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
                >
                  View
                </button>
                <button
                  onClick={() => onUnlinkAssociation?.(assoc.id)}
                  className="text-[10px] font-medium text-slate-400 hover:text-red-600 dark:hover:text-red-400 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  Unlink
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
