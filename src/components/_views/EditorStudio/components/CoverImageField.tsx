"use client";

import { useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, RefreshCw, Trash2 } from "lucide-react";
import FormAlert from "@/components/_shared/FormAlert";
import { Button } from "@/components/ui/button";
import { isApiError } from "@/lib/api/errors";
import { cn } from "@/lib/utils";
import { useUploadArticleImage } from "@/services/articles/articles.queries";

const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES =
  "image/png,image/jpeg,image/webp,image/gif";

export interface CoverImageFieldProps {
  value: string | null;
  onChange: (url: string | null) => void;
  disabled?: boolean;
  className?: string;
}

export default function CoverImageField({
  value,
  onChange,
  disabled = false,
  className,
}: CoverImageFieldProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const uploadMutation = useUploadArticleImage();

  const isUploading = uploadMutation.isPending;

  const openFilePicker = () => {
    if (disabled || isUploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setErrorMessage(null);

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(
        "Ukuran file terlalu besar. Maksimal ukuran file adalah 4MB."
      );
      return;
    }

    uploadMutation.mutate(file, {
      onSuccess: (res) => {
        if (res?.data?.url) {
          onChange(res.data.url);
        }
      },
      onError: (err) => {
        if (isApiError(err)) {
          setErrorMessage(err.message);
        } else {
          setErrorMessage(
            "Gagal mengunggah gambar sampul. Silakan coba lagi."
          );
        }
      },
    });
  };

  const handleRemove = () => {
    if (disabled || isUploading) return;
    setErrorMessage(null);
    onChange(null);
  };

  return (
    <div className={cn("w-full flex flex-col gap-3", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES}
        onChange={handleFileChange}
        disabled={disabled || isUploading}
        className="hidden"
        aria-label="Pilih file gambar sampul"
      />

      {value ? (
        <div className="relative group w-full overflow-hidden rounded-xl border border-[var(--dust)] bg-[var(--background-accent)]">
          <Image
            src={value}
            alt="Gambar sampul artikel"
            width={1200}
            height={675}
            unoptimized
            className={cn(
              "w-full h-auto max-h-[460px] object-cover rounded-xl transition-opacity",
              isUploading && "opacity-50"
            )}
          />

          {isUploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[var(--background)]/75 backdrop-blur-xs">
              <Loader2 className="w-6 h-6 animate-spin text-[var(--primary-text)]" />
              <span className="text-xs sm:text-sm font-medium text-[var(--foreground)]">
                Mengunggah gambar sampul…
              </span>
            </div>
          )}

          {!isUploading && (
            <div className="absolute top-3 right-3 flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 transition-opacity">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={openFilePicker}
                disabled={disabled}
                className="h-8 px-3 text-xs font-medium gap-1.5 rounded-lg bg-[var(--background)]/95 text-[var(--foreground)] hover:bg-[var(--background-accent)] border border-[var(--dust)] shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Ganti</span>
              </Button>

              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                disabled={disabled}
                className="h-8 px-3 text-xs font-medium gap-1.5 rounded-lg shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </Button>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={openFilePicker}
          disabled={disabled || isUploading}
          className={cn(
            "w-full rounded-xl border border-dashed border-[var(--dust)] bg-[var(--background-accent)]/45",
            "hover:bg-[var(--background-accent)] hover:border-[var(--primary)]/60 transition-colors",
            "py-8 sm:py-10 px-4 flex flex-col items-center justify-center gap-2 text-center cursor-pointer",
            "disabled:opacity-60 disabled:cursor-not-allowed"
          )}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin text-[var(--primary-text)]" />
              <span className="text-sm font-medium text-[var(--foreground)]">
                Mengunggah gambar sampul…
              </span>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-[var(--primary-soft)] text-[var(--primary-text)] flex items-center justify-center">
                <ImagePlus className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-[var(--foreground)]">
                Tambahkan Gambar Sampul
              </span>
              <span className="text-xs text-[var(--muted)]">
                Format PNG, JPEG, WEBP, atau GIF (maks. 4MB)
              </span>
            </>
          )}
        </button>
      )}

      {errorMessage && (
        <FormAlert variant="error" messages={errorMessage} />
      )}
    </div>
  );
}

