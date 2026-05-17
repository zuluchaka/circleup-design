import { useState } from 'react'
import type { MemberProfileProps } from '../types'
import { TrustScoreGauge } from './TrustScoreGauge'
import { RoleBadge } from './RoleBadge'
import { StatusBadge } from './StatusBadge'
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  CircleDollarSign,
  Target,
  CheckCircle2,
  Clock,
  XCircle,
  MessageSquare,
  FileText,
  Quote,
  Star,
  Send,
  UserPlus,
  Eye,
  Download,
  Sparkles,
  PenLine,
  AlertCircle
} from 'lucide-react'
import type { MemberDocument } from '../types'

type TabId = 'overview' | 'references' | 'engagement' | 'documents'

const categoryColors: Record<MemberDocument['category'], { bg: string; text: string; darkBg: string; darkText: string; label: string }> = {
  agreements: { bg: 'bg-indigo-100', text: 'text-indigo-700', darkBg: 'dark:bg-indigo-900/50', darkText: 'dark:text-indigo-300', label: 'Agreement' },
  minutes: { bg: 'bg-emerald-100', text: 'text-emerald-700', darkBg: 'dark:bg-emerald-900/50', darkText: 'dark:text-emerald-300', label: 'Minutes' },
  financial: { bg: 'bg-amber-100', text: 'text-amber-700', darkBg: 'dark:bg-amber-900/50', darkText: 'dark:text-amber-300', label: 'Financial' },
  policies: { bg: 'bg-purple-100', text: 'text-purple-700', darkBg: 'dark:bg-purple-900/50', darkText: 'dark:text-purple-300', label: 'Policy' },
  forms: { bg: 'bg-rose-100', text: 'text-rose-700', darkBg: 'dark:bg-rose-900/50', darkText: 'dark:text-rose-300', label: 'Form' }
}

