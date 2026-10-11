import bcrypt from "bcryptjs";
import { jwtVerify, SignJWT, type JWK } from "jose";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

import { getDb } from "@/lib/db";

export const SESSION_COOKIE_NAME = "northline_session";
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;
const SESSION_ISSUER = "northline-rental";
const SESSION_AUDIENCE = "northline-renter";
const TEST_SESSION_SECRET = "northline-test-session-secret-only-32-bytes";

export interface SessionUser {
  id: number;
  name: string;
  email: string;
}

export interface UserRecord extends SessionUser {
  passwordHash: string;
  createdAt: string;
}

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

type UserRow = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
};

function getSessionSecret(): JWK {
  const configuredSecret = process.env.SESSION_SECRET?.trim();
  const secret = configuredSecret ?? (process.env.NODE_ENV === "test" ? TEST_SESSION_SECRET : undefined);

  if (!secret) {
    throw new Error("SESSION_SECRET must be configured outside the test environment");
  }
  if (Buffer.byteLength(secret, "utf8") < 32) {
    throw new Error("SESSION_SECRET must be at least 32 bytes");
  }

  return {
    alg: "HS256",
    k: Buffer.from(secret).toString("base64url"),
    kty: "oct",
  };
}

function mapUser(row: UserRow): UserRecord {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    createdAt: row.created_at,
  };
}

export function toSessionUser(user: UserRecord): SessionUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

export function getUserById(id: number): UserRecord | null {
  const row = getDb().prepare("SELECT * FROM users WHERE id = ?").get(id) as UserRow | undefined;
  return row ? mapUser(row) : null;
}

export function getUserByEmail(email: string): UserRecord | null {
  const row = getDb().prepare("SELECT * FROM users WHERE email = ?").get(email) as UserRow | undefined;
  return row ? mapUser(row) : null;
}

export function createUser(input: {
  name: string;
  email: string;
  passwordHash: string;
}): UserRecord {
  const result = getDb()
    .prepare(
      `INSERT INTO users (name, email, password_hash)
       VALUES (@name, @email, @passwordHash)`,
    )
    .run(input);
  const user = getUserById(Number(result.lastInsertRowid));

  if (!user) {
    throw new Error("User could not be loaded after insertion");
  }

  return user;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: number): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuer(SESSION_ISSUER)
    .setAudience(SESSION_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSessionSecret());
}

async function getUserFromSessionToken(token: string | undefined): Promise<SessionUser | null> {
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getSessionSecret(), {
      algorithms: ["HS256"],
      issuer: SESSION_ISSUER,
      audience: SESSION_AUDIENCE,
    });
    const userId = payload.userId;
    if (typeof userId !== "number" || !Number.isSafeInteger(userId) || userId <= 0) {
      return null;
    }

    const user = getUserById(userId);
    return user ? toSessionUser(user) : null;
  } catch {
    return null;
  }
}

function getTokenFromCookieHeader(cookieHeader: string | null): string | undefined {
  const cookie = cookieHeader
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE_NAME}=`));

  return cookie?.slice(SESSION_COOKIE_NAME.length + 1);
}

export async function getCurrentUser(request?: Request): Promise<SessionUser | null> {
  if (request) {
    return getUserFromSessionToken(getTokenFromCookieHeader(request.headers.get("cookie")));
  }

  const cookieStore = await cookies();
  return getUserFromSessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

export async function requireUser(request?: Request): Promise<SessionUser> {
  const user = await getCurrentUser(request);
  if (!user) {
    throw new UnauthorizedError();
  }

  return user;
}

export function setSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
}
