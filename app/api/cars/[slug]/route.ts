import { NextResponse } from "next/server";

import { getCarBySlug } from "@/lib/cars";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  const { slug } = await context.params;
  const car = getCarBySlug(slug);

  if (!car) {
    return NextResponse.json({ error: "Car not found" }, { status: 404 });
  }

  return NextResponse.json({ car });
}
