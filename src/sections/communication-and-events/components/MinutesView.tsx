import { useState } from 'react'
import type { MinutesViewProps } from '@/../product/sections/communication-and-events/types'

export default function MinutesView({
  minutes,
  items,
  comments,
  onComment,
  onResolveComment,
  onDownloadPdf,
}: MinutesViewProps) {
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  const handleSubmitComment = () => {
    if (!newComment.trim()) return
    onComment(newComment, replyingTo || undefined)
    setNewComment('')
    setReplyingTo(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Meeting Minutes</h3>
          <p className="text-sm text-gray-500">
            By {minutes.authorName}
            {minutes.publishedAt && ` | Published ${new Date(minutes.publishedAt).toLocaleDateString('de-CH')}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded-full ${
            minutes.status === 'published' ? 'bg-green-100 text-green-700' :
            minutes.status === 'approved' ? 'bg-blue-100 text-blue-700' :
            'bg-yellow-100 text-yellow-700'
          }`}>
            {minutes.status.replace('_', ' ')}
          </span>
          <button
            onClick={onDownloadPdf}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            PDF
          </button>
        </div>
      </div>

      {/* Summary */}
      {minutes.summary && (
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">{minutes.summary}</p>
        </div>
      )}

      {/* Minute items */}
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={item.id} className="p-4 border rounded-lg dark:border-gray-700">
            <h4 className="font-medium text-gray-900 dark:text-white">
              {idx + 1}. {item.agendaItemTitle}
            </h4>

            {item.discussionNotes && (
              <div className="mt-2">
                <span className="text-xs text-gray-400">Discussion</span>
                <p className="text-sm text-gray-700 dark:text-gray-300">{item.discussionNotes}</p>
              </div>
            )}

            {item.decision && (
              <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Decision</span>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.decision}</p>
              </div>
            )}

            {item.voteResult && (item.voteResult.for !== undefined || item.voteResult.against !== undefined) && (
              <div className="mt-2 flex gap-3 text-sm">
                <span className="text-green-600">For: {item.voteResult.for || 0}</span>
                <span className="text-red-600">Against: {item.voteResult.against || 0}</span>
                <span className="text-gray-500">Abstain: {item.voteResult.abstain || 0}</span>
                <span className="font-medium">
                  {(item.voteResult.for || 0) > (item.voteResult.against || 0) ? 'PASSED' : 'REJECTED'}
                </span>
              </div>
            )}

            {item.actionItems.length > 0 && (
              <div className="mt-2">
                <span className="text-xs text-gray-400">Action Items</span>
                <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                  {item.actionItems.map((ai, i) => (
                    <li key={i}>
                      {ai.description}
                      {ai.due_date && <span className="text-xs text-gray-400"> (due {ai.due_date})</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Comments */}
      <div className="border-t dark:border-gray-700 pt-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Comments ({comments.length})
        </h4>

        {comments.map(c => (
          <div key={c.id} className="mb-3">
            <div className={`p-3 rounded-lg ${c.resolved ? 'bg-gray-50 dark:bg-gray-800 opacity-60' : 'bg-white dark:bg-gray-800 border dark:border-gray-700'}`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{c.userName}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString('de-CH')}</span>
                  {!c.resolved && (
                    <>
                      <button onClick={() => onResolveComment(c.id)} className="text-xs text-green-600 hover:underline">Resolve</button>
                      <button onClick={() => setReplyingTo(c.id)} className="text-xs text-blue-600 hover:underline">Reply</button>
                    </>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{c.content}</p>
            </div>

            {c.replies && c.replies.map(r => (
              <div key={r.id} className="ml-6 mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                <span className="font-medium">{r.userName}</span>
                <span className="text-gray-400 text-xs ml-2">{new Date(r.createdAt).toLocaleDateString('de-CH')}</span>
                <p className="text-gray-700 dark:text-gray-300 mt-0.5">{r.content}</p>
              </div>
            ))}
          </div>
        ))}

        {/* Comment input */}
        <div className="flex gap-2 mt-3">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment()}
            placeholder={replyingTo ? 'Write a reply...' : 'Add a comment...'}
            className="flex-1 px-3 py-1.5 text-sm border rounded-md dark:bg-gray-800 dark:border-gray-600"
          />
          {replyingTo && (
            <button onClick={() => setReplyingTo(null)} className="text-xs text-gray-400 hover:text-gray-600">
              Cancel
            </button>
          )}
          <button
            onClick={handleSubmitComment}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
