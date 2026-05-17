import type { SystemHealthProps, ServiceStatus } from '../types'

const statusConfig: Record<ServiceStatus, { label: string; color: string; bg: string; dot: string }> = {
  operational: {
    label: 'Operational',
    color: 'text-emerald-700 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    dot: 'bg-emerald-500',
  },
  degraded: {
    label: 'Degraded Performance',
    color: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    dot: 'bg-amber-500',
  },
  partial_outage: {
    label: 'Partial Outage',
    color: 'text-orange-700 dark:text-orange-400',
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    dot: 'bg-orange-500',
  },
  major_outage: {
    label: 'Major Outage',
    color: 'text-red-700 dark:text-red-400',
    bg: 'bg-red-100 dark:bg-red-900/30',
    dot: 'bg-red-500 animate-pulse',
  },
  maintenance: {
    label: 'Under Maintenance',
    color: 'text-slate-600 dark:text-slate-400',
    bg: 'bg-slate-100 dark:bg-slate-800',
    dot: 'bg-slate-400',
  },
}

export function SystemHealth({
  services,
  metrics,
  onServiceClick,
  onCreateIncident,
}: SystemHealthProps) {
  const operationalCount = services.filter(s => s.status === 'operational').length
  const hasIssues = services.some(s => s.status !== 'operational' && s.status !== 'maintenance')

  const overallStatus = hasIssues
    ? services.some(s => s.status === 'major_outage')
      ? 'major_outage'
      : services.some(s => s.status === 'partial_outage')
      ? 'partial_outage'
      : 'degraded'
    : 'operational'

  const averageUptime = services.reduce((sum, s) => sum + s.uptime, 0) / services.length
  const averageResponseTime = services.reduce((sum, s) => sum + s.metrics.responseTime, 0) / services.length

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      {/* Header */}
      <div className={`${
        overallStatus === 'operational' ? 'bg-emerald-600 dark:bg-emerald-900' :
        overallStatus === 'major_outage' ? 'bg-red-600 dark:bg-red-900' :
        'bg-amber-600 dark:bg-amber-900'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`w-4 h-4 rounded-full ${
                  overallStatus === 'operational' ? 'bg-white' :
                  overallStatus === 'major_outage' ? 'bg-white animate-pulse' :
                  'bg-white'
                }`} />
                <h1 className="text-2xl font-bold text-white">
                  {overallStatus === 'operational'
                    ? 'All Systems Operational'
                    : overallStatus === 'major_outage'
                    ? 'Major Service Disruption'
                    : 'Some Systems Affected'}
                </h1>
              </div>
              <p className="text-white/80">
                {operationalCount} of {services.length} services operational
              </p>
            </div>
            <button
              onClick={() => onCreateIncident?.()}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-medium rounded-lg transition-colors"
            >
              Report Incident
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
            <div className="text-sm text-slate-500 mb-1">Average Uptime</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{averageUptime.toFixed(2)}%</div>
            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full rounded-full ${averageUptime > 99.9 ? 'bg-emerald-500' : averageUptime > 99 ? 'bg-amber-500' : 'bg-red-500'}`}
                style={{ width: `${averageUptime}%` }}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
            <div className="text-sm text-slate-500 mb-1">Avg Response Time</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{averageResponseTime.toFixed(0)}ms</div>
            <div className={`text-xs mt-1 ${averageResponseTime < 200 ? 'text-emerald-600' : averageResponseTime < 500 ? 'text-amber-600' : 'text-red-600'}`}>
              {averageResponseTime < 200 ? 'Excellent' : averageResponseTime < 500 ? 'Good' : 'Needs attention'}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
            <div className="text-sm text-slate-500 mb-1">Active Users</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{metrics.activeUsers.toLocaleString()}</div>
            <div className="text-xs text-emerald-600 mt-1">Online now</div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
            <div className="text-sm text-slate-500 mb-1">System Load</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{metrics.systemLoad}%</div>
            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full rounded-full ${metrics.systemLoad < 60 ? 'bg-emerald-500' : metrics.systemLoad < 80 ? 'bg-amber-500' : 'bg-red-500'}`}
                style={{ width: `${metrics.systemLoad}%` }}
              />
            </div>
          </div>
        </div>

        {/* Services List */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Services</h2>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {services.map(service => (
              <div
                key={service.id}
                onClick={() => onServiceClick?.(service.id)}
                className="px-6 py-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className={`w-3 h-3 rounded-full ${statusConfig[service.status].dot}`} />
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">{service.name}</h3>
                      <p className="text-sm text-slate-500">{service.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right hidden md:block">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{service.metrics.responseTime}ms</p>
                      <p className="text-xs text-slate-500">response time</p>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{service.uptime.toFixed(2)}%</p>
                      <p className="text-xs text-slate-500">uptime</p>
                    </div>
                    <div className="text-right hidden lg:block">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{service.metrics.errorRate.toFixed(2)}%</p>
                      <p className="text-xs text-slate-500">error rate</p>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${statusConfig[service.status].bg} ${statusConfig[service.status].color}`}>
                      {statusConfig[service.status].label}
                    </span>
                  </div>
                </div>

                {/* Service Metrics Bar */}
                <div className="mt-4 grid grid-cols-3 gap-4 md:hidden">
                  <div className="text-center p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <p className="text-xs text-slate-500">Response</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{service.metrics.responseTime}ms</p>
                  </div>
                  <div className="text-center p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <p className="text-xs text-slate-500">Uptime</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{service.uptime.toFixed(2)}%</p>
                  </div>
                  <div className="text-center p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <p className="text-xs text-slate-500">Errors</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{service.metrics.errorRate.toFixed(2)}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Database</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Active Connections</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{metrics.databaseConnections}/100</span>
                </div>
                <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      metrics.databaseConnections < 60 ? 'bg-emerald-500' :
                      metrics.databaseConnections < 80 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${metrics.databaseConnections}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Transaction Volume</h3>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {metrics.totalTransactions.toLocaleString()}
                </p>
                <p className="text-sm text-slate-500">transactions today</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  CHF {(metrics.transactionVolume / 1000000).toFixed(2)}M
                </p>
                <p className="text-sm text-slate-500">volume</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
