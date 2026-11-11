import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profilesApi } from "./profiles.api";
import type { ProfileDto, UpdateProfilePayload } from "./profiles.types";

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

/**
 * Hook mutasi pembaruan profil milik sendiri (PATCH /proxy/profiles/me).
 * Cache `profileKeys.me` langsung diperbarui dengan respons terbaru sehingga
 * seluruh tampilan profil sinkron seketika.
 */
export function useUpdateMyProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      profilesApi.updateMyProfile(payload),
    retry: false,
    onSuccess: (res) => {
      if (res?.data?.profile) {
        queryClient.setQueryData(profileKeys.me, res.data.profile);
      }
      void queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
}

/**
 * Hook mutasi penghapusan akun (soft delete — DELETE /proxy/profiles/me).
 * Konten yang dibuat pengguna TETAP tersimpan (lihat
 * docs/integrasi-profil/03-delete-account.md). Setelah sukses, pemanggil harus
 * mengakhiri sesi (useLogout) dan mengarahkan ke halaman login.
 */
export function useDeleteMyAccount() {
  return useMutation({
    mutationFn: () => profilesApi.deleteMyAccount(),
    retry: false,
  });
}
