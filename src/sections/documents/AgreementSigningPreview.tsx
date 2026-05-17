import { AgreementSigning } from './components'
import data from '@/../product/sections/documents/data.json'

export default function AgreementSigningPreview() {
  // Use a document that requires signature
  const document = data.documents.find((d: any) => d.requiresSignature) || data.documents[0]

  // Get signatures for this document
  const signatures = data.documentSignatures.filter((s: any) => s.documentId === document.id)

  // Current user
  const currentUser = data.users[3] // Nia Kamau (member)

  return (
    <AgreementSigning
      document={document as any}
      currentUser={currentUser as any}
      signatures={signatures as any}
      onSign={() => {}}
      onCancel={() => {}}
      onDownload={() => {}}
    />
  )
}
