import { DocumentLibrary } from './components'
import data from '@/../product/sections/documents/data.json'

export default function DocumentLibraryPreview() {
  return (
    <DocumentLibrary
      documents={data.documents as any}
      folders={data.folders as any}
      circleDocumentSpaces={data.circleDocumentSpaces as any}
      recentActivity={data.recentActivity as any}
      storageStats={data.storageStats as any}
      viewMode="grid"
      onDocumentClick={() => {}}
      onDownload={() => {}}
      onDelete={() => {}}
      onToggleStar={() => {}}
      onFolderSelect={() => {}}
      onCircleSelect={() => {}}
      onViewModeChange={() => {}}
      onSearch={() => {}}
      onUpload={() => {}}
      onCreateFolder={() => {}}
    />
  )
}
