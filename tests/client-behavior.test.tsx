import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createElement } from "react";
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AuthForm } from "@/components/auth-form";
import { LogoutButton } from "@/components/logout-button";
import { ReservationForm } from "@/components/reservation-form";

const router = vi.hoisted(() => ({
  push: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => router,
}));

const car = {
  id: 1,
  slug: "volvo-v60-cross-country",
  name: "Volvo V60 Cross Country",
  category: "wagon",
  transmission: "automatic",
  seats: 5,
  pricePerDay: 4800,
  location: "Makati, Metro Manila",
  description: "A composed demo wagon.",
  imageUrl: "https://images.unsplash.com/example",
  features: ["All-wheel drive"],
  isDemo: true,
  createdAt: "2026-10-11T00:00:00.000Z",
};

describe("client auth, reservation, and logout behavior", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    router.push.mockReset();
    router.refresh.mockReset();
    vi.restoreAllMocks();
  });

  it("shows a pending state while login is waiting for the auth response", async () => {
    let resolveFetch!: (response: Response) => void;
    const responsePromise = new Promise<Response>((resolve) => {
      resolveFetch = resolve;
    });
    const fetchMock = vi.fn(() => responsePromise);
    vi.stubGlobal("fetch", fetchMock);

    render(createElement(AuthForm, { mode: "login" }));
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "renter@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "correct horse battery staple" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Log in" }));

    await waitFor(() => expect(screen.getByRole("button", { name: "Logging in…" })).toBeDisabled());
    expect(screen.getByRole("status")).toHaveTextContent("Signing you in");

    resolveFetch(new Response(JSON.stringify({ user: { id: 1 } }), { status: 200 }));
  });

  it("renders field errors returned by a failed login response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            error: "Please correct the highlighted fields",
            fieldErrors: { email: "Enter a valid email address" },
          }),
          { status: 400 },
        ),
      ),
    );

    render(createElement(AuthForm, { mode: "login" }));
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "not-an-email" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "correct horse battery staple" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Log in" }));

    expect(await screen.findByText("Please correct the highlighted fields")).toBeTruthy();
    expect(screen.getByText("Enter a valid email address")).toBeTruthy();
  });

  it("redirects after successful registration", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ user: { id: 1 } }), { status: 201 }),
      ),
    );

    render(
      createElement(AuthForm, {
        mode: "register",
        nextPath: "/reserve/volvo-v60-cross-country",
      }),
    );
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Alex Morgan" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "alex@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "correct horse battery staple" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith("/reserve/volvo-v60-cross-country");
    });
  });

  it("shows the two-day reservation total from the selected dates", () => {
    render(createElement(ReservationForm, { car }));

    expect(screen.getByText("Estimated total")).toBeTruthy();
    expect(screen.getByText("₱9,600")).toBeTruthy();
  });

  it("posts logout and redirects to the public home page", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    render(createElement(LogoutButton));
    fireEvent.click(screen.getByRole("button", { name: "Log out" }));

    await waitFor(() => expect(router.push).toHaveBeenCalledWith("/"));
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/logout",
      expect.objectContaining({ method: "POST" }),
    );
  });
});
