import { useState } from 'react'
import {
  Building2, CheckCircle, Clock, ArrowRight, Shield, Award,
  TrendingUp, ExternalLink, FileText, ChevronRight, Sparkles
} from 'lucide-react'
import type { CreditBureauStatus, PartnerBank, CreditScore } from '../types'

export interface CreditBuildingProps {
  bureauStatus: CreditBureauStatus
  partnerBanks: PartnerBank[]
  creditScore: CreditScore
  onOptIn?: () => void
  onOptOut?: () => void
  onExportDocumentation?: () => void
  onRequestBankIntroduction?: (bankId: string) => void
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function ProgressBar({ percent, label }: { percent: number; label: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-600 dark:text-slate-400">{label}</span>
        <span className="font-medium text-slate-900 dark:text-white">{percent}%</span>
      </div>
      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

function LevelBadge({ level, name, isCurrent }: { level: number; name: string; isCurrent: boolean }) {
  const levelColors = [
    'from-slate-400 to-slate-500',
    'from-amber-400 to-amber-500',
    'from-emerald-400 to-emerald-500',
    'from-indigo-400 to-indigo-500',
    'from-purple-400 to-purple-500',
  ]

  return (
    <div className={`flex flex-col items-center ${isCurrent ? '' : 'opacity-50'}`}>
      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${levelColors[level - 1]} flex items-center justify-center text-white font-bold shadow-lg ${isCurrent ? 'ring-4 ring-indigo-200 dark:ring-indigo-900' : ''}`}>
        {level}
      </div>
      <span className={`mt-2 text-xs font-medium ${isCurrent ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
        {name}
      </span>
    </div>
  )
}

function BureauCard({ bureau }: { bureau: { id: string; name: string; country: string; status: string; lastReportedAt: string | null; paymentsReported: number } }) {
  const statusStyles: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    active: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', icon: <CheckCircle className="w-3.5 h-3.5" /> },
    pending: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', icon: <Clock className="w-3.5 h-3.5" /> },
    paused: { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-600 dark:text-slate-400', icon: <Clock className="w-3.5 h-3.5" /> },
    error: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', icon: <Clock className="w-3.5 h-3.5" /> },
  }

  const style = statusStyles[bureau.status] || statusStyles.pending

  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white">{bureau.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{bureau.country}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
          {style.icon}
          <span className="capitalize">{bureau.status}</span>
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Payments Reported</p>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">{bureau.paymentsReported}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Last Report</p>
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            {bureau.lastReportedAt ? formatDate(bureau.lastReportedAt) : 'Pending'}
          </p>
        </div>
      </div>
    </div>
  )
}

function PartnerBankCard({
  bank,
  isQualified,
  creditScore,
  onRequestIntroduction,
}: {
  bank: PartnerBank
  isQualified: boolean
  creditScore: number
  onRequestIntroduction: () => void
}) {
  const scoreGap = bank.minCreditScore - creditScore

  return (
    <div className={`p-5 rounded-2xl border-2 transition-all ${
      isQualified
        ? 'bg-white dark:bg-slate-800 border-indigo-200 dark:border-indigo-800 hover:border-indigo-400'
        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-75'
    }`}>
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
          <Building2 className="w-7 h-7 text-slate-600 dark:text-slate-400" />
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold mb-1 ${isQualified ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
            {bank.name}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{bank.description}</p>
        </div>
      </div>

      {/* Products */}
      <div className="flex flex-wrap gap-2 mb-4">
        {bank.productsOffered.map((product, i) => (
          <span
            key={i}
            className={`text-xs px-2 py-1 rounded-full ${
              isQualified
                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
            }`}
          >
            {product}
          </span>
        ))}
      </div>

      {/* Special Offer */}
      {bank.specialOffer && (
        <div className={`p-3 rounded-lg mb-4 ${
          isQualified
            ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
            : 'bg-slate-100 dark:bg-slate-700'
        }`}>
          <div className="flex items-center gap-2">
            <Sparkles className={`w-4 h-4 ${isQualified ? 'text-amber-500' : 'text-slate-400'}`} />
            <span className={`text-sm font-medium ${isQualified ? 'text-amber-700 dark:text-amber-400' : 'text-slate-500'}`}>
              {bank.specialOffer}
            </span>
          </div>
        </div>
      )}

      {/* CTA */}
      {isQualified ? (
        <button
          onClick={onRequestIntroduction}
          className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
        >
          Request Introduction
          <ArrowRight className="w-4 h-4" />
        </button>
      ) : (
        <div className="text-center py-2.5 text-sm text-slate-500">
          Need {scoreGap} more points to qualify
        </div>
      )}
    </div>
  )
}

function MilestoneItem({ milestone, isCompleted }: { milestone: { name: string; completedAt?: string; progressPercent?: number }; isCompleted: boolean }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg ${
      isCompleted
        ? 'bg-emerald-50 dark:bg-emerald-900/20'
        : 'bg-slate-50 dark:bg-slate-700/50'
    }`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
        isCompleted
          ? 'bg-emerald-500'
          : 'bg-slate-200 dark:bg-slate-600'
      }`}>
        {isCompleted ? (
          <CheckCircle className="w-4 h-4 text-white" />
        ) : (
          <Clock className="w-4 h-4 text-slate-400" />
        )}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-medium ${
          isCompleted ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'
        }`}>
          {milestone.name}
        </p>
        {isCompleted && milestone.completedAt && (
          <p className="text-xs text-emerald-600 dark:text-emerald-500">
            Completed {formatDate(milestone.completedAt)}
          </p>
        )}
        {!isCompleted && milestone.progressPercent !== undefined && (
          <div className="mt-1">
            <div className="h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full"
                style={{ width: `${milestone.progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function CreditBuilding({
  bureauStatus,
  partnerBanks,
  creditScore,
  onOptIn,
  onOptOut,
  onExportDocumentation,
  onRequestBankIntroduction,
}: CreditBuildingProps) {
  const { creditBuildingProgress } = bureauStatus
  const levelNames = ['Starter', 'Building', 'Established', 'Strong', 'Excellent']

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Credit Building</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Build your external credit history through CircleUp activity
          </p>
        </div>
        <button
          onClick={onExportDocumentation}
          className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Export Documentation
        </button>
      </div>

      {/* Opt-in Status Card */}
      {!bureauStatus.optedIn ? (
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">Build Your Credit History</h2>
              <p className="text-indigo-100 mb-4">
                Opt-in to credit bureau reporting and let your on-time CircleUp payments build your formal credit history. This is especially valuable if you have limited credit history with traditional banks.
              </p>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Report positive payments</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Build external credit score</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Access traditional banking</span>
                </div>
              </div>
              <button
                onClick={onOptIn}
                className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 transition-colors"
              >
                Opt-in to Credit Reporting
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Progress Overview */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Your Progress</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Opted in since {formatDate(bureauStatus.optedInAt!)}
                </p>
              </div>
              <button
                onClick={onOptOut}
                className="text-sm text-slate-500 dark:text-slate-400 hover:text-red-500"
              >
                Opt out
              </button>
            </div>

            {/* Level Progress */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                {levelNames.map((name, i) => (
                  <LevelBadge
                    key={i}
                    level={i + 1}
                    name={name}
                    isCurrent={i + 1 === creditBuildingProgress.currentLevel}
                  />
                ))}
              </div>
              <div className="relative h-2 bg-slate-100 dark:bg-slate-700 rounded-full mt-6">
                <div
                  className="absolute h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${((creditBuildingProgress.currentLevel - 1) / 4) * 100 + (creditBuildingProgress.progressPercent / 4)}%` }}
                />
              </div>
            </div>

            {/* Current Level Info */}
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl mb-6">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-indigo-500" />
                <div>
                  <p className="font-medium text-indigo-700 dark:text-indigo-400">
                    Level {creditBuildingProgress.currentLevel}: {creditBuildingProgress.currentLevelName}
                  </p>
                  <p className="text-sm text-indigo-600 dark:text-indigo-500">
                    {creditBuildingProgress.progressPercent}% to {creditBuildingProgress.nextLevelName}
                  </p>
                </div>
              </div>
            </div>

            {/* Milestones */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Completed
                </h3>
                <div className="space-y-2">
                  {creditBuildingProgress.milestonesCompleted.map((milestone, i) => (
                    <MilestoneItem key={i} milestone={milestone} isCompleted={true} />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  In Progress
                </h3>
                <div className="space-y-2">
                  {creditBuildingProgress.milestonesRemaining.map((milestone, i) => (
                    <MilestoneItem key={i} milestone={milestone} isCompleted={false} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Credit Bureaus */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-500" />
              Reporting Status
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {bureauStatus.bureaus.map(bureau => (
                <BureauCard key={bureau.id} bureau={bureau} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Partner Banks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Partner Banks</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Financial institutions offering products to CircleUp members
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {partnerBanks.map(bank => (
            <PartnerBankCard
              key={bank.id}
              bank={bank}
              isQualified={creditScore.score >= bank.minCreditScore}
              creditScore={creditScore.score}
              onRequestIntroduction={() => onRequestBankIntroduction?.(bank.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
