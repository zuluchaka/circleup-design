import { RecurringEventSetup } from './components/RecurringEventSetup'

export default function RecurringEventSetupPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <RecurringEventSetup associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
