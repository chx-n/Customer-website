import { createElement } from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";

import { Button } from "@/components/button";
import { HeroSearch } from "@/components/hero-search";
import { LandingFaq, RentalDetails, TripIntentGrid } from "@/components/landing-sections";
import { OnboardingRail } from "@/components/onboarding-rail";
import { VehicleCard } from "@/components/vehicle-card";

const car = {
  id: 1,
  slug: "volvo-v60-cross-country",
  name: "Volvo V60 Cross Country",
  category: "wagon",
  transmission: "automatic",
  seats: 5,
  pricePerDay: 4800,
  location: "Makati, Metro Manila",
  description: "A composed demo wagon with generous cargo space for relaxed weekend routes.",
  imageUrl: "https://images.unsplash.com/photo-1502877338535-766e1452684a",
  features: ["All-wheel drive", "Apple CarPlay", "Large cargo area"],
  isDemo: true,
  createdAt: "2026-10-11T00:00:00.000Z",
};

describe("marketing components", () => {
  it("renders an accessible vehicle name and details CTA", () => {
    render(createElement(VehicleCard, { car, featured: true }));

    expect(screen.getByRole("heading", { name: car.name })).toBeTruthy();
    expect(screen.getByRole("link", { name: /^view details$/i })).toHaveAttribute(
      "href",
      `/fleet/${car.slug}`,
    );
  });

  it("exposes labeled location and date controls", () => {
    render(createElement(HeroSearch));

    expect(screen.getByLabelText("Pickup location")).toBeTruthy();
    expect(screen.getByLabelText("Pickup date")).toBeTruthy();
    expect(screen.getByLabelText("Return date")).toBeTruthy();
  });

  it("gives first-time renters a concise path to reservation", () => {
    render(
      createElement(OnboardingRail, {
        currentStep: 1,
        description: "Start with dates, then compare.",
        id: "first-trip",
        title: "Plan your first rental in three moves.",
      }),
    );

    expect(screen.getByRole("heading", { name: "Plan your first rental in three moves." })).toBeTruthy();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByRole("link", { name: /choose dates/i })).toHaveAttribute("aria-current", "step");
  });

  it("explains the first landing-page decisions without inventing proof", () => {
    render(
      createElement(
        "div",
        null,
        createElement(TripIntentGrid, { pickupAreas: 6 }),
        createElement(RentalDetails),
        createElement(LandingFaq),
      ),
    );

    expect(screen.getByRole("heading", { name: /kind of day you have in mind/i })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /choose with confidence/i })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /new to renting/i })).toBeTruthy();
    expect(screen.getByText(/does not represent live availability/i)).toBeTruthy();
  });

  it("includes a visible active press state on buttons", () => {
    render(createElement(Button, null, "Browse fleet"));

    expect(screen.getByRole("button", { name: "Browse fleet" }).className).toContain(
      "active:scale-[0.98]",
    );
  });
});
