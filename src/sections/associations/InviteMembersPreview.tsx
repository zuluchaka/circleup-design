import data from '@/../product/sections/associations/data.json'
import { InviteMembers } from './components/InviteMembers'

export default function InviteMembersPreview() {
  return (
    <InviteMembers
      pendingInvitations={data.pendingInvitations}
      joinRequests={data.joinRequests}
      onSendInvite={(channel, contact) => console.log('Send invite:', channel, contact)}
      onCancelInvitation={(id) => console.log('Cancel invitation:', id)}
      onResendInvitation={(id) => console.log('Resend invitation:', id)}
      onApproveJoinRequest={(id) => console.log('Approve request:', id)}
      onRejectJoinRequest={(id) => console.log('Reject request:', id)}
      onBack={() => console.log('Go back')}
    />
  )
}