const categoryIconColors: Record<MemberDocument['category'], string> = {
  agreements: 'text-indigo-500',
  minutes: 'text-emerald-500',
  financial: 'text-amber-500',
  policies: 'text-purple-500',
  forms: 'text-rose-500'
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function MemberProfile({
  member,
  trustScore,
  referencesReceived,
  referencesGiven,
  feedback,
  improvementTips,
  documents,
  onGiveReference,
  onRequestReference,
  onMessage,
  onViewDocument,
  onBack
}: MemberProfileProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' }).format(amount)
  }

  const pendingAcknowledgments = documents.filter(d => d.requiresAcknowledgment && !d.acknowledged).length
  const pendingSignatures = documents.filter(d => d.requiresSignature && !d.signed).length

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Target className="w-4 h-4" /> },
    { id: 'references', label: 'References', icon: <Quote className="w-4 h-4" /> },
    { id: 'engagement', label: 'Engagement', icon: <Star className="w-4 h-4" /> },
    { id: 'documents', label: 'Documents', icon: <FileText className="w-4 h-4" /> }
  ]

  const paymentRate = member.onTimePayments + member.latePayments + member.missedPayments > 0
    ? Math.round((member.onTimePayments / (member.onTimePayments + member.latePayments + member.missedPayments)) * 100)
    : 0

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Back Button */}
          <button
            onClick={() => onBack?.()}
            className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Directory
          </button>

          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar */}
            <div className="shrink-0">
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-800 shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {member.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{member.name}</h1>
                <RoleBadge role={member.role} />
                <StatusBadge status={member.status} />
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                <a href={`mailto:${member.email}`} className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  <Mail className="w-4 h-4" />
                  {member.email}
                </a>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4" />
                  {member.phone}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Joined {formatDate(member.joinedAt)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => onMessage?.(member.id)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Send Message
                </button>
                <button
                  onClick={() => onGiveReference?.(member.id)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Give Reference
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 flex gap-1 border-b border-slate-200 dark:border-slate-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Trust Score */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Trust Score</h2>
                <TrustScoreGauge
                  trustScore={trustScore}
                  improvementTips={improvementTips}
                  size="md"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="lg:col-span-2 space-y-6">
              {/* Participation Stats */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Participation</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{member.circlesActive}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Active Circles</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{member.circlesCompleted}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Completed</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(member.totalContributed)}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Total Contributed</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{paymentRate}%</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">On-time Rate</p>
                  </div>
                </div>
              </div>

              {/* Payment History */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Payment History</h2>
                <div className="flex gap-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">{member.onTimePayments}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">On-time</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                      <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">{member.latePayments}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Late</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                      <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">{member.missedPayments}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Missed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Membership Details */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Membership Details</h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm text-slate-500 dark:text-slate-400">Membership Type</dt>
                    <dd className="text-slate-900 dark:text-white font-medium capitalize">{member.membershipType}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-slate-500 dark:text-slate-400">KYC Status</dt>
                    <dd className="text-slate-900 dark:text-white font-medium capitalize">{member.kycStatus}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-slate-500 dark:text-slate-400">Dues Paid Until</dt>
                    <dd className="text-slate-900 dark:text-white font-medium">
                      {member.duesPaidUntil ? formatDate(member.duesPaidUntil) : '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-slate-500 dark:text-slate-400">Member Since</dt>
                    <dd className="text-slate-900 dark:text-white font-medium">{formatDate(member.joinedAt)}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'references' && (
          <div className="space-y-6">
            {/* References Received */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  References Received ({referencesReceived.length})
                </h2>
                <button
                  onClick={() => onRequestReference?.(member.id)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Request Reference
                </button>
              </div>

              {referencesReceived.length > 0 ? (
                <div className="space-y-4">
                  {referencesReceived.map((ref) => (
                    <div key={ref.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Quote className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-slate-700 dark:text-slate-300 italic">"{ref.text}"</p>
                          <div className="mt-3 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <span className="font-medium text-slate-900 dark:text-white">{ref.fromMemberName}</span>
                            <span>•</span>
                            <span>{ref.relationship}</span>
                            <span>•</span>
                            <span>{formatDate(ref.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                  No references received yet
                </p>
              )}
            </div>

            {/* References Given */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                References Given ({referencesGiven.length})
              </h2>

              {referencesGiven.length > 0 ? (
                <div className="space-y-4">
                  {referencesGiven.map((ref) => (
                    <div key={ref.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Send className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                            Reference for <span className="font-medium text-slate-900 dark:text-white">{ref.toMemberName}</span>
                          </p>
                          <p className="text-slate-700 dark:text-slate-300 italic">"{ref.text}"</p>
                          <p className="mt-2 text-sm text-slate-400">{formatDate(ref.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                  No references given yet
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'engagement' && (
          <div className="space-y-6">
            {/* Feedback Given */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Circle Feedback ({feedback.length})
              </h2>

              {feedback.length > 0 ? (
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
              ) : (
                <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                  No feedback submitted yet
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Documents ({documents.length})
              </h2>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{documents.length}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Total Documents</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-center">
                  <p className={`text-xl font-bold ${pendingAcknowledgments > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>
                    {pendingAcknowledgments}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Pending Ack.</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-center">
                  <p className={`text-xl font-bold ${pendingSignatures > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>
                    {pendingSignatures}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Pending Sig.</p>
                </div>
              </div>

              {/* Document List */}
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
                              <button
                                onClick={(e) => { e.stopPropagation(); onViewDocument?.(doc.id) }}
                                className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shrink-0"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Tags row */}
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cat.bg} ${cat.text} ${cat.darkBg} ${cat.darkText}`}>
                                {cat.label}
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">{doc.circleName}</span>

                              {doc.isAutoGenerated && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300">
                                  <Sparkles className="w-3 h-3" />
                                  Auto
                                </span>
                              )}

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
                <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                  No documents yet
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
