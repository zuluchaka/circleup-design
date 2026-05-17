import puppeteer from 'puppeteer';
import { writeFileSync } from 'fs';

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700&family=IBM+Plex+Mono:wght@400;500&display=swap');

  :root {
    --primary: #4f46e5;
    --primary-light: #eef2ff;
    --p0: #dc2626;
    --p0-bg: #fef2f2;
    --p1: #d97706;
    --p1-bg: #fffbeb;
    --p2: #2563eb;
    --p2-bg: #eff6ff;
    --border: #e5e7eb;
    --text: #1f2937;
    --text-secondary: #6b7280;
    --bg-subtle: #f9fafb;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 10pt;
    line-height: 1.5;
    color: var(--text);
    padding: 0;
  }

  .cover {
    page-break-after: always;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    color: white;
    text-align: center;
    padding: 60px;
  }

  .cover h1 {
    font-size: 42pt;
    font-weight: 700;
    margin-bottom: 12px;
    letter-spacing: -1px;
  }

  .cover .subtitle {
    font-size: 18pt;
    font-weight: 400;
    opacity: 0.9;
    margin-bottom: 40px;
  }

  .cover .meta {
    font-size: 11pt;
    opacity: 0.7;
    margin-top: 60px;
  }

  .cover .stats {
    display: flex;
    gap: 48px;
    margin-top: 40px;
  }

  .cover .stat-box {
    text-align: center;
  }

  .cover .stat-number {
    font-size: 36pt;
    font-weight: 700;
  }

  .cover .stat-label {
    font-size: 10pt;
    opacity: 0.8;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .toc {
    page-break-after: always;
    padding: 48px 60px;
  }

  .toc h2 {
    font-size: 22pt;
    font-weight: 700;
    color: var(--primary);
    margin-bottom: 24px;
    padding-bottom: 12px;
    border-bottom: 2px solid var(--primary);
  }

  .toc-item {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 8px 0;
    border-bottom: 1px dotted var(--border);
    font-size: 11pt;
  }

  .toc-item .num {
    font-weight: 600;
    color: var(--primary);
    margin-right: 8px;
    min-width: 24px;
  }

  .toc-item .count {
    color: var(--text-secondary);
    font-size: 9pt;
    font-family: 'IBM Plex Mono', monospace;
  }

  .content {
    padding: 36px 60px;
  }

  .feature-section {
    page-break-before: always;
  }

  .feature-section:first-child {
    page-break-before: auto;
  }

  .feature-header {
    background: linear-gradient(135deg, var(--primary-light) 0%, #f5f3ff 100%);
    border-left: 4px solid var(--primary);
    padding: 20px 24px;
    margin-bottom: 24px;
    border-radius: 0 8px 8px 0;
  }

  .feature-header h2 {
    font-size: 18pt;
    font-weight: 700;
    color: var(--primary);
    margin-bottom: 6px;
  }

  .feature-header .feature-desc {
    color: var(--text-secondary);
    font-size: 10pt;
  }

  .epic-block {
    margin-bottom: 28px;
    break-inside: avoid;
  }

  .epic-title {
    font-size: 12pt;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 12px;
    padding: 8px 12px;
    background: var(--bg-subtle);
    border-radius: 6px;
    border: 1px solid var(--border);
  }

  .story-card {
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 12px 16px;
    margin-bottom: 8px;
    break-inside: avoid;
    background: white;
  }

  .story-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 6px;
    gap: 12px;
  }

  .story-id {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 8.5pt;
    font-weight: 500;
    color: var(--primary);
    white-space: nowrap;
    background: var(--primary-light);
    padding: 1px 6px;
    border-radius: 3px;
    flex-shrink: 0;
  }

  .story-title {
    font-weight: 600;
    font-size: 10pt;
    flex: 1;
  }

  .priority {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 8pt;
    font-weight: 500;
    padding: 1px 8px;
    border-radius: 10px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .priority-p0 { background: var(--p0-bg); color: var(--p0); }
  .priority-p1 { background: var(--p1-bg); color: var(--p1); }
  .priority-p2 { background: var(--p2-bg); color: var(--p2); }

  .story-description {
    font-size: 9pt;
    color: var(--text-secondary);
    line-height: 1.5;
    margin-top: 4px;
    padding-left: 0;
  }

  .story-meta {
    display: flex;
    gap: 16px;
    margin-top: 6px;
    font-size: 8pt;
    color: var(--text-secondary);
  }

  .story-meta span {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .meta-label {
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-size: 7.5pt;
  }

  .summary-page {
    page-break-before: always;
    padding: 48px 60px;
  }

  .summary-page h2 {
    font-size: 18pt;
    font-weight: 700;
    color: var(--primary);
    margin-bottom: 24px;
  }

  .summary-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 9.5pt;
  }

  .summary-table th {
    background: var(--primary);
    color: white;
    padding: 10px 16px;
    text-align: left;
    font-weight: 600;
  }

  .summary-table td {
    padding: 8px 16px;
    border-bottom: 1px solid var(--border);
  }

  .summary-table tr:nth-child(even) td {
    background: var(--bg-subtle);
  }

  .summary-table .total-row td {
    font-weight: 700;
    background: var(--primary-light);
    border-top: 2px solid var(--primary);
  }

  .priority-legend {
    display: flex;
    gap: 24px;
    margin: 20px 0;
    font-size: 9pt;
  }

  .priority-legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  @media print {
    .feature-section { page-break-before: always; }
    .story-card { break-inside: avoid; }
    .epic-block { break-inside: avoid; }
  }
</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="cover">
  <h1>CircleUp</h1>
  <div class="subtitle">Features, Epics & User Stories</div>
  <div class="stats">
    <div class="stat-box">
      <div class="stat-number">17</div>
      <div class="stat-label">Features</div>
    </div>
    <div class="stat-box">
      <div class="stat-number">118</div>
      <div class="stat-label">Epics</div>
    </div>
    <div class="stat-box">
      <div class="stat-number">381</div>
      <div class="stat-label">User Stories</div>
    </div>
  </div>
  <div class="meta">
    Complete Product Backlog &mdash; Generated February 18, 2026<br>
    AI-Powered Association Management & ROSCA Platform
  </div>
</div>

<!-- TABLE OF CONTENTS -->
<div class="toc">
  <h2>Table of Contents</h2>
  <div class="toc-item"><span><span class="num">1</span> Homepage & Landing</span><span class="count">9 epics &middot; 28 stories</span></div>
  <div class="toc-item"><span><span class="num">2</span> Authentication & Onboarding</span><span class="count">7 epics &middot; 20 stories</span></div>
  <div class="toc-item"><span><span class="num">3</span> Associations</span><span class="count">5 epics &middot; 14 stories</span></div>
  <div class="toc-item"><span><span class="num">4</span> Members & Trust</span><span class="count">5 epics &middot; 13 stories</span></div>
  <div class="toc-item"><span><span class="num">5</span> ROSCA Circles</span><span class="count">9 epics &middot; 32 stories</span></div>
  <div class="toc-item"><span><span class="num">6</span> Treasury & Funds</span><span class="count">8 epics &middot; 24 stories</span></div>
  <div class="toc-item"><span><span class="num">7</span> Credit & Lending</span><span class="count">6 epics &middot; 19 stories</span></div>
  <div class="toc-item"><span><span class="num">8</span> Multi-Share</span><span class="count">7 epics &middot; 51 stories</span></div>
  <div class="toc-item"><span><span class="num">9</span> Governance & Voting</span><span class="count">8 epics &middot; 25 stories</span></div>
  <div class="toc-item"><span><span class="num">10</span> Communication & Events</span><span class="count">8 epics &middot; 22 stories</span></div>
  <div class="toc-item"><span><span class="num">11</span> Documents</span><span class="count">6 epics &middot; 16 stories</span></div>
  <div class="toc-item"><span><span class="num">12</span> Projects & Fundraising</span><span class="count">5 epics &middot; 15 stories</span></div>
  <div class="toc-item"><span><span class="num">13</span> Community & Social</span><span class="count">8 epics &middot; 24 stories</span></div>
  <div class="toc-item"><span><span class="num">14</span> Analytics & Reporting</span><span class="count">7 epics &middot; 18 stories</span></div>
  <div class="toc-item"><span><span class="num">15</span> AI Insights</span><span class="count">3 epics &middot; 17 stories</span></div>
  <div class="toc-item"><span><span class="num">16</span> Federations</span><span class="count">8 epics &middot; 27 stories</span></div>
  <div class="toc-item"><span><span class="num">17</span> Platform Administration</span><span class="count">4 epics &middot; 36 stories</span></div>

  <div class="priority-legend" style="margin-top: 32px;">
    <div class="priority-legend-item"><span class="priority priority-p0">P0</span> Must-have (launch blocker)</div>
    <div class="priority-legend-item"><span class="priority priority-p1">P1</span> Should-have (high value)</div>
    <div class="priority-legend-item"><span class="priority priority-p2">P2</span> Nice-to-have (future phase)</div>
  </div>
</div>

<!-- CONTENT -->
<div class="content">

<!-- ==================== SECTION 1: HOMEPAGE ==================== -->
<div class="feature-section">
<div class="feature-header">
  <h2>1. Homepage & Landing</h2>
  <div class="feature-desc">Public-facing landing page for platform discovery, ROSCA education, and user conversion. Serves as the primary acquisition funnel for both individual savers and community organizers across diaspora communities worldwide.</div>
</div>

<div class="epic-block">
<div class="epic-title">Epic 1.1: Platform Discovery & Value Proposition</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">1.1.1</span>
    <span class="story-title">Hero Section with Value Proposition</span>
    <span class="priority priority-p0">P0</span>
  </div>
  <div class="story-description">As a visitor, I want to see a hero section with a clear value proposition and dual CTAs (Start Free Trial, Watch Demo) so I understand what CircleUp offers. The hero should feature a gradient background with an animated illustration of the ROSCA cycle. The headline communicates the core promise: "Modern Tools for Traditional Savings." Both CTAs are prominent — the primary button leads to registration, the secondary opens a 2-minute product video in a modal overlay. Trust badges (Bank-Level Encryption, Swiss Compliant, FINMA Regulated) appear below the fold line.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Visitor</span><span><span class="meta-label">Screen:</span> Landing Hero</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">1.1.2</span>
    <span class="story-title">Trust & Security Badges</span>
    <span class="priority priority-p0">P0</span>
  </div>
  <div class="story-description">As a visitor, I want to see trust badges (Bank-Level Encryption, Swiss Compliant, PCI-DSS) so I feel confident in the platform's security. Badges are displayed in a horizontal row beneath the hero section with subtle hover tooltips explaining each certification. Includes AES-256 encryption, two-factor authentication, PCI-DSS compliance for payment processing, and FINMA/FADP/GDPR regulatory compliance indicators. The badges use muted, professional iconography and link to relevant certification documentation.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Visitor</span><span><span class="meta-label">Screen:</span> Trust Section</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">1.1.3</span>
    <span class="story-title">How It Works Flow</span>
    <span class="priority priority-p0">P0</span>
  </div>
  <div class="story-description">As a visitor, I want to see a "How It Works" flow (Join → Contribute → Payout) so I understand the ROSCA process. Presented as a 3-step horizontal process with numbered icons and brief descriptions. Step 1: Join a Circle — find or create a savings group. Step 2: Contribute — make regular payments via card, bank transfer, or mobile wallet. Step 3: Receive Payout — get your lump sum when it's your turn. Each step has a subtle animation that triggers on scroll. A "Learn More" link below opens the interactive circle lifecycle guide.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Visitor</span><span><span class="meta-label">Screen:</span> Process Section</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">1.1.4</span>
    <span class="story-title">AI Savings Goal Calculator</span>
    <span class="priority priority-p1">P1</span>
  </div>
  <div class="story-description">As a visitor, I want to use an AI Savings Goal Calculator so I can estimate potential savings outcomes. Interactive calculator with sliders for monthly contribution amount (CHF 50–5,000), circle size (5–20 members), and duration (3–24 months). Displays projected total savings, estimated payout date, and comparison against traditional individual savings. Shows a visual timeline of contributions and payout date. Results can be shared or saved by entering an email address (which also captures the lead).</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Visitor</span><span><span class="meta-label">Screen:</span> Calculator Widget</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">1.1.5</span>
    <span class="story-title">Live Activity Feed</span>
    <span class="priority priority-p2">P2</span>
  </div>
  <div class="story-description">As a visitor, I want to see a live activity feed of platform events so I can gauge platform activity. A ticker-style feed showing anonymized recent activity: "A member in Zurich just received a CHF 5,000 payout," "New circle formed in Geneva with 12 members," "Community saved CHF 25,000 this week." Updates every 30 seconds. Events are real but anonymized for privacy. Feed items have subtle entrance animations and cycle through the most recent 20 events.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Visitor</span><span><span class="meta-label">Screen:</span> Activity Feed Widget</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">1.1.6</span>
    <span class="story-title">Animated Platform Statistics</span>
    <span class="priority priority-p1">P1</span>
  </div>
  <div class="story-description">As a visitor, I want to see animated platform statistics counters (total saved, families helped) so I understand community impact. The Community Impact Dashboard displays four key metrics: Total Saved (cumulative CHF), Families Helped, Circles Completed, and Active Communities. Each counter animates from zero to the current value on scroll-into-view using a smooth counting animation. Numbers format with locale-appropriate separators. Data refreshes from a public API endpoint daily.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Visitor</span><span><span class="meta-label">Screen:</span> Stats Section</span></div>
</div>
</div>

<div class="epic-block">
<div class="epic-title">Epic 1.2: ROSCA Education & Cultural Context</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">1.2.1</span>
    <span class="story-title">Cultural Name References</span>
    <span class="priority priority-p0">P0</span>
  </div>
  <div class="story-description">As a visitor, I want to see cultural name references (tontine, chit fund, tandas, susu) so I recognize my community's savings tradition. A section titled "Known by Many Names, Trusted by Millions" displays a world map or grid of cultural terms: Tontine (West/Central Africa, France), Chit Fund (India), Tandas (Latin America), Susu (West Africa, Caribbean), Paluwagan (Philippines), Gameya (Egypt), Hui (China/Vietnam), Stokvel (South Africa). Each term links to a brief explainer. The visitor's detected language highlights the most relevant cultural term.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Visitor</span><span><span class="meta-label">Screen:</span> Cultural Section</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">1.2.2</span>
    <span class="story-title">Interactive Circle Lifecycle Guide</span>
    <span class="priority priority-p1">P1</span>
  </div>
  <div class="story-description">As a visitor, I want an interactive circle lifecycle guide so I understand how circles work step by step. A multi-step interactive walkthrough showing the complete lifecycle: Formation (organizer creates, members join) → Active Cycles (contributions collected each period) → Payout Rotation (one member receives the pool each cycle) → Completion (all members have received their payout). Each step has an animated diagram, example amounts, and a "What happens if someone misses a payment?" FAQ link. Users can click through at their own pace or watch it auto-play.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Visitor</span><span><span class="meta-label">Screen:</span> Lifecycle Guide</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">1.2.3</span>
    <span class="story-title">Traditional vs CircleUp Comparison</span>
    <span class="priority priority-p0">P0</span>
  </div>
  <div class="story-description">As a visitor, I want to see a comparison table (Traditional ROSCA vs CircleUp) so I understand the platform's advantages. A two-column comparison table covering: Record Keeping (paper/spreadsheet vs. automated digital), Payment Collection (cash/manual vs. automated Stripe), Trust Verification (word-of-mouth vs. AI Trust Score), Default Protection (none vs. Emergency Fund), Transparency (limited vs. real-time dashboards), Multi-language (local only vs. EN/FR/DE/IT/PT), and Accessibility (in-person only vs. anywhere, anytime). CircleUp advantages are highlighted with checkmark icons.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Visitor</span><span><span class="meta-label">Screen:</span> Comparison Table</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">1.2.4</span>
    <span class="story-title">Cultural Community Showcase</span>
    <span class="priority priority-p1">P1</span>
  </div>
  <div class="story-description">As a visitor, I want to see a Cultural Community Showcase (West African, Latin American, South Asian) so I feel represented. Carousel or grid of community profiles showing how different cultural communities use CircleUp. Each profile includes: community photo, cultural savings term, typical circle size and frequency, a member testimonial quote, and a brief description of how the community adapted CircleUp to their traditions. Cycles through 5–8 community profiles with smooth transitions.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Visitor</span><span><span class="meta-label">Screen:</span> Community Showcase</span></div>
</div>
</div>

<div class="epic-block">
<div class="epic-title">Epic 1.3: Persona-Based Qualification</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">1.3.1</span>
    <span class="story-title">Member vs Organizer Path Selection</span>
    <span class="priority priority-p1">P1</span>
  </div>
  <div class="story-description">As a visitor, I want to choose between member and organizer paths so I get relevant information for my role. A split-screen section: "I Want to Save" (member path) on the left and "I Want to Organize" (organizer path) on the right. Each path shows tailored benefits, features, and a CTA. A "Not Sure? Take Our Quiz" option in the center. The member path emphasizes savings outcomes, payout schedules, and trust protection. The organizer path highlights management tools, analytics, and community building. Selecting a path personalizes the rest of the landing page content.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Visitor</span><span><span class="meta-label">Screen:</span> Persona Split</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">1.3.2</span>
    <span class="story-title">Savings Goal Planner</span>
    <span class="priority priority-p1">P1</span>
  </div>
  <div class="story-description">As a prospective member, I want a Savings Goal Planner tool so I can model my savings journey. An interactive tool where users enter their savings goal (e.g., CHF 10,000 for a car), monthly budget for savings, and preferred timeline. The planner recommends optimal circle configurations: ideal contribution amount, circle size, and frequency to reach the goal. Shows a visual savings timeline comparing solo savings vs. ROSCA (demonstrating earlier access to lump sum). Provides a "Find Matching Circles" CTA if the user registers.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Prospective Member</span><span><span class="meta-label">Screen:</span> Goal Planner Widget</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">1.3.3</span>
    <span class="story-title">Circle Size Calculator</span>
    <span class="priority priority-p1">P1</span>
  </div>
  <div class="story-description">As a prospective organizer, I want a Circle Size Calculator so I can plan my first circle. An interactive calculator for organizers: input the target payout amount, contribution frequency, and community size. Calculates the optimal number of members, individual contribution per cycle, total circle duration, and platform fees. Includes tips for circle configuration (recommended minimum Trust Score, suggested grace periods). Shows the total pool per cycle and estimated Emergency Fund accumulation. CTA: "Create Your First Circle."</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Prospective Organizer</span><span><span class="meta-label">Screen:</span> Size Calculator Widget</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">1.3.4</span>
    <span class="story-title">Try Before You Sign Up Sandbox</span>
    <span class="priority priority-p2">P2</span>
  </div>
  <div class="story-description">As a visitor, I want a "Try Before You Sign Up" sandbox so I can experience the platform risk-free. An embedded interactive demo environment with simulated data: browse sample associations, explore a mock circle (Zurich Savings Circle), view a simulated member dashboard with contribution history and payout schedule. All actions are clearly labeled as "Demo Mode." After exploring, a persistent banner invites the user to create a real account. Demo data resets per session. Accessible without registration.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Visitor</span><span><span class="meta-label">Screen:</span> Sandbox Environment</span></div>
</div>
</div>

<div class="epic-block">
<div class="epic-title">Epic 1.4: Interactive Readiness Assessment</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">1.4.1</span>
    <span class="story-title">Member Readiness Quiz</span>
    <span class="priority priority-p2">P2</span>
  </div>
  <div class="story-description">As a visitor, I want to take a Member Readiness quiz (~10 scenario-based questions) so I know if I'm ready to join a circle. A guided quiz with scenario-based questions: "How would you handle a month when money is tight?" (options: skip payment / use Emergency Fund / pay partial / ask for help). Covers financial discipline, understanding of obligations, trust expectations, and commitment level. Each answer is scored and contributes to an overall readiness rating. Progress bar shows completion percentage.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Visitor</span><span><span class="meta-label">Screen:</span> Quiz Interface</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">1.4.2</span>
    <span class="story-title">Organizer Readiness Quiz</span>
    <span class="priority priority-p2">P2</span>
  </div>
  <div class="story-description">As a visitor, I want to take an Organizer Readiness quiz so I know if I'm ready to run a circle. Similar to the member quiz but focused on leadership and management skills: conflict resolution scenarios, payment collection strategies, member screening approaches, communication frequency preferences. Tests understanding of organizer responsibilities including handling defaults, managing disputes, and maintaining transparency. Approximately 10 questions with scenario-based answers.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Visitor</span><span><span class="meta-label">Screen:</span> Quiz Interface</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">1.4.3</span>
    <span class="story-title">Quiz Feedback & Scoring</span>
    <span class="priority priority-p2">P2</span>
  </div>
  <div class="story-description">As a visitor, I want instant feedback per quiz answer and a final score with qualitative rating so I understand my preparedness. After each answer, a brief explanation of the best approach is shown (educational moment). Final results page shows an overall score with qualitative rating: "ROSCA Pro" (85–100%), "Ready to Join" (65–84%), or "Learning Mode" (below 65%). Each rating includes specific recommendations: ROSCA Pro gets a direct "Join Now" CTA; Ready to Join gets suggested resources; Learning Mode gets links to educational content and the lifecycle guide.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Visitor</span><span><span class="meta-label">Screen:</span> Results Page</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">1.4.4</span>
    <span class="story-title">Share Quiz Results</span>
    <span class="priority priority-p2">P2</span>
  </div>
  <div class="story-description">As a visitor, I want to share my quiz results or restart the quiz. Results page includes social sharing buttons (WhatsApp, Facebook, Twitter, copy link) with a pre-formatted message: "I scored [X]% on the CircleUp Readiness Quiz! Are you ready to start your savings journey?" Also includes a "Retake Quiz" button and a "Challenge a Friend" option that generates a shareable quiz link with referral tracking. Shared links include the referrer's score as a benchmark.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Visitor</span><span><span class="meta-label">Screen:</span> Results Page</span></div>
</div>
</div>

<div class="epic-block">
<div class="epic-title">Epic 1.5: Pricing & Fee Transparency</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">1.5.1</span>
    <span class="story-title">Pricing Tier Table</span>
    <span class="priority priority-p0">P0</span>
  </div>
  <div class="story-description">As a visitor, I want to see a pricing tier table (Free, Basic CHF 29/mo, Pro CHF 99/mo, Enterprise) so I can choose the right plan. Four-column pricing table with feature comparison rows. Free tier: 1 circle, up to 10 members, basic analytics. Basic (CHF 29/mo): unlimited circles, up to 50 members per circle, advanced analytics, multi-currency. Pro (CHF 99/mo): unlimited everything, AI insights, credit features, priority support. Enterprise: custom pricing, SLA, dedicated support, FINMA compliance package. The recommended tier is highlighted. Annual billing discount shown (save 20%).</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Visitor</span><span><span class="meta-label">Screen:</span> Pricing Section</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">1.5.2</span>
    <span class="story-title">Fee Breakdown & Transparency</span>
    <span class="priority priority-p0">P0</span>
  </div>
  <div class="story-description">As a visitor, I want to see a fee breakdown (subscription, platform %, late fees, Emergency Fund 1%) so I understand all costs. A clear, tabular breakdown: Subscription Fee (per plan), Platform Transaction Fee (~1.5% per contribution), Late Payment Fee (configurable by organizer, max 5%), Emergency Fund Allocation (1% of each contribution — returned if unused), and Payment Processing (Stripe fees passed through). Each fee has an explanatory tooltip. Emphasizes "No hidden fees" with a comparison to traditional banking alternatives.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Visitor</span><span><span class="meta-label">Screen:</span> Fee Section</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">1.5.3</span>
    <span class="story-title">Cost Calculator</span>
    <span class="priority priority-p1">P1</span>
  </div>
  <div class="story-description">As a visitor, I want a Cost Calculator so I can estimate my total costs based on my circle parameters. Interactive calculator: input contribution amount, circle size, frequency, and duration. Outputs total platform fees, Emergency Fund allocation, Stripe processing fees, and net contribution to circle pool. Shows a comparison: "Your effective cost: CHF X.XX per month" vs. "Bank transfer fees for the same amount: CHF Y.YY." Dynamically recommends the most cost-effective pricing tier based on inputs.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Visitor</span><span><span class="meta-label">Screen:</span> Calculator Widget</span></div>
</div>
</div>

<div class="epic-block">
<div class="epic-title">Epic 1.6: Support & Communication</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">1.6.1</span>
    <span class="story-title">Live Chat Support</span>
    <span class="priority priority-p1">P1</span>
  </div>
  <div class="story-description">As a visitor, I want live chat support (2-min response target) so I can get immediate help. A floating chat widget in the bottom-right corner available on all landing pages. Opens to a chat interface with an AI-powered first response that attempts to answer common questions, with seamless escalation to a human agent. Shows estimated wait time. Supports the visitor's detected language. Chat history persists during the session. Outside business hours, offers to take a message with email follow-up within 24 hours.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Visitor</span><span><span class="meta-label">Screen:</span> Chat Widget</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">1.6.2</span>
    <span class="story-title">Contact Form</span>
    <span class="priority priority-p0">P0</span>
  </div>
  <div class="story-description">As a visitor, I want a Contact Form so I can submit inquiries. A simple form with fields: Name, Email, Subject (dropdown: General Inquiry / Partnership / Press / Support / Enterprise Sales), Message, and optional phone number. Form validation is inline and real-time. Submission triggers an auto-acknowledgment email with ticket number. Submissions are routed to the appropriate team based on subject. Anti-spam protection via honeypot field (no CAPTCHA for better UX). Confirmation page thanks the user and sets response time expectations.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Visitor</span><span><span class="meta-label">Screen:</span> Contact Page</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">1.6.3</span>
    <span class="story-title">Demo Booking Calendar</span>
    <span class="priority priority-p1">P1</span>
  </div>
  <div class="story-description">As a visitor, I want to book a demo via an embedded calendar so I can schedule a walkthrough. Embedded scheduling widget (Calendly or similar) showing available time slots for a 30-minute product walkthrough. Visitor selects date/time, enters name, email, organization name, and number of potential members. Confirmation email includes calendar invite with video call link. Pre-demo questionnaire asks about current savings practices and primary goals. Slots available in multiple time zones to accommodate global diaspora communities.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Visitor</span><span><span class="meta-label">Screen:</span> Demo Booking</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">1.6.4</span>
    <span class="story-title">Newsletter Subscription</span>
    <span class="priority priority-p2">P2</span>
  </div>
  <div class="story-description">As a visitor, I want to subscribe to a newsletter so I can stay informed. A newsletter signup section with email input and "Subscribe" button. Options for newsletter frequency: Weekly Digest or Monthly Summary. Content preview: "Get savings tips, community stories, and platform updates." GDPR-compliant with explicit consent checkbox and link to privacy policy. Double opt-in via confirmation email. Subscribers receive a welcome email with links to key resources (ROSCA guide, savings tips, community stories).</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Visitor</span><span><span class="meta-label">Screen:</span> Footer/Newsletter Section</span></div>
</div>
</div>

<div class="epic-block">
<div class="epic-title">Epic 1.7: Conversion & Registration Gateway</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">1.7.1</span>
    <span class="story-title">Sticky Mobile CTA</span>
    <span class="priority priority-p0">P0</span>
  </div>
  <div class="story-description">As a mobile visitor, I want a sticky CTA button so I can register at any scroll position. On mobile viewports, a fixed bottom bar with "Get Started Free" button appears after the visitor scrolls past the hero section. The bar has a semi-transparent background and doesn't obscure content. Tapping opens the registration modal. The bar dismisses if the visitor is already on the registration page or has an active session. Includes a subtle close button to dismiss for the session if unwanted.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Mobile Visitor</span><span><span class="meta-label">Screen:</span> Mobile Sticky Bar</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">1.7.2</span>
    <span class="story-title">Streamlined Registration</span>
    <span class="priority priority-p0">P0</span>
  </div>
  <div class="story-description">As a visitor, I want streamlined registration (email/password/name + Google/Apple) so I can sign up quickly. The registration form collects minimum required fields: Full Name, Email, Password (with strength indicator). Social login buttons (Google, Apple) are displayed prominently above the email form with "Or continue with email" separator. "Already have an account?" link redirects to login. If email already exists, inline message offers login or password recovery. Form auto-detects if the visitor came from a referral link and pre-fills the referral code.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Visitor</span><span><span class="meta-label">Screen:</span> Registration Modal/Page</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">1.7.3</span>
    <span class="story-title">Exit-Intent Modal</span>
    <span class="priority priority-p2">P2</span>
  </div>
  <div class="story-description">As a visitor about to leave, I want to see an exit-intent modal (once per session) with value proposition and newsletter option. Triggered when the mouse moves toward the browser's close/back button (desktop) or after 30 seconds of inactivity (mobile). Modal shows: a compelling stat ("Members save an average of CHF 12,000 per year"), a brief value reminder, and two options: "Start Saving Now" (registration) or "Stay Updated" (newsletter signup). Appears only once per session. Can be permanently dismissed. Does not appear for returning visitors who have already registered.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Visitor</span><span><span class="meta-label">Screen:</span> Exit Modal</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">1.7.4</span>
    <span class="story-title">Social Proof Near Registration</span>
    <span class="priority priority-p1">P1</span>
  </div>
  <div class="story-description">As a visitor, I want to see social proof near the registration form so I feel confident signing up. Near the registration form, display: number of active members ("Join 15,000+ members"), recent signup activity ("42 people signed up today"), and 2–3 brief testimonial quotes from real members with photos. Also shows ratings from app stores (if applicable) and a "Trusted by X associations across Y countries" badge. Social proof elements update dynamically from real platform data.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Visitor</span><span><span class="meta-label">Screen:</span> Registration Area</span></div>
</div>
</div>

<div class="epic-block">
<div class="epic-title">Epic 1.8: Accessibility & Localization</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">1.8.1</span>
    <span class="story-title">Language Selector with Auto-Detection</span>
    <span class="priority priority-p0">P0</span>
  </div>
  <div class="story-description">As a visitor, I want a language selector (EN/FR/DE/IT/PT) with auto-detection so I can browse in my preferred language. A globe icon in the header opens a dropdown with 5 language options: English, Français, Deutsch, Italiano, Português. The page auto-detects the visitor's browser language and displays content in the matching language by default. Language selection persists via cookie for return visits. All landing page content (including dynamic elements like calculators and quizzes) is fully translated. URL updates to include language prefix (e.g., /fr/, /de/).</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Visitor</span><span><span class="meta-label">Screen:</span> Header/Global</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">1.8.2</span>
    <span class="story-title">Full Accessibility Support</span>
    <span class="priority priority-p0">P0</span>
  </div>
  <div class="story-description">As a visitor, I want the landing page to be fully accessible (screen reader support, keyboard navigation). WCAG 2.1 AA compliant: all images have meaningful alt text, all interactive elements are keyboard-navigable with visible focus indicators, form inputs have associated labels, color contrast ratios meet minimum requirements (4.5:1 for normal text), skip navigation link is available, animations respect prefers-reduced-motion, and all video content has captions. Screen readers announce dynamic content changes (live activity feed, calculator results) via ARIA live regions.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Visitor</span><span><span class="meta-label">Screen:</span> All Landing Pages</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">1.8.3</span>
    <span class="story-title">Performance Targets</span>
    <span class="priority priority-p0">P0</span>
  </div>
  <div class="story-description">As a visitor, I want fast page loads (LCP < 2s, FID < 100ms, CLS < 0.1). Landing page optimized for Core Web Vitals: Largest Contentful Paint under 2 seconds (hero image optimized with next-gen formats, lazy loading for below-fold content), First Input Delay under 100ms (minimal JavaScript blocking, code splitting), Cumulative Layout Shift under 0.1 (explicit dimensions for images/embeds, font-display: swap). Server-side rendering for initial paint. CDN delivery for static assets. Bundle size budget: < 200KB gzipped for initial load.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Visitor</span><span><span class="meta-label">Screen:</span> All Landing Pages</span></div>
</div>
</div>

<div class="epic-block">
<div class="epic-title">Epic 1.9: Mobile App Promotion</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">1.9.1</span>
    <span class="story-title">App Store Badges & QR Codes</span>
    <span class="priority priority-p1">P1</span>
  </div>
  <div class="story-description">As a mobile visitor, I want to see App Store/Google Play badges with QR codes so I can download the mobile app. A "Get the App" section displays official App Store and Google Play badges with corresponding QR codes for quick scanning. On mobile devices, badges link directly to the respective app store. On desktop, QR codes are more prominent for cross-device handoff. Section includes a phone mockup showing the mobile app interface. Download count is displayed ("Downloaded by 50,000+ users").</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Mobile Visitor</span><span><span class="meta-label">Screen:</span> App Promotion Section</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">1.9.2</span>
    <span class="story-title">Mobile Feature Highlights</span>
    <span class="priority priority-p1">P1</span>
  </div>
  <div class="story-description">As a visitor, I want to learn about mobile features (push notifications, biometric login, offline access). Adjacent to app download badges, a feature list highlights mobile-specific capabilities: Push Notifications (never miss a payment reminder or payout), Biometric Login (Face ID / fingerprint for quick secure access), Offline Access (view your circle details and schedule without internet), Mobile Payments (pay your contribution in 2 taps), and QR Code Check-in (for events). Each feature has a small icon and one-line description.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Visitor</span><span><span class="meta-label">Screen:</span> App Promotion Section</span></div>
</div>
</div>
</div>

<!-- ==================== SECTION 2: AUTH ==================== -->
<div class="feature-section">
<div class="feature-header">
  <h2>2. Authentication & Onboarding</h2>
  <div class="feature-desc">Secure authentication gateway with registration, login, password recovery, email verification, and profile onboarding. Supports email/password and social authentication (Google, Apple) with Swiss regulatory compliance. All users begin with a default Trust Score of 650.</div>
</div>

<div class="epic-block">
<div class="epic-title">Epic 2.1: Email Registration</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">2.1.1</span>
    <span class="story-title">Register with Email & Password</span>
    <span class="priority priority-p0">P0</span>
  </div>
  <div class="story-description">As a new user, I want to register with email, password, and name so I can create an account. Split-layout page with the registration form on the left and a hero illustration with rotating value propositions on the right (stacks vertically on mobile). Form fields: Full Name (required), Email (required, real-time format validation), Password (required, with strength meter). Social login buttons (Google, Apple) appear above the email form with "Or sign up with email" divider. Submit creates the account and redirects to the email verification pending page.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> New User</span><span><span class="meta-label">Screen:</span> Registration Page</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">2.1.2</span>
    <span class="story-title">Password Strength Meter</span>
    <span class="priority priority-p0">P0</span>
  </div>
  <div class="story-description">As a new user, I want to see a password strength meter (8+ chars, 1 uppercase, 1 number) so I create a secure password. A visual progress bar below the password field that updates in real-time as the user types. Shows four levels: Weak (red), Fair (orange), Good (yellow), Strong (green). Requirements listed below with checkmarks that activate as met: minimum 8 characters, at least 1 uppercase letter, at least 1 number. The register button is disabled until minimum requirements are met. Common/breached passwords are rejected with a specific message.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> New User</span><span><span class="meta-label">Screen:</span> Registration Page</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">2.1.3</span>
    <span class="story-title">Terms of Service Acceptance</span>
    <span class="priority priority-p0">P0</span>
  </div>
  <div class="story-description">As a new user, I want to accept Terms of Service and Privacy Policy during registration. A mandatory checkbox: "I agree to the Terms of Service and Privacy Policy" with both terms linked to their respective pages (open in new tab). Registration cannot proceed without checking this box. The ToS and Privacy Policy are versioned; the accepted version is recorded with the user's account. For GDPR compliance, a separate optional checkbox for marketing communications: "Send me product updates and savings tips." Consent timestamps are stored in the audit trail.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> New User</span><span><span class="meta-label">Screen:</span> Registration Page</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">2.1.4</span>
    <span class="story-title">Referral Code Entry</span>
    <span class="priority priority-p1">P1</span>
  </div>
  <div class="story-description">As a new user, I want to enter an optional referral code so my referrer gets credit. A collapsible "Have a referral code?" field below the main form. If the user arrived via a referral link, the code is pre-filled and the referrer's name is displayed ("Invited by Marie T."). Valid codes show a green checkmark; invalid codes show an error. When a referral code is used, both the referrer and new user receive their respective rewards (as defined by the referral program). The referral relationship is tracked for multi-level referral earnings.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> New User</span><span><span class="meta-label">Screen:</span> Registration Page</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">2.1.5</span>
    <span class="story-title">Verification Email Delivery</span>
    <span class="priority priority-p0">P0</span>
  </div>
  <div class="story-description">As a new user, I want to receive a verification email within 30 seconds of registration. Upon account creation, the system sends a verification email to the registered address within 30 seconds via a transactional email service (e.g., SendGrid, Postmark). The email contains: CircleUp branding, a personalized greeting, a prominent "Verify Email" button with a unique token link (valid for 24 hours), and a fallback plain-text link. The email is sent in the user's selected language. SPF/DKIM/DMARC records ensure deliverability. Bounce handling and delivery status are tracked.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> New User</span><span><span class="meta-label">Screen:</span> System/Email</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">2.1.6</span>
    <span class="story-title">Default Trust Score Assignment</span>
    <span class="priority priority-p0">P0</span>
  </div>
  <div class="story-description">As a new user, I want to start with a default Trust Score of 650. Upon account creation, the system assigns a Trust Score of 650 out of 1,000. This mid-range starting point allows new users to participate in most circles while maintaining an incentive to improve. The score is immediately visible in the user's profile. A tooltip explains: "Your Trust Score starts at 650 and improves as you complete your profile, verify your identity, and participate in circles. Higher scores unlock better circle options and credit features." Factor weights: payment history (40%), verification (20%), tenure (15%), engagement (10%), network (10%), external (5%).</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> New User</span><span><span class="meta-label">Screen:</span> System/Profile</span></div>
</div>
</div>

<div class="epic-block">
<div class="epic-title">Epic 2.2: Social Authentication</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">2.2.1</span>
    <span class="story-title">Google OAuth Registration</span>
    <span class="priority priority-p0">P0</span>
  </div>
  <div class="story-description">As a new user, I want to register via Google OAuth 2.0/PKCE so I can sign up quickly. Clicking "Continue with Google" initiates the OAuth 2.0 Authorization Code flow with PKCE for security. The Google consent screen requests email and profile scopes. Upon authorization, the system creates an account using the Google profile data (name, email, profile photo). Email is automatically marked as verified (from Google). If the Google email matches an existing account, the user is prompted to link accounts or log in. The flow handles interrupted/cancelled authorization gracefully with a clear message.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> New User</span><span><span class="meta-label">Screen:</span> Google OAuth Flow</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">2.2.2</span>
    <span class="story-title">Apple Sign-In Registration</span>
    <span class="priority priority-p0">P0</span>
  </div>
  <div class="story-description">As a new user, I want to register via Apple Sign-In so I can sign up quickly. Implements Apple's Sign In with Apple using the authorization code flow. Supports Apple's "Hide My Email" relay feature — the system handles relay email addresses seamlessly. On first sign-in, Apple provides name and email (subsequent sign-ins only provide the user identifier). The system stores the Apple user ID for future authentication. If the user hides their email, communication is sent via Apple's relay service. Works on both web (JavaScript SDK) and native (iOS).</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> New User</span><span><span class="meta-label">Screen:</span> Apple Auth Flow</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">2.2.3</span>
    <span class="story-title">Auto-Verified Email from Provider</span>
    <span class="priority priority-p0">P0</span>
  </div>
  <div class="story-description">As a social auth user, I want my email auto-verified from the provider. When registering via Google or Apple, the email address provided by the OAuth provider is automatically marked as verified in the CircleUp system, bypassing the email verification step. This is safe because Google and Apple have already verified the email during their own account creation process. The user proceeds directly to the profile onboarding wizard after social registration, saving time. The email_verified flag and verification source (google/apple) are recorded in the audit trail.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Social Auth User</span><span><span class="meta-label">Screen:</span> System</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">2.2.4</span>
    <span class="story-title">Missing Profile Fields Prompt</span>
    <span class="priority priority-p0">P0</span>
  </div>
  <div class="story-description">As a social auth user, I want to be prompted for missing profile fields if provider data is incomplete. After social authentication, the system checks if all required profile fields are populated. If the social provider didn't supply certain data (e.g., Apple didn't provide full name, or Google profile lacks a phone number), the user is shown a short form to complete the missing fields before proceeding. The form is pre-filled with any data received from the provider. Only truly missing required fields are requested — no redundant questions. A progress indicator shows the user they're almost done.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Social Auth User</span><span><span class="meta-label">Screen:</span> Profile Completion</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">2.2.5</span>
    <span class="story-title">Unlinked Account Resolution</span>
    <span class="priority priority-p1">P1</span>
  </div>
  <div class="story-description">As a returning social user with an unlinked account, I want to be offered to create new or link existing account. When a user signs in via social auth and the provider email matches an existing CircleUp account that isn't linked to that social provider, the system presents two options: "Link to Existing Account" (requires the existing account's password for verification, then links the social provider for future use) or "Create New Account" (creates a separate account — warns that a different email will be needed if the existing one is taken). Clear explanation of what each option means. Account linking is recorded in the audit trail.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Social Auth User</span><span><span class="meta-label">Screen:</span> Account Resolution</span></div>
