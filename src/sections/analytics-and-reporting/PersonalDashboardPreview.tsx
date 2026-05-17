import { PersonalDashboard } from './components'
import data from '@/../product/sections/analytics-and-reporting/data.json'

export default function PersonalDashboardPreview() {
  return (
    <PersonalDashboard
      currentUser={data.currentUser}
      dashboard={data.personalDashboard}
      contributionHistory={data.contributionHistory}
      upcomingPayouts={data.upcomingPayouts}
      circleParticipations={data.circleParticipations}
      aiInsights={data.aiInsights}
      onViewCircle={(circleId) => console.log('View circle:', circleId)}
      onInsightAction={(insight) => console.log('Insight action:', insight)}
      onDownloadStatement={(type) => console.log('Download statement:', type)}
    />
  )
}
