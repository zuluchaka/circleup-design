import { useState } from 'react'
import { Menu, X, PanelLeftClose, PanelLeft } from 'lucide-react'
import { MainNav, type NavGroup } from './MainNav'
import { UserMenu, type User } from './UserMenu'

export interface AppShellProps {
  children: React.ReactNode
  navigationGroups: NavGroup[]
  user?: User
  onNavigate?: (href: string) => void
  onLogout?: () => void
  onPermissions?: () => void
  defaultCollapsed?: boolean
}

export function AppShell({
  children,
  navigationGroups,
  user,
  onNavigate,
  onLogout,
  onPermissions,
  defaultCollapsed = false,
}: AppShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleNavigate = (href: string) => {
    onNavigate?.(href)
    setIsMobileOpen(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 flex items-center px-4 gap-3">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 -ml-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-150"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-500/25">
            <span className="text-white font-bold text-xs tracking-tight">C</span>
          </div>
          <span className="font-semibold text-slate-900 dark:text-white text-sm tracking-tight">
            CircleUp
          </span>
        </div>
        {user && (
          <div className="ml-auto">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
              <span className="text-[10px] font-bold text-white">
                {user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            </div>
          </div>
        )}
      </header>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full flex flex-col
          bg-slate-950 dark:bg-slate-950
          transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${isCollapsed ? 'w-[68px]' : 'w-[260px]'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div
          className={`h-16 flex items-center shrink-0 border-b border-white/[0.06] ${
            isCollapsed ? 'justify-center px-3' : 'px-5'
          }`}
        >
          {isCollapsed ? (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white font-bold text-sm tracking-tight">C</span>
            </div>
          ) : (
            <div className="flex items-center gap-3 flex-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
                <span className="text-white font-bold text-sm tracking-tight">C</span>
              </div>
              <div>
                <span className="font-semibold text-white text-[15px] tracking-tight">CircleUp</span>
                <span className="block text-[10px] text-slate-500 tracking-wide uppercase font-medium">Platform</span>
              </div>
            </div>
          )}

          {/* Mobile close */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden ml-auto p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-150"
            aria-label="Close navigation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <MainNav
            groups={navigationGroups}
            isCollapsed={isCollapsed}
            onNavigate={handleNavigate}
          />
        </div>

        {/* Bottom section: user + collapse */}
        <div className="shrink-0 border-t border-white/[0.06]">
          {user && (
            <UserMenu
              user={user}
              isCollapsed={isCollapsed}
              onLogout={onLogout}
              onPermissions={onPermissions}
            />
          )}

          {/* Collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`
              hidden lg:flex w-full items-center gap-3 px-4 py-3 text-xs
              text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] transition-all duration-150
              ${isCollapsed ? 'justify-center' : ''}
            `}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <PanelLeft className="w-4 h-4" strokeWidth={1.5} />
            ) : (
              <>
                <PanelLeftClose className="w-4 h-4" strokeWidth={1.5} />
                <span className="tracking-wide">Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={`
          transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] min-h-screen
          pt-14 lg:pt-0
          ${isCollapsed ? 'lg:pl-[68px]' : 'lg:pl-[260px]'}
        `}
      >
        {children}
      </main>
    </div>
  )
}
