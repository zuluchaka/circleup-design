import data from '@/../product/sections/projects-and-fundraising/data.json'
import { CampaignList } from './components/CampaignList'

export default function CampaignListView() {
  return (
    <CampaignList
      campaigns={data.campaigns}
      onCampaignClick={(id) => console.log('View campaign:', id)}
      onCreateCampaign={() => console.log('Create campaign')}
      showFilters={true}
    />
  )
}
