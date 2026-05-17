import { useState, useEffect } from 'react'

interface SubscriptionData {
  currentTier: string; monthlyCost: number; memberCount: number; memberLimit: number
  circleCount: number; circleLimit: number; features: string[]
  billingContact: string | null; invoiceAddress: string | null
  paymentMethod: string | null; nextBillingDate: string | null; contractEndDate: string | null
}

interface SubscriptionManagementProps {
  associationId: string
  onNavigate?: (path: string) => void
}

const tiers = [
  { id: 'free', name: 'Free', cost: 0, members: 25, circles: 2, features: ['Circle management', 'Member directory', 'Basic reporting'] },
  { id: 'basic', name: 'Basic', cost: 29.90, members: 100, circles: 10, features: ['Circle management', 'Member directory', 'Basic reporting', 'Advanced analytics', 'Standard support'] },
  { id: 'pro', name: 'Pro', cost: 79.90, members: 500, circles: 50, features: ['Circle management', 'Member directory', 'Basic reporting', 'Advanced analytics', 'Priority support', 'Custom branding', 'API access', 'White label'] },
]

export function SubscriptionManagement({ associationId }: SubscriptionManagementProps) {
  const [data, setData] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)
  const [showBilling, setShowBilling] = useState(false)
  const [billingContact, setBillingContact] = useState('')
  const [invoiceAddress, setInvoiceAddress] = useState('')

  const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' }

  useEffect(() => {
    fetch(`/api/v1/associations/${associationId}/subscription`, { headers })
      .then(res => res.json())
      .then(json => {
        const d = json.data || json
        setData(d)
        setBillingContact(d.billingContact || '')
        setInvoiceAddress(d.invoiceAddress || '')
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [associationId])

  const handleUpgrade = async (tier: string) => {
    setUpgrading(true)
    try {
      const res = await fetch(`/api/v1/associations/${associationId}/upgrade_subscription`, {
        method: 'POST', headers, body: JSON.stringify({ tier })
      })
      if (res.ok) {
        await res.json()
        setData(prev => prev ? { ...prev, currentTier: tier, monthlyCost: tiers.find(t => t.id === tier)?.cost || 0 } : null)
      }
    } finally {
      setUpgrading(false)
    }
  }

  const saveBilling = async () => {
    await fetch(`/api/v1/associations/${associationId}/update_billing`, {
      method: 'PATCH', headers,
      body: JSON.stringify({ billingContact, invoiceAddress })
    })
    setShowBilling(false)
    setData(prev => prev ? { ...prev, billingContact, invoiceAddress } : null)
  }

  if (loading) return <div style={{ padding: 24, textAlign: 'center', color: '#666' }}>Loading subscription...</div>
  if (!data) return null

  const currentTierInfo = tiers.find(t => t.id === data.currentTier) || tiers[0]

  return (
    <div>
      {/* Current Plan */}
      <div style={{ background: '#fff', border: '2px solid #E63946', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <span style={{ fontSize: 12, color: '#666' }}>Current Plan</span>
            <h2 style={{ margin: '4px 0', fontSize: 28 }}>{currentTierInfo.name}</h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 28, fontWeight: 700 }}>CHF {data.monthlyCost.toFixed(2)}</div>
            <div style={{ fontSize: 12, color: '#666' }}>per month</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: '#666' }}>Members</div>
            <div style={{ fontWeight: 600 }}>{data.memberCount} / {data.memberLimit}</div>
            <div style={{ height: 6, background: '#e5e7eb', borderRadius: 3, marginTop: 4 }}>
              <div style={{ height: '100%', width: `${Math.min((data.memberCount / data.memberLimit) * 100, 100)}%`, background: '#E63946', borderRadius: 3 }} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#666' }}>Circles</div>
            <div style={{ fontWeight: 600 }}>{data.circleCount} / {data.circleLimit}</div>
            <div style={{ height: 6, background: '#e5e7eb', borderRadius: 3, marginTop: 4 }}>
              <div style={{ height: '100%', width: `${Math.min((data.circleCount / data.circleLimit) * 100, 100)}%`, background: '#E63946', borderRadius: 3 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Tier Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {tiers.map(tier => (
          <div key={tier.id} style={{
            background: '#fff', border: tier.id === data.currentTier ? '2px solid #E63946' : '1px solid #e5e7eb',
            borderRadius: 12, padding: 20, position: 'relative'
          }}>
            {tier.id === data.currentTier && (
              <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: '#E63946', color: '#fff', padding: '2px 12px', borderRadius: 10, fontSize: 12, fontWeight: 600 }}>
                Current
              </div>
            )}
            <h3 style={{ margin: '8px 0' }}>{tier.name}</h3>
            <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>CHF {tier.cost.toFixed(2)}<span style={{ fontSize: 14, fontWeight: 400, color: '#666' }}>/mo</span></div>
            <div style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>
              Up to {tier.members} members, {tier.circles} circles
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', fontSize: 13 }}>
              {tier.features.map((f, i) => (
                <li key={i} style={{ padding: '3px 0' }}>&#10003; {f}</li>
              ))}
            </ul>
            {tier.id !== data.currentTier && tiers.indexOf(tier) > tiers.findIndex(t => t.id === data.currentTier) && (
              <button onClick={() => handleUpgrade(tier.id)} disabled={upgrading}
                style={{ width: '100%', background: '#E63946', color: '#fff', border: 'none', padding: '10px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                {upgrading ? 'Upgrading...' : `Upgrade to ${tier.name}`}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Billing Settings */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}>Billing Settings</h3>
          <button onClick={() => setShowBilling(!showBilling)}
            style={{ background: 'none', border: '1px solid #E63946', color: '#E63946', padding: '6px 16px', borderRadius: 6, cursor: 'pointer' }}>
            {showBilling ? 'Cancel' : 'Edit'}
          </button>
        </div>
        {showBilling ? (
          <div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Billing Contact Email</label>
              <input value={billingContact} onChange={e => setBillingContact(e.target.value)}
                style={{ width: '100%', padding: 10, border: '1px solid #e5e7eb', borderRadius: 8, boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Invoice Address</label>
              <textarea value={invoiceAddress} onChange={e => setInvoiceAddress(e.target.value)}
                style={{ width: '100%', padding: 10, border: '1px solid #e5e7eb', borderRadius: 8, minHeight: 60, boxSizing: 'border-box' }} />
            </div>
            <button onClick={saveBilling}
              style={{ background: '#E63946', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
              Save Changes
            </button>
          </div>
        ) : (
          <div style={{ fontSize: 14 }}>
            <div style={{ marginBottom: 8 }}><strong>Contact:</strong> {data.billingContact || 'Not set'}</div>
            <div style={{ marginBottom: 8 }}><strong>Address:</strong> {data.invoiceAddress || 'Not set'}</div>
            <div style={{ marginBottom: 8 }}><strong>Payment:</strong> {data.paymentMethod || 'Not configured'}</div>
            {data.nextBillingDate && <div><strong>Next billing:</strong> {new Date(data.nextBillingDate).toLocaleDateString()}</div>}
          </div>
        )}
      </div>
    </div>
  )
}
