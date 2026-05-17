import { EventGallery } from './components/EventGallery'

export default function EventGalleryPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <EventGallery associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
