"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useMyProfile, useUpdateMyProfile } from "@/services/profiles/profiles.queries";
import type { UpdateProfilePayload } from "@/services/profiles/profiles.types";
import {
  UserProfile,
  ProfileContextType,
  defaultProfile,
  mapProfileDtoToUserProfile,
} from "./profile.types";

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

/**
 * Provider konteks profil pengguna yang mengelola pengambilan data profil,
 * pembaruan ke server, dan status dialog edit profil.
 */
export function ProfileProvider({ children }: { children: React.ReactNode }) {
  // Detail profil langsung dari mock server (GET /proxy/profiles/me).
  // Tidak ada localStorage — perubahan data lewat mutasi + invalidasi query.
  const { data, isLoading, isError, refetch } = useMyProfile();
  const updateMutation = useUpdateMyProfile();
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  const profile = useMemo<UserProfile>(
    () => (data ? mapProfileDtoToUserProfile(data) : defaultProfile),
    [data]
  );

  const updateProfile = async (payload: UpdateProfilePayload): Promise<void> => {
    // useUpdateMyProfile meng-update cache profileKeys.me dari respons server,
    // sehingga seluruh tampilan profil sinkron seketika.
    await updateMutation.mutateAsync(payload);
  };

  const refetchProfile = () => {
    void refetch();
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        updateProfile,
        isLoading,
        isError,
        refetchProfile,
        isEditDialogOpen,
        setIsEditDialogOpen,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

/**
 * Hook untuk mengakses state dan aksi profil dari `ProfileContext`.
 *
 * @returns Nilai `ProfileContextType` dari provider terdekat.
 * @throws {Error} Jika dipanggil di luar `ProfileProvider`.
 */
export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
