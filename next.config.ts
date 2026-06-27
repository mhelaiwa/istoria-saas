import type { NextConfig } from "next";

/**
 * Staging today deploys a fully static export to GitHub Pages (zero-cost, no extra
 * accounts). GitHub Pages serves a project repo under /<repo>, so when building for
 * Pages we set basePath/assetPrefix and disable image optimization (no server).
 *
 * When we move the production app to an SSR host (Vercel — pending CEO sign-off),
 * leave DEPLOY_TARGET unset and Next runs as a normal server app with API routes.
 */
const isPagesBuild = process.env.DEPLOY_TARGET === "github-pages";
const repoBasePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(isPagesBuild
    ? {
        output: "export",
        basePath: repoBasePath,
        assetPrefix: repoBasePath || undefined,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
