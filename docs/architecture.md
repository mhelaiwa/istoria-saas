# iStoria — Architecture

_Living document. Owner: Nadia (Founding Engineer). Last updated: 2026-06-28._

## 1. Overview

iStoria is a multi-tenant SaaS. This document describes the technical foundation as
it stands today and where it is headed. It is updated as the system evolves.

The guiding principles (from the engineering charter): **boring, fast, well-supported
tech**; ship in **thin vertical slices**; optimize for a **one-person team's** ability to
maintain it; no premature scaling.

## 2. Stack (current)

| Layer            | Choice                          | Status / Notes                                              |
| ---------------- | ------------------------------- | ---------------------------------------------------------- |
| Language         | TypeScript                      | Single language across the stack.                          |
| Framework        | Next.js 16 (App Router)         | Full-stack React: UI, server components, API routes, SSR.  |
| Styling          | Tailwind CSS v4                 | Utility-first; fast iteration.                             |
| Package manager  | npm                             | Preinstalled, zero-config, lockfile committed.             |
| Lint             | ESLint (`eslint-config-next`)   | Enforced in CI.                                            |
| Format           | Prettier (+ tailwind plugin)    | Enforced in CI (`format:check`).                           |
| Tests            | Vitest + Testing Library        | Fast, Vite-native, jsdom env.                              |
| CI               | GitHub Actions                  | Build + lint + typecheck + test on every push/PR to main.  |
| CD (staging)     | GitHub Actions → GitHub Pages   | Static export auto-deployed on green trunk. Zero cost.     |
| Datastore        | **PostgreSQL (proposed)**       | One-way door — pending CEO sign-off. See ADR-0001.         |
| ORM              | **Prisma (proposed)**           | Pairs with Postgres; type-safe migrations.                 |
| Prod host        | **Vercel (proposed)**           | One-way door — pending CEO sign-off. See ADR-0001.         |

Decisions with vendor lock-in (datastore, prod host) are **proposed, not committed** —
they require CEO sign-off and are tracked in `docs/decisions/0001-stack.md`.

## 3. Environments

| Environment | Where                                  | Deploys when                          |
| ----------- | -------------------------------------- | ------------------------------------- |
| local       | developer machine (`npm run dev`)      | n/a                                   |
| staging     | GitHub Pages — https://mhelaiwa.github.io/istoria-saas/ | `npm run deploy:staging` (manual today); auto on green `main` once `workflow` scope is granted |
| production  | TBD (Vercel, pending sign-off)         | TBD                                   |

Staging today is a **static export** — it proves the CI/CD pipeline end-to-end with a
real shareable URL at zero cost. Once we add server-side features (auth, DB, billing in
IST-4 / IST-7), staging/production move to an SSR host (Vercel proposed). The codebase
stays Next.js throughout; only the deploy target changes (see `next.config.ts`).

## 4. Repository layout

```
app/                 Next.js App Router (routes, layouts, server/client components)
  page.tsx           Landing (hello-world foundation page)
  page.test.tsx      Component test (Vitest + Testing Library)
  layout.tsx         Root layout + metadata
docs/                Architecture, runbook, and decision records (this dir)
  architecture.md
  runbook.md
  decisions/         ADRs for one-way-door choices
public/              Static assets (.nojekyll for Pages)
.github/workflows/   ci.yml (build/test), deploy-staging.yml (Pages deploy)
next.config.ts       Conditional static-export config for Pages
vitest.config.ts     Test runner config
```

## 5. CI/CD pipeline

1. **CI** (`.github/workflows/ci.yml`) runs on every push/PR to `main`:
   `npm ci` → `format:check` → `lint` → `typecheck` → `test` → `build`. Trunk stays green.
2. **Deploy Staging** (`.github/workflows/deploy-staging.yml`) runs after CI succeeds on
   `main`: builds a static export (`DEPLOY_TARGET=github-pages`) and publishes to GitHub
   Pages. The deployed page stamps the commit SHA so you can confirm what's live.

A red CI run never deploys (`deploy` is gated on `workflow_run.conclusion == 'success'`).

> **Activation status:** the workflow YAML files are authored and validated locally, but
> not yet pushed — the current GitHub token lacks the `workflow` OAuth scope. Until that's
> granted (see runbook), CI checks run locally (`npm run` scripts, all green) and staging
> deploys via `npm run deploy:staging`. This is the one named blocker on full automation.

## 6. Planned (not yet built)

- **IST-4** Auth + multi-tenant account/org model (RBAC).
- **IST-7** Data model, persistence & migrations baseline (Postgres + Prisma).
- **IST-6** App shell: public landing + authenticated dashboard skeleton.
- Billing (Stripe) — later slice.

These depend on the datastore/host decisions in ADR-0001 being signed off.
