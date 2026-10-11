export default function DashboardLoading() {
  return (
    <main className="min-h-screen-safe bg-[var(--northline-background)] px-5 py-8 text-[var(--northline-text)] sm:px-8 sm:py-12">
      <div aria-label="Loading dashboard" className="mx-auto max-w-6xl animate-pulse" role="status">
        <div className="h-4 w-28 rounded bg-[var(--northline-surface-raised)]" />
        <div className="mt-16 h-12 w-72 rounded bg-[var(--northline-surface-raised)]" />
        <div className="mt-4 h-4 w-56 rounded bg-[var(--northline-surface-raised)]" />
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <div className="h-64 rounded-2xl border border-[var(--northline-border)] bg-[var(--northline-surface)]" />
          <div className="h-64 rounded-2xl border border-[var(--northline-border)] bg-[var(--northline-surface)]" />
        </div>
      </div>
    </main>
  );
}
