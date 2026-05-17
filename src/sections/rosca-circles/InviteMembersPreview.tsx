import { InviteMembers } from './components'
import sampleData from '@/../product/sections/rosca-circles/data.json'
import type { Circle, CircleInvitation, InvitationChannel } from '@/../product/sections/rosca-circles/types'

export default function InviteMembersPreview() {
  const circle = sampleData.circles[0] as Circle

  const handleSendInvitation = (email: string, phone?: string, channel?: InvitationChannel, message?: string) => {
    console.log('Send invitation:', { email, phone, channel, message })
  }

  const handleResend = (invitationId: string) => {
    console.log('Resend invitation:', invitationId)
  }

  const handleCancel = (invitationId: string) => {
    console.log('Cancel invitation:', invitationId)
  }

  const handleGenerateQRCode = () => {
    console.log('Generate QR code')
  }

  const handleShareLink = (channel: 'whatsapp' | 'email' | 'sms' | 'copy') => {
    console.log('Share link via:', channel)
  }

  return (
    <InviteMembers
      circle={circle}
      invitations={sampleData.circleInvitations as CircleInvitation[]}
      onSendInvitation={handleSendInvitation}
      onResend={handleResend}
      onCancel={handleCancel}
      onGenerateQRCode={handleGenerateQRCode}
      onShareLink={handleShareLink}
    />
  )
}
