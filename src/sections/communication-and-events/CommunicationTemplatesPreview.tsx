import { CommunicationTemplates } from './components'
import data from '@/../product/sections/communication-and-events/data.json'
import type { NotificationCategory } from '@/../product/sections/communication-and-events/types'

export default function CommunicationTemplatesPreview() {
  const categories: NotificationCategory[] = ['payments', 'governance', 'social', 'announcements', 'events', 'messages']

  return (
    <CommunicationTemplates
      templates={data.messageTemplates as any}
      categories={categories}
      onSelect={() => {}}
      onCreate={() => {}}
      onEdit={() => {}}
      onDelete={() => {}}
      onDuplicate={() => {}}
    />
  )
}
