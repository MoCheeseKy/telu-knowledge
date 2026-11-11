"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import { useMyProfile } from "@/services/profiles/profiles.queries";
import {
  UserProfile,
  defaultProfile,
  mapProfileDtoToUserProfile,
} from "./profile.types";

interface ProfileContextType {
  profile: UserProfile;
  /**
   * Pembaruan profil sementara (di memori selama halaman terbuka).
   * Persistensi ke mock menyusul pada task Update Profil
   * (lihat docs/integrasi-profil/).
   */
  updateProfile: (updated: Partial<UserProfile>) => void;
  isLoading: boolean;
  isError: boolean;
  refetchProfile: () => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  // Detail profil langsung dari mock server (GET /proxy/profiles/me).
  // Tidak ada localStorage — perubahan data cukup lewat invalidasi query.
  const { data, isLoading, isError, refetch } = useMyProfile();
  const [overrides, setOverrides] = useState<Partial<UserProfile>>({});
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const profile = useMemo<UserProfile>(() => {
    const base = data ? mapProfileDtoToUserProfile(data) : defaultProfile;
    return { ...base, ...overrides };
  }, [data, overrides]);

  const updateProfile = (updated: Partial<UserProfile>) => {
    // TODO(task Update Profil): kirim PATCH ke mock lalu invalidate
    // profileKeys.me agar seluruh tampilan sinkron. Sementara perubahan hanya
    // bertahan selama halaman terbuka.
    setOverrides((prev) => ({ ...prev, ...updated }));
  };

  const refetchProfile = () => {
    setOverrides({});
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
