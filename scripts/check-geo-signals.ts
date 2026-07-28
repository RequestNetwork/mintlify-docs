/**
 * GEO / agent-discoverability signal check for the Request Network Mintlify docs.
 *
 * ============================================================================
 * IMPORTANT: this script asserts the POST-MERGE, DEPLOYED target state.
 * ============================================================================
 * Several checks below (the redirects, the robots meta + Organization JSON-LD
 * on rendered HTML, and possibly llms.txt/llms-full.txt depending on deploy
 * timing) will legitimately FAIL if run against production BEFORE this PR
 * stack has merged and Mintlify has rebuilt the site. A failing run before
 * merge is expected and is not a regression — re-run after merge + deploy to
 * get a meaningful result. See VALIDATION.md for how this fits into the
 * broader verification process.
 *
 * Usage:
 *   npx tsx scripts/check-geo-signals.ts
 *   BASE_URL=https://staging.docs.request.network npx tsx scripts/check-geo-signals.ts
 *   npx tsx scripts/check-geo-signals.ts https://staging.docs.request.network
 *
 * Exit code is non-zero only if a non-platform-gated check fails.
 */

const DEFAULT_BASE_URL = "https://docs.request.network";
const BASE_URL = (process.argv[2] || process.env.BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");

type Status = "PASS" | "FAIL" | "PLATFORM-GATED";

type Result = {
  name: string;
  status: Status;
  reason: string;
};

const results: Result[] = [];

function record(name: string, status: Status, reason: string) {
  results.push({ name, status, reason });
  const label = status.padEnd(15, " ");
  console.log(`${label} ${name} — ${reason}`);
}

async function fetchText(url: string, init?: RequestInit): Promise<{ ok: boolean; status: number; body: string; headers: Headers; error?: string }> {
  try {
    const res = await fetch(url, init);
    const body = await res.text();
    return { ok: res.ok, status: res.status, body, headers: res.headers };
  } catch (err) {
    return { ok: false, status: 0, body: "", headers: new Headers(), error: (err as Error).message };
  }
}

// --- Check 1: /llms.txt ---
async function checkLlmsTxt() {
  const url = `${BASE_URL}/llms.txt`;
  const res = await fetchText(url);
  if (res.error) {
    record("llms.txt reachable", "FAIL", `network error — ${res.error}`);
    return;
  }
  if (res.status !== 200) {
    record("llms.txt reachable", "FAIL", `expected 200, got ${res.status}`);
    return;
  }
  record("llms.txt reachable", "PASS", "200 OK");

  const anchors = ["Request Network", "## Credentials", "RN_CLIENT_ID"];
  for (const anchor of anchors) {
    if (res.body.includes(anchor)) {
      record(`llms.txt contains "${anchor}"`, "PASS", "found");
    } else {
      record(`llms.txt contains "${anchor}"`, "FAIL", "not found in body");
    }
  }
}

// --- Check 2: /llms-full.txt ---
async function checkLlmsFullTxt() {
  const url = `${BASE_URL}/llms-full.txt`;
  const res = await fetchText(url);
  if (res.error) {
    record("llms-full.txt reachable", "FAIL", `network error — ${res.error}`);
    return;
  }
  if (res.status === 200) {
    record("llms-full.txt reachable", "PASS", "200 OK (Mintlify auto-generated)");
  } else {
    record("llms-full.txt reachable", "FAIL", `expected 200, got ${res.status}`);
  }
}

// --- Check 3: redirects ---
const REDIRECTS: Array<{ source: string; destination: string }> = [
  { source: "/api-features/no-code-payment-links", destination: "/use-cases/no-code-payment-links" },
  { source: "/api-features/programmatic-payment-links", destination: "/use-cases/programmatic-payment-links" },
  { source: "/api-features/authentication", destination: "/api-reference/authentication" },
];

function locationMatches(location: string | null, destination: string): boolean {
  if (!location) return false;
  try {
    const asUrl = new URL(location, BASE_URL);
    return asUrl.pathname.replace(/\/$/, "") === destination.replace(/\/$/, "");
  } catch {
    return location.replace(/\/$/, "") === destination.replace(/\/$/, "");
  }
}

async function checkRedirects() {
  for (const { source, destination } of REDIRECTS) {
    const url = `${BASE_URL}${source}`;
    try {
      const res = await fetch(url, { redirect: "manual" });
      if (res.status >= 300 && res.status < 400) {
        const location = res.headers.get("location");
        if (locationMatches(location, destination)) {
          record(`redirect ${source}`, "PASS", `${res.status} -> ${location}`);
        } else {
          record(`redirect ${source}`, "FAIL", `${res.status} -> ${location ?? "(no location header)"}, expected ${destination}`);
        }
      } else {
        // Some hosts resolve redirects transparently even with redirect:"manual"
        // (e.g. edge rewrites). Fall back to checking the final resolved URL.
        const followed = await fetch(url, { redirect: "follow" });
        const finalPath = new URL(followed.url).pathname.replace(/\/$/, "");
        if (finalPath === destination.replace(/\/$/, "")) {
          record(`redirect ${source}`, "PASS", `resolved (no 3xx observed) -> ${finalPath}`);
        } else {
          record(`redirect ${source}`, "FAIL", `expected 3xx to ${destination}, got ${res.status} and final path ${finalPath}`);
        }
      }
    } catch (err) {
      record(`redirect ${source}`, "FAIL", `network error — ${(err as Error).message}`);
    }
  }
}

// --- Check 4: rendered HTML signals ---
const PAGES_TO_CHECK = ["/", "/use-cases/no-code-payment-links"];

async function checkHtmlSignals() {
  for (const path of PAGES_TO_CHECK) {
    const url = `${BASE_URL}${path}`;
    const res = await fetchText(url);
    if (res.error) {
      record(`HTML signals ${path}`, "FAIL", `network error — ${res.error}`);
      continue;
    }
    if (res.status !== 200) {
      record(`HTML signals ${path}`, "FAIL", `expected 200, got ${res.status}`);
      continue;
    }

    const hasRobotsMeta =
      /<meta[^>]+name=["']robots["'][^>]*content=["'][^"']*max-snippet:-1[^"']*["']/i.test(res.body);
    record(
      `${path} robots meta max-snippet:-1`,
      hasRobotsMeta ? "PASS" : "FAIL",
      hasRobotsMeta ? "found in <head>" : "not found",
    );

    const hasOrgJsonLd = /"@type"\s*:\s*"Organization"/.test(res.body);
    record(
      `${path} Organization JSON-LD`,
      hasOrgJsonLd ? "PASS" : "FAIL",
      hasOrgJsonLd ? 'found "@type":"Organization"' : "not found",
    );
  }
}

// --- Platform-gated checks (never fail the run) ---
async function checkPlatformGated() {
  // llms.txt <link rel="alternate"> in <head>
  {
    const res = await fetchText(`${BASE_URL}/`);
    const hasLink =
      !res.error &&
      /<link[^>]+rel=["']alternate["'][^>]+type=["']text\/plain["'][^>]+href=["']\/llms\.txt["']/i.test(res.body);
    record(
      '<link rel="alternate" type="text/plain" href="/llms.txt">',
      hasLink ? "PASS" : "PLATFORM-GATED",
      hasLink ? "found in <head>" : "not present — gated behind Mintlify support request (REQ-271)",
    );
  }

  // robots.txt per-bot Allow lines
  {
    const res = await fetchText(`${BASE_URL}/robots.txt`);
    const bots = ["GPTBot", "OAI-SearchBot", "ClaudeBot", "PerplexityBot", "Google-Extended"];
    if (res.error || res.status !== 200) {
      record(
        "robots.txt per-bot Allow lines",
        "PLATFORM-GATED",
        `robots.txt not reachable (status ${res.status}) — gated behind Mintlify support request (REQ-271)`,
      );
    } else {
      const missing = bots.filter((bot) => !new RegExp(`User-agent:\\s*${bot}[\\s\\S]{0,200}?Allow:`, "i").test(res.body));
      if (missing.length === 0) {
        record("robots.txt per-bot Allow lines", "PASS", "all bots have explicit Allow lines");
      } else {
        record(
          "robots.txt per-bot Allow lines",
          "PLATFORM-GATED",
          `missing explicit Allow lines for: ${missing.join(", ")} — gated behind Mintlify support request (REQ-271)`,
        );
      }
    }
  }

  // /.well-known/security.txt
  {
    const res = await fetchText(`${BASE_URL}/.well-known/security.txt`);
    const ok = !res.error && res.status === 200;
    record(
      "/.well-known/security.txt",
      ok ? "PASS" : "PLATFORM-GATED",
      ok ? "200 OK" : `status ${res.status} — gated behind Mintlify support request (REQ-271)`,
    );
  }

  // Security headers
  {
    const res = await fetchText(`${BASE_URL}/`);
    if (res.error) {
      record("X-Content-Type-Options / Referrer-Policy headers", "PLATFORM-GATED", `network error — ${res.error}`);
    } else {
      const xcto = res.headers.get("x-content-type-options");
      const rp = res.headers.get("referrer-policy");
      const ok = !!xcto && !!rp;
      record(
        "X-Content-Type-Options / Referrer-Policy headers",
        ok ? "PASS" : "PLATFORM-GATED",
        ok
          ? `x-content-type-options: ${xcto}, referrer-policy: ${rp}`
          : `x-content-type-options: ${xcto ?? "(missing)"}, referrer-policy: ${rp ?? "(missing)"} — platform-controlled`,
      );
    }
  }

  // Cache-Control not no-store
  {
    const res = await fetchText(`${BASE_URL}/`);
    if (res.error) {
      record("Cache-Control not no-store", "PLATFORM-GATED", `network error — ${res.error}`);
    } else {
      const cc = res.headers.get("cache-control");
      // A missing header is not a pass: without an explicit cacheable
      // directive we cannot claim the signal is configured.
      const cacheable = !!cc && !/no-store/i.test(cc);
      record(
        "Cache-Control not no-store",
        cacheable ? "PASS" : "PLATFORM-GATED",
        `cache-control: ${cc ?? "(missing)"}${cacheable ? "" : " — platform-controlled"}`,
      );
    }
  }
}

async function main() {
  console.log("=".repeat(78));
  console.log("GEO / agent-discoverability signal check");
  console.log(`Target: ${BASE_URL}`);
  console.log(
    "This script asserts the POST-MERGE, DEPLOYED target state.\n" +
      "Redirect and rendered-HTML checks (and possibly llms.txt/llms-full.txt) are\n" +
      "expected to FAIL if run against production before this PR stack has merged\n" +
      "and Mintlify has rebuilt the site. That is not a regression.",
  );
  console.log("=".repeat(78));
  console.log();

  await checkLlmsTxt();
  await checkLlmsFullTxt();
  await checkRedirects();
  await checkHtmlSignals();
  await checkPlatformGated();

  console.log();
  console.log("=".repeat(78));
  console.log("Summary");
  console.log("=".repeat(78));

  const counts = { PASS: 0, FAIL: 0, "PLATFORM-GATED": 0 } as Record<Status, number>;
  for (const r of results) counts[r.status]++;

  for (const r of results) {
    console.log(`  [${r.status.padEnd(15, " ")}] ${r.name}`);
  }

  console.log();
  console.log(`PASS: ${counts.PASS}  FAIL: ${counts.FAIL}  PLATFORM-GATED: ${counts["PLATFORM-GATED"]}`);

  const failing = results.filter((r) => r.status === "FAIL");
  if (failing.length > 0) {
    console.log("\nNon-platform-gated failures (exit code will be non-zero):");
    for (const r of failing) {
      console.log(`  - ${r.name}: ${r.reason}`);
    }
    process.exit(1);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error("Unhandled error in check-geo-signals:", err);
  process.exit(1);
});
