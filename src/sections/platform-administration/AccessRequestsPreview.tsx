import { AccessRequests } from './components/AccessRequests'

export default function AccessRequestsPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AccessRequests associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