</div>
</div>

<div class="epic-block">
<div class="epic-title">Epic 2.3: Email Login</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">2.3.1</span>
    <span class="story-title">Email & Password Login</span>
    <span class="priority priority-p0">P0</span>
  </div>
  <div class="story-description">As a returning user, I want to log in with email and password. Login page with the same split layout as registration. Fields: Email and Password. Social login buttons (Google, Apple) appear above with "Or continue with email" separator. "Forgot password?" link below the password field. "Don't have an account? Sign up" link at the bottom. Successful login redirects to the user's last visited page or the default homepage. Invalid credentials show a generic "Invalid email or password" message (prevents email enumeration). Login events are logged in the audit trail with IP address and device info.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Returning User</span><span><span class="meta-label">Screen:</span> Login Page</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">2.3.2</span>
    <span class="story-title">Remember Me Session</span>
    <span class="priority priority-p0">P0</span>
  </div>
  <div class="story-description">As a returning user, I want a "Remember me" option for 30-day sessions. A checkbox on the login form: "Remember me." When checked, the session cookie is set with a 30-day expiration instead of the default session-only cookie. The session is refreshed on each active use (sliding window). Remembered sessions can be viewed and revoked from the user's Security Settings page. If the user's password is changed or reset, all "Remember me" sessions are invalidated across all devices. The remembered device is fingerprinted and logged for security monitoring.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Returning User</span><span><span class="meta-label">Screen:</span> Login Page</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">2.3.3</span>
    <span class="story-title">Account Lockout Protection</span>
    <span class="priority priority-p0">P0</span>
  </div>
  <div class="story-description">As a user, I want account lockout after 5 failed attempts with 15-minute cooldown so my account stays secure. After 5 consecutive failed login attempts for the same email, the account is temporarily locked for 15 minutes. The user sees: "Too many failed attempts. Please try again in [countdown] or reset your password." The lockout timer is displayed in real-time. A "Reset Password" link is available during lockout. Failed attempts are tracked per email (not per IP) to prevent circumvention. The lockout count resets after a successful login. Security team is notified after 10+ failed attempts (possible brute force). The lockout policy applies equally to API-based login attempts.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> User</span><span><span class="meta-label">Screen:</span> Login Page</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">2.3.4</span>
    <span class="story-title">Unverified Account Login Prompt</span>
    <span class="priority priority-p0">P0</span>
  </div>
  <div class="story-description">As an unverified user attempting login, I want to be prompted to verify my email first. If a user with correct credentials attempts to log in but has not yet verified their email, they see: "Please verify your email address to continue. Check your inbox for the verification link." A "Resend Verification Email" button is available (rate-limited to 3 per hour). The page shows the registered email (partially masked: j***e@example.com) and offers to change it if the email was entered incorrectly. The user cannot access any platform features until verified.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Unverified User</span><span><span class="meta-label">Screen:</span> Verification Prompt</span></div>
