"use client";

import { createElement, useState } from "react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogout() {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
      if (!response.ok) throw new Error("Logout failed");
      router.push("/");
      router.refresh();
    } catch {
      setError("We could not log you out. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return createElement(
    "div",
    { className: "flex flex-col items-end gap-2" },
    createElement("button", { "aria-busy": isSubmitting, className: "rounded-[10px] border border-[var(--northline-border)] px-4 py-2.5 text-sm font-semibold text-[var(--northline-text)] transition hover:border-[var(--northline-accent)] hover:text-[var(--northline-accent)] disabled:cursor-not-allowed disabled:opacity-60", disabled: isSubmitting, onClick: handleLogout, type: "button" }, isSubmitting ? "Logging out…" : "Log out"),
    createElement("p", { "aria-live": "polite", className: "sr-only", role: "status" }, isSubmitting ? "Signing you out…" : ""),
    error ? createElement("p", { className: "max-w-48 text-right text-xs text-[#ffaaa3]", role: "alert" }, error) : null,
  );
}
