import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const KEY_LENGTH = 64;
const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1 } as const;

/** Format: saltHex:hashHex (scrypt). */
export function hashAdminPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEY_LENGTH, SCRYPT_PARAMS).toString(
    "hex",
  );
  return `${salt}:${hash}`;
}

export function verifyAdminPassword(
  password: string,
  passwordHash: string,
): boolean {
  const [salt, storedHash] = passwordHash.split(":");

  if (!salt || !storedHash) {
    return false;
  }

  const actual = scryptSync(password, salt, KEY_LENGTH, SCRYPT_PARAMS);
  const expected = Buffer.from(storedHash, "hex");

  if (actual.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(actual, expected);
}
