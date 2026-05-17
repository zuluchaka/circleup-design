import { MemberProfile } from './components/MemberProfile'

export default function MemberProfilePreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <MemberProfile associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
