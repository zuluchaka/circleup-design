import { useState } from 'react'
import type { MeetingMinutesData, MinuteItemData, MinuteComment, MinutesStatus } from '@/../product/sections/communication-and-events/types'

export interface MinutesReviewProps {
  minutes: MeetingMinutesData
  items: MinuteItemData[]
  comments: MinuteComment[]
  onApprove: () => void
  onReject: () => void
  onAddComment: (content: string, parentId?: string) => void
  onResolveComment: (id: string) => void
}

const statusConfig: Record<MinutesStatus, { label: string; bg: string; text: string }> = {
  draft: { label: 'Draft', bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400' },
  pending_review: { label: 'Pending Review', bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
  approved: { label: 'Approved', bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400' },
  published: { label: 'Published', bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-400' },
}

function VoteBar({ voteResult }: { voteResult: { for?: number; against?: number; abstain?: number } }) {
  const forCount = voteResult.for || 0
  const againstCount = voteResult.against || 0
  const abstainCount = voteResult.abstain || 0
  const total = forCount + againstCount + abstainCount
  if (total === 0) return null

  const forPct = (forCount / total) * 100
  const againstPct = (againstCount / total) * 100
  const abstainPct = (abstainCount / total) * 100

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Vote Result</span>
        <span className={`text-xs font-semibold ${forCount > againstCount ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {forCount > againstCount ? 'PASSED' : 'REJECTED'}
        </span>
      </div>
      <div className="flex h-3 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700">
        {forPct > 0 && (
          <div className="bg-green-500 dark:bg-green-600" style={{ width: `${forPct}%` }} />
        )}
        {againstPct > 0 && (
          <div className="bg-red-500 dark:bg-red-600" style={{ width: `${againstPct}%` }} />
        )}
        {abstainPct > 0 && (
          <div className="bg-slate-300 dark:bg-slate-500" style={{ width: `${abstainPct}%` }} />
        )}
      </div>
      <div className="flex gap-4 mt-1 text-xs">
        <span className="text-green-600 dark:text-green-400">For: {forCount}</span>
        <span className="text-red-600 dark:text-red-400">Against: {againstCount}</span>
        <span className="text-slate-500 dark:text-slate-400">Abstain: {abstainCount}</span>
      </div>
    </div>
  )
}

function CommentThread({
  comment,
  onResolve,
  onReply,
}: {
  comment: MinuteComment
  onResolve: (id: string) => void
  onReply: (id: string) => void
}) {
  return (
    <div className="mb-3">
      <div className={`p-3 rounded-lg ${
        comment.resolved
          ? 'bg-slate-50 dark:bg-slate-800/50 opacity-60'
          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-900 dark:text-white">{comment.userName}</span>
            {comment.resolved && (
              <span className="px-1.5 py-0.5 text-xs rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Resolved
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">{new Date(comment.createdAt).toLocaleDateString('de-CH')}</span>
            {!comment.resolved && (
              <>
                <button
                  onClick={() => onResolve(comment.id)}
                  className="text-xs text-green-600 dark:text-green-400 hover:underline"
                >
                  Resolve
                </button>
                <button
                  onClick={() => onReply(comment.id)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Reply
                </button>
              </>
            )}
          </div>
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{comment.content}</p>
      </div>

      {comment.replies && comment.replies.map(reply => (
        <div key={reply.id} className="ml-6 mt-1.5 p-2.5 bg-slate-50 dark:bg-slate-800/70 rounded-lg text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-900 dark:text-white">{reply.userName}</span>
            <span className="text-xs text-slate-400">{new Date(reply.createdAt).toLocaleDateString('de-CH')}</span>
            {reply.resolved && (
              <span className="px-1.5 py-0.5 text-xs rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Resolved
              </span>
            )}
          </div>
          <p className="text-slate-700 dark:text-slate-300 mt-0.5">{reply.content}</p>
        </div>
      ))}
    </div>
  )
}

export default function MinutesReview({
  minutes,
  items,
  comments,
  onApprove,
  onReject,
  onAddComment,
  onResolveComment,
}: MinutesReviewProps) {
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  const status = statusConfig[minutes.status]
  const sortedItems = [...items].sort((a, b) => a.position - b.position)
  const unresolvedCount = comments.filter(c => !c.resolved).length

  const handleSubmitComment = () => {
    if (!newComment.trim()) return
    onAddComment(newComment.trim(), replyingTo || undefined)
    setNewComment('')
    setReplyingTo(null)
  }

  const replyingToComment = replyingTo
    ? comments.find(c => c.id === replyingTo)
    : null

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Status Banner */}
        <div className={`rounded-xl p-4 mb-6 ${status.bg}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`text-sm font-semibold ${status.text}`}>{status.label}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                by {minutes.authorName}
                {minutes.approvedByName && ` | Approved by ${minutes.approvedByName}`}
              </span>
            </div>
            {unresolvedCount > 0 && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                {unresolvedCount} unresolved comment{unresolvedCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Review Meeting Minutes
          </h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Last updated {new Date(minutes.updatedAt).toLocaleDateString('de-CH')}
          </span>
        </div>

        {/* Summary */}
        {minutes.summary && (
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 mb-6">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Meeting Summary</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300">{minutes.summary}</p>
          </div>
        )}

        {/* Agenda Items */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Agenda Items</h3>

          {sortedItems.map((item, idx) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5"
            >
              <h4 className="font-medium text-slate-900 dark:text-white mb-3">
                <span className="text-slate-400 font-mono mr-2">{idx + 1}.</span>
                {item.agendaItemTitle}
              </h4>

              {item.discussionNotes && (
                <div className="mb-3">
                  <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                    Discussion
                  </span>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{item.discussionNotes}</p>
                </div>
              )}

              {item.decision && (
                <div className="mb-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                    Decision
                  </span>
                  <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">{item.decision}</p>
                </div>
              )}

              {item.voteResult && (item.voteResult.for !== undefined || item.voteResult.against !== undefined) && (
                <VoteBar voteResult={item.voteResult} />
              )}

              {item.actionItems.length > 0 && (
                <div className="mt-3">
                  <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                    Action Items
                  </span>
                  <ul className="mt-1 space-y-1">
                    {item.actionItems.map((ai, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <span className={`mt-0.5 w-4 h-4 flex-shrink-0 rounded border flex items-center justify-center ${
                          ai.completed
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}>
                          {ai.completed && (
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </span>
                        <span>
                          {ai.description}
                          {ai.due_date && (
                            <span className="ml-2 text-xs text-slate-400">(due {ai.due_date})</span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Comments Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Comments ({comments.length})
          </h3>

          {comments.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              No comments yet. Add a comment to request changes or provide feedback.
            </p>
          )}

          {comments.map(comment => (
            <CommentThread
              key={comment.id}
              comment={comment}
              onResolve={onResolveComment}
              onReply={(id) => setReplyingTo(id)}
            />
          ))}

          {/* Add Comment Form */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            {replyingToComment && (
              <div className="flex items-center gap-2 mb-2 text-xs text-slate-500 dark:text-slate-400">
                <span>Replying to {replyingToComment.userName}</span>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmitComment()
                }}
                placeholder={replyingTo ? 'Write a reply...' : 'Add a comment...'}
                rows={2}
                className="flex-1 px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600"
              />
              <button
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
                className="self-end px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {minutes.status === 'pending_review' && (
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={onReject}
              className="px-5 py-2.5 text-sm font-medium bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
            >
              Reject
            </button>
            <button
              onClick={() => {
                // Request changes re-uses reject with the expectation that
                // comments have been left explaining what needs changing
                onReject()
              }}
              className="px-5 py-2.5 text-sm font-medium bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors"
            >
              Request Changes
            </button>
            <button
              onClick={onApprove}
              className="px-5 py-2.5 text-sm font-medium bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
            >
              Approve &amp; Publish
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
