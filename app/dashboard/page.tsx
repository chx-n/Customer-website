import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/logout-button";
import { requireUser, UnauthorizedError } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getCarBySlug, type Car } from "@/lib/cars";

export const metadata: Metadata = {
  title: "Your reservations",
  robots: { index: false, follow: false },
};

interface DashboardBooking {
  id: number;
  pickupDate: string;
  returnDate: string;
  totalPrice: number;
  car: Car;
}

type BookingRow = {
  id: number;
  pickup_date: string;
  return_date: string;
  total_price: number;
  car_slug: string;
};

function getBookingsForUser(userId: number): DashboardBooking[] {
  const rows = getDb()
    .prepare(
      `SELECT b.id, b.pickup_date, b.return_date, b.total_price, c.slug AS car_slug
       FROM bookings b
       INNER JOIN cars c ON c.id = b.car_id
       WHERE b.user_id = ?
       ORDER BY b.pickup_date ASC, b.id DESC`,
    )
    .all(userId) as BookingRow[];

  return rows.flatMap((row) => {
    const car = getCarBySlug(row.car_slug);
    return car
      ? [
          {
            id: row.id,
            pickupDate: row.pickup_date,
            returnDate: row.return_date,
            totalPrice: row.total_price,
            car,
          },
        ]
      : [];
  });
}

function formatPrice(value: number): string {
  return `₱${value.toLocaleString("en-PH")}`;
}

export default async function DashboardPage() {
  let user;
  try {
    user = await requireUser();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      redirect("/login?next=/dashboard");
    }
    throw error;
  }

  const bookings = getBookingsForUser(user.id);

  return (
    <main className="min-h-screen-safe bg-[var(--northline-background)] px-5 py-8 text-[var(--northline-text)] sm:px-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-6 border-b border-[var(--northline-border)] pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <a className="text-sm font-bold tracking-[0.22em] text-[var(--northline-accent)]" href="/">
              NORTHLINE
            </a>
            <p className="mt-10 text-sm uppercase tracking-[0.18em] text-[var(--northline-text-muted)]">Renter dashboard</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Welcome back, {user.name.split(" ")[0]}.</h1>
            <p className="mt-3 text-sm text-[var(--northline-text-muted)]">{user.email}</p>
          </div>
          <LogoutButton />
        </header>

        <section className="py-10" aria-labelledby="reservations-heading">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-[var(--northline-text-muted)]">Your trips</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]" id="reservations-heading">Reservations</h2>
            </div>
            <p className="text-sm text-[var(--northline-text-muted)]">Demo pricing · local account</p>
          </div>

          {bookings.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-[var(--northline-border)] bg-[var(--northline-surface)] px-6 py-12 text-center sm:px-10">
              <p className="text-lg font-semibold">No reservations yet.</p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--northline-text-muted)]">
                Choose a vehicle and set your dates when you are ready to plan your next route.
              </p>
              <a className="mt-6 inline-flex rounded-[10px] bg-[var(--northline-accent)] px-5 py-3 font-semibold text-[var(--northline-background)] transition hover:bg-[#d7fb83]" href="/fleet">
                Browse fleet
              </a>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {bookings.map((booking) => (
                <article className="overflow-hidden rounded-2xl border border-[var(--northline-border)] bg-[var(--northline-surface)]" key={booking.id}>
                  <div className="grid sm:grid-cols-[10rem_1fr]">
                    <img alt="" className="h-44 w-full object-cover sm:h-full" src={booking.car.imageUrl} />
                    <div className="p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.16em] text-[var(--northline-text-muted)]">Reservation #{booking.id}</p>
                          <h3 className="mt-2 text-xl font-semibold">{booking.car.name}</h3>
                        </div>
                        <span className="shrink-0 rounded-full border border-[var(--northline-border)] px-2.5 py-1 text-xs text-[var(--northline-text-muted)]">Demo</span>
                      </div>
                      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <dt className="text-[var(--northline-text-muted)]">Pickup</dt>
                          <dd className="mt-1 font-semibold">{booking.pickupDate}</dd>
                        </div>
                        <div>
                          <dt className="text-[var(--northline-text-muted)]">Return</dt>
                          <dd className="mt-1 font-semibold">{booking.returnDate}</dd>
                        </div>
                      </dl>
                      <div className="mt-6 flex items-end justify-between gap-4 border-t border-[var(--northline-border)] pt-4">
                        <span className="text-sm text-[var(--northline-text-muted)]">Total</span>
                        <strong className="text-lg">{formatPrice(booking.totalPrice)}</strong>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
