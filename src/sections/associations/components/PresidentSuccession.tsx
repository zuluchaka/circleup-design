import { useState, useEffect } from 'react'
import type { Member } from '@/../product/sections/associations/types'

interface SuccessionData {
  id: string; status: string; outgoingPresidentName: string; incomingPresidentName: string
  deadline: string; acceptedAt: string | null; daysRemaining: number; notes: string | null
}

interface PresidentSuccessionProps {
  associationId: string
  currentUserId: string
  onNavigate?: (path: string) => void
}

export function PresidentSuccession({ associationId, currentUserId }: PresidentSuccessionProps) {
  const [members, setMembers] = useState<Member[]>([])
  const [succession, setSuccession] = useState<SuccessionData | null>(null)
  const [hasActive, setHasActive] = useState(false)
  const [selectedMember, setSelectedMember] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [search, setSearch] = useState('')

  const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' }

  useEffect(() => {
    Promise.all([
      fetch(`/api/v1/associations/${associationId}/memberships?status=active`, { headers }).then(r => r.json()),
      fetch(`/api/v1/associations/${associationId}/memberships/succession_status`, { headers }).then(r => r.json()),
    ]).then(([membersJson, successionJson]) => {
      const memberData = (membersJson.data?.members || membersJson.members || [])
      setMembers(memberData.filter((m: Member) => m.userId !== currentUserId && m.status === 'active'))
      const sData = successionJson.data || successionJson
      if (sData.id) { setSuccession(sData); setHasActive(true) }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [associationId, currentUserId])

  const initiate = async () => {
    if (!selectedMember) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/v1/associations/${associationId}/memberships/initiate_succession`, {
        method: 'POST', headers, body: JSON.stringify({ incoming_member_id: selectedMember, notes })
      })
      const json = await res.json()
      const sData = json.data || json
      setSuccession(sData); setHasActive(true)
    } finally { setSubmitting(false) }
  }

  const accept = async () => {
    if (!succession) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/v1/associations/${associationId}/memberships/${succession.id}/accept_succession`, {
        method: 'POST', headers
      })
      const json = await res.json()
      setSuccession(json.data || json)
    } finally { setSubmitting(false) }
  }

  if (loading) return <div style={{ padding: 24, color: '#666' }}>Loading succession status...</div>

  const filteredMembers = members.filter(m => m.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <h2 style={{ margin: '0 0 24px' }}>Governance — Succession</h2>

      {/* Active succession */}
      {hasActive && succession && (
        <div style={{ background: '#fff', border: '2px solid #f59e0b', borderRadius: 12, padding: 24, marginBottom: 24 }}>
          <h3 style={{ margin: '0 0 12px', color: '#92400e' }}>
            {succession.status === 'pending' ? 'Succession In Progress' :
             succession.status === 'accepted' ? 'Succession Completed' :
             succession.status === 'expired' ? 'Succession Expired' : 'Succession Cancelled'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: '#666' }}>Outgoing President</div>
              <div style={{ fontWeight: 600 }}>{succession.outgoingPresidentName}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#666' }}>Incoming President</div>
              <div style={{ fontWeight: 600 }}>{succession.incomingPresidentName}</div>
            </div>
          </div>
          {succession.status === 'pending' && (
            <>
              <div style={{ background: '#fffbeb', padding: 12, borderRadius: 8, marginBottom: 12 }}>
                <strong>{succession.daysRemaining} days remaining</strong> to accept (deadline: {new Date(succession.deadline).toLocaleDateString()})
              </div>
              <button onClick={accept} disabled={submitting}
                style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                {submitting ? 'Processing...' : 'Accept Succession'}
              </button>
            </>
          )}
          {succession.status === 'accepted' && (
            <div style={{ background: '#dcfce7', padding: 12, borderRadius: 8, color: '#166534' }}>
              Succession completed on {succession.acceptedAt ? new Date(succession.acceptedAt).toLocaleDateString() : '-'}. Roles have been transferred.
            </div>
          )}
          {succession.status === 'expired' && (
            <div style={{ background: '#fee2e2', padding: 12, borderRadius: 8, color: '#991b1b' }}>
              This succession request expired. The current president remains in role.
            </div>
          )}
        </div>
      )}

      {/* Initiate new succession */}
      {!hasActive && (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24 }}>
          <h3 style={{ margin: '0 0 16px' }}>Initiate Presidential Succession</h3>
          <p style={{ color: '#666', marginBottom: 16 }}>
            Select a verified member to receive the presidency. They will have 14 days to accept.
            A contract amendment will be generated for the change of authorized signer.
          </p>

          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members..."
            style={{ width: '100%', padding: 10, border: '1px solid #e5e7eb', borderRadius: 8, marginBottom: 12, boxSizing: 'border-box' }} />

          <div style={{ maxHeight: 300, overflow: 'auto', border: '1px solid #e5e7eb', borderRadius: 8, marginBottom: 16 }}>
            {filteredMembers.map(m => (
              <label key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid #f3f4f6', cursor: 'pointer', background: selectedMember === m.id ? '#eff6ff' : 'transparent' }}>
                <input type="radio" name="successor" checked={selectedMember === m.id} onChange={() => setSelectedMember(m.id)} />
                <div>
                  <div style={{ fontWeight: 500 }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>{m.role} — {m.email}</div>
                </div>
              </label>
            ))}
            {filteredMembers.length === 0 && <div style={{ padding: 16, color: '#666', textAlign: 'center' }}>No eligible members found</div>}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Notes (optional)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Reason for succession..."
              style={{ width: '100%', padding: 10, border: '1px solid #e5e7eb', borderRadius: 8, minHeight: 60, boxSizing: 'border-box' }} />
          </div>

          <button onClick={initiate} disabled={!selectedMember || submitting}
            style={{ background: '#E63946', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 8, cursor: selectedMember ? 'pointer' : 'not-allowed', fontWeight: 600, opacity: (!selectedMember || submitting) ? 0.5 : 1 }}>
            {submitting ? 'Initiating...' : 'Initiate Succession'}
          </button>
        </div>
      )}
    </div>
  )
}
