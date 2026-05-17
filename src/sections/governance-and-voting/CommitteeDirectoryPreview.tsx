import data from '../../../product/sections/governance-and-voting/data.json'
import { CommitteeDirectory } from './components/CommitteeDirectory'

export default function CommitteeDirectoryPreview() {
  return (
    <CommitteeDirectory
      committees={data.committees}
      committeeMembers={data.committeeMembers}
      onRequestJoin={(id) => console.log('Request to join:', id)}
      onViewCommittee={(id) => console.log('View committee:', id)}
      onCreateCommittee={(committee) => console.log('Create committee:', committee)}
      onEditCommittee={(id, updates) => console.log('Edit committee:', id, updates)}
    />
  )
}
