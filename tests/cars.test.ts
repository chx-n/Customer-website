import { beforeAll, describe, expect, it } from "vitest";

import { getDb } from "@/lib/db";
import { createBooking, getCarBySlug, getCars } from "@/lib/cars";

describe("car database", () => {
  beforeAll(() => {
    getDb();
  });

  it("seeds at least six demo vehicles with local sample images", () => {
    const cars = getCars();

    expect(cars.length).toBeGreaterThanOrEqual(6);
    expect(cars.every((car) => car.isDemo)).toBe(true);
    expect(cars.every((car) => car.imageUrl.startsWith("/cars/"))).toBe(true);
  });

  it("finds the Volvo V60 Cross Country demo car by slug", () => {
    const car = getCarBySlug("volvo-v60-cross-country");

    expect(car).toMatchObject({
      slug: "volvo-v60-cross-country",
      name: "Volvo V60 Cross Country",
      category: "wagon",
      transmission: "automatic",
      seats: 5,
    });
  });

  it("filters cars by category without returning other categories", () => {
    const cars = getCars({ category: "suv" });

    expect(cars.length).toBeGreaterThan(0);
    expect(cars.every((car) => car.category === "suv")).toBe(true);
    expect(cars.some((car) => car.category !== "suv")).toBe(false);
  });

  it("persists a booking for an existing user and car", () => {
    const db = getDb();
    const user = db
      .prepare(
        `INSERT INTO users (name, email, password_hash)
         VALUES (@name, @email, @passwordHash)
         ON CONFLICT(email) DO UPDATE SET name = excluded.name
         RETURNING id`,
      )
      .get({
        name: "Northline Test Renter",
        email: "cars.test@northline.test",
        passwordHash: "test-only-hash",
      }) as { id: number };
    const car = getCarBySlug("volvo-v60-cross-country");

    expect(car).not.toBeNull();

    const booking = createBooking({
      userId: user.id,
      carId: car!.id,
      pickupDate: "2030-06-10",
      returnDate: "2030-06-12",
      totalPrice: car!.pricePerDay * 3,
    });

    expect(booking).toMatchObject({
      userId: user.id,
      carId: car!.id,
      pickupDate: "2030-06-10",
      returnDate: "2030-06-12",
      totalPrice: car!.pricePerDay * 3,
    });
    expect(booking.id).toEqual(expect.any(Number));
  });
});
