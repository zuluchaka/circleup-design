import { MyTrustScore } from './components/MyTrustScore'

export default function MyTrustScorePreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <MyTrustScore associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
