import { EmergencyFundPanel } from './components'
import sampleData from '@/../product/sections/treasury-and-funds/data.json'
import type { Fund, EmergencyFundRequest, EmergencyFundVote, VoteChoice } from '@/../product/sections/treasury-and-funds/types'

export default function EmergencyFundPanelPreview() {
  const fund = sampleData.funds[0] as Fund
  const requests = sampleData.emergencyFundRequests.filter(
    (r) => r.fundId === fund.id
  ) as EmergencyFundRequest[]
  const userVotes = sampleData.emergencyFundVotes.filter(
    (v) => v.voterId === 'user-101'
  ) as EmergencyFundVote[]

  const handleSubmitRequest = (request: unknown) => {
    console.log('Submit request:', request)
  }

  const handleVote = (requestId: string, vote: VoteChoice, comment?: string) => {
    console.log('Vote:', requestId, vote, comment)
  }

  const handleViewRequest = (requestId: string) => {
    console.log('View request:', requestId)
  }

  const handleConfigureReplenishment = () => {
    console.log('Configure replenishment')
  }

  return (
    <EmergencyFundPanel
      fund={fund}
      requests={requests}
      userVotes={userVotes}
      currentUserId="user-101"
      onSubmitRequest={handleSubmitRequest}
      onVote={handleVote}
      onViewRequest={handleViewRequest}
      onConfigureReplenishment={handleConfigureReplenishment}
    />
  )
}
