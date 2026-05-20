# CircleUp · Mobile Design Package

A second-pass design package that mirrors the web `product/sections/` structure but targets the **CircleUp Android & iOS mobile apps**. Use this folder to review and validate every screen of the mobile product before any of it is built in the real codebase.

> The Expo app inside this folder is a **design preview tool**, not a production app. Its only purpose is to render screen designs at mobile-device resolution so screenshots can be captured and reviewed.

---

## What's in here

```
mobile/
├── README.md                         <- this file
├── package.json                      <- Expo 54, Expo Router 6, RN 0.81
├── app.json
├── tsconfig.json
├── babel.config.js
├── expo-env.d.ts
│
├── theme/                            <- design tokens (indigo · amber · slate)
├── components/                       <- shared RN components used across sections
│   ├── shared/                       <- Text, Card, Button, Avatar, StatChip, ...
│   └── frame/                        <- Android device frame for screenshots
├── data/                             <- cross-section sample data + sections catalog
├── scripts/                          <- screenshot capture script
│
├── app/                              <- Expo Router routes
│   ├── _layout.tsx
│   ├── index.tsx                     <- section gallery (entry)
│   └── sections/
│       └── [section]/[screen].tsx    <- one route per design screen
│
└── product/
    └── sections/
        ├── 00-homepage/
        │   ├── spec.md               <- overview, UI requirements, integration
        │   ├── user-flows.md         <- primary flows, edge states
        │   ├── data.json             <- sample data for the design screens
        │   ├── types.ts              <- typed shapes used by RN screens
        │   └── screenshots/
        │       ├── android/          <- captured PNGs (Android-first)
        │       └── ios/              <- captured PNGs (iOS, later pass)
        ├── 01-associations/  ...
        └── 16-federations/   ...
```

## The 17 sections

| # | Section | Slug |
| -- | --- | --- |
| 0  | Homepage                      | `homepage` |
| 1  | Associations                  | `associations` |
| 2  | Members & Trust               | `members-and-trust` |
| 3  | ROSCA Circles                 | `rosca-circles` |
| 4  | Treasury & Funds              | `treasury-and-funds` |
| 5  | Governance & Voting           | `governance-and-voting` |
| 6  | Communication & Events        | `communication-and-events` |
| 7  | Documents                     | `documents` |
| 8  | Analytics & Reporting         | `analytics-and-reporting` |
| 9  | Credit & Lending              | `credit-and-lending` |
| 10 | AI Insights                   | `ai-insights` |
| 11 | Community & Social            | `community-and-social` |
| 12 | Multi-Share                   | `multi-share` |
| 13 | Projects & Fundraising        | `projects-and-fundraising` |
| 14 | Platform Administration       | `platform-administration` |
| 15 | Login & Onboarding            | `login` |
| 16 | Federations                   | `federations` |

Each section folder contains, for design review:

1. **`spec.md`** — overview, screen list, UI requirements, data shape pointers, and how the section integrates with other sections.
2. **`user-flows.md`** — primary user flows (Flow A, Flow B, …) plus edge states.
3. **`data.json`** — canonical sample data used by the screen designs.
4. **`types.ts`** — TypeScript shapes used by the RN screens. Re-export-friendly so designers and engineers share the same nouns.
5. **`screenshots/android/*.png`** — captured Android-framed PNGs.
6. **`screenshots/ios/*.png`** — captured iOS-framed PNGs (added in the second pass).

## Running locally

```
cd mobile
npm install            # one-time
npm run start          # opens Expo dev tools
npm run android        # run on Android emulator or device
npm run ios            # run on iOS simulator (Mac only)
npm run web            # run on web (used for screenshot capture)
```

The web build is what the screenshot capture script targets — it renders the RN components into a real browser at a Pixel-class viewport.

## Capturing screenshots

```
cd mobile
npm run web            # in one terminal, leave running
npm run screenshots    # in another terminal, after the web bundle is ready
```

The capture script (`scripts/capture-android.mjs`) drives a headless Chromium with a 412 × 915 viewport (Pixel 7 dimensions), iterates over every screen route in `data/sectionsCatalog.ts`, and writes PNGs to `product/sections/<slug>/screenshots/android/<screen>.png`.

iOS screenshots will reuse the same pipeline with an iPhone-class viewport and an iOS device frame component — added in a follow-up pass.

## How this package is meant to be reviewed

1. Read `product/product-overview.md` and `product/product-roadmap.md` at the repo root for product context. (Web app and mobile app share the same product definition.)
2. Pick a section under `mobile/product/sections/`.
3. Read `spec.md` and `user-flows.md` to understand intent.
4. Open the matching screenshots under `screenshots/android/`.
5. If you want to interact with the screens live, run the Expo app and navigate from the section gallery on `app/index.tsx`.

## How this package relates to the existing web design

The product definition (`/product/product-overview.md`, `/product/product-roadmap.md`, the 17 sections at `/product/sections/`) is the **shared canonical source**. The mobile package re-interprets the same 17 sections through native-mobile UI patterns:

- Tab-bar navigation rather than a side rail.
- Bottom-sheet–style flows for short decisions.
- Push notifications as a first-class entry point (each section's `user-flows.md` describes notification-initiated flows).
- QR / camera / biometrics where they unlock a flow (event check-in, identity, signing).

The web app and mobile app share data shapes and the same business rules; only the surfaces differ.
