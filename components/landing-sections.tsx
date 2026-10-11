import Link from "next/link";
import { ArrowRight, ArrowUpRight, Car, Check, MapPin, Plus, UsersThree } from "@phosphor-icons/react/dist/ssr";

interface TripIntentGridProps {
  pickupAreas: number;
}

const tripIntents = [
  {
    href: "/fleet?category=compact",
    icon: Car,
    title: "City days",
    body: "Easy-to-place cars for errands, appointments, and airport runs.",
    detail: "Compact options",
  },
  {
    href: "/fleet?category=suv&seats=5",
    icon: UsersThree,
    title: "Room for more",
    body: "Start with practical SUVs when passengers and bags need space.",
    detail: "5-seat options",
  },
  {
    href: "/fleet?category=wagon",
    icon: MapPin,
    title: "Weekend outside",
    body: "Choose a composed long-drive shape for a slower route out of town.",
    detail: "Wagon options",
  },
] as const;

export function TripIntentGrid({ pickupAreas }: TripIntentGridProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8" aria-labelledby="trip-shapes-heading">
      <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
        <div>
          <h2 id="trip-shapes-heading" className="max-w-md text-4xl font-semibold leading-[0.98] tracking-[-0.065em] text-[var(--northline-text)] sm:text-5xl">
            Start with the kind of day you have in mind.
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-6 text-[var(--northline-text-muted)]">
            Pick a useful starting point. You can still compare every car and change the filters later.
          </p>
          <p className="mt-8 text-xs leading-5 text-[var(--northline-text-muted)]">
            Sample pickup areas across {pickupAreas} Metro Manila locations.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {tripIntents.map(({ href, icon: Icon, title, body, detail }) => (
            <Link
              key={title}
              href={href}
              className="group flex min-h-64 flex-col justify-between rounded-2xl border border-[var(--northline-border)] bg-[var(--northline-surface)] p-5 outline-none transition-[background-color,border-color,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1 hover:border-[var(--northline-accent)] hover:bg-[var(--northline-surface-raised)] focus-visible:ring-2 focus-visible:ring-[var(--northline-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--northline-background)] motion-reduce:transform-none"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="grid size-11 place-items-center rounded-full bg-[var(--northline-accent-soft)] text-[var(--northline-accent)] transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105 motion-reduce:transform-none">
                  <Icon aria-hidden="true" size={21} weight="duotone" />
                </span>
                <ArrowUpRight aria-hidden="true" size={20} className="text-[var(--northline-text-muted)] transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--northline-accent)] motion-reduce:transform-none" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--northline-accent)]">{detail}</p>
                <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-[var(--northline-text)]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--northline-text-muted)]">{body}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RentalDetails() {
  const details = [
    "Daily sample price shown before you choose a car",
    "Transmission, seats, location, and features on every vehicle",
    "Account creation held until you are ready to reserve",
  ];

  return (
    <section className="border-y border-[var(--northline-border)] bg-[var(--northline-surface)]" aria-labelledby="rental-details-heading">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24 lg:px-8">
        <div>
          <h2 id="rental-details-heading" className="max-w-md text-4xl font-semibold leading-[0.98] tracking-[-0.065em] text-[var(--northline-text)] sm:text-5xl">
            Enough detail to choose with confidence.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-6 text-[var(--northline-text-muted)]">
            Northline keeps the first decision simple, then gives you the practical information that matters before a reservation.
          </p>
        </div>

        <ul className="border-t border-[var(--northline-border)]">
          {details.map((detail) => (
            <li key={detail} className="flex items-start gap-4 border-b border-[var(--northline-border)] py-5 text-base text-[var(--northline-text)] sm:py-6">
              <Check aria-hidden="true" size={20} weight="bold" className="mt-0.5 shrink-0 text-[var(--northline-accent)]" />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function LandingFaq() {
  const questions = [
    {
      question: "Can I browse without an account?",
      answer: "Yes. Browse the fleet, filter cars, and open vehicle details without signing in. You only need an account when you submit a reservation.",
    },
    {
      question: "What does the displayed price mean?",
      answer: "Each vehicle shows a local sample daily rate. Your total is calculated from the selected dates. This demo does not represent live availability or payment processing.",
    },
    {
      question: "What should I compare first?",
      answer: "Start with the trip shape, then check seats, transmission, pickup area, features, and daily sample price on the vehicle detail page.",
    },
    {
      question: "What happens after I choose a car?",
      answer: "Choose pickup and return dates, sign in or create a local test account, then confirm the reservation. Your trip appears in the dashboard after it is created.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8" aria-labelledby="faq-heading">
      <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
        <div>
          <h2 id="faq-heading" className="max-w-sm text-4xl font-semibold leading-[0.98] tracking-[-0.065em] text-[var(--northline-text)] sm:text-5xl">
            New to renting? Start here.
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-6 text-[var(--northline-text-muted)]">
            A few straight answers before you start comparing.
          </p>
        </div>

        <div className="border-t border-[var(--northline-border)]">
          {questions.map(({ question, answer }) => (
            <details key={question} className="group border-b border-[var(--northline-border)]">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-base font-semibold text-[var(--northline-text)] outline-none transition-colors duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-[var(--northline-accent)] focus-visible:text-[var(--northline-accent)] [&::-webkit-details-marker]:hidden">
                {question}
                <Plus aria-hidden="true" size={20} className="shrink-0 text-[var(--northline-accent)] transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-open:rotate-45 motion-reduce:transform-none" />
              </summary>
              <p className="max-w-2xl pb-5 pr-12 text-sm leading-6 text-[var(--northline-text-muted)]">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingFooter() {
  return (
    <footer className="border-t border-[var(--northline-border)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="font-bold tracking-[0.16em] text-[var(--northline-text)]">NORTHLINE</p>
          <p className="mt-1 text-xs text-[var(--northline-text-muted)]">A local car-rental demo for testing the full reservation flow.</p>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-x-5 gap-y-3 text-[var(--northline-text-muted)]">
          <Link href="/fleet" className="transition-colors duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-[var(--northline-text)]">Fleet</Link>
          <Link href="/login" className="transition-colors duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-[var(--northline-text)]">Log in</Link>
          <Link href="/register" className="transition-colors duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-[var(--northline-text)]">Create account</Link>
        </nav>
      </div>
    </footer>
  );
}
