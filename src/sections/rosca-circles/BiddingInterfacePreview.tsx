import { BiddingInterface } from './components'
import sampleData from '@/../product/sections/rosca-circles/data.json'
import type { Circle, Bid } from '@/../product/sections/rosca-circles/types'

export default function BiddingInterfacePreview() {
  const circle = sampleData.circles[0] as Circle
  const bids = sampleData.bids as Bid[]

  // Bidding ends in 24 hours from now
  const biddingEndsAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

  const handleSubmitBid = (amount: number, reason?: string) => {
    console.log('Submit bid:', { amount, reason })
  }

  const handleWithdrawBid = (bidId: string) => {
    console.log('Withdraw bid:', bidId)
  }

  return (
    <BiddingInterface
      circle={circle}
      cycle={3}
      bids={bids}
      currentUserId="user-1"
      biddingEndsAt={biddingEndsAt}
      minimumBid={50}
      onSubmitBid={handleSubmitBid}
      onWithdrawBid={handleWithdrawBid}
    />
  )
}
