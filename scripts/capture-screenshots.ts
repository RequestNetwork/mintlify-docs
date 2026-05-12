/**
 * Screenshot capture for the Request Network Mintlify docs.
 *
 * Captures public/unauthenticated screens from the locally running Dashboard
 * and Secure Payment apps and writes them as `.webp` under `images/dashboard/`
 * and `images/secure-payments/`. Wallet-gated screens are listed as
 * `MANUAL: <shot>` at the end of the run for hand-capture.
 *
 * --- Bringing up the services ---
 *
 * Use the existing local-stack compose in `request-e2e-tests` — it brings up
 * postgres × 2, redis × 2, runs migrations, and starts request-api,
 * request-auth-api, request-dashboard, and request-secure-payment with
 * healthchecks and the right env wiring:
 *
 *   cd ../request-e2e-tests
 *   docker compose -f docker-compose.local.yml up --build -d
 *
 * Default ports (configurable via env in that compose):
 *   - request-api:           http://localhost:8080
 *   - request-auth-api:      http://localhost:8081
 *   - request-dashboard:     http://localhost:5173
 *   - request-secure-payment: http://localhost:5174
 *
 * --- Running this script ---
 *
 *   pnpm install
 *   pnpm exec playwright install chromium
 *   DASHBOARD_URL=http://localhost:5173 \
 *   SECURE_PAYMENT_URL=http://localhost:5174 \
 *   pnpm capture-screenshots
 *
 * --- Wallet-gated screens ---
 *
 * The Dashboard interior, payment options, success screens, etc. require a
 * signed-in wallet session. Two options:
 *
 *   1. Reuse `request-e2e-tests`' Synpress + auth state setup and add a
 *      "screenshots" Playwright project inside that repo that drives the
 *      existing helpers (recommended for repeatability — see e2e tests'
 *      `helpers/dashboard.helpers.ts` and `helpers/payment.helpers.ts`).
 *
 *   2. Sign in once interactively with `playwright codegen` against the
 *      Dashboard, save `await context.storageState({ path: 'auth-state.json' })`
 *      and re-run this script with `AUTH_STATE=./auth-state.json`.
 *
 * Either way, the wallet-gated shots are emitted as `MANUAL: <shot>` lines
 * by this script and skipped on a normal run.
 */

import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, type Browser, type Page } from "playwright";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const DASHBOARD_URL = process.env.DASHBOARD_URL;
const SECURE_PAYMENT_URL = process.env.SECURE_PAYMENT_URL;
const AUTH_STATE = process.env.AUTH_STATE;

if (!DASHBOARD_URL || !SECURE_PAYMENT_URL) {
  console.error(
    "DASHBOARD_URL and SECURE_PAYMENT_URL must be set explicitly.\n" +
      "Example:\n" +
      "  DASHBOARD_URL=http://localhost:5173 \\\n" +
      "  SECURE_PAYMENT_URL=http://localhost:5174 \\\n" +
      "  pnpm capture-screenshots\n",
  );
  process.exit(2);
}

const OUT_DASHBOARD = join(ROOT, "images", "dashboard");
const OUT_SECURE = join(ROOT, "images", "secure-payments");

const VIEWPORT = { width: 1440, height: 900 };

type Shot = {
  name: string;
  url: string;
  outDir: string;
  /** Optional pre-screenshot interaction. Return false to skip the shot. */
  setup?: (page: Page) => Promise<boolean | void>;
  /** True if the shot requires an authenticated wallet session. */
  needsAuth?: boolean;
};

const dashboardShots: Shot[] = [
  {
    name: "login-evm",
    url: DASHBOARD_URL + "/login",
    outDir: OUT_DASHBOARD,
  },
  {
    name: "login-tron",
    url: DASHBOARD_URL + "/login",
    outDir: OUT_DASHBOARD,
    setup: async (page) => {
      // Click the Tron tab if present. Skip the shot if the tab isn't there.
      const tronTab = page.getByRole("button", { name: "Tron", exact: true });
      try {
        await tronTab.waitFor({ state: "visible", timeout: 3000 });
      } catch {
        return false;
      }
      await tronTab.click();
      await page.waitForTimeout(800);
    },
  },
  // Wallet-gated — flagged for manual capture below
  { name: "home-empty", url: DASHBOARD_URL + "/", outDir: OUT_DASHBOARD, needsAuth: true },
  { name: "create-destination", url: DASHBOARD_URL + "/", outDir: OUT_DASHBOARD, needsAuth: true },
  { name: "home-with-destination", url: DASHBOARD_URL + "/", outDir: OUT_DASHBOARD, needsAuth: true },
  { name: "manage-destination", url: DASHBOARD_URL + "/manage-destination", outDir: OUT_DASHBOARD, needsAuth: true },
  { name: "generate-client-id", url: DASHBOARD_URL + "/manage-destination", outDir: OUT_DASHBOARD, needsAuth: true },
  { name: "client-id-details", url: DASHBOARD_URL + "/manage-destination", outDir: OUT_DASHBOARD, needsAuth: true },
  { name: "get-paid-list", url: DASHBOARD_URL + "/get-paid", outDir: OUT_DASHBOARD, needsAuth: true },
  { name: "get-paid-new", url: DASHBOARD_URL + "/get-paid/new", outDir: OUT_DASHBOARD, needsAuth: true },
  { name: "get-paid-detail", url: DASHBOARD_URL + "/get-paid", outDir: OUT_DASHBOARD, needsAuth: true },
  { name: "pay-list", url: DASHBOARD_URL + "/pay", outDir: OUT_DASHBOARD, needsAuth: true },
];

