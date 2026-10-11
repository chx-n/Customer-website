import { NextResponse } from "next/server";

import { getCars, type CarFilters } from "@/lib/cars";

function parseOptionalInteger(value: string | null, minimum: number): number | undefined | null {
  if (value === null || value === "") {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed >= minimum ? parsed : null;
}

export function GET(request: Request): NextResponse {
  const searchParams = new URL(request.url).searchParams;
  const seats = parseOptionalInteger(searchParams.get("seats"), 1);
  const minPricePerDay = parseOptionalInteger(
    searchParams.get("minPricePerDay") ?? searchParams.get("minPrice"),
    0,
  );
  const maxPricePerDay = parseOptionalInteger(
    searchParams.get("maxPricePerDay") ?? searchParams.get("maxPrice"),
    0,
  );

  if (seats === null || minPricePerDay === null || maxPricePerDay === null) {
    return NextResponse.json({ error: "Invalid car filters" }, { status: 400 });
  }

  const filters: CarFilters = {
    ...(searchParams.get("category") ? { category: searchParams.get("category")! } : {}),
    ...(searchParams.get("transmission")
      ? { transmission: searchParams.get("transmission")! }
      : {}),
    ...(seats !== undefined ? { seats } : {}),
    ...(minPricePerDay !== undefined ? { minPricePerDay } : {}),
    ...(maxPricePerDay !== undefined ? { maxPricePerDay } : {}),
    ...(searchParams.get("location") ? { location: searchParams.get("location")! } : {}),
  };

  return NextResponse.json({ cars: getCars(filters) });
}
