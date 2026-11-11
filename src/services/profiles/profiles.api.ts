import { apiFetch } from "@/lib/api/client";
import type { ApiEnvelope } from "@/lib/api/types";
import type { MyProfileData, UpdateProfilePayload } from "./profiles.types";

/**
 * Mengambil detail profil milik sendiri (GET /proxy/profiles/me).
 * Default source 'mock' karena backend NestJS belum menyediakan endpoint profil.
 */
export async function getMyProfile(): Promise<ApiEnvelope<MyProfileData>> {
  return apiFetch<MyProfileData>("/proxy/profiles/me", {
    method: "GET",
    source: "mock",
  });
}

/**
 * Memperbarui profil milik sendiri (PATCH /proxy/profiles/me).
 * Patch parsial: hanya field yang dikirim yang diubah; `null` mengosongkan
 * field nullable.
 */
export async function updateMyProfile(
  payload: UpdateProfilePayload
): Promise<ApiEnvelope<MyProfileData>> {
  return apiFetch<MyProfileData>("/proxy/profiles/me", {
    method: "PATCH",
    body: payload,
    source: "mock",
  });
}

export const profilesApi = {
  getMyProfile,
  updateMyProfile,
};
