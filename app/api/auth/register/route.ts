import { NextResponse } from "next/server";

import {
  createSession,
  createUser,
  getUserByEmail,
  hashPassword,
  setSessionCookie,
  toSessionUser,
} from "@/lib/auth";
import { validateCredentials } from "@/lib/auth-validation";

export async function POST(request: Request): Promise<NextResponse> {
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const validation = validateCredentials(input);
  if (!validation.valid || !validation.data || !validation.data.name) {
    return NextResponse.json(
      {
        error: "Please correct the highlighted fields",
        fieldErrors: {
          ...validation.errors,
          ...(!validation.data?.name ? { name: "Name is required" } : {}),
        },
      },
      { status: 400 },
    );
  }

  const { name, email, password } = validation.data;
  if (getUserByEmail(email)) {
    return NextResponse.json({ error: "An account with that email already exists" }, { status: 409 });
  }

  try {
    const user = createUser({
      name,
      email,
      passwordHash: await hashPassword(password),
    });
    const response = NextResponse.json({ user: toSessionUser(user) }, { status: 201 });
    setSessionCookie(response, await createSession(user.id));
    return response;
  } catch (error) {
    if (error instanceof Error && error.message.includes("UNIQUE constraint failed: users.email")) {
      return NextResponse.json({ error: "An account with that email already exists" }, { status: 409 });
    }

    return NextResponse.json({ error: "Unable to create account" }, { status: 500 });
  }
}
