import MemberImportWizard from './components/MemberImportWizard'

export default function MemberImportWizardPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <MemberImportWizard
        associationId="assoc-001"
        onComplete={() => console.log('Import complete')}
      />
    </div>
  )
}
