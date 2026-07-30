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

import { readFileSync } from "node:fs";

const DEFAULT_BASE_URL = "https://docs.request.network";
const BASE_URL = (process.argv[2] || process.env.BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");

type Status = "PASS" | "FAIL" | "PLATFORM-GATED" | "INFO";

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

// --- HTML parsing helpers ---
//
// Every HTML signal below is read from a *parsed* tag or a *parsed* JSON-LD
// block rather than from a regex over the whole response body, so that a check
// never depends on attribute order and never matches a marker that happens to
// appear in prose, a code sample, or an embedded framework payload.
//
// Markup only counts when it is *active*. Before any tag is matched, HTML
// comments and the text content of `<script>`/`<style>`/`<template>` are
// removed, and the head-only signals are matched against `<head>` alone.
// Otherwise a commented-out tag, or the same literal markup appearing inside
// script text, would report PASS after the real signal had been deleted.

type TagAttributes = Record<string, string>;

const ATTRIBUTE_PATTERN =
  /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'`=<>]+)))?/g;

function parseAttributes(raw: string): TagAttributes {
  const attributes: TagAttributes = {};
  for (const match of raw.matchAll(ATTRIBUTE_PATTERN)) {
    attributes[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? "";
  }
  return attributes;
}

/** Commented-out markup is inert; a crawler never sees it, so neither should we. */
function stripComments(html: string): string {
  return html.replace(/<!--[\s\S]*?-->/g, "");
}

/**
 * Removes the *text content* of elements whose contents are not markup, so that
 * a tag written out inside script text (an inlined framework payload, a docs
 * example) is not mistaken for a tag the document actually declares.
 */
function stripInertText(html: string): string {
  return html.replace(/<(script|style|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "");
}

/** The `<head>` markup, or the whole document if no head can be located. */
function headOf(html: string): string {
  return /<head\b[^>]*>([\s\S]*?)<\/head\s*>/i.exec(html)?.[1] ?? html;
}

/** Active tags declared in `<head>` — comments and script/style text excluded. */
function findHeadTags(html: string, tagName: string): TagAttributes[] {
  const head = headOf(stripInertText(stripComments(html)));
  const pattern = new RegExp(`<${tagName}\\b([^>]*)>`, "gi");
  return [...head.matchAll(pattern)].map((match) => parseAttributes(match[1]));
}

/** The parsed contents of every active `<script type="application/ld+json">` block. */
function parseJsonLdBlocks(html: string): unknown[] {
  const blocks: unknown[] = [];
  const scriptPattern = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
  for (const match of stripComments(html).matchAll(scriptPattern)) {
    if (parseAttributes(match[1]).type?.trim().toLowerCase() !== "application/ld+json") continue;
    try {
      blocks.push(JSON.parse(match[2]));
    } catch {
      // A block that isn't valid JSON carries no structured-data signal.
    }
  }
  return blocks;
}

/**
 * The nodes a JSON-LD block actually declares: the block itself, the members of
 * a top-level array, and the members of any `@graph`.
 *
 * Deliberately *not* a recursive walk of every property. Mintlify's stock
 * `WebSite` block nests `{"@type":"Organization","name":"Mintlify"}` under
 * `creator`, so counting nested nodes would let the Organization check pass on
 * any Mintlify site regardless of our own structured data.
 */
function declaredNodes(block: unknown): Record<string, unknown>[] {
  const nodes: Record<string, unknown>[] = [];
  const visit = (value: unknown) => {
    if (Array.isArray(value)) {
      for (const entry of value) visit(entry);
      return;
    }
    if (!value || typeof value !== "object") return;
    const node = value as Record<string, unknown>;
    nodes.push(node);
    if ("@graph" in node) visit(node["@graph"]);
  };
  visit(block);
  return nodes;
}

function hasType(node: Record<string, unknown>, type: string): boolean {
  const declared = node["@type"];
  return Array.isArray(declared) ? declared.includes(type) : declared === type;
}

/** `seo.organization` from docs.json — the organization identity this repo configures. */
function configuredOrganization(): { id?: string; name?: string; url?: string } {
  try {
    const raw = readFileSync(new URL("../docs.json", import.meta.url), "utf8");
    const config = JSON.parse(raw) as {
      seo?: { organization?: { id?: string; name?: string; url?: string } };
    };
    return config.seo?.organization ?? {};
  } catch {
    return {};
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
  const configured = configuredOrganization();
  const expectedIdentity = [configured.id, configured.url, configured.name].filter(
    (value): value is string => !!value,
  );

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

    const robotsContent = findHeadTags(res.body, "meta")
      .filter((attributes) => attributes.name?.toLowerCase() === "robots")
      .map((attributes) => attributes.content ?? "");
    const hasRobotsMeta = robotsContent.some((content) =>
      content.toLowerCase().includes("max-snippet:-1"),
    );
    record(
      `${path} robots meta max-snippet:-1`,
      hasRobotsMeta ? "PASS" : "FAIL",
      hasRobotsMeta
        ? "found in <head>"
        : robotsContent.length > 0
          ? `robots meta present without max-snippet:-1 — content: ${robotsContent.join(" | ")}`
          : "no robots meta tag found",
    );

    const organizations = parseJsonLdBlocks(res.body)
      .flatMap(declaredNodes)
      .filter((node) => hasType(node, "Organization"));
    record(
      `${path} Organization JSON-LD`,
      organizations.length > 0 ? "PASS" : "FAIL",
      organizations.length > 0
        ? `declared in application/ld+json — ${organizations
            .map((node) => String(node["@id"] ?? node.url ?? node.name ?? "(unidentified)"))
            .join(", ")}`
        : "no Organization node declared in any application/ld+json block",
    );

    // Mintlify emits a default Organization derived from docs.json "name", so the
    // presence check above can be satisfied by platform defaults alone. This line
    // reports whether the identity configured in docs.json seo.organization is the
    // one actually being served. It never fails the run: whether Mintlify honours
    // seo.organization over its own default is platform behaviour we have not
    // confirmed, so a mismatch is reported rather than asserted.
    if (expectedIdentity.length > 0) {
      const matched = organizations.find((node) =>
        expectedIdentity.some(
          (value) => node["@id"] === value || node.url === value || node.name === value,
        ),
      );
      record(
        `${path} Organization matches docs.json seo.organization`,
        matched ? "PASS" : "INFO",
        matched
          ? `@id ${String(matched["@id"] ?? "(none)")}, name ${String(matched.name ?? "(none)")}`
          : `no Organization node carries ${expectedIdentity.join(" / ")} — only Mintlify's default organization data is being served`,
      );
    }
  }
}

// --- Platform-gated checks (never fail the run) ---
async function checkPlatformGated() {
  // llms.txt <link rel="alternate"> in <head>
  {
    const res = await fetchText(`${BASE_URL}/`);
    const hasLink =
      !res.error &&
      findHeadTags(res.body, "link").some(
        (attributes) =>
          attributes.rel?.toLowerCase() === "alternate" &&
          attributes.type?.toLowerCase() === "text/plain" &&
          attributes.href === "/llms.txt",
      );
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

  const counts = { PASS: 0, FAIL: 0, "PLATFORM-GATED": 0, INFO: 0 } as Record<Status, number>;
  for (const r of results) counts[r.status]++;

  for (const r of results) {
    console.log(`  [${r.status.padEnd(15, " ")}] ${r.name}`);
  }

  console.log();
  console.log(
    `PASS: ${counts.PASS}  FAIL: ${counts.FAIL}  PLATFORM-GATED: ${counts["PLATFORM-GATED"]}  INFO: ${counts.INFO}`,
  );

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
