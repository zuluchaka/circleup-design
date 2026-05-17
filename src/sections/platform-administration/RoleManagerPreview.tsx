import { RoleManager } from './components/RoleManager'

export default function RoleManagerPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <RoleManager associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
