import type { ConversationsListProps, Conversation } from '@/../product/sections/communication-and-events/types'

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m`
  if (diffHours < 24) return `${diffHours}h`
  if (diffDays < 7) return `${diffDays}d`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function ConversationRow({
  conversation,
  isSelected,
  onSelect,
}: {
  conversation: Conversation
  isSelected: boolean
  onSelect: () => void
}) {
  const isGroup = conversation.type === 'group' || conversation.type === 'channel'
  const displayName = isGroup
    ? conversation.name
    : conversation.participants.find((p) => p.id !== 'current-user')?.name || 'Unknown'
  const displayAvatar = isGroup
    ? null
    : conversation.participants.find((p) => p.id !== 'current-user')?.avatar

  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-start gap-3 p-4 transition-colors text-left ${
        isSelected
          ? 'bg-indigo-50 dark:bg-indigo-900/20 border-l-2 border-indigo-500'
          : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 border-l-2 border-transparent'
      }`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {displayAvatar ? (
          <img src={displayAvatar} alt="" className="w-12 h-12 rounded-full" />
        ) : (
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            conversation.type === 'channel'
              ? 'bg-amber-100 dark:bg-amber-900/30'
              : 'bg-indigo-100 dark:bg-indigo-900/30'
          }`}>
            {conversation.type === 'channel' ? (
              <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            )}
          </div>
        )}
        {conversation.pinnedAt && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 dark:bg-amber-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 5a2 2 0 012-2h6a2 2 0 012 2v2h2a1 1 0 010 2h-1.05l-.633 7.618A2 2 0 0113.327 18H6.673a2 2 0 01-1.99-1.382L4.05 9H3a1 1 0 010-2h2V5zm3 0v2h4V5H8z" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className={`font-medium truncate ${
            conversation.unreadCount > 0
              ? 'text-slate-900 dark:text-white'
              : 'text-slate-700 dark:text-slate-300'
          }`}>
            {displayName}
          </h3>
          {conversation.lastMessage && (
            <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
              {formatRelativeTime(conversation.lastMessage.createdAt)}
            </span>
          )}
        </div>

        {isGroup && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            {conversation.participants.length} members
          </p>
        )}

        {conversation.lastMessage && (
          <div className="flex items-center gap-2 mt-1">
            <p className={`text-sm truncate flex-1 ${
              conversation.unreadCount > 0
                ? 'text-slate-700 dark:text-slate-300'
                : 'text-slate-500 dark:text-slate-400'
            }`}>
              {isGroup && conversation.lastMessage.sender && (
                <span className="font-medium">{conversation.lastMessage.sender.name}: </span>
              )}
              {conversation.lastMessage.type === 'file' ? (
                <span className="inline-flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  Attachment
                </span>
              ) : (
                conversation.lastMessage.content
              )}
            </p>
            {conversation.unreadCount > 0 && (
              <span className="flex-shrink-0 w-5 h-5 bg-indigo-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  )
}

export function Conversations({
  conversations,
  selectedId,
  onSelect,
  onNewMessage,
  onSearch,
}: ConversationsListProps) {
  const pinnedConversations = conversations.filter((c) => c.pinnedAt)
  const unpinnedConversations = conversations.filter((c) => !c.pinnedAt)

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Messages</h1>
          <button
            onClick={onNewMessage}
            className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search conversations..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length > 0 ? (
          <>
            {/* Pinned */}
            {pinnedConversations.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-slate-50 dark:bg-slate-700/50">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Pinned
                  </span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {pinnedConversations.map((conversation) => (
                    <ConversationRow
                      key={conversation.id}
                      conversation={conversation}
                      isSelected={selectedId === conversation.id}
                      onSelect={() => onSelect(conversation)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All Conversations */}
            {unpinnedConversations.length > 0 && (
              <div>
                {pinnedConversations.length > 0 && (
                  <div className="px-4 py-2 bg-slate-50 dark:bg-slate-700/50">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      All Messages
                    </span>
                  </div>
                )}
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {unpinnedConversations.map((conversation) => (
                    <ConversationRow
                      key={conversation.id}
                      conversation={conversation}
                      isSelected={selectedId === conversation.id}
                      onSelect={() => onSelect(conversation)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
              No conversations yet
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              Start a conversation with a member
            </p>
            <button
              onClick={onNewMessage}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Message
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
