import { getDb } from "@/lib/db";

export interface Car {
  id: number;
  slug: string;
  name: string;
  category: string;
  transmission: string;
  seats: number;
  pricePerDay: number;
  location: string;
  description: string;
  imageUrl: string;
  features: string[];
  isDemo: boolean;
  createdAt: string;
}

export interface CarFilters {
  category?: string;
  transmission?: string;
  seats?: number;
  minPricePerDay?: number;
  maxPricePerDay?: number;
  location?: string;
}

export interface NewBooking {
  userId: number;
  carId: number;
  pickupDate: string;
  returnDate: string;
  totalPrice: number;
}

export interface Booking extends NewBooking {
  id: number;
  createdAt: string;
}

type CarRow = {
  id: number;
  slug: string;
  name: string;
  category: string;
  transmission: string;
  seats: number;
  price_per_day: number;
  location: string;
  description: string;
  image_url: string;
  features_json: string;
  is_demo: number;
  created_at: string;
};

type BookingRow = {
  id: number;
  user_id: number;
  car_id: number;
  pickup_date: string;
  return_date: string;
  total_price: number;
  created_at: string;
};

function parseFeatures(featuresJson: string): string[] {
  try {
    const features: unknown = JSON.parse(featuresJson);
    return Array.isArray(features) && features.every((feature) => typeof feature === "string")
      ? features
      : [];
  } catch {
    return [];
  }
}

function mapCar(row: CarRow): Car {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    transmission: row.transmission,
    seats: row.seats,
    pricePerDay: row.price_per_day,
    location: row.location,
    description: row.description,
    imageUrl: row.image_url,
    features: parseFeatures(row.features_json),
    isDemo: row.is_demo === 1,
    createdAt: row.created_at,
  };
}

function mapBooking(row: BookingRow): Booking {
  return {
    id: row.id,
    userId: row.user_id,
    carId: row.car_id,
    pickupDate: row.pickup_date,
    returnDate: row.return_date,
    totalPrice: row.total_price,
    createdAt: row.created_at,
  };
}

function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function validateBookingInput(input: NewBooking): void {
  if (!Number.isSafeInteger(input.userId) || input.userId <= 0) {
    throw new Error("Booking userId must be a positive integer");
  }
  if (!Number.isSafeInteger(input.carId) || input.carId <= 0) {
    throw new Error("Booking carId must be a positive integer");
  }
  if (!isValidIsoDate(input.pickupDate) || !isValidIsoDate(input.returnDate)) {
    throw new Error("Booking dates must use YYYY-MM-DD format");
  }
  if (input.returnDate < input.pickupDate) {
    throw new Error("Booking return date cannot be before pickup date");
  }
  if (!Number.isSafeInteger(input.totalPrice) || input.totalPrice < 0) {
    throw new Error("Booking totalPrice must be a non-negative integer");
  }
}

export function getCars(filters: CarFilters = {}): Car[] {
  const conditions: string[] = [];
  const parameters: Record<string, string | number> = {};

  if (filters.category !== undefined) {
    conditions.push("category = @category");
    parameters.category = filters.category;
  }
  if (filters.transmission !== undefined) {
    conditions.push("transmission = @transmission");
    parameters.transmission = filters.transmission;
  }
  if (filters.seats !== undefined) {
    conditions.push("seats >= @seats");
    parameters.seats = filters.seats;
  }
  if (filters.minPricePerDay !== undefined) {
    conditions.push("price_per_day >= @minPricePerDay");
    parameters.minPricePerDay = filters.minPricePerDay;
  }
  if (filters.maxPricePerDay !== undefined) {
    conditions.push("price_per_day <= @maxPricePerDay");
    parameters.maxPricePerDay = filters.maxPricePerDay;
  }
  if (filters.location !== undefined) {
    conditions.push("location = @location");
    parameters.location = filters.location;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const rows = getDb()
    .prepare(`SELECT * FROM cars ${whereClause} ORDER BY id ASC`)
    .all(parameters) as CarRow[];

  return rows.map(mapCar);
}

export function getCarBySlug(slug: string): Car | null {
  const row = getDb().prepare("SELECT * FROM cars WHERE slug = ?").get(slug) as CarRow | undefined;
  return row ? mapCar(row) : null;
}

export function createBooking(input: NewBooking): Booking {
  validateBookingInput(input);

  const result = getDb()
    .prepare(`
      INSERT INTO bookings (user_id, car_id, pickup_date, return_date, total_price)
      VALUES (@userId, @carId, @pickupDate, @returnDate, @totalPrice)
    `)
    .run(input);
  const bookingId = Number(result.lastInsertRowid);
  const row = getDb().prepare("SELECT * FROM bookings WHERE id = ?").get(bookingId) as BookingRow | undefined;

  if (!row) {
    throw new Error("Booking could not be loaded after insertion");
  }

  return mapBooking(row);
}
