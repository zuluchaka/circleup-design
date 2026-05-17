import data from '@/../product/sections/platform-administration/data.json'
import type {
  AccessRole,
  ContextualRole,
  SoDRule,
} from '@/../product/sections/platform-administration/types'
import { RoleManager } from './components/RoleManager'

export default function RoleManagerPreview() {
  return (
    <RoleManager
      accessRoles={data.accessRoles as unknown as AccessRole[]}
      contextualRoles={data.contextualRoles as unknown as ContextualRole[]}
      sodRules={data.sodRules as unknown as SoDRule[]}
      onEditAccessRole={(id) => console.log('Edit access role:', id)}
      onCreateContextualRole={() => console.log('Create contextual role')}
      onEditContextualRole={(id) => console.log('Edit contextual role:', id)}
      onDeleteContextualRole={(id) => console.log('Delete contextual role:', id)}
      onBulkAssign={() => console.log('Bulk assign')}
      onCompareRoles={(ids) => console.log('Compare roles:', ids)}
    />
  )
}
