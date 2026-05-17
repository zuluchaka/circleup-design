import { UserManagement } from './components/UserManagement'

export default function UserManagementPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <UserManagement associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
