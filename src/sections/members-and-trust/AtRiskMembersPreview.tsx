import { AtRiskMembers } from './components'
import sampleData from '@/../product/sections/members-and-trust/data.json'
import type { AtRiskAlert, Member, TrustScore } from '@/../product/sections/members-and-trust/types'

export default function AtRiskMembersPreview() {
  const handleAcknowledge = (alertId: string) => {
    console.log('Acknowledge alert:', alertId)
  }

  const handleEscalate = (alertId: string) => {
    console.log('Escalate alert:', alertId)
  }

  const handleResolve = (alertId: string) => {
    console.log('Resolve alert:', alertId)
  }

  const handleContactMember = (memberId: string, method: 'phone' | 'email' | 'message') => {
    console.log('Contact member:', memberId, 'via', method)
  }

  const handleViewMember = (memberId: string) => {
    console.log('View member:', memberId)
  }

  const handleSuspendMember = (memberId: string) => {
    console.log('Suspend member:', memberId)
  }

  return (
    <AtRiskMembers
      alerts={sampleData.atRiskAlerts as AtRiskAlert[]}
      members={sampleData.members as Member[]}
      trustScores={sampleData.trustScores as TrustScore[]}
      onAcknowledge={handleAcknowledge}
      onEscalate={handleEscalate}
      onResolve={handleResolve}
      onContactMember={handleContactMember}
      onViewMember={handleViewMember}
      onSuspendMember={handleSuspendMember}
    />
  )
}
