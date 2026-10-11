import { beforeAll, describe, expect, it, vi } from "vitest";

const authMock = vi.hoisted(() => {
  class TestUnauthorizedError extends Error {}

  return {
    requireUser: vi.fn(),
    UnauthorizedError: TestUnauthorizedError,
  };
});

vi.mock("@/lib/auth", () => authMock);

import { GET as listCars } from "@/app/api/cars/route";
import { GET as getCar } from "@/app/api/cars/[slug]/route";
import { POST as createBookingRequest } from "@/app/api/bookings/route";
import { GET as listBookings } from "@/app/api/bookings/mine/route";
import {
  calculateBookingTotal,
  calculateRentalDays,
  validateBookingInput,
} from "@/lib/booking-validation";
import { getDb } from "@/lib/db";
import { getCarBySlug } from "@/lib/cars";

function utcDateOffset(daysFromToday: number): string {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + daysFromToday);
  return date.toISOString().slice(0, 10);
}

function jsonRequest(url: string, body: unknown, cookie?: string): Request {
  return new Request(`http://localhost${url}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(cookie ? { cookie } : {}),
    },
    body: JSON.stringify(body),
  });
}

function authenticatedRequest(userId: number, url: string, body: unknown): Request {
  return jsonRequest(url, body, `northline_session=test-session-${userId}`);
}

function createTestUser(email = `booking-${crypto.randomUUID()}@northline.test`): { id: number; email: string } {
  const result = getDb()
    .prepare(
      `INSERT INTO users (name, email, password_hash)
       VALUES (@name, @email, @passwordHash)`,
    )
    .run({
      name: "Booking Test Renter",
      email,
      passwordHash: "test-only-hash",
    });

  return { id: Number(result.lastInsertRowid), email };
}

describe("booking validation", () => {
  it("reports missing booking fields", () => {
    const result = validateBookingInput({});

    expect(result.valid).toBe(false);
    expect(result.errors).toMatchObject({
      carId: expect.any(String),
      pickupDate: expect.any(String),
      returnDate: expect.any(String),
    });
  });

  it("rejects impossible and non-calendar ISO dates", () => {
    const result = validateBookingInput({
      carId: 1,
      pickupDate: "2030-02-30",
      returnDate: "2030-2-31",
    });

    expect(result.valid).toBe(false);
    expect(result.errors.pickupDate).toEqual(expect.any(String));
    expect(result.errors.returnDate).toEqual(expect.any(String));
  });

  it("rejects a pickup date before the current UTC date", () => {
    const result = validateBookingInput({
      carId: 1,
      pickupDate: "2000-01-01",
      returnDate: "2000-01-02",
    });

    expect(result.valid).toBe(false);
    expect(result.errors.pickupDate).toBe("Pickup date cannot be in the past");
  });

  it("rejects a return date before pickup", () => {
    const result = validateBookingInput({
      carId: 1,
      pickupDate: utcDateOffset(5),
      returnDate: utcDateOffset(4),
    });

    expect(result.valid).toBe(false);
    expect(result.errors.returnDate).toBe("Return date cannot be before pickup date");
  });

  it("counts both pickup and return dates as rental days", () => {
    const pickupDate = utcDateOffset(5);
    const returnDate = utcDateOffset(7);

    expect(calculateRentalDays(pickupDate, returnDate)).toBe(3);
    expect(calculateRentalDays(pickupDate, pickupDate)).toBe(1);
  });

  it("calculates the booking total from daily price and inclusive days", () => {
    expect(calculateBookingTotal(4800, calculateRentalDays("2030-06-10", "2030-06-12"))).toBe(14400);
  });
});

describe("car API", () => {
  beforeAll(() => {
    getDb();
  });

  it("returns filtered public cars", async () => {
    const response = await listCars(new Request("http://localhost/api/cars?category=suv"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.cars.length).toBeGreaterThan(0);
    expect(body.cars.every((car: { category: string }) => car.category === "suv")).toBe(true);
  });

  it("returns a public car by slug and a 404 for a missing slug", async () => {
    const response = await getCar(new Request("http://localhost/api/cars/volvo-v60-cross-country"), {
      params: Promise.resolve({ slug: "volvo-v60-cross-country" }),
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.car).toMatchObject({ slug: "volvo-v60-cross-country" });

    const missingResponse = await getCar(new Request("http://localhost/api/cars/missing"), {
      params: Promise.resolve({ slug: "missing" }),
    });

    expect(missingResponse.status).toBe(404);
    expect(await missingResponse.json()).toEqual({ error: "Car not found" });
  });
});

describe("protected booking API", () => {
  beforeAll(() => {
    getDb();
    authMock.requireUser.mockImplementation(async (request: Request) => {
      const cookie = request.headers.get("cookie");
      const token = cookie?.match(/(?:^|;\s*)northline_session=([^;]+)/)?.[1];
      const userId = token?.startsWith("test-session-")
        ? Number(token.slice("test-session-".length))
        : Number.NaN;
      const user = Number.isSafeInteger(userId)
        ? (getDb()
            .prepare("SELECT id, name, email FROM users WHERE id = ?")
            .get(userId) as { id: number; name: string; email: string } | undefined)
        : undefined;

      if (!user) {
        throw new authMock.UnauthorizedError();
      }

      return user;
    });
  });

  it("rejects booking creation without a session", async () => {
    const response = await createBookingRequest(
      jsonRequest("/api/bookings", {
        carId: 1,
        pickupDate: utcDateOffset(2),
        returnDate: utcDateOffset(3),
      }),
    );

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Unauthorized" });
  });

  it("creates a booking using the stored car price, not a submitted total", async () => {
    const user = createTestUser();
    const car = getCarBySlug("volvo-v60-cross-country");
    const pickupDate = utcDateOffset(2);
    const returnDate = utcDateOffset(4);

    expect(car).not.toBeNull();

    const response = await createBookingRequest(
      authenticatedRequest(user.id, "/api/bookings", {
        carId: car!.id,
        pickupDate,
        returnDate,
        totalPrice: 1,
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.booking).toMatchObject({
      userId: user.id,
      carId: car!.id,
      pickupDate,
      returnDate,
      totalPrice: car!.pricePerDay * 3,
    });
  });

  it("lists only the authenticated user's bookings with car details", async () => {
    const user = createTestUser();
    const otherUser = createTestUser();
    const car = getCarBySlug("volvo-v60-cross-country");

    expect(car).not.toBeNull();

    const ownResponse = await createBookingRequest(
      authenticatedRequest(user.id, "/api/bookings", {
        carId: car!.id,
        pickupDate: utcDateOffset(6),
        returnDate: utcDateOffset(6),
      }),
    );
    expect(ownResponse.status).toBe(201);

    const otherResponse = await createBookingRequest(
      authenticatedRequest(otherUser.id, "/api/bookings", {
        carId: car!.id,
        pickupDate: utcDateOffset(8),
        returnDate: utcDateOffset(9),
      }),
    );
    expect(otherResponse.status).toBe(201);

    const response = await listBookings(
      new Request("http://localhost/api/bookings/mine", {
        headers: { cookie: `northline_session=test-session-${user.id}` },
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.bookings).toHaveLength(1);
    expect(body.bookings[0]).toMatchObject({
      userId: user.id,
      car: { slug: "volvo-v60-cross-country" },
    });
  });
});
