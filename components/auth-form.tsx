"use client";

import { createElement, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type AuthMode = "login" | "register";
type FieldName = "name" | "email" | "password";
type FieldErrors = Partial<Record<FieldName, string>>;

interface AuthFormProps {
  mode: AuthMode;
  nextPath?: string;
}

interface AuthResponse {
  error?: string;
  fieldErrors?: FieldErrors;
}

function getRedirectPath(nextPath?: string): string {
  return nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")
    ? nextPath
    : "/dashboard";
}

async function readResponse(response: Response): Promise<AuthResponse> {
  try {
    const body: unknown = await response.json();
    if (typeof body === "object" && body !== null) {
      return body as AuthResponse;
    }
  } catch {
    // The status code still gives the form enough information to show a useful error.
  }

  return {};
}

function fieldError(id: string, message: string | undefined) {
  return message
    ? createElement("p", { className: "mt-2 text-sm text-[#ffaaa3]", id, role: "alert" }, message)
    : null;
}

export function AuthForm({ mode, nextPath }: AuthFormProps) {
  const router = useRouter();
  const isRegister = mode === "register";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setFormError(null);
    setStatusMessage(isRegister ? "Creating your account…" : "Signing you in…");
    setIsSubmitting(true);

    try {
      const response = await fetch(isRegister ? "/api/auth/register" : "/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          ...(isRegister ? { name } : {}),
          email,
          password,
        }),
      });
      const result = await readResponse(response);

      if (!response.ok) {
        setFieldErrors(result.fieldErrors ?? {});
        setFormError(result.error ?? "Something went wrong. Please try again.");
        setStatusMessage("");
        return;
      }

      setStatusMessage(isRegister ? "Account created. Redirecting…" : "Signed in. Redirecting…");
      router.push(getRedirectPath(nextPath));
      router.refresh();
    } catch {
      setFormError("We could not reach Northline. Check your connection and try again.");
      setStatusMessage("");
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClassName =
    "mt-2 block w-full rounded-[10px] border border-[var(--northline-border)] bg-[var(--northline-background)] px-4 py-3 text-[var(--northline-text)] outline-none transition-colors placeholder:text-[var(--northline-text-muted)] focus:border-[var(--northline-accent)]";
  const labelClassName = "text-sm font-semibold";
  const fields = [];

  if (isRegister) {
    fields.push(
      createElement(
        "div",
        { key: "name" },
        createElement("label", { className: labelClassName, htmlFor: "auth-name" }, "Name"),
        createElement("input", {
          "aria-describedby": fieldErrors.name ? "auth-name-error" : undefined,
          "aria-invalid": Boolean(fieldErrors.name),
          autoComplete: "name",
          className: inputClassName,
          id: "auth-name",
          name: "name",
          onChange: (event) => setName(event.target.value),
          value: name,
        }),
        fieldError("auth-name-error", fieldErrors.name),
      ),
    );
  }

  fields.push(
    createElement(
      "div",
      { key: "email" },
      createElement("label", { className: labelClassName, htmlFor: "auth-email" }, "Email"),
      createElement("input", {
        "aria-describedby": fieldErrors.email ? "auth-email-error" : undefined,
        "aria-invalid": Boolean(fieldErrors.email),
        autoComplete: "email",
        className: inputClassName,
        id: "auth-email",
        inputMode: "email",
        name: "email",
        onChange: (event) => setEmail(event.target.value),
        type: "email",
        value: email,
      }),
      fieldError("auth-email-error", fieldErrors.email),
    ),
    createElement(
      "div",
      { key: "password" },
      createElement("label", { className: labelClassName, htmlFor: "auth-password" }, "Password"),
      createElement("input", {
        "aria-describedby": fieldErrors.password ? "auth-password-error" : undefined,
        "aria-invalid": Boolean(fieldErrors.password),
        autoComplete: isRegister ? "new-password" : "current-password",
        className: inputClassName,
        id: "auth-password",
        minLength: 8,
        name: "password",
        onChange: (event) => setPassword(event.target.value),
        type: "password",
        value: password,
      }),
      fieldError("auth-password-error", fieldErrors.password),
    ),
  );

  return createElement(
    "form",
    { className: "space-y-5", noValidate: true, onSubmit: handleSubmit },
    ...fields,
    formError
      ? createElement(
          "p",
          {
            className: "rounded-[10px] border border-[#703f3b] bg-[#2b1d1c] px-4 py-3 text-sm text-[#ffaaa3]",
            role: "alert",
          },
          formError,
        )
      : null,
    createElement(
      "p",
      { "aria-live": "polite", className: "min-h-5 text-sm text-[var(--northline-text-muted)]", role: "status" },
      statusMessage,
    ),
    createElement(
      "button",
      {
        "aria-busy": isSubmitting,
        className: "w-full rounded-[10px] bg-[var(--northline-accent)] px-5 py-3.5 font-semibold text-[var(--northline-background)] transition hover:bg-[#d7fb83] disabled:cursor-not-allowed disabled:opacity-60",
        disabled: isSubmitting,
        type: "submit",
      },
      isSubmitting ? (isRegister ? "Creating account…" : "Logging in…") : isRegister ? "Create account" : "Log in",
    ),
  );
}