</div>
</div>

<div class="epic-block">
<div class="epic-title">Epic 2.4: Password Recovery</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">2.4.1</span>
    <span class="story-title">Password Reset Request</span>
    <span class="priority priority-p0">P0</span>
  </div>
  <div class="story-description">As a user, I want to request a password reset link via email. The "Forgot Password?" page has a single field: Email Address. Upon submission, a reset email is sent containing a unique, single-use token link. The email includes: CircleUp branding, a "Reset Password" button, a text fallback link, and a warning "If you didn't request this, you can ignore this email." The email is sent in the user's preferred language. The reset token is cryptographically random (256-bit), stored hashed (not plaintext), and tied to the specific user.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> User</span><span><span class="meta-label">Screen:</span> Forgot Password Page</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">2.4.2</span>
    <span class="story-title">Reset Link Expiration</span>
    <span class="priority priority-p0">P0</span>
  </div>
  <div class="story-description">As a user, I want the reset link to be valid for 1 hour. Password reset tokens expire after exactly 60 minutes from generation. Clicking an expired link shows: "This reset link has expired. Please request a new one." with a "Request New Link" button. The expiration time is displayed in the reset email: "This link expires in 1 hour." Only the most recently generated token is valid — requesting a new reset link invalidates any previous unused tokens. Token expiration is enforced server-side; the link page also shows a client-side countdown.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> User</span><span><span class="meta-label">Screen:</span> Reset Link/Email</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">2.4.3</span>
    <span class="story-title">Anti-Enumeration Confirmation</span>
    <span class="priority priority-p0">P0</span>
  </div>
  <div class="story-description">As a user, I want the same confirmation message regardless of email existence to prevent enumeration attacks. Whether the email exists in the system or not, the confirmation page always shows: "If an account with that email exists, we've sent a password reset link. Check your inbox." This prevents attackers from discovering which email addresses have CircleUp accounts. The response time is also consistent (no timing side-channel). Rate limiting applies: maximum 3 reset requests per email per hour, maximum 10 per IP per hour. All reset requests are logged in the audit trail.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> User</span><span><span class="meta-label">Screen:</span> Reset Confirmation</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">2.4.4</span>
    <span class="story-title">Session Invalidation on Reset</span>
    <span class="priority priority-p0">P0</span>
  </div>
  <div class="story-description">As a user, I want password reset to invalidate all existing sessions. When a user successfully sets a new password via the reset flow, all existing sessions for that account are immediately invalidated across all devices and browsers. This includes "Remember me" sessions and API tokens. The user is logged in on the current device with a new session and redirected to the homepage. An email notification is sent: "Your password was changed. If you didn't do this, contact support immediately." The password change event is recorded in the audit trail with device information and IP address.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> User</span><span><span class="meta-label">Screen:</span> Password Reset Page</span></div>
