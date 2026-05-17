import type { SavingsGoalsProps, SavingsGoal, AIInsight } from '../types'
import {
  Target,
  Plus,
  Edit3,
  Trash2,
  Link2,
  Calendar,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Info,
  ArrowUpRight,
  Sparkles,
  Trophy,
  Clock
} from 'lucide-react'

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' }).format(amount)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function InsightIcon({ priority }: { priority: AIInsight['priority'] }) {
  switch (priority) {
    case 'positive':
      return <CheckCircle2 className="w-5 h-5 text-emerald-500" />
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-amber-500" />
    case 'suggestion':
      return <Lightbulb className="w-5 h-5 text-indigo-500" />
    default:
      return <Info className="w-5 h-5 text-slate-400" />
  }
}

function StatusBadge({ status }: { status: SavingsGoal['status'] }) {
  const styles = {
    on_track: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    at_risk: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    behind: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    completed: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
  }

  const icons = {
    on_track: <TrendingUp className="w-3 h-3" />,
    at_risk: <Clock className="w-3 h-3" />,
    behind: <TrendingDown className="w-3 h-3" />,
    completed: <Trophy className="w-3 h-3" />
  }

  const labels = {
    on_track: 'On Track',
    at_risk: 'At Risk',
    behind: 'Behind',
    completed: 'Completed'
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {icons[status]}
      {labels[status]}
    </span>
  )
}

