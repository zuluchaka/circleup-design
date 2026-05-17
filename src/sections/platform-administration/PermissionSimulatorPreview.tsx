import { PermissionSimulator } from './components/PermissionSimulator'

export default function PermissionSimulatorPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <PermissionSimulator associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
