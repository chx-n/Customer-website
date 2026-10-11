export type BookingField = "carId" | "pickupDate" | "returnDate";

export interface BookingData {
  carId: number;
  pickupDate: string;
  returnDate: string;
}

export interface BookingValidationResult {
  valid: boolean;
  errors: Partial<Record<BookingField, string>>;
  data?: BookingData;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseUtcCalendarDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }

  const [, yearText, monthText, dayText] = match;
  const date = new Date(0);
  date.setUTCFullYear(Number(yearText), Number(monthText) - 1, Number(dayText));
  date.setUTCHours(0, 0, 0, 0);

  return date.toISOString().slice(0, 10) === value ? date : null;
}

function getTodayUtc(): Date {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today;
}

export function validateBookingInput(input: unknown): BookingValidationResult {
  const value = isRecord(input) ? input : {};
  const errors: Partial<Record<BookingField, string>> = {};
  const carId = value.carId;
  const pickupDate = typeof value.pickupDate === "string" ? value.pickupDate : "";
  const returnDate = typeof value.returnDate === "string" ? value.returnDate : "";
  const pickup = pickupDate ? parseUtcCalendarDate(pickupDate) : null;
  const rentalReturn = returnDate ? parseUtcCalendarDate(returnDate) : null;

  if (!Number.isSafeInteger(carId) || (carId as number) <= 0) {
    errors.carId = "Car is required";
  }
  if (!pickup) {
    errors.pickupDate = "Pickup date must be a valid YYYY-MM-DD date";
  }
  if (!rentalReturn) {
    errors.returnDate = "Return date must be a valid YYYY-MM-DD date";
  }

  if (pickup && pickup < getTodayUtc()) {
    errors.pickupDate = "Pickup date cannot be in the past";
  }
  if (pickup && rentalReturn && rentalReturn < pickup) {
    errors.returnDate = "Return date cannot be before pickup date";
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: {},
    data: {
      carId: carId as number,
      pickupDate,
      returnDate,
    },
  };
}

export function calculateRentalDays(pickupDate: string, returnDate: string): number {
  const pickup = parseUtcCalendarDate(pickupDate);
  const rentalReturn = parseUtcCalendarDate(returnDate);

  if (!pickup || !rentalReturn || rentalReturn < pickup) {
    throw new RangeError("Rental dates must be valid and return date cannot be before pickup date");
  }

  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.max(1, Math.floor((rentalReturn.getTime() - pickup.getTime()) / millisecondsPerDay) + 1);
}

export function calculateBookingTotal(pricePerDay: number, days: number): number {
  if (!Number.isSafeInteger(pricePerDay) || pricePerDay < 0) {
    throw new RangeError("Price per day must be a non-negative integer");
  }
  if (!Number.isSafeInteger(days) || days < 1) {
    throw new RangeError("Rental days must be a positive integer");
  }

  const total = pricePerDay * days;
  if (!Number.isSafeInteger(total)) {
    throw new RangeError("Booking total exceeds the safe integer range");
  }

  return total;
}
