import data from '@/../product/sections/ai-insights/data.json'
import { AiInsightsDashboard } from './components/AiInsightsDashboard'

export default function AiInsightsDashboardPreview() {
  return (
    <AiInsightsDashboard
      circleRecommendations={data.circleRecommendations}
      financialHealthChat={data.financialHealthChat}
      contributionSuggestions={data.contributionSuggestions}
      cashFlowAlerts={data.cashFlowAlerts}
      savingsOpportunities={data.savingsOpportunities}
      seasonalPatterns={data.seasonalPatterns}
      crossCircleInsights={data.crossCircleInsights}
      aiPreferences={data.aiPreferences}
      onViewRecommendation={(circleId) => console.log('View recommendation:', circleId)}
      onJoinCircle={(circleId) => console.log('Join circle:', circleId)}
      onDismissRecommendation={(id) => console.log('Dismiss recommendation:', id)}
      onSendMessage={(message) => console.log('Send message:', message)}
      onAcceptSuggestion={(id) => console.log('Accept suggestion:', id)}
      onDismissSuggestion={(id) => console.log('Dismiss suggestion:', id)}
      onDismissAlert={(id) => console.log('Dismiss alert:', id)}
      onActOnOpportunity={(id, allocation) => console.log('Act on opportunity:', id, allocation)}
      onUpdatePreferences={(prefs) => console.log('Update preferences:', prefs)}
    />
  )
}
