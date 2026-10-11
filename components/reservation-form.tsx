"use client";

import { createElement, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import type { Car } from "@/lib/cars";

type DateField = "pickupDate" | "returnDate";
type DateErrors = Partial<Record<DateField, string>>;

interface ReservationFormProps {
  car: Car;
  initialPickupDate?: string;
  initialReturnDate?: string;
}

interface BookingResponse {
  error?: string;
  fieldErrors?: DateErrors;
  booking?: { totalPrice?: number };
}

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDefaultDates(): { pickupDate: string; returnDate: string } {
  const tomorrow = new Date();
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const followingDay = new Date(tomorrow);
  followingDay.setDate(followingDay.getDate() + 1);
  return { pickupDate: formatLocalDate(tomorrow), returnDate: formatLocalDate(followingDay) };
}

function parseLocalDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
}

function getToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function getRentalDays(pickupDate: string, returnDate: string): number | null {
  const pickup = parseLocalDate(pickupDate);
  const rentalReturn = parseLocalDate(returnDate);
  if (!pickup || !rentalReturn || rentalReturn < pickup) return null;
  return Math.max(1, Math.round((rentalReturn.getTime() - pickup.getTime()) / 86_400_000) + 1);
}

function formatPrice(value: number): string {
  return `₱${value.toLocaleString("en-PH")}`;
}

async function readResponse(response: Response): Promise<BookingResponse> {
  try {
    const body: unknown = await response.json();
    if (typeof body === "object" && body !== null) return body as BookingResponse;
  } catch {
    // Fall through to the status-based message below.
  }
  return {};
}

function fieldError(id: string, message: string | undefined) {
  return message ? createElement("p", { className: "mt-2 text-sm text-[#ffaaa3]", id, role: "alert" }, message) : null;
}

export function ReservationForm({ car, initialPickupDate, initialReturnDate }: ReservationFormProps) {
  const router = useRouter();
  const defaults = getDefaultDates();
  const [pickupDate, setPickupDate] = useState(initialPickupDate || defaults.pickupDate);
  const [returnDate, setReturnDate] = useState(initialReturnDate || defaults.returnDate);
  const [dateErrors, setDateErrors] = useState<DateErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedTotal, setConfirmedTotal] = useState<number | null>(null);

  const rentalDays = getRentalDays(pickupDate, returnDate);
  const estimatedTotal = rentalDays ? car.pricePerDay * rentalDays : null;
  const displayedTotal = confirmedTotal ?? estimatedTotal;
  const dateInputClassName = "mt-2 block w-full rounded-[10px] border border-[var(--northline-border)] bg-[var(--northline-background)] px-4 py-3 text-[var(--northline-text)] outline-none transition-colors focus:border-[var(--northline-accent)]";
  const dateFields = [
    { id: "reservation-pickup", label: "Pickup date", name: "pickupDate" as const, value: pickupDate, error: dateErrors.pickupDate, onChange: (value: string) => setPickupDate(value), min: formatLocalDate(getToday()) },
    { id: "reservation-return", label: "Return date", name: "returnDate" as const, value: returnDate, error: dateErrors.returnDate, onChange: (value: string) => setReturnDate(value), min: pickupDate || formatLocalDate(getToday()) },
  ];

  function validateDates(): DateErrors {
    const errors: DateErrors = {};
    const pickup = parseLocalDate(pickupDate);
    const rentalReturn = parseLocalDate(returnDate);
    if (!pickup) errors.pickupDate = "Choose a valid pickup date";
    else if (pickup < getToday()) errors.pickupDate = "Pickup date cannot be in the past";
    if (!rentalReturn) errors.returnDate = "Choose a valid return date";
    if (pickup && rentalReturn && rentalReturn < pickup) errors.returnDate = "Return date cannot be before pickup date";
    return errors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = validateDates();
    setDateErrors(errors);
    setFormError(null);
    if (Object.keys(errors).length > 0) {
      setStatusMessage("Please correct the highlighted dates.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("Checking your reservation…");
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ carId: car.id, pickupDate, returnDate }),
      });
      const result = await readResponse(response);
      if (!response.ok) {
        setDateErrors(result.fieldErrors ?? {});
        setFormError(response.status === 401 ? "Please log in before reserving a car." : result.error ?? "We could not create that reservation.");
        setStatusMessage("");
        return;
      }
      const total = result.booking?.totalPrice;
      if (typeof total === "number") setConfirmedTotal(total);
      setStatusMessage("Reservation confirmed. Opening your dashboard…");
      router.push("/dashboard");
      router.refresh();
    } catch {
      setFormError("We could not reach Northline. Check your connection and try again.");
      setStatusMessage("");
    } finally {
      setIsSubmitting(false);
    }
  }

  return createElement(
    "form",
    { className: "space-y-5", noValidate: true, onSubmit: handleSubmit },
    createElement("div", { className: "grid gap-4 sm:grid-cols-2" }, ...dateFields.map((field) => createElement(
      "div",
      { key: field.name },
      createElement("label", { className: "text-sm font-semibold", htmlFor: field.id }, field.label),
      createElement("input", { "aria-describedby": field.error ? `${field.id}-error` : undefined, "aria-invalid": Boolean(field.error), className: dateInputClassName, id: field.id, min: field.min, onChange: (event) => field.onChange(event.target.value), type: "date", value: field.value }),
      fieldError(`${field.id}-error`, field.error),
    ))),
    createElement(
      "div",
      { className: "rounded-[10px] border border-[var(--northline-border)] bg-[var(--northline-background)] px-4 py-4" },
      createElement(
        "div",
        { className: "flex items-baseline justify-between gap-4" },
        createElement("span", { className: "text-sm text-[var(--northline-text-muted)]" }, "Estimated total"),
        createElement("strong", { className: "text-xl text-[var(--northline-text)]" }, displayedTotal === null ? "Choose dates" : formatPrice(displayedTotal)),
      ),
      createElement("p", { className: "mt-1 text-xs text-[var(--northline-text-muted)]" }, rentalDays ? `${rentalDays} rental day${rentalDays === 1 ? "" : "s"} at ${formatPrice(car.pricePerDay)} per day` : "Dates are calculated before the request is sent."),
    ),
    formError ? createElement("p", { className: "rounded-[10px] border border-[#703f3b] bg-[#2b1d1c] px-4 py-3 text-sm text-[#ffaaa3]", role: "alert" }, formError) : null,
    createElement("p", { "aria-live": "polite", className: "min-h-5 text-sm text-[var(--northline-text-muted)]", role: "status" }, statusMessage),
    createElement("button", { "aria-busy": isSubmitting, className: "w-full rounded-[10px] bg-[var(--northline-accent)] px-5 py-3.5 font-semibold text-[var(--northline-background)] transition hover:bg-[#d7fb83] disabled:cursor-not-allowed disabled:opacity-60", disabled: isSubmitting, type: "submit" }, isSubmitting ? "Reserving…" : "Reserve car"),
  );
}
