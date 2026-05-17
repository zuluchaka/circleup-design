import data from '@/../product/sections/community-and-social/data.json'
import { ReferralDashboard } from './components/ReferralDashboard'

export default function ReferralDashboardPreview() {
  return (
    <ReferralDashboard
      referralStats={data.referralStats as any}
      referrals={data.referrals as any}
      onShareLink={(channel) => console.log('Share link via:', channel)}
      onCopyLink={() => console.log('Copy link')}
      onSendReminder={(id) => console.log('Send reminder:', id)}
    />
  )
}
