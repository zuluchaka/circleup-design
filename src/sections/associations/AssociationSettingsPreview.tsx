import data from '@/../product/sections/associations/data.json'
import { AssociationSettings } from './components/AssociationSettings'

export default function AssociationSettingsPreview() {
  // Use the first association for the preview
  const association = data.associations[0]

  return (
    <AssociationSettings
      association={association}
      onSave={(updates) => console.log('Save settings:', updates)}
      onUploadLogo={() => console.log('Upload logo')}
      onUploadCover={() => console.log('Upload cover')}
      onBack={() => console.log('Go back')}
    />
  )
}
