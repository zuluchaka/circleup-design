import { RBACAuditTrail } from './components/RBACAuditTrail'

export default function RBACAuditTrailPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <RBACAuditTrail associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
