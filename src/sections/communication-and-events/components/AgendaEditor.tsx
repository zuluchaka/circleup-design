import React, { useState } from 'react'
import type { AgendaItemType, AgendaEditorProps } from '@/../product/sections/communication-and-events/types'

export default function AgendaEditor({
  agenda,
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onReorder,
  onPublish,
}: AgendaEditorProps) {
  const [newTitle, setNewTitle] = useState('')
  const [newType, setNewType] = useState<AgendaItemType>('discussion')
  const [newDuration, setNewDuration] = useState(10)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  const handleAdd = () => {
    if (!newTitle.trim()) return
    onAddItem({
      title: newTitle,
      itemType: newType,
      estimatedDurationMinutes: newDuration,
    })
    setNewTitle('')
    setNewType('discussion')
    setNewDuration(10)
  }

  const handleDragStart = (index: number) => setDragIndex(index)
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (dragIndex === null || dragIndex === index) return
    const reordered = [...items]
    const [moved] = reordered.splice(dragIndex, 1)
    reordered.splice(index, 0, moved)
    onReorder(reordered.map(i => i.id))
    setDragIndex(index)
  }
  const handleDragEnd = () => setDragIndex(null)

  const totalDuration = items.reduce((sum, i) => sum + (i.estimatedDurationMinutes || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Agenda — {agenda.meetingType.toUpperCase()} Meeting
          </h3>
          <p className="text-sm text-gray-500">
            {items.length} items | ~{totalDuration} min total
          </p>
        </div>
        <div className="flex gap-2">
          <span className={`px-2 py-1 text-xs rounded-full ${
            agenda.status === 'published' ? 'bg-green-100 text-green-700' :
            agenda.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            {agenda.status}
          </span>
          {agenda.status === 'draft' && (
            <button
              onClick={onPublish}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Publish
            </button>
          )}
        </div>
      </div>

      {/* Quorum & Voting */}
      <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
        <div>
          <span className="text-gray-500">Quorum</span>
          <p className="font-medium">{agenda.quorumRequirement || 'Not set'}
            {agenda.quorumType === 'percentage' ? '%' : ' members'}
          </p>
        </div>
        <div>
          <span className="text-gray-500">Voting</span>
          <p className="font-medium">{agenda.votingProcedure.replace('_', ' ')}</p>
        </div>
        {agenda.templateApplied && (
          <div>
            <span className="text-gray-500">Template</span>
            <p className="font-medium">{agenda.templateApplied}</p>
          </div>
        )}
      </div>

      {/* Items list */}
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={item.id}
            draggable={!item.isMandatory}
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`p-3 border rounded-lg transition-colors ${
              item.isMandatory
                ? 'border-amber-300 bg-amber-50 dark:bg-amber-900/20'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-grab'
            } ${dragIndex === index ? 'opacity-50' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-gray-400">{index + 1}.</span>
                  {editingId === item.id ? (
                    <input
                      type="text"
                      defaultValue={item.title}
                      onBlur={(e) => {
                        onUpdateItem(item.id, { title: e.target.value })
                        setEditingId(null)
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
                      className="flex-1 px-2 py-0.5 border rounded text-sm"
                      autoFocus
                    />
                  ) : (
                    <span
                      className="font-medium text-sm cursor-pointer"
                      onClick={() => !item.isMandatory && setEditingId(item.id)}
                    >
                      {item.title}
                    </span>
                  )}
                  <span className={`px-1.5 py-0.5 text-xs rounded ${
                    item.itemType === 'vote' ? 'bg-purple-100 text-purple-700' :
                    item.itemType === 'election' ? 'bg-indigo-100 text-indigo-700' :
                    item.itemType === 'report' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {item.itemType}
                  </span>
                  {item.isMandatory && (
                    <span className="px-1.5 py-0.5 text-xs bg-amber-100 text-amber-700 rounded">
                      mandatory
                    </span>
                  )}
                </div>
                {item.legalReference && (
                  <p className="text-xs text-gray-400 mt-1 ml-5">{item.legalReference}</p>
                )}
                {item.presenterName && (
                  <p className="text-xs text-gray-500 mt-1 ml-5">Presenter: {item.presenterName}</p>
                )}
              </div>
              <div className="flex items-center gap-2 ml-2">
                {item.estimatedDurationMinutes && (
                  <span className="text-xs text-gray-400">{item.estimatedDurationMinutes} min</span>
                )}
                {item.documents.length > 0 && (
                  <span className="text-xs text-blue-500">{item.documents.length} doc(s)</span>
                )}
                {!item.isMandatory && (
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="text-gray-400 hover:text-red-500 text-sm"
                  >
                    x
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add new item */}
      {agenda.status === 'draft' && (
        <div className="p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="New agenda item title..."
              className="flex-1 px-3 py-1.5 text-sm border rounded-md dark:bg-gray-800 dark:border-gray-600"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as AgendaItemType)}
              className="px-2 py-1.5 text-sm border rounded-md dark:bg-gray-800 dark:border-gray-600"
            >
              <option value="discussion">Discussion</option>
              <option value="vote">Vote</option>
              <option value="election">Election</option>
              <option value="report">Report</option>
              <option value="info">Info</option>
            </select>
            <input
              type="number"
              value={newDuration}
              onChange={(e) => setNewDuration(parseInt(e.target.value) || 0)}
              className="w-16 px-2 py-1.5 text-sm border rounded-md dark:bg-gray-800 dark:border-gray-600"
              min={1}
            />
            <span className="self-center text-xs text-gray-400">min</span>
            <button
              onClick={handleAdd}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
