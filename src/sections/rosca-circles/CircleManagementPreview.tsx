import { CircleManagement } from './components'
import sampleData from '@/../product/sections/rosca-circles/data.json'
import type { Circle, Participant, WaitlistEntry, CircleInvitation, Dispute } from '@/../product/sections/rosca-circles/types'

export default function CircleManagementPreview() {
  const circle = sampleData.circles[0] as Circle

  const handlePauseCircle = () => {
    console.log('Pause circle')
  }

  const handleExtendCircle = (additionalCycles: number) => {
    console.log('Extend circle by:', additionalCycles, 'cycles')
  }

  const handleRemoveMember = (participantId: string, reason: string) => {
    console.log('Remove member:', { participantId, reason })
  }

  const handleSuspendMember = (participantId: string, reason: string) => {
    console.log('Suspend member:', { participantId, reason })
  }

  const handlePromoteFromWaitlist = (waitlistEntryId: string) => {
    console.log('Promote from waitlist:', waitlistEntryId)
  }

  const handleSendInvitation = (email: string, phone?: string, message?: string) => {
    console.log('Send invitation:', { email, phone, message })
  }

  const handleCancelInvitation = (invitationId: string) => {
    console.log('Cancel invitation:', invitationId)
  }

  return (
    <CircleManagement
      circle={circle}
      participants={sampleData.participants as Participant[]}
      waitlist={sampleData.waitlist as WaitlistEntry[]}
      invitations={sampleData.circleInvitations as CircleInvitation[]}
      disputes={sampleData.disputes as Dispute[]}
      onPauseCircle={handlePauseCircle}
      onExtendCircle={handleExtendCircle}
      onRemoveMember={handleRemoveMember}
      onSuspendMember={handleSuspendMember}
      onPromoteFromWaitlist={handlePromoteFromWaitlist}
      onSendInvitation={handleSendInvitation}
      onCancelInvitation={handleCancelInvitation}
    />
  )
}
