import "server-only";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 5;

/** Generate a fresh 6-digit code, store its hash, return the plaintext. */
export async function issueOtp(): Promise<string> {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const codeHash = await bcrypt.hash(code, 10);
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);
  await prisma.adminOtp.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", codeHash, expiresAt, attempts: 0 },
    update: { codeHash, expiresAt, attempts: 0, createdAt: new Date() },
  });
  return code;
}

type VerifyResult =
  | { ok: true }
  | { ok: false; reason: "missing" | "expired" | "locked" | "mismatch" };

/** Check a submitted code; on success the row is deleted (single use). */
export async function verifyOtp(code: string): Promise<VerifyResult> {
  const row = await prisma.adminOtp.findUnique({ where: { id: "singleton" } });
  if (!row) return { ok: false, reason: "missing" };
  if (row.expiresAt.getTime() < Date.now()) {
    await prisma.adminOtp.delete({ where: { id: "singleton" } }).catch(() => {});
    return { ok: false, reason: "expired" };
  }
  if (row.attempts >= MAX_ATTEMPTS) return { ok: false, reason: "locked" };

  const match = await bcrypt.compare(code.trim(), row.codeHash).catch(() => false);
  if (!match) {
    await prisma.adminOtp.update({
      where: { id: "singleton" },
      data: { attempts: { increment: 1 } },
    });
    return { ok: false, reason: "mismatch" };
  }

  await prisma.adminOtp.delete({ where: { id: "singleton" } }).catch(() => {});
  return { ok: true };
}