</div>
</div>

<div class="epic-block">
<div class="epic-title">Epic 2.5: Email Verification</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">2.5.1</span>
    <span class="story-title">Email Verification Link</span>
    <span class="priority priority-p0">P0</span>
  </div>
  <div class="story-description">As a new user, I want to verify my email by clicking a link (24-hour validity). The verification email contains a unique, single-use token link valid for 24 hours. Clicking the link verifies the email, updates the user's status to "verified," and redirects to the profile onboarding wizard. The verification page shows a success message with a brief animation. If the token is invalid or already used, the page shows an appropriate error with a "Resend Verification" option. The verification event is recorded in the audit trail with timestamp and IP address.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> New User</span><span><span class="meta-label">Screen:</span> Verification Page</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">2.5.2</span>
    <span class="story-title">Resend Verification Email</span>
    <span class="priority priority-p0">P0</span>
  </div>
  <div class="story-description">As a new user, I want to resend the verification email (rate-limited to 3/hour). On the "Verification Pending" page, a "Resend Email" button allows the user to request a new verification email. Rate limited to 3 resends per hour per account. After each resend, a countdown shows when the next resend is available. The button text updates: "Email sent! Check your inbox." Also provides troubleshooting tips: check spam/junk folder, add noreply@circleup.app to contacts, verify the email address is correct. A "Change Email" option is available if the user mistyped their email during registration.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> New User</span><span><span class="meta-label">Screen:</span> Verification Pending Page</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">2.5.3</span>
    <span class="story-title">Expired Link Re-Send</span>
    <span class="priority priority-p0">P0</span>
  </div>
  <div class="story-description">As a user with an expired verification link, I want to be offered a re-send option. When clicking a verification link that has expired (older than 24 hours), instead of just showing an error, the page displays: "This verification link has expired. No worries — we can send you a new one." with a "Send New Verification Email" button. Clicking the button generates a new 24-hour token and sends a fresh verification email. The new token invalidates any other pending verification tokens for the same account. The page confirms: "A new verification email has been sent to [email]."</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> User</span><span><span class="meta-label">Screen:</span> Expired Link Page</span></div>
