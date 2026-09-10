import "server-only";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

/**
 * Resolve the active admin password hash.
 * Priority: SiteSettings.adminPasswordHash (set via the Settings screen) → env.
 */
async function getAdminHash(): Promise<string | null> {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
    select: { adminPasswordHash: true },
  });
  if (settings?.adminPasswordHash) return settings.adminPasswordHash;
  return process.env.ADMIN_PASSWORD_HASH ?? null;
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const hash = await getAdminHash();
  if (!hash) {
    throw new Error(
      "No admin password configured. Set ADMIN_PASSWORD_HASH or run `npm run seed`.",
    );
  }
  try {
    return await bcrypt.compare(password, hash);
  } catch {
    return false;
  }
}

export async function setAdminPassword(newPassword: string): Promise<void> {
  const hash = await bcrypt.hash(newPassword, 10);
  await prisma.siteSettings.update({
    where: { id: "singleton" },
    data: { adminPasswordHash: hash },
  });
}
