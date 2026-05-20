export type FeedItem = {
  id: string;
  actor: string;
  verb: string;
  object: string;
  at: string;
};

export type Badge = {
  id: string;
  title: string;
  earned: boolean;
  criterion: string;
};

export type LeaderboardEntry = {
  rank: number;
  name: string;
  value: number;
};

export type ReferralReward = {
  invites: number;
  reward: string;
};

export type ReferralInvite = {
  id: string;
  to: string;
  status: "Sent" | "Joined" | "Expired" | "Pending review";
  at: string;
};

export type Referrals = {
  code: string;
  rewardLadder: ReferralReward[];
  history: ReferralInvite[];
};
