"use client";

import React, { createContext, useContext, useState } from "react";
import { UserProfile, defaultProfile } from "./profile.types";

interface ProfileContextType {
  profile: UserProfile;
  updateProfile: (updated: Partial<UserProfile>) => void;
  resetProfile: () => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const STORAGE_KEY = "telu_user_profile";

function getInitialProfile(): UserProfile {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore storage errors
    }
  }
  return defaultProfile;
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(getInitialProfile);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  const resetProfile = () => {
    setProfile(defaultProfile);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        updateProfile,
        resetProfile,
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
