import { MyTrustScore } from './components'
import sampleData from '@/../product/sections/members-and-trust/data.json'
import type { Member, TrustScore, Reference, ScoreImprovementTip } from '@/../product/sections/members-and-trust/types'

export default function MyTrustScorePreview() {
  // Use second member (Adaeze) as the "current user" to show improvement opportunities
  const member = sampleData.members[1] as Member
  const trustScore = sampleData.trustScores.find(ts => ts.memberId === member.id) as TrustScore

  // Get references received by this member
  const references = sampleData.references.filter(
    r => r.toMemberId === member.id
  ) as Reference[]

  // Mock score history for the chart
  const scoreHistory = [
    { date: '2025-02-01', score: 820 },
    { date: '2025-03-01', score: 835 },
    { date: '2025-04-01', score: 842 },
    { date: '2025-05-01', score: 850 },
    { date: '2025-06-01', score: 855 },
    { date: '2025-07-01', score: 860 },
    { date: '2025-08-01', score: 865 },
    { date: '2025-09-01', score: 870 },
    { date: '2025-10-01', score: 878 },
    { date: '2025-11-01', score: 882 },
    { date: '2025-12-01', score: 888 },
    { date: '2026-01-01', score: 891 }
  ]

  const handleRequestReference = () => {
    console.log('Request reference')
  }

  const handleCompleteVerification = () => {
    console.log('Complete verification')
  }

  const handleViewHistory = () => {
    console.log('View history')
  }

  return (
    <MyTrustScore
      member={member}
      trustScore={trustScore}
      references={references}
      improvementTips={sampleData.scoreImprovementTips as ScoreImprovementTip[]}
      scoreHistory={scoreHistory}
      onRequestReference={handleRequestReference}
      onCompleteVerification={handleCompleteVerification}
      onViewHistory={handleViewHistory}
    />
  )
}
