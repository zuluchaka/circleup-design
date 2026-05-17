import { useState, useRef } from 'react'
import { impact, notify } from '@/platform/haptics'
import type { AgreementSigningProps, DocumentSignature } from '@/../product/sections/documents/types'

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function SignatureItem({ signature }: { signature: DocumentSignature }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
      <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </div>
      <div className="flex-1">
        <p className="font-medium text-slate-900 dark:text-white text-sm">
          {signature.userName}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Signed {formatDateTime(signature.signedAt)}
        </p>
      </div>
      <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
      </svg>
    </div>
  )
}

export function AgreementSigning({
  document,
  currentUser,
  signatures,
  onSign,
  onCancel,
  onDownload,
}: AgreementSigningProps) {
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [signatureMode, setSignatureMode] = useState<'draw' | 'type'>('draw')
  const [typedSignature, setTypedSignature] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lastPosRef = useRef<{ x: number; y: number } | null>(null)

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    lastPosRef.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current || !lastPosRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    const x = clientX - rect.left
    const y = clientY - rect.top

    ctx.beginPath()
    ctx.strokeStyle = '#1e293b'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y)
    ctx.lineTo(x, y)
    ctx.stroke()

    lastPosRef.current = { x, y }
    setHasSignature(true)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    lastPosRef.current = null
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSignature(false)
  }

  const getSignatureDataUrl = (): string => {
    if (signatureMode === 'draw') {
      return canvasRef.current?.toDataURL('image/png') || ''
    } else {
      // Create a canvas with the typed signature
      const canvas = window.document.createElement('canvas')
      canvas.width = 400
      canvas.height = 150
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.font = 'italic 48px "Dancing Script", cursive, Georgia, serif'
        ctx.fillStyle = '#1e293b'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(typedSignature, canvas.width / 2, canvas.height / 2)
      }
      return canvas.toDataURL('image/png')
    }
  }

  const handleSign = () => {
    if ((signatureMode === 'draw' && hasSignature) || (signatureMode === 'type' && typedSignature.trim())) {
      if (agreedToTerms) {
        void impact('medium')
        onSign?.({
          signatureImageDataUrl: getSignatureDataUrl(),
          agreedToTerms: true,
        })
        void notify('success')
      }
    }
  }

  const isValid = agreedToTerms && (
    (signatureMode === 'draw' && hasSignature) ||
    (signatureMode === 'type' && typedSignature.trim())
  )

  const signedPercentage = document.totalMembers
    ? Math.round((signatures.length / document.totalMembers) * 100)
    : 0

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Sign Agreement
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Review and sign the document below
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Document Preview */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-white">
                    {document.title}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Version {document.currentVersion} · {formatDate(document.updatedAt)}
                  </p>
                </div>
                <button
                  onClick={onDownload}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
              </div>
              <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                <div className="text-center p-8">
                  <svg className="w-16 h-16 text-red-400 mx-auto mb-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v5a2 2 0 002 2h5v9H6z" />
                  </svg>
                  <p className="text-slate-600 dark:text-slate-400 mb-2">
                    {document.fileName}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-500">
                    Please review the full document before signing
                  </p>
                </div>
              </div>
            </div>

            {/* Signature Area */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="font-semibold text-slate-900 dark:text-white mb-4">
                Your Signature
              </h2>

              {/* Mode Toggle */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setSignatureMode('draw')}
                  className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                    signatureMode === 'draw'
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Draw Signature
                </button>
                <button
                  onClick={() => setSignatureMode('type')}
                  className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                    signatureMode === 'type'
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Type Signature
                </button>
              </div>

              {signatureMode === 'draw' ? (
                <>
                  {/* Canvas */}
                  <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl overflow-hidden bg-white dark:bg-slate-700/50">
                    <canvas
                      ref={canvasRef}
                      width={600}
                      height={200}
                      className="w-full h-[200px] cursor-crosshair touch-none"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                    />
                    {!hasSignature && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <p className="text-slate-400 dark:text-slate-500 text-sm">
                          Sign here using your mouse or finger
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={clearSignature}
                      className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                    >
                      Clear signature
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Typed Signature */}
                  <input
                    type="text"
                    value={typedSignature}
                    onChange={(e) => setTypedSignature(e.target.value)}
                    placeholder="Type your full name"
                    className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-2xl text-center italic text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:not-italic focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    style={{ fontFamily: '"Dancing Script", cursive, Georgia, serif' }}
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-2">
                    Your typed name will be converted to a signature
                  </p>
                </>
              )}

              {/* Signer Info */}
              <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Signing as:
                </p>
                <div className="flex items-center gap-3 mt-2">
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt=""
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                        {currentUser.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {currentUser.name}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {currentUser.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="mt-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 mt-0.5"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    I have read and agree to the terms outlined in this document. I understand that my electronic signature has the same legal effect as a handwritten signature.
                  </span>
                </label>
              </div>

              {/* Submit */}
              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={onCancel}
                  className="px-6 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSign}
                  disabled={!isValid}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white disabled:text-slate-500 dark:disabled:text-slate-400 text-sm font-medium rounded-xl transition-colors disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Sign Document
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Signature Progress */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
              <h2 className="font-semibold text-slate-900 dark:text-white mb-4">
                Signature Progress
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Signed</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {signatures.length} / {document.totalMembers || 0}
                  </span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all"
                    style={{ width: `${signedPercentage}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {signedPercentage}% of members have signed
                </p>
              </div>
            </div>

            {/* Recent Signatures */}
            {signatures.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                  <h2 className="font-semibold text-slate-900 dark:text-white">
                    Recent Signatures
                  </h2>
                </div>
                <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
                  {signatures.slice(0, 5).map((sig) => (
                    <SignatureItem key={sig.id} signature={sig} />
                  ))}
                  {signatures.length > 5 && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-2">
                      +{signatures.length - 5} more signatures
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Legal Notice */}
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800/30 p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    Legal Notice
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                    Electronic signatures are legally binding under applicable laws. By signing, you acknowledge that you have read and understood the document.
                  </p>
                </div>
              </div>
            </div>

            {/* Document Info */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
              <h2 className="font-semibold text-slate-900 dark:text-white mb-4">
                Document Info
              </h2>
              <dl className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500 dark:text-slate-400">Category</dt>
                  <dd className="text-slate-900 dark:text-white font-medium capitalize">
                    {document.category}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500 dark:text-slate-400">Version</dt>
                  <dd className="text-slate-900 dark:text-white font-medium">
                    {document.currentVersion}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500 dark:text-slate-400">Updated</dt>
                  <dd className="text-slate-900 dark:text-white font-medium">
                    {formatDate(document.updatedAt)}
                  </dd>
                </div>
                {document.uploadedBy && (
                  <div className="flex items-center justify-between">
                    <dt className="text-slate-500 dark:text-slate-400">Uploaded by</dt>
                    <dd className="text-slate-900 dark:text-white font-medium">
                      {document.uploadedBy.name}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
