"use client";

export default function DashboardError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="min-h-screen-safe bg-[var(--northline-background)] px-5 py-8 text-[var(--northline-text)] sm:px-8 sm:py-12">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-xl items-center justify-center text-center">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-[var(--northline-text-muted)]">Dashboard unavailable</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">We could not load your trips.</h1>
          <p className="mt-3 text-sm leading-6 text-[var(--northline-text-muted)]" role="alert">
            Try again in a moment. Your reservation data has not been changed.
          </p>
          <button className="mt-7 rounded-[10px] bg-[var(--northline-accent)] px-5 py-3 font-semibold text-[var(--northline-background)] transition hover:bg-[#d7fb83]" onClick={reset} type="button">
            Try again
          </button>
        </div>
      </div>
    </main>
  );
}
