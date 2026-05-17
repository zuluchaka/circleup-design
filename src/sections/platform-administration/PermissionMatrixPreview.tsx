import data from '@/../product/sections/platform-administration/data.json'
import type {
  PermissionMatrix as PermissionMatrixType,
  AccessRole,
  PermissionTemplate,
  PermissionMatrixRow,
  FeatureDefinition,
} from '@/../product/sections/platform-administration/types'
import { PermissionMatrix } from './components/PermissionMatrix'

// Build matrix from contextual roles and features for association scope
function buildMatrix(): PermissionMatrixType {
  const scope = 'association'
  const features = (data.featureRegistry as unknown as FeatureDefinition[]).filter(
    (f) => f.scope === scope && !f.parentId
  )
  const contextualRoles = data.contextualRoles.filter((r) => r.scope === scope)

  const rows: PermissionMatrixRow[] = contextualRoles.map((role) => ({
    roleId: role.id,
    roleName: role.name,
    roleLabel: role.label,
    cells: Object.fromEntries(
      features.map((f) => [
        f.id,
        {
          featureId: f.id,
          accessMode: (role.permissions as Record<string, string>)[f.slug] ?? 'none',
          isInherited: false,
        },
      ])
    ),
  }))

  return {
    scope,
    features: features as FeatureDefinition[],
    rows,
  }
}

export default function PermissionMatrixPreview() {
  const matrix = buildMatrix()

  return (
    <PermissionMatrix
      matrix={matrix}
      accessRoles={data.accessRoles as unknown as AccessRole[]}
      templates={data.permissionTemplates as unknown as PermissionTemplate[]}
      onCellChange={(roleId, featureId, mode) =>
        console.log('Cell change:', roleId, featureId, mode)
      }
      onSave={() => console.log('Save matrix')}
      onDiscard={() => console.log('Discard changes')}
      onApplyTemplate={(templateId, roleId) =>
        console.log('Apply template:', templateId, 'to role:', roleId)
      }
      onExport={() => console.log('Export matrix')}
    />
  )
}
