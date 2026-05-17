import { useState } from 'react'
import type { MinutesEditorProps, MinuteItemData } from '@/../product/sections/communication-and-events/types'

export default function MinutesEditor({
  minutes,
  items,
  agendaItems,
  onUpdateMinutes,
  onUpdateItem,
  onSubmitForReview,
}: MinutesEditorProps) {
  const [summary, setSummary] = useState(minutes.summary || '')
  const [editingItemId, setEditingItemId] = useState<string | null>(null)

  const handleSummaryBlur = () => {
    if (summary !== minutes.summary) {
      onUpdateMinutes({ summary })
    }
  }

  const getMinuteItem = (agendaItemId: string): MinuteItemData | undefined =>
    items.find(i => i.agendaItemId === agendaItemId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Meeting Minutes
        </h3>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded-full ${
            minutes.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
            minutes.status === 'pending_review' ? 'bg-blue-100 text-blue-700' :
            minutes.status === 'approved' ? 'bg-green-100 text-green-700' :
            'bg-gray-100 text-gray-600'
          }`}>
            {minutes.status.replace('_', ' ')}
          </span>
          {minutes.status === 'draft' && (
            <button
              onClick={onSubmitForReview}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Submit for Review
            </button>
          )}
        </div>
      </div>

      {/* Summary */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Meeting Summary
        </label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          onBlur={handleSummaryBlur}
          rows={3}
          className="w-full px-3 py-2 text-sm border rounded-md dark:bg-gray-800 dark:border-gray-600"
          placeholder="Brief summary of the meeting..."
        />
      </div>

      {/* Per-agenda-item minutes */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Agenda Item Records</h4>
        {agendaItems.map((agendaItem) => {
          const minuteItem = getMinuteItem(agendaItem.id)
          const isEditing = editingItemId === agendaItem.id

          return (
            <div
              key={agendaItem.id}
              className="p-4 border rounded-lg dark:border-gray-700 cursor-pointer"
              onClick={() => setEditingItemId(isEditing ? null : agendaItem.id)}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono text-gray-400">{agendaItem.position + 1}.</span>
                <h5 className="font-medium text-sm text-gray-900 dark:text-white">{agendaItem.title}</h5>
                <span className={`px-1.5 py-0.5 text-xs rounded ${
                  agendaItem.itemType === 'vote' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {agendaItem.itemType}
                </span>
                {minuteItem && (
                  <span className="text-xs text-green-500">recorded</span>
                )}
              </div>

              {isEditing && (
                <div className="space-y-3 mt-3" onClick={(e) => e.stopPropagation()}>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Discussion Notes</label>
                    <textarea
                      defaultValue={minuteItem?.discussionNotes || ''}
                      onBlur={(e) => onUpdateItem(agendaItem.id, { discussionNotes: e.target.value } as Partial<MinuteItemData>)}
                      rows={3}
                      className="w-full px-2 py-1.5 text-sm border rounded dark:bg-gray-800 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Decision</label>
                    <input
                      type="text"
                      defaultValue={minuteItem?.decision || ''}
                      onBlur={(e) => onUpdateItem(agendaItem.id, { decision: e.target.value } as Partial<MinuteItemData>)}
                      className="w-full px-2 py-1.5 text-sm border rounded dark:bg-gray-800 dark:border-gray-600"
                      placeholder="Decision taken..."
                    />
                  </div>

                  {agendaItem.itemType === 'vote' && (
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Vote Result</label>
                      <div className="flex gap-3">
                        {['for', 'against', 'abstain'].map(field => (
                          <div key={field} className="flex items-center gap-1">
                            <label className="text-xs text-gray-400 capitalize">{field}:</label>
                            <input
                              type="number"
                              min={0}
                              defaultValue={minuteItem?.voteResult?.[field as keyof typeof minuteItem.voteResult] || 0}
                              onBlur={(e) => {
                                const voteResult = {
                                  ...minuteItem?.voteResult,
                                  [field]: parseInt(e.target.value) || 0,
                                }
                                onUpdateItem(agendaItem.id, { voteResult } as Partial<MinuteItemData>)
                              }}
                              className="w-14 px-1 py-0.5 text-sm border rounded text-center dark:bg-gray-800 dark:border-gray-600"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
