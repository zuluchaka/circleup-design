import { MemberRiskScores } from './components'
import sampleData from '@/../product/sections/rosca-circles/data.json'
import type { MemberRiskScore } from '@/../product/sections/rosca-circles/types'

export default function MemberRiskScoresPreview() {
  const handleViewMember = (memberId: string) => {
    console.log('View member:', memberId)
  }

  const handleApprove = (memberId: string) => {
    console.log('Approve member:', memberId)
  }

  const handleReject = (memberId: string, reason: string) => {
    console.log('Reject member:', { memberId, reason })
  }

  const handleRequestMoreInfo = (memberId: string) => {
    console.log('Request more info:', memberId)
  }

  return (
    <MemberRiskScores
      riskScores={sampleData.memberRiskScores as MemberRiskScore[]}
      onViewMember={handleViewMember}
      onApprove={handleApprove}
      onReject={handleReject}
      onRequestMoreInfo={handleRequestMoreInfo}
    />
  )
}
