import { MemberProfile } from './components'
import sampleData from '@/../product/sections/members-and-trust/data.json'
import type { Member, TrustScore, Reference, Feedback, ScoreImprovementTip, MemberDocument } from '@/../product/sections/members-and-trust/types'

export default function MemberProfilePreview() {
  // Use first member as example
  const member = sampleData.members[0] as Member
  const trustScore = sampleData.trustScores.find(ts => ts.memberId === member.id) as TrustScore

  // Get references for this member
  const referencesReceived = sampleData.references.filter(
    r => r.toMemberId === member.id
  ) as Reference[]
  const referencesGiven = sampleData.references.filter(
    r => r.fromMemberId === member.id
  ) as Reference[]

  // Get feedback
  const feedback = sampleData.feedback.filter(
    f => f.fromMemberId === member.id
  ) as Feedback[]

  // Get documents for this member
  const documents = sampleData.memberDocuments as MemberDocument[]

  const handleGiveReference = (memberId: string) => {
    console.log('Give reference to:', memberId)
  }

  const handleRequestReference = (memberId: string) => {
    console.log('Request reference from:', memberId)
  }

  const handleMessage = (memberId: string) => {
    console.log('Message member:', memberId)
  }

  const handleViewDocument = (documentId: string) => {
    console.log('View document:', documentId)
  }

  const handleBack = () => {
    console.log('Go back')
  }

  return (
    <MemberProfile
      member={member}
      trustScore={trustScore}
      referencesReceived={referencesReceived}
      referencesGiven={referencesGiven}
      feedback={feedback}
      documents={documents}
      improvementTips={sampleData.scoreImprovementTips as ScoreImprovementTip[]}
      onGiveReference={handleGiveReference}
      onRequestReference={handleRequestReference}
      onMessage={handleMessage}
      onViewDocument={handleViewDocument}
      onBack={handleBack}
    />
  )
}
