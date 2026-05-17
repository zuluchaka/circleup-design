import MinutesReview from './components/MinutesReview'

export default function MinutesReviewPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <MinutesReview associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
