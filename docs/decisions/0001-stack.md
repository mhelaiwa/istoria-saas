# ADR-0001: Foundation stack

- **Status:** Proposed (reversible parts adopted; one-way doors pending CEO sign-off)
- **Date:** 2026-06-28
- **Author:** Nadia (Founding Engineer)
- **Decider on one-way doors:** Omar (CEO)

## Context

iStoria needs a foundation that a one-person team can ship and maintain through v1:
auth, multi-tenancy, billing, a dashboard, and a data model. We optimize for boring,
fast, well-supported tech and a quick path to a deployable, green trunk.

Per the engineering charter, **reversible (two-way-door)** choices are made fast and
reported; **one-way-door** choices (datastore, cloud/host, vendor lock-in, anything
touching payments/PII/legal) require a short rationale and CEO sign-off.

## Decisions

### Adopted now (two-way doors — reversible, no sign-off needed)

- **TypeScript** everywhere — one language, huge ecosystem, type safety for refactors.
- **Next.js 16 (App Router)** — full-stack React in one framework: UI + SSR + API routes.
  Covers landing page, authenticated dashboard, and webhook endpoints (billing) without
  a separate backend. Largest React meta-framework; well-supported.
- **npm** — preinstalled, zero-config, lockfile committed.
- **ESLint + Prettier** — standard lint/format, enforced in CI.
- **Vitest + Testing Library** — fast, Vite-native test runner.
- **GitHub Actions** — CI (build/lint/typecheck/test) on the repo we already have access to.
- **GitHub Pages (static export) for staging _today_** — gives a real, shareable staging
  URL at **zero cost and no new vendor**, proving CI/CD end-to-end. Reversible: it's just
  a deploy target; swapping to an SSR host later is a config change, not a rewrite.

### Proposed — **need CEO sign-off** (one-way doors)

1. **Datastore: PostgreSQL.** Boring, battle-tested relational DB; great fit for
   multi-tenant SaaS (row-level isolation or schema-per-tenant), transactions for billing
   integrity, and Prisma support. _Provider proposed: **Neon** (serverless Postgres, free
   tier, branching for previews)._ Lock-in is moderate (standard SQL; provider is swappable).

2. **ORM: Prisma.** Type-safe schema + migrations; pairs naturally with Postgres + TS.

3. **Production host: Vercel.** First-party Next.js hosting: one-command/git deploys,
   preview URLs per PR, edge network, generous hobby tier. Needed once we add SSR/auth/DB
   (IST-4/IST-7) which GitHub Pages can't serve. _Lock-in: moderate (Next can self-host or
   move to other Node hosts)._

4. **Repo/host governance.** The repo currently lives under the founder's authenticated
   GitHub account (`mhelaiwa`) to unblock day-1 CI/CD, and is named **`istoria-saas`**
   because the name `istoria` was already taken by an unrelated 2024 personal project on
   that account — concrete evidence we should not be sharing a personal namespace.
   **Proposed:** create a dedicated **GitHub Organization** for iStoria and transfer the
   repo (and decide public vs. private — recommend **private** before IST-4 adds
   auth/secrets; note GitHub Pages on a private repo needs a paid plan, which is part of
   why staging is public for the hello-world today).

### What sign-off unblocks

Approving (1)–(4) unblocks **IST-4** (auth/multi-tenancy), **IST-7** (data model/
migrations), and a production deploy. It also requires the CEO to **provision accounts /
credentials**: a Neon project (`DATABASE_URL`) and a Vercel project token (`VERCEL_TOKEN`),
added as repo/Org secrets. These are not things the engineer can create unilaterally
(account ownership + potential spend).

## Consequences

- We ship a green trunk and a live staging URL **immediately** with no vendor commitment.
- The SSR migration (Pages → Vercel) is deferred until we actually need a server — but the
  framework choice (Next.js) means it's a config change, not a rewrite.
- If the CEO prefers different vendors (e.g. Supabase instead of Neon, Render/Fly instead
  of Vercel, AWS), this ADR is updated before IST-4 begins.

## Open questions for CEO

- OK to standardize on **Postgres (Neon) + Vercel**? Any preference for AWS/GCP, Supabase,
  Render, or Fly instead?
- Create a **GitHub Organization** for iStoria now, or keep the repo on the founder
  account for now? Public or private?
- Budget ceiling for hosting/DB so I can stay within it?
