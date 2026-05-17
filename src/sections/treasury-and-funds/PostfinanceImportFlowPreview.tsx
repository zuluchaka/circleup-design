import PostfinanceImportFlow from './components/PostfinanceImportFlow'

export default function PostfinanceImportFlowPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <PostfinanceImportFlow associationId="assoc-001" circleId="circle-001" />
    </div>
  )
}
