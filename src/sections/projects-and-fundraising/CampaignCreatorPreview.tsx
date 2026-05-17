import { CampaignCreator } from './components/CampaignCreator'

export default function CampaignCreatorPreview() {
  return (
    <CampaignCreator
      onSave={(c) => console.log('Save:', c)}
      onPublish={(c) => console.log('Publish:', c)}
      onCancel={() => console.log('Cancel')}
    />
  )
}
