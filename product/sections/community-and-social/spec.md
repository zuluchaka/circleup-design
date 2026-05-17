# Community & Social Specification

## Overview

Community & Social is the **engagement & motivation** layer of CircleUp's V1.9 MVP — leaderboards, savings challenges, achievement badges, success stories, and a referral dashboard. The section is designed to celebrate consistent savers, encourage cross-circle participation, and turn satisfied members into advocates via referrals. Engagement metrics from this section feed back into Trust Score and AI Insights.

## User Flows

- **Community & Social Dashboard** — Entry hub: my badges earned, current challenges, leaderboard standing, referral stats, featured success stories.
- **Badge Gallery** — Browse all badges (earned + locked): savings milestones, on-time-payment streaks, circle-completion badges, community contribution badges; tap for unlock criteria.
- **Leaderboard** — Period-scoped leaderboards (weekly / monthly / all-time) across categories (total saved, on-time rate, circles completed, referrals); filter by association/circle scope.
- **Savings Challenges** — Opt-in challenges (52-week challenge, no-spend month, double-contribution sprint) with progress tracking, milestones, badge rewards.
- **Success Stories** — Member-submitted stories of payouts spent meaningfully (business startup, home, education, family event); featured by community moderators.
- **Referral Dashboard** — My referral link, referred-members status, referral rewards (Trust Score boost, badge, tier credit), referral leaderboard.

## UI Requirements

- Adopts Associations stacked-card layout pattern.
- **Community & Social Dashboard**: stats hero (Badges Earned / Active Challenges / Leaderboard Rank / Successful Referrals), featured-story card, recent-activity feed.
- **Badge Gallery**: grid of badge cards (earned in full color, locked in greyscale), category filter chips, click-for-details modal with unlock criteria.
- **Leaderboard**: tabbed period (Week / Month / All-Time), category dropdown, top-10 list with avatar + rank + metric + delta vs. last period; my-rank pinned at top.
- **Savings Challenges**: active-challenges grid with progress rings, join-CTA on inactive challenges, completion celebration animation on finish.
- **Success Stories**: card grid with hero image, member name + circle, story excerpt, "Read more" → detail page; submit-your-story CTA.
- **Referral Dashboard**: stats hero (Total Referred / Active / Rewards Earned), share-link card with copy + WhatsApp + email + SMS, referred-members table with status.

### Mobile & platform
- Mobile-first; leaderboard pins my-rank, challenges use full-bleed progress visuals.
- Referral sharing uses Capacitor native share sheet on mobile.
- Badge unlocks trigger haptic feedback on mobile.

## Configuration

- shell: true
