import { DocumentTemplates } from './components'
import data from '@/../product/sections/documents/data.json'

export default function DocumentTemplatesPreview() {
  return (
    <DocumentTemplates
      templates={data.documentTemplates as any}
      selectedCategory="all"
      onUseTemplate={() => {}}
      onEditTemplate={() => {}}
      onDeleteTemplate={() => {}}
      onCreateTemplate={() => {}}
      onCategorySelect={() => {}}
    />
  )
}
