import data from '../../../product/sections/governance-and-voting/data.json'
import { CandidateProfile } from './components/CandidateProfile'

export default function CandidateProfilePreview() {
  const candidate = data.candidates[0]
  const position = data.positions.find(p => p.id === candidate.positionId)!
  const election = data.elections.find(e => e.id === candidate.electionId)!
  const endorsements = data.endorsements.filter(e => e.candidateId === candidate.id)

  return (
    <CandidateProfile
      candidate={candidate}
      endorsements={endorsements}
      position={position}
      election={election}
      onEndorse={(id, statement) => console.log('Endorse:', id, statement)}
      onAskQuestion={(id, question) => console.log('Ask question:', id, question)}
      onShare={(id) => console.log('Share:', id)}
    />
  )
}
