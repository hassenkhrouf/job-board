import { cookies, headers } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_TTL_SECONDS,
} from "@/lib/admin/constants";
import { createAdminSessionToken } from "@/lib/admin/create-session";

/**
 * Whether the current request is served over TLS. Used to set the `Secure`
 * cookie flag only when it actually applies: over plain `http://` a Secure
 * cookie is silently dropped by browsers, which would break the admin session
 * (e.g. running `next start` on http://localhost).
 */
export async function isSecureRequest(): Promise<boolean> {
  try {
    const headersStore = await headers();
    const proto = (headersStore.get("x-forwarded-proto") ?? "http")
      .split(",")[0]
      .trim();
    return proto === "https";
  } catch {
    return false;
  }
}

export async function setAdminSessionCookie() {
  const secret = process.env.ADMIN_SECRET;

  if (!secret) {
    throw new Error("ADMIN_SECRET is not configured.");
  }

  const token = createAdminSessionToken(secret);
  const cookieStore = await cookies();
  const secure = await isSecureRequest();

  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  const secure = await isSecureRequest();

  cookieStore.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}