import data from '@/../product/sections/platform-administration/data.json'
import type {
  UserPermissionSummary,
  PermissionOverride,
  RBACauditEntry,
  AccessMode,
} from '@/../product/sections/platform-administration/types'
import { UserPermissions } from './components/UserPermissions'

export default function UserPermissionsPreview() {
  const user = data.userPermissionSummaries[0] as unknown as UserPermissionSummary
  const overrides = data.permissionOverrides.filter(
    (o) => o.userId === user.userId
  ) as unknown as PermissionOverride[]
  const auditEntries = data.rbacAuditEntries.filter(
    (e) => e.targetId === user.userId || e.actorId === user.userId
  ) as unknown as RBACauditEntry[]

  // Build effective permissions from contextual roles
  const effectivePermissions: Record<string, AccessMode> = {}
  for (const cr of user.contextualRoles) {
    const role = data.contextualRoles.find((r) => r.id === cr.roleId)
    if (role) {
      for (const [feature, mode] of Object.entries(role.permissions)) {
        const current = effectivePermissions[feature]
        if (!current || modeRank(mode as AccessMode) > modeRank(current)) {
          effectivePermissions[feature] = mode as AccessMode
        }
      }
    }
  }

  // Build permission sources
  const permissionSources: Record<string, { source: string; mode: AccessMode }[]> = {}
  for (const cr of user.contextualRoles) {
    const role = data.contextualRoles.find((r) => r.id === cr.roleId)
    if (role) {
      for (const [feature, mode] of Object.entries(role.permissions)) {
        if (!permissionSources[feature]) permissionSources[feature] = []
        permissionSources[feature].push({
          source: `${role.label} @ ${cr.scopeName}`,
          mode: mode as AccessMode,
        })
      }
    }
  }

  // Add access role ceiling as source
  const accessRole = data.accessRoles.find((ar) => ar.name === user.accessRole)
  if (accessRole) {
    for (const [feature, mode] of Object.entries(accessRole.ceilingPermissions)) {
      if (!permissionSources[feature]) permissionSources[feature] = []
      permissionSources[feature].unshift({
        source: `${accessRole.label} (ceiling)`,
        mode: mode as AccessMode,
      })
    }
  }

  return (
    <UserPermissions
      user={user}
      effectivePermissions={effectivePermissions}
      overrides={overrides}
      permissionSources={permissionSources}
      auditEntries={auditEntries}
      onCreateOverride={(featureId, mode, reason) =>
        console.log('Create override:', featureId, mode, reason)
      }
      onRevokeOverride={(id) => console.log('Revoke override:', id)}
      onCreateTemporaryGrant={(featureId, mode, expiresAt, reason) =>
        console.log('Create temp grant:', featureId, mode, expiresAt, reason)
      }
    />
  )
}

function modeRank(mode: AccessMode): number {
  return { none: 0, read: 1, write: 2, read_write: 3 }[mode]
}
