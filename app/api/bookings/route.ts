import { NextResponse } from "next/server";

import { requireUser, UnauthorizedError } from "@/lib/auth";
import {
  calculateBookingTotal,
  calculateRentalDays,
  validateBookingInput,
} from "@/lib/booking-validation";
import { getDb } from "@/lib/db";
import { createBooking } from "@/lib/cars";

type CarPriceRow = {
  id: number;
  price_per_day: number;
};

export async function POST(request: Request): Promise<NextResponse> {
  let user;
  try {
    user = await requireUser(request);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    throw error;
  }

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const validation = validateBookingInput(input);
  if (!validation.valid || !validation.data) {
    return NextResponse.json(
      { error: "Please correct the booking details", fieldErrors: validation.errors },
      { status: 400 },
    );
  }

  const { carId, pickupDate, returnDate } = validation.data;
  const car = getDb()
    .prepare("SELECT id, price_per_day FROM cars WHERE id = ?")
    .get(carId) as CarPriceRow | undefined;

  if (!car) {
    return NextResponse.json({ error: "Car not found" }, { status: 404 });
  }

  const days = calculateRentalDays(pickupDate, returnDate);
  const totalPrice = calculateBookingTotal(car.price_per_day, days);
  const booking = createBooking({
    userId: user.id,
    carId: car.id,
    pickupDate,
    returnDate,
    totalPrice,
  });

  return NextResponse.json({ booking }, { status: 201 });
}
