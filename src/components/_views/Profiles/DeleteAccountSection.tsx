"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import FormAlert from "@/components/_shared/FormAlert";
import { useDeleteMyAccount } from "@/services/profiles/profiles.queries";
import { useLogout } from "@/services/auth/auth.queries";
import { getErrorMessages } from "@/lib/api/error-messages";

const CONSEQUENCES = [
  "Akun tidak dapat digunakan kembali untuk login.",
  "Artikel, komentar, post forum, dan komentar forum yang Anda buat TETAP tersimpan beserta nama Anda, agar dapat ditelusuri.",
  "Tindakan ini tidak dapat dibatalkan.",
];

export default function DeleteAccountSection() {
  const router = useRouter();
  const { toast } = useToast();
  const deleteAccountMutation = useDeleteMyAccount();
  const logoutMutation = useLogout();

  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string[] | null>(null);

  const isPending = deleteAccountMutation.isPending || logoutMutation.isPending;

  const handleOpenChange = (next: boolean) => {
    if (isPending) return;
    setOpen(next);
    if (!next) {
      setConfirmed(false);
      setErrorMessage(null);
    }
  };

  const handleConfirm = () => {
    if (!confirmed || isPending) return;
    setErrorMessage(null);

    deleteAccountMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Akun berhasil dihapus.");
        logoutMutation.mutate(undefined, {
          onSettled: () => {
            setOpen(false);
            router.replace("/login");
            router.refresh();
          },
        });
      },
      onError: (error) => {
        setErrorMessage(getErrorMessages(error));
      },
    });
  };

  return (
    <>
      <section className="rounded-xl border border-[var(--failed)]/40 bg-[var(--failed-soft)]/30 p-5">
        <h2 className="flex items-center gap-2 font-sans text-[13px] font-bold uppercase tracking-wider text-[var(--failed)]">
          <AlertTriangle className="h-4 w-4" />
          Zona Berbahaya
        </h2>

        <h3 className="mt-3 font-sans text-[15px] font-bold text-[var(--foreground)]">
          Hapus Akun
        </h3>
        <p className="mt-1 font-sans text-[13px] leading-relaxed text-[var(--muted)]">
          Akun Anda akan dihapus dan tidak dapat login kembali. Artikel,
          komentar, dan forum yang Anda buat tetap tersimpan beserta nama Anda
          agar dapat ditelusuri.
        </p>

        <Button
          type="button"
          variant="destructive"
          className="mt-4 cursor-pointer gap-1.5"
          onClick={() => {
            setErrorMessage(null);
            setOpen(true);
          }}
        >
          <Trash2 className="h-4 w-4" />
          <span>Hapus Akun</span>
        </Button>
      </section>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle>Hapus akun secara permanen?</DialogTitle>
            <DialogDescription>
              Tindakan ini menghapus akun Anda secara permanen. Konsekuensinya:
            </DialogDescription>
          </DialogHeader>

          <ul className="list-disc space-y-1 pl-5 font-sans text-[13px] leading-relaxed text-[var(--muted)]">
            {CONSEQUENCES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <Checkbox
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            label="Saya memahami bahwa tindakan ini tidak dapat dibatalkan."
            className="text-xs font-medium"
          />

          {errorMessage && <FormAlert messages={errorMessage} />}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirm}
              disabled={!confirmed || isPending}
            >
              {isPending ? "Menghapus..." : "Hapus Akun"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