</div>
</div>

<div class="epic-block">
<div class="epic-title">Epic 2.6: Profile Onboarding Wizard</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">2.6.1</span>
    <span class="story-title">Post-Verification Onboarding</span>
    <span class="priority priority-p0">P0</span>
  </div>
  <div class="story-description">As a verified user, I want a post-verification onboarding wizard (photo, phone, bio, location, language). A multi-step wizard that guides new users through profile completion: Step 1: Upload Profile Photo (with crop/resize tool, or choose from avatar library). Step 2: Add Phone Number (with country code picker and SMS verification). Step 3: Write a Short Bio (optional, max 200 characters). Step 4: Set Location (country and city, used for circle discovery). Step 5: Choose Languages (primary and additional languages from EN/FR/DE/IT/PT). Each step is a dedicated card with clear instructions and a progress bar showing steps completed.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> Verified User</span><span><span class="meta-label">Screen:</span> Onboarding Wizard</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">2.6.2</span>
    <span class="story-title">Trust Score Progress Preview</span>
    <span class="priority priority-p1">P1</span>
  </div>
  <div class="story-description">As a new user, I want to see a progress bar showing Trust Score improvement per completed step. During onboarding, a Trust Score preview widget shows how each completed step increases the user's score. Starting at 650, the widget shows: Photo (+10 points), Phone Verification (+25 points), Bio (+5 points), Location (+5 points), Language (+5 points). As each step is completed, the score animates upward. At the end of onboarding, a summary shows the new score (e.g., 700) with a message: "Great start! Your Trust Score is now 700. Keep improving by joining circles and making on-time payments."</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> New User</span><span><span class="meta-label">Screen:</span> Onboarding Wizard</span></div>
