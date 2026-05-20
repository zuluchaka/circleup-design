export type ProposalStatus = "Voting" | "Discussion" | "Closed";
export type Vote = "yes" | "no" | "abstain";

export type Proposal = {
  id: string;
  title: string;
  body: string;
  status: ProposalStatus;
  endsAt: string;
  quorum: { current: number; required: number };
  votes: { yes: number; no: number; abstain: number };
  yourVote: Vote | null;
  outcome?: "Passed" | "Rejected";
};

export type Candidate = {
  id: string;
  name: string;
  trust: number;
  pitch: string;
  endorsements: number;
};

export type Election = {
  id: string;
  seat: string;
  endsAt: string;
  candidates: Candidate[];
};

export type Committee = {
  id: string;
  name: string;
  chair: string;
  members: string[];
  termEnd: string;
};
