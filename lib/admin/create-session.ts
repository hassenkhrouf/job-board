import { createHmac } from "crypto";
import { ADMIN_SESSION_TTL_SECONDS } from "@/lib/admin/constants";

export function createAdminSessionToken(secret: string): string {
  const expiresAt = String(
    Math.floor(Date.now() / 1000) + ADMIN_SESSION_TTL_SECONDS,
  );
  const signature = createHmac("sha256", secret)
    .update(expiresAt)
    .digest("base64url");
  return `${expiresAt}.${signature}`;
}
