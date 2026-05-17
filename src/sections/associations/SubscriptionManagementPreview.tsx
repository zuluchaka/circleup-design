import { SubscriptionManagement } from './components/SubscriptionManagement'

export default function SubscriptionManagementPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SubscriptionManagement associationId="assoc-001" />
    </div>
  )
}
