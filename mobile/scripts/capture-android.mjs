// Drives the running Android emulator via adb deep-links and saves a PNG
// for every screen in the catalog.
//
// The Chromium/web pipeline was retired because Expo Router web does not
// honour direct navigation to dynamic catch-all routes
// (`/sections/[section]/[screen]`) in dev — all such URLs render the index
// route instead, yielding identical screenshots for every screen.
//
// Usage:
//   1. Start the emulator (any AVD): `emulator -avd Pixel_7`
//   2. Start Metro for Android:      `npm run android` (leave running)
//   3. Capture all screens:          `npm run screenshots`
//   4. Capture one section:          `node scripts/capture-android.mjs --section=communication-and-events`

import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DEEP_LINK_HOST = process.env.CIRCLEUP_DEEP_LINK_HOST ?? "192.168.1.115:8081";
const SETTLE_MS = Number(process.env.CIRCLEUP_SETTLE_MS ?? 6000);
const MAX_DIM = Number(process.env.CIRCLEUP_MAX_DIM ?? 1500);

function adb(args) {
  return execFileSync("adb", args, { stdio: ["ignore", "pipe", "pipe"] });
}

function adbPipe(args) {
  return execFileSync("adb", args, { stdio: ["ignore", "pipe", "inherit"] });
}

// Downscale to MAX_DIM on the longest side. The Pixel 7 emulator captures at
// 1080x2400, which exceeds Claude's image-read max dimension (~2000px) — so
// any future inspection of these PNGs would fail. Keep the longest side at
// 1500px to stay safely under that cap while preserving detail.
function downscale(file) {
  try {
    execFileSync("sips", ["-Z", String(MAX_DIM), file], { stdio: "ignore" });
  } catch {
    // sips is macOS-only; on other platforms leave the PNG at native size.
  }
}

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
  {
    index: 4,
    slug: "treasury-and-funds",
    // Spec lives at mobile/product/sections/04-treasury-and-funds/spec.md.
    // Phases 2–5 are stub-rendered until the matching component lands.
    screens: [
      // Phase 1 — core treasurer loop
      "overview", "fund-detail", "request", "approvals",
      // Phase 2 — ledger & reconciliation
      "ledger", "entry-detail", "reconciliation",
      // Phase 3 — reporting & compliance
      "reports", "audit-report", "statements",
      // Phase 4 — currency & investments
      "multi-currency", "investments",
      // Phase 5 — Swiss-specific integrations
      "postfinance-import", "external-accounts",
    ],
  },
  { index: 5,  slug: "governance-and-voting",    screens: ["proposals", "ballot", "elections", "committees"] },
  {
    index: 6,
    slug: "communication-and-events",
    screens: [
      "inbox",
      "thread",
      "events",
      "event-detail",
      "association-events",
      "create-event",
      "invite-attendees",
      "announcement-composer",
      "qr",
    ],
  },
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
  const sectionFilter = process.argv
    .find((a) => a.startsWith("--section="))
    ?.slice("--section=".length);
  const sections = sectionFilter
    ? sectionsCatalog.filter((s) => s.slug === sectionFilter)
    : sectionsCatalog;
  if (sectionFilter && sections.length === 0) {
    console.error(`No section matches "${sectionFilter}".`);
    process.exit(1);
  }

  // Sanity-check the emulator is up.
  try {
    const devices = adb(["devices"]).toString();
    if (!/\b(device|emulator)\b/.test(devices.split("\n").slice(1).join("\n"))) {
      console.error("No Android emulator attached. Start one with `emulator -avd <name>`.");
      process.exit(1);
    }
  } catch (err) {
    console.error("`adb` is not on PATH or returned an error:", err.message);
    process.exit(1);
  }

  let ok = 0;
  let failed = 0;

  for (const section of sections) {
    for (let i = 0; i < section.screens.length; i++) {
      const screen = section.screens[i];
      const routePath = section.routes?.[screen] ?? `/sections/${section.slug}/${screen}`;
      const deepLink = `exp://${DEEP_LINK_HOST}/--${routePath}`;
      const outDir = resolve(
        ROOT,
        "product/sections",
        `${String(section.index).padStart(2, "0")}-${section.slug}`,
        "screenshots/android"
      );
      await mkdir(outDir, { recursive: true });
      const outFile = resolve(outDir, `${String(i + 1).padStart(2, "0")}-${screen}.png`);
      try {
        adb(["shell", "am", "start", "-a", "android.intent.action.VIEW", "-d", deepLink]);
        await wait(SETTLE_MS);
        adb(["shell", "screencap", "-p", "/sdcard/_capture.png"]);
        adbPipe(["pull", "/sdcard/_capture.png", outFile]);
        downscale(outFile);
        console.log(`  ✔ ${section.slug}/${screen}`);
        ok++;
      } catch (err) {
        console.warn(`  ✗ ${section.slug}/${screen}: ${err.message}`);
        failed++;
      }
    }
  }

  console.log(`\nDone. ${ok} captured, ${failed} failed.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
