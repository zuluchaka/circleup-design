import { CampaignCreator } from './components/CampaignCreator'

export default function CampaignCreatorView() {
  return (
    <CampaignCreator
      associationId="assoc-001"
      onSave={(campaign) => console.log('Save draft:', campaign)}
      onPublish={(campaign) => console.log('Publish campaign:', campaign)}
      onCancel={() => console.log('Cancel')}
    />
  )
}
