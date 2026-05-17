# Multi-Share Specification

## Overview

Multi-Share lets a member hold **more than one share** in a circle — contributing N × the base amount and receiving N × the payout (or N separate payout positions, configurable per circle). V1.9 elevates Multi-Share from a hidden config flag into a first-class member-facing feature: share requests, organizer approval, share history, per-share contribution payment, and platform-admin oversight.

## User Flows

- **Circle Dashboard (Multi-Share)** — Per-circle view of all members and their share counts; total shares vs. max shares per member; share-request inbox for organizer.
- **Share Request Modal** — Member requests N additional shares with reason; organizer reviews and approves/denies.
- **Personal Share Summary** — Member's view of shares held across all circles: current count, contribution per cycle, expected payout positions, share-history timeline.
- **Share History Timeline** — Chronological list of every share change for a member: requested, approved, denied, transferred, reduced; with timestamps and reason.
- **Contribution Payment (Multi-Share)** — Pay for N shares in a single transaction; per-share breakdown displayed before confirmation.
- **Platform Admin Dashboard (Multi-Share)** — Cross-circle stats: total circles with multi-share enabled, average shares per member, flagged anomalies (one member holding >50% of shares, rapid share-request churn).

## UI Requirements

- Adopts Associations stacked-card layout pattern.
- **Circle Dashboard (Multi-Share)**: stats hero (Total Shares / Members / Max per Member / Open Requests), member table with shares column and inline +/- buttons (organizer only), request inbox card.
- **Share Request Modal**: form with current shares + requested change + reason + impact preview (new contribution, new payout count); approve/deny actions for organizer.
- **Personal Share Summary**: per-circle cards with share count, contribution/cycle, expected payouts; aggregate stats at top.
- **Share History Timeline**: vertical timeline with event type icons, color-coded by direction (increase / decrease), reason text.
- **Contribution Payment**: standard payment flow with extra "per-share breakdown" panel (N shares × CHF X = CHF total).
- **Platform Admin Dashboard**: cross-circle stats hero, anomaly alerts feed, drill-down to specific circles.

### Mobile & platform
- Mobile-first; share-request modal collapses to bottom sheet.
- Payment flow uses Stripe Elements with Twint when association is Swiss + CHF + Stripe-enabled.

## Configuration

- shell: true
