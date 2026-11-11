import { useQuery } from "@tanstack/react-query";
import { profilesApi } from "./profiles.api";
import type { ProfileDto } from "./profiles.types";

export const profileKeys = {
  all: ["profiles"] as const,
  me: ["profiles", "me"] as const,
};

/**
 * Hook query detail profil milik sendiri (GET /proxy/profiles/me).
 * Query key `profileKeys.me` juga menjadi target invalidasi untuk task
 * Update Profil yang akan datang.
 */
export function useMyProfile() {
  return useQuery<ProfileDto>({
    queryKey: profileKeys.me,
    queryFn: async (): Promise<ProfileDto> => {
      const res = await profilesApi.getMyProfile();
      return res.data.profile;
    },
  });
}
