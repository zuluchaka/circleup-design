# Homepage Specification

## Overview
The CircleUp Homepage is the public-facing landing page that serves as the primary entry point for prospective users. It educates visitors about ROSCA/savings circles, builds trust through social proof and security transparency, and converts visitors into registered users. The page addresses multiple visitor segments: prospective members seeking to join circles, prospective organizers looking to digitize their groups, and skeptical users who need extensive trust-building before committing.

## User Flows

### Epic 1: Platform Discovery & Value Proposition
- View hero section with clear value proposition headline (10 words or less), sub-headline explaining what CircleUp does, and dual CTAs (Start Free Trial, Watch Demo) with trust badges (Bank-Level Encryption, Swiss Compliant)
- Browse 3-4 key benefits with visual icons and brief descriptions addressing both member and organizer pain points
- Watch 60-90 second animated explainer video with multi-language subtitles (EN, FR, DE, IT) and end-screen CTA
- Step through "How It Works" visual process flow (Join → Contribute → Payout) with numbered steps and visual connectors
- View key differentiators section highlighting AI Trust Score, Emergency Fund protection, and Swiss compliance
- Use AI Savings Goal Calculator to input target amount/timeframe and see suggested circle configurations
- View live activity feed showing real-time platform activity (circles created, payouts completed, new members)

### Epic 2: Trust Building & Credibility
- See above-the-fold trust signals: Bank-Level Encryption badge, Stripe partnership, Swiss Compliant badge, KYC verification indicator
- Read member testimonials with photos, names, roles, and community context addressing member-specific pain points
- Read organizer testimonials with quantified benefits (hours saved, circles managed, on-time payment rates)
- View dedicated Trust & Security section with AES-256 encryption, 2FA, PCI-DSS compliance, and data protection information
- See regulatory compliance display with FINMA, FADP, and GDPR badges linking to detailed documentation
- View platform statistics with animated counters: total users, circles completed, transaction volume, completion rate (>95%)
- Browse Trust & Safety FAQ category with expandable questions about money safety, default protection, and fees
- View Partner & Integration Showcase displaying banking partners, payment providers, and institutional integrations
- See Community Impact Dashboard with aggregate metrics: total saved across platform, families helped, goals achieved

### Epic 3: ROSCA Education & Awareness
- Read clear ROSCA concept explanation with plain language definition and cultural name references (tontine, chit fund, tandas, susu)
- Watch 90-120 second animated ROSCA explainer video showing circle formation, contribution, rotation, and payout with comparison to traditional methods
- Step through interactive circle lifecycle guide with step-by-step animations and progress indicators
- View side-by-side comparison table: Traditional ROSCA vs CircleUp (payment tracking, default protection, transparency, automation)
- Browse circle type examples showing different configurations (family circles, professional circles) with member count, contribution, duration, and payout schedule
- View Cultural Community Showcase highlighting different diaspora communities (West African tontines, Latin American tandas, South Asian chit funds) with culturally relevant imagery and success stories

### Epic 4: Association Management Showcase
- View Association Management feature overview: member management, governance, events, documents, communication
- See Member Management preview with invitation methods (email, link, QR code), role hierarchy (Admin, Treasurer, Secretary, Member), and UI mockups
- Browse Governance & Voting features: voting types (majority, super-majority, ranked choice), elections, motions, meeting management with audit trails
- View Events & Communication tools: event creation, RSVP, calendar, announcements, multi-channel notifications (email, push, SMS)
- See Financial Management & Treasury features: dues collection, expense tracking, financial reports, audit trails, compliance reporting

### Epic 5: Persona-Based Qualification
- Choose between member path ("I'm Looking to Join") and organizer path ("I Want to Create/Lead") with role-specific CTAs
- Access "Not Sure? Take Our Quiz" option for undecided visitors
- View member-specific content: easy payments, real-time visibility, Trust Score building, member testimonials and FAQ
- View organizer-specific content: automation benefits, member verification, liability protection, organizer testimonials with quantified benefits (10+ hours saved weekly, 95% on-time payment rate)
- Use Savings Goal Planner (member tool) to input goal amount and target date, see suggested circles or create matching circle
- Use Circle Size Calculator (organizer tool) to determine optimal configuration with real-time contribution/duration updates
- Browse persona-specific FAQ sections with tabbed interface for member vs organizer questions
- Access Try Before You Sign Up Sandbox with interactive demo environment to explore a sample circle without creating an account

### Epic 6: Interactive Readiness Assessment
- Find and start Member Readiness Quiz ("Is a Savings Circle Right For You?") with 5-minute estimated time and purpose explanation
- Find and start Organizer Readiness Quiz with organizer-specific introduction covering risks and responsibilities
- Answer approximately 10 scenario-based multiple-choice questions about common ROSCA challenges (late payments, defaults, trust issues)
- Receive instant educational feedback on each answer explaining correct approach and how CircleUp addresses the scenario
- Track progress with visual progress bar, running score with +10 points animation for correct answers
- Receive final score (e.g., 26/30) with qualitative rating and personalized recommendation:
  - High (80-100): "ROSCA Pro" rating → Create & Manage Circle CTA
  - Medium (50-79): "Ready to Join" rating → Discover Circles CTA
  - Low (0-49): Learning suggestions → Education Resources CTA
