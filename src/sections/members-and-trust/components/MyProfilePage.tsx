import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { NetworkGraphViewer, type NetworkGraphData, type NetworkNode as GraphNetworkNode } from '@/components/network-graph'
import type { NetworkGraphViewerHandle } from '@/components/network-graph/NetworkGraphViewer'
import { TrustScoreGauge } from './TrustScoreGauge'
import { RoleBadge } from './RoleBadge'
import type {
  TrustScore,
  Reference,
  ScoreImprovementTip,
  TrustScoreFactors,
  Feedback,
  MemberDocument,
  PaymentMethodInfo,
  ProfilePayment,
  ActivityItem,
} from '@/../product/sections/members-and-trust/types'
import {
  Shield,
  Target,
  CreditCard,
  Star,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Info,
  Plus,
  Trash2,
  Sparkles,
  Award,
  AlertCircle,
  FileText,
  Users,
  UserCheck,
  ChevronDown,
  RefreshCw,
  ArrowUpRight,
  ArrowDownLeft,
  CircleDollarSign,
  Eye,
  PenLine,
  Upload,
  Bell,
  Calendar,
  MessageCircle,
  Megaphone,
  Vote,
  UserPlus,
  Network,
  Building2,
  TrendingUp,
} from 'lucide-react'
import { countries, genderOptions } from '@/data/auth-data'

type TabId = 'overview' | 'network' | 'trust-score' | 'financial' | 'documents' | 'payments' | 'activity'

const categoryColors: Record<MemberDocument['category'], { bg: string; text: string; darkBg: string; darkText: string; label: string }> = {
  agreements: { bg: 'bg-indigo-100', text: 'text-indigo-700', darkBg: 'dark:bg-indigo-900/50', darkText: 'dark:text-indigo-300', label: 'Agreement' },
  minutes: { bg: 'bg-emerald-100', text: 'text-emerald-700', darkBg: 'dark:bg-emerald-900/50', darkText: 'dark:text-emerald-300', label: 'Minutes' },
  financial: { bg: 'bg-amber-100', text: 'text-amber-700', darkBg: 'dark:bg-amber-900/50', darkText: 'dark:text-amber-300', label: 'Financial' },
  policies: { bg: 'bg-purple-100', text: 'text-purple-700', darkBg: 'dark:bg-purple-900/50', darkText: 'dark:text-purple-300', label: 'Policy' },
  forms: { bg: 'bg-rose-100', text: 'text-rose-700', darkBg: 'dark:bg-rose-900/50', darkText: 'dark:text-rose-300', label: 'Form' },
  personal: { bg: 'bg-sky-100', text: 'text-sky-700', darkBg: 'dark:bg-sky-900/50', darkText: 'dark:text-sky-300', label: 'Personal' },
}

