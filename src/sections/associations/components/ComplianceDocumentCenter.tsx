import { useState } from 'react'

type DocType = 'bylaws' | 'agm_minutes' | 'audit_certificate' | 'annual_report' | 'contract' | 'amendment'
type DocStatus = 'draft' | 'active' | 'archived' | 'pending_signature'

interface ComplianceDocument {
  id: number; type: DocType; title: string; version: number; status: DocStatus
  uploadedAt: string; uploadedBy: string; signedAt?: string; signedBy?: string; fileUrl?: string
}

interface ComplianceDocumentCenterProps {
  associationId: string
  documents?: ComplianceDocument[]
  onUpload?: (file: File, type: DocType, title: string) => void
  onDownload?: (docId: number) => void
  onArchive?: (docId: number) => void
}

const typeLabels: Record<string, string> = {
  all: 'All', bylaws: 'Bylaws', agm_minutes: 'AGM Minutes', audit_certificate: 'Audit Certificates',
  annual_report: 'Annual Reports', contract: 'Contracts', amendment: 'Amendments'
}

const statusStyles: Record<string, { bg: string; color: string }> = {
  draft: { bg: '#f3f4f6', color: '#6b7280' }, active: { bg: '#dcfce7', color: '#166534' },
  archived: { bg: '#fef3c7', color: '#92400e' }, pending_signature: { bg: '#dbeafe', color: '#1e40af' },
}

export function ComplianceDocumentCenter({ documents = [], onUpload, onDownload, onArchive }: ComplianceDocumentCenterProps) {
  const [activeTab, setActiveTab] = useState('all')
  const [showUpload, setShowUpload] = useState(false)
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadType, setUploadType] = useState<DocType>('bylaws')

  const filtered = activeTab === 'all' ? documents : documents.filter(d => d.type === activeTab)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Compliance & Documents</h2>
        <button onClick={() => setShowUpload(!showUpload)}
          style={{ background: '#E63946', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
          {showUpload ? 'Cancel' : 'Upload Document'}
        </button>
      </div>

      {/* Upload form */}
      {showUpload && (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>Title</label>
              <input value={uploadTitle} onChange={e => setUploadTitle(e.target.value)} placeholder="Document title"
                style={{ width: '100%', padding: 10, border: '1px solid #e5e7eb', borderRadius: 8, boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>Type</label>
              <select value={uploadType} onChange={e => setUploadType(e.target.value as DocType)}
                style={{ width: '100%', padding: 10, border: '1px solid #e5e7eb', borderRadius: 8 }}>
                {Object.entries(typeLabels).filter(([k]) => k !== 'all').map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>
          <input type="file" onChange={e => {
            const file = e.target.files?.[0]
            if (file && uploadTitle) { onUpload?.(file, uploadType, uploadTitle); setShowUpload(false); setUploadTitle('') }
          }} />
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, flexWrap: 'wrap' }}>
        {Object.entries(typeLabels).map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key)}
            style={{
              background: activeTab === key ? '#E63946' : '#f3f4f6',
              color: activeTab === key ? '#fff' : '#333',
              border: 'none', padding: '6px 14px', borderRadius: 16, cursor: 'pointer', fontSize: 13
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* Documents Table */}
      {filtered.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 40, textAlign: 'center', color: '#666' }}>
          No documents in this category
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left', background: '#f9fafb' }}>
                <th style={{ padding: '12px 16px' }}>Title</th>
                <th style={{ padding: '12px 8px' }}>Type</th>
                <th style={{ padding: '12px 8px' }}>Version</th>
                <th style={{ padding: '12px 8px' }}>Status</th>
                <th style={{ padding: '12px 8px' }}>Uploaded</th>
                <th style={{ padding: '12px 16px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(doc => (
                <tr key={doc.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 500 }}>{doc.title}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 11, background: '#e5e7eb' }}>
                      {typeLabels[doc.type] || doc.type}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px' }}>v{doc.version}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 11, ...statusStyles[doc.status] }}>
                      {doc.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px', color: '#666' }}>{new Date(doc.uploadedAt).toLocaleDateString()}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => onDownload?.(doc.id)} style={{ background: 'none', border: '1px solid #e5e7eb', padding: '4px 8px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Download</button>
                      <button onClick={() => onArchive?.(doc.id)} style={{ background: 'none', border: '1px solid #e5e7eb', padding: '4px 8px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Archive</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
