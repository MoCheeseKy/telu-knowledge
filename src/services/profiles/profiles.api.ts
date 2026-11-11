import { apiFetch } from "@/lib/api/client";
import type { ApiEnvelope } from "@/lib/api/types";
import type { MyProfileData } from "./profiles.types";

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

export const profilesApi = {
  getMyProfile,
};
