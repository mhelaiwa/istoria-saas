const COMMIT_SHA = process.env.NEXT_PUBLIC_COMMIT_SHA ?? "dev";
const ENVIRONMENT = process.env.NEXT_PUBLIC_APP_ENV ?? "local";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-zinc-50 p-8 text-center font-sans dark:bg-black">
      <span className="rounded-full border border-black/10 px-3 py-1 text-xs font-medium tracking-widest text-black/50 uppercase dark:border-white/15 dark:text-white/50">
        {ENVIRONMENT}
      </span>
      <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">iStoria</h1>
      <p className="max-w-md text-lg text-balance text-black/60 dark:text-white/60">
        Hello, world. The foundation is live — repo, CI, and a staging deploy are wired up.
      </p>
      <p className="font-mono text-xs text-black/40 dark:text-white/40" data-testid="build-sha">
        build {COMMIT_SHA}
      </p>
    </main>
  );
}
