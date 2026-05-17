import { PresidentNotificationCenter } from './components/PresidentNotificationCenter'

export default function PresidentNotificationCenterPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <PresidentNotificationCenter
        associationId="assoc-001"
        onNavigate={(view: string) => console.log('Navigate:', view)}
      />
    </div>
  )
}
