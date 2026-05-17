import { SavingsGoals } from './components'
import data from '@/../product/sections/analytics-and-reporting/data.json'

export default function SavingsGoalsPreview() {
  return (
    <SavingsGoals
      goals={data.savingsGoals}
      circleParticipations={data.circleParticipations}
      aiInsights={data.aiInsights.filter(i => i.relatedGoalId)}
      onCreateGoal={() => console.log('Create goal')}
      onEditGoal={(goalId) => console.log('Edit goal:', goalId)}
      onDeleteGoal={(goalId) => console.log('Delete goal:', goalId)}
      onLinkCircle={(goalId, circleId) => console.log('Link circle:', goalId, circleId)}
      onInsightAction={(insight) => console.log('Insight action:', insight)}
    />
  )
}
