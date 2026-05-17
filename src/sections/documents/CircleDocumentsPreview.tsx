import { CircleDocuments } from './components'
import data from '@/../product/sections/documents/data.json'

export default function CircleDocumentsPreview() {
  // Use the first circle and its document space
  const circle = data.circles[0]
  const documentSpace = data.circleDocumentSpaces[0]

  // Filter documents and folders for this circle
  const circleDocuments = data.documents.filter((d: any) => d.circleId === circle.id)
  const circleFolders = data.folders.filter((f: any) => f.circleId === circle.id)

  return (
    <CircleDocuments
      documents={circleDocuments as any}
      folders={circleFolders as any}
      documentSpace={documentSpace as any}
      circle={circle as any}
      selectedCategory="all"
      onDocumentClick={() => {}}
      onDownload={() => {}}
      onCategorySelect={() => {}}
      onUpload={() => {}}
      onManageRetention={() => {}}
    />
  )
}
