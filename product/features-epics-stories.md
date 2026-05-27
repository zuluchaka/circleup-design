# CircleUp — Features, Epics & User Stories

> **Complete inventory of the CircleUp platform capabilities**
> Generated: 2026-05-27 (updated to include all features for web + Android + iOS across all stakeholders, with screenshot references) (updated to include all features for web + Android + iOS across all stakeholders, with screenshot references)

---

## Table of Contents

1. [Homepage & Landing](#1-homepage--landing)
2. [Authentication & Onboarding](#2-authentication--onboarding)
3. [Associations](#3-associations)
4. [Members & Trust](#4-members--trust)
5. [ROSCA Circles](#5-rosca-circles)
6. [Treasury & Funds](#6-treasury--funds)
7. [Credit & Lending](#7-credit--lending)
8. [Multi-Share](#8-multi-share)
9. [Governance & Voting](#9-governance--voting)
10. [Communication & Events](#10-communication--events)
11. [Documents](#11-documents)
12. [Projects & Fundraising](#12-projects--fundraising)
13. [Community & Social](#13-community--social)
14. [Analytics & Reporting](#14-analytics--reporting)
15. [AI Insights](#15-ai-insights)
16. [Federations](#16-federations)
17. [Platform Administration](#17-platform-administration)
18. [Business Relationships *(mobile-only)*](#18-business-relationships-mobile-only)
19. [Association Accounts *(mobile-only)*](#19-association-accounts-mobile-only)
20. [Onboarding Checklist *(mobile-only)*](#20-onboarding-checklist-mobile-only)
21. [Profile *(mobile-only)*](#21-profile-mobile-only)

## Stakeholder Catalog

| Role | Scope | What they do |
|---|---|---|
| **Prospective member** | Public (unauthenticated) | Learns about CircleUp on the homepage, takes the quiz, picks a plan, signs up |
| **Member** | Per-association | Contributes to circles, receives payouts, votes on proposals, joins events |
| **Treasurer** | Per-association | Manages treasury, approves welfare, reconciles ledger, signs off audits |
| **President / Chair** | Per-association | Owns governance, calls elections, approves above-threshold transactions |
| **Secretary** | Per-association | Manages documents, minutes, member records, events |
| **Organizer** | Per-circle | Creates and runs ROSCA circles, manages participants and cycles |
| **Auditor** | Per-association | Independent review of treasury, audit reports, FINMA filings |
| **Donor** | Per-campaign | Donates to fundraising campaigns, receives impact updates |
| **Circle Manager (CM)** | Mafao employee | Manages Business Relationships, onboards associations, drives revenue |
| **Platform Admin / Staff** | Mafao operator | KYC review, support tickets, FINMA reporting, feature flags |
| **Federation Lead** | Per-federation | Governs a federation of associations, consolidated finance, federation-wide votes |
| **System** | Automated | Background jobs, predictions, default coverage, audit logs, push notifications |

---

## 1. Homepage & Landing

**Feature:** Public-facing landing page for platform discovery, education, and user conversion.

> **Primary stakeholders:** Prospective member
>
> **Platforms:** Web ✓ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> Public, unauthenticated landing surface. The homepage's job is to qualify visitors (member vs organiser), educate them on ROSCAs / susus / tandas / paluwagans, build trust with social proof and security disclosures, and route them into the right sign-up flow. The mobile homepage is a focused 4-card primer; the web homepage is a 14-section marketing scroll with hero, stats, benefits, how-it-works, testimonials, comparison, examples, communities, trust, pricing, FAQ, and final CTA.

<div style="margin:14px 0;text-align:center;">
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/product/sections/homepage/homepage.png" alt="Web" style="width:380px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Web</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/00-homepage/screenshots/android/01-welcome.png" alt="Android — light" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Android — light</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/00-homepage/screenshots/android-dark/03-quiz.png" alt="Android — dark" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Android — dark</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/00-homepage/screenshots/ios/01-welcome.png" alt="iOS — light" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">iOS — light</figcaption></figure>
</div>

> **Primary stakeholders:** Prospective member
>
> **Platforms:** Web ✓ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> Public, unauthenticated landing surface. The homepage's job is to qualify visitors (member vs organiser), educate them on ROSCAs / susus / tandas / paluwagans, build trust with social proof and security disclosures, and route them into the right sign-up flow. The mobile homepage is a focused 4-card primer; the web homepage is a 14-section marketing scroll with hero, stats, benefits, how-it-works, testimonials, comparison, examples, communities, trust, pricing, FAQ, and final CTA.

**Representative screenshots:**

  - **Web:** `product/sections/homepage/homepage.png`
  - **Android (light):** `mobile/product/sections/00-homepage/screenshots/android/01-welcome.png`
  - **Android (dark):** `mobile/product/sections/00-homepage/screenshots/android-dark/03-quiz.png`
  - **iOS (light):** `mobile/product/sections/00-homepage/screenshots/ios/01-welcome.png`

### Epic 1.1: Platform Discovery & Value Proposition
| ID | User Story | Priority |
|----|-----------|----------|
| 1.1.1 | As a visitor, I want to see a hero section with clear value proposition and dual CTAs (Start Free Trial, Watch Demo) so I understand what CircleUp offers | P0 |
| 1.1.2 | As a visitor, I want to see trust badges (Bank-Level Encryption, Swiss Compliant, PCI-DSS) so I feel confident in the platform's security | P0 |
| 1.1.3 | As a visitor, I want to see a "How It Works" flow (Join → Contribute → Payout) so I understand the ROSCA process | P0 |
| 1.1.4 | As a visitor, I want to use an AI Savings Goal Calculator so I can estimate potential savings outcomes | P1 |
| 1.1.5 | As a visitor, I want to see a live activity feed of platform events so I can gauge platform activity | P2 |
| 1.1.6 | As a visitor, I want to see animated platform statistics counters (total saved, families helped) so I understand community impact | P1 |

### Epic 1.2: ROSCA Education & Cultural Context
| ID | User Story | Priority |
|----|-----------|----------|
| 1.2.1 | As a visitor, I want to see cultural name references (tontine, chit fund, tandas, susu) so I recognize my community's savings tradition | P0 |
| 1.2.2 | As a visitor, I want an interactive circle lifecycle guide so I understand how circles work step by step | P1 |
| 1.2.3 | As a visitor, I want to see a comparison table (Traditional ROSCA vs CircleUp) so I understand the platform's advantages | P0 |
| 1.2.4 | As a visitor, I want to see a Cultural Community Showcase (West African, Latin American, South Asian) so I feel represented | P1 |

### Epic 1.3: Persona-Based Qualification
| ID | User Story | Priority |
|----|-----------|----------|
| 1.3.1 | As a visitor, I want to choose between member and organizer paths so I get relevant information for my role | P1 |
| 1.3.2 | As a prospective member, I want a Savings Goal Planner tool so I can model my savings journey | P1 |
| 1.3.3 | As a prospective organizer, I want a Circle Size Calculator so I can plan my first circle | P1 |
| 1.3.4 | As a visitor, I want a "Try Before You Sign Up" sandbox so I can experience the platform risk-free | P2 |

### Epic 1.4: Interactive Readiness Assessment
| ID | User Story | Priority |
|----|-----------|----------|
| 1.4.1 | As a visitor, I want to take a Member Readiness quiz (~10 scenario-based questions) so I know if I'm ready to join a circle | P2 |
| 1.4.2 | As a visitor, I want to take an Organizer Readiness quiz so I know if I'm ready to run a circle | P2 |
| 1.4.3 | As a visitor, I want instant feedback per quiz answer and a final score with qualitative rating so I understand my preparedness | P2 |
| 1.4.4 | As a visitor, I want to share my quiz results or restart the quiz | P2 |

### Epic 1.5: Pricing & Fee Transparency
| ID | User Story | Priority |
|----|-----------|----------|
| 1.5.1 | As a visitor, I want to see a pricing tier table (Free, Basic CHF 29/mo, Pro CHF 99/mo, Enterprise) so I can choose the right plan | P0 |
| 1.5.2 | As a visitor, I want to see a fee breakdown (subscription, platform %, late fees, Emergency Fund 1%) so I understand all costs | P0 |
| 1.5.3 | As a visitor, I want a Cost Calculator so I can estimate my total costs based on my circle parameters | P1 |

### Epic 1.6: Support & Communication
| ID | User Story | Priority |
|----|-----------|----------|
| 1.6.1 | As a visitor, I want live chat support (2-min response target) so I can get immediate help | P1 |
| 1.6.2 | As a visitor, I want a Contact Form so I can submit inquiries | P0 |
| 1.6.3 | As a visitor, I want to book a demo via an embedded calendar so I can schedule a walkthrough | P1 |
| 1.6.4 | As a visitor, I want to subscribe to a newsletter so I can stay informed | P2 |

### Epic 1.7: Conversion & Registration Gateway
| ID | User Story | Priority |
|----|-----------|----------|
| 1.7.1 | As a mobile visitor, I want a sticky CTA button so I can register at any scroll position | P0 |
| 1.7.2 | As a visitor, I want streamlined registration (email/password/name + Google/Apple) so I can sign up quickly | P0 |
| 1.7.3 | As a visitor about to leave, I want to see an exit-intent modal (once per session) with value proposition and newsletter option | P2 |
| 1.7.4 | As a visitor, I want to see social proof near the registration form so I feel confident signing up | P1 |

### Epic 1.8: Accessibility & Localization
| ID | User Story | Priority |
|----|-----------|----------|
| 1.8.1 | As a visitor, I want a language selector (EN/FR/DE/IT/PT) with auto-detection so I can browse in my preferred language | P0 |
| 1.8.2 | As a visitor, I want the landing page to be fully accessible (screen reader support, keyboard navigation) | P0 |
| 1.8.3 | As a visitor, I want fast page loads (LCP < 2s, FID < 100ms, CLS < 0.1) | P0 |

### Epic 1.9: Mobile App Promotion
| ID | User Story | Priority |
|----|-----------|----------|
| 1.9.1 | As a mobile visitor, I want to see App Store/Google Play badges with QR codes so I can download the mobile app | P1 |
| 1.9.2 | As a visitor, I want to learn about mobile features (push notifications, biometric login, offline access) | P1 |

---

## 2. Authentication & Onboarding

**Feature:** Secure authentication gateway with registration, login, password recovery, verification, and profile onboarding.

> **Primary stakeholders:** Prospective member · Member
>
> **Platforms:** Web ✓ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> Account lifecycle: sign-up, sign-in, email verification, and a 4-step onboarding wizard (profile → identity → preferences → first circle). The wizard's last step shows a Recommended Circle for the user. Mobile adds platform-specific keychain / autofill support and a calm waiting-screen pattern for verification with a 30-second resend countdown.

<div style="margin:14px 0;text-align:center;">
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/product/sections/login/auth-flow.png" alt="Web" style="width:380px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Web</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/15-login/screenshots/android/01-signin.png" alt="Android — light" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Android — light</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/15-login/screenshots/ios/04-onboarding.png" alt="iOS — light" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">iOS — light</figcaption></figure>
</div>

> **Primary stakeholders:** Prospective member · Member
>
> **Platforms:** Web ✓ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> Account lifecycle: sign-up, sign-in, email verification, and a 4-step onboarding wizard (profile → identity → preferences → first circle). The wizard's last step shows a Recommended Circle for the user. Mobile adds platform-specific keychain / autofill support and a calm waiting-screen pattern for verification with a 30-second resend countdown.

**Representative screenshots:**

  - **Web:** `product/sections/login/auth-flow.png`
  - **Android (light):** `mobile/product/sections/15-login/screenshots/android/01-signin.png`
  - **iOS (light):** `mobile/product/sections/15-login/screenshots/ios/04-onboarding.png`

### Epic 2.1: Email Registration
| ID | User Story | Priority |
|----|-----------|----------|
| 2.1.1 | As a new user, I want to register with email, password, and name so I can create an account | P0 |
| 2.1.2 | As a new user, I want to see a password strength meter (8+ chars, 1 uppercase, 1 number) so I create a secure password | P0 |
| 2.1.3 | As a new user, I want to accept Terms of Service and Privacy Policy during registration | P0 |
| 2.1.4 | As a new user, I want to enter an optional referral code so my referrer gets credit | P1 |
| 2.1.5 | As a new user, I want to receive a verification email within 30 seconds of registration | P0 |
| 2.1.6 | As a new user, I want to start with a default Trust Score of 650 | P0 |

### Epic 2.2: Social Authentication
| ID | User Story | Priority |
|----|-----------|----------|
| 2.2.1 | As a new user, I want to register via Google OAuth 2.0/PKCE so I can sign up quickly | P0 |
| 2.2.2 | As a new user, I want to register via Apple Sign-In so I can sign up quickly | P0 |
| 2.2.3 | As a social auth user, I want my email auto-verified from the provider | P0 |
| 2.2.4 | As a social auth user, I want to be prompted for missing profile fields if provider data is incomplete | P0 |
| 2.2.5 | As a returning social user with an unlinked account, I want to be offered to create new or link existing account | P1 |

### Epic 2.3: Email Login
| ID | User Story | Priority |
|----|-----------|----------|
| 2.3.1 | As a returning user, I want to log in with email and password | P0 |
| 2.3.2 | As a returning user, I want a "Remember me" option for 30-day sessions | P0 |
| 2.3.3 | As a user, I want account lockout after 5 failed attempts with 15-minute cooldown so my account stays secure | P0 |
| 2.3.4 | As an unverified user attempting login, I want to be prompted to verify my email first | P0 |

### Epic 2.4: Password Recovery
| ID | User Story | Priority |
|----|-----------|----------|
| 2.4.1 | As a user, I want to request a password reset link via email | P0 |
| 2.4.2 | As a user, I want the reset link to be valid for 1 hour | P0 |
| 2.4.3 | As a user, I want the same confirmation message regardless of email existence to prevent enumeration attacks | P0 |
| 2.4.4 | As a user, I want password reset to invalidate all existing sessions | P0 |

### Epic 2.5: Email Verification
| ID | User Story | Priority |
|----|-----------|----------|
| 2.5.1 | As a new user, I want to verify my email by clicking a link (24-hour validity) | P0 |
| 2.5.2 | As a new user, I want to resend the verification email (rate-limited to 3/hour) | P0 |
| 2.5.3 | As a user with an expired verification link, I want to be offered a re-send option | P0 |

### Epic 2.6: Profile Onboarding Wizard
| ID | User Story | Priority |
|----|-----------|----------|
| 2.6.1 | As a verified user, I want a post-verification onboarding wizard (photo, phone, bio, location, language) | P0 |
| 2.6.2 | As a new user, I want to see a progress bar showing Trust Score improvement per completed step | P1 |
| 2.6.3 | As a new user, I want to skip onboarding steps with a persistent reminder to complete later | P0 |

### Epic 2.7: Language Selection
| ID | User Story | Priority |
|----|-----------|----------|
| 2.7.1 | As a user, I want a language selector (EN/FR/DE/IT/PT) available on all authentication pages | P0 |

---

## 3. Associations

**Feature:** Create, discover, and manage community organizations — including guided migration of existing associations, member rosters, ROSCA circles, and historical financial data onto CircleUp.

> **Primary stakeholders:** Member · Organizer · President · Treasurer · Secretary · Circle Manager
>
> **Platforms:** Web ✓ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> Create, join, brand, and configure associations — the top-level container that owns members, circles, treasury, governance, and documents. Web exposes the full create-association wizard plus the import/migration suite (member roster, ROSCA structure, historical financials). Mobile focuses on the day-to-day association hub plus the empty-state for brand-new users.

<div style="margin:14px 0;text-align:center;">
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/product/sections/associations/announcements-dashboard.png" alt="Web" style="width:380px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Web</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/01-associations/screenshots/android/02-dashboard.png" alt="Android — light" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Android — light</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/01-associations/screenshots/android-dark/01-list.png" alt="Android — dark" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Android — dark</figcaption></figure>
  - **iOS — light:** `mobile/product/sections/01-associations/screenshots/ios/02-dashboard.png` *(file not found at export time)*
</div>

> **Primary stakeholders:** Member · Organizer · President · Treasurer · Secretary · Circle Manager
>
> **Platforms:** Web ✓ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> Create, join, brand, and configure associations — the top-level container that owns members, circles, treasury, governance, and documents. Web exposes the full create-association wizard plus the import/migration suite (member roster, ROSCA structure, historical financials). Mobile focuses on the day-to-day association hub plus the empty-state for brand-new users.

**Representative screenshots:**

  - **Web:** `product/sections/associations/announcements-dashboard.png`
  - **Android (light):** `mobile/product/sections/01-associations/screenshots/android/02-dashboard.png`
  - **Android (dark):** `mobile/product/sections/01-associations/screenshots/android-dark/01-list.png`
  - **iOS (light):** `mobile/product/sections/01-associations/screenshots/ios/02-dashboard.png`

### Epic 3.1: Association Discovery & Browsing
| ID | User Story | Priority |
|----|-----------|----------|
| 3.1.1 | As a member, I want to view My Associations as a card grid with logo, name, member count, role badge, and unread activity indicator | P0 |
| 3.1.2 | As a user, I want to browse and search public associations by type, language, and location | P0 |
| 3.1.3 | As a user, I want to request to join a discovered association | P0 |

### Epic 3.2: Association Creation
| ID | User Story | Priority |
|----|-----------|----------|
| 3.2.1 | As a user, I want to create an association via a multi-step wizard that lets me choose between starting from scratch (name, type, description, visibility, language, branding) or importing an existing association via the guided migration wizard | P0 |
| 3.2.2 | As a creator, I want to select association type (cultural/religious/professional/savings/social/family) | P0 |
| 3.2.3 | As a creator, I want to upload a logo and cover image with crop functionality | P1 |
| 3.2.4 | As a creator, I want to set visibility (public/private) and default language | P0 |

### Epic 3.3: Association Dashboard
| ID | User Story | Priority |
|----|-----------|----------|
| 3.3.1 | As an association admin, I want to see a dashboard with member count, active circles, recent activity, and announcements | P0 |
| 3.3.2 | As an admin, I want quick action buttons for common tasks | P0 |
| 3.3.3 | As an admin, I want to view analytics (member growth, engagement metrics, circle activity summary) | P1 |

### Epic 3.4: Association Settings & Management
| ID | User Story | Priority |
|----|-----------|----------|
| 3.4.1 | As an admin, I want to manage association settings via tabs (General, Branding, Language & Culture, Privacy) | P0 |
| 3.4.2 | As an admin, I want to manage members via a searchable table with avatar, name, role dropdown, join date, and actions | P0 |
| 3.4.3 | As an admin, I want to change member roles (member/treasurer/secretary/president/admin) via dropdown | P0 |

### Epic 3.5: Member Invitations
| ID | User Story | Priority |
|----|-----------|----------|
| 3.5.1 | As an admin, I want to generate invite links for new members | P0 |
| 3.5.2 | As an admin, I want to send invitations via SMS, email, or WhatsApp | P0 |
| 3.5.3 | As an admin, I want to view and manage pending invitations | P0 |

### Epic 3.6: Association Setup & Configuration Import
| ID | User Story | Priority |
|----|-----------|----------|
| 3.6.1 | As an organizer, I want to import my association's profile and identity (name, description, logo, type, languages) so that our community's identity is preserved on CircleUp | P0 |
| 3.6.2 | As an organizer, I want to configure our governance structure and roles (up to 10 roles with permissions, committees, approval workflow, dues) so that our existing organizational hierarchy is reflected | P0 |
| 3.6.3 | As an organizer, I want to import our association rules and bylaws (PDF/DOCX upload or rich-text entry with template sections) so that our governing documents are accessible to all members | P1 |
| 3.6.4 | As an organizer, I want to configure privacy and visibility settings (Public/Semi-Private/Private presets with advanced toggles) so that our association's data exposure matches our preferences | P0 |
| 3.6.5 | As an organizer, I want to import our communication preferences and channels (notification channels, announcement permissions, meeting schedule) so that our existing communication patterns continue | P1 |

### Epic 3.7: Member Roster Import & Invitation
| ID | User Story | Priority |
|----|-----------|----------|
| 3.7.1 | As an organizer, I want to upload and parse a member data file (CSV/XLSX up to 10MB) with auto-detection of columns and confidence indicators so that I can quickly import our member list | P0 |
| 3.7.2 | As an organizer, I want to map member fields and validate data with a visual mapping interface (sample values, validation icons green/yellow/red, inline error editing) so that all member data is accurate | P0 |
| 3.7.3 | As an organizer, I want to assign roles and permissions during import with AI-assisted multilingual role matching and confidence scores so that members receive the correct CircleUp roles | P1 |
| 3.7.4 | As an organizer, I want to send bulk invitations via multiple channels (Email, Email+SMS, invitation code) with customizable templates and a real-time delivery dashboard so that all members are onboarded | P0 |
| 3.7.5 | As an organizer, I want to manually add members (quick-add form with first/last name required) so that I can include members not in the spreadsheet | P1 |
| 3.7.6 | As an organizer, I want to track import progress with a visual adoption funnel (Imported → Invited → Delivered → Registered → Active) and follow-up tools so that I can ensure complete onboarding | P1 |

### Epic 3.8: ROSCA Circle Structure Import
| ID | User Story | Priority |
|----|-----------|----------|
| 3.8.1 | As an organizer, I want to import circle configuration and parameters (name, contribution amount, frequency, positions, payout method, mid-cycle state, late payment rules, custom rules) so that our existing circle structure is preserved | P0 |
| 3.8.2 | As an organizer, I want to import circle member roster and payout order with drag-and-drop position assignment and 'Already Paid Out' markers so that the rotation order is accurately captured | P0 |
| 3.8.3 | As an organizer, I want to configure mid-cycle state and outstanding obligations with a member × cycle payment matrix and Emergency Fund balance so that in-progress circles continue without restart | P0 |
| 3.8.4 | As an organizer, I want to import multiple circles with a card dashboard showing all imported circles and bulk finalization so that all our association's circles are migrated together | P1 |
| 3.8.5 | As an organizer, I want circle import validation and consistency checks (member count = positions, contributions reconcile, payout amounts match) with blocking errors vs acknowledgeable warnings so that data integrity is guaranteed | P1 |

### Epic 3.9: Historical Financial Data Import
| ID | User Story | Priority |
|----|-----------|----------|
| 3.9.1 | As an organizer, I want to import contribution history from CSV/XLSX with auto-mapping of dates to cycles and discrepancy flagging so that our financial records are preserved on the platform | P1 |
| 3.9.2 | As an organizer, I want to import payout history with exact dates, amounts, and payment methods so that completed payout positions are accurately recorded | P1 |
| 3.9.3 | As an organizer, I want to import dues and fee history (upload file or manually set current standing per member) so that member financial standing is correctly initialized | P1 |
| 3.9.4 | As a member, I want my Trust Score bootstrapped from imported contribution data (punctuality 40%, completion 25%, tenure 15%, dues 20%, capped at 750) so that I start with a meaningful reputation score | P1 |
| 3.9.5 | As an organizer, I want all imported financial data archived with immutable audit trail (SHA-256 hashed files, transformation logs) so that we have regulatory-compliant records | P1 |

### Epic 3.10: Validation, Reconciliation & Go-Live
| ID | User Story | Priority |
|----|-----------|----------|
| 3.10.1 | As an organizer, I want a comprehensive pre-go-live validation (Association Config, Members, Circles, Permissions) with blocking errors vs warnings so that I'm confident the migration is correct before activating | P0 |
| 3.10.2 | As a member, I want a self-verification wizard on first login showing my imported profile, role, circle position, and contribution history so that I can confirm or dispute my data | P0 |
| 3.10.3 | As an organizer, I want controlled go-live activation (immediate or scheduled with countdown) with a 7-day Emergency Pause safety net so that I can safely activate the migration | P0 |
| 3.10.4 | As an organizer, I want post-migration support with a checklist widget, First Cycle Report, and 30-day Migration Success Report so that I can monitor the transition | P1 |

---

## 4. Members & Trust

**Feature:** Member directory, profiles, engagement tracking, and AI-powered Trust Score transparency.

> **Primary stakeholders:** Member · Treasurer · President · Auditor
>
> **Platforms:** Web ✓ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> Member directory with profiles, roles, and the AI Trust Score (0–1000 with a transparent factor breakdown). Mobile adds an empty-state for brand-new associations, a per-member profile view with verified-channels list, and an invite flow with email / SMS / link / QR options.

<div style="margin:14px 0;text-align:center;">
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/product/sections/members-and-trust/at-risk-members.png" alt="Web" style="width:380px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Web</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/02-members-and-trust/screenshots/android/01-directory.png" alt="Android — light" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Android — light</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/02-members-and-trust/screenshots/android-dark/03-trust.png" alt="Android — dark" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Android — dark</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/02-members-and-trust/screenshots/ios/02-profile.png" alt="iOS — light" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">iOS — light</figcaption></figure>
</div>

> **Primary stakeholders:** Member · Treasurer · President · Auditor
>
> **Platforms:** Web ✓ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> Member directory with profiles, roles, and the AI Trust Score (0–1000 with a transparent factor breakdown). Mobile adds an empty-state for brand-new associations, a per-member profile view with verified-channels list, and an invite flow with email / SMS / link / QR options.

**Representative screenshots:**

  - **Web:** `product/sections/members-and-trust/at-risk-members.png`
  - **Android (light):** `mobile/product/sections/02-members-and-trust/screenshots/android/01-directory.png`
  - **Android (dark):** `mobile/product/sections/02-members-and-trust/screenshots/android-dark/03-trust.png`
  - **iOS (light):** `mobile/product/sections/02-members-and-trust/screenshots/ios/02-profile.png`

### Epic 4.1: Member Directory
| ID | User Story | Priority |
|----|-----------|----------|
| 4.1.1 | As a member, I want to view a searchable/filterable member directory with trust score badges, roles, status, and join date | P0 |
| 4.1.2 | As a member, I want to see color-coded trust score badges for each member | P0 |

### Epic 4.2: Member Profiles
| ID | User Story | Priority |
|----|-----------|----------|
| 4.2.1 | As a member, I want to view member profiles with tabs for History, References, Engagement, and Settings | P0 |
| 4.2.2 | As a member, I want to give references for trusted members | P1 |
| 4.2.3 | As a member, I want to request references from other members | P1 |

### Epic 4.3: AI Trust Score
| ID | User Story | Priority |
|----|-----------|----------|
| 4.3.1 | As a member, I want to view my Trust Score as a circular gauge (0–1000) with color gradient | P0 |
| 4.3.2 | As a member, I want to see the factor breakdown (payment history 40%, verification 20%, tenure 15%, engagement 10%, network 10%, external 5%) | P0 |
| 4.3.3 | As a member, I want personalized recommendations to improve my Trust Score | P1 |

### Epic 4.4: At-Risk Member Monitoring
| ID | User Story | Priority |
|----|-----------|----------|
| 4.4.1 | As an organizer, I want to view flagged members with declining engagement or payment issues | P0 |
| 4.4.2 | As an organizer, I want to see trend arrows and recommended actions for at-risk members | P1 |

### Epic 4.5: Feedback & Disputes
| ID | User Story | Priority |
|----|-----------|----------|
| 4.5.1 | As a member, I want to rate my circle experience and provide feedback on organizers/members | P1 |
| 4.5.2 | As a member, I want to file a dispute with evidence upload via a multi-step form | P1 |
| 4.5.3 | As a member, I want to track dispute status via a timeline view | P1 |
| 4.5.4 | As a member, I want disputes to have an escalation path | P1 |

---

## 5. ROSCA Circles

**Feature:** Full lifecycle management of rotating savings circles with automated payments, AI features, and emergency fund protection.

> **Primary stakeholders:** Member · Organizer · Treasurer
>
> **Platforms:** Web ✓ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> The core ROSCA experience: automated contributions, payout disbursement, default prediction, and Emergency-Fund protection. The mobile section spans 32 screens across 8 phases — discovery, joining, creating/renewing, live cycle ops, action sheets (pay-for-member, position-swap, bidding, payout-advance), health/risk, settings, and admin monitoring.

<div style="margin:14px 0;text-align:center;">
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/product/sections/rosca-circles/admin-circle-monitoring.png" alt="Web" style="width:380px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Web</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/03-rosca-circles/screenshots/android/01-my-circles.png" alt="Android — light" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Android — light</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/03-rosca-circles/screenshots/android-dark/02-circle-detail.png" alt="Android — dark" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Android — dark</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/03-rosca-circles/screenshots/ios/01-my-circles.png" alt="iOS — light" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">iOS — light</figcaption></figure>
</div>

> **Primary stakeholders:** Member · Organizer · Treasurer
>
> **Platforms:** Web ✓ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> The core ROSCA experience: automated contributions, payout disbursement, default prediction, and Emergency-Fund protection. The mobile section spans 32 screens across 8 phases — discovery, joining, creating/renewing, live cycle ops, action sheets (pay-for-member, position-swap, bidding, payout-advance), health/risk, settings, and admin monitoring.

**Representative screenshots:**

  - **Web:** `product/sections/rosca-circles/admin-circle-monitoring.png`
  - **Android (light):** `mobile/product/sections/03-rosca-circles/screenshots/android/01-my-circles.png`
  - **Android (dark):** `mobile/product/sections/03-rosca-circles/screenshots/android-dark/02-circle-detail.png`
  - **iOS (light):** `mobile/product/sections/03-rosca-circles/screenshots/ios/01-my-circles.png`

### Epic 5.1: Circle Discovery & Browsing
| ID | User Story | Priority |
|----|-----------|----------|
| 5.1.1 | As a user, I want to browse circles in a searchable grid filtered by contribution amount, duration, location, type, and language | P0 |
| 5.1.2 | As a member, I want to see My Circles dashboard with progress rings (cycle X of Y) | P0 |

### Epic 5.2: Circle Creation
| ID | User Story | Priority |
|----|-----------|----------|
| 5.2.1 | As an organizer, I want to create a circle via multi-step wizard (basics → schedule → allocation method → penalties → invite → review) | P0 |
| 5.2.2 | As an organizer, I want to select a payout method (fixed/random/bidding/trust_score) | P0 |
| 5.2.3 | As an organizer, I want to set contribution amount and frequency (weekly/bi-weekly/monthly) | P0 |
| 5.2.4 | As an organizer, I want to configure penalties and grace periods | P0 |
| 5.2.5 | As an organizer, I want AI configuration suggestions for optimal circle settings | P1 |

### Epic 5.3: Circle Membership
| ID | User Story | Priority |
|----|-----------|----------|
| 5.3.1 | As an organizer, I want to invite members via SMS, WhatsApp, email, QR code, and social sharing | P0 |
| 5.3.2 | As a user, I want to view circle terms and accept an invitation to join | P0 |
| 5.3.3 | As a user, I want to join a waitlist if the circle is full | P1 |
| 5.3.4 | As a member, I want to request a position swap in the payout schedule | P1 |
| 5.3.5 | As an organizer, I want to manage a waitlist and handle member removal | P0 |

### Epic 5.4: Circle Detail & Schedule
| ID | User Story | Priority |
|----|-----------|----------|
| 5.4.1 | As a member, I want to view the circle detail page with member roster, trust scores, payout schedule, and financial summary | P0 |
| 5.4.2 | As a member, I want to see a visual payout schedule calendar with my payout highlighted and countdown | P0 |
| 5.4.3 | As a member, I want to export the payout schedule to my calendar | P1 |

### Epic 5.5: Contributions
| ID | User Story | Priority |
|----|-----------|----------|
| 5.5.1 | As a member, I want to make a contribution by selecting a payment method and completing payment | P0 |
| 5.5.2 | As a member, I want to receive a confirmation receipt after contributing | P0 |
| 5.5.3 | As a member, I want to make a partial contribution and track the remaining balance | P0 |
| 5.5.4 | As a member, I want to schedule catch-up payments for missed contributions | P1 |
| 5.5.5 | As a member, I want to pay for another member's contribution with optional repayment tracking | P1 |
| 5.5.6 | As a member, I want to set up auto-pay with backup payment methods | P0 |

### Epic 5.6: Payouts
| ID | User Story | Priority |
|----|-----------|----------|
| 5.6.1 | As a member, I want to track my scheduled payout status | P0 |
| 5.6.2 | As a member, I want to choose my payout disbursement method | P0 |
| 5.6.3 | As a member in a bidding circle, I want to submit bids during the bidding window | P1 |
| 5.6.4 | As a member in a bidding circle, I want to see winner announcements after the bidding window closes | P1 |

### Epic 5.7: Circle Management (Organizer)
| ID | User Story | Priority |
|----|-----------|----------|
| 5.7.1 | As an organizer, I want to pause or extend a circle | P0 |
| 5.7.2 | As an organizer, I want to record cash collections with receipt generation and reconciliation | P1 |
| 5.7.3 | As an organizer, I want to manage disputes with evidence upload and resolution timeline | P1 |

### Epic 5.8: Financial Monitoring
| ID | User Story | Priority |
|----|-----------|----------|
| 5.8.1 | As a treasurer, I want to view real-time fund balances, pending transactions, and expected vs actual contributions | P0 |
| 5.8.2 | As a treasurer, I want to see cash flow projections | P1 |
| 5.8.3 | As an organizer, I want AI-predicted default risk scores (0–100) for each member with factor breakdown | P1 |

### Epic 5.9: Emergency Fund
| ID | User Story | Priority |
|----|-----------|----------|
| 5.9.1 | As a member, I want 1% of every contribution automatically allocated to the Emergency Fund | P0 |
| 5.9.2 | As a member, I want to view the Emergency Fund balance gauge and intervention history | P0 |
| 5.9.3 | As a member, I want to see member repayment progress for Emergency Fund interventions | P1 |

---

## 6. Treasury & Funds

**Feature:** Multi-fund accounting, reconciliation, welfare fund management, and audit compliance.

> **Primary stakeholders:** Treasurer · President · Auditor
>
> **Platforms:** Web ✓ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> Multi-fund accounting with audit trails: overview dashboard, per-fund details, transaction ledger, request workflow, approval queue, reconciliation, reports, audit reports, statements, multi-currency, investments, and Swiss-specific integrations (PostFinance import, external bank accounts).

<div style="margin:14px 0;text-align:center;">
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/product/sections/treasury-and-funds/audit-report-generator.png" alt="Web" style="width:380px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Web</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/04-treasury-and-funds/screenshots/android/01-overview.png" alt="Android — light" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Android — light</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/04-treasury-and-funds/screenshots/ios/01-overview.png" alt="iOS — light" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">iOS — light</figcaption></figure>
</div>

> **Primary stakeholders:** Treasurer · President · Auditor
>
> **Platforms:** Web ✓ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> Multi-fund accounting with audit trails: overview dashboard, per-fund details, transaction ledger, request workflow, approval queue, reconciliation, reports, audit reports, statements, multi-currency, investments, and Swiss-specific integrations (PostFinance import, external bank accounts).

**Representative screenshots:**

  - **Web:** `product/sections/treasury-and-funds/audit-report-generator.png`
  - **Android (light):** `mobile/product/sections/04-treasury-and-funds/screenshots/android/01-overview.png`
  - **iOS (light):** `mobile/product/sections/04-treasury-and-funds/screenshots/ios/01-overview.png`

### Epic 6.1: Treasury Dashboard
| ID | User Story | Priority |
|----|-----------|----------|
| 6.1.1 | As a treasurer, I want to see portfolio value with trend indicator, fund breakdown, pending transactions, and 30-day cash flow | P0 |
| 6.1.2 | As a treasurer, I want quick actions (Transfer, Reconcile, Generate Report) | P0 |

### Epic 6.2: Circle Fund Management
| ID | User Story | Priority |
|----|-----------|----------|
| 6.2.1 | As a treasurer, I want to view each circle's segregated fund with current balance (available vs held) | P0 |
| 6.2.2 | As a treasurer, I want to view transaction history with filters for each fund | P0 |
| 6.2.3 | As a treasurer, I want to see fund allocation pie charts | P1 |

### Epic 6.3: Transaction Ledger
| ID | User Story | Priority |
|----|-----------|----------|
| 6.3.1 | As a treasurer, I want a searchable transaction table with date, type, description, amount, balance, and status | P0 |
| 6.3.2 | As a treasurer, I want advanced filters and batch export (CSV/PDF) | P0 |
| 6.3.3 | As a treasurer, I want to expand a row to see the full audit trail | P0 |

### Epic 6.4: Reconciliation
| ID | User Story | Priority |
|----|-----------|----------|
| 6.4.1 | As a treasurer, I want daily automated reconciliation with matched/unmatched/pending summary | P0 |
| 6.4.2 | As a treasurer, I want a discrepancy list with severity levels and side-by-side comparison | P0 |
| 6.4.3 | As a treasurer, I want a resolution workflow for discrepancies | P0 |
| 6.4.4 | As a treasurer, I want to view historical reconciliation reports | P1 |

### Epic 6.5: Emergency Fund Management
| ID | User Story | Priority |
|----|-----------|----------|
| 6.5.1 | As a member, I want to view the Emergency Fund balance and utilization rate | P0 |
| 6.5.2 | As a member, I want to submit an Emergency Fund request (amount, reason, documents) | P0 |
| 6.5.3 | As a member, I want to vote on active Emergency Fund requests (approve/deny) | P0 |
| 6.5.4 | As a treasurer, I want to configure fund replenishment settings | P1 |

### Epic 6.6: Investment Management
| ID | User Story | Priority |
|----|-----------|----------|
| 6.6.1 | As a treasurer, I want to view a portfolio summary with yield and available instruments (money market, T-bills) | P2 |
| 6.6.2 | As a treasurer, I want to adjust allocation sliders and see projected returns | P2 |
| 6.6.3 | As a treasurer, I want performance charts, risk badges, and liquidity timelines | P2 |

### Epic 6.7: Multi-Currency
| ID | User Story | Priority |
|----|-----------|----------|
| 6.7.1 | As a treasurer, I want to view supported currencies with exchange rates | P1 |
| 6.7.2 | As a treasurer, I want to set a default currency per circle | P1 |
| 6.7.3 | As a treasurer, I want exchange rate alerts and a conversion calculator | P2 |

### Epic 6.8: Audit Reporting
| ID | User Story | Priority |
|----|-----------|----------|
| 6.8.1 | As a treasurer, I want to generate audit reports by type, date range, and circle/fund | P0 |
| 6.8.2 | As a treasurer, I want to preview reports before exporting (PDF/Excel/CSV) | P0 |
| 6.8.3 | As a treasurer, I want to schedule recurring reports and view report history | P1 |

---

## 7. Credit & Lending

**Feature:** Credit products built on ROSCA participation history, bridging community savings to formal financial services.

> **Primary stakeholders:** Member · Treasurer
>
> **Platforms:** Web ✓ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> CircleUp credit score, payout advances (auto-repaid from next payout), pre-approved personal loans backed by circle participation, and opt-in bureau reporting (TransUnion CH). All flows surface the FINMA responsible-lending disclosure.

<div style="margin:14px 0;text-align:center;">
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/product/sections/credit-and-lending/CollectiveLending.png" alt="Web" style="width:380px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Web</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/09-credit-and-lending/screenshots/android/01-score.png" alt="Android — light" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Android — light</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/09-credit-and-lending/screenshots/android-dark/02-advance.png" alt="Android — dark" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Android — dark</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/09-credit-and-lending/screenshots/ios/03-loan.png" alt="iOS — light" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">iOS — light</figcaption></figure>
</div>

> **Primary stakeholders:** Member · Treasurer
>
> **Platforms:** Web ✓ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> CircleUp credit score, payout advances (auto-repaid from next payout), pre-approved personal loans backed by circle participation, and opt-in bureau reporting (TransUnion CH). All flows surface the FINMA responsible-lending disclosure.

**Representative screenshots:**

  - **Web:** `product/sections/credit-and-lending/CollectiveLending.png`
  - **Android (light):** `mobile/product/sections/09-credit-and-lending/screenshots/android/01-score.png`
  - **Android (dark):** `mobile/product/sections/09-credit-and-lending/screenshots/android-dark/02-advance.png`
  - **iOS (light):** `mobile/product/sections/09-credit-and-lending/screenshots/ios/03-loan.png`

### Epic 7.1: Credit Score & Education
| ID | User Story | Priority |
|----|-----------|----------|
| 7.1.1 | As a member, I want to view my CircleUp credit score (0–1000) with factor breakdown | P0 |
| 7.1.2 | As a member, I want a credit score simulator with "what-if" sliders | P1 |
| 7.1.3 | As a member, I want personalized credit-building tips | P1 |
| 7.1.4 | As a member, I want pre-qualification checks without a hard inquiry | P0 |

### Epic 7.2: Payout Advances
| ID | User Story | Priority |
|----|-----------|----------|
| 7.2.1 | As a member, I want to check my eligibility for a payout advance based on contribution history | P0 |
| 7.2.2 | As a member, I want to see advance amount limits and fee/interest disclosure | P0 |
| 7.2.3 | As a member, I want instant decision on my advance request | P0 |
| 7.2.4 | As a member, I want auto-repayment deducted from my future payout | P0 |
| 7.2.5 | As a member, I want an early repayment calculator | P1 |

### Epic 7.3: Personal Loans
| ID | User Story | Priority |
|----|-----------|----------|
| 7.3.1 | As a member, I want to apply for a personal loan backed by my circle participation history | P1 |
| 7.3.2 | As a member, I want to upload required documents for my loan application | P1 |
| 7.3.3 | As a member, I want to track my loan application status | P1 |
| 7.3.4 | As a member, I want to view my repayment schedule with amortization table | P1 |
| 7.3.5 | As a member, I want to request a guarantor/co-signer from trusted circle members | P1 |
| 7.3.6 | As a member, I want to refinance at improved rates as my credit score improves | P2 |
| 7.3.7 | As a member, I want payment restructuring options for hardship situations | P1 |

### Epic 7.4: Collective Lending
| ID | User Story | Priority |
|----|-----------|----------|
| 7.4.1 | As a circle, I want to propose group lending for members with larger expenses | P2 |
| 7.4.2 | As a circle member, I want to vote on loan requests from other members | P2 |
| 7.4.3 | As a circle, I want collective guarantee with repayment to the circle fund | P2 |

### Epic 7.5: Credit Bureau & Banking Integration
| ID | User Story | Priority |
|----|-----------|----------|
| 7.5.1 | As a member, I want to opt-in to credit bureau reporting | P1 |
| 7.5.2 | As a member, I want to track my credit-building progress | P1 |
| 7.5.3 | As a member, I want to export loan documentation | P1 |
| 7.5.4 | As a member, I want introductions to partner banks based on my credit performance | P2 |

### Epic 7.6: Loan Portfolio Management (Platform)
| ID | User Story | Priority |
|----|-----------|----------|
| 7.6.1 | As a platform operator, I want a loan portfolio risk dashboard with early warning indicators | P0 |
| 7.6.2 | As a platform operator, I want collection workflows for overdue loans | P0 |
| 7.6.3 | As a platform operator, I want write-off procedures for defaulted loans | P1 |

---

## 8. Multi-Share

**Feature:** Enhanced ROSCA functionality allowing members to hold 1–10 shares of the base contribution with proportionally larger payouts.

> **Primary stakeholders:** Member · Treasurer · Auditor · Platform Admin
>
> **Platforms:** Web ✓ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> Multiple-share contributions: trusted members can hold 1–10 shares per circle, contributing N× and receiving N× the payout. Eligibility is gated by Trust Score (≥700), tenure (≥12 months), missed-payment history, and a 30% concentration cap. Approval flow runs through Treasurer + Auditor.

<div style="margin:14px 0;text-align:center;">
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/product/sections/multi-share/circle-dashboard.png" alt="Web" style="width:380px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Web</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/12-multi-share/screenshots/android/01-my-shares.png" alt="Android — light" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Android — light</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/12-multi-share/screenshots/ios/02-request.png" alt="iOS — light" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">iOS — light</figcaption></figure>
</div>

> **Primary stakeholders:** Member · Treasurer · Auditor · Platform Admin
>
> **Platforms:** Web ✓ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> Multiple-share contributions: trusted members can hold 1–10 shares per circle, contributing N× and receiving N× the payout. Eligibility is gated by Trust Score (≥700), tenure (≥12 months), missed-payment history, and a 30% concentration cap. Approval flow runs through Treasurer + Auditor.

**Representative screenshots:**

  - **Web:** `product/sections/multi-share/circle-dashboard.png`
  - **Android (light):** `mobile/product/sections/12-multi-share/screenshots/android/01-my-shares.png`
  - **iOS (light):** `mobile/product/sections/12-multi-share/screenshots/ios/02-request.png`

### Epic 8.1: Multi-Share Circle Configuration (P0)
| ID | User Story | Priority |
|----|-----------|----------|
| 8.1.1 | As an organizer, I want to enable a multi-share toggle during circle creation (default OFF) | P0 |
| 8.1.2 | As an organizer, I want to set maximum shares per member (2–10, default 3) | P0 |
| 8.1.3 | As an organizer, I want to configure share request approval mode (Auto-Approve vs. Organizer Approval) | P0 |
| 8.1.4 | As a user, I want to view a multi-share impact calculator showing real-time min/max pool value | P0 |
| 8.1.5 | As an organizer, I want to edit multi-share settings only while circle is in Forming status | P0 |
| 8.1.6 | As a member, I want to view circle terms with multi-share details before joining | P0 |
| 8.1.7 | As an organizer, I want to configure a share lock period to protect critical cycles | P1 |
| 8.1.8 | As an organizer, I want to set a minimum share holding period to prevent rapid changes | P1 |

### Epic 8.2: Share Request & Allocation (P0)
| ID | User Story | Priority |
|----|-----------|----------|
| 8.2.1 | As a member, I want to request additional shares via a modal with impact calculator | P0 |
| 8.2.2 | As an organizer, I want to approve/reject share requests with Trust Score context and impact analysis | P0 |
| 8.2.3 | As a member, I want to cancel a pending share request | P0 |
| 8.2.4 | As a member, I want to request share reduction with payout impact warning | P0 |
| 8.2.5 | As a member, I want to view my share allocation history timeline | P1 |
| 8.2.6 | As a member, I want to receive share request notifications (push + email) | P0 |
| 8.2.7 | As a member, I want to join a share waitlist when the circle is at capacity | P1 |
| 8.2.8 | As a member, I want to transfer shares to another member (72-hour acceptance window) | P1 |
| 8.2.9 | As a member, I want to request emergency share reduction with hardship documentation | P1 |

### Epic 8.3: Multi-Share Contribution Processing (P0)
| ID | User Story | Priority |
|----|-----------|----------|
| 8.3.1 | As a system, contributions are calculated as shares × base amount | P0 |
| 8.3.2 | As a member, I want to see my contribution with full breakdown (shares × base, Emergency Fund, platform fee, total) | P0 |
| 8.3.3 | As a member, I want my multi-share payment processed as a single transaction | P0 |
| 8.3.4 | As a member, I want a detailed contribution receipt with share breakdown (PDF/email) | P0 |
| 8.3.5 | As a member, I want contribution reminders showing exact multi-share amounts | P0 |
| 8.3.6 | As a member, I want graduated auto-pay with split payment options (2 payments, weekly, custom dates) | P1 |
| 8.3.7 | As a member, I want a payment comparison simulator (current vs. potential share scenarios) | P1 |

### Epic 8.4: Multi-Share Payout Processing (P0)
| ID | User Story | Priority |
|----|-----------|----------|
| 8.4.1 | As a member, I want my payout calculated proportionally to my share count | P0 |
| 8.4.2 | As an organizer, I want to configure payout order (Consolidated vs. Distributed) | P0 |
| 8.4.3 | As a member, I want to view payout projections with share details | P0 |
| 8.4.4 | As a system, multi-share payouts are processed within 24 hours of cycle completion | P0 |
| 8.4.5 | As a member, I want a payout receipt with calculation breakdown (PDF with QR verification code) | P0 |
| 8.4.6 | As a system, Emergency Fund covers the full default amount; shortfalls are distributed proportionally | P0 |
| 8.4.7 | As a member, I want to request payout position swap (individual or all positions in distributed mode) | P1 |
| 8.4.8 | As a member, I want to configure payout acceleration (premium fee to move up positions) | P2 |

### Epic 8.5: Multi-Share Dashboard & Reporting (P1)
| ID | User Story | Priority |
|----|-----------|----------|
| 8.5.1 | As a member, I want to view the circle's share distribution chart (donut/pie) | P1 |
| 8.5.2 | As an organizer, I want analytics on share request metrics and concentration index | P1 |
| 8.5.3 | As a member, I want a personal multi-share summary across all my circles | P1 |
| 8.5.4 | As a member, I want to export transaction history with share details (CSV/PDF) | P1 |
| 8.5.5 | As a member, I want to view real-time circle pool status (X of Y shares contributed) | P1 |
| 8.5.6 | As an organizer, I want share concentration alerts (single member >30% or top-2 >50%) | P1 |
| 8.5.7 | As a member, I want to compare multi-share performance across circles | P2 |
| 8.5.8 | As a member, I want to see Trust Score impact of multi-share participation | P1 |

### Epic 8.6: Multi-Share Platform Administration & Compliance (P0/P1)
| ID | User Story | Priority |
|----|-----------|----------|
| 8.6.1 | As a platform admin, I want to configure platform-wide limits (global max shares, KYC requirements) | P0 |
| 8.6.2 | As a platform admin, I want to monitor platform-wide multi-share metrics (adoption %, average shares/member) | P1 |
| 8.6.3 | As a platform admin, I want multi-share dispute resolution tools with complete share history | P1 |
| 8.6.4 | As a platform admin, I want to generate compliance reports (AML patterns, FINMA formats, audit trail) | P0 |
| 8.6.5 | As a platform admin, I want to configure Trust Score requirements per share tier (1–2: min 500; 3–4: min 650; 5+: min 750) | P0 |
| 8.6.6 | As a platform admin, I want detection and flagging of suspicious share patterns | P0 |
| 8.6.7 | As a platform admin, I want to manage share-related refunds and adjustments with batch processing | P1 |
| 8.6.8 | As a platform admin, I want risk assessment reports (high-concentration circles, default probability by share tier) | P1 |

### Epic 8.7: Multi-Share Education & Onboarding (P1/P2)
| ID | User Story | Priority |
|----|-----------|----------|
| 8.7.1 | As a first-time multi-share member, I want to complete a required education module (5 slides + quiz, 4/5 to pass, earns badge) | P1 |
| 8.7.2 | As a prospective member, I want an interactive multi-share scenario simulator (sliders, cash flow calendar, comparison, find-similar-circle) | P1 |
| 8.7.3 | As a first-time multi-share member, I want contextual onboarding tips at key moments during my first cycle | P2 |

---

## 9. Governance & Voting

**Feature:** Democratic decision-making through elections, proposals, committees, and flexible voting models.

> **Primary stakeholders:** Member · President · Treasurer · Secretary
>
> **Platforms:** Web ✓ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> Proposals, ballots, elections, and committees. The ballot screen runs eligibility checks live, surfaces quorum + vote breakdown, and uses a sticky vote bar. Elections show candidate cards with pitch, trust, endorsements, and live vote share.

<div style="margin:14px 0;text-align:center;">
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/product/sections/governance-and-voting/candidate-profile.png" alt="Web" style="width:380px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Web</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/05-governance-and-voting/screenshots/android/01-proposals.png" alt="Android — light" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Android — light</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/05-governance-and-voting/screenshots/android-dark/03-elections.png" alt="Android — dark" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Android — dark</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/05-governance-and-voting/screenshots/ios/02-ballot.png" alt="iOS — light" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">iOS — light</figcaption></figure>
</div>

> **Primary stakeholders:** Member · President · Treasurer · Secretary
>
> **Platforms:** Web ✓ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> Proposals, ballots, elections, and committees. The ballot screen runs eligibility checks live, surfaces quorum + vote breakdown, and uses a sticky vote bar. Elections show candidate cards with pitch, trust, endorsements, and live vote share.

**Representative screenshots:**

  - **Web:** `product/sections/governance-and-voting/candidate-profile.png`
  - **Android (light):** `mobile/product/sections/05-governance-and-voting/screenshots/android/01-proposals.png`
  - **Android (dark):** `mobile/product/sections/05-governance-and-voting/screenshots/android-dark/03-elections.png`
  - **iOS (light):** `mobile/product/sections/05-governance-and-voting/screenshots/ios/02-ballot.png`

### Epic 9.1: Governance Dashboard
| ID | User Story | Priority |
|----|-----------|----------|
| 9.1.1 | As a member, I want a governance dashboard with active elections (countdown), pending proposals, committee activity, and upcoming calendar | P0 |
| 9.1.2 | As a member, I want to see governance health indicators (participation rates, quorum status) | P1 |

### Epic 9.2: Election Management
| ID | User Story | Priority |
|----|-----------|----------|
| 9.2.1 | As an admin, I want to create an election via wizard (positions/dates/eligibility) | P0 |
| 9.2.2 | As an admin, I want to manage nominations (self-nomination or admin-nominated) | P0 |
| 9.2.3 | As an admin, I want to configure voting periods | P0 |
| 9.2.4 | As a member, I want to see real-time tally (visible or hidden per configuration) | P0 |
| 9.2.5 | As a system, I want to declare winners and trigger runoffs for ties | P0 |
| 9.2.6 | As a member, I want election status badges (Upcoming/Active/Closed/Certified) | P0 |

### Epic 9.3: Proposal Center
| ID | User Story | Priority |
|----|-----------|----------|
| 9.3.1 | As a member, I want to submit a proposal (title, description, category, attachments) | P0 |
| 9.3.2 | As a member, I want to participate in proposal discussion threads | P0 |
| 9.3.3 | As a member, I want to submit amendments to proposals | P1 |
| 9.3.4 | As a member, I want to see proposal lifecycle stages (Draft → Under Review → Voting → Passed/Rejected → Implemented) | P0 |
| 9.3.5 | As a member, I want to filter proposals by status, category, and author | P0 |

### Epic 9.4: Voting Booth
| ID | User Story | Priority |
|----|-----------|----------|
| 9.4.1 | As a member, I want to preview my ballot before voting | P0 |
| 9.4.2 | As a member, I want a candidate comparison view for elections | P1 |
| 9.4.3 | As a member, I want vote confirmation with an anonymized receipt | P0 |
| 9.4.4 | As a member, I want the option to change my vote (if rules allow) | P1 |
| 9.4.5 | As a member, I want to abstain with a reason | P1 |

### Epic 9.5: Committees
| ID | User Story | Priority |
|----|-----------|----------|
| 9.5.1 | As a member, I want to browse committees (name, purpose, member count) | P1 |
| 9.5.2 | As a member, I want to view committee details with roster, chair/vice-chair, meetings, and documents | P1 |
| 9.5.3 | As a member, I want to request to join a committee | P1 |
| 9.5.4 | As an admin, I want to create committees and assign chairs | P1 |

### Epic 9.6: Governance Settings
| ID | User Story | Priority |
|----|-----------|----------|
| 9.6.1 | As an admin, I want to select a voting model (Simple Majority/Supermajority/Consensus/Weighted) | P0 |
| 9.6.2 | As an admin, I want to configure quorum requirements | P0 |
| 9.6.3 | As an admin, I want to set term limits and proxy voting options | P1 |
| 9.6.4 | As an admin, I want to choose secret vs open ballot | P0 |
| 9.6.5 | As an admin, I want cultural presets (Parliamentary, Consensus-based, Elder Council) | P2 |

### Epic 9.7: Decision Archive
| ID | User Story | Priority |
|----|-----------|----------|
| 9.7.1 | As a member, I want to search past elections and proposals with filter by date, type, and outcome | P1 |
| 9.7.2 | As a member, I want detailed result breakdowns and document attachments | P1 |
| 9.7.3 | As a member, I want to export decision records | P1 |

### Epic 9.8: Candidate Profiles
| ID | User Story | Priority |
|----|-----------|----------|
| 9.8.1 | As a candidate, I want a campaign page with photo, bio, platform statement, and endorsements | P1 |
| 9.8.2 | As a member, I want to ask candidates questions via a Q&A section | P2 |

---

## 10. Communication & Events

**Feature:** Multi-channel messaging, announcements, and event management with cultural and accessibility support.

> **Primary stakeholders:** Member · Organizer · Secretary
>
> **Platforms:** Web ✓ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> Multi-channel messaging (in-app, email, SMS, push, WhatsApp) plus events with RSVPs, QR check-in, and association-wide announcement composer. Mobile uses a Messages tab as the bottom-nav inbox; web uses the announcements dashboard.

<div style="margin:14px 0;text-align:center;">
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/product/sections/communication-and-events/admin-events-overview.png" alt="Web" style="width:380px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Web</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/06-communication-and-events/screenshots/android/01-inbox.png" alt="Android — light" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Android — light</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/06-communication-and-events/screenshots/ios/03-events.png" alt="iOS — light" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">iOS — light</figcaption></figure>
</div>

> **Primary stakeholders:** Member · Organizer · Secretary
>
> **Platforms:** Web ✓ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> Multi-channel messaging (in-app, email, SMS, push, WhatsApp) plus events with RSVPs, QR check-in, and association-wide announcement composer. Mobile uses a Messages tab as the bottom-nav inbox; web uses the announcements dashboard.

**Representative screenshots:**

  - **Web:** `product/sections/communication-and-events/admin-events-overview.png`
  - **Android (light):** `mobile/product/sections/06-communication-and-events/screenshots/android/01-inbox.png`
  - **iOS (light):** `mobile/product/sections/06-communication-and-events/screenshots/ios/03-events.png`

### Epic 10.1: Unified Inbox
| ID | User Story | Priority |
|----|-----------|----------|
| 10.1.1 | As a member, I want a unified inbox for all notifications, messages, and announcements | P0 |
| 10.1.2 | As a member, I want to filter inbox by type, read status, and date | P0 |

### Epic 10.2: Conversations & Messaging
| ID | User Story | Priority |
|----|-----------|----------|
| 10.2.1 | As a member, I want direct messages and group chats with unread indicators | P0 |
| 10.2.2 | As a member, I want rich chat with read receipts, typing indicators, file attachments, pinned messages, and reply threading | P0 |

### Epic 10.3: Announcements
| ID | User Story | Priority |
|----|-----------|----------|
| 10.3.1 | As a member, I want to view announcements with priority indicators (normal/important/urgent) | P0 |
| 10.3.2 | As an admin, I want to compose announcements with rich text, audience targeting, scheduled sending, and recurring options | P0 |
| 10.3.3 | As an admin, I want to track acknowledgment of announcements | P0 |

### Epic 10.4: Multi-Channel Delivery
| ID | User Story | Priority |
|----|-----------|----------|
| 10.4.1 | As a member, I want payment reminders at 7/3/1 days before due date with escalating urgency | P0 |
| 10.4.2 | As a system, I want WhatsApp Business API integration with two-way messaging | P1 |
| 10.4.3 | As a system, I want SMS gateway support for low-connectivity members | P1 |
| 10.4.4 | As a system, I want USSD support for rural areas with basic phones (critical alerts only) | P2 |
| 10.4.5 | As a system, I want multi-language support (EN/FR/DE/IT/PT) with automatic translation for announcements | P0 |

### Epic 10.5: Events Calendar
| ID | User Story | Priority |
|----|-----------|----------|
| 10.5.1 | As a member, I want to view events in monthly, weekly, or list format | P0 |
| 10.5.2 | As a member, I want to RSVP (going/maybe/not going) and view attendee lists | P0 |
| 10.5.3 | As a member, I want to purchase tickets for paid events via Stripe | P1 |

### Epic 10.6: Event Management
| ID | User Story | Priority |
|----|-----------|----------|
| 10.6.1 | As an organizer, I want to create events (meeting/celebration/fundraiser/workshop/social/virtual) with recurring patterns | P0 |
| 10.6.2 | As an organizer, I want to set up ticket pricing (free/paid/donation) with multiple ticket types | P1 |
| 10.6.3 | As an organizer, I want QR check-in, walk-in registration, and real-time attendance dashboard | P1 |
| 10.6.4 | As a member, I want to upload event photos with moderation and view recap gallery | P2 |

### Epic 10.7: Notification Preferences
| ID | User Story | Priority |
|----|-----------|----------|
| 10.7.1 | As a member, I want per-category toggles for notifications | P0 |
| 10.7.2 | As a member, I want to choose delivery channels (in-app/push/email/SMS/WhatsApp) per category | P0 |
| 10.7.3 | As a member, I want to set quiet hours and notification frequency (instant/daily digest/weekly summary) | P1 |

### Epic 10.8: Communication Templates
| ID | User Story | Priority |
|----|-----------|----------|
| 10.8.1 | As an admin, I want to manage notification/message templates with variable placeholders and versioning | P1 |

---

## 11. Documents

**Feature:** Document storage, organization, sharing, and collaboration for association and circle records.

> **Primary stakeholders:** Member · Secretary · President · Auditor
>
> **Platforms:** Web ✓ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> Document library (categories, versions, visibility), viewer with version timeline, and share flow (All members / Committee / Organisers / Public link). Each shared link can expire; audit log records every view and download.

<div style="margin:14px 0;text-align:center;">
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/product/sections/documents/agreement-signing.png" alt="Web" style="width:380px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Web</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/07-documents/screenshots/android/01-library.png" alt="Android — light" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Android — light</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/07-documents/screenshots/ios/02-viewer.png" alt="iOS — light" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">iOS — light</figcaption></figure>
</div>

> **Primary stakeholders:** Member · Secretary · President · Auditor
>
> **Platforms:** Web ✓ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> Document library (categories, versions, visibility), viewer with version timeline, and share flow (All members / Committee / Organisers / Public link). Each shared link can expire; audit log records every view and download.

**Representative screenshots:**

  - **Web:** `product/sections/documents/agreement-signing.png`
  - **Android (light):** `mobile/product/sections/07-documents/screenshots/android/01-library.png`
  - **iOS (light):** `mobile/product/sections/07-documents/screenshots/ios/02-viewer.png`

### Epic 11.1: Document Library
| ID | User Story | Priority |
|----|-----------|----------|
| 11.1.1 | As a member, I want to upload and organize documents in folders with drag-and-drop | P0 |
| 11.1.2 | As a member, I want to browse documents in grid or list view with folder tree navigation | P0 |
| 11.1.3 | As a member, I want full-text search by title, content, or tags | P0 |
| 11.1.4 | As a member, I want to preview documents in-app without downloading | P0 |

### Epic 11.2: Document Access & Sharing
| ID | User Story | Priority |
|----|-----------|----------|
| 11.2.1 | As a member, I want to view and download shared documents (meeting minutes, reports, policies) | P0 |
| 11.2.2 | As an admin, I want to control document access permissions (restrict sensitive docs) | P0 |
| 11.2.3 | As a member, I want notifications when new documents are shared with me | P0 |

### Epic 11.3: Document Versioning & Templates
| ID | User Story | Priority |
|----|-----------|----------|
| 11.3.1 | As a member, I want to track document versions with change history | P1 |
| 11.3.2 | As an admin, I want document templates (meeting minutes, agreements, reports) | P1 |
| 11.3.3 | As an admin, I want to share document templates across circles | P1 |

### Epic 11.4: Circle-Specific Documents
| ID | User Story | Priority |
|----|-----------|----------|
| 11.4.1 | As a member, I want each circle to have its own document space (auto-organized) | P0 |
| 11.4.2 | As a member, I want to upload and manage circle constitution/bylaws | P0 |
| 11.4.3 | As a member, I want digital membership agreement signing | P1 |
| 11.4.4 | As a system, I want auto-generated contribution receipts stored in circle documents | P0 |
| 11.4.5 | As a system, I want auto-generated payout confirmation records | P0 |
| 11.4.6 | As a system, I want periodic circle financial statement generation | P1 |

### Epic 11.5: Member Acknowledgment
| ID | User Story | Priority |
|----|-----------|----------|
| 11.5.1 | As an admin, I want to track member acknowledgment of important documents (e.g., policies) | P1 |
| 11.5.2 | As a member, I want an acknowledgment button when viewing documents that require it | P1 |

### Epic 11.6: Cross-Circle Documents
| ID | User Story | Priority |
|----|-----------|----------|
| 11.6.1 | As a member in multiple circles, I want a "My Documents" aggregated view across all circles | P1 |

---

## 12. Projects & Fundraising

**Feature:** Community fundraising campaigns for specific projects, emergencies, or community initiatives.

> **Primary stakeholders:** Member · Organizer · Donor · Treasurer
>
> **Platforms:** Web ✓ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> Community fundraising campaigns: campaign list, detail (with progress + matching partner banner), donate flow (quick amounts, custom amount, payment method, anonymous toggle), and aggregated impact stories with cumulative stats.

<div style="margin:14px 0;text-align:center;">
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/product/sections/projects-and-fundraising/campaign-creator.png" alt="Web" style="width:380px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Web</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/13-projects-and-fundraising/screenshots/android/01-campaigns.png" alt="Android — light" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Android — light</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/13-projects-and-fundraising/screenshots/android-dark/03-donate.png" alt="Android — dark" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Android — dark</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/13-projects-and-fundraising/screenshots/ios/02-campaign-detail.png" alt="iOS — light" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">iOS — light</figcaption></figure>
</div>

> **Primary stakeholders:** Member · Organizer · Donor · Treasurer
>
> **Platforms:** Web ✓ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> Community fundraising campaigns: campaign list, detail (with progress + matching partner banner), donate flow (quick amounts, custom amount, payment method, anonymous toggle), and aggregated impact stories with cumulative stats.

**Representative screenshots:**

  - **Web:** `product/sections/projects-and-fundraising/campaign-creator.png`
  - **Android (light):** `mobile/product/sections/13-projects-and-fundraising/screenshots/android/01-campaigns.png`
  - **Android (dark):** `mobile/product/sections/13-projects-and-fundraising/screenshots/android-dark/03-donate.png`
  - **iOS (light):** `mobile/product/sections/13-projects-and-fundraising/screenshots/ios/02-campaign-detail.png`

### Epic 12.1: Campaign Management
| ID | User Story | Priority |
|----|-----------|----------|
| 12.1.1 | As an admin, I want to create campaigns with title, description, goal amount, dates, cover image, media gallery, category, and visibility | P0 |
| 12.1.2 | As a donor, I want to donate preset or custom amounts (one-time or recurring) with anonymous option | P0 |
| 12.1.3 | As a donor, I want to add a personal message and receive a confirmation receipt | P0 |
| 12.1.4 | As a visitor, I want to see campaign progress (% of goal, total raised, donor count, time remaining, recent donations) | P0 |
| 12.1.5 | As a member, I want milestone celebrations at 25/50/75/100% of goal | P1 |

### Epic 12.2: Donor Management
| ID | User Story | Priority |
|----|-----------|----------|
| 12.2.1 | As an admin, I want to manage donors with contact info, history, and tiers (Bronze/Silver/Gold/Platinum) | P1 |
| 12.2.2 | As a system, I want automated thank-you messages by donor tier | P1 |
| 12.2.3 | As a donor, I want opt-in donor recognition wall display | P1 |
| 12.2.4 | As an admin, I want to export donor records for tax reporting | P1 |
| 12.2.5 | As an admin, I want to track recurring vs one-time donations and retention metrics | P1 |

### Epic 12.3: Campaign Updates & Reporting
| ID | User Story | Priority |
|----|-----------|----------|
| 12.3.1 | As an admin, I want to post impact stories and updates with rich text, photos/videos, and scheduled posting | P0 |
| 12.3.2 | As a donor, I want notifications when campaigns I donated to post updates | P0 |
| 12.3.3 | As an admin, I want to provide financial breakdown of fund usage | P1 |
| 12.3.4 | As an admin, I want to publish a final campaign report | P1 |

### Epic 12.4: Matching Campaigns
| ID | User Story | Priority |
|----|-----------|----------|
| 12.4.1 | As an admin, I want to configure matching campaigns (ratio, cap, sponsor, deadline) | P2 |
| 12.4.2 | As a donor, I want to see real-time matched amounts and sponsor recognition | P2 |

### Epic 12.5: Campaign Dashboard (Admin)
| ID | User Story | Priority |
|----|-----------|----------|
| 12.5.1 | As an admin, I want a campaign dashboard with donation trends chart, donor demographics, top donors, and recent activity | P0 |
| 12.5.2 | As an admin, I want to export campaign data | P0 |

---

## 13. Community & Social

**Feature:** Social engagement features that strengthen trust, encourage savings behavior, and drive organic growth.

> **Primary stakeholders:** Member
>
> **Platforms:** Web ✓ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> Engagement layer: community activity feed (kudos, milestones, joins), badge gallery (earned + locked with criteria), opt-in leaderboard with anonymisable names, and referral program with code + reward ladder.

<div style="margin:14px 0;text-align:center;">
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/product/sections/community-and-social/badge-gallery.png" alt="Web" style="width:380px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Web</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/11-community-and-social/screenshots/android/02-badges.png" alt="Android — light" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Android — light</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/11-community-and-social/screenshots/ios/03-leaderboard.png" alt="iOS — light" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">iOS — light</figcaption></figure>
</div>

> **Primary stakeholders:** Member
>
> **Platforms:** Web ✓ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> Engagement layer: community activity feed (kudos, milestones, joins), badge gallery (earned + locked with criteria), opt-in leaderboard with anonymisable names, and referral program with code + reward ladder.

**Representative screenshots:**

  - **Web:** `product/sections/community-and-social/badge-gallery.png`
  - **Android (light):** `mobile/product/sections/11-community-and-social/screenshots/android/02-badges.png`
  - **iOS (light):** `mobile/product/sections/11-community-and-social/screenshots/ios/03-leaderboard.png`

### Epic 13.1: Referral Program
| ID | User Story | Priority |
|----|-----------|----------|
| 13.1.1 | As a member, I want a unique referral link to share via SMS, WhatsApp, email, and social media | P0 |
| 13.1.2 | As a member, I want to track referral status (invited/joined/active) | P0 |
| 13.1.3 | As a member, I want multi-level referral earnings | P1 |

### Epic 13.2: Achievements & Recognition
| ID | User Story | Priority |
|----|-----------|----------|
| 13.2.1 | As a member, I want badges for savings milestones (first contribution, 100% on-time, circle completion) | P1 |
| 13.2.2 | As a member, I want to track progress toward my next badge | P1 |
| 13.2.3 | As a member, I want badges displayed on my profile | P1 |
| 13.2.4 | As a member, I want to share badge achievements with animation | P2 |
| 13.2.5 | As a platform, I want member spotlight features for top performers | P2 |

### Epic 13.3: Savings Leaderboards
| ID | User Story | Priority |
|----|-----------|----------|
| 13.3.1 | As a member, I want to view leaderboards filtered by circle, association, or platform-wide | P1 |
| 13.3.2 | As a member, I want to opt-in or opt-out of leaderboard visibility | P1 |
| 13.3.3 | As a member, I want category rankings (total saved, streak length, on-time %) | P1 |

### Epic 13.4: Savings Challenges
| ID | User Story | Priority |
|----|-----------|----------|
| 13.4.1 | As a member, I want to enroll in savings challenges (30-day streak, double contribution) | P1 |
| 13.4.2 | As a member, I want to track my challenge progress with leaderboards | P1 |
| 13.4.3 | As a member, I want special badges/rewards for completing challenges | P1 |

### Epic 13.5: Milestone Celebrations
| ID | User Story | Priority |
|----|-----------|----------|
| 13.5.1 | As a member, I want personalized celebration screens for milestones (first payout, 1-year anniversary, savings goal) | P1 |
| 13.5.2 | As a member, I want to share milestones socially with privacy controls | P1 |
| 13.5.3 | As a member, I want a milestone history timeline | P2 |

### Epic 13.6: Peer Mentorship
| ID | User Story | Priority |
|----|-----------|----------|
| 13.6.1 | As an experienced member, I want to opt-in as a mentor | P2 |
| 13.6.2 | As a new member, I want to be matched with a mentor by savings goals and language | P2 |
| 13.6.3 | As a mentor/mentee, I want in-app messaging for mentorship | P2 |
| 13.6.4 | As a mentor, I want recognition badges for mentoring | P2 |

### Epic 13.7: Social Accountability
| ID | User Story | Priority |
|----|-----------|----------|
| 13.7.1 | As a member, I want to make public savings goal commitments within my circle or network | P2 |
| 13.7.2 | As a member, I want accountability partner pairing with progress visibility | P2 |
| 13.7.3 | As a member, I want encouragement notifications from my accountability network | P2 |

### Epic 13.8: Community Impact & Stories
| ID | User Story | Priority |
|----|-----------|----------|
| 13.8.1 | As a visitor, I want to see platform-wide impact statistics (total saved, members helped, circles completed) | P0 |
| 13.8.2 | As an admin, I want association-level impact dashboards | P1 |
| 13.8.3 | As a member, I want social proof notifications ("15 members contributed this hour") | P2 |
| 13.8.4 | As a member, I want to submit personal savings success stories (with consent) for featured display | P2 |

---

## 14. Analytics & Reporting

**Feature:** Savings tracking, circle health metrics, statements, and business intelligence at every level (personal, circle, association, federation).

> **Primary stakeholders:** Member · Treasurer · President · Auditor
>
> **Platforms:** Web ✓ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> Personal dashboard (savings YTD, streak, trust trend, next payout), circle health (collection rate, default risk, attendance, welfare uptake + at-risk drilldown), and scoped statements (Personal / Circle / Association) with PDF/CSV export and FINMA-compliant 10-year retention.

<div style="margin:14px 0;text-align:center;">
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/product/sections/analytics-and-reporting/AssociationDashboard.png" alt="Web" style="width:380px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Web</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/08-analytics-and-reporting/screenshots/android/01-personal.png" alt="Android — light" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Android — light</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/08-analytics-and-reporting/screenshots/ios/02-circle-health.png" alt="iOS — light" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">iOS — light</figcaption></figure>
</div>

> **Primary stakeholders:** Member · Treasurer · President · Auditor
>
> **Platforms:** Web ✓ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> Personal dashboard (savings YTD, streak, trust trend, next payout), circle health (collection rate, default risk, attendance, welfare uptake + at-risk drilldown), and scoped statements (Personal / Circle / Association) with PDF/CSV export and FINMA-compliant 10-year retention.

**Representative screenshots:**

  - **Web:** `product/sections/analytics-and-reporting/AssociationDashboard.png`
  - **Android (light):** `mobile/product/sections/08-analytics-and-reporting/screenshots/android/01-personal.png`
  - **iOS (light):** `mobile/product/sections/08-analytics-and-reporting/screenshots/ios/02-circle-health.png`

### Epic 14.1: Personal Savings Dashboard
| ID | User Story | Priority |
|----|-----------|----------|
| 14.1.1 | As a member, I want to see total savings across all circles with contribution history visualization | P0 |
| 14.1.2 | As a member, I want an upcoming payout countdown | P0 |
| 14.1.3 | As a member, I want cross-circle comparison if I participate in multiple circles | P1 |

### Epic 14.2: Savings Goals
| ID | User Story | Priority |
|----|-----------|----------|
| 14.2.1 | As a member, I want to create savings goals with target amount and date | P1 |
| 14.2.2 | As a member, I want progress tracking with milestones and celebrations | P1 |
| 14.2.3 | As a member, I want recommendations to stay on track toward my goal | P1 |

### Epic 14.3: Circle Health Dashboard
| ID | User Story | Priority |
|----|-----------|----------|
| 14.3.1 | As an organizer, I want to see collection rates, member engagement scores, and payment timeliness trends | P0 |
| 14.3.2 | As an organizer, I want benchmark comparison with similar circles | P1 |

### Epic 14.4: Association Dashboard
| ID | User Story | Priority |
|----|-----------|----------|
| 14.4.1 | As an admin, I want aggregate metrics: total members, active circles, contribution volumes, default rate trends | P0 |
| 14.4.2 | As an admin, I want to identify top-performing circles | P1 |

### Epic 14.5: Federation Dashboard
| ID | User Story | Priority |
|----|-----------|----------|
| 14.5.1 | As a federation admin, I want aggregate metrics across all associations (total members/circles/funds) | P1 |
| 14.5.2 | As a federation admin, I want association health comparison and regional performance | P1 |
| 14.5.3 | As a federation admin, I want growth projections | P2 |

### Epic 14.6: Statements & Reports
| ID | User Story | Priority |
|----|-----------|----------|
| 14.6.1 | As a member, I want to generate statements by date range in PDF and CSV formats | P0 |
| 14.6.2 | As a member, I want year-end savings summaries (annual totals, payouts received, net savings, YoY comparison) | P1 |
| 14.6.3 | As an organizer, I want member contribution reports (per-member summary, on-time %, comparison) | P0 |
| 14.6.4 | As a federation admin, I want compliance reports (KYC completion, transaction volume, suspicious activity, regulatory filing status) | P1 |
| 14.6.5 | As an admin, I want scheduled report generation and email distribution | P1 |

### Epic 14.7: Predictive Insights
| ID | User Story | Priority |
|----|-----------|----------|
| 14.7.1 | As a member, I want projected year-end savings estimates | P1 |
| 14.7.2 | As a member, I want optimal contribution suggestions | P2 |
| 14.7.3 | As a member, I want risk alerts for off-track savings goals | P1 |

---

## 15. AI Insights

**Feature:** Personalized AI intelligence hub for members, organizers, and platform operations.

> **Primary stakeholders:** Member · Treasurer · Platform Admin
>
> **Platforms:** Web ✓ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> AI-powered insights: personalised feed (Recommendation / Risk / Fraud cards with why-explanations), assistant chat with citations to source data, and risk dashboard with KPI tiles + active alerts. Low-confidence signals are filtered by default; opt-in lives in Notification preferences.

<div style="margin:14px 0;text-align:center;">
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/product/sections/ai-insights/ai-insights-dashboard.png" alt="Web" style="width:380px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Web</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/10-ai-insights/screenshots/android/01-feed.png" alt="Android — light" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Android — light</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/10-ai-insights/screenshots/android-dark/02-assistant.png" alt="Android — dark" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Android — dark</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/10-ai-insights/screenshots/ios/03-risk.png" alt="iOS — light" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">iOS — light</figcaption></figure>
</div>

> **Primary stakeholders:** Member · Treasurer · Platform Admin
>
> **Platforms:** Web ✓ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> AI-powered insights: personalised feed (Recommendation / Risk / Fraud cards with why-explanations), assistant chat with citations to source data, and risk dashboard with KPI tiles + active alerts. Low-confidence signals are filtered by default; opt-in lives in Notification preferences.

**Representative screenshots:**

  - **Web:** `product/sections/ai-insights/ai-insights-dashboard.png`
  - **Android (light):** `mobile/product/sections/10-ai-insights/screenshots/android/01-feed.png`
  - **Android (dark):** `mobile/product/sections/10-ai-insights/screenshots/android-dark/02-assistant.png`
  - **iOS (light):** `mobile/product/sections/10-ai-insights/screenshots/ios/03-risk.png`

### Epic 15.1: AI for Members
| ID | User Story | Priority |
|----|-----------|----------|
| 15.1.1 | As a member, I want personalized circle recommendations with match explanations | P1 |
| 15.1.2 | As a member, I want an AI financial health assistant via natural language chat | P1 |
| 15.1.3 | As a member, I want AI-suggested contribution amounts based on income patterns | P2 |
| 15.1.4 | As a member, I want predictive cash flow alerts before payment due dates | P1 |
| 15.1.5 | As a member, I want savings opportunity suggestions when surplus is detected | P2 |
| 15.1.6 | As a member, I want seasonal pattern insights for financial planning | P2 |
| 15.1.7 | As a member, I want cross-circle portfolio insights | P2 |

### Epic 15.2: AI for Circle Organizers
| ID | User Story | Priority |
|----|-----------|----------|
| 15.2.1 | As an organizer, I want AI-predicted default risk scores for prospective members with factor breakdown | P0 |
| 15.2.2 | As an organizer, I want a circle health score with improvement recommendations | P1 |
| 15.2.3 | As an organizer, I want churn and default early warning indicators | P0 |
| 15.2.4 | As an organizer, I want optimal circle configuration suggestions | P1 |
| 15.2.5 | As an organizer, I want AI-predicted optimal payout order for bidding circles | P2 |

### Epic 15.3: AI for Platform Operations
| ID | User Story | Priority |
|----|-----------|----------|
| 15.3.1 | As a platform operator, I want real-time fraud detection with anomaly alerts | P0 |
| 15.3.2 | As a platform operator, I want automated member behavior clustering for segmentation | P2 |
| 15.3.3 | As a platform operator, I want social trust graph analysis for enhanced trust scoring | P2 |
| 15.3.4 | As a platform operator, I want smart notification timing optimization | P2 |
| 15.3.5 | As a platform operator, I want an AI-powered customer support chatbot with escalation | P1 |

---

## 16. Federations

**Feature:** Umbrella organizations coordinating multiple child associations with shared governance, finances, and reporting.

> **Primary stakeholders:** Federation Lead · President · Treasurer
>
> **Platforms:** Web ✓ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> Federation hub (aggregated stats, member associations), federated-associations management (link/unlink, organiser contact), and consolidated finance (tabs: Dues, Transfers, Federation Fund with earmarks). Federation-wide elections route into Section 9 governance.

<div style="margin:14px 0;text-align:center;">
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/product/sections/federations/alert-panel.png" alt="Web" style="width:380px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Web</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/16-federations/screenshots/android/01-overview.png" alt="Android — light" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Android — light</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/16-federations/screenshots/ios/03-consolidated.png" alt="iOS — light" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">iOS — light</figcaption></figure>
</div>

> **Primary stakeholders:** Federation Lead · President · Treasurer
>
> **Platforms:** Web ✓ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> Federation hub (aggregated stats, member associations), federated-associations management (link/unlink, organiser contact), and consolidated finance (tabs: Dues, Transfers, Federation Fund with earmarks). Federation-wide elections route into Section 9 governance.

**Representative screenshots:**

  - **Web:** `product/sections/federations/alert-panel.png`
  - **Android (light):** `mobile/product/sections/16-federations/screenshots/android/01-overview.png`
  - **iOS (light):** `mobile/product/sections/16-federations/screenshots/ios/03-consolidated.png`

### Epic 16.1: Federation Setup
| ID | User Story | Priority |
|----|-----------|----------|
| 16.1.1 | As a user, I want to create a federation via setup wizard (name, description, logo, governance type, founding charter) | P0 |
| 16.1.2 | As a federation president, I want to search, invite, and link child associations | P0 |
| 16.1.3 | As an association president, I want to accept or decline federation invitations | P0 |

### Epic 16.2: Federation Leadership
| ID | User Story | Priority |
|----|-----------|----------|
| 16.2.1 | As a federation president, I want to manage leadership roles (Vice-President, Secretary General, Treasurer General, Committee Chair) | P0 |
| 16.2.2 | As a federation admin, I want customizable permissions and term limits per role | P1 |
| 16.2.3 | As a system, I want role transfer with 48-hour cooling period | P0 |

### Epic 16.3: Federation Governance Policies
| ID | User Story | Priority |
|----|-----------|----------|
| 16.3.1 | As a federation admin, I want to define policies (Trust Score minimums, verification standards, contribution limits, code of conduct) | P0 |
| 16.3.2 | As a federation admin, I want enforcement levels (Mandatory, Recommended, Optional) per policy | P0 |
| 16.3.3 | As a system, I want policies to cascade to child associations with compliance tracking | P0 |

### Epic 16.4: Federation Dashboard
| ID | User Story | Priority |
|----|-----------|----------|
| 16.4.1 | As a federation admin, I want aggregated metrics (total members, active circles, combined financials, health score) | P0 |
| 16.4.2 | As a federation admin, I want drill-down into individual associations | P0 |
| 16.4.3 | As a federation admin, I want side-by-side comparison of up to 4 associations | P1 |
| 16.4.4 | As a federation admin, I want threshold-based alerts | P1 |

### Epic 16.5: Federation Member Directory
| ID | User Story | Priority |
|----|-----------|----------|
| 16.5.1 | As a federation admin, I want a consolidated member list across all child associations with affiliations and roles | P0 |
| 16.5.2 | As a federation admin, I want search, filter, and export (CSV/PDF) for the directory | P0 |
| 16.5.3 | As a system, I want cross-association member mobility preserving Trust Score and participation history | P1 |

### Epic 16.6: Federation Finances
| ID | User Story | Priority |
|----|-----------|----------|
| 16.6.1 | As a federation treasurer, I want consolidated financial dashboard (balance, income vs expenses, per-association summaries) | P0 |
| 16.6.2 | As a federation treasurer, I want to collect federation dues (flat or per-member, automated invoicing, grace periods) | P0 |
| 16.6.3 | As a federation treasurer, I want to manage multiple fund accounts (General/Event/Reserve/Special Projects) | P0 |
| 16.6.4 | As a federation treasurer, I want inter-fund transfers with audit trail | P0 |
| 16.6.5 | As a federation treasurer, I want annual budget management with variance tracking and early warnings | P1 |
| 16.6.6 | As a federation treasurer, I want inter-association transfers and grants with multi-approval workflow | P1 |
| 16.6.7 | As a federation treasurer, I want financial reports (AGM, budget vs actual, audit logs) in branded PDF/Excel | P0 |
| 16.6.8 | As a federation treasurer, I want scheduled auto-generated reports | P1 |

### Epic 16.7: Federation Elections & Events
| ID | User Story | Priority |
|----|-----------|----------|
| 16.7.1 | As a federation admin, I want to run federation-level elections (president/board/referendum) with secret ballots and audit trail | P0 |
| 16.7.2 | As a federation admin, I want to create federation-wide events targeting specific associations | P1 |
| 16.7.3 | As a federation admin, I want to broadcast announcements with "Federation" badge | P0 |

### Epic 16.8: Federation Compliance
| ID | User Story | Priority |
|----|-----------|----------|
| 16.8.1 | As a federation admin, I want to monitor child association compliance with federation policies | P0 |
| 16.8.2 | As a federation admin, I want violation alerts and remediation tracking | P0 |

---

## 17. Platform Administration

**Feature:** Tools for platform operators, compliance officers, and support staff to manage the entire CircleUp platform.

> **Primary stakeholders:** Platform Admin
>
> **Platforms:** Web ✓ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> Mafao operator console: KPI strip (users, ARR, KYC backlog, disputes, uptime), queue counts (KYC, support, compliance, appeals), KYC review with risk-scored applicants, support tickets with SLA timers, and feature-flag console with cohort targeting + RBAC.

<div style="margin:14px 0;text-align:center;">
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/product/sections/platform-administration/access-requests.png" alt="Web" style="width:380px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Web</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/14-platform-administration/screenshots/android/01-console.png" alt="Android — light" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Android — light</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/14-platform-administration/screenshots/android-dark/02-kyc.png" alt="Android — dark" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">Android — dark</figcaption></figure>
  <figure style="display:inline-block;margin:6px;text-align:center;vertical-align:top;"><img src="file:///Users/lunang/Documents/Documents - iMac/Projects/circleup-design/mobile/product/sections/14-platform-administration/screenshots/ios/04-flags.png" alt="iOS — light" style="width:220px;max-width:100%;border:1px solid #e2e8f0;border-radius:8px;"/><figcaption style="font-size:11px;color:#64748b;margin-top:4px;">iOS — light</figcaption></figure>
</div>

> **Primary stakeholders:** Platform Admin
>
> **Platforms:** Web ✓ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> Mafao operator console: KPI strip (users, ARR, KYC backlog, disputes, uptime), queue counts (KYC, support, compliance, appeals), KYC review with risk-scored applicants, support tickets with SLA timers, and feature-flag console with cohort targeting + RBAC.

**Representative screenshots:**

  - **Web:** `product/sections/platform-administration/access-requests.png`
  - **Android (light):** `mobile/product/sections/14-platform-administration/screenshots/android/01-console.png`
  - **Android (dark):** `mobile/product/sections/14-platform-administration/screenshots/android-dark/02-kyc.png`
  - **iOS (light):** `mobile/product/sections/14-platform-administration/screenshots/ios/04-flags.png`

### Epic 17.1: Compliance & Regulatory
| ID | User Story | Priority |
|----|-----------|----------|
| 17.1.1 | As a compliance officer, I want AML transaction monitoring with configurable risk rules and automatic flagging | P0 |
| 17.1.2 | As a compliance officer, I want pattern detection (structuring, layering, velocity) with third-party AML integration | P0 |
| 17.1.3 | As a compliance officer, I want to file Suspicious Activity Reports (SAR) with attachments, draft/review workflow, and deadline tracking | P0 |
| 17.1.4 | As a DPO, I want GDPR Data Subject Request handling (access/rectification/erasure/portability) with identity verification and 30-day deadline tracking | P0 |
| 17.1.5 | As a compliance officer, I want FINMA regulatory reporting (monthly/quarterly/annual) with compliant formats and submission tracking | P0 |
| 17.1.6 | As a compliance officer, I want immutable audit trail with search, filter, export, and 7-year retention | P0 |
| 17.1.7 | As an admin, I want configurable data retention periods with automated archival, secure deletion, and legal hold | P1 |

### Epic 17.2: User & System Administration
| ID | User Story | Priority |
|----|-----------|----------|
| 17.2.1 | As an admin, I want to search users by name/email/phone/ID and view full profile with activity history | P0 |
| 17.2.2 | As an admin, I want to reset passwords, unlock accounts, and modify roles/permissions | P0 |
| 17.2.3 | As an admin, I want impersonation for debugging (fully audited) | P1 |
| 17.2.4 | As an admin, I want circle overrides (payout schedule, manual contributions, balance adjustments, status changes, organizer reassignment) | P0 |
| 17.2.5 | As an admin, I want platform configuration (fee structure, default circle settings, payment provider, notification templates, ToS, rate limiting, maintenance mode) | P0 |
| 17.2.6 | As an admin, I want feature flag management (create/edit, target by segment, schedule, history, emergency kill switch) | P1 |
| 17.2.7 | As an admin, I want system health monitoring (service status, error rates, latency, active users, database/queue health, third-party status, alerts, incident timeline) | P0 |

### Epic 17.3: Customer Support
| ID | User Story | Priority |
|----|-----------|----------|
| 17.3.1 | As a support agent, I want multi-channel ticket intake (app/email/chat) with AI categorization and priority assignment | P0 |
| 17.3.2 | As a support agent, I want SLA tracking with escalation rules (Urgent: 1hr, High: 4hrs, Medium: 24hrs, Low: 48hrs) | P0 |
| 17.3.3 | As a support agent, I want dispute resolution tools (evidence upload, both-party communication, decision recording, refund execution, appeal process) | P0 |
| 17.3.4 | As a support agent, I want a failed payment queue with retry, manual recording, and refund processing | P0 |
| 17.3.5 | As a support manager, I want escalation management with resolution authority levels and cross-team handoff | P1 |
| 17.3.6 | As an admin, I want knowledge base management (articles, categories/tags, internal vs public, usage analytics) | P1 |
| 17.3.7 | As an admin, I want automated post-resolution satisfaction surveys (CSAT/NPS/CES metrics, agent-level scores) | P1 |

### Epic 17.4: Role-Based Access Control (RBAC)
| ID | User Story | Priority |
|----|-----------|----------|
| 17.4.1 | As a system, I want a two-dimensional permission model (Access Roles × Contextual Roles) with four access modes (No Access, Read, Write, Read & Write) | P0 |
| 17.4.2 | As a system, I want real-time permission evaluation (<50ms cached) with feature registry and sub-features | P0 |
| 17.4.3 | As an admin, I want to configure Access Role ceilings (Admin, Standard User, Invitee) with bulk assignment | P0 |
| 17.4.4 | As an admin, I want role transition safety checks (impact analysis before downgrade, grace period) | P0 |
| 17.4.5 | As an admin, I want federation-level permission matrix with cascading to child associations | P1 |
| 17.4.6 | As an admin, I want association-level permission matrix for 12 feature categories with contextual roles | P0 |
| 17.4.7 | As an admin, I want circle-level permission controls for lifecycle actions, contributions, payouts, and disputes | P0 |
| 17.4.8 | As an admin, I want individual user permission overrides with justification and expiration | P1 |
| 17.4.9 | As an admin, I want temporary permission grants with auto-revocation | P1 |
| 17.4.10 | As an admin, I want delegation/proxy access configuration | P1 |
| 17.4.11 | As an auditor, I want RBAC audit trail with 7-year retention | P0 |
| 17.4.12 | As an admin, I want quarterly periodic access reviews | P1 |
| 17.4.13 | As a system, I want separation of duties enforcement (no single user can create and approve same resource) | P0 |
| 17.4.14 | As a system, I want multi-admin approval for critical changes | P0 |
| 17.4.15 | As a system, I want permission anomaly detection (accumulation, dormant elevated access, rapid changes) | P1 |
| 17.4.16 | As an admin, I want an interactive RBAC dashboard with health metrics, distribution charts, and anomaly alerts | P1 |
| 17.4.17 | As an admin, I want an interactive permission matrix (click-to-cycle access modes, color-coded) | P0 |
| 17.4.18 | As a system, I want dynamic UI adaptation (hide/disable/show-read-only based on permissions) | P0 |
| 17.4.19 | As an admin, I want a permission simulation tool (before/after comparison) | P1 |
| 17.4.20 | As an admin, I want role comparison view (side-by-side) and role hierarchy visualization | P1 |
| 17.4.21 | As an admin, I want bulk permission editor and permission export/import | P1 |
| 17.4.22 | As an admin, I want emergency access protocols for crisis situations | P0 |

---

## 18. Business Relationships *(mobile-only)*

**Feature:** Revenue contracts between Circle Managers (Mafao employees) and the associations they sign and serve.

> **Primary stakeholders:** Circle Manager · Platform Admin · President
>
> **Platforms:** Web ✗ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> A Business Relationship (BR) is the formal commercial tier between Mafao and a customer association. The CM owns the relationship end-to-end: creation wizard (4 steps), lifecycle events, financial overview, monthly fee billing, and churn handling. Most BR screens are CM-facing; presidents see a read-only summary of their association's BR.

> **Screenshots:** Android: `mobile/product/sections/17-business-relationships/screenshots/android/01-list.png` · Android dark: `.../android-dark/02-detail.png` · iOS: `.../ios/03-new.png`

### Epic 18.1: BR Discovery & Lifecycle

| ID | User Story | Priority |
|---|---|---|
| 18.1.1 | As a CM, I want to browse my BR portfolio with filters (status, tier, risk) so I can prioritise outreach | P0 |
| 18.1.2 | As a CM, I want to see a BR detail page with timeline of lifecycle events (signed → activated → suspended → churned) | P0 |
| 18.1.3 | As a CM, I want a dashboard with revenue, churn risk, and upcoming renewals | P1 |
| 18.1.4 | As a President, I want to see my association's BR status and CM contact info (read-only) | P0 |

### Epic 18.2: BR Creation Wizard

| ID | User Story | Priority |
|---|---|---|
| 18.2.1 | As a CM, I want a 4-step wizard (Association → Tier → Fees → Confirm) to sign a new BR | P0 |
| 18.2.2 | As a CM, I want to copy fee structures from an existing BR to save time | P1 |
| 18.2.3 | As a CM, I want to attach a signed contract PDF during creation | P0 |
| 18.2.4 | As a system, I want to auto-provision an Association Account (Section 19) the moment a BR activates | P0 |

### Epic 18.3: Lifecycle Sheets

| ID | User Story | Priority |
|---|---|---|
| 18.3.1 | As a CM, I want a Suspend BR sheet with reason picker + grace-period selector | P0 |
| 18.3.2 | As a CM, I want a Reactivate sheet that re-enables the linked Association Account | P0 |
| 18.3.3 | As a CM, I want a Churn sheet with exit-survey + data-export option | P1 |

---

## 19. Association Accounts *(mobile-only)*

**Feature:** Double-entry ledger auto-provisioned per association when its BR (Section 18) activates.

> **Primary stakeholders:** Treasurer · President · Circle Manager · Auditor
>
> **Platforms:** Web ✗ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> The Association Account is the canonical ledger every dues collection, fee payment, circle transfer, and adjustment flows through. Fund-category roll-ups (General / Welfare / Reserve) sit at the top; the action chips (Credit / Debit / Transfer) launch a form. Restricted mode kicks in when the upstream BR is suspended — only dues + fee entries are allowed.

> **Screenshots:** Android light: `mobile/product/sections/18-association-accounts/screenshots/android/01-overview.png` · Restricted: `.../02-restricted.png` · Frozen: `.../03-frozen.png` · Empty: `.../04-empty.png` · iOS: `.../ios/01-overview.png`

### Epic 19.1: Account Overview

| ID | User Story | Priority |
|---|---|---|
| 19.1.1 | As a Treasurer, I want a balance card with gradient hero, currency-formatted total, and account-type pill | P0 |
| 19.1.2 | As a Treasurer, I want fund-category cards (General / Welfare / Reserve) with progress against target | P0 |
| 19.1.3 | As a Treasurer, I want recent entries as list rows (date, type, fund-chip, amount, running balance) | P0 |
| 19.1.4 | As a Treasurer, I want action chips (Credit / Debit / Transfer) that disable when account is frozen or closed | P0 |
| 19.1.5 | As a new Treasurer, I want an empty-state with "Record opening credit" CTA when the account has zero entries | P0 |

### Epic 19.2: Restricted & Frozen States

| ID | User Story | Priority |
|---|---|---|
| 19.2.1 | As a Treasurer, I want a restricted-mode banner when the BR is suspended so I know only dues + fees are allowed | P0 |
| 19.2.2 | As a system, I want to freeze the account on platform-admin action and surface a clear banner | P0 |
| 19.2.3 | As a Treasurer, I want a closed-account read-only mode after BR churn | P1 |

### Epic 19.3: Approvals & Future Surfaces

| ID | User Story | Priority |
|---|---|---|
| 19.3.1 | As a Treasurer, I want a "X pending approvals" strip linking to the approvals queue when above-threshold txns wait | P0 |
| 19.3.2 | As a Treasurer, I want a full paged ledger view with filters *(planned)* | P1 |
| 19.3.3 | As a Treasurer, I want an income/expense statement export *(planned)* | P1 |

---

## 20. Onboarding Checklist *(mobile-only)*

**Feature:** 5-step Circle-Manager playbook for bringing a newly-signed association fully live.

> **Primary stakeholders:** Circle Manager · President · Treasurer
>
> **Platforms:** Web ✗ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> Auto-created when a CmContract is signed; one per BR. The 5 steps cover: Association profile · Account activation · Dues config · Member invitations · First circle. Escalation kicks in at 48h (amber) and 7 days (red). CMs can complete steps "on behalf of" the customer with a consent note.

> **Screenshots:** Android: `mobile/product/sections/19-onboarding/screenshots/android/01-checklist.png` · Completed: `.../02-completed.png` · Red escalation: `.../03-escalated-red.png` · Fresh 0%: `.../04-fresh-zero.png` · iOS: `.../ios/01-checklist.png`

### Epic 20.1: Step Tracking

| ID | User Story | Priority |
|---|---|---|
| 20.1.1 | As a CM, I want a step-by-step checklist with percent complete + status pills (pending / in_progress / completed) | P0 |
| 20.1.2 | As a CM, I want a banner showing the prospect name, contract reference, and progress | P0 |
| 20.1.3 | As a CM, I want fresh-zero state with stepped progress dots and a clear "Start step 1" CTA | P0 |
| 20.1.4 | As a CM, I want a celebratory completed state with all 5 steps locked + green check | P1 |

### Epic 20.2: On-behalf Completion

| ID | User Story | Priority |
|---|---|---|
| 20.2.1 | As a CM, I want a "Complete on behalf" toggle with required consent note (text area) | P0 |
| 20.2.2 | As a CM, I want the Mark Complete button disabled until the consent note is non-empty | P0 |
| 20.2.3 | As an Auditor, I want every on-behalf completion logged with the CM's name + timestamp + consent text | P0 |

### Epic 20.3: Escalation

| ID | User Story | Priority |
|---|---|---|
| 20.3.1 | As a CM, I want an amber-escalation banner after 48h of inactivity | P0 |
| 20.3.2 | As a CM, I want a red-escalation banner after 7 days with "Reach out to president" CTA | P0 |
| 20.3.3 | As a CM Manager, I want escalated checklists surfaced in my queue with SLA timers | P1 |

---

## 21. Profile *(mobile-only — bottom-nav destination)*

**Feature:** The user's own account hub — identity, KYC, payments, security, notifications, language, plan, help, legal.

> **Primary stakeholders:** Member · Treasurer · President · Organizer · Circle Manager · Platform Admin
>
> **Platforms:** Web partial *(web handles profile/settings inside a header drop-down menu — mobile gives it a dedicated tab)* &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> Every authenticated user is in Profile. The hub (10 menu rows) routes into 9 sub-screens plus 16 edge-state variants (Basic KYC, payment-failed subscription, photo-update sheet, sign-out confirm, delete-account, association switcher, undo-cancel snackbar). The most polished section in the codebase; serves as the reference implementation for shared primitives (ConfirmSheet, Snackbar, ThemeModeProvider).

> **Screenshots:** Hub: `mobile/product/sections/20-profile/screenshots/android/01-hub.png` · Identity: `.../03-identity.png` · Payment methods: `.../04-payment-methods.png` · Security: `.../05-security.png` · Notifications: `.../06-notifications.png` · Language: `.../07-language.png` · Subscription past-due: `.../14-subscription-past-due.png` · Association switcher: `.../25-hub-association-switcher.png` · Cancel snackbar: `.../26-subscription-cancel-snackbar.png` · iOS hub: `mobile/product/sections/20-profile/screenshots/ios/01-hub.png` · iOS dark: `.../ios-dark/01-hub.png`

### Epic 21.1: Profile Hub

| ID | User Story | Priority |
|---|---|---|
| 21.1.1 | As a member, I want a gradient hero with my avatar, name, role, association, city, and Trust Score with weekly delta | P0 |
| 21.1.2 | As a member, I want a 3-tile stats snapshot (Contributions / Payouts / Circles) without duplicating Section 8 analytics | P0 |
| 21.1.3 | As a member, I want a 9-item menu grid with status badges (Enhanced KYC / Card expiring) | P0 |
| 21.1.4 | As a member with multiple memberships, I want an Association Switcher pill below my role with quick-switch sheet | P0 |
| 21.1.5 | As a member with a past-due subscription, I want a red banner above the menu linking to subscription | P0 |
| 21.1.6 | As a member, I want a destructive Sign-out card that opens a ConfirmSheet, not an immediate logout | P0 |

### Epic 21.2: Personal Info

| ID | User Story | Priority |
|---|---|---|
| 21.2.1 | As a member, I want to edit name, preferred name, bio (≤280 chars with counter), languages, location, DoB, gender | P0 |
| 21.2.2 | As a member, I want to tap my avatar to open a photo-update sheet (Camera / Gallery / Remove) | P0 |
| 21.2.3 | As a member, I want a sticky Save bar with explicit-save (no auto-save) plus Discard | P0 |

### Epic 21.3: Identity & KYC

| ID | User Story | Priority |
|---|---|---|
| 21.3.1 | As a member, I want a KYC-tier hero (Basic / Enhanced) with progress bar and reviewer note | P0 |
| 21.3.2 | As a member, I want a verified-channels list (phone / email / national ID) with status pills | P0 |
| 21.3.3 | As a member, I want a horizontal document carousel with per-document re-upload icon | P0 |
| 21.3.4 | As a Basic-tier member joining a CHF 500+ circle, I want an Upgrade-to-Enhanced CTA card | P0 |
| 21.3.5 | As a member with a rejected document, I want a red "Documents need attention" card with Re-submit CTA | P0 |

### Epic 21.4: Payment Methods

| ID | User Story | Priority |
|---|---|---|
| 21.4.1 | As a member, I want pay-in (cards / TWINT / PostFinance) and pay-out (IBAN / mobile wallet) lists, grouped | P0 |
| 21.4.2 | As a member, I want default + backup selectors, long-press to set default | P0 |
| 21.4.3 | As a member, I want swipe-left → Delete with confirm sheet | P0 |
| 21.4.4 | As a new member, I want an empty-state card with twin "Add pay-out / Add pay-in" CTAs | P0 |
| 21.4.5 | As a member with an expiring card, I want a warning banner with one-tap update | P0 |

### Epic 21.5: Security

| ID | User Story | Priority |
|---|---|---|
| 21.5.1 | As a member, I want password / biometric / 2FA rows with platform-aware copy (Face ID on iPhone, Fingerprint on device) | P0 |
| 21.5.2 | As a member, I want an active-sessions card with device + city + last-active (correctly pluralised: "1 hour ago", not "1 hours ago") | P0 |
| 21.5.3 | As a member, I want a Sign-out-of-all-devices danger row with confirm sheet | P0 |
| 21.5.4 | As a member, I want a Danger Zone card with Delete Account (App Store / Play Store compliance) and confirm sheet | P0 |

### Epic 21.6: Notifications

| ID | User Story | Priority |
|---|---|---|
| 21.6.1 | As a member, I want a Quiet hours card with start/end pickers and a "contributions-due alerts always come through" note | P0 |
| 21.6.2 | As a member, I want a category × channel matrix (6 categories × 4 channels: Push / Email / SMS / WhatsApp) | P0 |
| 21.6.3 | As a member, I want the Save bar to appear only when dirty (not always visible) | P0 |
| 21.6.4 | As a member, I want time-picker affordances (ChevronDown) on the quiet-hours times | P1 |

### Epic 21.7: Language & Appearance

| ID | User Story | Priority |
|---|---|---|
| 21.7.1 | As a member, I want an Appearance card with Light / Dark / System segmented control (via ThemeModeProvider) | P0 |
| 21.7.2 | As a member, I want a language list (EN / FR / DE / IT / PT) with native + English names and a country flag | P0 |
| 21.7.3 | As a member, I want a currency picker (CHF / EUR / USD) as a segmented control | P0 |
| 21.7.4 | As a member, I want a country selector that opens a country-picker sheet | P1 |

### Epic 21.8: Subscription

| ID | User Story | Priority |
|---|---|---|
| 21.8.1 | As a member, I want a plan card (Free / Plus / Pro) with crown icon, status pill, renewal date, next-bill amount | P0 |
| 21.8.2 | As a member, I want a 6-row billing-history list with download icons | P0 |
| 21.8.3 | As a Plus member, I want a Cancel subscription action with confirm sheet AND a 10-second undo snackbar after confirming | P0 |
| 21.8.4 | As a member with a past-due card, I want a red "Payment failed" banner + rose-tinted hero variant | P0 |
| 21.8.5 | As a trial / cancels-soon / cancelled member, I want a distinct status pill on the plan card | P0 |

### Epic 21.9: Help, Legal & About

| ID | User Story | Priority |
|---|---|---|
| 21.9.1 | As a member, I want a Help screen with FAQ search, category cards, contact-support row, report-a-bug row, status-page link | P0 |
| 21.9.2 | As a member, I want a Legal screen with Terms / Privacy / Cookies / FINMA disclosure / Open-source licenses | P0 |
| 21.9.3 | As a member, I want an About card with version, build, region, environment pill, and "Tap version 7×" hidden dev mode | P1 |

---


## 18. Business Relationships *(mobile-only)*

**Feature:** Revenue contracts between Circle Managers (Mafao employees) and the associations they sign and serve.

> **Primary stakeholders:** Circle Manager · Platform Admin · President
>
> **Platforms:** Web ✗ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> A Business Relationship (BR) is the formal commercial tier between Mafao and a customer association. The CM owns the relationship end-to-end: creation wizard (4 steps), lifecycle events, financial overview, monthly fee billing, and churn handling. Most BR screens are CM-facing; presidents see a read-only summary of their association's BR.

> **Screenshots:** Android: `mobile/product/sections/17-business-relationships/screenshots/android/01-list.png` · Android dark: `.../android-dark/02-detail.png` · iOS: `.../ios/03-new.png`

### Epic 18.1: BR Discovery & Lifecycle

| ID | User Story | Priority |
|---|---|---|
| 18.1.1 | As a CM, I want to browse my BR portfolio with filters (status, tier, risk) so I can prioritise outreach | P0 |
| 18.1.2 | As a CM, I want to see a BR detail page with timeline of lifecycle events (signed → activated → suspended → churned) | P0 |
| 18.1.3 | As a CM, I want a dashboard with revenue, churn risk, and upcoming renewals | P1 |
| 18.1.4 | As a President, I want to see my association's BR status and CM contact info (read-only) | P0 |

### Epic 18.2: BR Creation Wizard

| ID | User Story | Priority |
|---|---|---|
| 18.2.1 | As a CM, I want a 4-step wizard (Association → Tier → Fees → Confirm) to sign a new BR | P0 |
| 18.2.2 | As a CM, I want to copy fee structures from an existing BR to save time | P1 |
| 18.2.3 | As a CM, I want to attach a signed contract PDF during creation | P0 |
| 18.2.4 | As a system, I want to auto-provision an Association Account (Section 19) the moment a BR activates | P0 |

### Epic 18.3: Lifecycle Sheets

| ID | User Story | Priority |
|---|---|---|
| 18.3.1 | As a CM, I want a Suspend BR sheet with reason picker + grace-period selector | P0 |
| 18.3.2 | As a CM, I want a Reactivate sheet that re-enables the linked Association Account | P0 |
| 18.3.3 | As a CM, I want a Churn sheet with exit-survey + data-export option | P1 |

---

## 19. Association Accounts *(mobile-only)*

**Feature:** Double-entry ledger auto-provisioned per association when its BR (Section 18) activates.

> **Primary stakeholders:** Treasurer · President · Circle Manager · Auditor
>
> **Platforms:** Web ✗ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> The Association Account is the canonical ledger every dues collection, fee payment, circle transfer, and adjustment flows through. Fund-category roll-ups (General / Welfare / Reserve) sit at the top; the action chips (Credit / Debit / Transfer) launch a form. Restricted mode kicks in when the upstream BR is suspended — only dues + fee entries are allowed.

> **Screenshots:** Android light: `mobile/product/sections/18-association-accounts/screenshots/android/01-overview.png` · Restricted: `.../02-restricted.png` · Frozen: `.../03-frozen.png` · Empty: `.../04-empty.png` · iOS: `.../ios/01-overview.png`

### Epic 19.1: Account Overview

| ID | User Story | Priority |
|---|---|---|
| 19.1.1 | As a Treasurer, I want a balance card with gradient hero, currency-formatted total, and account-type pill | P0 |
| 19.1.2 | As a Treasurer, I want fund-category cards (General / Welfare / Reserve) with progress against target | P0 |
| 19.1.3 | As a Treasurer, I want recent entries as list rows (date, type, fund-chip, amount, running balance) | P0 |
| 19.1.4 | As a Treasurer, I want action chips (Credit / Debit / Transfer) that disable when account is frozen or closed | P0 |
| 19.1.5 | As a new Treasurer, I want an empty-state with "Record opening credit" CTA when the account has zero entries | P0 |

### Epic 19.2: Restricted & Frozen States

| ID | User Story | Priority |
|---|---|---|
| 19.2.1 | As a Treasurer, I want a restricted-mode banner when the BR is suspended so I know only dues + fees are allowed | P0 |
| 19.2.2 | As a system, I want to freeze the account on platform-admin action and surface a clear banner | P0 |
| 19.2.3 | As a Treasurer, I want a closed-account read-only mode after BR churn | P1 |

### Epic 19.3: Approvals & Future Surfaces

| ID | User Story | Priority |
|---|---|---|
| 19.3.1 | As a Treasurer, I want a "X pending approvals" strip linking to the approvals queue when above-threshold txns wait | P0 |
| 19.3.2 | As a Treasurer, I want a full paged ledger view with filters *(planned)* | P1 |
| 19.3.3 | As a Treasurer, I want an income/expense statement export *(planned)* | P1 |

---

## 20. Onboarding Checklist *(mobile-only)*

**Feature:** 5-step Circle-Manager playbook for bringing a newly-signed association fully live.

> **Primary stakeholders:** Circle Manager · President · Treasurer
>
> **Platforms:** Web ✗ &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> Auto-created when a CmContract is signed; one per BR. The 5 steps cover: Association profile · Account activation · Dues config · Member invitations · First circle. Escalation kicks in at 48h (amber) and 7 days (red). CMs can complete steps "on behalf of" the customer with a consent note.

> **Screenshots:** Android: `mobile/product/sections/19-onboarding/screenshots/android/01-checklist.png` · Completed: `.../02-completed.png` · Red escalation: `.../03-escalated-red.png` · Fresh 0%: `.../04-fresh-zero.png` · iOS: `.../ios/01-checklist.png`

### Epic 20.1: Step Tracking

| ID | User Story | Priority |
|---|---|---|
| 20.1.1 | As a CM, I want a step-by-step checklist with percent complete + status pills (pending / in_progress / completed) | P0 |
| 20.1.2 | As a CM, I want a banner showing the prospect name, contract reference, and progress | P0 |
| 20.1.3 | As a CM, I want fresh-zero state with stepped progress dots and a clear "Start step 1" CTA | P0 |
| 20.1.4 | As a CM, I want a celebratory completed state with all 5 steps locked + green check | P1 |

### Epic 20.2: On-behalf Completion

| ID | User Story | Priority |
|---|---|---|
| 20.2.1 | As a CM, I want a "Complete on behalf" toggle with required consent note (text area) | P0 |
| 20.2.2 | As a CM, I want the Mark Complete button disabled until the consent note is non-empty | P0 |
| 20.2.3 | As an Auditor, I want every on-behalf completion logged with the CM's name + timestamp + consent text | P0 |

### Epic 20.3: Escalation

| ID | User Story | Priority |
|---|---|---|
| 20.3.1 | As a CM, I want an amber-escalation banner after 48h of inactivity | P0 |
| 20.3.2 | As a CM, I want a red-escalation banner after 7 days with "Reach out to president" CTA | P0 |
| 20.3.3 | As a CM Manager, I want escalated checklists surfaced in my queue with SLA timers | P1 |

---

## 21. Profile *(mobile-only — bottom-nav destination)*

**Feature:** The user's own account hub — identity, KYC, payments, security, notifications, language, plan, help, legal.

> **Primary stakeholders:** Member · Treasurer · President · Organizer · Circle Manager · Platform Admin
>
> **Platforms:** Web partial *(web handles profile/settings inside a header drop-down menu — mobile gives it a dedicated tab)* &nbsp;·&nbsp; Android ✓ &nbsp;·&nbsp; iOS ✓
>
> Every authenticated user is in Profile. The hub (10 menu rows) routes into 9 sub-screens plus 16 edge-state variants (Basic KYC, payment-failed subscription, photo-update sheet, sign-out confirm, delete-account, association switcher, undo-cancel snackbar). The most polished section in the codebase; serves as the reference implementation for shared primitives (ConfirmSheet, Snackbar, ThemeModeProvider).

> **Screenshots:** Hub: `mobile/product/sections/20-profile/screenshots/android/01-hub.png` · Identity: `.../03-identity.png` · Payment methods: `.../04-payment-methods.png` · Security: `.../05-security.png` · Notifications: `.../06-notifications.png` · Language: `.../07-language.png` · Subscription past-due: `.../14-subscription-past-due.png` · Association switcher: `.../25-hub-association-switcher.png` · Cancel snackbar: `.../26-subscription-cancel-snackbar.png` · iOS hub: `mobile/product/sections/20-profile/screenshots/ios/01-hub.png` · iOS dark: `.../ios-dark/01-hub.png`

### Epic 21.1: Profile Hub

| ID | User Story | Priority |
|---|---|---|
| 21.1.1 | As a member, I want a gradient hero with my avatar, name, role, association, city, and Trust Score with weekly delta | P0 |
| 21.1.2 | As a member, I want a 3-tile stats snapshot (Contributions / Payouts / Circles) without duplicating Section 8 analytics | P0 |
| 21.1.3 | As a member, I want a 9-item menu grid with status badges (Enhanced KYC / Card expiring) | P0 |
| 21.1.4 | As a member with multiple memberships, I want an Association Switcher pill below my role with quick-switch sheet | P0 |
| 21.1.5 | As a member with a past-due subscription, I want a red banner above the menu linking to subscription | P0 |
| 21.1.6 | As a member, I want a destructive Sign-out card that opens a ConfirmSheet, not an immediate logout | P0 |

### Epic 21.2: Personal Info

| ID | User Story | Priority |
|---|---|---|
| 21.2.1 | As a member, I want to edit name, preferred name, bio (≤280 chars with counter), languages, location, DoB, gender | P0 |
| 21.2.2 | As a member, I want to tap my avatar to open a photo-update sheet (Camera / Gallery / Remove) | P0 |
| 21.2.3 | As a member, I want a sticky Save bar with explicit-save (no auto-save) plus Discard | P0 |

### Epic 21.3: Identity & KYC

| ID | User Story | Priority |
|---|---|---|
| 21.3.1 | As a member, I want a KYC-tier hero (Basic / Enhanced) with progress bar and reviewer note | P0 |
| 21.3.2 | As a member, I want a verified-channels list (phone / email / national ID) with status pills | P0 |
| 21.3.3 | As a member, I want a horizontal document carousel with per-document re-upload icon | P0 |
| 21.3.4 | As a Basic-tier member joining a CHF 500+ circle, I want an Upgrade-to-Enhanced CTA card | P0 |
| 21.3.5 | As a member with a rejected document, I want a red "Documents need attention" card with Re-submit CTA | P0 |

### Epic 21.4: Payment Methods

| ID | User Story | Priority |
|---|---|---|
| 21.4.1 | As a member, I want pay-in (cards / TWINT / PostFinance) and pay-out (IBAN / mobile wallet) lists, grouped | P0 |
| 21.4.2 | As a member, I want default + backup selectors, long-press to set default | P0 |
| 21.4.3 | As a member, I want swipe-left → Delete with confirm sheet | P0 |
| 21.4.4 | As a new member, I want an empty-state card with twin "Add pay-out / Add pay-in" CTAs | P0 |
| 21.4.5 | As a member with an expiring card, I want a warning banner with one-tap update | P0 |

### Epic 21.5: Security

| ID | User Story | Priority |
|---|---|---|
| 21.5.1 | As a member, I want password / biometric / 2FA rows with platform-aware copy (Face ID on iPhone, Fingerprint on device) | P0 |
| 21.5.2 | As a member, I want an active-sessions card with device + city + last-active (correctly pluralised: "1 hour ago", not "1 hours ago") | P0 |
| 21.5.3 | As a member, I want a Sign-out-of-all-devices danger row with confirm sheet | P0 |
| 21.5.4 | As a member, I want a Danger Zone card with Delete Account (App Store / Play Store compliance) and confirm sheet | P0 |

### Epic 21.6: Notifications

| ID | User Story | Priority |
|---|---|---|
| 21.6.1 | As a member, I want a Quiet hours card with start/end pickers and a "contributions-due alerts always come through" note | P0 |
| 21.6.2 | As a member, I want a category × channel matrix (6 categories × 4 channels: Push / Email / SMS / WhatsApp) | P0 |
| 21.6.3 | As a member, I want the Save bar to appear only when dirty (not always visible) | P0 |
| 21.6.4 | As a member, I want time-picker affordances (ChevronDown) on the quiet-hours times | P1 |

### Epic 21.7: Language & Appearance

| ID | User Story | Priority |
|---|---|---|
| 21.7.1 | As a member, I want an Appearance card with Light / Dark / System segmented control (via ThemeModeProvider) | P0 |
| 21.7.2 | As a member, I want a language list (EN / FR / DE / IT / PT) with native + English names and a country flag | P0 |
| 21.7.3 | As a member, I want a currency picker (CHF / EUR / USD) as a segmented control | P0 |
| 21.7.4 | As a member, I want a country selector that opens a country-picker sheet | P1 |

### Epic 21.8: Subscription

| ID | User Story | Priority |
|---|---|---|
| 21.8.1 | As a member, I want a plan card (Free / Plus / Pro) with crown icon, status pill, renewal date, next-bill amount | P0 |
| 21.8.2 | As a member, I want a 6-row billing-history list with download icons | P0 |
| 21.8.3 | As a Plus member, I want a Cancel subscription action with confirm sheet AND a 10-second undo snackbar after confirming | P0 |
| 21.8.4 | As a member with a past-due card, I want a red "Payment failed" banner + rose-tinted hero variant | P0 |
| 21.8.5 | As a trial / cancels-soon / cancelled member, I want a distinct status pill on the plan card | P0 |

### Epic 21.9: Help, Legal & About

| ID | User Story | Priority |
|---|---|---|
| 21.9.1 | As a member, I want a Help screen with FAQ search, category cards, contact-support row, report-a-bug row, status-page link | P0 |
| 21.9.2 | As a member, I want a Legal screen with Terms / Privacy / Cookies / FINMA disclosure / Open-source licenses | P0 |
| 21.9.3 | As a member, I want an About card with version, build, region, environment pill, and "Tap version 7×" hidden dev mode | P1 |

---


## Summary

| Feature Area | Epics | User Stories |
|---|---|---|
| 1. Homepage & Landing | 9 | 28 |
| 2. Authentication & Onboarding | 7 | 20 |
| 3. Associations | 10 | 39 |
| 4. Members & Trust | 5 | 13 |
| 5. ROSCA Circles | 9 | 32 |
| 6. Treasury & Funds | 8 | 24 |
| 7. Credit & Lending | 6 | 19 |
| 8. Multi-Share | 7 | 51 |
| 9. Governance & Voting | 8 | 25 |
| 10. Communication & Events | 8 | 22 |
| 11. Documents | 6 | 16 |
| 12. Projects & Fundraising | 5 | 15 |
| 13. Community & Social | 8 | 24 |
| 14. Analytics & Reporting | 7 | 18 |
| 15. AI Insights | 3 | 17 |
| 16. Federations | 8 | 27 |
| 17. Platform Administration | 4 | 36 |
| 18. Business Relationships *(mobile-only)* | 3 | 10 |
| 19. Association Accounts *(mobile-only)* | 3 | 11 |
| 20. Onboarding Checklist *(mobile-only)* | 3 | 10 |
| 21. Profile *(mobile-only)* | 9 | 33 |
| **TOTAL** | **136** | **490** |

## Coverage Matrix

| Section | Web | Android | iOS |
|---|---|---|---|
| 1. Homepage | ✓ | ✓ | ✓ |
| 2. Authentication & Onboarding | ✓ | ✓ | ✓ |
| 3. Associations | ✓ | ✓ | ✓ |
| 4. Members & Trust | ✓ | ✓ | ✓ |
| 5. ROSCA Circles | ✓ | ✓ | ✓ |
| 6. Treasury & Funds | ✓ | ✓ | ✓ |
| 7. Credit & Lending | ✓ | ✓ | ✓ |
| 8. Multi-Share | ✓ | ✓ | ✓ |
| 9. Governance & Voting | ✓ | ✓ | ✓ |
| 10. Communication & Events | ✓ | ✓ | ✓ |
| 11. Documents | ✓ | ✓ | ✓ |
| 12. Projects & Fundraising | ✓ | ✓ | ✓ |
| 13. Community & Social | ✓ | ✓ | ✓ |
| 14. Analytics & Reporting | ✓ | ✓ | ✓ |
| 15. AI Insights | ✓ | ✓ | ✓ |
| 16. Federations | ✓ | ✓ | ✓ |
| 17. Platform Administration | ✓ | ✓ | ✓ |
| 18. Business Relationships | — | ✓ | ✓ |
| 19. Association Accounts | — | ✓ | ✓ |
| 20. Onboarding Checklist | — | ✓ | ✓ |
| 21. Profile *(web has partial via header dropdown)* | partial | ✓ | ✓ |

**Total screen designs captured: 681 PNGs** (Android light 222 + Android dark 153 + iOS light 153 + iOS dark 153)
