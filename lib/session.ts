import "server-only";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";

/**
 * Server-side session helpers. Only import from Server Components and server
 * actions — `next/headers` blows up in Client Components.
 *
 * Supports both cookie-based sessions (browser) and Bearer token auth (API clients).
 */
export async function getSession() {
  const hdrs = await headers();
  return auth.api.getSession({ headers: hdrs });
}

export async function requireSession() {
  const session = await getSession();
  if (!session) throw new Error("unauthorized");
  return session;
}
