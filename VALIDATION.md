# Validation: AI discoverability & GEO

This is a repo document, not a published page — it is not linked in `docs.json` navigation and should not be. It exists so a human or an agent can re-run, on demand, the checks that motivated the AI-discoverable-docs / GEO work (Linear REQ-159, REQ-169, REQ-271).

## When to run this

Run the full checklist below:

- After any docs change that touches credentials, webhooks, or the payment-link flow (`use-cases/`, `api-features/`, `api-reference/authentication.mdx`, `api-reference/webhooks.mdx`, and anything `llms.txt` summarizes).
- After each Mintlify platform change that could affect `robots.txt`, response headers, `llms.txt`/`llms-full.txt` generation, or redirects (Mintlify is a hosted platform — these can change independent of a docs PR).
- Before and after any release that claims to move the GEO grade or fix an agent-discoverability regression.

## Part 1 — the docs-only LLM check

This is the actual done-condition for the MVP: can an LLM, using only the public docs site (no repo access, no SDK), build a correct server-side integration that creates a payment link and confirms payment?

**How to run it:** Open a fresh Claude or ChatGPT session with web access enabled and nothing else attached (no project files, no repo, no custom instructions). Paste the prompt below verbatim.

> I'm integrating payments into my backend using Request Network. I want to let a customer pay an invoice and get notified server-side when it's paid. Using only https://docs.request.network, walk me through building this: creating a payment link, finding out what credentials I need and where to get them, wiring up a webhook so my server knows the payment is confirmed, and handling the case where the customer pays cross-chain. Ask me for whatever credentials or IDs you need. Write the integration code (any backend language you like) and tell me exactly what to call and in what order.

**Pass / fail rubric.** The run **passes** only if the assistant:

- Asks the user for **only**: the Client ID, the webhook secret returned when registering the webhook, and the Destination ID from the Dashboard. (The Destination ID is a non-secret identifier — asking for it is correct, not a failure.)
- **Never** asks for an API key, a private key, or a raw wallet address.
- Treats webhooks as the source of truth for payment state — fulfillment happens on `payment.confirmed`, and `payment.partial` is treated as an intermediate state, not a trigger to fulfill.
- Treats a cross-chain payment as **pending** until settled, not as final just because the payer was redirected back.
- Calls the REST API directly (`fetch`/`axios`/`requests`/`curl` against `api.request.network` / `auth.request.network`) rather than reaching for an SDK that doesn't exist.
- Verifies the webhook HMAC signature against the **raw** request body (not a re-serialized/parsed body) before trusting the payload.

Any one of these violated is a **fail** for that run, even if the rest of the flow is correct — these are exactly the mistakes the docs rewrite (REQ-159 et al.) was meant to prevent.

**Recording a run:** paste the transcript link (or a saved copy if the tool has no shareable link) and the date into the Results log below, plus a one-line note on what (if anything) failed.

## Part 2 — the automated signal check

`scripts/check-geo-signals.ts` checks the machine-readable signals (llms.txt, redirects, structured data, response headers) against a running deployment. It is fast, free, and doesn't need an LLM.

```bash
pnpm check-geo-signals
# or, without pnpm:
npx tsx scripts/check-geo-signals.ts

# against a non-default target:
BASE_URL=https://staging.docs.request.network pnpm check-geo-signals
```

Each check reports one of:

- **PASS** — the signal is present and correct.
- **FAIL** — the signal is missing or wrong. Non-zero exit code if any check is FAIL.
- **PLATFORM-GATED** — the signal depends on a Mintlify platform capability that isn't available to this repo yet (the `<link rel="alternate" type="text/plain" href="/llms.txt">` head tag, per-bot `robots.txt` Allow lines, `/.well-known/security.txt`, and certain response headers). These are tracked in REQ-271 and are **expected to stay failing** (reported as PLATFORM-GATED, not FAIL) until that platform request lands — do not treat them as a regression in this repo.

Note: the script's own header reminds you that redirect and rendered-HTML checks assert the **post-merge, deployed** state — running it against production before this PR stack merges will show real (and expected) FAILs for those checks. Re-run after merge + deploy for a meaningful result.

## Part 3 — link + build checks

```bash
mint broken-links
mint validate
```

- `mint broken-links` checks for dead internal links across the docs. Should be clean.
- `mint validate` runs Mintlify's strict-mode build validation. It passes as of this stack. It did not on `main`: two "Invalid import path react" warnings from unused `snippets/` files failed strict mode, and those files have since been removed (REQ-270). Any failure now is a real regression.

## Part 4 — the external GEO re-check

Two independent, third-party-ish signals of how "AI-readable" the site is overall:

1. **Outrun GEO checker** (or equivalent GEO/AEO grading tool). Baseline before this stack: **grade C, 172/257**. Re-run after deploy and record the new grade/score.
2. **Mintlify's own agent-readiness score:**
   ```bash
   mint login   # human step — requires an interactive browser login, do not attempt in CI
   mint score docs.request.network --format table
   ```
   `mint score` requires authentication and cannot be run unattended in CI; a human runs it locally after `mint login`.

Record the grade/score and the delta from the previous entry in the Results log.

## Results log

Do not add a row until the run has actually happened. Never fabricate or estimate a result — an empty log is more useful than an invented one.

| Date | What changed | LLM check verdict | Signal-check result | GEO grade | Notes |
| --- | --- | --- | --- | --- | --- |
| (baseline, pre-stack) | Baseline, before the AI-discoverable-docs / GEO stack | not run | not run | C / 172 (Outrun GEO checker) | Baseline measurement recorded before REQ-159/REQ-169/REQ-271 work started. No LLM check or signal-check existed yet. |
