import type { EventDetailsProps, Event, EventRegistration, TicketType } from '../types'

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

function getEventTypeColor(type: string) {
  switch (type) {
    case 'meeting':
      return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
    case 'celebration':
      return 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400'
    case 'fundraiser':
      return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
    case 'workshop':
      return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
    case 'social':
      return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
    default:
      return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
  }
}

export function EventDetails({
  event,
  registration,
  attendees,
  currentUserId,
  onRegister,
  onUpdateRSVP,
  onCancelRegistration,
  onShare,
  onAddToCalendar,
}: EventDetailsProps) {
  const isFull = event.capacity && event.registrationCount >= event.capacity
  const isRegistered = !!registration
  const isOrganizer = event.organizer.id === currentUserId
  const spotsLeft = event.capacity ? event.capacity - event.registrationCount : null

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Cover Image */}
      {event.coverImage && (
        <div className="relative h-64 sm:h-80 w-full">
          <img
            src={event.coverImage}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent" />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 mb-6">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Events
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(event.type)}`}>
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </span>
                {event.status === 'cancelled' && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    Cancelled
                  </span>
                )}
                {event.isRecurring && (
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {event.recurringPattern}
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                {event.title}
              </h1>

              {/* Organizer */}
              <div className="flex items-center gap-3">
                <img
                  src={event.organizer.avatar}
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Organized by</p>
                  <p className="font-medium text-slate-900 dark:text-white">{event.organizer.name}</p>
                </div>
              </div>
            </div>

            {/* Date & Location Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Date & Time */}
                <div className="flex gap-4">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {formatDate(event.startDate)}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400">
                      {formatTime(event.startDate)} - {formatTime(event.endDate)}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex gap-4">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                    {event.virtualLink ? (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    {event.virtualLink ? (
                      <>
                        <p className="font-medium text-slate-900 dark:text-white">Virtual Event</p>
                        <a
                          href={event.virtualLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          Join Online
                        </a>
                      </>
                    ) : event.location ? (
                      <>
                        <p className="font-medium text-slate-900 dark:text-white">{event.location.name}</p>
                        <p className="text-slate-500 dark:text-slate-400">
                          {event.location.address}, {event.location.city}
                        </p>
                      </>
                    ) : (
                      <p className="text-slate-500 dark:text-slate-400">Location TBD</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                <button
                  onClick={onAddToCalendar}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add to Calendar
                </button>
                <button
                  onClick={onShare}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                About This Event
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-slate-600 dark:text-slate-300 whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            </div>

            {/* Attendees */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Attendees ({attendees.filter((a) => a.rsvpStatus === 'going').length})
                </h2>
                {isOrganizer && (
                  <button className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                    Manage Attendees
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {attendees.filter((a) => a.rsvpStatus === 'going').slice(0, 10).map((attendee) => (
                  <div key={attendee.id} className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-700 rounded-xl">
                    <img src={attendee.user.avatar} alt="" className="w-6 h-6 rounded-full" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{attendee.user.name}</span>
                  </div>
                ))}
                {attendees.filter((a) => a.rsvpStatus === 'going').length > 10 && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-700 rounded-xl">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      +{attendees.filter((a) => a.rsvpStatus === 'going').length - 10} more
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Registration */}
          <div className="space-y-6">
            {/* Registration Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sticky top-8">
              {isRegistered ? (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                      <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">You're registered!</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {registration.ticketType === 'free' ? 'Free ticket' : `${registration.ticketType} ticket`}
                        {registration.guestCount > 0 && ` + ${registration.guestCount} guest${registration.guestCount > 1 ? 's' : ''}`}
                      </p>
                    </div>
                  </div>

                  {/* RSVP Status */}
                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Your RSVP</p>
                    <div className="flex gap-2">
                      {(['going', 'maybe', 'not_going'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => onUpdateRSVP(status)}
                          className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-colors ${
                            registration.rsvpStatus === status
                              ? status === 'going'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : status === 'maybe'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                          }`}
                        >
                          {status === 'going' ? 'Going' : status === 'maybe' ? 'Maybe' : "Can't Go"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={onCancelRegistration}
                    className="w-full py-2.5 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Cancel Registration
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Register for this event
                  </h3>

                  {/* Capacity Info */}
                  {event.capacity && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-slate-500 dark:text-slate-400">
                          {event.registrationCount} / {event.capacity} spots filled
                        </span>
                        {spotsLeft !== null && spotsLeft > 0 && (
                          <span className={`font-medium ${spotsLeft <= 10 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-600 dark:text-slate-400'}`}>
                            {spotsLeft} left
                          </span>
                        )}
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isFull ? 'bg-red-500' : spotsLeft !== null && spotsLeft <= 10 ? 'bg-amber-500' : 'bg-indigo-500'
                          }`}
                          style={{ width: `${Math.min((event.registrationCount / event.capacity) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Ticket Options */}
                  <div className="space-y-3 mb-4">
                    {event.ticketOptions.map((ticket) => {
                      const isSoldOut = ticket.quantity !== undefined && ticket.soldCount >= ticket.quantity

                      return (
                        <div
                          key={ticket.id}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                            isSoldOut
                              ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 opacity-60'
                              : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">{ticket.name}</p>
                              {ticket.description && (
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                  {ticket.description}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-slate-900 dark:text-white">
                                {ticket.price === 0 ? 'Free' : formatCurrency(ticket.price, ticket.currency)}
                              </p>
                              {isSoldOut && (
                                <p className="text-xs text-red-600 dark:text-red-400">Sold out</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => onRegister('member', 0)}
                    disabled={isFull}
                    className={`w-full py-3 text-white font-medium rounded-xl transition-colors ${
                      isFull
                        ? 'bg-slate-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    {isFull ? 'Event Full - Join Waitlist' : 'Register Now'}
                  </button>

                  {event.registrationDeadline && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-3">
                      Registration closes {formatDate(event.registrationDeadline)}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
