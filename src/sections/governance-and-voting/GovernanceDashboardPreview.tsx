import data from '../../../product/sections/governance-and-voting/data.json'
import { GovernanceDashboard } from './components/GovernanceDashboard'

export default function GovernanceDashboardPreview() {
  return (
    <GovernanceDashboard
      summary={data.dashboardSummary}
      elections={data.elections}
      proposals={data.proposals}
      committees={data.committees}
      decisions={data.decisions}
      onViewElection={(id) => console.log('View election:', id)}
      onViewProposal={(id) => console.log('View proposal:', id)}
      onVote={(type, id) => console.log('Vote on:', type, id)}
      onSubmitProposal={() => console.log('Submit proposal')}
    />
  )
}
