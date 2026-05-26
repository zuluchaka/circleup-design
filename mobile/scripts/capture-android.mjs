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
//   5. Capture one screen:           `node scripts/capture-android.mjs --section=rosca-circles --screen=discover`

import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";
import { sectionsCatalog } from "./sections-catalog.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DEEP_LINK_HOST = process.env.CIRCLEUP_DEEP_LINK_HOST ?? "192.168.1.115:8081";
const SETTLE_MS = Number(process.env.CIRCLEUP_SETTLE_MS ?? 6000);
const MAX_DIM = Number(process.env.CIRCLEUP_MAX_DIM ?? 1500);
// Output folder under each section's `screenshots/`. Default is `android`;
// set to `android-dark` (or similar) when capturing a dark-mode pass so the
// light/dark sets sit side-by-side instead of overwriting each other.
const OUTPUT_SUBDIR = process.env.CIRCLEUP_OUTPUT_SUBDIR ?? "android";

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

async function main() {
  const sectionFilter = process.argv
    .find((a) => a.startsWith("--section="))
    ?.slice("--section=".length);
  const screenFilter = process.argv
    .find((a) => a.startsWith("--screen="))
    ?.slice("--screen=".length);
  const sections = sectionFilter
    ? sectionsCatalog.filter((s) => s.slug === sectionFilter)
    : sectionsCatalog;
  if (sectionFilter && sections.length === 0) {
    console.error(`No section matches "${sectionFilter}".`);
    process.exit(1);
  }
  if (screenFilter && !sectionFilter) {
    console.error("--screen requires --section.");
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
      if (screenFilter && screen !== screenFilter) continue;
      const routePath = section.routes?.[screen] ?? `/sections/${section.slug}/${screen}`;
      const deepLink = `exp://${DEEP_LINK_HOST}/--${routePath}`;
      const outDir = resolve(
        ROOT,
        "product/sections",
        `${String(section.index).padStart(2, "0")}-${section.slug}`,
        `screenshots/${OUTPUT_SUBDIR}`
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
