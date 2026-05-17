import { useState, useEffect } from 'react'

interface BrData {
  id: string; status: string; reference: string; subscriptionTier: string
  contractEndDate: string | null; renewalDeadline: string | null
  renewalStatus: string | null; daysUntilRenewal: number | null
}

interface CmData {
  id: string; name: string; email: string; phone: string | null; responseSla: string
}

interface AccountData {
  totalBalance: number; currency: string
  fundBreakdown: { name: string; balance: number }[]
}

interface CircleSummary {
  id: string; name: string; status: string; currentCycle: number
  totalCycles: number; memberCount: number; organizerName: string
}

interface PresidentDashboardData {
  businessRelationship: BrData | null
  circleManager: CmData | null
  accountSummary: AccountData | null
  circles: CircleSummary[]
}

interface PresidentDashboardWidgetsProps {
  associationId: string
  onNavigate?: (path: string) => void
  onSendMessage?: () => void
}

const statusColors: Record<string, { bg: string; color: string }> = {
  active: { bg: '#dcfce7', color: '#166534' },
  pending: { bg: '#f3f4f6', color: '#6b7280' },
  suspended: { bg: '#fee2e2', color: '#991b1b' },
  terminated: { bg: '#fee2e2', color: '#991b1b' },
}

export function PresidentDashboardWidgets({ associationId, onNavigate, onSendMessage }: PresidentDashboardWidgetsProps) {
  const [data, setData] = useState<PresidentDashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/v1/associations/${associationId}/president_dashboard`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(json => {
        const d = json.data || json
        setData({ ...d, circles: d.circles || [] })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [associationId])

  if (loading) return <div style={{ padding: 16, color: '#666' }}>Loading president dashboard...</div>
  if (!data) return null

  const br = data.businessRelationship
  const cm = data.circleManager
  const account = data.accountSummary
  const showRenewal = br && br.daysUntilRenewal !== null && br.daysUntilRenewal <= 60

  const formatCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat('en-CH', { style: 'currency', currency, minimumFractionDigits: 0 }).format(amount)

  return (
    <div style={{ marginBottom: 24 }}>
      {/* Row 1: BR Status + CM Contact + Account Balance */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, marginBottom: 16 }}>
        {/* BR Status */}
        {br && (
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 14, color: '#666' }}>Business Relationship</h3>
              <span style={{ padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600, background: statusColors[br.status]?.bg || '#f3f4f6', color: statusColors[br.status]?.color || '#666' }}>
                {br.status.charAt(0).toUpperCase() + br.status.slice(1)}
              </span>
            </div>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Ref: {br.reference}</div>
            <div style={{ fontSize: 14 }}>
              <strong>{br.subscriptionTier.charAt(0).toUpperCase() + br.subscriptionTier.slice(1)}</strong> tier
            </div>
            {br.contractEndDate && (
              <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                Ends: {new Date(br.contractEndDate).toLocaleDateString()}
              </div>
            )}
            <button onClick={() => onNavigate?.(`/associations/${associationId}/subscription`)}
              style={{ marginTop: 12, background: 'none', border: '1px solid #E63946', color: '#E63946', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
              Manage Subscription
            </button>
          </div>
        )}

        {/* CM Contact */}
        {cm && (
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 14, color: '#666' }}>Circle Manager</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#E63946', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {cm.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{cm.name}</div>
                <div style={{ fontSize: 12, color: '#666' }}>{cm.email}</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Response SLA: {cm.responseSla}</div>
            <button onClick={onSendMessage}
              style={{ background: '#E63946', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
              Send Message
            </button>
          </div>
        )}

        {/* Account Balance */}
        {account && (
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 14, color: '#666' }}>Association Account</h3>
            <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
              {formatCurrency(account.totalBalance, account.currency)}
            </div>
            {account.fundBreakdown.length > 0 && (
              <div style={{ fontSize: 12 }}>
                {account.fundBreakdown.slice(0, 3).map((f, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', color: '#666', marginBottom: 2 }}>
                    <span>{f.name}</span>
                    <span>{formatCurrency(f.balance, account.currency)}</span>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => onNavigate?.(`/associations/${associationId}/ledger`)}
              style={{ marginTop: 12, background: 'none', border: '1px solid #E63946', color: '#E63946', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
              View Full Ledger
            </button>
          </div>
        )}
      </div>

      {/* Renewal Reminder */}
      {showRenewal && (
        <div style={{ background: '#fffbeb', border: '2px solid #f59e0b', borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, color: '#92400e' }}>Renewal Required</h3>
              <p style={{ margin: '4px 0 0', color: '#78350f' }}>
                Your contract renews in <strong>{br.daysUntilRenewal} days</strong>.
                Current tier: {br.subscriptionTier.charAt(0).toUpperCase() + br.subscriptionTier.slice(1)}.
              </p>
            </div>
            <button onClick={() => onNavigate?.(`/associations/${associationId}/subscription`)}
              style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}>
              Review Renewal
            </button>
          </div>
        </div>
      )}

      {/* Circles Table */}
      {data.circles.length > 0 && (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
          <h3 style={{ margin: '0 0 12px' }}>Circles Overview</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
                <th style={{ padding: '8px 4px' }}>Name</th>
                <th style={{ padding: '8px 4px' }}>Status</th>
                <th style={{ padding: '8px 4px' }}>Cycle</th>
                <th style={{ padding: '8px 4px' }}>Members</th>
                <th style={{ padding: '8px 4px' }}>Organizer</th>
              </tr>
            </thead>
            <tbody>
              {data.circles.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #f3f4f6', cursor: 'pointer' }}
                  onClick={() => onNavigate?.(`/circles/${c.id}`)}>
                  <td style={{ padding: '8px 4px', fontWeight: 500 }}>{c.name}</td>
                  <td style={{ padding: '8px 4px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 12, background: statusColors[c.status]?.bg || '#f3f4f6', color: statusColors[c.status]?.color || '#666' }}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ padding: '8px 4px' }}>{c.currentCycle}/{c.totalCycles}</td>
                  <td style={{ padding: '8px 4px' }}>{c.memberCount}</td>
                  <td style={{ padding: '8px 4px', color: '#666' }}>{c.organizerName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
