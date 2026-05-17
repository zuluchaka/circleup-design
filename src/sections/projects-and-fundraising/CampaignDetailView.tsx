import data from '@/../product/sections/projects-and-fundraising/data.json'
import { CampaignDetail } from './components/CampaignDetail'

export default function CampaignDetailView() {
  const campaign = data.campaigns[0]
  const donations = data.donations.filter(d => d.campaignId === campaign.id)
  const updates = data.campaignUpdates.filter(u => u.campaignId === campaign.id)
  const stats = data.campaignStats[campaign.id as keyof typeof data.campaignStats]

  return (
    <CampaignDetail
      campaign={campaign}
      recentDonations={donations}
      updates={updates}
      stats={stats}
      onDonate={() => console.log('Open donation flow')}
      onShare={(platform) => console.log('Share on:', platform)}
      onUpdateClick={(id) => console.log('View update:', id)}
    />
  )
}
