import { useState, useEffect } from 'react'

interface ContractData {
  reference: string
  legalName: string
  presidentName: string
  subscriptionTier: string
  feePercentage: number
  startDate: string
  durationMonths: number
  terms: Record<string, string>
  signatureDeadline: string
  readingProgress: number
  sectionsRead: Record<string, string>
}

interface CircleManagerInfo {
  name: string
  email: string
  company: string
}

interface PresidentContractReviewProps {
  token: string
  onAccept?: () => void
  onRequestModification?: (comments: string) => void
}

type ViewState = 'loading' | 'review' | 'signing' | 'success' | 'error' | 'modification' | 'rejection' | 'rejected'

export function PresidentContractReview({ token, onAccept, onRequestModification }: PresidentContractReviewProps) {
  const [viewState, setViewState] = useState<ViewState>('loading')
  const [contract, setContract] = useState<ContractData | null>(null)
  const [circleManager, setCm] = useState<CircleManagerInfo | null>(null)
  const [associationName, setAssociationName] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [readSections, setReadSections] = useState<Set<string>>(new Set())
  const [signName, setSignName] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [modificationComment, setModificationComment] = useState('')
  const [signing, setSigning] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [rejecting, setRejecting] = useState(false)

  useEffect(() => {
    fetch(`/api/v1/b2b/cm_contracts/president_review/${token}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Failed to load contract')
        }
        return res.json()
      })
      .then((data) => {
        const d = data.data || data
        setContract(d.contract)
        setCm(d.circleManager)
        setAssociationName(d.associationName || '')
        setReadSections(new Set(Object.keys(d.contract.sectionsRead || {})))
        setViewState('review')
      })
      .catch((err) => {
        setErrorMessage(err.message)
        setViewState('error')
      })
  }, [token])

  const termKeys = contract?.terms ? Object.keys(contract.terms) : []
  const allRead = termKeys.length > 0 && termKeys.every((k) => readSections.has(k))
  const progress = termKeys.length > 0 ? Math.round((readSections.size / termKeys.length) * 100) : 0

  const markRead = (key: string) => {
    setReadSections((prev) => new Set(prev).add(key))
  }

  const handleSign = async () => {
    if (!signName.trim() || !termsAccepted) return
    setSigning(true)
    try {
      const res = await fetch(`/api/v1/b2b/cm_contracts/sign/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: signName }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Signing failed')
      }
      setViewState('success')
      onAccept?.()
    } catch (err: any) {
      setErrorMessage(err.message)
      setViewState('error')
    } finally {
      setSigning(false)
    }
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) return
    setRejecting(true)
    try {
      const res = await fetch(`/api/v1/b2b/cm_contracts/reject/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectionReason }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Rejection failed')
      }
      setViewState('rejected')
    } catch (err: any) {
      setErrorMessage(err.message)
      setViewState('error')
    } finally {
      setRejecting(false)
    }
  }

  const handleModification = () => {
    onRequestModification?.(modificationComment)
    setViewState('review')
    setModificationComment('')
  }

  if (viewState === 'loading') {
    return (
      <div style={{ maxWidth: 800, margin: '40px auto', padding: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 24, marginBottom: 8 }}>Loading contract...</div>
        <div style={{ color: '#666' }}>Please wait while we retrieve your proposal.</div>
      </div>
    )
  }

  if (viewState === 'error') {
    return (
      <div style={{ maxWidth: 800, margin: '40px auto', padding: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 24, color: '#dc2626', marginBottom: 8 }}>Unable to Load Contract</div>
        <div style={{ color: '#666' }}>{errorMessage}</div>
      </div>
    )
  }

  if (viewState === 'success') {
    return (
      <div style={{ maxWidth: 800, margin: '40px auto', padding: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>&#10003;</div>
        <div style={{ fontSize: 24, color: '#16a34a', marginBottom: 8 }}>Contract Signed Successfully!</div>
        <div style={{ color: '#666', marginBottom: 24 }}>
          Welcome to CircleUp! Your association <strong>{associationName}</strong> has been set up.
        </div>
        <a href="/app/associations" style={{ display: 'inline-block', background: '#E63946', color: '#fff', padding: '12px 24px', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
          Go to Dashboard
        </a>
      </div>
    )
  }

  if (viewState === 'rejected') {
    return (
      <div style={{ maxWidth: 800, margin: '40px auto', padding: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>&#10007;</div>
        <div style={{ fontSize: 24, color: '#dc2626', marginBottom: 8 }}>Contract Rejected</div>
        <div style={{ color: '#666', marginBottom: 24 }}>
          You have rejected the contract for <strong>{associationName}</strong>.
          The Circle Manager has been notified of your decision.
        </div>
        <a href="/app/messages" style={{ display: 'inline-block', background: '#6b7280', color: '#fff', padding: '12px 24px', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
          Back to Messages
        </a>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 16px' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #E63946, #c1121f)', color: '#fff', padding: 32, borderRadius: '12px 12px 0 0' }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>Contract Review</h1>
        <p style={{ margin: '8px 0 0', opacity: 0.9 }}>for {associationName}</p>
      </div>

      <div style={{ background: '#fff', padding: 32, borderRadius: '0 0 12px 12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        {/* CM Card */}
        {circleManager && (
          <div style={{ background: '#f8f9fa', borderRadius: 8, padding: 16, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#E63946', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 18 }}>
              {circleManager.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <strong>{circleManager.name}</strong>
              <div style={{ color: '#666', fontSize: 14 }}>{circleManager.company} — Your Circle Manager</div>
            </div>
          </div>
        )}

        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, marginBottom: 24 }}>
          <div style={{ background: '#f0f9ff', padding: 12, borderRadius: 8 }}>
            <div style={{ fontSize: 12, color: '#666' }}>Tier</div>
            <div style={{ fontWeight: 600 }}>{contract?.subscriptionTier?.charAt(0).toUpperCase()}{contract?.subscriptionTier?.slice(1)}</div>
          </div>
          <div style={{ background: '#f0f9ff', padding: 12, borderRadius: 8 }}>
            <div style={{ fontSize: 12, color: '#666' }}>Fee</div>
            <div style={{ fontWeight: 600 }}>{contract?.feePercentage}%</div>
          </div>
          <div style={{ background: '#f0f9ff', padding: 12, borderRadius: 8 }}>
            <div style={{ fontSize: 12, color: '#666' }}>Duration</div>
            <div style={{ fontWeight: 600 }}>{contract?.durationMonths} months</div>
          </div>
          <div style={{ background: '#f0f9ff', padding: 12, borderRadius: 8 }}>
            <div style={{ fontSize: 12, color: '#666' }}>Start Date</div>
            <div style={{ fontWeight: 600 }}>{contract?.startDate ? new Date(contract.startDate).toLocaleDateString() : '-'}</div>
          </div>
        </div>

        {/* Reading Progress */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontWeight: 600 }}>Reading Progress</span>
            <span>{progress}%</span>
          </div>
          <div style={{ height: 8, background: '#e5e7eb', borderRadius: 4 }}>
            <div style={{ height: '100%', width: `${progress}%`, background: progress === 100 ? '#16a34a' : '#E63946', borderRadius: 4, transition: 'width 0.3s' }} />
          </div>
        </div>

        {/* Contract Sections */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 12 }}>Contract Terms</h3>
          {termKeys.map((key) => (
            <div key={key} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</strong>
                {readSections.has(key) ? (
                  <span style={{ color: '#16a34a', fontWeight: 600 }}>&#10003; Read</span>
                ) : (
                  <button onClick={() => markRead(key)} style={{ background: '#E63946', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: 4, cursor: 'pointer' }}>
                    Mark as Read
                  </button>
                )}
              </div>
              <p style={{ color: '#666', margin: '8px 0 0' }}>{contract?.terms[key]}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        {viewState === 'rejection' ? (
          <div style={{ border: '2px solid #dc2626', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ marginTop: 0, color: '#dc2626' }}>Reject Contract</h3>
            <p style={{ color: '#666', fontSize: 14, marginBottom: 12 }}>
              Please provide a reason for rejecting this contract. The Circle Manager will be notified immediately.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Explain why you are rejecting this contract..."
              style={{ width: '100%', minHeight: 100, padding: 12, border: '1px solid #e5e7eb', borderRadius: 8, resize: 'vertical', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button onClick={handleReject} disabled={!rejectionReason.trim() || rejecting}
                style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, opacity: (!rejectionReason.trim() || rejecting) ? 0.5 : 1 }}>
                {rejecting ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
              <button onClick={() => { setViewState('review'); setRejectionReason('') }} style={{ background: '#e5e7eb', border: 'none', padding: '12px 24px', borderRadius: 8, cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        ) : viewState === 'modification' ? (
          <div style={{ marginBottom: 24 }}>
            <h3>Request Modifications</h3>
            <textarea
              value={modificationComment}
              onChange={(e) => setModificationComment(e.target.value)}
              placeholder="Describe the modifications you'd like..."
              style={{ width: '100%', minHeight: 100, padding: 12, border: '1px solid #e5e7eb', borderRadius: 8, resize: 'vertical' }}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button onClick={handleModification} disabled={!modificationComment.trim()} style={{ background: '#E63946', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                Submit Request
              </button>
              <button onClick={() => setViewState('review')} style={{ background: '#e5e7eb', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        ) : viewState === 'signing' ? (
          <div style={{ border: '2px solid #E63946', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ marginTop: 0 }}>Sign Contract</h3>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>Full Legal Name</label>
              <input
                type="text" value={signName} onChange={(e) => setSignName(e.target.value)}
                placeholder="Enter your full legal name"
                style={{ width: '100%', padding: 10, border: '1px solid #e5e7eb', borderRadius: 8, boxSizing: 'border-box' }}
              />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, cursor: 'pointer' }}>
              <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />
              I have read and accept all contract terms
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleSign} disabled={!signName.trim() || !termsAccepted || signing}
                style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, opacity: (!signName.trim() || !termsAccepted || signing) ? 0.5 : 1 }}>
                {signing ? 'Signing...' : 'Sign Contract'}
              </button>
              <button onClick={() => setViewState('review')} style={{ background: '#e5e7eb', border: 'none', padding: '12px 24px', borderRadius: 8, cursor: 'pointer' }}>
                Back
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={() => setViewState('signing')} disabled={!allRead}
              style={{ background: allRead ? '#16a34a' : '#9ca3af', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 8, cursor: allRead ? 'pointer' : 'not-allowed', fontWeight: 600 }}>
              Accept & Sign
            </button>
            <button onClick={() => setViewState('rejection')}
              style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
              Reject Contract
            </button>
            <button onClick={() => setViewState('modification')}
              style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
              Request Modifications
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
