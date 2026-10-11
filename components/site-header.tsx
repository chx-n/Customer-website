"use client";

import { useState } from "react";
import Link from "next/link";
import { CarSimple, List, SignIn, UserCircle, X } from "@phosphor-icons/react";

import type { SessionUser } from "@/lib/auth";

interface SiteHeaderProps {
  user: SessionUser | null;
}

export function SiteHeader({ user }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative z-30 border-b border-[var(--northline-border)] bg-[var(--northline-background)]/95 backdrop-blur-md">
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group inline-flex items-center gap-3" onClick={() => setMenuOpen(false)}>
          <span className="grid size-9 place-items-center rounded-[10px] bg-[var(--northline-accent)] text-[var(--northline-background)] transition-transform duration-200 group-hover:rotate-[-6deg] motion-reduce:transition-none motion-reduce:group-hover:rotate-0">
            <CarSimple aria-hidden="true" size={20} weight="fill" />
          </span>
          <span>
            <span className="block text-sm font-bold tracking-[0.16em] text-[var(--northline-text)]">NORTHLINE</span>
            <span className="block text-[10px] uppercase tracking-[0.18em] text-[var(--northline-text-muted)]">Rental studio</span>
          </span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-7 md:flex">
          <Link className="text-sm text-[var(--northline-text-muted)] transition-colors hover:text-[var(--northline-text)]" href="/fleet">
            Fleet
          </Link>
          {user ? (
            <Link className="inline-flex items-center gap-2 text-sm text-[var(--northline-text-muted)] transition-colors hover:text-[var(--northline-text)]" href="/dashboard">
              <UserCircle aria-hidden="true" size={18} />
              Account
            </Link>
          ) : (
            <Link className="inline-flex items-center gap-2 text-sm text-[var(--northline-text-muted)] transition-colors hover:text-[var(--northline-text)]" href="/login">
              <SignIn aria-hidden="true" size={18} />
              Log in
            </Link>
          )}
          <Link className="rounded-[10px] bg-[var(--northline-accent)] px-4 py-2.5 text-sm font-bold text-[var(--northline-background)] transition-colors hover:bg-[#d8fa8e]" href="/fleet">
            Browse cars
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-[10px] border border-[var(--northline-border)] text-[var(--northline-text)] md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X aria-hidden="true" size={21} /> : <List aria-hidden="true" size={21} />}
        </button>
      </div>

      <nav
        id="mobile-navigation"
        aria-label="Mobile navigation"
        className={`${menuOpen ? "grid" : "hidden"} gap-1 border-t border-[var(--northline-border)] px-4 py-3 md:hidden`}
      >
        <Link className="rounded-[10px] px-3 py-3 text-sm text-[var(--northline-text)] hover:bg-[var(--northline-surface)]" href="/fleet" onClick={() => setMenuOpen(false)}>
          Fleet
        </Link>
        {user ? (
          <Link className="rounded-[10px] px-3 py-3 text-sm text-[var(--northline-text)] hover:bg-[var(--northline-surface)]" href="/dashboard" onClick={() => setMenuOpen(false)}>
            Account
          </Link>
        ) : (
          <Link className="rounded-[10px] px-3 py-3 text-sm text-[var(--northline-text)] hover:bg-[var(--northline-surface)]" href="/login" onClick={() => setMenuOpen(false)}>
            Log in
          </Link>
        )}
        <Link className="mt-1 rounded-[10px] bg-[var(--northline-accent)] px-3 py-3 text-center text-sm font-bold text-[var(--northline-background)]" href="/fleet" onClick={() => setMenuOpen(false)}>
          Browse cars
        </Link>
      </nav>
    </header>
  );
}
