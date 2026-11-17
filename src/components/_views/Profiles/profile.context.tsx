"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useMyProfile, useUpdateMyProfile } from "@/services/profiles/profiles.queries";
import type { UpdateProfilePayload } from "@/services/profiles/profiles.types";
import {
  UserProfile,
  defaultProfile,
  mapProfileDtoToUserProfile,
} from "./profile.types";

interface ProfileContextType {
  profile: UserProfile;
  /**
   * Menyimpan pembaruan profil secara persisten ke mock server
   * (PATCH /proxy/profiles/me). Melempar error bila gagal — pemanggil
   * (form) menampilkannya lewat FormAlert.
   */
  updateProfile: (payload: UpdateProfilePayload) => Promise<void>;
  isLoading: boolean;
  isError: boolean;
  refetchProfile: () => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

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

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
