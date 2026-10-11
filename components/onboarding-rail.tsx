import Link from "next/link";
import { ArrowRight, CalendarBlank, Car, Check, LockKey } from "@phosphor-icons/react/dist/ssr";

type OnboardingStep = 1 | 2 | 3;

interface OnboardingRailProps {
  currentStep: OnboardingStep;
  currentHref?: string;
  description: string;
  id?: string;
  title: string;
}

const steps = [
  {
    number: 1,
    title: "Choose dates",
    body: "Start with pickup and return.",
    href: "/#trip-search",
    icon: CalendarBlank,
  },
  {
    number: 2,
    title: "Compare the short list",
    body: "Use the details that matter.",
    href: "/fleet",
    icon: Car,
  },
  {
    number: 3,
    title: "Reserve when ready",
    body: "Log in only when you decide.",
    href: "/fleet",
    icon: LockKey,
  },
] as const;

export function OnboardingRail({ currentHref, currentStep, description, id, title }: OnboardingRailProps) {
  const headingId = id ? `${id}-heading` : "onboarding-rail-heading";

  return (
    <section
      id={id}
      className="rounded-2xl border border-[var(--northline-border)] bg-[var(--northline-surface)] p-5 sm:p-7"
      aria-labelledby={headingId}
    >
      <div className="flex flex-col justify-between gap-5 border-b border-[var(--northline-border)] pb-6 sm:flex-row sm:items-end">
        <div className="max-w-xl">
          <p className="text-sm font-semibold text-[var(--northline-accent)]">No account needed to browse</p>
          <h2 id={headingId} className="mt-2 max-w-2xl text-3xl font-semibold tracking-[-0.055em] text-[var(--northline-text)] sm:text-4xl">
            {title}
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-6 text-[var(--northline-text-muted)]">{description}</p>
      </div>

      <ol className="grid gap-0 sm:grid-cols-3">
        {steps.map(({ number, title: stepTitle, body, href, icon: Icon }) => {
          const isCurrent = number === currentStep;
          const isComplete = number < currentStep;
          return (
            <li key={number} className="border-t border-[var(--northline-border)] pt-5 sm:border-l sm:border-t-0 sm:px-5 sm:first:border-l-0 sm:first:pl-0 sm:last:pr-0">
              <Link
                href={isCurrent && currentHref ? currentHref : href}
                className="group block rounded-[10px] outline-none transition-[transform,color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[var(--northline-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--northline-surface)] motion-reduce:transform-none"
                aria-current={isCurrent ? "step" : undefined}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className={`grid size-9 place-items-center rounded-full text-sm font-bold transition-[background-color,color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${isCurrent ? "bg-[var(--northline-accent)] text-[var(--northline-background)]" : isComplete ? "bg-[var(--northline-accent-soft)] text-[var(--northline-accent)]" : "bg-[var(--northline-background)] text-[var(--northline-text-muted)]"}`}>
                    {isComplete ? <Check aria-hidden="true" size={16} weight="bold" /> : number}
                  </span>
                  <Icon aria-hidden="true" size={20} weight={isCurrent ? "fill" : "regular"} className={`${isCurrent ? "text-[var(--northline-accent)]" : "text-[var(--northline-text-muted)]"} transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5 motion-reduce:transform-none`} />
                </div>
                <h3 className={`mt-5 text-base font-semibold ${isCurrent ? "text-[var(--northline-text)]" : "text-[var(--northline-text-muted)]"}`}>{stepTitle}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--northline-text-muted)]">{body}</p>
                {isCurrent ? (
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[var(--northline-accent)]">
                    Continue
                    <ArrowRight aria-hidden="true" size={14} weight="bold" />
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
