// Drives a booted iOS simulator via `xcrun simctl` deep-links and saves a
// PNG for every screen in the catalog. Mirrors capture-android.mjs but uses
// simctl instead of adb.
//
// Usage:
//   1. Boot a simulator (any iPhone):   `xcrun simctl boot "iPhone 16"`
//      (or open Simulator.app and pick a device)
//   2. Start Metro for iOS:             `npm run ios` (leave running)
//   3. Capture all screens:             `node scripts/capture-ios.mjs`
//   4. Capture one section:             `node scripts/capture-ios.mjs --section=profile`
//   5. Capture one screen:              `node scripts/capture-ios.mjs --section=profile --screen=hub`
//
// Set CIRCLEUP_OUTPUT_SUBDIR=ios-dark when running a dark-mode pass so the
// PNGs land alongside `ios/` instead of overwriting it. Toggle the simulator
// theme with: `xcrun simctl ui booted appearance dark` (or `light`).

import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";
import { sectionsCatalog } from "./sections-catalog.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SETTLE_MS = Number(process.env.CIRCLEUP_SETTLE_MS ?? 6000);
const MAX_DIM = Number(process.env.CIRCLEUP_MAX_DIM ?? 1500);
const OUTPUT_SUBDIR = process.env.CIRCLEUP_OUTPUT_SUBDIR ?? "ios";
// Expo Go on iOS resolves exp:// scheme directly to the Metro dev URL — no
// LAN IP needed because the simulator shares the host's localhost. Override
// with CIRCLEUP_EXPO_HOST if Metro is exposed elsewhere.
const EXPO_HOST = process.env.CIRCLEUP_EXPO_HOST ?? "127.0.0.1:8081";

function simctl(args) {
  return execFileSync("xcrun", ["simctl", ...args], { stdio: ["ignore", "pipe", "pipe"] });
}

function bootedDeviceId() {
  const out = execFileSync(
    "xcrun",
    ["simctl", "list", "devices", "booted", "-j"],
    { stdio: ["ignore", "pipe", "pipe"] },
  ).toString();
  const parsed = JSON.parse(out);
  for (const runtime of Object.values(parsed.devices)) {
    for (const dev of runtime) {
      if (dev.state === "Booted") return dev.udid;
    }
  }
  return null;
}

function downscale(file) {
  try {
    execFileSync("sips", ["-Z", String(MAX_DIM), file], { stdio: "ignore" });
  } catch {
    // sips is macOS-only; iOS sim only runs on macOS so this should always work.
  }
}

async function main() {
  const sectionFilter = process.argv
    .find((a) => a.startsWith("--section="))
    ?.split("=")[1];
  const screenFilter = process.argv
    .find((a) => a.startsWith("--screen="))
    ?.split("=")[1];

  const udid = bootedDeviceId();
  if (!udid) {
    console.error(
      "No booted iOS simulator found. Boot one first:\n" +
        '  xcrun simctl boot "iPhone 16"\n' +
        "  open -a Simulator",
    );
    process.exit(1);
  }
  console.log(`Using booted simulator ${udid}.`);

  const sections = sectionFilter
    ? sectionsCatalog.filter((s) => s.slug === sectionFilter)
    : sectionsCatalog;
  if (sectionFilter && sections.length === 0) {
    console.error(`No section matches "${sectionFilter}".`);
    process.exit(1);
  }

  let ok = 0;
  let failed = 0;

  for (const section of sections) {
    for (let i = 0; i < section.screens.length; i++) {
      const screen = section.screens[i];
      if (screenFilter && screen !== screenFilter) continue;
      const routePath = section.routes?.[screen] ?? `/sections/${section.slug}/${screen}`;
      const deepLink = `exp://${EXPO_HOST}/--${routePath}`;
      const outDir = resolve(
        ROOT,
        "product/sections",
        `${String(section.index).padStart(2, "0")}-${section.slug}`,
        `screenshots/${OUTPUT_SUBDIR}`,
      );
      await mkdir(outDir, { recursive: true });
      const outFile = resolve(outDir, `${String(i + 1).padStart(2, "0")}-${screen}.png`);
      try {
        simctl(["openurl", "booted", deepLink]);
        await wait(SETTLE_MS);
        simctl(["io", "booted", "screenshot", outFile]);
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
