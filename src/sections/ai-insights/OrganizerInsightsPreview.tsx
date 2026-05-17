import data from '@/../product/sections/ai-insights/data.json'
import { OrganizerInsights } from './components/OrganizerInsights'

export default function OrganizerInsightsPreview() {
  return (
    <OrganizerInsights
      memberRiskScores={data.memberRiskScores}
      circleHealthScores={data.circleHealthScores}
      churnWarnings={data.churnWarnings}
      configurationSuggestions={data.configurationSuggestions}
      payoutOrderRecommendations={data.payoutOrderRecommendations}
      onApproveMember={(applicantId, circleId) => console.log('Approve member:', applicantId, circleId)}
      onDenyMember={(applicantId, circleId, reason) => console.log('Deny member:', applicantId, circleId, reason)}
      onRequestMoreInfo={(applicantId, circleId) => console.log('Request more info:', applicantId, circleId)}
      onViewChurnWarning={(id) => console.log('View churn warning:', id)}
      onActOnChurnWarning={(id, action) => console.log('Act on churn warning:', id, action)}
      onApplyConfiguration={(id) => console.log('Apply configuration:', id)}
      onAcceptPayoutOrder={(id) => console.log('Accept payout order:', id)}
      onModifyPayoutOrder={(id, newOrder) => console.log('Modify payout order:', id, newOrder)}
    />
  )
}