const categoryIconColors: Record<MemberDocument['category'], string> = {
  agreements: 'text-indigo-500',
  minutes: 'text-emerald-500',
  financial: 'text-amber-500',
  policies: 'text-purple-500',
  forms: 'text-rose-500',
  personal: 'text-sky-500',
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatCurrency(amount: number, currency = 'CHF') {
  return new Intl.NumberFormat('de-CH', { style: 'currency', currency }).format(amount)
}

interface MyProfilePageProps {
  trustScore: TrustScore
  references: Reference[]
  improvementTips: ScoreImprovementTip[]
  paymentMethods: PaymentMethodInfo[]
  feedback: Feedback[]
  documents: MemberDocument[]
  payments: ProfilePayment[]
  verificationStatus?: 'unverified' | 'verified'
  onAddCard?: () => void
  onRemoveCard?: (id: string) => void
  activities?: ActivityItem[]
  onViewDocument?: (id: string) => void
  onUploadDocument?: () => void
  onDeleteDocument?: (id: string) => void
  onEditProfile?: () => void
}

function getFactorIcon(factor: keyof TrustScoreFactors) {
  const icons = {
    paymentHistory: <CreditCard className="w-5 h-5" />,
    verification: <Shield className="w-5 h-5" />,
    tenure: <Clock className="w-5 h-5" />,
    engagement: <Users className="w-5 h-5" />,
    network: <UserCheck className="w-5 h-5" />,
    external: <FileText className="w-5 h-5" />,
  }
  return icons[factor]
}

export function MyProfilePage({
  trustScore,
  references,
  improvementTips,
  paymentMethods,
  feedback,
  documents,
  verificationStatus = 'unverified',
  activities = [],
  onAddCard,
  onRemoveCard,
  onViewDocument,
  onUploadDocument,
  onDeleteDocument,
  onEditProfile,
  payments,
}: MyProfilePageProps) {
  const { user: authUser, token } = useAuth()
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [selectedFactor, setSelectedFactor] = useState<keyof TrustScoreFactors | null>(null)
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null)

  // Network graph data
  interface NetworkNode { id: string; label: string; type: string; status?: string; group?: string; metadata?: Record<string, unknown> }
  interface NetworkEdge { source: string; target: string; type: string; label?: string }
  const [networkNodes, setNetworkNodes] = useState<NetworkNode[]>([])
  const [networkEdges, setNetworkEdges] = useState<NetworkEdge[]>([])
  const [networkLoading, setNetworkLoading] = useState(false)
  const [networkError, setNetworkError] = useState<string | null>(null)
  const [graphData, setGraphData] = useState<NetworkGraphData | null>(null)
  const [selectedGraphNode, setSelectedGraphNode] = useState<GraphNetworkNode | null>(null)
  const graphRef = useRef<NetworkGraphViewerHandle>(null)

  const loadNetwork = useCallback(async () => {
    if (!token) return
    setNetworkLoading(true)
    setNetworkError(null)
    try {
      const res = await fetch('/api/v1/network_graph/member', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to load network')
      const json = await res.json()
      const data = json.data || json
      setNetworkNodes(data.nodes || [])
      setNetworkEdges(data.edges || [])
      setGraphData({
        nodes: data.nodes || [],
        edges: data.edges || [],
        centerNodeId: data.centerNodeId,
        totalNodes: data.totalNodes,
        totalEdges: data.totalEdges,
      })
    } catch (e) {
      setNetworkError(e instanceof Error ? e.message : 'Failed to load network')
    } finally {
      setNetworkLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (activeTab === 'network' && networkNodes.length === 0 && !networkLoading) {
      loadNetwork()
    }
  }, [activeTab, networkNodes.length, networkLoading, loadNetwork])

  if (!authUser) return null

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const formatDateTimeUTC = (date: string) => {
    const d = new Date(date)
    return d.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC')
  }

  const initials = `${authUser.firstName?.charAt(0) || ''}${authUser.lastName?.charAt(0) || ''}`.toUpperCase() || authUser.email.charAt(0).toUpperCase()

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Target className="w-4 h-4" /> },
    { id: 'network', label: 'Network', icon: <Network className="w-4 h-4" /> },
    { id: 'trust-score', label: 'Trust Score', icon: <Shield className="w-4 h-4" /> },
    { id: 'financial', label: 'Financial', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'documents', label: 'Documents', icon: <FileText className="w-4 h-4" /> },
    { id: 'payments', label: 'Payments', icon: <CircleDollarSign className="w-4 h-4" /> },
    { id: 'activity', label: 'Activity', icon: <Star className="w-4 h-4" /> },
  ]

  const factorOrder: (keyof TrustScoreFactors)[] = ['paymentHistory', 'verification', 'tenure', 'engagement', 'network', 'external']

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {authUser.updatedAt && (
            <div className="flex justify-end mb-2">
              <span className="text-xs text-white/60 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Last updated {formatDateTimeUTC(authUser.updatedAt)}
              </span>
            </div>
          )}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            {authUser.avatarUrl ? (
              <img
                src={authUser.avatarUrl}
                alt={authUser.fullName}
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white/30 shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-white/30">
                {initials}
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold">{authUser.fullName}</h1>
                <RoleBadge role={authUser.role as any} />
                {authUser.kycVerified ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-200">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-200">
                    <ShieldAlert className="w-3 h-3" />
                    Unverified
                  </span>
                )}
                {onEditProfile && (
                  <button
                    onClick={onEditProfile}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/15 hover:bg-white/25 transition-colors backdrop-blur-sm"
                  >
                    <PenLine className="w-3 h-3" />
                    Edit Profile
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-sm text-white/70 mt-1">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4" />
                  {authUser.email}
                </span>
                {authUser.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4" />
                    {authUser.phoneCountryCode && !authUser.phone.startsWith(authUser.phoneCountryCode) ? `${authUser.phoneCountryCode} ` : ''}{authUser.phone}
                  </span>
                )}
                {(authUser.city || authUser.addressCountryCode) ? (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {[authUser.city, authUser.addressCountryCode ? countries.find(c => c.code === authUser.addressCountryCode)?.name ?? authUser.addressCountryCode : null].filter(Boolean).join(', ')}
                  </span>
                ) : authUser.location ? (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {authUser.location}
                  </span>
                ) : null}
              </div>

              {authUser.bio && (
                <p className="mt-2 text-sm text-white/60 max-w-lg">{authUser.bio}</p>
              )}

              {/* Trust Score Badge */}
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 rounded-full backdrop-blur-sm">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-semibold">{trustScore.score}</span>
                <span className="text-xs text-white/70">Trust Score</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-8 flex gap-1 border-b border-white/20">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-white text-white'
                    : 'border-transparent text-white/60 hover:text-white/90'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ============ OVERVIEW TAB ============ */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {verificationStatus === 'unverified' && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="p-2.5 bg-amber-100 dark:bg-amber-900/50 rounded-lg shrink-0">
                    <CreditCard className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-200">Add a payment method to unlock full access</h3>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-0.5">
                      A verified payment card is required to create associations, circles, and events. Add a card to get started.
                    </p>
                  </div>
                  <button
                    onClick={() => onAddCard?.()}
                    className="shrink-0 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Card
                  </button>
                </div>
              </div>
            )}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Trust Score Gauge */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Trust Score</h2>
                <TrustScoreGauge
                  trustScore={trustScore}
                  improvementTips={improvementTips}
                  isOwnScore
                  size="md"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Participation Stats */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Participation</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {authUser.participation?.activeCircles ?? 0}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Active Circles</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {authUser.participation?.referencesCount ?? references.length}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">References</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {authUser.participation?.onTimeRate ?? 0}%
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">On-time Rate</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {authUser.participation?.completedCircles ?? 0}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Completed</p>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              {(() => {
                const genderLabel = authUser.gender ? genderOptions.find(g => g.value === authUser.gender)?.label : null
                const nationalityCountry = authUser.nationality ? countries.find(c => c.code === authUser.nationality) : null
                const phone = authUser.phone
                  ? (authUser.phoneCountryCode && !authUser.phone.startsWith(authUser.phoneCountryCode)
                      ? `${authUser.phoneCountryCode} ${authUser.phone}`
                      : authUser.phone)
                  : null
                const addressParts = [
                  [authUser.street, authUser.houseNumber].filter(Boolean).join(' '),
                  [authUser.postcode, authUser.city].filter(Boolean).join(' '),
                  authUser.addressCountryCode ? countries.find(c => c.code === authUser.addressCountryCode)?.name : null,
                ].filter(Boolean)
                const hasAnyField = genderLabel || authUser.dateOfBirth || nationalityCountry || phone || addressParts.length > 0

                if (!hasAnyField) return null

                return (
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Personal Information</h2>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {genderLabel && (
                        <div>
                          <dt className="text-sm text-slate-500 dark:text-slate-400">Gender</dt>
                          <dd className="text-slate-900 dark:text-white font-medium">{genderLabel}</dd>
                        </div>
                      )}
                      {authUser.dateOfBirth && (
                        <div>
                          <dt className="text-sm text-slate-500 dark:text-slate-400">Date of Birth</dt>
                          <dd className="text-slate-900 dark:text-white font-medium">
                            {new Date(authUser.dateOfBirth).toLocaleDateString()}
                          </dd>
                        </div>
                      )}
                      {nationalityCountry && (
                        <div>
                          <dt className="text-sm text-slate-500 dark:text-slate-400">Nationality</dt>
                          <dd className="text-slate-900 dark:text-white font-medium">
                            {nationalityCountry.flag} {nationalityCountry.name}
                          </dd>
                        </div>
                      )}
                      {phone && (
                        <div>
                          <dt className="text-sm text-slate-500 dark:text-slate-400">Phone</dt>
                          <dd className="text-slate-900 dark:text-white font-medium">{phone}</dd>
                        </div>
                      )}
                      {addressParts.length > 0 && (
                        <div className="sm:col-span-2">
                          <dt className="text-sm text-slate-500 dark:text-slate-400">Address</dt>
                          <dd className="text-slate-900 dark:text-white font-medium">
                            {addressParts.map((line, i) => (
                              <span key={i}>
                                {line}
                                {i < addressParts.length - 1 && <br />}
                              </span>
                            ))}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                )
              })()}

              {/* Payment History */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Payment History</h2>
                <div className="flex gap-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">
                        {(() => { const rate = authUser.participation?.onTimeRate ?? 0; return rate >= 80 ? 'Excellent' : rate >= 60 ? 'Good' : rate > 0 ? 'Fair' : 'N/A' })()}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">On-time</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                      <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">
                        {authUser.participation?.onTimeRate ?? 0}%
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Rate</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Membership Details */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Membership Details</h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm text-slate-500 dark:text-slate-400">Role</dt>
                    <dd className="text-slate-900 dark:text-white font-medium capitalize">{authUser.role === 'platform_admin' ? 'Platform Admin' : 'Member'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-slate-500 dark:text-slate-400">KYC Status</dt>
                    <dd className="text-slate-900 dark:text-white font-medium">
                      {authUser.kycVerified ? 'Verified' : 'Not Verified'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-slate-500 dark:text-slate-400">Trust Level</dt>
                    <dd className="text-slate-900 dark:text-white font-medium capitalize">{authUser.trustLevel}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-slate-500 dark:text-slate-400">Email Verified</dt>
                    <dd className="text-slate-900 dark:text-white font-medium">
                      {authUser.emailVerified ? 'Yes' : 'No'}
                    </dd>
                  </div>
                  {authUser.createdAt && (
                    <div>
                      <dt className="text-sm text-slate-500 dark:text-slate-400">Member Since</dt>
                      <dd className="text-slate-900 dark:text-white font-medium">{formatDate(authUser.createdAt)}</dd>
                    </div>
                  )}
                  {authUser.associationRoles && authUser.associationRoles.length > 0 && (
                    <div className="sm:col-span-2">
                      <dt className="text-sm text-slate-500 dark:text-slate-400">Associations</dt>
                      <dd className="text-slate-900 dark:text-white font-medium">
                        {authUser.associationRoles.map(a => a.associationName).join(', ')}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
          </div>
        )}

        {/* ============ NETWORK TAB ============ */}
        {activeTab === 'network' && (
          <div className="space-y-6">
            {networkLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : networkError ? (
              <div className="text-center py-12">
                <p className="text-red-500 dark:text-red-400 mb-4">{networkError}</p>
                <button onClick={loadNetwork} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">Retry</button>
              </div>
            ) : (() => {
              const associations = networkNodes.filter(n => n.type === 'association')
              const circles = networkNodes.filter(n => n.type === 'circle')
              const badges = networkNodes.filter(n => n.type === 'badge')
              const trustNode = networkNodes.find(n => n.type === 'trust_score')
              const savingsGoals = networkNodes.filter(n => n.type === 'savings_goal')
              const memberAccounts = networkNodes.filter(n => n.type === 'member_account')

              return (
                <>
                  {/* Network Graph */}
                  {graphData && graphData.nodes.length > 0 && (
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-slate-800">
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">Network Graph</h2>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => graphRef.current?.zoomIn()}
                            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                            title="Zoom in"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                          </button>
                          <button
                            onClick={() => graphRef.current?.zoomOut()}
                            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                            title="Zoom out"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" /></svg>
                          </button>
                          <button
                            onClick={() => graphRef.current?.fitToScreen()}
                            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                            title="Fit to screen"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                          </button>
                        </div>
                      </div>
                      <div style={{ height: 420 }}>
                        <NetworkGraphViewer
                          ref={graphRef}
                          data={graphData}
                          selectedNode={selectedGraphNode}
                          onNodeClick={(node) => setSelectedGraphNode(node)}
                          onNodeDoubleClick={() => {}}
                        />
                      </div>
                      {selectedGraphNode && (
                        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedGraphNode.label}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{selectedGraphNode.type.replace(/_/g, ' ')}{selectedGraphNode.status ? ` · ${selectedGraphNode.status}` : ''}</p>
                            </div>
                            <button
                              onClick={() => setSelectedGraphNode(null)}
                              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            >
                              Clear
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-5 text-white">
                      <p className="text-indigo-200 text-xs font-medium">Connections</p>
                      <p className="text-2xl font-bold mt-1">{networkEdges.length}</p>
                      <p className="text-indigo-300 text-xs mt-1">{associations.length} association{associations.length !== 1 ? 's' : ''} · {circles.length} circle{circles.length !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
                      <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Trust Score</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                        {trustNode?.metadata?.score ?? trustScore.score}
                      </p>
                      <p className="text-slate-400 text-xs mt-1">{trustScore.trend === 'up' ? 'Trending up' : trustScore.trend === 'down' ? 'Trending down' : 'Stable'}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
                      <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Badges</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{badges.length}</p>
                      <p className="text-slate-400 text-xs mt-1">Earned achievements</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
                      <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">References</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{references.length}</p>
                      <p className="text-slate-400 text-xs mt-1">From peers</p>
                    </div>
                  </div>

                  {/* Associations */}
                  {associations.length > 0 && (
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-indigo-500" />
                        Associations ({associations.length})
                      </h2>
                      <div className="space-y-3">
                        {associations.map(assoc => {
                          const edge = networkEdges.find(e => e.target === assoc.id || e.source === assoc.id)
                          return (
                            <div key={assoc.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                                  <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                  <p className="font-medium text-slate-900 dark:text-white">{assoc.label}</p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {edge?.label || 'Member'}
                                    {assoc.status && ` · ${assoc.status}`}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Circles */}
                  {circles.length > 0 && (
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <CircleDollarSign className="w-5 h-5 text-emerald-500" />
                        Circles ({circles.length})
                      </h2>
                      <div className="space-y-3">
                        {circles.map(circle => {
                          const edge = networkEdges.find(e => e.target === circle.id || e.source === circle.id)
                          return (
                            <div key={circle.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                  <CircleDollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                  <p className="font-medium text-slate-900 dark:text-white">{circle.label}</p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {edge?.label || 'Participant'}
                                    {circle.status && (
                                      <span className={`ml-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                                        circle.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' :
                                        circle.status === 'forming' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                                        'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                                      }`}>
                                        {circle.status}
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>
                              {circle.metadata?.contributionAmount && (
                                <p className="text-sm font-medium text-slate-900 dark:text-white">
                                  {String(circle.metadata.currency || 'CHF')} {Number(circle.metadata.contributionAmount).toFixed(2)}
                                </p>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Member Accounts */}
                  {memberAccounts.length > 0 && (
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-blue-500" />
                        Ledger Accounts ({memberAccounts.length})
                      </h2>
                      <div className="space-y-3">
                        {memberAccounts.map(acct => (
                          <div key={acct.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">{acct.label}</p>
                              {acct.metadata?.account_number && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{String(acct.metadata.account_number)}</p>
                              )}
                            </div>
                            {acct.metadata?.balance !== undefined && (
                              <p className={`text-sm font-semibold font-mono ${Number(acct.metadata.balance) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                {String(acct.metadata.currency || 'CHF')} {Number(acct.metadata.balance).toFixed(2)}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Badges */}
                  {badges.length > 0 && (
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-500" />
                        Badges ({badges.length})
                      </h2>
                      <div className="flex flex-wrap gap-3">
                        {badges.map(badge => (
                          <div key={badge.id} className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                            <Award className="w-4 h-4 text-amber-500" />
                            <span className="text-sm font-medium text-amber-800 dark:text-amber-300">{badge.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Savings Goals */}
                  {savingsGoals.length > 0 && (
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-500" />
                        Savings Goals ({savingsGoals.length})
                      </h2>
                      <div className="space-y-4">
                        {savingsGoals.map(goal => {
                          const target = Number(goal.metadata?.target || 0)
                          const current = Number(goal.metadata?.current || 0)
                          const progress = target > 0 ? Math.round((current / target) * 100) : 0
                          return (
                            <div key={goal.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <p className="font-medium text-slate-900 dark:text-white">{goal.label}</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                  goal.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' :
                                  goal.status === 'warning' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                                  'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                                }`}>
                                  {goal.status === 'active' ? 'On Track' : goal.status === 'warning' ? 'Behind' : goal.status || 'Active'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-2">
                                <span>CHF {current.toFixed(2)} of CHF {target.toFixed(2)}</span>
                                <span>{progress}%</span>
                              </div>
                              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${goal.status === 'warning' ? 'bg-amber-500' : 'bg-indigo-500'}`}
                                  style={{ width: `${Math.min(progress, 100)}%` }}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Trust Score Factors */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Trust Score Factors</h2>
                    <div className="space-y-3">
                      {Object.entries(trustScore.factors).map(([key, factor]) => (
                        <div key={key} className="flex items-center gap-4">
                          <div className="w-28 text-sm text-slate-500 dark:text-slate-400 capitalize">{factor.label}</div>
                          <div className="flex-1">
                            <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  factor.score >= 70 ? 'bg-emerald-500' : factor.score >= 40 ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${Math.min(factor.score, 100)}%` }}
                              />
                            </div>
                          </div>
                          <div className="w-12 text-right text-sm font-medium text-slate-900 dark:text-white">{factor.score}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Empty state */}
                  {associations.length === 0 && circles.length === 0 && badges.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <Network className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Network is empty</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">Join associations and circles to build your network.</p>
                    </div>
                  )}
                </>
              )
            })()}
          </div>
        )}

        {/* ============ TRUST SCORE TAB ============ */}
        {activeTab === 'trust-score' && (
          <div className="space-y-6">
            {/* Score Breakdown */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="font-semibold text-slate-900 dark:text-white">Score Breakdown</h3>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Click any factor for tips</span>
                </div>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {factorOrder.map((key) => {
                  const factor = trustScore.factors[key]
                  const tip = improvementTips.find(t => t.factor === key)
                  const isSelected = selectedFactor === key
                  const isExcellent = factor.score >= 80

                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedFactor(isSelected ? null : key)}
                      className="w-full px-4 sm:px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          isExcellent
                            ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          {getFactorIcon(key)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-medium text-slate-900 dark:text-white text-sm">{factor.label}</span>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-semibold ${
                                factor.score >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
                                factor.score >= 60 ? 'text-amber-600 dark:text-amber-400' :
                                'text-red-600 dark:text-red-400'
                              }`}>
                                {factor.score}%
                              </span>
                              <span className="text-xs text-slate-400">({factor.weight}% weight)</span>
                            </div>
                          </div>
                          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                factor.score >= 80 ? 'bg-emerald-500' :
                                factor.score >= 60 ? 'bg-amber-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${factor.score}%` }}
                            />
                          </div>
                        </div>
                        {isExcellent ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                        )}
                      </div>

                      {isSelected && tip && (
                        <div className="mt-3 ml-12 p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-sm text-slate-700 dark:text-slate-300">
                          <div className="flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                            <p>{tip.tip}</p>
                          </div>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* References Summary */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="font-semibold text-slate-900 dark:text-white">My References</h3>
                </div>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {references.length} received
                </span>
              </div>

              {references.length > 0 ? (
                <div className="space-y-3">
                  {references.slice(0, 3).map((ref) => (
                    <div key={ref.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm text-slate-900 dark:text-white">
                          {ref.fromMemberName}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {ref.relationship}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                        "{ref.text}"
                      </p>
                    </div>
                  ))}
                  {references.length > 3 && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                      +{references.length - 3} more references
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Award className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">No references yet</p>
                </div>
              )}
            </div>

            {/* How Score is Calculated */}
            <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-4 sm:p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">How Your Score is Calculated</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Your trust score combines multiple factors to give other members and organizers
                confidence in your reliability. Payment history has the highest weight (40%),
                followed by verification level (20%), membership tenure (15%), community engagement (10%),
                network connections (10%), and external credit factors (5%).
              </p>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-500">
                Model version: {trustScore.modelVersion}
              </p>
            </div>
          </div>
        )}

        {/* ============ FINANCIAL TAB ============ */}
        {activeTab === 'financial' && (
          <div className="space-y-6">
            {/* Verification Status */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Verification Status</h2>
                {verificationStatus === 'verified' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                    <ShieldCheck className="w-4 h-4" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                    <ShieldAlert className="w-4 h-4" />
                    Unverified
                  </span>
                )}
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  A CHF 1.00 verification charge will be applied and refunded within 3 days.
                </p>
              </div>
            </div>

            {/* Linked Cards */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Linked Cards ({paymentMethods.length})
                </h2>
                <button
                  onClick={() => onAddCard?.()}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Card
                </button>
              </div>

              {paymentMethods.length > 0 ? (
                <div className="space-y-3">
                  {paymentMethods.map((pm) => {
                    const isExpanded = expandedCardId === pm.id
                    return (
                      <div
                        key={pm.id}
                        className="bg-slate-50 dark:bg-slate-800 rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() => setExpandedCardId(isExpanded ? null : pm.id)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                              <CreditCard className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-slate-900 dark:text-white capitalize">
                                  {pm.brand}
                                </span>
                                <span className="text-slate-600 dark:text-slate-400">
                                  &bull;&bull;&bull;&bull; {pm.last4}
                                </span>
                                {pm.isDefault && (
                                  <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 rounded">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                Expires {String(pm.expiryMonth).padStart(2, '0')}/{String(pm.expiryYear).slice(-2)}
                              </p>
                            </div>
                          </div>
                          <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>

                        {isExpanded && (
                          <div className="px-4 pb-4 border-t border-slate-200 dark:border-slate-700">
                            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 pt-4 text-sm">
                              <div>
                                <dt className="text-slate-500 dark:text-slate-400">Card Brand</dt>
                                <dd className="font-medium text-slate-900 dark:text-white capitalize">{pm.brand}</dd>
                              </div>
                              <div>
                                <dt className="text-slate-500 dark:text-slate-400">Last 4 Digits</dt>
                                <dd className="font-medium text-slate-900 dark:text-white">{pm.last4}</dd>
                              </div>
                              <div>
                                <dt className="text-slate-500 dark:text-slate-400">Expiry Date</dt>
                                <dd className="font-medium text-slate-900 dark:text-white">
                                  {String(pm.expiryMonth).padStart(2, '0')}/{pm.expiryYear}
                                </dd>
                              </div>
                              <div>
                                <dt className="text-slate-500 dark:text-slate-400">Payment Type</dt>
                                <dd className="font-medium text-slate-900 dark:text-white capitalize">
                                  {pm.methodType.replace('_', ' ')}
                                </dd>
                              </div>
                              <div>
                                <dt className="text-slate-500 dark:text-slate-400">Status</dt>
                                <dd>
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                                    pm.status === 'active'
                                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                                      : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                                  }`}>
                                    {pm.status === 'active' && <CheckCircle2 className="w-3 h-3" />}
                                    {pm.status.charAt(0).toUpperCase() + pm.status.slice(1)}
                                  </span>
                                </dd>
                              </div>
                              <div>
                                <dt className="text-slate-500 dark:text-slate-400">Default</dt>
                                <dd className="font-medium text-slate-900 dark:text-white">{pm.isDefault ? 'Yes' : 'No'}</dd>
                              </div>
                            </dl>
                            {pm.verificationCharge && (
                              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                                <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">Verification Transaction</h4>
                                <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <ShieldCheck className="w-4 h-4 text-indigo-500" />
                                      <span className="text-sm font-medium text-slate-900 dark:text-white">Verification Charge</span>
                                    </div>
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{pm.verificationCharge.amount}</span>
                                  </div>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                                    Charged on {formatDate(pm.verificationCharge.chargedAt)}
                                  </p>

                                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800">
                                    <div className="flex items-center gap-2">
                                      <RefreshCw className={`w-4 h-4 ${
                                        pm.verificationCharge.refundStatus === 'refunded'
                                          ? 'text-emerald-500'
                                          : 'text-amber-500'
                                      }`} />
                                      <span className="text-sm text-slate-700 dark:text-slate-300">Refund</span>
                                    </div>
                                    {pm.verificationCharge.refundStatus === 'refunded' ? (
                                      <div className="text-right">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                                          <CheckCircle2 className="w-3 h-3" />
                                          Refunded
                                        </span>
                                        {pm.verificationCharge.refundedAt && (
                                          <p className="text-xs text-slate-400 mt-0.5">{formatDate(pm.verificationCharge.refundedAt)}</p>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="text-right">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                                          <Clock className="w-3 h-3" />
                                          Pending
                                        </span>
                                        <p className="text-xs text-slate-400 mt-0.5">Within 3 days</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className={`mt-4 pt-3 ${pm.verificationCharge ? '' : 'border-t border-slate-200 dark:border-slate-700'}`}>
                              <button
                                onClick={() => onRemoveCard?.(pm.id)}
                                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                Remove Card
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">No cards linked yet</p>
                  <button
                    onClick={() => onAddCard?.()}
                    className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Your First Card
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============ DOCUMENTS TAB ============ */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Documents ({documents.length})
                </h2>
                {onUploadDocument && (
                  <button
                    onClick={onUploadDocument}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Upload
                  </button>
                )}
              </div>

              {/* Summary Stats */}
              {documents.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{documents.length}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Total</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-center">
                    <p className={`text-xl font-bold ${
                      documents.filter(d => d.requiresAcknowledgment && !d.acknowledged).length > 0
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-slate-900 dark:text-white'
                    }`}>
                      {documents.filter(d => d.requiresAcknowledgment && !d.acknowledged).length}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Pending Ack.</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-center">
                    <p className={`text-xl font-bold ${
                      documents.filter(d => d.requiresSignature && !d.signed).length > 0
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-slate-900 dark:text-white'
                    }`}>
                      {documents.filter(d => d.requiresSignature && !d.signed).length}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Pending Sig.</p>
                  </div>
                </div>
              )}

              {documents.length > 0 ? (
                <div className="space-y-3">
                  {documents.map((doc) => {
                    const cat = categoryColors[doc.category]
                    const iconColor = categoryIconColors[doc.category]
                    return (
                      <div
                        key={doc.id}
                        className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors cursor-pointer"
                        onClick={() => onViewDocument?.(doc.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${cat.bg} ${cat.darkBg} shrink-0`}>
                            <FileText className={`w-5 h-5 ${iconColor}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="font-medium text-slate-900 dark:text-white truncate">{doc.title}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                  {doc.fileName} · {formatFileSize(doc.fileSize)}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  onClick={(e) => { e.stopPropagation(); onViewDocument?.(doc.id) }}
                                  className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                {doc.category === 'personal' && onDeleteDocument && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); onDeleteDocument(doc.id) }}
                                    className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cat.bg} ${cat.text} ${cat.darkBg} ${cat.darkText}`}>
                                {cat.label}
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">{doc.circleName}</span>

                              {doc.requiresSignature && (
                                doc.signed ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Signed
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                                    <PenLine className="w-3 h-3" />
                                    Needs Signature
                                  </span>
                                )
                              )}

                              {doc.requiresAcknowledgment && !doc.requiresSignature && (
                                doc.acknowledged ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Acknowledged
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                                    <AlertCircle className="w-3 h-3" />
                                    Needs Ack.
                                  </span>
                                )
                              )}
                            </div>

                            <p className="mt-2 text-xs text-slate-400">{formatDate(doc.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400 mb-3">No documents yet</p>
                  {onUploadDocument && (
                    <button
                      onClick={onUploadDocument}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Upload your first document
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============ PAYMENTS TAB ============ */}
        {activeTab === 'payments' && (() => {
          const allTransactions = [...payments].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          const totalDebits = allTransactions
            .filter(t => t.direction === 'debit' && (t.status === 'completed' || t.status === 'pending_refund'))
            .reduce((sum, t) => sum + t.amount, 0)
          const totalCredits = allTransactions
            .filter(t => t.direction === 'credit' && t.status === 'completed')
            .reduce((sum, t) => sum + t.amount, 0)
          const pendingCount = allTransactions.filter(t => t.status === 'pending' || t.status === 'processing').length

          return (
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                      <ArrowUpRight className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">Total Paid</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(totalDebits)}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                      <ArrowDownLeft className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">Total Received</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(totalCredits)}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                      <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">Pending</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{pendingCount}</p>
                </div>
              </div>

              {/* Transaction List */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    All Transactions ({allTransactions.length})
                  </h2>
                </div>

                {allTransactions.length > 0 ? (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {allTransactions.map((tx) => {
                      const isCredit = tx.direction === 'credit'
                      const isRefunded = tx.status === 'refunded'
                      const isPendingRefund = tx.status === 'pending_refund'

                      return (
                        <div key={tx.id} className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <div className="flex items-center gap-4">
                            {/* Direction icon */}
                            <div className={`p-2 rounded-lg shrink-0 ${
                              tx.type === 'verification'
                                ? 'bg-indigo-100 dark:bg-indigo-900/50'
                                : isCredit
                                  ? 'bg-emerald-100 dark:bg-emerald-900/50'
                                  : 'bg-slate-100 dark:bg-slate-800'
                            }`}>
                              {tx.type === 'verification' ? (
                                <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                              ) : isCredit ? (
                                <ArrowDownLeft className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <ArrowUpRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                              )}
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="font-medium text-sm text-slate-900 dark:text-white">{tx.typeLabel}</span>
                                {tx.isLate && (
                                  <span className="px-1.5 py-0.5 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 rounded">
                                    Late
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {tx.circleName && <>{tx.circleName} · </>}
                                {tx.description && <>{tx.description} · </>}
                                {tx.roundNumber != null && <>Round {tx.roundNumber} · </>}
                                {formatDate(tx.createdAt)}
                              </p>
                              {tx.failureReason && (
                                <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">{tx.failureReason}</p>
                              )}
                              {isPendingRefund && (
                                <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5 flex items-center gap-1">
                                  <RefreshCw className="w-3 h-3" />
                                  Refund pending (within 3 days)
                                </p>
                              )}
                              {isRefunded && tx.refundedAt && (
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Refunded on {formatDate(tx.refundedAt)}
                                </p>
                              )}
                            </div>

                            {/* Amount + Status */}
                            <div className="text-right shrink-0">
                              <p className={`font-semibold ${
                                isRefunded ? 'text-slate-400 line-through' :
                                isCredit ? 'text-emerald-600 dark:text-emerald-400' :
                                'text-slate-900 dark:text-white'
                              }`}>
                                {isCredit ? '+' : '-'}{formatCurrency(tx.amount, tx.currency)}
                              </p>
                              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium mt-1 ${
                                tx.status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' :
                                tx.status === 'failed' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' :
                                tx.status === 'refunded' ? 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' :
                                tx.status === 'pending_refund' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' :
                                tx.status === 'cancelled' ? 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' :
                                'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                              }`}>
                                {tx.statusLabel}
                              </span>
                              {tx.lateFee != null && tx.lateFee > 0 && (
                                <p className="text-xs text-red-500 mt-0.5">+{formatCurrency(tx.lateFee)} fee</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CircleDollarSign className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-500 dark:text-slate-400">No transactions yet</p>
                  </div>
                )}
              </div>
            </div>
          )
        })()}

        {/* ============ ACTIVITY TAB ============ */}
        {activeTab === 'activity' && (
          <div className="space-y-6">
            {/* Activity Timeline */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Recent Activity ({activities.length})
                </h2>
              </div>

              {activities.length > 0 ? (
                <div className="relative">
                  <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-700" />
                  <div className="space-y-1">
                    {activities.map((item) => (
                      <div key={item.id} className="relative flex gap-4 py-3 pl-2">
                        <div className={`relative z-10 flex items-center justify-center w-7 h-7 rounded-full shrink-0 ${activityIconBg(item)}`}>
                          {activityIcon(item)}
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-900 dark:text-white">{item.title}</p>
                              {item.description && (
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 truncate">{item.description}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {item.type === 'payment' && item.amount != null && (
                                <span className="text-sm font-medium text-slate-900 dark:text-white">
                                  {item.currency} {item.amount.toFixed(2)}
                                </span>
                              )}
                              {item.status && (
                                <span className={`inline-flex px-1.5 py-0.5 rounded text-xs font-medium ${activityStatusColor(item.status)}`}>
                                  {item.status}
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 font-mono">{formatDateTimeUTC(item.timestamp)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">No activity yet</p>
                </div>
              )}
            </div>

            {/* Circle Feedback */}
            {feedback.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Circle Feedback ({feedback.length})
                </h2>
                <div className="space-y-4">
                  {feedback.map((fb) => (
                    <div key={fb.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{fb.circleName}</p>
                          <p className="mt-1 text-slate-600 dark:text-slate-400">{fb.comment}</p>
                          <p className="mt-2 text-sm text-slate-400">{formatDate(fb.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < fb.rating
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-300 dark:text-slate-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function activityIcon(item: ActivityItem) {
  const cls = "w-3.5 h-3.5"
  switch (item.icon) {
    case 'credit-card': return <CreditCard className={cls} />
    case 'file-text': return <FileText className={cls} />
    case 'shield': return <Shield className={cls} />
    case 'shield-check': return <ShieldCheck className={cls} />
    case 'users': return <Users className={cls} />
    case 'user': return <UserPlus className={cls} />
    case 'mail': return <Mail className={cls} />
    case 'bell': return <Bell className={cls} />
    case 'calendar': return <Calendar className={cls} />
    case 'message-circle': return <MessageCircle className={cls} />
    case 'megaphone': return <Megaphone className={cls} />
    case 'vote': return <Vote className={cls} />
    default: return <Clock className={cls} />
  }
}

function activityIconBg(item: ActivityItem): string {
  switch (item.type) {
    case 'payment': return 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'
    case 'payment_method': return 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
    case 'notification': return 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400'
    case 'document': return 'bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400'
    case 'trust_score': return 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400'
    case 'membership': return 'bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400'
    case 'account': return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
    default: return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
  }
}

function activityStatusColor(status: string): string {
  switch (status) {
    case 'confirmed':
    case 'completed':
    case 'verified': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
    case 'pending':
    case 'processing': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
    case 'failed':
    case 'cancelled':
    case 'late': return 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
    default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
  }
}
