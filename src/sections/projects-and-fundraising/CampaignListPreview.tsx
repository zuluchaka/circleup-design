import { CampaignList } from './components/CampaignList'
import data from '@/../product/sections/projects-and-fundraising/data.json'

export default function CampaignListPreview() {
  return (
    <CampaignList
      campaigns={data.campaigns as any}
      onCampaignClick={(id) => console.log('Click:', id)}
      onCreateCampaign={() => console.log('Create')}
    />
  )
}
