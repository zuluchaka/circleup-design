import type { ChatViewProps, Message } from '@/../product/sections/communication-and-events/types'

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function MessageBubble({
  message,
  isOwn,
  showAvatar,
  showName,
}: {
  message: Message
  isOwn: boolean
  showAvatar: boolean
  showName: boolean
}) {
  return (
    <div className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className="flex-shrink-0 w-8">
        {showAvatar && !isOwn && (
          <img
            src={message.sender.avatar}
            alt=""
            className="w-8 h-8 rounded-full"
          />
        )}
      </div>

      {/* Message */}
      <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[70%]`}>
        {showName && !isOwn && (
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 ml-1">
            {message.sender.name}
          </span>
        )}

        {message.type === 'file' && message.attachment ? (
          <div className={`rounded-2xl p-3 ${
            isOwn
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                isOwn ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-600'
              }`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{message.attachment.name}</p>
                <p className={`text-xs ${isOwn ? 'text-indigo-200' : 'text-slate-500 dark:text-slate-400'}`}>
                  {(message.attachment.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button className={`p-1.5 rounded-lg transition-colors ${
                isOwn
                  ? 'hover:bg-indigo-500'
                  : 'hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
            {message.content && (
              <p className="mt-2 text-sm">{message.content}</p>
            )}
          </div>
        ) : (
          <div className={`rounded-2xl px-4 py-2.5 ${
            isOwn
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
          }`}>
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </div>
        )}

        {/* Meta */}
        <div className={`flex items-center gap-2 mt-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {formatTime(message.createdAt)}
          </span>
          {isOwn && (
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {message.readBy.length > 1 ? (
                <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function DateDivider({ date }: { date: string }) {
  return (
    <div className="flex items-center gap-4 my-6">
      <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
      <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
        {formatDate(date)}
      </span>
      <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
    </div>
  )
}

export function ChatView({
  conversation,
  messages,
  currentUserId,
  quickReplies,
  onSendMessage,
  onReply: _onReply,
  onReact: _onReact,
  onLoadMore,
  hasMore,
  isLoading,
}: ChatViewProps) {
  const isGroup = conversation.type === 'group' || conversation.type === 'channel'
  const otherParticipant = conversation.participants.find((p) => p.id !== currentUserId)

  // Group messages by date
  const groupedMessages: { date: string; messages: Message[] }[] = []
  let currentDate = ''
  messages.forEach((msg) => {
    const msgDate = new Date(msg.createdAt).toDateString()
    if (msgDate !== currentDate) {
      currentDate = msgDate
      groupedMessages.push({ date: msg.createdAt, messages: [] })
    }
    groupedMessages[groupedMessages.length - 1].messages.push(msg)
  })

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-800">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center gap-4 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        {isGroup ? (
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        ) : otherParticipant?.avatar ? (
          <img src={otherParticipant.avatar} alt="" className="w-10 h-10 rounded-full" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700" />
        )}

        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-slate-900 dark:text-white truncate">
            {isGroup ? conversation.name : otherParticipant?.name || 'Unknown'}
          </h2>
          {isGroup && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {conversation.participants.length} members
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {hasMore && (
          <div className="text-center mb-4">
            <button
              onClick={onLoadMore}
              disabled={isLoading}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Load earlier messages'}
            </button>
          </div>
        )}

        {groupedMessages.map((group) => (
          <div key={group.date}>
            <DateDivider date={group.date} />
            <div className="space-y-3">
              {group.messages.map((message, msgIdx) => {
                const isOwn = message.sender.id === currentUserId
                const prevMessage = msgIdx > 0 ? group.messages[msgIdx - 1] : null
                const showAvatar = !prevMessage || prevMessage.sender.id !== message.sender.id
                const showName = isGroup && showAvatar

                return (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isOwn={isOwn}
                    showAvatar={showAvatar}
                    showName={showName}
                  />
                )
              })}
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
                No messages yet
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Start the conversation!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Replies */}
      {quickReplies.length > 0 && (
        <div className="flex-shrink-0 px-6 py-2 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">Quick:</span>
            {quickReplies.map((reply) => (
              <button
                key={reply.id}
                onClick={() => onSendMessage(reply.content, 'text')}
                className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full transition-colors"
              >
                {reply.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex-shrink-0 p-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-end gap-3">
          <button className="flex-shrink-0 p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>

          <div className="flex-1 relative">
            <textarea
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 border-0 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 resize-none"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>

          <button className="flex-shrink-0 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
