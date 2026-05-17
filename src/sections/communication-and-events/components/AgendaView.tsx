import type { AgendaViewProps } from '@/../product/sections/communication-and-events/types'

export default function AgendaView({ agenda, items }: AgendaViewProps) {
  const totalDuration = items.reduce((sum, i) => sum + (i.estimatedDurationMinutes || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {agenda.meetingType === 'ga' ? 'General Assembly' : agenda.meetingType.charAt(0).toUpperCase() + agenda.meetingType.slice(1)} Meeting Agenda
          </h3>
          <p className="text-sm text-gray-500">
            {items.length} items | ~{totalDuration} minutes estimated
          </p>
        </div>
        {agenda.publishedAt && (
          <span className="text-xs text-gray-400">
            Published {new Date(agenda.publishedAt).toLocaleDateString('de-CH')}
          </span>
        )}
      </div>

      {/* Quorum info */}
      {agenda.quorumRequirement && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm">
          <span className="font-medium">Quorum Required: </span>
          {agenda.quorumRequirement}{agenda.quorumType === 'percentage' ? '%' : ' members'}
          <span className="mx-2">|</span>
          <span className="font-medium">Voting: </span>
          {agenda.votingProcedure.replace(/_/g, ' ')}
        </div>
      )}

      {/* Agenda items */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {items.map((item, index) => (
          <div key={item.id} className="py-4">
            <div className="flex items-start gap-3">
              <span className="font-mono text-lg font-bold text-gray-300 dark:text-gray-600 w-8 text-right">
                {index + 1}.
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{item.title}</h4>
                  <span className={`px-1.5 py-0.5 text-xs rounded ${
                    item.itemType === 'vote' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                    item.itemType === 'election' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' :
                    item.itemType === 'report' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                    'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {item.itemType}
                  </span>
                  {item.isMandatory && (
                    <span className="px-1.5 py-0.5 text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 rounded">
                      OR Art. 64
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.description}</p>
                )}
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                  {item.estimatedDurationMinutes && (
                    <span>~{item.estimatedDurationMinutes} min</span>
                  )}
                  {item.presenterName && (
                    <span>Presenter: {item.presenterName}</span>
                  )}
                  {item.legalReference && (
                    <span>{item.legalReference}</span>
                  )}
                  {item.documents.length > 0 && (
                    <span className="text-blue-500">{item.documents.length} document(s) attached</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
