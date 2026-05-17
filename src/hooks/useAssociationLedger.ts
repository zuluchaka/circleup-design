// Design-OS stub for circleup's useAssociationLedger hook.
// Returns empty data so components render their empty states.

import { useState } from 'react'

export function useAssociationLedger(_associationId: string) {
  const [loading] = useState(false)
  return {
    dashboard: null,
    entries: [],
    reports: [],
    loading,
    error: null as string | null,
    loadDashboard: async () => {},
    loadEntries: async () => {},
    exportReport: async () => null,
  }
}
