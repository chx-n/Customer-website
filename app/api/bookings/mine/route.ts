import { NextResponse } from "next/server";

import { requireUser, UnauthorizedError } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getCarBySlug, type Booking, type Car } from "@/lib/cars";

export interface BookingWithCar extends Booking {
  car: Car;
}

type BookingWithCarRow = {
  id: number;
  user_id: number;
  car_id: number;
  pickup_date: string;
  return_date: string;
  total_price: number;
  created_at: string;
  car_slug: string;
};

function getUserBookings(userId: number): BookingWithCar[] {
  const rows = getDb()
    .prepare(
      `SELECT
         b.id,
         b.user_id,
         b.car_id,
         b.pickup_date,
         b.return_date,
         b.total_price,
         b.created_at,
         c.slug AS car_slug
       FROM bookings b
       INNER JOIN cars c ON c.id = b.car_id
       WHERE b.user_id = ?
       ORDER BY b.pickup_date ASC, b.id DESC`,
    )
    .all(userId) as BookingWithCarRow[];

  return rows.flatMap((row) => {
    const car = getCarBySlug(row.car_slug);
    if (!car) {
      return [];
    }

    return [
      {
        id: row.id,
        userId: row.user_id,
        carId: row.car_id,
        pickupDate: row.pickup_date,
        returnDate: row.return_date,
        totalPrice: row.total_price,
        createdAt: row.created_at,
        car,
      },
    ];
  });
}

export async function GET(request: Request): Promise<NextResponse> {
  let user;
  try {
    user = await requireUser(request);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    throw error;
  }

  return NextResponse.json({ bookings: getUserBookings(user.id) });
}
