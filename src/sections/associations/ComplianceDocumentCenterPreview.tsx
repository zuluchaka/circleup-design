import { ComplianceDocumentCenter } from './components/ComplianceDocumentCenter'

export default function ComplianceDocumentCenterPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <ComplianceDocumentCenter
        documents={[]}
        onUpload={() => console.log('Upload')}
        onDownload={(id: string) => console.log('Download:', id)}
        onArchive={(id: string) => console.log('Archive:', id)}
      />
    </div>
  )
}
