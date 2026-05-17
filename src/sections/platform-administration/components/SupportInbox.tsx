import { useState } from 'react'
import type { SupportInboxProps, TicketPriority, TicketStatus, SupportTicket } from '@/../product/sections/platform-administration/types'

const priorityConfig: Record<TicketPriority, { label: string; color: string; bg: string }> = {
  low: { label: 'Low', color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800' },
  medium: { label: 'Medium', color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  high: { label: 'High', color: 'text-orange-700 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  urgent: { label: 'Urgent', color: 'text-red-700 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' },
}

const statusConfig: Record<TicketStatus, { label: string; color: string; bg: string }> = {
  open: { label: 'Open', color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  in_progress: { label: 'In Progress', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  pending: { label: 'Pending', color: 'text-purple-700 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  resolved: { label: 'Resolved', color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  closed: { label: 'Closed', color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800' },
}

const categoryIcons: Record<string, string> = {
  payment_issue: '💳',
  payout_issue: '💸',
  account_access: '🔐',
  circle_question: '⭕',
  feature_request: '✨',
  bug_report: '🐛',
  compliance: '📋',
  other: '📝',
}

export function SupportInbox({
  tickets,
  currentAgent,
  onTicketSelect,
  onAssign,
  onReply,
  onResolve,
}: SupportInboxProps) {
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(tickets[0] || null)
  const [replyText, setReplyText] = useState('')
  const [filter, setFilter] = useState<'all' | 'mine' | 'unassigned'>('all')
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all')

  const filteredTickets = tickets.filter(ticket => {
    const matchesAssignment =
      filter === 'all' ||
      (filter === 'mine' && ticket.assignedTo === currentAgent.id) ||
      (filter === 'unassigned' && !ticket.assignedTo)
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    return matchesAssignment && matchesStatus
  })

  const handleSelectTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket)
    onTicketSelect?.(ticket.id)
  }

  const handleReply = () => {
    if (selectedTicket && replyText.trim()) {
      onReply?.(selectedTicket.id, replyText)
      setReplyText('')
    }
  }

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length
  const myTickets = tickets.filter(t => t.assignedTo === currentAgent.id).length

  return (
    <div className="h-screen flex bg-slate-100 dark:bg-slate-950">
      {/* Sidebar - Ticket List */}
      <div className="w-80 lg:w-96 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Support Inbox</h1>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded">
                {openTickets} open
              </span>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-3">
            {(['all', 'mine', 'unassigned'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {f === 'all' ? 'All' : f === 'mine' ? `Mine (${myTickets})` : 'Unassigned'}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as TicketStatus | 'all')}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Ticket List */}
        <div className="flex-1 overflow-y-auto">
          {filteredTickets.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <span className="text-2xl">📭</span>
              </div>
              <p className="text-slate-500">No tickets found</p>
            </div>
          ) : (
            filteredTickets.map(ticket => (
              <div
                key={ticket.id}
                onClick={() => handleSelectTicket(ticket)}
                className={`p-4 border-b border-slate-100 dark:border-slate-800 cursor-pointer transition-colors ${
                  selectedTicket?.id === ticket.id
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-l-indigo-500'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border-l-4 border-l-transparent'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg">{categoryIcons[ticket.category]}</span>
                    <span className="font-medium text-slate-900 dark:text-white truncate">
                      {ticket.subject}
                    </span>
                  </div>
                  <span className={`shrink-0 px-2 py-0.5 rounded text-xs font-medium ${priorityConfig[ticket.priority].bg} ${priorityConfig[ticket.priority].color}`}>
                    {ticket.priority}
                  </span>
                </div>

                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">
                  {ticket.description}
                </p>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {ticket.userAvatar ? (
                      <img src={ticket.userAvatar} alt="" className="w-5 h-5 rounded-full" />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-medium text-slate-600 dark:text-slate-400">
                        {ticket.userName.charAt(0)}
                      </div>
                    )}
                    <span className="text-slate-600 dark:text-slate-400">{ticket.userName}</span>
                  </div>
                  <span className="text-slate-400">{formatTimeAgo(ticket.updatedAt)}</span>
                </div>

                {/* SLA indicator */}
                {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                  <div className="mt-2 flex items-center gap-1 text-xs">
                    <svg className="w-3 h-3 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-amber-600 dark:text-amber-400">
                      SLA: {formatTimeAgo(ticket.slaDeadline).replace(' ago', ' left')}
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Content - Ticket Detail */}
      {selectedTicket ? (
        <div className="flex-1 flex flex-col">
          {/* Ticket Header */}
          <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{categoryIcons[selectedTicket.category]}</span>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedTicket.subject}</h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[selectedTicket.status].bg} ${statusConfig[selectedTicket.status].color}`}>
                    {statusConfig[selectedTicket.status].label}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${priorityConfig[selectedTicket.priority].bg} ${priorityConfig[selectedTicket.priority].color}`}>
                    {priorityConfig[selectedTicket.priority].label} Priority
                  </span>
                  <span className="text-sm text-slate-500">via {selectedTicket.channel}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {selectedTicket.status !== 'resolved' && selectedTicket.status !== 'closed' && (
                  <>
                    <button
                      onClick={() => onAssign?.(selectedTicket.id, currentAgent.id)}
                      className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      Assign to Me
                    </button>
                    <button
                      onClick={() => onResolve?.(selectedTicket.id)}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                    >
                      Resolve
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* User Info Bar */}
          <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedTicket.userAvatar ? (
                  <img src={selectedTicket.userAvatar} alt="" className="w-10 h-10 rounded-full" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <span className="font-medium text-indigo-600 dark:text-indigo-400">
                      {selectedTicket.userName.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{selectedTicket.userName}</p>
                  <p className="text-sm text-slate-500">{selectedTicket.userEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                {selectedTicket.assignedToName && (
                  <div className="text-slate-500">
                    Assigned to: <span className="font-medium text-slate-900 dark:text-white">{selectedTicket.assignedToName}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Initial message */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  {selectedTicket.userName.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-slate-900 dark:text-white">{selectedTicket.userName}</span>
                  <span className="text-xs text-slate-400">{formatTimeAgo(selectedTicket.createdAt)}</span>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{selectedTicket.description}</p>
                </div>
              </div>
            </div>

            {/* Thread messages */}
            {selectedTicket.messages.map(message => (
              <div key={message.id} className={`flex gap-3 ${message.authorType === 'agent' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.authorType === 'agent'
                    ? 'bg-emerald-100 dark:bg-emerald-900/30'
                    : message.authorType === 'system'
                    ? 'bg-slate-100 dark:bg-slate-800'
                    : 'bg-indigo-100 dark:bg-indigo-900/30'
                }`}>
                  {message.authorAvatar ? (
                    <img src={message.authorAvatar} alt="" className="w-8 h-8 rounded-full" />
                  ) : (
                    <span className={`text-sm font-medium ${
                      message.authorType === 'agent'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : message.authorType === 'system'
                        ? 'text-slate-500'
                        : 'text-indigo-600 dark:text-indigo-400'
                    }`}>
                      {message.authorType === 'system' ? '🤖' : message.authorName.charAt(0)}
                    </span>
                  )}
                </div>
                <div className={`flex-1 ${message.authorType === 'agent' ? 'flex flex-col items-end' : ''}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-slate-900 dark:text-white">{message.authorName}</span>
                    {message.isInternal && (
                      <span className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs rounded">
                        Internal
                      </span>
                    )}
                    <span className="text-xs text-slate-400">{formatTimeAgo(message.createdAt)}</span>
                  </div>
                  <div className={`rounded-lg p-4 border max-w-[80%] ${
                    message.authorType === 'agent'
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800'
                      : message.authorType === 'system'
                      ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 italic'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}>
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Reply Box */}
          {selectedTicket.status !== 'closed' && (
            <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    {currentAgent.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <textarea
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex gap-2">
                      <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </div>
                    <button
                      onClick={handleReply}
                      disabled={!replyText.trim()}
                      className="px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Send Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-white dark:bg-slate-900">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
              <span className="text-3xl">📬</span>
            </div>
            <p className="text-slate-500">Select a ticket to view details</p>
          </div>
        </div>
      )}
    </div>
  )
}
