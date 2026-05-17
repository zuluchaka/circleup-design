import { MemberDirectory } from './components/MemberDirectory'

export default function MemberDirectoryPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <MemberDirectory associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