</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">2.6.3</span>
    <span class="story-title">Skip Onboarding with Reminder</span>
    <span class="priority priority-p0">P0</span>
  </div>
  <div class="story-description">As a new user, I want to skip onboarding steps with a persistent reminder to complete later. Each onboarding step has a "Skip for now" link. Skipping any step brings the user to the next one. After the wizard (completed or partially skipped), the user reaches the main application. If steps were skipped, a persistent but dismissible banner appears at the top: "Complete your profile to improve your Trust Score. [Complete Now]" linking back to the onboarding wizard. The banner reappears after 7 days if profile remains incomplete. A badge notification on the user's avatar also indicates incomplete profile.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> New User</span><span><span class="meta-label">Screen:</span> Onboarding Wizard / App Header</span></div>
</div>
</div>

<div class="epic-block">
<div class="epic-title">Epic 2.7: Language Selection</div>

<div class="story-card">
  <div class="story-header">
    <span class="story-id">2.7.1</span>
    <span class="story-title">Auth Page Language Selector</span>
    <span class="priority priority-p0">P0</span>
  </div>
  <div class="story-description">As a user, I want a language selector (EN/FR/DE/IT/PT) available on all authentication pages. A language selector is accessible from every authentication screen (login, registration, forgot password, verification). Located in the header or footer of the auth pages. Displays as a globe icon with a dropdown showing: English, Français, Deutsch, Italiano, Português. Selecting a language immediately translates the current page. The selection is saved to local storage and applied to subsequent pages. If the user registers, their language preference is stored in their profile. Auto-detection from browser language pre-selects the best match.</div>
  <div class="story-meta"><span><span class="meta-label">Role:</span> User</span><span><span class="meta-label">Screen:</span> All Auth Pages</span></div>
</div>
</div>
</div>

<!-- NOTE: Sections 3-17 follow the same pattern. For brevity in the generation script,
     the remaining sections continue with the same detailed format. -->

`;

// Due to the massive size of the full document, we'll generate the remaining sections programmatically
// by reading the markdown and converting to HTML cards

const remainingSectionsHtml = generateRemainingSections();

const closingHtml = `

<!-- SUMMARY PAGE -->
<div class="summary-page">
  <h2>Summary</h2>

  <table class="summary-table">
    <thead>
      <tr>
        <th>Feature Area</th>
        <th style="text-align:center">Epics</th>
        <th style="text-align:center">User Stories</th>
        <th style="text-align:center">P0</th>
        <th style="text-align:center">P1</th>
        <th style="text-align:center">P2</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>1. Homepage & Landing</td><td style="text-align:center">9</td><td style="text-align:center">28</td><td style="text-align:center">10</td><td style="text-align:center">12</td><td style="text-align:center">6</td></tr>
      <tr><td>2. Authentication & Onboarding</td><td style="text-align:center">7</td><td style="text-align:center">20</td><td style="text-align:center">16</td><td style="text-align:center">3</td><td style="text-align:center">1</td></tr>
      <tr><td>3. Associations</td><td style="text-align:center">5</td><td style="text-align:center">14</td><td style="text-align:center">12</td><td style="text-align:center">2</td><td style="text-align:center">0</td></tr>
      <tr><td>4. Members & Trust</td><td style="text-align:center">5</td><td style="text-align:center">13</td><td style="text-align:center">5</td><td style="text-align:center">8</td><td style="text-align:center">0</td></tr>
      <tr><td>5. ROSCA Circles</td><td style="text-align:center">9</td><td style="text-align:center">32</td><td style="text-align:center">18</td><td style="text-align:center">14</td><td style="text-align:center">0</td></tr>
      <tr><td>6. Treasury & Funds</td><td style="text-align:center">8</td><td style="text-align:center">24</td><td style="text-align:center">14</td><td style="text-align:center">5</td><td style="text-align:center">5</td></tr>
      <tr><td>7. Credit & Lending</td><td style="text-align:center">6</td><td style="text-align:center">19</td><td style="text-align:center">7</td><td style="text-align:center">8</td><td style="text-align:center">4</td></tr>
      <tr><td>8. Multi-Share</td><td style="text-align:center">7</td><td style="text-align:center">51</td><td style="text-align:center">24</td><td style="text-align:center">21</td><td style="text-align:center">6</td></tr>
      <tr><td>9. Governance & Voting</td><td style="text-align:center">8</td><td style="text-align:center">25</td><td style="text-align:center">12</td><td style="text-align:center">10</td><td style="text-align:center">3</td></tr>
      <tr><td>10. Communication & Events</td><td style="text-align:center">8</td><td style="text-align:center">22</td><td style="text-align:center">11</td><td style="text-align:center">8</td><td style="text-align:center">3</td></tr>
      <tr><td>11. Documents</td><td style="text-align:center">6</td><td style="text-align:center">16</td><td style="text-align:center">8</td><td style="text-align:center">8</td><td style="text-align:center">0</td></tr>
      <tr><td>12. Projects & Fundraising</td><td style="text-align:center">5</td><td style="text-align:center">15</td><td style="text-align:center">7</td><td style="text-align:center">6</td><td style="text-align:center">2</td></tr>
      <tr><td>13. Community & Social</td><td style="text-align:center">8</td><td style="text-align:center">24</td><td style="text-align:center">3</td><td style="text-align:center">11</td><td style="text-align:center">10</td></tr>
      <tr><td>14. Analytics & Reporting</td><td style="text-align:center">7</td><td style="text-align:center">18</td><td style="text-align:center">5</td><td style="text-align:center">10</td><td style="text-align:center">3</td></tr>
      <tr><td>15. AI Insights</td><td style="text-align:center">3</td><td style="text-align:center">17</td><td style="text-align:center">3</td><td style="text-align:center">6</td><td style="text-align:center">8</td></tr>
      <tr><td>16. Federations</td><td style="text-align:center">8</td><td style="text-align:center">27</td><td style="text-align:center">18</td><td style="text-align:center">9</td><td style="text-align:center">0</td></tr>
      <tr><td>17. Platform Administration</td><td style="text-align:center">4</td><td style="text-align:center">36</td><td style="text-align:center">20</td><td style="text-align:center">16</td><td style="text-align:center">0</td></tr>
      <tr class="total-row"><td><strong>TOTAL</strong></td><td style="text-align:center"><strong>118</strong></td><td style="text-align:center"><strong>381</strong></td><td style="text-align:center"><strong>193</strong></td><td style="text-align:center"><strong>157</strong></td><td style="text-align:center"><strong>51</strong></td></tr>
    </tbody>
  </table>

  <div style="margin-top: 32px; padding: 20px; background: var(--bg-subtle); border-radius: 8px; border: 1px solid var(--border);">
    <h3 style="font-size: 12pt; margin-bottom: 12px;">Priority Distribution</h3>
    <div class="priority-legend">
      <div class="priority-legend-item"><span class="priority priority-p0">P0</span> 193 stories (51%) — Must-have for launch</div>
      <div class="priority-legend-item"><span class="priority priority-p1">P1</span> 157 stories (41%) — High value, post-launch</div>
      <div class="priority-legend-item"><span class="priority priority-p2">P2</span> 51 stories (13%) — Future phases</div>
    </div>
  </div>

  <div style="margin-top: 24px; font-size: 8pt; color: var(--text-secondary); text-align: center;">
    CircleUp — Features, Epics & User Stories &middot; Generated February 18, 2026 &middot; Version 1.0
  </div>
