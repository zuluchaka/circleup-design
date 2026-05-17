import AssociationDocumentsView from './components/AssociationDocumentsView'

export default function AssociationDocumentsViewPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AssociationDocumentsView associationId="assoc-001" />
    </div>
  )
}
