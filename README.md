# iStoria

Multi-tenant SaaS platform. This repo is the application foundation: Next.js + TypeScript,
green CI on trunk, and an auto-deployed staging environment.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

## Scripts

| Command                | What it does                          |
| ---------------------- | ------------------------------------- |
| `npm run dev`          | Dev server                            |
| `npm run build`        | Production build                      |
| `npm start`            | Serve production build                |
| `npm run lint`         | ESLint                                |
| `npm run typecheck`    | `tsc --noEmit`                        |
| `npm run format`       | Prettier (write)                      |
| `npm run format:check` | Prettier (check, used in CI)          |
| `npm test`             | Vitest (one-shot)                     |
| `npm run test:watch`   | Vitest (watch)                        |

## Stack

TypeScript · Next.js 16 (App Router) · Tailwind v4 · Vitest · ESLint · Prettier ·
GitHub Actions (CI) · GitHub Pages (staging).

See [`docs/architecture.md`](docs/architecture.md), [`docs/runbook.md`](docs/runbook.md),
and the stack rationale in [`docs/decisions/0001-stack.md`](docs/decisions/0001-stack.md).

## CI/CD

- **CI** runs on every push/PR to `main`: format, lint, typecheck, test, build.
- **Staging** auto-deploys from green `main` to GitHub Pages. The landing page footer
  stamps the deployed commit SHA.
