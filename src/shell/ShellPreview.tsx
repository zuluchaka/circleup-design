import { useState } from 'react'
import {
  Home,
  Building2,
  Users,
  CircleDollarSign,
  Wallet,
  CreditCard,
  Layers,
  Vote,
  FileText,
  FolderKanban,
  MessageSquare,
  Heart,
  BarChart3,
  Sparkles,
  Network,
  ShieldCheck,
  UserCog,
  TrendingUp,
  ArrowUpRight,
  Calendar,
} from 'lucide-react'
import { AppShell, type NavGroup, type User, type AccessMode } from './components'
import { getSectionScreenDesigns } from '@/lib/section-loader'
import { loadShellInfo } from '@/lib/shell-loader'
import { loadProductData } from '@/lib/product-loader'

// --------------------------------------------------------------------------
// Icon + badge maps
// --------------------------------------------------------------------------

const iconMap: Record<string, typeof Home> = {
  '/': Home,
  '/associations': Building2,
  '/members': Users,
  '/circles': CircleDollarSign,
  '/treasury': Wallet,
  '/credit': CreditCard,
  '/multi-share': Layers,
  '/governance': Vote,
  '/documents': FileText,
  '/projects': FolderKanban,
  '/communication': MessageSquare,
  '/community': Heart,
  '/analytics': BarChart3,
  '/insights': Sparkles,
  '/federations': Network,
  '/admin': ShieldCheck,
}

const badgeMap: Record<string, number> = {
  '/circles': 3,
  '/governance': 1,
  '/communication': 5,
  '/admin': 2,
}

// --------------------------------------------------------------------------
// RBAC permission profiles per user type
// --------------------------------------------------------------------------

type PermissionProfile = Record<string, AccessMode>

const adminPermissions: PermissionProfile = {
  '/': 'read_write',
  '/associations': 'read_write',
  '/members': 'read_write',
  '/circles': 'read_write',
  '/treasury': 'read_write',
  '/credit': 'read_write',
  '/multi-share': 'read_write',
  '/governance': 'read_write',
  '/documents': 'read_write',
  '/projects': 'read_write',
  '/communication': 'read_write',
  '/community': 'read_write',
  '/analytics': 'read_write',
  '/insights': 'read_write',
  '/federations': 'read_write',
  '/admin': 'read_write',
}

const treasurerPermissions: PermissionProfile = {
  '/': 'read_write',
  '/associations': 'read_write',
  '/members': 'read_write',
  '/circles': 'read_write',
  '/treasury': 'read_write',
  '/credit': 'read_write',
  '/multi-share': 'read_write',
  '/governance': 'read',
  '/documents': 'read_write',
  '/projects': 'read_write',
  '/communication': 'read_write',
  '/community': 'read_write',
  '/analytics': 'read_write',
  '/insights': 'read',
  '/federations': 'none',
  '/admin': 'none',
}

const memberPermissions: PermissionProfile = {
  '/': 'read_write',
  '/associations': 'read',
  '/members': 'read',
  '/circles': 'read_write',
  '/treasury': 'read',
  '/credit': 'read_write',
  '/multi-share': 'read',
  '/governance': 'read_write',
  '/documents': 'read',
  '/projects': 'read',
  '/communication': 'read_write',
  '/community': 'read_write',
  '/analytics': 'read',
  '/insights': 'none',
  '/federations': 'none',
  '/admin': 'none',
}

const inviteePermissions: PermissionProfile = {
  '/': 'read',
  '/associations': 'read',
  '/members': 'none',
  '/circles': 'read',
  '/treasury': 'none',
  '/credit': 'none',
  '/multi-share': 'none',
  '/governance': 'none',
  '/documents': 'none',
  '/projects': 'read',
  '/communication': 'read',
  '/community': 'read',
  '/analytics': 'none',
  '/insights': 'none',
  '/federations': 'none',
  '/admin': 'none',
}

// --------------------------------------------------------------------------
// User profiles
// --------------------------------------------------------------------------

interface UserProfile {
  user: User
  permissions: PermissionProfile
  label: string
  description: string
}

const userProfiles: Record<string, UserProfile> = {
  admin: {
    label: 'Platform Admin',
    description: 'Full access to all features including admin panel and federations',
    user: {
      name: 'Amara Okafor',
      email: 'amara@circleup.ch',
      role: 'Platform Admin',
      accessRole: 'admin',
      contextualRoles: [
        { label: 'Platform Administrator', scope: 'federation', scopeName: 'CircleUp Global' },
        { label: 'Federation President', scope: 'federation', scopeName: 'Swiss Diaspora Fed.' },
        { label: 'Association Treasurer', scope: 'association', scopeName: 'Geneva Tontine' },
      ],
    },
    permissions: adminPermissions,
  },
  treasurer: {
    label: 'Treasurer',
    description: 'Finance access, read-only governance and AI, no admin or federations',
    user: {
      name: 'Kofi Mensah',
      email: 'kofi@example.com',
      role: 'Treasurer',
      accessRole: 'standard_user',
      contextualRoles: [
        { label: 'Treasurer', scope: 'association', scopeName: 'Geneva Tontine' },
        { label: 'Circle Organizer', scope: 'circle', scopeName: 'Monthly Savings' },
      ],
    },
    permissions: treasurerPermissions,
  },
  member: {
    label: 'Member',
    description: 'Basic access with several read-only sections, no admin features',
    user: {
      name: 'Fatou Diallo',
      email: 'fatou@example.com',
      role: 'Member',
      accessRole: 'standard_user',
      contextualRoles: [
        { label: 'Circle Member', scope: 'circle', scopeName: 'Monthly Savings' },
        { label: 'Association Member', scope: 'association', scopeName: 'Geneva Tontine' },
      ],
    },
    permissions: memberPermissions,
  },
  invitee: {
    label: 'Invitee',
    description: 'Minimal access — can only browse a few sections in read-only',
    user: {
      name: 'Jean Dupont',
      email: 'jean@example.com',
      role: 'Invitee',
      accessRole: 'invitee',
      contextualRoles: [],
    },
    permissions: inviteePermissions,
  },
}

