// Design-OS stub for circleup's eventDashboardApi.
export const loadDashboard = async (..._args: unknown[]) => ({
  events: [],
  upcoming: [],
  past: [],
  attendanceRate: 0,
})
export const loadEvent = async (..._args: unknown[]) => null
export const updateAttendance = async (..._args: unknown[]) => ({ success: true })
export const exportAttendance = async (..._args: unknown[]) => new Blob()
