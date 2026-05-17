import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Circle, Eye, ChevronRight } from 'lucide-react'

export type AccessMode = 'none' | 'read' | 'write' | 'read_write'

export interface NavItem {
  label: string
  href: string
  icon?: LucideIcon
  isActive?: boolean
  badge?: string | number
  accessMode?: AccessMode
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export interface MainNavProps {
  groups: NavGroup[]
  isCollapsed: boolean
  onNavigate?: (href: string) => void
}

export function MainNav({ groups, isCollapsed, onNavigate }: MainNavProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    () => new Set(groups.map((g) => g.label))
  )

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(label)) {
        next.delete(label)
      } else {
        next.add(label)
      }
      return next
    })
  }

  return (
    <nav className="space-y-1 px-3">
      {groups.map((group) => {
        const visibleItems = group.items.filter(
          (item) => item.accessMode !== 'none'
        )

        if (visibleItems.length === 0) return null

        const isExpanded = expandedGroups.has(group.label)

        return (
          <div key={group.label}>
            {/* Group header */}
            {!isCollapsed ? (
              <button
                onClick={() => toggleGroup(group.label)}
                className="w-full flex items-center justify-between px-3 py-2 mt-2 first:mt-0 group cursor-pointer"
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  {group.label}
                </span>
                <ChevronRight
                  className={`w-3 h-3 text-slate-600 transition-transform duration-200 ${
                    isExpanded ? 'rotate-90' : ''
                  }`}
                />
              </button>
            ) : (
              <div className="mx-auto my-3 w-5 border-t border-white/[0.06]" />
            )}

            {/* Group items */}
            {(isCollapsed || isExpanded) && (
              <ul className="space-y-0.5">
                {visibleItems.map((item) => {
                  const Icon = item.icon || Circle
                  const isReadOnly = item.accessMode === 'read'

                  return (
                    <li key={item.href} className="relative">
                      <button
                        onClick={() => onNavigate?.(item.href)}
                        className={`
                          w-full flex items-center gap-3 rounded-xl transition-all duration-150 relative
                          ${isCollapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2'}
                          ${item.isActive
                            ? 'bg-white/[0.1] text-white'
                            : isReadOnly
                              ? 'text-slate-600 hover:text-slate-400 hover:bg-white/[0.04]'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]'
                          }
                        `}
                        title={
                          isCollapsed
                            ? `${item.label}${isReadOnly ? ' (Read only)' : ''}`
                            : undefined
                        }
                      >
                        {/* Active indicator bar */}
                        {item.isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-indigo-400" />
                        )}

                        <div className="relative shrink-0">
                          <Icon
                            className={`w-[18px] h-[18px] ${
                              item.isActive
                                ? 'text-indigo-400'
                                : isReadOnly
                                  ? 'text-slate-600'
                                  : ''
                            }`}
                            strokeWidth={item.isActive ? 2 : 1.5}
                          />
                        </div>

                        {!isCollapsed && (
                          <>
                            <span
                              className={`flex-1 text-left text-[13px] font-medium truncate ${
                                isReadOnly ? 'opacity-60' : ''
                              }`}
                            >
                              {item.label}
                            </span>

                            {isReadOnly && (
                              <Eye className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                            )}

                            {item.badge !== undefined && !isReadOnly && (
                              <span
                                className={`ml-auto text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center ${
                                  item.isActive
                                    ? 'bg-indigo-500/30 text-indigo-300'
                                    : 'bg-amber-500/20 text-amber-400'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}

                        {/* Collapsed badge dot */}
                        {isCollapsed && item.badge !== undefined && !isReadOnly && (
                          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )
      })}
    </nav>
  )
}
