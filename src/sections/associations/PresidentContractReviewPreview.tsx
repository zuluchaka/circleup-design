import { PresidentContractReview } from './components/PresidentContractReview'

export default function PresidentContractReviewPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <PresidentContractReview
        token="stub-token"
        onAccept={() => console.log('Accept')}
        onRequestModification={(notes: string) => console.log('Modify:', notes)}
      />
    </div>
  )
}