- Share quiz results or restart quiz

### Epic 7: Pricing & Fee Transparency
- View pricing tier comparison table: Free, Basic (CHF 29/mo), Pro (CHF 99/mo), Enterprise with feature checkmarks and platform fee percentages
- See complete fee structure breakdown: subscription fees, platform fee (% on contributions), late fees, Emergency Fund contribution (1%)
- Use Cost Calculator to estimate total costs based on circle configuration (contribution amount, member count, duration) with per-contribution and total cost breakdown
- View Free Trial terms: duration, feature limitations, billing start date, cancellation process, no credit card required messaging

### Epic 8: Support & Communication Channels
- Access Live Chat support via chat bubble icon (bottom-right), 2-minute response time during business hours, offline message with expected response time
- Submit Contact Form with name, email, subject category dropdown (Pricing, Technical, Security, Partnership), and message with 24-48 hour response expectation
- Book Live Demo session via scheduler showing available time slots, receive calendar invite and confirmation, join via browser without app download
- Subscribe to Newsletter via footer signup, receive welcome email, easy unsubscribe option
- Access Help Center from navigation and footer with organized categories (Getting Started, Payments, Security), search functionality, and step-by-step guides with screenshots

### Epic 9: Conversion & Registration Gateway
- See prominent primary CTA ("Start Free" or "Create Circle") above fold, section-specific contextual CTAs throughout page, and final CTA block in footer area
- Access sticky CTA button on mobile that remains visible during scroll
- Complete streamlined registration form with minimal fields (email, password, name), social login options (Google, Apple), real-time email validation, and optional referral code field
- See social proof near registration: trust badges, user count ("X users trust CircleUp"), brief testimonial quote, "Encrypted and Secure" messaging
- Encounter polite exit-intent modal (once per session) with value proposition summary and alternative actions (newsletter signup, download guide)

### Epic 10: Accessibility & Localization
- Select preferred language via globe icon/dropdown in header: English, French, German, Italian with auto-detection based on browser
- Experience mobile-first responsive design: optimized layout, 16px minimum text, 44x44px minimum touch targets, accessible mobile menu
- Navigate with screen reader: proper content announcement order, meaningful alt text, properly associated form labels, announced state changes
- Experience fast performance: <2 second initial content load (LCP), <100ms interaction response (FID), no layout shifts (CLS < 0.1), CDN delivery

### Epic 11: Mobile Experience & App Promotion
- See prominent Mobile App Download CTAs with App Store and Google Play badges and QR codes for quick download
- View Mobile Feature Highlights section showcasing mobile-specific capabilities: push notifications for payment reminders, quick one-tap payments, biometric login (Face ID, fingerprint), offline access to circle information

### Epic 12: Community & Referral Program
- View Referral Program Preview section explaining benefits of inviting friends: reward structure, bonus tiers, and how earnings accumulate
- See Community Ambassador Spotlight featuring power users and community leaders who champion CircleUp with their stories and impact metrics

## UI Requirements
- Hero section with gradient background, large headline, trust badges, and dual CTA buttons above the fold
- Responsive navigation header with logo, main nav links, language selector, and prominent CTA button
- Benefits cards with icons, hover states, and optional expand functionality
- Video player component with custom controls, quality selector, subtitle toggle, and end-screen CTA overlay
- Numbered step process flow with connecting lines/arrows and icons for each step
- Testimonial carousel/grid with member photos, quotes, names, roles, and community badges
- Animated statistics counters with number formatting (K, M suffixes)
- Expandable FAQ accordion with category tabs (Trust & Safety, For Members, For Organizers)
- Interactive calculator components with real-time updates and pre-fill CTAs
- Side-by-side comparison table with checkmarks, X marks, and feature descriptions
- Pricing table with tier columns, feature rows, and highlighted recommended tier
- Live activity feed with real-time updates, timestamps, and subtle animations
- Cultural community showcase with representative imagery and localized content
- Demo sandbox environment with sample data and guided tour
- Quiz interface with progress bar, score display, feedback modals, and result screens
- Chat widget with minimized bubble state and expanded conversation view
- Contact form with field validation, category dropdown, and success confirmation
- Demo booking calendar with time slot picker and timezone handling
- Newsletter signup inline form with email validation and success state
- Registration modal/page with social login buttons, form fields, and trust signals
- Exit-intent modal with value proposition and alternative CTAs
- Mobile sticky CTA bar fixed to bottom of viewport
- Language selector dropdown with flag icons and language names
- App store badges (iOS, Android) with QR code option
- Partner logo showcase with hover states and optional detail modals
- Impact metrics dashboard with large numbers, labels, and visual indicators

## Configuration
- shell: false
