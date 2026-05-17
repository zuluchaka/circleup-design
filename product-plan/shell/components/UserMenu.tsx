import { useState, useRef, useEffect } from 'react'
import { Settings, HelpCircle, LogOut, ChevronUp, Shield, KeyRound } from 'lucide-react'

export type AccessRoleName = 'admin' | 'standard_user' | 'invitee'

export interface UserContextualRole {
  label: string
  scope: string
  scopeName: string
}

export interface User {
  name: string
  email?: string
  avatarUrl?: string
  role?: string
  accessRole?: AccessRoleName
  contextualRoles?: UserContextualRole[]
}

export interface UserMenuProps {
  user: User
  isCollapsed: boolean
  onLogout?: () => void
  onSettings?: () => void
  onHelp?: () => void
  onPermissions?: () => void
}

const accessRoleConfig: Record<AccessRoleName, { label: string; color: string; bg: string }> = {
  admin: {
    label: 'Admin',
    color: 'text-indigo-300',
    bg: 'bg-indigo-500/20',
  },
  standard_user: {
    label: 'Standard',
    color: 'text-slate-300',
    bg: 'bg-white/10',
  },
  invitee: {
    label: 'Invitee',
    color: 'text-amber-300',
    bg: 'bg-amber-500/15',
  },
}

export function UserMenu({
  user,
  isCollapsed,
  onLogout,
  onSettings,
  onHelp,
  onPermissions,
}: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const roleConfig = user.accessRole ? accessRoleConfig[user.accessRole] : null
  const isAdmin = user.accessRole === 'admin'

  return (
    <div ref={menuRef} className="relative">
      {/* User button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center gap-3 px-3 py-3 text-left
          hover:bg-white/[0.06] transition-all duration-150
          ${isCollapsed ? 'justify-center' : ''}
        `}
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className={`w-8 h-8 rounded-full object-cover ${
                isAdmin
                  ? 'ring-2 ring-indigo-400/60'
                  : 'ring-2 ring-white/10'
              }`}
            />
          ) : (
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isAdmin
                  ? 'bg-gradient-to-br from-indigo-400 to-violet-500 ring-2 ring-indigo-400/40'
                  : 'bg-slate-700 ring-2 ring-white/10'
              }`}
            >
              <span className="text-xs font-semibold text-white">
                {initials}
              </span>
            </div>
          )}
          {/* Online indicator */}
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
        </div>

        {!isCollapsed && (
          <>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate leading-tight">
                {user.name}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {user.role && (
                  <span className="text-[11px] text-slate-400 truncate">
                    {user.role}
                  </span>
                )}
                {user.role && roleConfig && (
                  <span className="text-slate-600 text-[11px]">·</span>
                )}
                {roleConfig && (
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wide ${roleConfig.color}`}
                  >
                    {roleConfig.label}
                  </span>
                )}
              </div>
            </div>
            <ChevronUp
              className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                isOpen ? '' : 'rotate-180'
              }`}
            />
          </>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={`
            absolute bottom-full mb-2 rounded-xl shadow-2xl shadow-black/40 z-50
            bg-slate-900 border border-white/[0.08] overflow-hidden
            ${isCollapsed ? 'left-full ml-3 bottom-0 mb-0 w-60' : 'left-2 right-2'}
          `}
        >
          {/* User info header */}
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <p className="text-sm font-medium text-white">
              {user.name}
            </p>
            {user.email && (
              <p className="text-xs text-slate-400 mt-0.5">
                {user.email}
              </p>
            )}
            {/* Role badges */}
            <div className="flex items-center flex-wrap gap-1.5 mt-2.5">
              {roleConfig && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${roleConfig.bg} ${roleConfig.color}`}
                >
                  <Shield className="w-3 h-3" />
                  {roleConfig.label}
                </span>
              )}
              {user.role && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/[0.08] text-slate-300">
                  {user.role}
                </span>
              )}
            </div>

            {/* Contextual roles */}
            {user.contextualRoles && user.contextualRoles.length > 0 && (
              <div className="mt-3 pt-2.5 border-t border-white/[0.06]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 mb-1.5">
                  Active Roles
                </p>
                <div className="space-y-1">
                  {user.contextualRoles.slice(0, 3).map((cr, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-300">
                        {cr.label}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {cr.scopeName}
                      </span>
                    </div>
                  ))}
                  {user.contextualRoles.length > 3 && (
                    <p className="text-[10px] text-slate-500">
                      +{user.contextualRoles.length - 3} more
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Menu items */}
          <div className="py-1">
            <button
              onClick={() => {
                onPermissions?.()
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/[0.06] hover:text-white transition-all duration-150"
            >
              <KeyRound className="w-4 h-4 text-slate-500" />
              <span>My Permissions</span>
            </button>

            <button
              onClick={() => {
                onSettings?.()
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/[0.06] hover:text-white transition-all duration-150"
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <span>Settings</span>
            </button>

            <button
              onClick={() => {
                onHelp?.()
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/[0.06] hover:text-white transition-all duration-150"
            >
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span>Help</span>
            </button>
          </div>

          <div className="border-t border-white/[0.06] py-1">
            <button
              onClick={() => {
                onLogout?.()
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-150"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
