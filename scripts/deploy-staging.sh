#!/usr/bin/env bash
# One-command staging deploy: build a static export and publish it to the
# `gh-pages` branch, which GitHub Pages serves at
# https://<owner>.github.io/<repo>/.
#
# Usage:  npm run deploy:staging
#
# This is the manual path. Once the `workflow` OAuth scope is granted, the
# GitHub Actions workflow (.github/workflows/deploy-staging.yml) does this
# automatically on every green push to main.
set -euo pipefail

REPO_NAME="${PAGES_REPO_NAME:-istoria-saas}"
BRANCH="gh-pages"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

SHA="$(git rev-parse --short HEAD)"
REMOTE_URL="$(git remote get-url origin)"

echo "==> Building static export (base path /$REPO_NAME, commit $SHA)"
rm -rf out
MSYS_NO_PATHCONV=1 \
  DEPLOY_TARGET=github-pages \
  PAGES_BASE_PATH="/$REPO_NAME" \
  NEXT_PUBLIC_APP_ENV=staging \
  NEXT_PUBLIC_COMMIT_SHA="$SHA" \
  npm run build

echo "==> Publishing ./out to $BRANCH"
WORKDIR="$(mktemp -d)"
trap 'rm -rf "$WORKDIR"' EXIT
cp -r out/. "$WORKDIR/"
touch "$WORKDIR/.nojekyll"
cd "$WORKDIR"
git init -q -b "$BRANCH"
git add -A
git -c commit.gpgsign=false commit -q -m "deploy: staging $SHA"
git push -f "$REMOTE_URL" "$BRANCH"

echo "==> Done. Staging: https://$(echo "$REMOTE_URL" | sed -E 's#https://github.com/([^/]+)/.*#\1#').github.io/$REPO_NAME/"
