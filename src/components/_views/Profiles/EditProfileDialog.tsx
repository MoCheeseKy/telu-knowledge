"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import EditProfileForm from "./EditProfileForm";
import { useProfile } from "./profile.context";
import type { UpdateProfilePayload } from "@/services/profiles/profiles.types";
import { useToast } from "@/components/ui/toast";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditProfileDialog({
  open,
  onOpenChange,
}: EditProfileDialogProps) {
  const { profile, updateProfile } = useProfile();
  const { toast } = useToast();

  const handleSave = async (updated: UpdateProfilePayload) => {
    // Error diteruskan ke form (ditampilkan lewat FormAlert) — toast sukses
    // hanya muncul bila penyimpanan benar-benar berhasil.
    await updateProfile(updated);
    toast.success("Profil berhasil diperbarui!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl font-bold font-sans">
            Ubah Informasi Profil
          </DialogTitle>
          <DialogDescription className="text-xs text-[var(--muted)]">
            Perbarui foto profil, biodata, informasi akademik, dan tautan sosial Anda di Tel-U Knowledge.
          </DialogDescription>
        </DialogHeader>

        <EditProfileForm
          initialData={profile}
          onSave={handleSave}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
