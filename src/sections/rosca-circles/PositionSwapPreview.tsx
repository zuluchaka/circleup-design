import { PositionSwap } from './components'
import sampleData from '@/../product/sections/rosca-circles/data.json'
import type { Participant, PositionSwapRequest } from '@/../product/sections/rosca-circles/types'

export default function PositionSwapPreview() {
  const handleSubmitRequest = (targetId: string, reason: string) => {
    console.log('Submit swap request:', { targetId, reason })
  }

  const handleRespondToRequest = (requestId: string, approved: boolean, reason?: string) => {
    console.log('Respond to swap request:', { requestId, approved, reason })
  }

  return (
    <PositionSwap
      circleId="circle-1"
      participants={sampleData.participants as Participant[]}
      currentUserId="user-1"
      pendingRequests={sampleData.positionSwapRequests as PositionSwapRequest[]}
      onSubmitRequest={handleSubmitRequest}
      onRespondToRequest={handleRespondToRequest}
    />
  )
}
