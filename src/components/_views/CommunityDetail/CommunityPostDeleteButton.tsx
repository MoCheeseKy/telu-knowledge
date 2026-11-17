"use client";

import { useState, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useDeleteCommunityPost } from "@/services/community-posts/community-posts.queries";
import { getErrorMessages } from "@/lib/api/error-messages";
import { cn } from "@/lib/utils";

interface CommunityPostDeleteButtonProps {
  communityId: string;
  /** ID postingan di mock server (CommunityPost.id / CommunityPostDto.id). */
  postId: string;
  postTitle: string;
  /**
   * "card" = tombol aksi kecil di feed (default);
   * "form" = tautan merah di footer form edit.
   */
  variant?: "card" | "form";
  /** Jika diisi, pengguna dialihkan ke URL ini setelah postingan berhasil dihapus. */
  redirectHref?: string;
}

export default function CommunityPostDeleteButton({
  communityId,
  postId,
  postTitle,
  variant = "card",
  redirectHref,
}: CommunityPostDeleteButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const deleteMutation = useDeleteCommunityPost();
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string[] | null>(null);

  const handleTriggerClick = (event: MouseEvent<HTMLButtonElement>) => {
    // Cegah kartu yang bisa diklik ikut menanggapi klik tombol hapus
    event.stopPropagation();
    setErrorMessage(null);
    setOpen(true);
  };

  const handleConfirm = () => {
    if (deleteMutation.isPending) return;
    setErrorMessage(null);

    deleteMutation.mutate(
      { communityId, postId },
      {
        onSuccess: () => {
          // Feed me-refresh sendiri via invalidasi query communityPostKeys.list
          setOpen(false);
          toast.success("Postingan berhasil dihapus.");
          if (redirectHref) {
            router.push(redirectHref);
          }
        },
        onError: (error) => {
          setErrorMessage(getErrorMessages(error));
        },
      }
    );
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={
          variant === "card"
            ? "h-7 px-2 py-1 gap-1.5 hover:bg-[var(--background-accent)] rounded-md text-[var(--foreground)] [&_svg]:size-4"
            : cn(
                "h-auto gap-1.5 p-0 text-[13px] font-semibold text-[var(--failed)] hover:bg-transparent hover:opacity-80"
              )
        }
        aria-label="Hapus postingan"
        onClick={handleTriggerClick}
      >
        <Trash2 />
        <span className="font-sans text-xs font-bold">
          {variant === "card" ? "Hapus" : "Hapus postingan"}
        </span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        {/* Klik di dalam dialog (portal) harus dihenti di sini agar tidak
            menggelembung ke kontainer kartu yang bisa diklik di belakangnya. */}
        <DialogContent
          className="max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle>Hapus postingan?</DialogTitle>
            <DialogDescription>
              Postingan “{postTitle}” beserta komentarnya akan
              dihapus permanen dan tidak dapat dikembalikan.
            </DialogDescription>
          </DialogHeader>

          {errorMessage && <FormAlert messages={errorMessage} />}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
