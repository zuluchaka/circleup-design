# AI Insights Specification

## Overview

AI Insights surfaces **machine-learning-driven recommendations and analytics** across CircleUp's V1.9 MVP: an organizer-facing insights dashboard, fraud analytics, a trust-network graph, financial-health conversational assistant, and per-organizer performance insights. The section is the user-facing home of the same AI systems that quietly power Member Risk Scores, Churn Warnings, Circle Recommendations, and AI Config Suggestions elsewhere in the product.

V1.9 treats AI as **explainable, opt-in tooling**: every insight cites the factors that produced it; users can override; recommendations carry confidence scores and explicit "why" sections.

## User Flows

- **AI Insights Dashboard** — Top-level hub: prioritized insights (at-risk circles, dues-collection opportunities, member-engagement risks, EF early-warning), each with severity, factor breakdown, recommended action.
- **Fraud Analytics** — Cross-circle fraud signals: duplicate-identity flags, payment-method recycling, off-platform-payment anomalies, organizer-collusion patterns; actionable cards with "Investigate" CTA.
- **Trust Network** — Force-directed graph of member trust relationships across circles and associations: nodes = members, edges = mutual-circle co-membership; color by Trust Score; clusters by community.
- **Financial Health Chat** — Conversational assistant: ask natural-language questions about member finances, circle health, association compliance ("Which members are likely to default next cycle?", "What's the collection rate for circles started in 2025?"); answers cite sources and confidence.
- **Organizer Insights** — Per-organizer scorecard: collection rate trend vs. benchmark, dispute-load, member-satisfaction signals, peer comparison, suggested improvements.

## UI Requirements

- Adopts Associations stacked-card layout pattern.
- **AI Insights Dashboard**: severity-color insight cards with factor breakdown chips, confidence pill, action CTAs; filter chips for type / severity / scope.
- **Fraud Analytics**: alert cards with risk score, signal type, affected entities, "Investigate" deep-link to platform-administration.
- **Trust Network**: full-screen interactive graph (zoom/pan), legend, node detail panel on click; performance-optimised for 500+ nodes.
- **Financial Health Chat**: chat UI with assistant + user bubbles, source-citation chips inline, "View underlying data" link per answer; conversation history.
- **Organizer Insights**: scorecard hero with composite score, factor sparklines, benchmark comparison bars, recommendation list.

### Mobile & platform
- Mobile: AI Insights Dashboard and Organizer Insights work well; Trust Network and Financial Health Chat are full-screen experiences with mobile-tuned controls.
- All insights respect user-controlled opt-in / opt-out preferences (set in personal profile / notification preferences).

### Explainability
- Every insight has a visible factor breakdown and confidence score.
- "Why did I get this insight?" link opens the explainability panel with the contributing data points and weights.
- AI-derived actions never auto-execute; they always require user confirmation.

## Configuration

- shell: true
