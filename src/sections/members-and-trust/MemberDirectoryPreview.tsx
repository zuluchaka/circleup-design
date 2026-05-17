import { MemberDirectory } from './components'
import sampleData from '@/../product/sections/members-and-trust/data.json'
import type { Member, TrustScore } from '@/../product/sections/members-and-trust/types'

export default function MemberDirectoryPreview() {
  const handleViewMember = (id: string) => {
    console.log('View member:', id)
  }

  const handleEditRole = (id: string, newRole: string) => {
    console.log('Edit role:', id, newRole)
  }

  const handleSuspendMember = (id: string) => {
    console.log('Suspend member:', id)
  }

  const handleRemoveMember = (id: string) => {
    console.log('Remove member:', id)
  }

  const handleInviteMembers = () => {
    console.log('Invite members')
  }

  return (
    <MemberDirectory
      members={sampleData.members as Member[]}
      trustScores={sampleData.trustScores as TrustScore[]}
      onViewMember={handleViewMember}
      onEditRole={handleEditRole}
      onSuspendMember={handleSuspendMember}
      onRemoveMember={handleRemoveMember}
      onInviteMembers={handleInviteMembers}
    />
  )
}
