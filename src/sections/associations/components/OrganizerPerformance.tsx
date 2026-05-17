import { useState, useEffect } from 'react'

interface OrganizerMetrics {
  organizerId: string; name: string; circlesManaged: number
  collectionRate: number; onTimePayouts: number; memberCount: number
  status: 'active' | 'probation' | 'suspended'; appointedAt: string
}

interface OrganizerPerformanceProps {
  associationId: string
  onNavigate?: (path: string) => void
}

const perfBadge = (rate: number) => {
  if (rate >= 90) return { label: 'Excellent', bg: '#dcfce7', color: '#166534' }
  if (rate >= 70) return { label: 'Good', bg: '#dbeafe', color: '#1e40af' }
  return { label: 'Needs Improvement', bg: '#fee2e2', color: '#991b1b' }
}

type SortKey = 'name' | 'circlesManaged' | 'collectionRate' | 'onTimePayouts' | 'memberCount'

export function OrganizerPerformance({ associationId }: OrganizerPerformanceProps) {
  const [organizers, setOrganizers] = useState<OrganizerMetrics[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortKey>('collectionRate')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    fetch(`/api/v1/associations/${associationId}/organizer_performance`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(r => r.json())
      .then(json => { setOrganizers((json.data || json).organizers || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [associationId])

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(key); setSortDir('desc') }
  }

  const sorted = [...organizers].sort((a, b) => {
    const av = a[sortBy], bv = b[sortBy]
    if (typeof av === 'string') return sortDir === 'asc' ? av.localeCompare(bv as string) : (bv as string).localeCompare(av)
    return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number)
  })

  if (loading) return <div style={{ padding: 24, color: '#666' }}>Loading organizer metrics...</div>

  const avgCollection = organizers.length > 0 ? Math.round(organizers.reduce((s, o) => s + o.collectionRate, 0) / organizers.length) : 0
  const avgOnTime = organizers.length > 0 ? Math.round(organizers.reduce((s, o) => s + o.onTimePayouts, 0) / organizers.length) : 0

  return (
    <div>
      <h2 style={{ margin: '0 0 16px' }}>Circle Organizer Performance</h2>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{organizers.length}</div>
          <div style={{ fontSize: 12, color: '#666' }}>Total Organizers</div>
        </div>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: avgCollection >= 70 ? '#166534' : '#991b1b' }}>{avgCollection}%</div>
          <div style={{ fontSize: 12, color: '#666' }}>Avg Collection Rate</div>
        </div>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: avgOnTime >= 70 ? '#166534' : '#991b1b' }}>{avgOnTime}%</div>
          <div style={{ fontSize: 12, color: '#666' }}>Avg On-Time Payouts</div>
        </div>
      </div>

      {/* Table */}
      {organizers.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 40, textAlign: 'center', color: '#666' }}>
          No organizers assigned yet
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left', background: '#f9fafb' }}>
                {([
                  ['name', 'Name'], ['circlesManaged', 'Circles'], ['collectionRate', 'Collection %'],
                  ['onTimePayouts', 'On-Time %'], ['memberCount', 'Members']
                ] as [SortKey, string][]).map(([key, label]) => (
                  <th key={key} onClick={() => toggleSort(key)}
                    style={{ padding: '12px 16px', cursor: 'pointer', userSelect: 'none' }}>
                    {label} {sortBy === key ? (sortDir === 'asc' ? '\u2191' : '\u2193') : ''}
                  </th>
                ))}
                <th style={{ padding: '12px 16px' }}>Performance</th>
                <th style={{ padding: '12px 16px' }}>Since</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(o => {
                const badge = perfBadge(o.collectionRate)
                return (
                  <tr key={o.organizerId} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 500 }}>{o.name}</td>
                    <td style={{ padding: '12px 16px' }}>{o.circlesManaged}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: o.collectionRate >= 70 ? '#166534' : '#991b1b' }}>{o.collectionRate}%</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: o.onTimePayouts >= 70 ? '#166534' : '#991b1b' }}>{o.onTimePayouts}%</td>
                    <td style={{ padding: '12px 16px' }}>{o.memberCount}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '2px 10px', borderRadius: 10, fontSize: 12, background: badge.bg, color: badge.color }}>
                        {badge.label}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#666' }}>
                      {o.appointedAt ? new Date(o.appointedAt).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
