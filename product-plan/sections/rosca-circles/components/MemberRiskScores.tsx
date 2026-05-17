import type { MemberRiskScoresProps, RiskLevel } from '../types'

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
  onViewMember,
  onApprove,
  onReject,
  onRequestMoreInfo,
}: MemberRiskScoresProps) {
  const getRiskColor = (score: number) => {
    if (score <= 30) return 'text-emerald-600 dark:text-emerald-400'
    if (score <= 60) return 'text-amber-600 dark:text-amber-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getProgressColor = (score: number) => {
    if (score <= 30) return 'bg-emerald-500'
    if (score <= 60) return 'bg-amber-500'
    return 'bg-red-500'
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Member Risk Assessment
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            AI-powered risk scores for prospective and current members
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
            <p className="text-sm text-emerald-700 dark:text-emerald-300">Low Risk</p>
            <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mt-1">
              {riskScores.filter((s) => s.riskLevel === 'low').length}
            </p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-700 dark:text-amber-300">Medium Risk</p>
            <p className="text-2xl font-bold text-amber-800 dark:text-amber-200 mt-1">
              {riskScores.filter((s) => s.riskLevel === 'medium').length}
            </p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-700 dark:text-red-300">High Risk</p>
            <p className="text-2xl font-bold text-red-800 dark:text-red-200 mt-1">
              {riskScores.filter((s) => s.riskLevel === 'high').length}
            </p>
          </div>
        </div>

        {/* Member List */}
        <div className="space-y-4">
          {riskScores.map((member) => (
            <div
              key={member.id}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              {/* Member Header */}
              <div className="p-6">
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
                        {member.memberName.charAt(0)}
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
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${riskLevelColors[member.riskLevel]}`}>
                        {member.riskLevel.charAt(0).toUpperCase() + member.riskLevel.slice(1)} Risk
                      </span>
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

                {/* Risk Factors */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
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
                    <span className="font-medium">AI Recommendation:</span> {member.recommendation}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => onViewMember?.(member.memberId)}
                    className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    View Profile
                  </button>
                  {onApprove && (
                    <button
                      onClick={() => onApprove(member.memberId)}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-colors"
                    >
                      Approve
                    </button>
                  )}
                  {onReject && (
                    <button
                      onClick={() => onReject(member.memberId, 'Risk too high')}
                      className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition-colors"
                    >
                      Reject
                    </button>
                  )}
                  {onRequestMoreInfo && (
                    <button
                      onClick={() => onRequestMoreInfo(member.memberId)}
                      className="px-4 py-2 rounded-lg border border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 font-medium text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                    >
                      Request More Info
                    </button>
                  )}
                </div>
              </div>

              {/* Assessment Footer */}
              <div className="px-6 py-3 bg-slate-50 dark:bg-slate-700/30 border-t border-slate-100 dark:border-slate-700">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Last assessed: {new Date(member.assessedAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
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
              No risk assessments
            </h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Risk scores will appear here when members request to join
            </p>
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
                <span className="font-medium text-slate-900 dark:text-white">Low Risk (0-30)</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Strong payment history, high verification, established network
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="font-medium text-slate-900 dark:text-white">Medium Risk (31-60)</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Some concerns, may need additional verification or lower contribution
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="font-medium text-slate-900 dark:text-white">High Risk (61-100)</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Significant concerns, consider rejection or strict conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
