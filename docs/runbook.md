# iStoria — Runbook

_Living document. Owner: Nadia (Founding Engineer). Last updated: 2026-06-28._

Operational guide: how to run, test, deploy, and recover the app.

## Prerequisites

- Node.js 20+ (CI pins Node 20; local dev tested on 20/23).
- npm 10+.

## Local development

```bash
npm install        # install dependencies
npm run dev        # start dev server at http://localhost:3000
```

## Quality gates (run before pushing)

```bash
npm run format     # auto-format with Prettier
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm test           # Vitest (one-shot)
npm run build      # production build
```

CI runs the check-only variants (`format:check`, `lint`, `typecheck`, `test`, `build`).

## Deploy to staging

- **Staging URL:** https://mhelaiwa.github.io/istoria-saas/
- **Verify what's live:** the landing page footer shows `build <commit-sha>`. Match it to
  the latest commit on `main`.

### Today: one-command manual deploy

```bash
npm run deploy:staging
```

Builds a static export and publishes it to the `gh-pages` branch (GitHub Pages serves it).
Requires Git Bash on Windows. Pages is configured to serve from `gh-pages` (branch source).

### Pending: automatic deploy on green trunk

`.github/workflows/deploy-staging.yml` auto-deploys after CI passes on `main`. **It is not
active yet** because the current GitHub auth token lacks the `workflow` scope, so workflow
files can't be pushed. To activate (one-time, by the repo account owner):

```bash
gh auth refresh -h github.com -s workflow   # grant workflow scope
git push origin main                        # push the .github/workflows/* files
```

Then switch Pages source to "GitHub Actions" (Settings → Pages) so the Actions deploy
takes over from the branch deploy.

## Building the static export locally

```bash
DEPLOY_TARGET=github-pages PAGES_BASE_PATH=/istoria-saas npm run build
# output in ./out  (open out/index.html)
```

> On Git Bash (Windows), prefix with `MSYS_NO_PATHCONV=1` so the leading slash in
> `PAGES_BASE_PATH` isn't mangled into a Windows path. Not needed in CI (Linux).

## Troubleshooting

| Symptom                              | Likely cause / fix                                                        |
| ------------------------------------ | ------------------------------------------------------------------------ |
| CI red on `format:check`             | Run `npm run format` and commit.                                         |
| CI red on `lint`/`typecheck`         | Run the same command locally; fix reported issues.                      |
| Staging shows old commit             | Check Actions → Deploy Staging ran & succeeded for the latest `main`.   |
| Pages 404 / broken CSS               | `PAGES_BASE_PATH` must match the repo name; Pages source = GitHub Actions. |
| `_next` assets 404 on Pages          | Ensure `public/.nojekyll` is present (Jekyll skips `_`-prefixed dirs).    |

## Future (post sign-off)

When we move production to an SSR host (Vercel, pending ADR-0001 sign-off):
add `VERCEL_TOKEN`/project secrets, add a `deploy-production` workflow, and provision a
managed Postgres (Neon proposed). This runbook will be updated then.
