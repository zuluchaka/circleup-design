import { useState } from 'react'
import { BarChart3 } from 'lucide-react'
import type { MemberRiskScoresProps, RiskLevel, ApplicantRiskAssessment } from '@/../product/sections/rosca-circles/types'

const riskLevelColors: Record<RiskLevel, string> = {
  low: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

const riskLevelBgColors: Record<RiskLevel, string> = {
  low: 'from-emerald-500 to-emerald-600',
  medium: 'from-amber-500 to-amber-600',
  high: 'from-red-500 to-red-600',
}

export function MemberRiskScores({
  riskScores,
  summary,
  circle,
  onBack,
  onViewMember,
  onApprove,
  onReject,
  onRequestMoreInfo,
  onAssessAll,
  onAssessApplicant,
}: MemberRiskScoresProps) {
  const [assessing, setAssessing] = useState(false)
  const [applicantEmail, setApplicantEmail] = useState('')
  const [applicantResult, setApplicantResult] = useState<ApplicantRiskAssessment | null>(null)
  const [applicantAssessing, setApplicantAssessing] = useState(false)
  const [showApplicantForm, setShowApplicantForm] = useState(false)
  const [expandedMemberId, setExpandedMemberId] = useState<string | null>(null)

  const getRiskColor = (score: number) => {
    if (score >= 61) return 'text-emerald-600 dark:text-emerald-400'
    if (score >= 31) return 'text-amber-600 dark:text-amber-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getProgressColor = (score: number) => {
    if (score >= 61) return 'bg-emerald-500'
    if (score >= 31) return 'bg-amber-500'
    return 'bg-red-500'
  }

  const handleAssessAll = async () => {
    if (!onAssessAll) return
    setAssessing(true)
    try {
      await onAssessAll()
    } finally {
      setAssessing(false)
    }
  }

  const handleAssessApplicant = async () => {
    if (!onAssessApplicant || !applicantEmail.trim()) return
    setApplicantAssessing(true)
    try {
      const result = await onAssessApplicant(applicantEmail.trim())
      setApplicantResult(result)
    } finally {
      setApplicantAssessing(false)
    }
  }

  const lowRisk = riskScores.filter((s) => s.riskLevel === 'low').length
  const medRisk = riskScores.filter((s) => s.riskLevel === 'medium').length
  const highRisk = riskScores.filter((s) => s.riskLevel === 'high').length

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-indigo-500" />
                  Risks
                </h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {circle ? `${circle.name} • ` : ''}Monitor member risk profiles
                </p>
              </div>
            </div>
            <div className="hidden sm:flex gap-2">
              {onAssessApplicant && (
                <button
                  onClick={() => setShowApplicantForm(!showApplicantForm)}
                  className="px-4 py-2 rounded-lg border border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-400 font-medium text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                >
                  Assess Applicant
                </button>
              )}
              {onAssessAll && (
                <button
                  onClick={handleAssessAll}
                  disabled={assessing}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium text-sm transition-colors flex items-center gap-2"
                >
                  {assessing && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  {assessing ? 'Assessing...' : 'Assess All'}
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <div className="text-2xl font-bold">{summary?.totalAssessed ?? riskScores.length}</div>
              <p className="text-sm font-medium mt-0.5 opacity-80">Total Assessed</p>
            </div>
            <div className="rounded-xl px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400">
              <div className="text-2xl font-bold">{lowRisk}</div>
              <p className="text-sm font-medium mt-0.5 opacity-80">Low Risk</p>
            </div>
            <div className="rounded-xl px-4 py-3 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">
              <div className="text-2xl font-bold">{medRisk}</div>
              <p className="text-sm font-medium mt-0.5 opacity-80">Medium Risk</p>
            </div>
            <div className="rounded-xl px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400">
              <div className="text-2xl font-bold">{highRisk}</div>
              <p className="text-sm font-medium mt-0.5 opacity-80">High Risk</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Applicant Assessment Form */}
        {showApplicantForm && (
          <div className="mb-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-indigo-200 dark:border-indigo-800 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Assess Applicant
            </h2>
            <div className="flex gap-3">
              <input
                type="text"
                value={applicantEmail}
                onChange={(e) => setApplicantEmail(e.target.value)}
                placeholder="Enter user ID to assess"
                className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400"
              />
              <button
                onClick={handleAssessApplicant}
                disabled={applicantAssessing || !applicantEmail.trim()}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium text-sm transition-colors"
              >
                {applicantAssessing ? 'Assessing...' : 'Assess'}
              </button>
            </div>

            {/* Applicant Result */}
            {applicantResult && (
              <div className="mt-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {applicantResult.userName}
                  </h3>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${riskLevelColors[applicantResult.riskLevel]}`}>
                    Score: {applicantResult.riskScore} ({applicantResult.riskLevel})
                  </span>
                </div>
                <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-3">
                  {applicantResult.recommendation}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Payment Reliability</span>
                    <p className="font-semibold text-slate-900 dark:text-white">{applicantResult.factors.paymentReliability}%</p>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Completion Rate</span>
                    <p className="font-semibold text-slate-900 dark:text-white">{applicantResult.factors.completionRate}%</p>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Previous Circles</span>
                    <p className="font-semibold text-slate-900 dark:text-white">{applicantResult.previousCircles}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Defaults</span>
                    <p className={`font-semibold ${applicantResult.defaultCount > 0 ? 'text-red-600' : 'text-slate-900 dark:text-white'}`}>
                      {applicantResult.defaultCount}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Average Score Bar */}
        {summary && (
          <div className="mb-8 bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Average Risk Score</span>
              <span className={`text-lg font-bold ${getRiskColor(summary.averageRiskScore)}`}>
                {summary.averageRiskScore}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-600">
              <div
                className={`h-2 rounded-full ${getProgressColor(summary.averageRiskScore)}`}
                style={{ width: `${summary.averageRiskScore}%` }}
              />
            </div>
          </div>
        )}

        {/* Member List */}
        <div className="space-y-4">
          {riskScores.map((member) => {
            const isExpanded = expandedMemberId === member.id

            return (
              <div
                key={member.id}
                className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden"
              >
                {/* Member Header */}
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => setExpandedMemberId(isExpanded ? null : member.id)}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar & Score */}
                    <div className="relative">
                      {member.memberAvatar ? (
                        <img
                          src={member.memberAvatar}
                          alt={member.memberName}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 text-xl font-semibold">
                          {(member.memberName || '?').charAt(0)}
                        </div>
                      )}
                      <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br ${riskLevelBgColors[member.riskLevel]} flex items-center justify-center text-white text-xs font-bold shadow-lg`}>
                        {member.riskScore}
                      </div>
                    </div>

                    {/* Member Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white text-lg">
                            {member.memberName}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {member.memberEmail}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 text-sm font-medium rounded-full ${riskLevelColors[member.riskLevel]}`}>
                            {(member.riskLevel || 'unknown').charAt(0).toUpperCase() + (member.riskLevel || 'unknown').slice(1)} Risk
                          </span>
                          <svg
                            className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="flex gap-6 mt-3 text-sm">
                        <div>
                          <span className="text-slate-500 dark:text-slate-400">Previous Circles:</span>{' '}
                          <span className="font-medium text-slate-900 dark:text-white">{member.previousCircles}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 dark:text-slate-400">Completed:</span>{' '}
                          <span className="font-medium text-emerald-600 dark:text-emerald-400">{member.completedCircles}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 dark:text-slate-400">Defaults:</span>{' '}
                          <span className={`font-medium ${member.defaultCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                            {member.defaultCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Detail */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-slate-100 dark:border-slate-700 pt-4">
                    {/* Risk Factors */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {Object.entries(member.factors).map(([key, factor]) => (
                        <div key={key} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className={`text-sm font-semibold ${getRiskColor(factor.score)}`}>
                              {factor.score}
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-600">
                            <div
                              className={`h-1.5 rounded-full ${getProgressColor(factor.score)}`}
                              style={{ width: `${factor.score}%` }}
                            />
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {factor.description}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Recommendation */}
                    <div className="mt-4 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                      <p className="text-sm text-indigo-800 dark:text-indigo-200">
                        <span className="font-medium">Recommendation:</span> {member.recommendation}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); onViewMember?.(member.memberId) }}
                        className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        View Profile
                      </button>
                      {onApprove && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onApprove(member.memberId) }}
                          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-colors"
                        >
                          Approve
                        </button>
                      )}
                      {onReject && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onReject(member.memberId, 'Risk too high') }}
                          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition-colors"
                        >
                          Reject
                        </button>
                      )}
                      {onRequestMoreInfo && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onRequestMoreInfo(member.memberId) }}
                          className="px-4 py-2 rounded-lg border border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 font-medium text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                        >
                          Request More Info
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Assessment Footer */}
                <div className="px-6 py-3 bg-slate-50 dark:bg-slate-700/30 border-t border-slate-100 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Last assessed: {new Date(member.assessedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {riskScores.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">
              No risk assessments yet
            </h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400 mb-4">
              Click "Assess All Members" to generate risk scores for current circle members
            </p>
            {onAssessAll && (
              <button
                onClick={handleAssessAll}
                disabled={assessing}
                className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium text-sm transition-colors"
              >
                {assessing ? 'Assessing...' : 'Assess All Members'}
              </button>
            )}
          </div>
        )}

        {/* Legend */}
        <div className="mt-8 p-4 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <h3 className="font-medium text-slate-900 dark:text-white mb-3">
            Understanding Risk Scores
          </h3>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="font-medium text-slate-900 dark:text-white">Low Risk (61-100)</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Strong payment history, high completion rate, established track record
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="font-medium text-slate-900 dark:text-white">Medium Risk (31-60)</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Some concerns, review payment history carefully before approval
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="font-medium text-slate-900 dark:text-white">High Risk (0-30)</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Significant concerns, consider requiring guarantor or additional verification
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
