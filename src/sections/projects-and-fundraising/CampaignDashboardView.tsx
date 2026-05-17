import data from '@/../product/sections/projects-and-fundraising/data.json'
import { CampaignDashboard } from './components/CampaignDashboard'

export default function CampaignDashboardView() {
  const campaign = data.campaigns[0]
  const donations = data.donations.filter(d => d.campaignId === campaign.id)
  const stats = data.campaignStats[campaign.id as keyof typeof data.campaignStats]

  return (
    <CampaignDashboard
      campaign={campaign}
      stats={stats}
      recentDonations={donations}
      onExport={(format) => console.log('Export:', format)}
      onPauseCampaign={() => console.log('Pause campaign')}
      onEditCampaign={() => console.log('Edit campaign')}
      onPostUpdate={() => console.log('Post update')}
    />
  )
}
