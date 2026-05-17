# Governance & Voting Specification

## Overview

Governance & Voting is the **democratic decision-making** layer of CircleUp's V1.9 MVP — proposals, elections, committees, voting booths, candidate profiles, and a decision archive that preserves the history of governance actions. Designed for the diverse governance traditions of CircleUp's diaspora associations (one-member-one-vote, weighted-by-share, consensus, council-only), the section is configurable per association via Governance Settings.

V1.9 adds a formal **Election Manager** alongside ad-hoc proposals, integrates with the President onboarding/succession flow in Associations, and exposes votes captured during live meetings (Communication & Events section) into the archive.

## User Flows

- **Governance Dashboard** — Top-level view: active proposals, in-progress elections, recent decisions, action queue for items requiring my vote.
- **Governance Settings** — Configure voting model (one-vote / share-weighted / quorum-based), default proposal duration, who can propose, who can vote, supermajority threshold.
- **Proposal Center** — Browse all proposals (open / closed / archived), filter by category, status, association/circle scope; create new proposal.
- **Voting Booth** — Member-facing voting screen: proposal title + description + options + my-vote-now CTA + anonymous toggle (when allowed by settings); confirmation step with audit-trail entry.
- **Election Manager** — Organizer workflow: define election (role, candidates, voting window, quorum) → nominations → voting → results → confirm-and-publish; integrates with Associations' President Succession.
- **Candidate Profile** — Public profile of a candidate during an election: platform, bio, endorsements, Q&A; "Vote for this candidate" CTA when polls open.
- **Committee Directory** — List of standing committees with members, chair, mandate, contact; cross-links to relevant decisions and policies.
- **Decision Archive** — Searchable archive of all governance decisions: voting outcomes, vote tallies, supporting documents, dissenting opinions; immutable.

## UI Requirements

- Adopts Associations stacked-card layout pattern.
- **Governance Dashboard**: stats hero (Active Proposals / Open Elections / My Pending Votes / Decisions YTD), action queue card, recent-decisions feed.
- **Proposal Center**: filter chips (status / category / scope), proposal cards with vote progress bar, deadline pill, my-vote indicator.
- **Voting Booth**: distraction-minimised single-screen vote experience; clear options, anonymous toggle, confirm modal; mobile-optimised with large tap targets.
- **Election Manager**: 4-step wizard (Define → Nominate → Vote → Results) with progress indicator; live tally during voting; results bar chart on close.
- **Candidate Profile**: hero with avatar, position sought, key dates, sections for platform / bio / endorsements / Q&A.
- **Committee Directory**: stacked committee cards with chair avatar, member count, mandate excerpt, "View" CTA.
- **Decision Archive**: filterable table with date, title, type (proposal/election/motion), outcome chip, tally, "View details" link.

### Mobile & platform
- Voting Booth designed for mobile-first; bottom-pinned "Submit vote" CTA, optional biometric confirmation step on Capacitor.
- Decisions and election results downloadable as PDF via native file-save.

## Configuration

- shell: true
