import { CampaignDetail } from './components/CampaignDetail'
import data from '@/../product/sections/projects-and-fundraising/data.json'

export default function CampaignDetailPreview() {
  const campaign = data.campaigns[0] as any
  const stats = (data.campaignStats as any[]).find((s) => s.campaignId === campaign.id) || data.campaignStats[0]
  const recentDonations = (data.donations as any[]).filter((d) => d.campaignId === campaign.id).slice(0, 10)
  const updates = (data.campaignUpdates as any[]).filter((u) => u.campaignId === campaign.id)
  return (
    <CampaignDetail
      campaign={campaign}
      recentDonations={recentDonations as any}
      updates={updates as any}
      stats={stats as any}
      onDonate={() => console.log('Donate')}
      onShare={() => console.log('Share')}
      onUpdateClick={(id) => console.log('Update click:', id)}
    />
  )
}
