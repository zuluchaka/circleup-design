import { useState, useEffect } from 'react'

interface DimensionScore {
  score: number; trend: 'up' | 'down' | 'stable'
  details?: string; rate?: number; activeCircles?: number; balance?: number
}

interface HealthData {
  overall: number
  dimensions: {
    memberEngagement: DimensionScore; duesCollection: DimensionScore
    circleActivity: DimensionScore; financialHealth: DimensionScore
  }
  recommendations: string[]
}

interface HealthScorecardProps { associationId: string }

const trendIcon = (t: string) => t === 'up' ? '\u2191' : t === 'down' ? '\u2193' : '\u2192'
const scoreColor = (s: number) => s >= 80 ? '#22c55e' : s >= 50 ? '#eab308' : '#ef4444'

export function HealthScorecard({ associationId }: HealthScorecardProps) {
  const [data, setData] = useState<HealthData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/v1/associations/${associationId}/health_score`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(r => r.json())
      .then(json => { setData(json.data || json); setLoading(false) })
      .catch(() => setLoading(false))
  }, [associationId])

  if (loading) return <div style={{ padding: 24, color: '#666' }}>Calculating health score...</div>
  if (!data) return null

  const { overall, dimensions: d, recommendations } = data

  return (
    <div>
      {/* Overall Score */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{
          width: 140, height: 140, borderRadius: '50%', margin: '0 auto 16px',
          background: `conic-gradient(${scoreColor(overall)} ${overall * 3.6}deg, #e5e7eb 0deg)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ width: 110, height: 110, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: scoreColor(overall) }}>{overall}</div>
            <div style={{ fontSize: 12, color: '#666' }}>/ 100</div>
          </div>
        </div>
        <div style={{ fontSize: 18, fontWeight: 600 }}>Association Health Score</div>
      </div>

      {/* Dimension Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 24 }}>
        {([
          { key: 'memberEngagement', label: 'Member Engagement', dim: d.memberEngagement, extra: d.memberEngagement.details },
          { key: 'duesCollection', label: 'Dues Collection', dim: d.duesCollection, extra: `${d.duesCollection.rate || 0}% collection rate` },
          { key: 'circleActivity', label: 'Circle Activity', dim: d.circleActivity, extra: `${d.circleActivity.activeCircles || 0} active circles` },
          { key: 'financialHealth', label: 'Financial Health', dim: d.financialHealth, extra: d.financialHealth.balance !== undefined ? `CHF ${d.financialHealth.balance.toLocaleString()}` : '' },
        ] as const).map(({ key, label, dim, extra }) => (
          <div key={key} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, borderLeft: `4px solid ${scoreColor(dim.score)}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 14, color: '#666' }}>{label}</div>
              <span style={{ fontSize: 20, color: dim.trend === 'up' ? '#22c55e' : dim.trend === 'down' ? '#ef4444' : '#9ca3af' }}>
                {trendIcon(dim.trend)}
              </span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: scoreColor(dim.score) }}>{dim.score}</div>
            {extra && <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{extra}</div>}
          </div>
        ))}
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
          <h3 style={{ margin: '0 0 12px' }}>Recommendations</h3>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {recommendations.map((r, i) => (
              <li key={i} style={{ marginBottom: 6, color: '#555' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
