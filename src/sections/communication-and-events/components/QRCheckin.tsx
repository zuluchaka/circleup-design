import { useState } from 'react'

export interface QRCheckinEvent {
  id: string
  title: string
  qr_checkin_token: string
  associationId: string
}

export interface QRCheckinProps {
  event: QRCheckinEvent
  mode: 'generate' | 'scan'
  onCheckin: (eventId: string, qrToken: string) => Promise<{ checkedInAt?: string; error?: string }>
  alreadyCheckedInAt?: string
}

/**
 * Generates a simple SVG-based QR code placeholder.
 * In production this would use a real QR encoding library,
 * but we avoid adding external dependencies here.
 */
function QRCodePlaceholder({ value, size = 200 }: { value: string; size?: number }) {
  // Deterministic pattern derived from the token string
  const cells = 21
  const cellSize = size / cells
  const filled: boolean[][] = []

  for (let row = 0; row < cells; row++) {
    filled[row] = []
    for (let col = 0; col < cells; col++) {
      // Finder patterns (top-left, top-right, bottom-left)
      const inTopLeft = row < 7 && col < 7
      const inTopRight = row < 7 && col >= cells - 7
      const inBottomLeft = row >= cells - 7 && col < 7

      if (inTopLeft || inTopRight || inBottomLeft) {
        const localR = inTopLeft ? row : inBottomLeft ? row - (cells - 7) : row
        const localC = inTopLeft ? col : inTopRight ? col - (cells - 7) : col
        const border = localR === 0 || localR === 6 || localC === 0 || localC === 6
        const inner = localR >= 2 && localR <= 4 && localC >= 2 && localC <= 4
        filled[row][col] = border || inner
      } else {
        // Pseudo-random data cells from token hash
        const charCode = value.charCodeAt((row * cells + col) % value.length) || 0
        filled[row][col] = (charCode + row + col) % 3 === 0
      }
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      <rect width={size} height={size} fill="white" />
      {filled.map((rowData, row) =>
        rowData.map((on, col) =>
          on ? (
            <rect
              key={`${row}-${col}`}
              x={col * cellSize}
              y={row * cellSize}
              width={cellSize}
              height={cellSize}
              fill="black"
            />
          ) : null
        )
      )}
    </svg>
  )
}

export default function QRCheckin({
  event,
  mode,
  onCheckin,
  alreadyCheckedInAt,
}: QRCheckinProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [checkedInTime, setCheckedInTime] = useState<string | undefined>(alreadyCheckedInAt)
  const [errorMessage, setErrorMessage] = useState('')

  const checkinUrl = `${window.location.origin}/events/${event.id}/checkin?token=${event.qr_checkin_token}`

  const handleCheckin = async () => {
    setStatus('loading')
    setErrorMessage('')
    try {
      const result = await onCheckin(event.id, event.qr_checkin_token)
      if (result.error) {
        setStatus('error')
        setErrorMessage(result.error)
      } else {
        setStatus('success')
        setCheckedInTime(result.checkedInAt || new Date().toISOString())
      }
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Check-in failed')
    }
  }

  // Already checked in state
  if (checkedInTime && status !== 'error') {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Check-In</h3>
        <div className="p-4 rounded-lg border-2 border-green-300 bg-green-50 dark:bg-green-900/20">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">Checked In</p>
              <p className="text-xs text-green-600 dark:text-green-400">
                {new Date(checkedInTime).toLocaleString('de-CH', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (mode === 'generate') {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">QR Check-In Code</h3>
        <p className="text-sm text-gray-500">
          Display this QR code for members to scan and check in to the event.
        </p>
        <div className="p-6 bg-white rounded-lg border border-gray-200 dark:border-gray-700">
          <QRCodePlaceholder value={event.qr_checkin_token} size={200} />
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Check-in URL</p>
          <p className="text-sm font-mono text-gray-700 dark:text-gray-300 break-all">
            {checkinUrl}
          </p>
        </div>
        <p className="text-xs text-gray-400 text-center">
          Event: {event.title}
        </p>
      </div>
    )
  }

  // Scan / self-checkin mode
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Event Check-In</h3>
      <p className="text-sm text-gray-500">
        Check in to <span className="font-medium text-gray-700 dark:text-gray-300">{event.title}</span>
      </p>

      {status === 'error' && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-300">{errorMessage}</p>
        </div>
      )}

      {status === 'success' ? (
        <div className="p-4 rounded-lg border-2 border-green-300 bg-green-50 dark:bg-green-900/20">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">Successfully Checked In</p>
              {checkedInTime && (
                <p className="text-xs text-green-600 dark:text-green-400">
                  {new Date(checkedInTime).toLocaleString('de-CH', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={handleCheckin}
          disabled={status === 'loading'}
          className="w-full px-4 py-3 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {status === 'loading' ? 'Checking in...' : 'Check In Now'}
        </button>
      )}
    </div>
  )
}
