import { DocumentUpload } from './components'
import data from '@/../product/sections/documents/data.json'

export default function DocumentUploadPreview() {
  return (
    <DocumentUpload
      circles={data.circles as any}
      folders={data.folders as any}
      templates={data.documentTemplates as any}
      selectedCircleId="circle-001"
      onUpload={() => {}}
      onCancel={() => {}}
      onUseTemplate={() => {}}
    />
  )
}
