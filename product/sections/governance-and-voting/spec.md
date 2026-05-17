# Governance & Voting

Elections, proposals, committees, and flexible decision-making models that accommodate different cultural governance traditions.

---

## Shell Configuration

- **Display Mode:** Inside App Shell
- **Navigation Label:** Governance
- **Icon Suggestion:** Vote (ballot/checkmark icon)

---

## Overview

The Governance & Voting section enables associations and circles to manage democratic decision-making through elections, proposals, and committees. It supports multiple voting models (majority, supermajority, consensus, weighted) to accommodate different cultural governance traditions, from formal parliamentary procedures to consensus-based community decisions.

This section serves multiple user roles:
- **Association Admins** configuring governance rules and managing elections
- **Members** voting on proposals, participating in elections, and serving on committees
- **Committee Chairs** managing committee activities and recommendations
- **Candidates** running for elected positions

---

## Screen Designs

### 1. Governance Dashboard

**Purpose:** Central hub showing all governance activity across the user's associations and circles.

**Key Elements:**
- Active elections with voting deadline countdown
- Pending proposals requiring votes
- Committee activity summary
- Upcoming governance events calendar
- Quick actions: Vote Now, Submit Proposal, View Results
- Governance health indicators (participation rates, quorum status)

**User Story Reference:** US-G.3, US-G.8

---

### 2. Election Manager

**Purpose:** Create, configure, and manage elections for leadership positions.

**Key Elements:**
- Election creation wizard (position, dates, eligibility criteria)
- Candidate nomination workflow (self-nomination or admin-nominated)
- Voting period configuration (start/end dates, early voting)
- Real-time vote tally (visible or hidden until close)
- Results announcement with winner declaration
- Runoff election trigger for ties
- Election status badges (Upcoming, Active, Closed, Certified)

**User Story Reference:** US-G.1, US-G.7

---

### 3. Proposal Center

**Purpose:** Submit, discuss, and track proposals through their lifecycle.

**Key Elements:**
- Proposal submission form (title, description, category, attachments)
- Discussion thread per proposal
- Amendment submission workflow
- Voting status progress bar
- Sponsor and co-sponsor display
- Proposal lifecycle stages (Draft, Under Review, Voting, Passed, Rejected, Implemented)
- Filter by status, category, or author

**User Story Reference:** US-G.2, US-G.3

---

### 4. Voting Booth

**Purpose:** Secure interface for casting votes on elections and proposals.

**Key Elements:**
- Ballot preview with all options
- Candidate/option comparison view
- Vote confirmation screen with review
- Receipt generation (anonymized for ballot secrecy)
- Change vote option (if allowed by rules)
- Abstain option with optional reason
- Accessibility features (screen reader support, high contrast)

**User Story Reference:** US-G.3

---

### 5. Committee Directory

**Purpose:** Browse and manage committees within associations.

**Key Elements:**
- Committee cards with name, purpose, and member count
- Committee detail view with member roster
- Chair and vice-chair designation
- Committee meeting schedule
- Documents and reports produced by committee
- Join request workflow (for open committees)
- Committee creation form (for admins)

**User Story Reference:** US-G.5

---

### 6. Governance Settings

**Purpose:** Configure voting rules, quorum requirements, and governance preferences.

**Key Elements:**
- Voting model selector (Simple Majority, Supermajority, Consensus, Weighted)
- Quorum percentage configuration
- Voting period duration defaults
- Term limit settings for elected positions
- Proxy voting enable/disable
- Secret vs. open ballot configuration
- Cultural governance presets (Parliamentary, Consensus-based, Elder Council)
- Notification timing preferences

**User Story Reference:** US-G.4

---

### 7. Decision Archive

**Purpose:** Historical record of all governance decisions for transparency and reference.

**Key Elements:**
- Searchable archive of past elections and proposals
- Filter by date range, type, outcome
- Detailed result breakdowns (vote counts, participation)
- Document attachments from decisions
- Export options (PDF, CSV)
- Timeline view of governance history
- Impact tracking (link decisions to implemented changes)

**User Story Reference:** US-G.6

---

### 8. Candidate Profile

**Purpose:** Campaign page for members running in elections.

**Key Elements:**
- Candidate photo and bio
- Platform statement / campaign promises
- Endorsements from other members
- Q&A section for member questions
- Previous positions held
- Participation history in the association
- Social sharing for campaign

**User Story Reference:** US-G.7

---

## Data Entities

This section primarily interacts with:

- **Election** — A voting event for one or more positions with candidates and voting period
- **Position** — A role within the association (President, Treasurer, Secretary, etc.)
- **Candidate** — A member nominated or self-nominated for an election
- **Proposal** — A motion submitted by members for community decision
- **Vote** — An individual ballot cast on an election or proposal
- **Committee** — A sub-group with specific responsibilities and members
- **CommitteeMember** — Assignment of a member to a committee with role
- **GovernanceSettings** — Configuration for voting rules per circle/association
- **Decision** — Archived record of a completed election or proposal outcome

---

## Interactions & Flows

### Create and Run an Election
1. Admin opens Election Manager
2. Creates new election with position(s) to fill
3. Sets nomination period and voting period dates
4. Configures eligibility criteria and voting rules
5. Opens nominations
6. Candidates submit profiles during nomination period
7. Admin reviews and approves candidates (if required)
8. Voting period begins, members receive notifications
9. Members cast votes in Voting Booth
10. Election closes, results calculated
11. Winners announced, positions updated

### Submit and Vote on a Proposal
1. Member opens Proposal Center
2. Clicks "Submit Proposal"
3. Fills in proposal details with supporting documents
4. Submits for review (if moderation enabled) or directly to voting
5. Discussion period allows member comments and amendments
6. Voting period begins
7. Members receive notification and cast votes
8. Quorum and approval threshold checked
9. Proposal marked Passed or Rejected
10. If passed, linked to implementation tracking

### Configure Governance Rules
1. Admin opens Governance Settings
2. Selects voting model appropriate for culture
3. Sets quorum requirements
4. Configures term limits and proxy voting
5. Saves settings
6. Settings apply to all future elections and proposals

### Join a Committee
1. Member opens Committee Directory
2. Browses available committees
3. Finds committee of interest
4. Clicks "Request to Join"
5. Committee chair receives notification
6. Chair approves or denies request
7. Member added to committee roster

---

## States & Edge Cases

- **No Active Votes:** Show encouraging message to check back, display past decisions
- **Quorum Not Met:** Extend voting period or mark as failed with clear indication
- **Tie in Election:** Trigger automatic runoff or use configured tiebreaker
- **Candidate Withdrawal:** Remove from ballot, notify voters who selected them
- **Proxy Voting:** Show clear indication when voting on behalf of another
- **Voting Deadline Approaching:** Prominent countdown and reminder notifications
- **Already Voted:** Show confirmation and disable re-voting (unless change allowed)
- **Ineligible to Vote:** Clear message explaining why (not a member, not verified, etc.)

---

## Accessibility Notes

- All voting interfaces support keyboard navigation
- Screen reader announcements for vote confirmation
- High contrast mode for ballot visibility
- Clear visual distinction between selected and unselected options
- Timer announcements for voting deadlines
- Alternative text for candidate photos

---

## Design Considerations

- Prioritize vote privacy — never reveal individual votes in secret ballots
- Show real-time participation rates to encourage turnout
- Use culturally neutral icons (avoid partisan symbols)
- Support multiple languages for ballot text
- Mobile-friendly voting interface for on-the-go participation
- Clear visual feedback on successful vote submission
- Consider offline voting queue for poor connectivity (sync when online)
