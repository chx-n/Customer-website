export interface CredentialData {
  name?: string;
  email: string;
  password: string;
}

export type CredentialField = "name" | "email" | "password";

const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 254;
const MAX_PASSWORD_LENGTH = 128;

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<CredentialField, string>>;
  data?: CredentialData;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function validateCredentials(input: unknown): ValidationResult {
  const value = isRecord(input) ? input : {};
  const errors: Partial<Record<CredentialField, string>> = {};
  const name = typeof value.name === "string" ? value.name.trim() : undefined;
  const email = typeof value.email === "string" ? value.email.trim().toLowerCase() : "";
  const password = typeof value.password === "string" ? value.password : "";

  if (value.name !== undefined && !name) {
    errors.name = "Name is required";
  } else if (name && name.length > MAX_NAME_LENGTH) {
    errors.name = `Name must be ${MAX_NAME_LENGTH} characters or fewer`;
  }
  if (!email) {
    errors.email = "Email is required";
  } else if (email.length > MAX_EMAIL_LENGTH) {
    errors.email = `Email must be ${MAX_EMAIL_LENGTH} characters or fewer`;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address";
  }
  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  } else if (password.length > MAX_PASSWORD_LENGTH) {
    errors.password = `Password must be ${MAX_PASSWORD_LENGTH} characters or fewer`;
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: {},
    data: {
      ...(name ? { name } : {}),
      email,
      password,
    },
  };
}
