import { Conversations } from './components'
import data from '@/../product/sections/communication-and-events/data.json'

export default function ConversationsPreview() {
  return (
    <div className="h-screen">
      <Conversations
        conversations={data.conversations as any}
        selectedId="conv-002"
        onSelect={() => {}}
        onNewMessage={() => {}}
        onSearch={() => {}}
      />
    </div>
  )
}