function GoalCard({
  goal,
  circleParticipations,
  onEdit,
  onDelete,
  onLinkCircle
}: {
  goal: SavingsGoal
  circleParticipations: SavingsGoalsProps['circleParticipations']
  onEdit?: () => void
  onDelete?: () => void
  onLinkCircle?: (circleId: string) => void
}) {
  const linkedCircleNames = goal.linkedCircles
    .map(id => circleParticipations.find(c => c.circleId === id)?.circleName)
    .filter(Boolean)

  const isCompleted = goal.status === 'completed'

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl border transition-all ${
      isCompleted
        ? 'border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-900/10 dark:to-slate-800'
        : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md'
    }`}>
      {/* Header */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-xl ${
                isCompleted
                  ? 'bg-indigo-100 dark:bg-indigo-900/30'
                  : 'bg-slate-100 dark:bg-slate-700'
              }`}>
                {isCompleted ? (
                  <Trophy className="w-5 h-5 text-indigo-500" />
                ) : (
                  <Target className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {goal.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Target: {formatDate(goal.targetDate)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={goal.status} />
            <div className="flex items-center">
              <button
                onClick={onEdit}
                className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                title="Edit goal"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={onDelete}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Delete goal"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(goal.currentAmount)}
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              of {formatCurrency(goal.targetAmount)}
            </span>
          </div>
          <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                isCompleted
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500'
                  : goal.status === 'on_track'
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                  : goal.status === 'at_risk'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                  : 'bg-gradient-to-r from-red-500 to-red-400'
              }`}
              style={{ width: `${Math.min(goal.progressPercent, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
            <span>{goal.progressPercent}% complete</span>
            <span>{formatCurrency(goal.targetAmount - goal.currentAmount)} remaining</span>
          </div>
        </div>

        {/* Monthly Tracking */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
          <div>
            <p className="text-xs text-slate-400 mb-1">Monthly Target</p>
            <p className="font-semibold text-slate-900 dark:text-white">
              {formatCurrency(goal.monthlyTarget)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Actual Average</p>
            <p className={`font-semibold ${
              goal.actualMonthlyAverage >= goal.monthlyTarget
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-amber-600 dark:text-amber-400'
            }`}>
              {formatCurrency(goal.actualMonthlyAverage)}
            </p>
          </div>
        </div>
      </div>

      {/* Milestones */}
      {goal.milestones.length > 0 && (
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
            Milestones
          </p>
          <div className="flex gap-2">
            {goal.milestones.map((milestone, index) => (
              <div
                key={index}
                className={`flex-1 p-2 rounded-lg text-center ${
                  milestone.reached
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600'
                }`}
                title={milestone.reached && milestone.reachedDate ? `Reached on ${formatDate(milestone.reachedDate)}` : 'Not reached yet'}
              >
                {milestone.reached && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                )}
                <p className={`text-xs font-medium ${
                  milestone.reached
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}>
                  {formatCurrency(milestone.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Linked Circles */}
      <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-600 dark:text-slate-300">
              {linkedCircleNames.length > 0
                ? linkedCircleNames.join(', ')
                : 'No linked circles'}
            </span>
          </div>
          <button
            onClick={() => {}}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
          >
            {linkedCircleNames.length > 0 ? 'Manage' : 'Link Circle'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function SavingsGoals({
  goals,
  circleParticipations,
  aiInsights,
  onCreateGoal,
  onEditGoal,
  onDeleteGoal,
  onLinkCircle,
  onInsightAction
}: SavingsGoalsProps) {
  const activeGoals = goals.filter(g => g.status !== 'completed')
  const completedGoals = goals.filter(g => g.status === 'completed')
  const goalInsights = aiInsights.filter(i => i.relatedGoalId)

  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0)
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0)
  const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Savings Goals
            </h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Track your progress toward financial objectives
            </p>
          </div>
          <button
            onClick={onCreateGoal}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" />
            New Goal
          </button>
        </div>

        {/* Overall Progress */}
        {goals.length > 0 && (
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white mb-8 shadow-xl shadow-indigo-500/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <p className="text-indigo-100 text-sm mb-1">Overall Progress</p>
                <p className="text-3xl font-bold">{formatCurrency(totalSaved)}</p>
                <p className="text-indigo-100 text-sm mt-1">of {formatCurrency(totalTarget)} total target</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">{overallProgress}%</div>
                <p className="text-indigo-100 text-sm">across {goals.length} goals</p>
              </div>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Goals Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Goals */}
            {activeGoals.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-500" />
                  Active Goals ({activeGoals.length})
                </h2>
                <div className="space-y-4">
                  {activeGoals.map(goal => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      circleParticipations={circleParticipations}
                      onEdit={() => onEditGoal?.(goal.id)}
                      onDelete={() => onDeleteGoal?.(goal.id)}
                      onLinkCircle={(circleId) => onLinkCircle?.(goal.id, circleId)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Goals */}
            {completedGoals.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  Completed ({completedGoals.length})
                </h2>
                <div className="space-y-4">
                  {completedGoals.map(goal => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      circleParticipations={circleParticipations}
                      onEdit={() => onEditGoal?.(goal.id)}
                      onDelete={() => onDeleteGoal?.(goal.id)}
                      onLinkCircle={(circleId) => onLinkCircle?.(goal.id, circleId)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {goals.length === 0 && (
              <div className="py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-indigo-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  No savings goals yet
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
                  Create your first savings goal to start tracking your progress toward financial objectives.
                </p>
                <button
                  onClick={onCreateGoal}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Goal
                </button>
              </div>
            )}
          </div>

          {/* AI Insights Column */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    AI Insights
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Goal recommendations
                  </p>
                </div>
              </div>

              {goalInsights.length > 0 ? (
                <div className="space-y-4">
                  {goalInsights.map(insight => (
                    <div
                      key={insight.id}
                      className={`p-4 rounded-xl border ${
                        insight.priority === 'positive'
                          ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800'
                          : insight.priority === 'warning'
                          ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800'
                          : insight.priority === 'suggestion'
                          ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800'
                          : 'bg-slate-50 border-slate-200 dark:bg-slate-700/50 dark:border-slate-600'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <InsightIcon priority={insight.priority} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 dark:text-white text-sm">
                            {insight.title}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                            {insight.description}
                          </p>
                          {insight.actionable && insight.action && (
                            <button
                              onClick={() => onInsightAction?.(insight)}
                              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                            >
                              {insight.action.label}
                              <ArrowUpRight className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    No goal-specific insights available. Keep making progress on your goals!
                  </p>
                </div>
              )}
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-5 border border-amber-200 dark:border-amber-800">
              <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Goal-Setting Tips
              </h3>
              <ul className="space-y-2 text-sm text-amber-700 dark:text-amber-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  Set realistic milestones to stay motivated
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  Link circles to goals for automatic tracking
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  Review and adjust monthly targets quarterly
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
