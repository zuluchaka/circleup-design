import type {
  TrustGraphProps,
  TrustGraph,
  TrustGraphNode,
  SuggestedConnection,
} from '@/../product/sections/ai-insights/types'

// Network Visualization Component
function NetworkVisualization({ graph }: { graph: TrustGraph }) {
  // Calculate positions for nodes in a circular layout around center
  const centerX = 200
  const centerY = 200
  const radius = 140

  const nodePositions = graph.nodes.map((node, index) => {
    const angle = (index / graph.nodes.length) * 2 * Math.PI - Math.PI / 2
    return {
      ...node,
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    }
  })

  const trustLevelColors = {
    strong: '#10b981', // emerald-500
    moderate: '#f59e0b', // amber-500
    developing: '#94a3b8', // slate-400
  }

  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-md mx-auto">
      {/* Connection lines */}
      {nodePositions.map((node) => (
        <line
          key={`line-${node.userId}`}
          x1={centerX}
          y1={centerY}
          x2={node.x}
          y2={node.y}
          stroke={trustLevelColors[node.trustLevel]}
          strokeWidth={Math.max(1, node.connectionStrength * 4)}
          strokeOpacity={0.3 + node.connectionStrength * 0.4}
          className="transition-all duration-300"
        />
      ))}

      {/* Node circles */}
      {nodePositions.map((node) => (
        <g key={node.userId} className="cursor-pointer group">
          <circle
            cx={node.x}
            cy={node.y}
            r={20 + node.sharedCircles * 4}
            fill={trustLevelColors[node.trustLevel]}
            fillOpacity={0.2}
            stroke={trustLevelColors[node.trustLevel]}
            strokeWidth={2}
            className="transition-all duration-300 group-hover:fill-opacity-40"
          />
          <circle
            cx={node.x}
            cy={node.y}
            r={16}
            fill={trustLevelColors[node.trustLevel]}
            className="transition-all duration-300"
          />
          <text
            x={node.x}
            y={node.y}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-white text-xs font-bold pointer-events-none"
          >
            {node.userName.split(' ').map(n => n[0]).join('')}
          </text>
          {/* Tooltip would go here in a real implementation */}
        </g>
      ))}

      {/* Center node (current user) */}
      <g className="cursor-pointer">
        <circle
          cx={centerX}
          cy={centerY}
          r={35}
          fill="url(#centerGradient)"
          className="drop-shadow-lg"
        />
        <circle
          cx={centerX}
          cy={centerY}
          r={35}
          fill="none"
          stroke="#6366f1"
          strokeWidth={3}
          className="animate-pulse"
          strokeOpacity={0.5}
        />
        <text
          x={centerX}
          y={centerY - 5}
          textAnchor="middle"
          className="fill-white text-sm font-bold pointer-events-none"
        >
          You
        </text>
        <text
          x={centerX}
          y={centerY + 10}
          textAnchor="middle"
          className="fill-white/80 text-xs pointer-events-none"
        >
          {graph.totalConnections}
        </text>
      </g>

      {/* Gradient definitions */}
      <defs>
        <linearGradient id="centerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// Connection Card
function ConnectionCard({
  node,
  onView,
}: {
  node: TrustGraphNode
  onView?: () => void
}) {
  const trustLevelStyles = {
    strong: {
      badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400',
      bar: 'bg-emerald-500',
    },
    moderate: {
      badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400',
      bar: 'bg-amber-500',
    },
    developing: {
      badge: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400',
      bar: 'bg-slate-400',
    },
  }

  const style = trustLevelStyles[node.trustLevel]

  return (
    <div
      onClick={onView}
      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
          {node.userName.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-slate-900 dark:text-white">{node.userName}</h4>
          <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${style.badge}`}>
            {node.trustLevel}
          </span>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-slate-900 dark:text-white">
            {Math.round(node.connectionStrength * 100)}%
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">strength</p>
        </div>
      </div>

      <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full mb-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${style.bar}`}
          style={{ width: `${node.connectionStrength * 100}%` }}
        />
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
          <p className="font-semibold text-slate-900 dark:text-white">{node.sharedCircles}</p>
          <p className="text-slate-500 dark:text-slate-400">Shared Circles</p>
        </div>
        <div className="p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
          <p className="font-semibold text-slate-900 dark:text-white">{node.relationshipDuration}m</p>
          <p className="text-slate-500 dark:text-slate-400">Duration</p>
        </div>
        <div className="p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
          <p className="font-semibold text-slate-900 dark:text-white">{node.mutualConnections}</p>
          <p className="text-slate-500 dark:text-slate-400">Mutual</p>
        </div>
      </div>
    </div>
  )
}

// Suggested Connection Card
function SuggestedConnectionCard({
  suggestion,
  onRequest,
}: {
  suggestion: SuggestedConnection
  onRequest?: () => void
}) {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-900/10 border border-indigo-200 dark:border-indigo-800/50 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
          {suggestion.userName.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-slate-900 dark:text-white">{suggestion.userName}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">{suggestion.reason}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
            {Math.round(suggestion.potentialStrength * 100)}% potential
          </span>
        </div>
        <button
          onClick={onRequest}
          className="px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-md shadow-indigo-500/25"
        >
          Connect
        </button>
      </div>
    </div>
  )
}

// Network Stats Card
function NetworkStats({ graph }: { graph: TrustGraph }) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
      <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Network Statistics</h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-900/10 rounded-xl">
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{graph.totalConnections}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Total Connections</p>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-900/10 rounded-xl">
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{graph.trustedConnections}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Trusted (Strong)</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-600 dark:text-slate-400">Network Strength</span>
          <span className="text-sm font-semibold text-slate-900 dark:text-white">
            {Math.round(graph.networkStrength * 100)}%
          </span>
        </div>
        <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all"
            style={{ width: `${graph.networkStrength * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Trust Level Breakdown</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-6 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden flex">
            <div
              className="h-full bg-emerald-500 flex items-center justify-center text-white text-xs font-medium"
              style={{ width: `${(graph.nodes.filter(n => n.trustLevel === 'strong').length / graph.nodes.length) * 100}%` }}
            >
              {graph.nodes.filter(n => n.trustLevel === 'strong').length}
            </div>
            <div
              className="h-full bg-amber-500 flex items-center justify-center text-white text-xs font-medium"
              style={{ width: `${(graph.nodes.filter(n => n.trustLevel === 'moderate').length / graph.nodes.length) * 100}%` }}
            >
              {graph.nodes.filter(n => n.trustLevel === 'moderate').length}
            </div>
            <div
              className="h-full bg-slate-400 flex items-center justify-center text-white text-xs font-medium"
              style={{ width: `${(graph.nodes.filter(n => n.trustLevel === 'developing').length / graph.nodes.length) * 100}%` }}
            >
              {graph.nodes.filter(n => n.trustLevel === 'developing').length}
            </div>
          </div>
        </div>
        <div className="flex justify-between text-xs">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Strong
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Moderate
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-400" /> Developing
          </span>
        </div>
      </div>
    </div>
  )
}

// Network Insights Card
function NetworkInsights({ insights }: { insights: string[] }) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
      <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        Network Insights
      </h3>
      <div className="space-y-3">
        {insights.map((insight, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
            <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-amber-700 dark:text-amber-300">{insight}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TrustNetwork({
  trustGraph,
  onViewConnection,
  onRequestIntroduction,
}: TrustGraphProps) {
  const strongConnections = trustGraph.nodes.filter(n => n.trustLevel === 'strong')
  const moderateConnections = trustGraph.nodes.filter(n => n.trustLevel === 'moderate')
  const developingConnections = trustGraph.nodes.filter(n => n.trustLevel === 'developing')

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Trust Network</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Your social trust graph and connection insights for {trustGraph.centerUserName}
        </p>
      </div>

      {/* Network Visualization & Stats */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-center">Your Network</h3>
          <NetworkVisualization graph={trustGraph} />
          <div className="flex justify-center gap-6 mt-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" /> Strong
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500" /> Moderate
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-400" /> Developing
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <NetworkStats graph={trustGraph} />
          <NetworkInsights insights={trustGraph.networkInsights} />
        </div>
      </div>

      {/* Suggested Connections */}
      {trustGraph.suggestedConnections.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Suggested Connections
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trustGraph.suggestedConnections.map((suggestion) => (
              <SuggestedConnectionCard
                key={suggestion.userId}
                suggestion={suggestion}
                onRequest={() => onRequestIntroduction?.(suggestion.userId)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Connections by Trust Level */}
      {strongConnections.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            Strong Connections
            <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full">
              {strongConnections.length}
            </span>
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {strongConnections.map((node) => (
              <ConnectionCard
                key={node.userId}
                node={node}
                onView={() => onViewConnection?.(node.userId)}
              />
            ))}
          </div>
        </section>
      )}

      {moderateConnections.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            Moderate Connections
            <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
              {moderateConnections.length}
            </span>
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {moderateConnections.map((node) => (
              <ConnectionCard
                key={node.userId}
                node={node}
                onView={() => onViewConnection?.(node.userId)}
              />
            ))}
          </div>
        </section>
      )}

      {developingConnections.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-400" />
            Developing Connections
            <span className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400 rounded-full">
              {developingConnections.length}
            </span>
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {developingConnections.map((node) => (
              <ConnectionCard
                key={node.userId}
                node={node}
                onView={() => onViewConnection?.(node.userId)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
