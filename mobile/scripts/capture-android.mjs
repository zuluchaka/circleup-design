// Drives a headless Chromium against the Expo web build and saves an
// Android-framed PNG for every screen in the catalog.
//
// Usage:
//   1. In one terminal:   npm run web            (leave running until ready)
//   2. In another:        npm run screenshots

import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const BASE = process.env.CIRCLEUP_WEB_URL ?? "http://localhost:8081";
const VIEWPORT = { width: 412, height: 915 };
const DEVICE_SCALE_FACTOR = 2;

// Catalog: mirror data/sectionsCatalog.ts.
const sectionsCatalog = [
  { index: 0,  slug: "homepage",                 screens: ["welcome", "discover", "quiz", "pricing"] },
  {
    index: 1,
    slug: "associations",
    // Section 1 routes live under /associations and /associations/[id]/*.
    // Creation/migration moved into the BR creation wizard (Section 17, step 1).
    routes: {
      list: "/associations",
      dashboard: "/associations/ma1",
      settings: "/associations/ma1/settings",
    },
    screens: ["list", "dashboard", "settings"],
  },
  { index: 2,  slug: "members-and-trust",        screens: ["directory", "profile", "trust", "invite"] },
  {
    index: 3,
    slug: "rosca-circles",
    // Spec lives at mobile/product/sections/03-rosca-circles/spec.md.
    // Phases 2–8 are stub-rendered until the matching component lands.
    screens: [
      // Phase 1 — built
      "my-circles", "circle-detail", "contribute", "payouts", "treasurer",
      // Phase 2 — discovery & joining
      "circle-public", "join-request", "waitlist", "invitations",
      // Phase 3 — creating & renewing
      "create", "renewal",
      // Phase 4 — live cycle ops
      "cycle-progress", "cash-collection", "exception-action",
      // Phase 5 — member-action sheets
      "pay-for-member", "position-swap", "bidding", "payout-advance", "auto-pay",
      // Phase 6 — health, risk & moderation
      "analytics", "risk-scores", "disputes", "dispute-detail", "emergency-fund",
      // Phase 7 — settings & governance
      "settings", "management", "invite", "participants", "multi-share", "documents",
      // Phase 8 — account & admin
      "circle-account", "admin-monitoring",
    ],
  },
  { index: 4,  slug: "treasury-and-funds",       screens: ["overview", "fund-detail", "request", "approvals"] },
  { index: 5,  slug: "governance-and-voting",    screens: ["proposals", "ballot", "elections", "committees"] },
  { index: 6,  slug: "communication-and-events", screens: ["inbox", "thread", "events", "event-detail", "qr"] },
  { index: 7,  slug: "documents",                screens: ["library", "viewer", "share"] },
  { index: 8,  slug: "analytics-and-reporting",  screens: ["personal", "circle-health", "statements"] },
  { index: 9,  slug: "credit-and-lending",       screens: ["score", "advance", "loan", "bureau"] },
  { index: 10, slug: "ai-insights",              screens: ["feed", "assistant", "risk"] },
  { index: 11, slug: "community-and-social",     screens: ["feed", "badges", "leaderboard", "referrals"] },
  { index: 12, slug: "multi-share",              screens: ["my-shares", "request", "monitor"] },
  { index: 13, slug: "projects-and-fundraising", screens: ["campaigns", "campaign-detail", "donate", "impact"] },
  { index: 14, slug: "platform-administration",  screens: ["console", "kyc", "support", "flags"] },
  { index: 15, slug: "login",                    screens: ["signin", "signup", "verify", "onboarding"] },
  { index: 16, slug: "federations",              screens: ["overview", "associations", "consolidated"] },
  {
    index: 17,
    slug: "business-relationships",
    // BR is a top-level bottom-nav destination, not a /sections/[slug]/[screen] route.
    // Capture from the real routes the app uses.
    routes: {
      list: "/business-relationships",
      detail: "/business-relationships/br1",
      new: "/business-relationships/new",
      dashboard: "/business-relationships/dashboard",
    },
    screens: ["list", "detail", "new", "dashboard"],
  },
  {
    index: 18,
    slug: "association-accounts",
    routes: {
      overview: "/association-accounts/ASS-7K2N-PRI",
      restricted: "/association-accounts/ASS-4F12-PRI",
    },
    screens: ["overview", "restricted"],
  },
  {
    index: 19,
    slug: "onboarding",
    routes: {
      checklist: "/business-relationships/br3/onboarding",
      completed: "/business-relationships/br1/onboarding",
    },
    screens: ["checklist", "completed"],
  },
];

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: DEVICE_SCALE_FACTOR,
    hasTouch: true,
    isMobile: true,
    userAgent:
      "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36",
  });
  const page = await context.newPage();

  let ok = 0;
  let failed = 0;

  for (const section of sectionsCatalog) {
    for (let i = 0; i < section.screens.length; i++) {
      const screen = section.screens[i];
      const routePath = section.routes?.[screen] ?? `/sections/${section.slug}/${screen}`;
      const url = `${BASE}${routePath}`;
      const outDir = resolve(
        ROOT,
        "product/sections",
        `${String(section.index).padStart(2, "0")}-${section.slug}`,
        "screenshots/android"
      );
      await mkdir(outDir, { recursive: true });
      const outFile = resolve(outDir, `${String(i + 1).padStart(2, "0")}-${screen}.png`);
      try {
        await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
        await page.waitForTimeout(450);
        await page.screenshot({ path: outFile, fullPage: false });
        console.log(`  ✔ ${section.slug}/${screen}`);
        ok++;
      } catch (err) {
        console.warn(`  ✗ ${section.slug}/${screen}: ${err.message}`);
        failed++;
      }
    }
  }

  await browser.close();
  console.log(`\nDone. ${ok} captured, ${failed} failed.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
