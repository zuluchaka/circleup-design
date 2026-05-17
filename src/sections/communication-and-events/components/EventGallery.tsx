import { useState } from 'react'

// ============================================
// Types
// ============================================

interface MediaItem {
  id: string
  eventId: string
  uploaderId: string
  uploaderName: string
  mediaType: 'photo' | 'video' | 'document'
  caption?: string
  fileUrl?: string
  createdAt: string
}

interface EventGalleryProps {
  media: MediaItem[]
  currentUserId: string
  isAdmin: boolean
  onUpload: (file: File, mediaType: string, caption?: string) => void
  onDelete: (id: string) => void
  onUpdateCaption?: (id: string, caption: string) => void
}

// ============================================
// Component
// ============================================

export function EventGallery({
  media,
  currentUserId,
  isAdmin,
  onUpload,
  onDelete,
  onUpdateCaption,
}: EventGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [showUpload, setShowUpload] = useState(false)
  const [uploadCaption, setUploadCaption] = useState('')
  const [editingCaption, setEditingCaption] = useState<string | null>(null)
  const [captionValue, setCaptionValue] = useState('')

  const photos = media.filter((m) => m.mediaType === 'photo')
  const otherMedia = media.filter((m) => m.mediaType !== 'photo')

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const mediaType = file.type.startsWith('video/')
      ? 'video'
      : file.type.startsWith('image/')
        ? 'photo'
        : 'document'

    onUpload(file, mediaType, uploadCaption || undefined)
    setShowUpload(false)
    setUploadCaption('')
  }

  const canDelete = (item: MediaItem) =>
    item.uploaderId === currentUserId || isAdmin

  const startEditCaption = (item: MediaItem) => {
    setEditingCaption(item.id)
    setCaptionValue(item.caption || '')
  }

  const saveCaption = (id: string) => {
    onUpdateCaption?.(id, captionValue)
    setEditingCaption(null)
    setCaptionValue('')
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Event Gallery ({media.length})
        </h2>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
        >
          Upload
        </button>
      </div>

      {/* Upload Area */}
      {showUpload && (
        <div className="mb-6 p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl">
          <input
            type="text"
            value={uploadCaption}
            onChange={(e) => setUploadCaption(e.target.value)}
            placeholder="Caption (optional)"
            className="w-full mb-3 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
          />
          <label className="flex items-center justify-center gap-2 cursor-pointer py-4 text-slate-500 dark:text-slate-400 hover:text-indigo-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Choose file to upload
            <input type="file" className="hidden" onChange={handleFileSelect} accept="image/*,video/*,.pdf,.doc,.docx" />
          </label>
        </div>
      )}

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
          {photos.map((item, index) => (
            <div key={item.id} className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700">
              <img
                src={item.fileUrl || ''}
                alt={item.caption || ''}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setLightboxIndex(index)}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                <div className="w-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.caption && (
                    <p className="text-white text-xs truncate mb-1">{item.caption}</p>
                  )}
                  <div className="flex justify-between">
                    <span className="text-white/70 text-xs">{item.uploaderName}</span>
                    {canDelete(item) && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(item.id) }}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Other Media */}
      {otherMedia.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Other Files
          </h3>
          {otherMedia.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {item.mediaType === 'video' ? 'Video' : 'Document'}
                </span>
                {editingCaption === item.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={captionValue}
                      onChange={(e) => setCaptionValue(e.target.value)}
                      className="px-2 py-1 border border-slate-200 dark:border-slate-600 rounded text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    <button
                      onClick={() => saveCaption(item.id)}
                      className="text-indigo-600 text-sm"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <span
                    className="text-sm text-slate-500 dark:text-slate-400 cursor-pointer"
                    onClick={() => canDelete(item) && onUpdateCaption && startEditCaption(item)}
                  >
                    {item.caption || 'No caption'}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">{item.uploaderName}</span>
                {item.fileUrl && (
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 dark:text-indigo-400"
                  >
                    View
                  </a>
                )}
                {canDelete(item) && (
                  <button
                    onClick={() => onDelete(item.id)}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {media.length === 0 && (
        <p className="text-center text-slate-400 dark:text-slate-500 py-8">
          No media uploaded yet. Be the first to share!
        </p>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && photos[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl"
          >
            x
          </button>
          {lightboxIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex - 1) }}
              className="absolute left-4 text-white/70 hover:text-white text-3xl"
            >
              &lsaquo;
            </button>
          )}
          {lightboxIndex < photos.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex + 1) }}
              className="absolute right-16 text-white/70 hover:text-white text-3xl"
            >
              &rsaquo;
            </button>
          )}
          <div className="max-w-4xl max-h-[90vh] p-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={photos[lightboxIndex].fileUrl || ''}
              alt={photos[lightboxIndex].caption || ''}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            {photos[lightboxIndex].caption && (
              <p className="text-white text-center mt-3">
                {photos[lightboxIndex].caption}
              </p>
            )}
            <p className="text-white/60 text-center text-sm mt-1">
              Uploaded by {photos[lightboxIndex].uploaderName}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
