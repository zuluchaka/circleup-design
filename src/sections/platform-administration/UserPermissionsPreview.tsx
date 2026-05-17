import { UserPermissions } from './components/UserPermissions'

export default function UserPermissionsPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <UserPermissions associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
