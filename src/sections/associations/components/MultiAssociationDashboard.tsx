import { useState, useEffect } from 'react'
import type { Association } from '@/../product/sections/associations/types'

interface MultiAssociationDashboardProps {
  userId: string
  onSelectAssociation: (id: string) => void
}

export function MultiAssociationDashboard({ userId, onSelectAssociation }: MultiAssociationDashboardProps) {
  const [associations, setAssociations] = useState<Association[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/v1/associations', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(r => r.json())
      .then(json => {
        const list = json.data?.associations || json.associations || []
        setAssociations(list.filter((a: Association) => a.myRole === 'president'))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [userId])

  if (loading) return <div style={{ padding: 24, color: '#666' }}>Loading associations...</div>

  if (associations.length <= 1) return null

  const totalMembers = associations.reduce((s, a) => s + a.memberCount, 0)
  const totalCircles = associations.reduce((s, a) => s + a.activeCircles, 0)
  const totalFunds = associations.reduce((s, a) => s + a.totalFunds, 0)
  const fmt = (n: number) => new Intl.NumberFormat('en-CH', { style: 'currency', currency: 'CHF', minimumFractionDigits: 0 }).format(n)

  return (
    <div>
      <h2 style={{ margin: '0 0 16px' }}>My Associations ({associations.length})</h2>

      {/* Cross-association summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{totalMembers}</div>
          <div style={{ fontSize: 12, color: '#666' }}>Total Members</div>
        </div>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{totalCircles}</div>
          <div style={{ fontSize: 12, color: '#666' }}>Active Circles</div>
        </div>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{fmt(totalFunds)}</div>
          <div style={{ fontSize: 12, color: '#666' }}>Total Funds</div>
        </div>
      </div>

      {/* Association Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {associations.map(a => (
          <div key={a.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, cursor: 'pointer' }}
            onClick={() => onSelectAssociation(a.id)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              {a.logo ? (
                <img src={a.logo} alt="" style={{ width: 40, height: 40, borderRadius: 8 }} />
              ) : (
                <div style={{ width: 40, height: 40, borderRadius: 8, background: '#E63946', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 18 }}>
                  {a.name.charAt(0)}
                </div>
              )}
              <div>
                <div style={{ fontWeight: 600 }}>{a.name}</div>
                <div style={{ fontSize: 12, color: '#666' }}>{a.type}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13 }}>
              <div><span style={{ color: '#666' }}>Members:</span> {a.memberCount}</div>
              <div><span style={{ color: '#666' }}>Circles:</span> {a.activeCircles}</div>
            </div>
            <button style={{ width: '100%', marginTop: 12, background: '#E63946', color: '#fff', border: 'none', padding: '8px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
              Switch to Dashboard
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
