import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin/constants";
import { verifyAdminSessionToken } from "@/lib/admin/verify-session";

/**
 * Defense-in-depth: middleware guards page navigation, but server actions can
 * be invoked directly. Re-verify the admin session cookie before any write.
 * Throws on missing config so it fails closed; otherwise redirects to login.
 */
export async function requireAdminSession(): Promise<void> {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SECRET is not configured.");
  }

  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  const valid = await verifyAdminSessionToken(token, secret);
  if (!valid) {
    redirect("/admin/login");
  }
}
