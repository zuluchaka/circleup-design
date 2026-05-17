import { PresidentDashboardWidgets } from './components/PresidentDashboardWidgets'

export default function PresidentDashboardWidgetsPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <PresidentDashboardWidgets
        associationId="assoc-001"
        onNavigate={(view: string) => console.log('Navigate:', view)}
        onSendMessage={(memberId: string) => console.log('Send message:', memberId)}
      />
    </div>
  )
}
