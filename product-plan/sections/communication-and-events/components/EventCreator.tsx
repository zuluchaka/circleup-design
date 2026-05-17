import type { EventCreatorProps, Event, EventType, TicketType } from '../types'

const eventTypes: { value: EventType; label: string; description: string }[] = [
  { value: 'meeting', label: 'Meeting', description: 'Community or committee meetings' },
  { value: 'celebration', label: 'Celebration', description: 'Cultural events and parties' },
  { value: 'fundraiser', label: 'Fundraiser', description: 'Fundraising events and galas' },
  { value: 'workshop', label: 'Workshop', description: 'Educational sessions and training' },
  { value: 'social', label: 'Social', description: 'Casual gatherings and networking' },
  { value: 'other', label: 'Other', description: 'Other types of events' },
]

export function EventCreator({
  event,
  onSave,
  onPublish,
  onCancel,
}: EventCreatorProps) {
  const isEditing = !!event

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onCancel}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {isEditing ? 'Edit Event' : 'Create Event'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSave({})}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              Save Draft
            </button>
            <button
              onClick={() => onPublish({})}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
            >
              Publish Event
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Cover Image */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="relative h-48 bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              {event?.coverImage ? (
                <img src={event.coverImage} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <svg className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Add a cover image</p>
                </div>
              )}
              <button className="absolute bottom-4 right-4 px-4 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-700 dark:text-slate-300 text-sm font-medium rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors">
                {event?.coverImage ? 'Change Image' : 'Upload Image'}
              </button>
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Basic Information
            </h2>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Event Title
                </label>
                <input
                  type="text"
                  placeholder="Give your event a clear, descriptive title"
                  defaultValue={event?.title}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 text-lg"
                />
              </div>

              {/* Event Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Event Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {eventTypes.map((type) => (
                    <label
                      key={type.value}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                        (event?.type || 'meeting') === type.value
                          ? 'bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-800'
                          : 'bg-slate-50 dark:bg-slate-700 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="eventType"
                        value={type.value}
                        defaultChecked={(event?.type || 'meeting') === type.value}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 dark:text-white text-sm">
                          {type.label}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {type.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Describe what attendees can expect..."
                  defaultValue={event?.description}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Date & Time
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  defaultValue={event?.startDate?.slice(0, 16)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  defaultValue={event?.endDate?.slice(0, 16)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Recurring */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={event?.isRecurring}
                  className="w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="font-medium text-slate-900 dark:text-white">Recurring Event</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    This event repeats on a schedule
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Location
            </h2>

            {/* Location Type Toggle */}
            <div className="flex gap-3 mb-4">
              <button className="flex-1 py-2.5 px-4 bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 text-sm font-medium rounded-xl">
                In Person
              </button>
              <button className="flex-1 py-2.5 px-4 bg-slate-50 dark:bg-slate-700 border-2 border-transparent text-slate-600 dark:text-slate-400 text-sm font-medium rounded-xl hover:border-slate-200 dark:hover:border-slate-600 transition-colors">
                Virtual
              </button>
              <button className="flex-1 py-2.5 px-4 bg-slate-50 dark:bg-slate-700 border-2 border-transparent text-slate-600 dark:text-slate-400 text-sm font-medium rounded-xl hover:border-slate-200 dark:hover:border-slate-600 transition-colors">
                Hybrid
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Venue Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Community Center"
                  defaultValue={event?.location?.name}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="Street address"
                  defaultValue={event?.location?.address}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="City"
                    defaultValue={event?.location?.city}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    placeholder="Country"
                    defaultValue={event?.location?.country}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tickets & Registration */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Tickets & Registration
            </h2>

            <div className="space-y-4">
              {/* Capacity */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Capacity (optional)
                </label>
                <input
                  type="number"
                  placeholder="Leave blank for unlimited"
                  defaultValue={event?.capacity || ''}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Registration Deadline */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Registration Deadline (optional)
                </label>
                <input
                  type="datetime-local"
                  defaultValue={event?.registrationDeadline?.slice(0, 16)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Ticket Types */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Ticket Types
                  </label>
                  <button className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                    + Add Ticket Type
                  </button>
                </div>

                <div className="space-y-3">
                  {(event?.ticketOptions || [{ id: '1', name: 'General Admission', type: 'free' as TicketType, price: 0, currency: 'USD', soldCount: 0 }]).map((ticket, idx) => (
                    <div
                      key={ticket.id || idx}
                      className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                            Ticket Name
                          </label>
                          <input
                            type="text"
                            defaultValue={ticket.name}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-600 border-0 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                            Price
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                            <input
                              type="number"
                              defaultValue={ticket.price}
                              min="0"
                              step="0.01"
                              className="w-full pl-7 pr-3 py-2 bg-white dark:bg-slate-600 border-0 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                            Quantity (optional)
                          </label>
                          <input
                            type="number"
                            defaultValue={ticket.quantity || ''}
                            placeholder="Unlimited"
                            className="w-full px-3 py-2 bg-white dark:bg-slate-600 border-0 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              onClick={onCancel}
              className="px-6 py-2.5 text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave({})}
              className="px-6 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Save as Draft
            </button>
            <button
              onClick={() => onPublish({})}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
            >
              Publish Event
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