// --------------------------------------------------------------------------
// Navigation builder (from shell spec)
// --------------------------------------------------------------------------

function buildShellNavigation() {
  const shellInfo = loadShellInfo()
  const productData = loadProductData()
  const specGroups = shellInfo?.spec?.navigationGroups || []
  const sections = productData.roadmap?.sections || []

  const sectionByTitle = new Map<string, string>()
  const sectionBySlug = new Map<string, string>()
  for (const sec of sections) {
    sectionByTitle.set(sec.title.toLowerCase(), sec.id)
    sectionBySlug.set(sec.id, sec.id)
  }

  const hrefToScreenDesignUrl = new Map<string, string>()

  for (const group of specGroups) {
    for (const item of group.items) {
      const label = item.label.toLowerCase()
      let sectionId: string | undefined =
        sectionByTitle.get(label) ||
        sectionBySlug.get(
          label.replace(/\s+&\s+/g, '-and-').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        )

      if (!sectionId) {
        for (const [title, id] of sectionByTitle) {
          if (title.startsWith(label) || label.startsWith(title.split(' ')[0])) {
            sectionId = id
            break
          }
        }
      }

      if (!sectionId) {
        sectionId = sectionBySlug.get(item.href.replace(/^\//, ''))
      }

      if (sectionId) {
        const designs = getSectionScreenDesigns(sectionId)
        if (designs.length > 0) {
          hrefToScreenDesignUrl.set(
            item.href,
            `/sections/${sectionId}/screen-designs/${designs[0].name}/fullscreen`
          )
        }
      }
    }
  }

  return { specGroups, hrefToScreenDesignUrl }
}

const shellNav = buildShellNavigation()

// --------------------------------------------------------------------------
// Component
// --------------------------------------------------------------------------

export default function ShellPreview() {
  const [activeProfileKey, setActiveProfileKey] = useState<string>('admin')
  const [activeHref, setActiveHref] = useState('/')

  const profile = userProfiles[activeProfileKey]

  const navigationGroups: NavGroup[] = shellNav.specGroups.map((group) => ({
    label: group.label,
    items: group.items.map((item) => ({
      label: item.label,
      href: item.href,
      icon: iconMap[item.href],
      badge: badgeMap[item.href],
      isActive: item.href === activeHref,
      accessMode: profile.permissions[item.href] || 'read_write',
    })),
  }))

  const handleNavigate = (href: string) => {
    setActiveHref(href)
    const targetUrl = shellNav.hrefToScreenDesignUrl.get(href)
    if (targetUrl) {
      window.location.href = targetUrl
    }
  }

  const allItems = navigationGroups.flatMap((g) => g.items)
  const visibleCount = allItems.filter((i) => i.accessMode !== 'none').length
  const readOnlyCount = allItems.filter((i) => i.accessMode === 'read').length
  const hiddenCount = allItems.filter((i) => i.accessMode === 'none').length
  const fullAccessCount = visibleCount - readOnlyCount

  return (
    <AppShell
      navigationGroups={navigationGroups}
      user={profile.user}
      onNavigate={handleNavigate}
      onLogout={() => console.log('Logout')}
      onPermissions={() => console.log('View permissions')}
    >
      <div className="p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Role switcher card */}
          <div className="mb-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                <UserCog className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Preview as User Role
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  See how navigation adapts to RBAC permissions
                </p>
              </div>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                {Object.entries(userProfiles).map(([key, p]) => (
                  <button
                    key={key}
                    onClick={() => setActiveProfileKey(key)}
                    className={`text-left p-3.5 rounded-xl border-2 transition-all duration-200 ${
                      activeProfileKey === key
                        ? 'border-indigo-500 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10'
                        : 'border-transparent bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span
                      className={`text-sm font-semibold ${
                        activeProfileKey === key
                          ? 'text-indigo-700 dark:text-indigo-300'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {p.label}
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                      {p.description}
                    </p>
                  </button>
                ))}
              </div>

              {/* Permission summary bar */}
              <div className="flex items-center gap-5 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    {fullAccessCount} full access
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    {readOnlyCount} read-only
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    {hiddenCount} hidden
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
              Welcome back, {profile.user.name.split(' ')[0]}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Here's what's happening with your associations today.
            </p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Active Circles
                </p>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                  <CircleDollarSign className="w-4 h-4 text-indigo-500" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">3</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">+1 this month</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Next Contribution
                </p>
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-amber-500" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                CHF 200
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Due Jan 15</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Trust Score
                </p>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">892</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: '89.2%' }} />
                </div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Excellent</span>
              </div>
            </div>
          </div>

          {/* Content placeholder */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <Home className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Section screen designs will render here
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Click a nav item to navigate to its screen design
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
