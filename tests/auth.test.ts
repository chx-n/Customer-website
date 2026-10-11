import { beforeEach, describe, expect, it, vi } from "vitest";

const cookieStore = vi.hoisted(() => ({
  get: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => cookieStore),
}));

import { POST as register } from "@/app/api/auth/register/route";
import { POST as login } from "@/app/api/auth/login/route";
import { POST as logout } from "@/app/api/auth/logout/route";
import { GET as me } from "@/app/api/auth/me/route";
import {
  getCurrentUser,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";
import { validateCredentials } from "@/lib/auth-validation";

function jsonRequest(url: string, body: unknown): Request {
  return new Request(`http://localhost${url}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

function uniqueEmail(): string {
  return `auth-${crypto.randomUUID()}@northline.test`;
}

describe("auth domain", () => {
  beforeEach(() => {
    cookieStore.get.mockReset();
    cookieStore.get.mockReturnValue(undefined);
  });

  it("hashes passwords and rejects an incorrect password", async () => {
    const password = "correct horse battery staple";
    const hash = await hashPassword(password);

    expect(hash).not.toBe(password);
    expect(await verifyPassword(password, hash)).toBe(true);
    expect(await verifyPassword("wrong password", hash)).toBe(false);
  });

  it("returns field errors for invalid credentials", () => {
    const result = validateCredentials({
      email: "not-an-email",
      password: "short",
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toMatchObject({
      email: expect.any(String),
      password: expect.any(String),
    });
  });

  it("accepts normalized registration credentials", () => {
    const result = validateCredentials({
      name: "  Alex Morgan ",
      email: "  ALEX@EXAMPLE.COM ",
      password: "correct horse battery staple",
    });

    expect(result).toEqual({
      valid: true,
      errors: {},
      data: {
        name: "Alex Morgan",
        email: "alex@example.com",
        password: "correct horse battery staple",
      },
    });
  });

  it("registers a user with a safe response and session cookie", async () => {
    const email = uniqueEmail();
    const response = await register(
      jsonRequest("/api/auth/register", {
        name: "Alex Morgan",
        email,
        password: "correct horse battery staple",
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body).toEqual({
      user: {
        id: expect.any(Number),
        name: "Alex Morgan",
        email,
      },
    });
    expect(body.user).not.toHaveProperty("password");
    expect(body.user).not.toHaveProperty("passwordHash");

    const setCookie = response.headers.get("set-cookie");
    expect(setCookie).toContain("northline_session=");
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toMatch(/SameSite=lax/i);
    expect(setCookie).toContain("Path=/");
  });

  it("rejects registration when the email already exists", async () => {
    const email = uniqueEmail();
    const input = {
      name: "Alex Morgan",
      email,
      password: "correct horse battery staple",
    };

    expect((await register(jsonRequest("/api/auth/register", input))).status).toBe(201);
    const response = await register(jsonRequest("/api/auth/register", input));

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({ error: "An account with that email already exists" });
  });

  it("logs in with valid credentials and rejects invalid credentials", async () => {
    const email = uniqueEmail();
    const password = "correct horse battery staple";

    expect(
      (
        await register(
          jsonRequest("/api/auth/register", {
            name: "Alex Morgan",
            email,
            password,
          }),
        )
      ).status,
    ).toBe(201);

    const response = await login(jsonRequest("/api/auth/login", { email, password }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      user: {
        id: expect.any(Number),
        name: "Alex Morgan",
        email,
      },
    });
    expect(response.headers.get("set-cookie")).toContain("HttpOnly");

    const invalidResponse = await login(
      jsonRequest("/api/auth/login", { email, password: "incorrect password" }),
    );
    expect(invalidResponse.status).toBe(401);
    expect(await invalidResponse.json()).toEqual({ error: "Invalid email or password" });
  });

  it("clears the session cookie on logout", async () => {
    const response = await logout();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(response.headers.get("set-cookie")).toContain("northline_session=");
    expect(response.headers.get("set-cookie")).toContain("Max-Age=0");
  });

  it("returns no current user when there is no session cookie", async () => {
    expect(await getCurrentUser()).toBeNull();

    const response = await me(new Request("http://localhost/api/auth/me"));
    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Unauthorized" });
  });
});
