import data from '@/../product/sections/associations/data.json'
import { MemberDirectory } from './components/MemberDirectory'

export default function MemberDirectoryPreview() {
  return (
    <MemberDirectory
      members={data.members}
      currentUserRole="president"
      onViewMember={(id) => console.log('View member:', id)}
      onChangeMemberRole={(memberId, newRole) => console.log('Change role:', memberId, newRole)}
      onRemoveMember={(id) => console.log('Remove member:', id)}
      onSuspendMember={(id) => console.log('Suspend member:', id)}
      onInviteMembers={() => console.log('Invite members')}
      onBack={() => console.log('Go back')}
    />
  )
}
