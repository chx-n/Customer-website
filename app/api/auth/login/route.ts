import { NextResponse } from "next/server";

import {
  createSession,
  getUserByEmail,
  setSessionCookie,
  toSessionUser,
  verifyPassword,
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
  if (!validation.valid || !validation.data) {
    return NextResponse.json(
      { error: "Please correct the highlighted fields", fieldErrors: validation.errors },
      { status: 400 },
    );
  }

  const user = getUserByEmail(validation.data.email);
  if (!user || !(await verifyPassword(validation.data.password, user.passwordHash))) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const response = NextResponse.json({ user: toSessionUser(user) });
  setSessionCookie(response, await createSession(user.id));
  return response;
}
