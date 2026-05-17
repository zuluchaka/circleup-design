# Homepage Specification

## Overview

The Homepage is CircleUp's **public marketing surface** — the unauthenticated landing page that introduces the platform to prospective members, association organizers, and federation leaders. Unlike the rest of the V1.9 product (which adopts the Associations stacked-card pattern), Homepage uses a **marketing-page composition pattern** with distinct hero, sections, and footer designed to convert visitors into sign-ups.

Homepage is Swiss-first (CHF pricing, Twint mention, Swiss compliance framing) and Capacitor-shell-aware (the same page also serves as the splash content inside the mobile app's first-launch experience).

## User Flows

- **Land on Homepage** — Visitor arrives via direct link, search, ad, or referral; sees hero with value proposition and primary CTAs ("Get Started", "Discover Associations").
- **Watch Demo Video** — Modal-style video player explains the product in 60–90 seconds; auto-pauses on scroll-away.
- **Take Quiz** — Short interactive quiz ("Is CircleUp right for you?") routes visitors to the most relevant entry path (Join an association / Start a circle / Become an organizer).
- **Browse Pricing** — View Free / Basic / Pro tiers with CHF pricing, member-cap, feature comparison, "Start free" / "Contact sales" CTAs.
- **Read Testimonials & Success Stories** — Visitor-facing curated success stories with photos, names, association affiliations.
- **Explore Circle Examples** — Showcase of representative circles (family-savings, business-investment, education-fund, emergency-fund) with anonymised stats.
- **View Community Showcase** — Featured associations and federations the platform serves.
- **Read FAQ** — Common questions about how ROSCAs work, fees, KYC, Swiss compliance, mobile app.
- **Sign Up** — Primary CTA leads to Login section's Register flow (`/register`).

## UI Requirements

### Page composition (top → bottom)
- **Hero Section** — Headline, sub-headline, primary + secondary CTAs, hero illustration/video, trust badges (Swiss-hosted, GDPR/FADP).
- **Stats Section** — Big-number stats (total saved, members, circles active, countries) with subtle counter-up animation.
- **How It Works Section** — 3–5 step explainer with icons and short copy.
- **Benefits Section** — Benefit cards (financial security, community, transparency, mobile-first).
- **Circle Examples Section** — Card grid of representative circles.
- **Trust Section** — Swiss-hosted, FADP-compliant, audit-trail, EF protection messaging.
- **Comparison Section** — CircleUp vs. informal cash ROSCA vs. traditional bank.
- **Pricing Section** — Tier cards (Free / Basic / Pro) with CHF pricing, member cap, feature checkmarks.
- **Testimonials Section** — Member testimonials with avatar, quote, association.
- **Community Showcase Section** — Featured associations with logos.
- **Quiz Section** — Interactive routing quiz.
- **FAQ Section** — Accordion FAQ.
- **CTA Section** — Final "Get Started" CTA before footer.
- **Footer** — Links (About, Pricing, Compliance, Privacy, Terms, Contact, Mobile app stores), language switcher (EN/FR/DE/IT/PT), social.

### Composition rules
- Marketing layout (full-bleed sections with internal max-width), not the Associations stacked-card pattern.
- Mobile-first responsive; sections stack vertically; hero collapses to single column.
- Dark mode supported but light mode is the default marketing palette.
- Localised content (EN/FR/DE/IT/PT) with language switcher in nav and footer.

### Capacitor app first-launch
- The same Homepage composition serves as the in-app first-launch splash for the Capacitor Android shell.
- "Get Started" CTA inside the app bypasses to native sign-up/login flow; web "Get Started" routes to `/register`.

## Configuration

- shell: false
