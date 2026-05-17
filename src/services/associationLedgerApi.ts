// Design-OS stub for circleup's associationLedgerApi.
// Returns empty/optimistic responses so components don't crash on import.

export const listEntries = async (..._args: unknown[]) => ({ entries: [] })
export const getEntry = async (..._args: unknown[]) => null
export const createEntry = async (..._args: unknown[]) => ({ id: 'stub' })
export const generateReport = async (..._args: unknown[]) => ({ url: '', filename: '' })
export const listReports = async (..._args: unknown[]) => ({ reports: [] })
export const getReport = async (..._args: unknown[]) => null
export const exportReport = async (..._args: unknown[]) => new Blob()
