import data from '@/../product/sections/associations/data.json'
import { FederationAnalytics } from './components/FederationAnalytics'
import type { Federation, FederationMembership, FederationMetrics } from '@/../product/sections/associations/types'

export default function FederationAnalyticsPreview() {
  const federation = data.federations[0] as Federation
  const chapters = data.federationMemberships as FederationMembership[]
  const metrics = data.federationMetrics as FederationMetrics

  return (
    <FederationAnalytics
      federation={federation}
      chapters={chapters}
      metrics={metrics}
      onExportReport={() => console.log('Export federation analytics report')}
      onViewChapter={(id) => console.log('View chapter:', id)}
      onBack={() => console.log('Go back')}
    />
  )
}
