import type { FederationElection, ElectionCandidate } from '../types'

interface ElectionManagerProps {
  elections: FederationElection[]
  candidates: ElectionCandidate[]
  onCreateElection?: () => void
}

const electionStatusStyles = {
  upcoming: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300',
  nomination: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  voting: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
  completed: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400',
}

const typeLabels = {
  president: 'Presidential',
  board: 'Board Election',
  referendum: 'Referendum',
}

export function ElectionManager({ elections, candidates, onCreateElection }: ElectionManagerProps) {
  const activeElections = elections.filter((e) => e.status !== 'completed')
  const completedElections = elections.filter((e) => e.status === 'completed')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">
          Elections & Voting
        </h3>
        <button
          onClick={onCreateElection}
          className="text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Election
        </button>
      </div>

      {/* Active/Upcoming Elections */}
      {activeElections.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Active & Upcoming</p>
          {activeElections.map((election) => (
            <div
              key={election.id}
              className="bg-white dark:bg-slate-800 rounded-xl border border-indigo-200 dark:border-indigo-800/50 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{election.title}</h4>
                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${electionStatusStyles[election.status]}`}>
                      {election.status}
                    </span>
                    <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                      {typeLabels[election.type]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {election.nominationStart && (
                  <>
                    <div className="text-center p-2 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                      <p className="text-[9px] text-slate-500 dark:text-slate-400 uppercase">Nomination Opens</p>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white mt-0.5">
                        {new Date(election.nominationStart).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-center p-2 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                      <p className="text-[9px] text-slate-500 dark:text-slate-400 uppercase">Nomination Closes</p>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white mt-0.5">
                        {new Date(election.nominationEnd!).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </>
                )}
                {election.votingStart && (
                  <>
                    <div className="text-center p-2 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg">
                      <p className="text-[9px] text-indigo-600 dark:text-indigo-400 uppercase">Voting Opens</p>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white mt-0.5">
                        {new Date(election.votingStart).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-center p-2 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg">
                      <p className="text-[9px] text-indigo-600 dark:text-indigo-400 uppercase">Voting Closes</p>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white mt-0.5">
                        {new Date(election.votingEnd!).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-3 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span>{election.eligibleVoters.toLocaleString()} eligible voters</span>
                {election.candidateCount > 0 && <span>{election.candidateCount} candidates</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Completed Elections */}
      {completedElections.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Completed</p>
          {completedElections.map((election) => {
            const electionCandidates = candidates.filter((c) => c.electionId === election.id)

            return (
              <div
                key={election.id}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"
              >
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{election.title}</h4>
                  <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${electionStatusStyles.completed}`}>
                    Completed
                  </span>
                </div>

                {/* Results */}
                {election.results && election.results.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {election.results.map((result) => {
                      const pct = result.totalVotes > 0 ? (result.votes / result.totalVotes * 100) : 0
                      return (
                        <div key={result.position}>
                          <div className="flex items-center justify-between mb-1">
                            <div>
                              <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{result.position}</span>
                              <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">→ {result.winner}</span>
                            </div>
                            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                              {result.votes}/{result.totalVotes} ({pct.toFixed(0)}%)
                            </span>
                          </div>
                          <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Participation */}
                {election.participationRate !== null && (
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span>Participation: <span className="font-bold text-slate-900 dark:text-white">{election.participationRate}%</span></span>
                    <span>{election.eligibleVoters.toLocaleString()} eligible</span>
                  </div>
                )}

                {/* Per-association participation */}
                {election.participationByAssociation && election.participationByAssociation.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase mb-2">By Association</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {election.participationByAssociation.map((assoc) => (
                        <div key={assoc.associationName} className="text-center p-2 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                          <p className="text-[9px] text-slate-500 dark:text-slate-400 truncate">{assoc.associationName}</p>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{assoc.rate}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Candidates */}
                {electionCandidates.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase mb-2">Candidates</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {electionCandidates.map((cand) => (
                        <div key={cand.id} className="flex items-start gap-2 p-2 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                          <img src={cand.photo} alt={cand.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-900 dark:text-white">{cand.name}</p>
                            <p className="text-[9px] text-indigo-600 dark:text-indigo-400">{cand.position}</p>
                            <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{cand.statement}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[8px] text-slate-400">{cand.endorsements} endorsements</span>
                              <span className="text-[8px] text-slate-400">{cand.associationName}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
