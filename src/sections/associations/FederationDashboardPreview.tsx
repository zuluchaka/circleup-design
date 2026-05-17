import data from '@/../product/sections/associations/data.json'
import { FederationDashboard } from './components/FederationDashboard'
import type { Federation, FederationMembership, FederationPolicy, FederationAnnouncement, FederationMetrics } from '@/../product/sections/associations/types'

export default function FederationDashboardPreview() {
  // Use the first federation
  const federation = data.federations[0] as Federation
  const federationMemberships = data.federationMemberships as FederationMembership[]
  const policies = data.federationPolicies as FederationPolicy[]
  const announcements = data.federationAnnouncements as FederationAnnouncement[]
  const metrics = data.federationMetrics as FederationMetrics

  return (
    <FederationDashboard
      federation={federation}
      chapters={federationMemberships}
      policies={policies}
      announcements={announcements}
      metrics={metrics}
      onChapterClick={(id) => console.log('View chapter:', id)}
      onCreatePolicy={() => console.log('Create policy')}
      onBroadcast={() => console.log('Broadcast message')}
      onInviteChapter={() => console.log('Invite chapter')}
      onViewReports={() => console.log('View reports')}
      onViewChapterDirectory={() => console.log('View chapter directory')}
      onViewPolicyManager={() => console.log('View policy manager')}
      onViewAnnouncements={() => console.log('View announcements')}
      onBack={() => console.log('Go back')}
    />
  )
}
