import { AnnouncementComposer } from './components'
import data from '@/../product/sections/communication-and-events/data.json'

export default function AnnouncementComposerPreview() {
  return (
    <AnnouncementComposer
      templates={data.messageTemplates as any}
      onSave={() => {}}
      onPublish={() => {}}
      onSchedule={() => {}}
      onCancel={() => {}}
    />
  )
}
