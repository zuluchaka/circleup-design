import { DocumentViewer } from './components'
import data from '@/../product/sections/documents/data.json'

export default function DocumentViewerPreview() {
  // Use the first document that requires acknowledgment or signature
  const document = data.documents.find((d: any) => d.requiresAcknowledgment || d.requiresSignature) || data.documents[0]

  // Get versions, acknowledgments, and signatures for this document
  const versions = data.documentVersions.filter((v: any) => v.documentId === document.id)
  const acknowledgments = data.documentAcknowledgments.filter((a: any) => a.documentId === document.id)
  const signatures = data.documentSignatures.filter((s: any) => s.documentId === document.id)

  return (
    <DocumentViewer
      document={document as any}
      versions={versions as any}
      acknowledgments={acknowledgments as any}
      signatures={signatures as any}
      currentUserId="user-004"
      hasAcknowledged={false}
      hasSigned={false}
      onDownload={() => {}}
      onShare={() => {}}
      onAcknowledge={() => {}}
      onSign={() => {}}
      onViewVersion={() => {}}
      onRestoreVersion={() => {}}
      onEdit={() => {}}
      onDelete={() => {}}
      onBack={() => {}}
    />
  )
}
