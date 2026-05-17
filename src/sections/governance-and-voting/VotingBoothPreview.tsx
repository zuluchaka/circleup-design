import data from '../../../product/sections/governance-and-voting/data.json'
import { VotingBooth } from './components/VotingBooth'

export default function VotingBoothPreview() {
  const votingElection = data.elections.find(e => e.status === 'voting')
  const electionCandidates = data.candidates.filter(c => c.electionId === votingElection?.id)

  return (
    <VotingBooth
      election={votingElection}
      candidates={electionCandidates}
      allowChangeVote={false}
      onSubmitVote={(vote) => console.log('Submit vote:', vote)}
      onChangeVote={(id, vote) => console.log('Change vote:', id, vote)}
      onAbstain={(reason) => console.log('Abstain:', reason)}
    />
  )
}
