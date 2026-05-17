import { EventNotificationConfig } from './components/EventNotificationConfig'

export default function EventNotificationConfigPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <EventNotificationConfig associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
