import { z } from "zod";
import type { UpdateProfilePayload } from "./profiles.types";

/**
 * Skema validasi pembaruan profil (cermin dari validasi server di
 * mock/server.mjs handleUpdateMyProfile).
 */
export const updateProfileSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Username wajib diisi")
    .max(30, "Username maksimal 30 karakter")
    .optional(),
  displayName: z
    .string()
    .trim()
    .min(1, "Nama lengkap wajib diisi")
    .max(60, "Nama lengkap maksimal 60 karakter")
    .optional(),
  bio: z.string().max(160, "Bio maksimal 160 karakter").optional(),
  faculty: z
    .string()
    .trim()
    .max(60, "Nama fakultas maksimal 60 karakter")
    .nullable()
    .optional(),
  major: z
    .string()
    .trim()
    .max(60, "Program studi maksimal 60 karakter")
    .nullable()
    .optional(),
  generation: z
    .string()
    .trim()
    .max(10, "Angkatan maksimal 10 karakter")
    .nullable()
    .optional(),
  website: z
    .string()
    .trim()
    .max(300, "Tautan maksimal 300 karakter")
    .nullable()
    .optional(),
  github: z
    .string()
    .trim()
    .max(300, "Tautan maksimal 300 karakter")
    .nullable()
    .optional(),
  linkedin: z
    .string()
    .trim()
    .max(300, "Tautan maksimal 300 karakter")
    .nullable()
    .optional(),
  avatarUrl: z.string().nullable().optional(),
  bannerUrl: z.string().nullable().optional(),
  showEmail: z.boolean().optional(),
  showCommunities: z.boolean().optional(),
});

/**
 * Validasi payload pembaruan profil sebelum dikirim ke mock server / backend.
 */
export function validateUpdateProfile(
  payload: UpdateProfilePayload
):
  | { success: true; data: UpdateProfilePayload }
  | { success: false; errors: string[] } {
  const parsed = updateProfileSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.issues.map((issue) => issue.message),
    };
  }

  return { success: true, data: parsed.data as UpdateProfilePayload };
}