const securePaymentShots: Shot[] = [
  {
    name: "payment-not-found",
    url: SECURE_PAYMENT_URL + "/?token=invalid",
    outDir: OUT_SECURE,
  },
  {
    name: "payment-expired",
    url: SECURE_PAYMENT_URL + "/?token=expired",
    outDir: OUT_SECURE,
  },
  // The rest require a live request-api with seeded payment links
  { name: "connect-wallet", url: SECURE_PAYMENT_URL + "/", outDir: OUT_SECURE, needsAuth: true },
  { name: "connect-wallet-tron", url: SECURE_PAYMENT_URL + "/", outDir: OUT_SECURE, needsAuth: true },
  { name: "payment-options", url: SECURE_PAYMENT_URL + "/", outDir: OUT_SECURE, needsAuth: true },
  { name: "payment-options-crosschain", url: SECURE_PAYMENT_URL + "/", outDir: OUT_SECURE, needsAuth: true },
  { name: "payment-stepper", url: SECURE_PAYMENT_URL + "/", outDir: OUT_SECURE, needsAuth: true },
  { name: "payment-success", url: SECURE_PAYMENT_URL + "/", outDir: OUT_SECURE, needsAuth: true },
  { name: "advanced-view", url: SECURE_PAYMENT_URL + "/", outDir: OUT_SECURE, needsAuth: true },
];

async function captureShot(browser: Browser, shot: Shot): Promise<"ok" | "manual" | "fail"> {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    storageState: AUTH_STATE && shot.needsAuth ? AUTH_STATE : undefined,
    colorScheme: "dark",
  });
  const page = await context.newPage();

  try {
    if (shot.needsAuth && !AUTH_STATE) {
      console.log(`MANUAL: ${shot.outDir.includes("dashboard") ? "dashboard" : "secure-payments"}/${shot.name}`);
      return "manual";
    }

    await page.goto(shot.url, { waitUntil: "networkidle", timeout: 15_000 });

    if (shot.setup) {
      const result = await shot.setup(page);
      if (result === false) {
        console.log(`SKIP:   ${shot.name} (setup returned false)`);
        return "manual";
      }
    }

    // Settle a moment for animations
    await page.waitForTimeout(800);

    const buf = await page.screenshot({ type: "png", fullPage: false });

    await mkdir(shot.outDir, { recursive: true });
    const outPath = join(shot.outDir, `${shot.name}.webp`);
    await sharp(buf).webp({ quality: 88 }).toFile(outPath);

    console.log(`OK:     ${outPath.replace(ROOT + "/", "")}`);
    return "ok";
  } catch (err) {
    console.log(`FAIL:   ${shot.name} — ${(err as Error).message.split("\n")[0]}`);
    return "fail";
  } finally {
    await context.close();
  }
}

async function main() {
  const browser = await chromium.launch();

  const summary = { ok: 0, manual: 0, fail: 0 };

  for (const shot of [...dashboardShots, ...securePaymentShots]) {
    const result = await captureShot(browser, shot);
    summary[result]++;
  }

  await browser.close();

  console.log("\n=== Capture summary ===");
  console.log(`captured: ${summary.ok}`);
  console.log(`manual:   ${summary.manual}`);
  console.log(`failed:   ${summary.fail}`);

  if (summary.manual > 0) {
    console.log(
      "\nWallet-gated shots: sign in to the Dashboard interactively, dump auth state with",
      "\n  await context.storageState({ path: 'auth-state.json' })",
      "\nthen re-run with AUTH_STATE=./auth-state.json",
    );
  }

  process.exit(summary.fail > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
