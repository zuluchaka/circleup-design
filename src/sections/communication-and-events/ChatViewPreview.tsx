import { ChatView } from './components'
import data from '@/../product/sections/communication-and-events/data.json'

export default function ChatViewPreview() {
  const conversation = data.conversations[0] as any
  const messages = data.messages.filter((m: any) => m.conversationId === conversation.id) as any

  return (
    <div className="h-screen">
      <ChatView
        conversation={conversation}
        messages={messages}
        currentUserId="user-001"
        quickReplies={data.quickReplies as any}
        onSendMessage={() => {}}
        onReply={() => {}}
        onReact={() => {}}
        onLoadMore={() => {}}
        hasMore={true}
        isLoading={false}
      />
    </div>
  )
}
