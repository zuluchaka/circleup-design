import { MemberDuesHistory } from './components/MemberDuesHistory'

export default function MemberDuesHistoryPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <MemberDuesHistory associationId="assoc-001" isTreasurer={true} />
    </div>
  )
}