</div>

</div>
</body>
</html>`;

function generateRemainingSections() {
  // Sections 3-17 with detailed descriptions
  const sections = [
    {
      num: 3, title: "Associations",
      desc: "Create, discover, and manage community organizations. Associations are the foundational organizational unit in CircleUp, representing cultural groups, religious communities, professional networks, savings cooperatives, social clubs, and family groups.",
      epics: [
        { title: "Epic 3.1: Association Discovery & Browsing", stories: [
          { id: "3.1.1", title: "My Associations Grid View", priority: "P0", desc: "As a member, I want to view My Associations as a card grid with logo, name, member count, role badge, and unread activity indicator. The dashboard shows all associations the user belongs to as responsive cards. Each card displays: the association's logo (or generated initials avatar), name, member count, the user's role badge (President/Treasurer/Secretary/Admin/Member), and an unread activity dot for new announcements or pending actions. Cards are sorted by most recent activity. Clicking a card navigates to that association's dashboard." },
          { id: "3.1.2", title: "Browse & Search Public Associations", priority: "P0", desc: "As a user, I want to browse and search public associations by type, language, and location. The discovery view shows a searchable, filterable grid of public associations. Filters include: association type (cultural/religious/professional/savings/social/family), language, country/city, and member count range. Search covers association name and description. Each result card shows the association's logo, name, type badge, member count, brief description, and a 'Request to Join' button. Results are sorted by relevance with promoted associations at top." },
          { id: "3.1.3", title: "Request to Join Association", priority: "P0", desc: "As a user, I want to request to join a discovered association. Clicking 'Request to Join' on a public association opens a brief form: optional introduction message and how the user heard about the association. The request is sent to association admins. The user sees a pending status on the association card. Admins receive a notification with the requester's profile, Trust Score, and introduction message. Admins can approve or reject with an optional message. The user is notified of the decision. Approved users are added as members." }
        ]},
        { title: "Epic 3.2: Association Creation", stories: [
          { id: "3.2.1", title: "Multi-Step Creation Wizard", priority: "P0", desc: "As a user, I want to create an association via a multi-step wizard (name, type, description, visibility, language, branding). A 4-step wizard: Step 1: Name and Type — association name (unique check), type selection from predefined categories. Step 2: Description and Purpose — rich text description, mission statement, and tags. Step 3: Settings — visibility (public/private), default language, country, membership approval mode (open/approval required). Step 4: Branding — logo upload, cover image, color accent. Preview before final creation. The creator becomes the founding President." },
          { id: "3.2.2", title: "Association Type Selection", priority: "P0", desc: "As a creator, I want to select association type (cultural/religious/professional/savings/social/family). A visual selector with 6 type options, each with an icon and brief description: Cultural (diaspora and heritage groups), Religious (faith-based communities), Professional (trade and industry groups), Savings (dedicated savings cooperatives), Social (friend and neighborhood groups), Family (family savings and support). The type affects default settings, suggested circle configurations, and discovery categorization. Can be changed later by admins." },
          { id: "3.2.3", title: "Logo & Cover Image Upload", priority: "P1", desc: "As a creator, I want to upload a logo and cover image with crop functionality. The branding step includes: Logo upload (accepts PNG/JPG/SVG, max 2MB) with a circular crop tool and zoom/rotate controls. Minimum resolution: 200x200px. Cover Image upload (accepts PNG/JPG, max 5MB) with a 16:9 crop tool. Preview shows how logo and cover appear on the association's dashboard and discovery cards. If no logo is uploaded, the system generates an initials-based avatar using the association name and a randomly selected accent color." },
          { id: "3.2.4", title: "Visibility & Language Settings", priority: "P0", desc: "As a creator, I want to set visibility (public/private) and default language. Public associations appear in discovery and search; anyone can request to join. Private associations are invite-only and hidden from discovery. Default language sets the primary communication language for announcements and system notifications within the association. Available languages: EN/FR/DE/IT/PT. These settings can be changed later by admins in association settings." }
        ]},
        { title: "Epic 3.3: Association Dashboard", stories: [
          { id: "3.3.1", title: "Association Overview Dashboard", priority: "P0", desc: "As an association admin, I want to see a dashboard with member count, active circles, recent activity, and announcements. The dashboard features a hero section with the association's cover image and stats row: total members, active circles, pending requests, and unread announcements. Below, a two-column layout: left column shows recent activity feed (new members, circle updates, contributions), right column shows pinned announcements and upcoming events. Quick action cards at the top: Create Circle, Invite Members, Post Announcement, View Reports." },
          { id: "3.3.2", title: "Quick Action Buttons", priority: "P0", desc: "As an admin, I want quick action buttons for common tasks. Prominent action buttons on the dashboard for frequent operations: 'Create Circle' (opens circle creation wizard), 'Invite Members' (opens invitation modal), 'Post Announcement' (opens announcement composer), 'View Reports' (navigates to analytics). Actions respect the user's role permissions — unavailable actions are hidden or shown as read-only. On mobile, quick actions appear as a floating action button with a speed dial menu." },
          { id: "3.3.3", title: "Association Analytics Summary", priority: "P1", desc: "As an admin, I want to view analytics (member growth, engagement metrics, circle activity summary). An analytics card on the dashboard shows key trends: member growth chart (last 6 months), engagement score (based on login frequency, contribution timeliness, event participation), circle activity summary (active/forming/completed circles), and total funds under management. Charts use the association's accent color. Clicking 'View Full Analytics' navigates to the detailed Analytics & Reporting section filtered to this association." }
        ]},
        { title: "Epic 3.4: Association Settings & Management", stories: [
          { id: "3.4.1", title: "Tabbed Settings Interface", priority: "P0", desc: "As an admin, I want to manage association settings via tabs (General, Branding, Language & Culture, Privacy). A settings page with four tabs: General (name, description, type, country, contact email), Branding (logo, cover image, accent color), Language & Culture (default language, cultural terminology preferences, supported languages for announcements), Privacy (visibility setting, member directory visibility, who can see member list, data sharing preferences). Each tab saves independently. Changes to critical settings (name, visibility) require confirmation." },
          { id: "3.4.2", title: "Member Management Table", priority: "P0", desc: "As an admin, I want to manage members via a searchable table with avatar, name, role dropdown, join date, and actions. A data table showing all association members with columns: Avatar (with online indicator), Full Name (linked to profile), Role (dropdown to change), Trust Score (color-coded badge), Join Date, Status (active/suspended/pending), and Actions (kebab menu: View Profile, Send Message, Remove Member). Table supports search by name/email, filtering by role and status, and sorting by any column. Bulk actions: change role, send message, remove." },
          { id: "3.4.3", title: "Member Role Management", priority: "P0", desc: "As an admin, I want to change member roles (member/treasurer/secretary/president/admin) via dropdown. Each member row has a role dropdown with available roles: Member, Treasurer, Secretary, Admin, President. Changing a role requires confirmation with a description of the new permissions. Only the President can assign the President role (which transfers their own presidency). Role changes take effect immediately. The affected member receives a notification. Role change history is maintained in the audit trail. An association must always have at least one President." }
        ]},
        { title: "Epic 3.5: Member Invitations", stories: [
          { id: "3.5.1", title: "Generate Invite Links", priority: "P0", desc: "As an admin, I want to generate invite links for new members. The invitation modal provides a shareable invite link unique to the association. The link can be set to expire (24 hours, 7 days, 30 days, or never) and have a maximum number of uses (1, 5, 10, 25, unlimited). Admins can generate multiple links for different purposes (e.g., one for an event, one for social media). Active links are listed with usage stats (X of Y uses consumed). Links can be deactivated at any time." },
          { id: "3.5.2", title: "Multi-Channel Invitations", priority: "P0", desc: "As an admin, I want to send invitations via SMS, email, or WhatsApp. Beyond the shareable link, admins can send direct invitations by entering recipient contact info. Email invitations include the association's branding, a personalized message from the admin, and a 'Join Now' button. SMS invitations are concise with the invite link. WhatsApp invitations use a pre-formatted message template. Admins can import a CSV of contacts for bulk invitations (name, email or phone). Each invited person receives a unique tracking link for attribution." },
          { id: "3.5.3", title: "Manage Pending Invitations", priority: "P0", desc: "As an admin, I want to view and manage pending invitations. A tab or section showing all pending invitations: Invited (sent but not yet clicked), Clicked (visited the link but didn't register), Pending Approval (requested to join, awaiting admin decision). Each entry shows: invitee name/email/phone, invitation method, date sent, status, and actions (Resend, Cancel, Approve/Reject). Expired invitations are shown in a separate list. Admins can resend invitations with one click (respecting rate limits). Bulk approve/reject for pending requests." }
        ]}
      ]
    },
    {
      num: 4, title: "Members & Trust",
      desc: "Member directory, profiles, engagement tracking, and AI-powered Trust Score transparency. The Trust Score (0-1000) is a core platform mechanic that builds confidence in community savings by quantifying member reliability through payment history, verification, tenure, engagement, network effects, and external data.",
      epics: [
        { title: "Epic 4.1: Member Directory", stories: [
          { id: "4.1.1", title: "Searchable Member Directory", priority: "P0", desc: "As a member, I want to view a searchable/filterable member directory with trust score badges, roles, status, and join date. A paginated table showing all members of the current association. Columns: Avatar, Name, Trust Score (circular badge with color), Role, Status (Active/Inactive/Suspended), Join Date, and Last Active. Supports search by name or email. Filters: role, Trust Score range (slider), status, join date range. Sortable by any column. Clicking a member opens their profile. Members can only see the directory for associations they belong to. Respects privacy settings — some members may hide certain profile details." },
          { id: "4.1.2", title: "Color-Coded Trust Score Badges", priority: "P0", desc: "As a member, I want to see color-coded trust score badges for each member. Trust Scores are displayed as compact circular badges throughout the platform. Color coding: 800-1000 (emerald/green — Excellent), 650-799 (blue — Good), 500-649 (amber — Fair), 300-499 (orange — Needs Improvement), 0-299 (red — Low). The badge shows the numeric score and a small trend arrow (up/down/stable based on 30-day change). Hovering the badge shows a tooltip with the last update date and trend percentage. Badges appear consistently in member directories, circle rosters, and profile pages." }
        ]},
        { title: "Epic 4.2: Member Profiles", stories: [
          { id: "4.2.1", title: "Tabbed Member Profile", priority: "P0", desc: "As a member, I want to view member profiles with tabs for History, References, Engagement, and Settings. The profile page shows the member's avatar, name, Trust Score gauge, and role badges at the top. Four tabs below: History (circle participation timeline, payouts received, contribution record), References (given and received references with dates and messages), Engagement (login frequency, event attendance, announcement acknowledgments, response times), Settings (profile editing, notification preferences, privacy controls — only visible on own profile). Public profile shows limited info based on privacy settings." },
          { id: "4.2.2", title: "Give Member References", priority: "P1", desc: "As a member, I want to give references for trusted members. From another member's profile, a 'Give Reference' button opens a form: relationship context (e.g., 'We've been in 3 circles together'), a 1-5 star rating for reliability, a free-text recommendation (max 500 characters), and optional endorsement of specific traits (punctual, communicative, trustworthy, helpful). References are public on the member's profile (with the reference giver's name and avatar). References contribute to the 'network' factor (10%) of the Trust Score. Members can edit or withdraw their references." },
          { id: "4.2.3", title: "Request References", priority: "P1", desc: "As a member, I want to request references from other members. A 'Request Reference' action on the profile page allows a member to send a reference request to other members they've interacted with. The request includes an optional personal message. Recipients see the request in their notifications and can accept (write a reference) or decline. Pending requests are shown on the requesting member's References tab. The system suggests relevant members to request references from based on shared circle participation. Rate limited to 5 requests per week." }
        ]},
        { title: "Epic 4.3: AI Trust Score", stories: [
          { id: "4.3.1", title: "Trust Score Circular Gauge", priority: "P0", desc: "As a member, I want to view my Trust Score as a circular gauge (0-1000) with color gradient. A prominent circular gauge on the member's profile and dashboard shows the current Trust Score. The gauge fills clockwise with a gradient from red (0) through amber (500) to green (1000). The numeric score is displayed large in the center. Below the gauge: the qualitative label (Excellent/Good/Fair/etc.), the date of last update, and the 30-day trend (e.g., '+15 points'). An info icon opens an explanation of how Trust Scores work. The gauge animates smoothly when the score changes." },
          { id: "4.3.2", title: "Trust Score Factor Breakdown", priority: "P0", desc: "As a member, I want to see the factor breakdown (payment history 40%, verification 20%, tenure 15%, engagement 10%, network 10%, external 5%). Below the Trust Score gauge, six horizontal progress bars show the contribution of each factor: Payment History (40% weight) — based on on-time payment rate across all circles. Verification (20%) — KYC level, phone verification, email verification. Tenure (15%) — account age and continuous platform activity. Engagement (10%) — login frequency, feature usage, event participation. Network (10%) — references received, circle memberships, community connections. External (5%) — optional credit bureau data, external verifications. Each bar shows the factor name, weight, current score for that factor, and max possible points." },
          { id: "4.3.3", title: "Trust Score Improvement Tips", priority: "P1", desc: "As a member, I want personalized recommendations to improve my Trust Score. An 'Improve Your Score' section below the factor breakdown shows 3-5 actionable recommendations ordered by impact. Examples: 'Complete KYC verification (+50 points),' 'Make your next 3 contributions on time (+25 points),' 'Get a reference from a circle organizer (+15 points),' 'Verify your phone number (+10 points).' Each recommendation shows the estimated point gain, difficulty level, and a direct action link. Recommendations update dynamically based on the user's current factor scores and missing completions." }
        ]},
        { title: "Epic 4.4: At-Risk Member Monitoring", stories: [
          { id: "4.4.1", title: "At-Risk Member Panel", priority: "P0", desc: "As an organizer, I want to view flagged members with declining engagement or payment issues. An organizer-only panel on the circle management page showing members whose behavior indicates potential risk: declining Trust Scores (>50 point drop in 30 days), missed or late payments (2+ in recent cycles), decreased login frequency, or engagement score drop. Each at-risk member is displayed as a card with: name, Trust Score with trend arrow, risk level (High/Medium/Low), specific risk indicators, and last active date. The panel updates in real-time based on AI monitoring." },
          { id: "4.4.2", title: "Trend Arrows & Recommended Actions", priority: "P1", desc: "As an organizer, I want to see trend arrows and recommended actions for at-risk members. Each at-risk member card includes: a trend arrow showing the direction of their Trust Score and engagement (up = improving, down = declining, stable), a risk breakdown (which specific factors are declining), and 2-3 recommended actions: 'Send a check-in message,' 'Offer payment plan for upcoming contribution,' 'Schedule a call,' or 'Consider moving to waitlist.' Actions can be executed directly from the card (e.g., clicking 'Send check-in' opens a pre-drafted message). The system tracks whether recommended actions were taken and their outcomes." }
        ]},
        { title: "Epic 4.5: Feedback & Disputes", stories: [
          { id: "4.5.1", title: "Circle Experience Rating", priority: "P1", desc: "As a member, I want to rate my circle experience and provide feedback on organizers/members. After a circle completes (or at defined intervals), members are prompted to rate their experience: overall satisfaction (1-5 stars), organizer rating, communication quality, payment process smoothness, and an optional text review. Ratings are aggregated anonymously — organizers see average scores but not individual raters. High-rated organizers earn a 'Top Organizer' badge. Feedback data feeds into the AI system for circle health scoring and recommendation improvements. Submission is optional but encouraged via notification." },
          { id: "4.5.2", title: "File Dispute with Evidence", priority: "P1", desc: "As a member, I want to file a dispute with evidence upload via a multi-step form. The dispute form is a 3-step process: Step 1: Category selection (payment issue, organizer conduct, member behavior, circle terms violation, other) and brief description. Step 2: Evidence upload — photos, screenshots, documents (max 10 files, 5MB each), optional text elaboration. Step 3: Desired resolution (refund, apology, member removal, circle termination, other). The dispute is assigned a unique ID and sent to the association admin and/or platform support depending on severity. Automated acknowledgment email sent within 5 minutes." },
          { id: "4.5.3", title: "Dispute Status Timeline", priority: "P1", desc: "As a member, I want to track dispute status via a timeline view. A timeline visualization showing the dispute's progression through stages: Filed → Under Review → Evidence Gathering → Resolution Proposed → Resolved (or Escalated). Each stage shows the date, the assigned reviewer, and any notes or updates. Both parties can add comments at any stage. The member receives notifications at each status change. Expected resolution timeframes are shown based on dispute category. If the dispute is unresolved within the SLA, it auto-escalates to the next level." },
          { id: "4.5.4", title: "Dispute Escalation Path", priority: "P1", desc: "As a member, I want disputes to have an escalation path. Disputes follow a defined escalation chain: Level 1 — Circle organizer (48-hour SLA for initial response). Level 2 — Association admin (if organizer is party to dispute or doesn't resolve within SLA). Level 3 — Platform support (for cross-association disputes or if association can't resolve). Level 4 — External mediation (for legal or regulatory matters). Each level has a defined SLA. The escalation button becomes available when the current level's SLA expires. The dispute record maintains the full history across all escalation levels." }
        ]}
      ]
    }
  ];

  // For sections 5-17, we'll generate abbreviated but still detailed cards
  // This keeps the PDF manageable while still being comprehensive

  let html = '';

  for (const section of sections) {
    html += `<div class="feature-section">
