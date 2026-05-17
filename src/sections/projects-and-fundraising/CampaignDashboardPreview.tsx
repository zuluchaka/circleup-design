import { CampaignDashboard } from './components/CampaignDashboard'
import data from '@/../product/sections/projects-and-fundraising/data.json'

export default function CampaignDashboardPreview() {
  const campaign = data.campaigns[0] as any
  const stats = (data.campaignStats as any[]).find((s) => s.campaignId === campaign.id) || data.campaignStats[0]
  const recentDonations = (data.donations as any[]).filter((d) => d.campaignId === campaign.id).slice(0, 10)
  return (
    <CampaignDashboard
      campaign={campaign}
      stats={stats as any}
      recentDonations={recentDonations as any}
      onExport={() => console.log('Export')}
      onPauseCampaign={() => console.log('Pause')}
      onEditCampaign={() => console.log('Edit')}
      onPostUpdate={() => console.log('Post update')}
    />
  )
}
