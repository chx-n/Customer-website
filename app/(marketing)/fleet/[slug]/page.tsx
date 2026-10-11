import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarBlank, Check, GearSix, MapPin, UsersThree } from "@phosphor-icons/react/dist/ssr";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/site-header";
import { OnboardingRail } from "@/components/onboarding-rail";
import { ReservationForm } from "@/components/reservation-form";
import { getCurrentUser } from "@/lib/auth";
import { getCarBySlug } from "@/lib/cars";

type VehiclePageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: VehiclePageProps): Promise<Metadata> {
  const { slug } = await params;
  const car = getCarBySlug(slug);

  if (!car) {
    return { title: "Vehicle not found" };
  }

  return {
    title: car.name,
    description: `${car.name}: ${car.description} View sample specs, pickup area, and daily price.`,
  };
}

function firstValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

export default async function VehicleDetailPage({ params, searchParams }: VehiclePageProps) {
  const { slug } = await params;
  const query = searchParams ? await searchParams : {};
  const car = getCarBySlug(slug);
  if (!car) notFound();

  const user = await getCurrentUser();
  const pickupDate = firstValue(query.pickupDate);
  const returnDate = firstValue(query.returnDate);
  const nextPathQuery = new URLSearchParams();
  if (pickupDate) nextPathQuery.set("pickupDate", pickupDate);
  if (returnDate) nextPathQuery.set("returnDate", returnDate);
  const nextPath = `/fleet/${car.slug}${nextPathQuery.toString() ? `?${nextPathQuery.toString()}` : ""}`;
  const reserveHref = `/login?next=${encodeURIComponent(nextPath)}`;

  return (
    <div className="min-h-screen-safe overflow-x-clip">
      <SiteHeader user={user} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <Link href="/fleet" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--northline-text-muted)] hover:text-[var(--northline-text)]">
          <ArrowLeft aria-hidden="true" size={16} />
          Back to fleet
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <div className="overflow-hidden rounded-2xl border border-[var(--northline-border)] bg-[var(--northline-surface)]">
            <div className="aspect-[4/3] overflow-hidden sm:aspect-[16/10]">
              <img src={car.imageUrl} alt={car.name} className="h-full w-full object-cover" />
            </div>
            <div className="grid grid-cols-2 gap-px border-t border-[var(--northline-border)] bg-[var(--northline-border)] sm:grid-cols-4">
              {[
                { icon: GearSix, label: "Transmission", value: car.transmission },
                { icon: UsersThree, label: "Capacity", value: `${car.seats} seats` },
                { icon: MapPin, label: "Pickup", value: car.location.split(",")[0] },
                { icon: CalendarBlank, label: "Pricing", value: "Per day" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-[var(--northline-surface)] p-4">
                  <Icon aria-hidden="true" size={18} className="text-[var(--northline-accent)]" />
                  <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--northline-text-muted)]">{label}</p>
                  <p className="mt-1 text-sm font-semibold capitalize text-[var(--northline-text)]">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--northline-accent)]">{car.category} / sample vehicle</p>
            <h1 className="mt-4 text-5xl font-semibold leading-[0.95] tracking-[-0.07em] text-[var(--northline-text)] sm:text-7xl">{car.name}</h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[var(--northline-text-muted)]">{car.description}</p>

            <div className="mt-8 flex items-end justify-between gap-5 border-y border-[var(--northline-border)] py-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--northline-text-muted)]">Sample daily price</p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[var(--northline-text)]">{currencyFormatter.format(car.pricePerDay)} <span className="text-sm font-normal tracking-normal text-[var(--northline-text-muted)]">/ day</span></p>
              </div>
              <span className="rounded-full border border-[var(--northline-border)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--northline-text-muted)]">Local demo</span>
            </div>

            <div className="mt-8">
              <h2 className="text-sm font-semibold text-[var(--northline-text)]">What is included</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {car.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-[var(--northline-text-muted)]">
                    <Check aria-hidden="true" className="mt-0.5 shrink-0 text-[var(--northline-accent)]" size={16} weight="bold" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <section id="reserve" className="mt-10 rounded-2xl border border-[var(--northline-border)] bg-[var(--northline-surface)] p-5 sm:p-6" aria-labelledby="reserve-heading">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--northline-accent)]">Reservation entry</p>
                  <h2 id="reserve-heading" className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[var(--northline-text)]">Choose your dates</h2>
                </div>
                <CalendarBlank aria-hidden="true" className="text-[var(--northline-accent)]" size={22} />
              </div>
              {user ? (
                <div className="mt-5">
                  <ReservationForm car={car} initialPickupDate={pickupDate} initialReturnDate={returnDate} />
                </div>
              ) : (
                <>
                  <p className="mt-5 text-sm leading-6 text-[var(--northline-text-muted)]">Log in to choose dates and reserve this sample vehicle.</p>
                  <Link href={reserveHref} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-[var(--northline-accent)] px-5 text-sm font-bold text-[var(--northline-background)] transition-colors hover:bg-[#d8fa8e] active:scale-[0.98] motion-reduce:active:scale-100">
                    Log in to reserve
                    <ArrowRight aria-hidden="true" size={17} weight="bold" />
                  </Link>
                </>
              )}
              <p className="mt-3 text-xs leading-5 text-[var(--northline-text-muted)]">Dates are shown for the local demo flow. Availability is not live.</p>
            </section>
          </div>
        </div>

        <div className="mt-10">
          <OnboardingRail
            currentStep={3}
            currentHref="#reserve"
            title="You are one decision from the road."
            description="Choose the dates, check the sample total, and reserve. Northline only asks for an account at this last step."
          />
        </div>
      </main>
    </div>
  );
}
