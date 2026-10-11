import type { Metadata } from "next";
import Link from "next/link";

import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to manage a Northline Rental sample reservation.",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ next?: string | string[] }>;

function getNextPath(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = searchParams ? await searchParams : {};
  const nextPath = getNextPath(params.next);

  return (
    <main className="min-h-screen-safe bg-[var(--northline-background)] px-5 py-8 text-[var(--northline-text)] sm:px-8 sm:py-12">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-[var(--northline-border)] bg-[var(--northline-surface)] md:grid-cols-[0.85fr_1.15fr]">
          <aside className="hidden border-r border-[var(--northline-border)] p-10 md:block lg:p-14">
            <Link className="text-sm font-bold tracking-[0.22em] text-[var(--northline-accent)]" href="/">
              NORTHLINE
            </Link>
            <div className="mt-24">
              <p className="text-sm uppercase tracking-[0.18em] text-[var(--northline-text-muted)]">Keep moving</p>
              <h1 className="mt-4 max-w-xs text-4xl font-semibold leading-tight tracking-[-0.04em]">
                Your next route starts here.
              </h1>
              <p className="mt-5 max-w-xs text-sm leading-6 text-[var(--northline-text-muted)]">
                Sign in to reserve a demo vehicle and keep your trip details in one place.
              </p>
            </div>
          </aside>

          <section className="p-6 sm:p-10 lg:p-14" aria-labelledby="login-heading">
            <Link className="text-sm font-bold tracking-[0.22em] text-[var(--northline-accent)] md:hidden" href="/">
              NORTHLINE
            </Link>
            <p className="mt-10 text-sm uppercase tracking-[0.18em] text-[var(--northline-text-muted)] md:mt-0">Renter account</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]" id="login-heading">Log in</h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-[var(--northline-text-muted)]">
              Use your Northline account to continue to your reservation.
            </p>
            {nextPath ? (
              <div className="mt-6 rounded-[10px] border border-[var(--northline-border)] bg-[var(--northline-background)] px-4 py-3 text-sm leading-6 text-[var(--northline-text-muted)]">
                After you sign in, we will take you back to your car and keep your dates ready.
              </div>
            ) : null}
            <div className="mt-8">
              <AuthForm mode="login" nextPath={nextPath} />
            </div>
            <p className="mt-7 text-center text-sm text-[var(--northline-text-muted)]">
              New to Northline?{" "}
              <Link className="font-semibold text-[var(--northline-accent)] hover:underline" href={nextPath ? `/register?next=${encodeURIComponent(nextPath)}` : "/register"}>
                Create an account
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
