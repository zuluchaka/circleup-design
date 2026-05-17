import data from '@/../product/sections/associations/data.json'
import { ChapterDirectory } from './components/ChapterDirectory'
import type { FederationMembership } from '@/../product/sections/associations/types'

export default function ChapterDirectoryPreview() {
  const chapters = data.federationMemberships as FederationMembership[]

  return (
    <ChapterDirectory
      chapters={chapters}
      onChapterClick={(id) => console.log('View chapter:', id)}
      onApprove={(id) => console.log('Approve membership:', id)}
      onSuspend={(id) => console.log('Suspend membership:', id)}
      onRemove={(id) => console.log('Remove membership:', id)}
      onContactAdmin={(id) => console.log('Contact admin for association:', id)}
      onExport={() => console.log('Export chapter directory')}
      onBack={() => console.log('Go back')}
    />
  )
}
