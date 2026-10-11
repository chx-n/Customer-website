"use client";

import Link from "next/link";
import { ArrowLeft, ArrowClockwise, WarningCircle } from "@phosphor-icons/react";

import { Button } from "@/components/button";

export default function MarketingError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen-safe px-4 py-10 sm:px-6 lg:px-8">
      <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center text-center">
        <div>
          <WarningCircle aria-hidden="true" className="mx-auto text-[var(--northline-accent)]" size={40} />
          <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--northline-accent)]">Northline could not load this view</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-[var(--northline-text)]">Let us try that again.</h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[var(--northline-text-muted)]">The local demo had trouble loading this page. You can retry or return to the fleet.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button onClick={reset} variant="primary">
              <ArrowClockwise aria-hidden="true" size={17} />
              Retry
            </Button>
            <Link href="/fleet" className="inline-flex min-h-11 items-center gap-2 rounded-[10px] border border-[var(--northline-border)] px-4 text-sm font-semibold text-[var(--northline-text)] hover:border-[var(--northline-accent)] hover:text-[var(--northline-accent)]">
              <ArrowLeft aria-hidden="true" size={17} />
              View fleet
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
