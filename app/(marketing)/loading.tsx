export default function MarketingLoading() {
  return (
    <div className="min-h-screen-safe" role="status" aria-label="Loading Northline">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <span className="sr-only">Loading Northline</span>
        <div className="h-8 w-36 animate-pulse rounded bg-[var(--northline-surface)]" />
        <div className="mt-12 grid gap-5 md:grid-cols-[0.8fr_1.2fr]">
          <div className="min-h-[400px] animate-pulse rounded-2xl bg-[var(--northline-surface)]" />
          <div className="min-h-[400px] animate-pulse rounded-2xl bg-[var(--northline-surface)]" />
        </div>
        <div className="mt-6 h-28 animate-pulse rounded-2xl bg-[var(--northline-surface)]" />
      </div>
    </div>
  );
}
