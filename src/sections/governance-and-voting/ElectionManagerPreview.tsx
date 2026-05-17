import data from '../../../product/sections/governance-and-voting/data.json'
import { ElectionManager } from './components/ElectionManager'

export default function ElectionManagerPreview() {
  return (
    <ElectionManager
      elections={data.elections}
      positions={data.positions}
      candidates={data.candidates}
      onCreateElection={(election) => console.log('Create election:', election)}
      onEditElection={(id, updates) => console.log('Edit election:', id, updates)}
      onApproveCandidate={(id) => console.log('Approve candidate:', id)}
      onRejectCandidate={(id) => console.log('Reject candidate:', id)}
      onCertifyResults={(id) => console.log('Certify results:', id)}
      onViewElection={(id) => console.log('View election:', id)}
    />
  )
}
