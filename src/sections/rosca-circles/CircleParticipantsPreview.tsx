import { CircleParticipants } from './components'
import sampleData from '@/../product/sections/rosca-circles/data.json'
import type { Circle, Participant } from '@/../product/sections/rosca-circles/types'

export default function CircleParticipantsPreview() {
  const circle = sampleData.circles[0] as Circle
  const participants = sampleData.participants.filter(
    (p) => p.circleId === circle.id
  ) as Participant[]

  return (
    <CircleParticipants
      circle={circle}
      participants={participants}
      currentUserId="user-001"
      canInvite={true}
      onBack={() => console.log('Back')}
      onInviteMembers={() => console.log('Invite')}
      onViewParticipant={(id) => console.log('View participant:', id)}
    />
  )
}
