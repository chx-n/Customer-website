import Link from "next/link";
import { ArrowUpRight, GearSix, UsersThree } from "@phosphor-icons/react/dist/ssr";
import { createElement } from "react";

import type { Car } from "@/lib/cars";

export interface VehicleCardProps {
  car: Car;
  featured?: boolean;
  hrefSuffix?: string;
}

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

export function VehicleCard({ car, featured = false, hrefSuffix = "" }: VehicleCardProps) {
  const h = createElement;
  const detailHref = `/fleet/${car.slug}${hrefSuffix}`;
  const imagePanel = h(
    "div",
    { className: `relative overflow-hidden ${featured ? "aspect-[5/4]" : "aspect-[4/3]"}` },
    h("img", {
      src: car.imageUrl,
      alt: car.name,
      loading: featured ? "eager" : "lazy",
      className: "h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100",
    }),
    h("div", { className: "absolute inset-0 bg-gradient-to-t from-[#101214]/75 via-transparent to-transparent" }),
    h(
      "span",
      { className: "absolute left-4 top-4 rounded-full border border-white/15 bg-[#101214]/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm" },
      car.category,
    ),
    car.isDemo
      ? h(
          "span",
          { className: "absolute bottom-4 left-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70" },
          "Sample vehicle",
        )
      : null,
  );

  return h(
    "article",
    { className: `group overflow-hidden rounded-2xl border border-[var(--northline-border)] bg-[var(--northline-surface)] ${featured ? "md:row-span-2" : ""}` },
    h(
      Link,
      {
        href: detailHref,
        className: "block focus-visible:outline-none",
        "aria-label": `View details for ${car.name}`,
      },
      imagePanel,
    ),
    h(
      "div",
      { className: "space-y-5 p-5 sm:p-6" },
      h(
        "div",
        { className: "flex items-start justify-between gap-4" },
        h(
          "div",
          null,
          h("p", { className: "mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--northline-text-muted)]" }, car.location),
          h("h3", { className: "max-w-[16ch] text-xl font-semibold leading-tight tracking-[-0.04em] text-[var(--northline-text)]" }, car.name),
        ),
        h(ArrowUpRight, { "aria-hidden": true, weight: "bold", className: "mt-1 shrink-0 text-[var(--northline-accent)]", size: 20 }),
      ),
      h(
        "div",
        { className: "flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[var(--northline-border)] pt-4 text-xs text-[var(--northline-text-muted)]" },
        h("span", { className: "inline-flex items-center gap-1.5" }, h(GearSix, { "aria-hidden": true, size: 15 }), car.transmission),
        h("span", { className: "inline-flex items-center gap-1.5" }, h(UsersThree, { "aria-hidden": true, size: 15 }), `${car.seats} seats`),
      ),
      h(
        "div",
        { className: "flex items-end justify-between gap-4" },
        h(
          "p",
          { className: "text-sm text-[var(--northline-text-muted)]" },
          h("span", { className: "text-lg font-semibold text-[var(--northline-text)]" }, currencyFormatter.format(car.pricePerDay)),
          " / day",
        ),
        h(
          Link,
          {
            href: detailHref,
            className: "text-xs font-bold uppercase tracking-[0.14em] text-[var(--northline-accent)] underline-offset-4 hover:underline",
          },
          "View details",
        ),
      ),
    ),
  );
}
