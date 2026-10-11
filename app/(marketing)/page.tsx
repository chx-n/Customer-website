import Link from "next/link";
import { ArrowRight, ArrowUpRight, MapPin, ShieldCheck } from "@phosphor-icons/react/dist/ssr";

import { HeroSearch } from "@/components/hero-search";
import { LandingFaq, LandingFooter, RentalDetails, TripIntentGrid } from "@/components/landing-sections";
import { OnboardingRail } from "@/components/onboarding-rail";
import { Reveal } from "@/components/reveal";
import { SiteHeader } from "@/components/site-header";
import { VehicleCard } from "@/components/vehicle-card";
import { getCurrentUser } from "@/lib/auth";
import { getCars } from "@/lib/cars";

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

function formatPrice(value: number): string {
  return currencyFormatter.format(value);
}

export default async function MarketingHomePage() {
  const [user, cars] = await Promise.all([getCurrentUser(), Promise.resolve(getCars())]);
  const leadCar = cars[0];
  const featuredCars = cars.slice(0, 3);
  const lowestPrice = cars.reduce((lowest, car) => Math.min(lowest, car.pricePerDay), Number.POSITIVE_INFINITY);
  const pickupAreas = new Set(cars.map((car) => car.location.split(",")[0])).size;

  if (!leadCar) {
    return (
      <div className="min-h-screen-safe">
        <SiteHeader user={user} />
        <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <h1 className="text-4xl font-semibold tracking-[-0.06em] text-[var(--northline-text)]">The fleet is getting ready.</h1>
            <p className="mt-4 text-base leading-7 text-[var(--northline-text-muted)]">There are no sample vehicles to show yet. Check back after the local seed data is loaded.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen-safe overflow-x-clip">
      <SiteHeader user={user} />
      <main className="overflow-x-clip">
        <section className="border-b border-[var(--northline-border)]" aria-labelledby="home-heading">
          <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 sm:pb-28 sm:pt-12 lg:px-8">
            <div className="grid overflow-hidden rounded-[24px] border border-[var(--northline-border)] bg-[var(--northline-surface)] lg:grid-cols-[0.92fr_1.08fr]">
              <Reveal className="flex flex-col justify-between p-6 sm:p-10 lg:p-14" delay={0.05}>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--northline-accent)]">
                  <span className="h-px w-7 bg-[var(--northline-accent)]" />
                  Northline · Metro Manila
                </div>
                <div className="py-16 sm:py-20">
                  <h1 id="home-heading" className="max-w-[15ch] text-[clamp(3.3rem,4.8vw,5.8rem)] font-semibold leading-[0.9] tracking-[-0.075em] text-[var(--northline-text)]">
                    The right car for the day.
                  </h1>
                  <p className="mt-8 max-w-lg text-base leading-7 text-[var(--northline-text-muted)] sm:text-lg">
                    Browse a focused local fleet, see the daily sample price, and choose a car without creating an account first.
                  </p>
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Link href="#trip-search" className="group inline-flex min-h-12 items-center gap-3 rounded-[10px] bg-[var(--northline-accent)] px-5 text-sm font-bold text-[var(--northline-background)] outline-none transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[#d8fa8e] focus-visible:ring-2 focus-visible:ring-[var(--northline-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--northline-surface)] active:scale-[0.98] motion-reduce:transform-none motion-reduce:active:scale-100">
                      Find my car
                      <span className="grid size-7 place-items-center rounded-full bg-[var(--northline-background)]/10 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5 motion-reduce:transform-none">
                        <ArrowRight aria-hidden="true" size={15} weight="bold" />
                      </span>
                    </Link>
                    <Link href="/fleet" className="inline-flex min-h-12 items-center rounded-[10px] px-3 text-sm font-semibold text-[var(--northline-text-muted)] outline-none transition-colors duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-[var(--northline-text)] focus-visible:ring-2 focus-visible:ring-[var(--northline-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--northline-surface)]">
                      Browse all cars
                    </Link>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 border-t border-[var(--northline-border)] pt-5">
                  <div>
                    <p className="text-2xl font-semibold tabular-nums tracking-[-0.05em] text-[var(--northline-text)]">{cars.length}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--northline-text-muted)]">Sample cars</p>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold tabular-nums tracking-[-0.05em] text-[var(--northline-text)]">{pickupAreas}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--northline-text-muted)]">Pickup areas</p>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold tabular-nums tracking-[-0.05em] text-[var(--northline-text)]">{formatPrice(lowestPrice)}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--northline-text-muted)]">Lowest sample rate</p>
                  </div>
                </div>
              </Reveal>

              <Reveal className="relative min-h-[440px] overflow-hidden lg:min-h-0" delay={0.14}>
                <img src={leadCar.imageUrl} alt={leadCar.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-[1.02] motion-reduce:transition-none motion-reduce:hover:scale-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101214]/90 via-[#101214]/10 to-[#101214]/10" />
                <div className="absolute inset-x-6 bottom-24 flex items-end justify-between gap-4 sm:inset-x-8 sm:bottom-28">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">A look at the sample fleet</p>
                    <p className="mt-2 max-w-[16ch] text-2xl font-semibold leading-tight tracking-[-0.04em] text-white">See the car before you decide.</p>
                  </div>
                  <Link href={`/fleet/${leadCar.slug}`} aria-label={`View details for ${leadCar.name}`} className="grid size-12 shrink-0 place-items-center rounded-full bg-[var(--northline-accent)] text-[var(--northline-background)] outline-none transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:rotate-[-8deg] focus-visible:ring-2 focus-visible:ring-[var(--northline-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[#101214] motion-reduce:transform-none motion-reduce:hover:rotate-0">
                    <ArrowUpRight aria-hidden="true" size={20} weight="bold" />
                  </Link>
                </div>
              </Reveal>
            </div>

            <div className="relative z-10 -mt-8 sm:-mt-10">
              <HeroSearch />
            </div>

            {!user ? (
              <div className="onboarding-enter mt-6 sm:mt-8">
                <OnboardingRail
                  id="how-it-works"
                  currentStep={1}
                  title="Plan your first rental in three moves."
                  description="Start with dates, compare a focused fleet, then create an account only when you are ready to reserve."
                />
              </div>
            ) : null}
          </div>
        </section>

        <TripIntentGrid pickupAreas={pickupAreas} />

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8" aria-labelledby="featured-heading">
          <Reveal className="mb-9 flex flex-col justify-between gap-6 border-b border-[var(--northline-border)] pb-8 sm:flex-row sm:items-end" delay={0.04}>
            <div>
              <h2 id="featured-heading" className="max-w-2xl text-4xl font-semibold leading-[0.98] tracking-[-0.065em] text-[var(--northline-text)] sm:text-5xl">Compare the cars before you commit.</h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--northline-text-muted)]">Every sample vehicle has a clear daily rate, practical specs, and a detail page for the final decision.</p>
            </div>
            <Link href="/fleet" className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-[var(--northline-text)] underline decoration-[var(--northline-accent)] decoration-2 underline-offset-8 outline-none transition-colors duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-[var(--northline-accent)] focus-visible:ring-2 focus-visible:ring-[var(--northline-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--northline-background)]">
              See all vehicles
              <ArrowRight aria-hidden="true" size={17} />
            </Link>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-12 md:auto-rows-[minmax(0,1fr)] md:grid-flow-dense">
            {featuredCars.map((car, index) => (
              <Reveal key={car.id} className={index === 0 ? "md:col-span-7" : "md:col-span-5"} delay={0.05 * index}>
                <VehicleCard car={car} featured={index === 0} />
              </Reveal>
            ))}
          </div>
          <p className="mt-5 text-xs leading-5 text-[var(--northline-text-muted)]">Northline vehicles and prices shown here are sample data for this local demo. No live availability is represented.</p>
        </section>

        <RentalDetails />

        <LandingFaq />

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8" aria-labelledby="final-cta-heading">
          <Reveal className="relative overflow-hidden rounded-2xl border border-[var(--northline-border)] bg-[var(--northline-surface)] p-6 sm:p-10 lg:p-14" delay={0.04}>
            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--northline-accent)]">
                <MapPin aria-hidden="true" size={16} />
                Start in Metro Manila
              </div>
              <h2 id="final-cta-heading" className="mt-5 max-w-xl text-4xl font-semibold leading-[0.98] tracking-[-0.065em] text-[var(--northline-text)] sm:text-6xl">Find the car that fits the plan.</h2>
              <p className="mt-5 max-w-lg text-sm leading-6 text-[var(--northline-text-muted)]">No account needed to look around. Start with dates, then take the next step when the car feels right.</p>
              <Link href="/fleet" className="group mt-8 inline-flex min-h-12 items-center gap-3 rounded-[10px] bg-[var(--northline-accent)] px-5 text-sm font-bold text-[var(--northline-background)] outline-none transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[#d8fa8e] focus-visible:ring-2 focus-visible:ring-[var(--northline-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--northline-surface)] active:scale-[0.98] motion-reduce:transform-none motion-reduce:active:scale-100">
                Browse the sample fleet
                <span className="grid size-7 place-items-center rounded-full bg-[var(--northline-background)]/10 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5 motion-reduce:transform-none">
                  <ArrowRight aria-hidden="true" size={15} weight="bold" />
                </span>
              </Link>
            </div>
            <ShieldCheck aria-hidden="true" className="absolute -bottom-10 -right-6 text-[var(--northline-accent)]/10 sm:-bottom-16 sm:right-10" size={260} weight="thin" />
          </Reveal>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
