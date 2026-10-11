import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Car, SmileySad } from "@phosphor-icons/react/dist/ssr";

import { FleetFilterBar, type SearchValues } from "@/components/hero-search";
import { Reveal } from "@/components/reveal";
import { SiteHeader } from "@/components/site-header";
import { VehicleCard } from "@/components/vehicle-card";
import { getCurrentUser } from "@/lib/auth";
import { getCars, type CarFilters } from "@/lib/cars";

export const metadata: Metadata = {
  title: "Browse the fleet",
  description: "Compare Northline Rental sample cars by type, transmission, seats, pickup area, and daily price.",
};

type FleetSearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function optionalInteger(value: string): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : undefined;
}

function getDetailQuery(values: SearchValues): string {
  const query = new URLSearchParams();
  if (values.location) query.set("location", values.location);
  if (values.pickupDate) query.set("pickupDate", values.pickupDate);
  if (values.returnDate) query.set("returnDate", values.returnDate);
  const serialized = query.toString();
  return serialized ? `?${serialized}` : "";
}

export default async function FleetPage({ searchParams }: { searchParams: FleetSearchParams }) {
  const params = await searchParams;
  const values: SearchValues = {
    location: firstValue(params.location),
    pickupDate: firstValue(params.pickupDate),
    returnDate: firstValue(params.returnDate),
    category: firstValue(params.category),
    transmission: firstValue(params.transmission),
    seats: firstValue(params.seats),
    maxPricePerDay: firstValue(params.maxPricePerDay) || firstValue(params.maxPrice),
  };
  const seats = optionalInteger(values.seats ?? "");
  const maxPricePerDay = optionalInteger(values.maxPricePerDay ?? "");
  const filters: CarFilters = {
    ...(values.category ? { category: values.category } : {}),
    ...(values.transmission ? { transmission: values.transmission } : {}),
    ...(seats ? { seats } : {}),
    ...(maxPricePerDay !== undefined ? { maxPricePerDay } : {}),
  };
  const matchingCars = getCars(filters).filter((car) =>
    values.location ? car.location.toLowerCase().includes(values.location.toLowerCase()) : true,
  );
  const [user, cars] = await Promise.all([getCurrentUser(), Promise.resolve(matchingCars)]);
  const detailQuery = getDetailQuery(values);

  return (
    <div className="min-h-screen-safe overflow-x-clip">
      <SiteHeader user={user} />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <Reveal>
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--northline-text-muted)] hover:text-[var(--northline-text)]">
            <ArrowLeft aria-hidden="true" size={16} />
            Northline home
          </Link>
          <div className="flex flex-col justify-between gap-6 border-b border-[var(--northline-border)] pb-10 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--northline-accent)]">The fleet</p>
              <h1 className="max-w-2xl text-5xl font-semibold tracking-[-0.07em] text-[var(--northline-text)] sm:text-7xl">Cars for the shape of your day.</h1>
            </div>
            <p className="max-w-xs text-sm leading-6 text-[var(--northline-text-muted)]">A focused sample fleet with clear specs, honest daily prices, and no guesswork.</p>
          </div>
        </Reveal>

        <Reveal className="my-8" delay={0.08}>
          <FleetFilterBar initialValues={values} />
        </Reveal>

        <Reveal className="mb-8" delay={0.12}>
          <div className="rounded-2xl border border-[var(--northline-border)] bg-[var(--northline-surface)] px-5 py-4 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:px-6">
            <div>
              <p className="text-sm font-semibold text-[var(--northline-text)]">You are at the useful part.</p>
              <p className="mt-1 text-sm leading-6 text-[var(--northline-text-muted)]">Compare the short list below. Your dates stay with you when you open a car.</p>
            </div>
            <span className="mt-4 inline-flex shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--northline-accent)] sm:mt-0">
              Step 2 of 3
              <ArrowRight aria-hidden="true" size={14} weight="bold" />
            </span>
          </div>
        </Reveal>

        <section aria-labelledby="fleet-results-heading">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 id="fleet-results-heading" className="text-sm font-semibold text-[var(--northline-text)]">
              {cars.length} {cars.length === 1 ? "vehicle" : "vehicles"} available in sample data
            </h2>
            <Car aria-hidden="true" size={20} className="text-[var(--northline-text-muted)]" />
          </div>

          {cars.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--northline-border)] bg-[var(--northline-surface)] px-6 py-16 text-center">
              <SmileySad aria-hidden="true" className="mx-auto text-[var(--northline-accent)]" size={30} />
              <h2 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-[var(--northline-text)]">No cars match those filters.</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--northline-text-muted)]">Try widening the vehicle type, seat count, or price range.</p>
              <Link href="/fleet" className="mt-7 inline-flex items-center gap-2 rounded-[10px] border border-[var(--northline-border)] px-4 py-3 text-sm font-bold text-[var(--northline-text)] hover:border-[var(--northline-accent)] hover:text-[var(--northline-accent)]">
                Reset filters
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cars.map((car, index) => (
                <Reveal key={car.id} delay={0.04 * index}>
                  <VehicleCard car={car} featured={index === 0} hrefSuffix={detailQuery} />
                </Reveal>
              ))}
            </div>
          )}
        </section>

        <p className="mt-8 text-xs leading-5 text-[var(--northline-text-muted)]">All vehicles and prices are local sample data. No live availability is represented.</p>
      </main>
    </div>
  );
}
