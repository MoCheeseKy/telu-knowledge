"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { MyArticleCardProps } from "./_types";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function MyArticleCard({
    id,
    title,
    description,
    imageUrl,
    status = "draft",
    className = "",
    isDeleting = false,
    isPublishing = false,
    onEdit,
    onDelete,
    onPublish,
}: MyArticleCardProps) {
    const router = useRouter();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleEditClick = () => {
        if (onEdit) {
            onEdit();
            return;
        }
        if (id !== undefined) {
            router.push(`/editor-studio/${id}`);
        } else {
            router.push("/editor-studio");
        }
    };

    const handleCardClick = () => {
        if (id === undefined) return;
        if (status === "published") {
            router.push(`/discovers-articles/${id}/article-detail`);
        } else {
            router.push(`/editor-studio/${id}`);
        }
    };

    const handleConfirmDelete = () => {
        setIsDeleteDialogOpen(false);
        onDelete?.();
    };

    return (
        <>
            <div
                className={cn(
                    "flex items-center justify-between py-4 border-b border-[var(--dust)]/40 gap-4 group",
                    className
                )}
            >
                <div
                    onClick={handleCardClick}
                    className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 cursor-pointer"
                >
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={title}
                            className="w-[100px] h-[70px] sm:w-[120px] sm:h-[80px] rounded-[4px] object-cover shrink-0 bg-[#D9D9D9]"
                        />
                    ) : (
                        <div className="w-[100px] h-[70px] sm:w-[120px] sm:h-[80px] rounded-[4px] bg-[#D9D9D9] shrink-0" />
                    )}

                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                        <h3 className="font-sans text-[15px] sm:text-[16px] font-bold text-[var(--foreground)] truncate group-hover:text-[var(--primary-text)] transition-colors">
                            {title}
                        </h3>
                        <p className="font-sans text-[13px] text-[var(--muted)] truncate">
                            {description}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <button
                        type="button"
                        onClick={() => setIsDeleteDialogOpen(true)}
                        disabled={isDeleting}
                        className="p-2 rounded-lg text-[var(--muted)] hover:text-[var(--failed)] hover:bg-[var(--failed)]/10 transition-colors cursor-pointer disabled:opacity-50"
                        aria-label={`Hapus ${title}`}
                        title="Hapus"
                    >
                        <Trash2 className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                    </button>

                    <button
                        type="button"
                        onClick={handleEditClick}
                        className="p-2 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-accent)] transition-colors cursor-pointer"
                        aria-label={`Edit ${title}`}
                        title="Edit"
                    >
                        <Pencil className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                    </button>

                    {status === "draft" && (
                        <Button
                            type="button"
                            size="sm"
                            disabled={isPublishing}
                            onClick={onPublish}
                            className="h-8 px-3 sm:px-3.5 text-xs font-semibold rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white cursor-pointer ml-1 disabled:opacity-50"
                        >
                            {isPublishing ? "Memproses..." : "Publikasi"}
                        </Button>
                    )}
                </div>
            </div>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Hapus Artikel?</DialogTitle>
                        <DialogDescription className="pt-1">
                            Apakah Anda yakin ingin menghapus artikel{" "}
                            <span className="font-semibold text-[var(--foreground)]">
                                &ldquo;{title}&rdquo;
                            </span>
                            ? Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            disabled={isDeleting}
                            onClick={() => setIsDeleteDialogOpen(false)}
                            className="rounded-lg border border-[var(--dust)] bg-transparent text-[var(--foreground)] hover:bg-[var(--background-accent)] cursor-pointer"
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            disabled={isDeleting}
                            onClick={handleConfirmDelete}
                            className="rounded-lg bg-[var(--failed)] hover:opacity-90 text-white cursor-pointer"
                        >
                            {isDeleting ? "Menghapus..." : "Hapus"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
