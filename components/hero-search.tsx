"use client";

import { ArrowRight, MagnifyingGlass, SlidersHorizontal } from "@phosphor-icons/react";
import { createElement, type ReactNode } from "react";

export interface SearchValues {
  location?: string;
  pickupDate?: string;
  returnDate?: string;
  category?: string;
  transmission?: string;
  seats?: string;
  maxPricePerDay?: string;
}

interface HeroSearchProps {
  initialValues?: SearchValues;
}

interface FieldProps {
  children: ReactNode;
  htmlFor: string;
  label: string;
}

function Field({ children, htmlFor, label }: FieldProps) {
  return createElement(
    "div",
    { className: "min-w-0 space-y-2" },
    createElement("label", { htmlFor, className: "block text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--northline-text-muted)]" }, label),
    children,
  );
}

const controlClassName = "h-12 w-full rounded-[10px] border border-[var(--northline-border)] bg-[var(--northline-background)] px-3 text-sm text-[var(--northline-text)] outline-none transition-colors placeholder:text-[var(--northline-text-muted)] focus:border-[var(--northline-accent)]";

export function HeroSearch({ initialValues = {} }: HeroSearchProps) {
  const h = createElement;

  return h(
    "form",
    { id: "trip-search", action: "/fleet", method: "get", className: "rounded-2xl border border-[var(--northline-border)] bg-[var(--northline-surface)] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-5" },
      h(
        "div",
        { className: "mb-4 flex items-center justify-between gap-4" },
        h(
          "div",
          null,
          h("p", { className: "text-sm font-semibold text-[var(--northline-text)]" }, "Start with the route"),
          h("p", { className: "mt-1 text-xs text-[var(--northline-text-muted)]" }, "Choose a place and dates. Refine the car after."),
        ),
      h(
        "div",
        { className: "flex shrink-0 items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--northline-accent)]" },
        h("span", null, "Step 1 of 3"),
        h(MagnifyingGlass, { "aria-hidden": true, size: 20 }),
      ),
    ),
    h(
      "div",
      { className: "grid gap-3 md:grid-cols-[1.15fr_0.8fr_0.8fr_auto] md:items-end" },
      h(Field, { htmlFor: "hero-location", label: "Pickup location", children: h("input", { id: "hero-location", name: "location", type: "text", defaultValue: initialValues.location, placeholder: "Metro Manila", className: controlClassName }) }),
      h(Field, { htmlFor: "hero-pickup-date", label: "Pickup date", children: h("input", { id: "hero-pickup-date", name: "pickupDate", type: "date", defaultValue: initialValues.pickupDate, className: controlClassName }) }),
      h(Field, { htmlFor: "hero-return-date", label: "Return date", children: h("input", { id: "hero-return-date", name: "returnDate", type: "date", defaultValue: initialValues.returnDate, className: controlClassName }) }),
      h("button", { type: "submit", className: "group inline-flex h-12 items-center justify-center gap-3 rounded-[10px] bg-[var(--northline-accent)] px-4 text-sm font-bold text-[var(--northline-background)] transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[#d8fa8e] active:scale-[0.98] motion-reduce:active:scale-100" }, "Find my car", h("span", { className: "grid size-7 place-items-center rounded-full bg-[var(--northline-background)]/10 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5 motion-reduce:transform-none" }, h(ArrowRight, { "aria-hidden": true, size: 15, weight: "bold" }))),
    ),
  );
}

export function FleetFilterBar({ initialValues = {} }: HeroSearchProps) {
  const h = createElement;
  const option = (value: string, label: string) => h("option", { key: value || "any", value }, label);

  return h(
    "form",
    { action: "/fleet", method: "get", className: "rounded-2xl border border-[var(--northline-border)] bg-[var(--northline-surface)] p-4" },
    h(
      "div",
      { className: "mb-4 flex flex-wrap items-center justify-between gap-3" },
      h("div", { className: "inline-flex items-center gap-2 text-sm font-semibold text-[var(--northline-text)]" }, h(SlidersHorizontal, { "aria-hidden": true, className: "text-[var(--northline-accent)]", size: 18 }), "Refine the fleet"),
      h("a", { href: "/fleet", className: "text-xs font-semibold text-[var(--northline-text-muted)] underline-offset-4 hover:text-[var(--northline-text)] hover:underline" }, "Reset filters"),
    ),
    h(
      "div",
      { className: "grid gap-3 sm:grid-cols-2 md:grid-cols-4" },
      h(Field, { htmlFor: "fleet-category", label: "Vehicle type", children: h("select", { id: "fleet-category", name: "category", defaultValue: initialValues.category ?? "", className: controlClassName }, [option("", "All types"), option("compact", "Compact"), option("hatchback", "Hatchback"), option("sedan", "Sedan"), option("suv", "SUV"), option("wagon", "Wagon")]) }),
      h(Field, { htmlFor: "fleet-transmission", label: "Transmission", children: h("select", { id: "fleet-transmission", name: "transmission", defaultValue: initialValues.transmission ?? "", className: controlClassName }, [option("", "Any transmission"), option("automatic", "Automatic"), option("manual", "Manual")]) }),
      h(Field, { htmlFor: "fleet-seats", label: "Seats", children: h("select", { id: "fleet-seats", name: "seats", defaultValue: initialValues.seats ?? "", className: controlClassName }, [option("", "Any seats"), option("4", "4 or more"), option("5", "5 or more")]) }),
      h(Field, { htmlFor: "fleet-price", label: "Daily price", children: h("select", { id: "fleet-price", name: "maxPricePerDay", defaultValue: initialValues.maxPricePerDay ?? "", className: controlClassName }, [option("", "Any price"), option("3500", "Up to ₱3,500"), option("4000", "Up to ₱4,000"), option("4500", "Up to ₱4,500"), option("5000", "Up to ₱5,000")]) }),
    ),
    initialValues.location ? h("input", { type: "hidden", name: "location", value: initialValues.location, readOnly: true }) : null,
    initialValues.pickupDate ? h("input", { type: "hidden", name: "pickupDate", value: initialValues.pickupDate, readOnly: true }) : null,
    initialValues.returnDate ? h("input", { type: "hidden", name: "returnDate", value: initialValues.returnDate, readOnly: true }) : null,
    h("button", { type: "submit", className: "mt-3 inline-flex min-h-10 items-center justify-center rounded-[10px] border border-[var(--northline-border)] px-4 text-xs font-bold uppercase tracking-[0.14em] text-[var(--northline-text)] transition-colors hover:border-[var(--northline-accent)] hover:text-[var(--northline-accent)] active:scale-[0.98] motion-reduce:active:scale-100 sm:hidden" }, "Apply filters"),
  );
}
