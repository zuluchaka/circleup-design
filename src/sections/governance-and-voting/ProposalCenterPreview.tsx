import data from '../../../product/sections/governance-and-voting/data.json'
import { ProposalCenter } from './components/ProposalCenter'

export default function ProposalCenterPreview() {
  return (
    <ProposalCenter
      proposals={data.proposals}
      comments={data.proposalComments}
      onSubmitProposal={(proposal) => console.log('Submit proposal:', proposal)}
      onAddComment={(id, content, isAmendment) => console.log('Add comment:', id, content, isAmendment)}
      onVote={(id, choice) => console.log('Vote:', id, choice)}
      onViewProposal={(id) => console.log('View proposal:', id)}
      onFilter={(filters) => console.log('Filter:', filters)}
    />
  )
}
