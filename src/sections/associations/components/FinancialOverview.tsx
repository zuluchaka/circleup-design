import { useState, useEffect } from 'react'

interface CashFlowMonth { month: string; income: number; expenses: number }
interface FlaggedTransaction {
  id: string; date: string; type: string; amount: number; currency: string
  description: string; direction: string; approvalStatus: string; reason: string
}
interface CircleAccountSummary {
  circleId: string; circleName: string; accountBalance: number
  contributionsThisCycle: number; nextPayoutDate: string | null; status: string
}

interface FinancialOverviewProps {
  associationId: string
  onNavigate?: (path: string) => void
}

export function FinancialOverview({ associationId, onNavigate }: FinancialOverviewProps) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<{
    associationBalance: number; currency: string; circleAccountsTotal: number
    monthlyCashFlow: CashFlowMonth[]; flaggedTransactions: FlaggedTransaction[]
    flaggedCount: number; circleAccounts: CircleAccountSummary[]
  } | null>(null)
  const [generatingAgm, setGeneratingAgm] = useState(false)

  useEffect(() => {
    fetch(`/api/v1/associations/${associationId}/ledger/financial_overview`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(json => { setData(json.data || json); setLoading(false) })
      .catch(() => setLoading(false))
  }, [associationId])

  const generateAgm = async () => {
    setGeneratingAgm(true)
    try {
      await fetch(`/api/v1/associations/${associationId}/financial_reports/agm`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
    } finally {
      setGeneratingAgm(false)
    }
  }

  const fmt = (amount: number) =>
    new Intl.NumberFormat('en-CH', { style: 'currency', currency: data?.currency || 'CHF', minimumFractionDigits: 0 }).format(amount)

  if (loading) return <div style={{ padding: 24, textAlign: 'center', color: '#666' }}>Loading financial overview...</div>
  if (!data) return <div style={{ padding: 24, textAlign: 'center', color: '#999' }}>No financial data available.</div>

  const maxCashFlow = Math.max(...data.monthlyCashFlow.map(m => Math.max(m.income, m.expenses)), 1)

  return (
    <div style={{ padding: '0 0 24px' }}>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Association Balance', value: fmt(data.associationBalance), color: '#166534' },
          { label: 'Circle Accounts Total', value: fmt(data.circleAccountsTotal), color: '#1e40af' },
          { label: 'Monthly Net Flow', value: fmt((data.monthlyCashFlow[data.monthlyCashFlow.length - 1]?.income || 0) - (data.monthlyCashFlow[data.monthlyCashFlow.length - 1]?.expenses || 0)), color: '#92400e' },
          { label: 'Flagged Transactions', value: String(data.flaggedCount), color: data.flaggedCount > 0 ? '#991b1b' : '#166534' },
        ].map((card, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>{card.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: card.color }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Cash Flow Chart */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 16px' }}>Monthly Cash Flow (12 months)</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 160 }}>
          {data.monthlyCashFlow.map((m, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'flex-end', height: 130 }}>
                <div title={`Income: ${fmt(m.income)}`}
                  style={{ width: '40%', background: '#22c55e', borderRadius: '4px 4px 0 0', height: `${(m.income / maxCashFlow) * 100}%`, minHeight: 2 }} />
                <div title={`Expenses: ${fmt(m.expenses)}`}
                  style={{ width: '40%', background: '#ef4444', borderRadius: '4px 4px 0 0', height: `${(m.expenses / maxCashFlow) * 100}%`, minHeight: 2 }} />
              </div>
              <div style={{ fontSize: 10, color: '#666', marginTop: 4, transform: 'rotate(-45deg)', whiteSpace: 'nowrap' }}>
                {m.month.split(' ')[0]}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 12, fontSize: 12 }}>
          <span><span style={{ display: 'inline-block', width: 12, height: 12, background: '#22c55e', borderRadius: 2, marginRight: 4 }} />Income</span>
          <span><span style={{ display: 'inline-block', width: 12, height: 12, background: '#ef4444', borderRadius: 2, marginRight: 4 }} />Expenses</span>
        </div>
      </div>

      {/* Flagged Transactions */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 12px' }}>Flagged Transactions</h3>
        {data.flaggedTransactions.length === 0 ? (
          <div style={{ color: '#666', textAlign: 'center', padding: 24 }}>No flagged transactions</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
                <th style={{ padding: '8px 4px' }}>Date</th>
                <th style={{ padding: '8px 4px' }}>Type</th>
                <th style={{ padding: '8px 4px' }}>Amount</th>
                <th style={{ padding: '8px 4px' }}>Reason</th>
                <th style={{ padding: '8px 4px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.flaggedTransactions.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid #f3f4f6', background: '#fffbeb' }}>
                  <td style={{ padding: '8px 4px' }}>{t.date ? new Date(t.date).toLocaleDateString() : '-'}</td>
                  <td style={{ padding: '8px 4px', textTransform: 'capitalize' }}>{t.type.replace(/_/g, ' ')}</td>
                  <td style={{ padding: '8px 4px', fontWeight: 600, color: t.direction === 'debit' ? '#dc2626' : '#16a34a' }}>
                    {t.direction === 'debit' ? '-' : '+'}{fmt(t.amount)}
                  </td>
                  <td style={{ padding: '8px 4px', color: '#92400e' }}>{t.reason}</td>
                  <td style={{ padding: '8px 4px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 12, background: t.approvalStatus === 'pending' ? '#fef3c7' : '#dcfce7', color: t.approvalStatus === 'pending' ? '#92400e' : '#166534' }}>
                      {t.approvalStatus || 'flagged'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Circle Accounts */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 12px' }}>Circle Accounts</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
              <th style={{ padding: '8px 4px' }}>Circle</th>
              <th style={{ padding: '8px 4px' }}>Balance</th>
              <th style={{ padding: '8px 4px' }}>Contributions</th>
              <th style={{ padding: '8px 4px' }}>Next Payout</th>
            </tr>
          </thead>
          <tbody>
            {data.circleAccounts.map(ca => (
              <tr key={ca.circleId} style={{ borderBottom: '1px solid #f3f4f6', cursor: 'pointer' }}
                onClick={() => onNavigate?.(`/circles/${ca.circleId}`)}>
                <td style={{ padding: '8px 4px', fontWeight: 500 }}>{ca.circleName}</td>
                <td style={{ padding: '8px 4px' }}>{fmt(ca.accountBalance)}</td>
                <td style={{ padding: '8px 4px' }}>{fmt(ca.contributionsThisCycle)}</td>
                <td style={{ padding: '8px 4px', color: '#666' }}>{ca.nextPayoutDate ? new Date(ca.nextPayoutDate).toLocaleDateString() : '-'}</td>
              </tr>
            ))}
            <tr style={{ fontWeight: 700, borderTop: '2px solid #e5e7eb' }}>
              <td style={{ padding: '8px 4px' }}>Total</td>
              <td style={{ padding: '8px 4px' }}>{fmt(data.circleAccountsTotal)}</td>
              <td colSpan={2} />
            </tr>
          </tbody>
        </table>
      </div>

      {/* AGM Report */}
      <div style={{ textAlign: 'center' }}>
        <button onClick={generateAgm} disabled={generatingAgm}
          style={{ background: '#E63946', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 16, opacity: generatingAgm ? 0.6 : 1 }}>
          {generatingAgm ? 'Generating AGM Report...' : 'Generate AGM Report'}
        </button>
      </div>
    </div>
  )
}