<div class="feature-header">
  <h2>${section.num}. ${section.title}</h2>
  <div class="feature-desc">${section.desc}</div>
</div>`;

    for (const epic of section.epics) {
      html += `<div class="epic-block">
<div class="epic-title">${epic.title}</div>`;

      for (const story of epic.stories) {
        const pClass = story.priority.toLowerCase().replace(/\//g, '-');
        html += `<div class="story-card">
  <div class="story-header">
    <span class="story-id">${story.id}</span>
    <span class="story-title">${story.title}</span>
    <span class="priority priority-${pClass}">${story.priority}</span>
  </div>
  <div class="story-description">${story.desc}</div>
</div>`;
      }

      html += `</div>`;
    }

    html += `</div>`;
  }

  return html;
}

const fullHtml = html + remainingSectionsHtml + closingHtml;

// Write the HTML file first
writeFileSync('/Users/lunang/Documents/Projects/circleup-design/product/features-epics-stories.html', fullHtml);

// Generate PDF
const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setContent(fullHtml, { waitUntil: 'networkidle0', timeout: 60000 });
await page.pdf({
  path: '/Users/lunang/Documents/Projects/circleup-design/product/features-epics-stories.pdf',
  format: 'A4',
  printBackground: true,
  margin: { top: '20mm', bottom: '20mm', left: '0', right: '0' },
  displayHeaderFooter: true,
  headerTemplate: '<div></div>',
  footerTemplate: '<div style="font-size:8px;color:#9ca3af;text-align:center;width:100%;font-family:sans-serif;">CircleUp — Features, Epics & User Stories &nbsp;&middot;&nbsp; Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
});
await browser.close();

console.log('PDF generated: product/features-epics-stories.pdf');
