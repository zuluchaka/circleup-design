import { PermissionMatrix } from './components/PermissionMatrix'

export default function PermissionMatrixPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <PermissionMatrix associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
