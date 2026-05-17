import { Inbox } from './components'
import data from '@/../product/sections/communication-and-events/data.json'

export default function InboxPreview() {
  return (
    <Inbox
      items={data.inboxItems as any}
      filters={{}}
      onFilterChange={() => {}}
      onMarkRead={() => {}}
      onMarkAllRead={() => {}}
      onArchive={() => {}}
      onDelete={() => {}}
      onItemClick={() => {}}
    />
  )
}
