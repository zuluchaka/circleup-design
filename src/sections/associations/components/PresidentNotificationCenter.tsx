import { useState, useEffect } from 'react'

interface Notification {
  id: string
  category: 'br_update' | 'renewal' | 'approval' | 'financial' | 'organizer' | 'system'
  priority: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  timestamp: string
  read: boolean
  actionUrl?: string
  actionLabel?: string
}

interface PresidentNotificationCenterProps {
  associationId: string
  onNavigate?: (path: string) => void
}

const categoryLabels: Record<string, string> = {
  all: 'All', br_update: 'BR Updates', renewal: 'Renewals',
  approval: 'Approvals', financial: 'Financial', organizer: 'Organizer', system: 'System'
}

const priorityColors: Record<string, string> = {
  critical: '#dc2626', high: '#f59e0b', medium: '#3b82f6', low: '#9ca3af'
}

export function PresidentNotificationCenter({ associationId, onNavigate }: PresidentNotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')

  const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` }

  useEffect(() => {
    fetch(`/api/v1/associations/${associationId}/president_notifications`, { headers })
      .then(r => r.json())
      .then(json => {
        const d = json.data || json
        setNotifications(d.notifications || [])
        setUnreadCount(d.unreadCount || 0)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [associationId])

  const markAllRead = () => {
    fetch(`/api/v1/associations/${associationId}/president_notifications/mark_all_read`, {
      method: 'POST', headers
    })
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const filtered = activeCategory === 'all' ? notifications : notifications.filter(n => n.category === activeCategory)

  if (loading) return <div style={{ padding: 24, color: '#666' }}>Loading notifications...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Notifications {unreadCount > 0 && <span style={{ background: '#dc2626', color: '#fff', padding: '2px 8px', borderRadius: 10, fontSize: 14, marginLeft: 8 }}>{unreadCount}</span>}</h2>
        {unreadCount > 0 && (
          <button onClick={markAllRead} style={{ background: 'none', border: '1px solid #e5e7eb', padding: '6px 16px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
            Mark All Read
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, flexWrap: 'wrap' }}>
        {Object.entries(categoryLabels).map(([key, label]) => (
          <button key={key} onClick={() => setActiveCategory(key)}
            style={{
              background: activeCategory === key ? '#E63946' : '#f3f4f6',
              color: activeCategory === key ? '#fff' : '#333',
              border: 'none', padding: '6px 14px', borderRadius: 16, cursor: 'pointer', fontSize: 13
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      {filtered.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 40, textAlign: 'center', color: '#666' }}>
          No notifications in this category
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(n => (
            <div key={n.id} style={{
              background: n.read ? '#fff' : '#fafafa', border: '1px solid #e5e7eb', borderRadius: 12,
              padding: 16, display: 'flex', alignItems: 'flex-start', gap: 12,
              borderLeft: `4px solid ${priorityColors[n.priority]}`,
            }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: priorityColors[n.priority], marginTop: 5, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: n.read ? 400 : 600, marginBottom: 4 }}>{n.title}</div>
                <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>{n.description}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#999' }}>{new Date(n.timestamp).toLocaleString()}</span>
                  {n.actionLabel && n.actionUrl && (
                    <button onClick={() => onNavigate?.(n.actionUrl!)}
                      style={{ background: '#E63946', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                      {n.actionLabel}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
