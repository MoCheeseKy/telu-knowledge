"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { ImagePlus, RefreshCw, Tag, Trash2, X } from "lucide-react";
import { useCreateCommunityPost, useUpdateCommunityPost } from "@/services/community-posts/community-posts.queries";
import { validateCreateCommunityPost } from "@/services/community-posts/community-posts.schemas";
import type { CommunityPostDto } from "@/services/community-posts/community-posts.types";
import { getErrorMessages } from "@/lib/api/error-messages";
import { useToast } from "@/components/ui/toast";
import FormAlert from "@/components/_shared/FormAlert";
import { cn } from "@/lib/utils";
import PostGuidelinesSidebar from "./PostGuidelinesSidebar";
import { upsertCommunityPost } from "./storage";
import type { CommunityDetail, CommunityPost } from "../CommunityDetail/types";

interface CommunityPostCreateViewProps {
  community: CommunityDetail;
  /** "create" (default) untuk postingan baru; "edit" untuk menyunting postingan milik sendiri. */
  mode?: "create" | "edit";
  /** Data awal postingan — wajib untuk mode "edit". */
  initialPost?: CommunityPostDto;
}

const TITLE_MAX_LENGTH = 300;
const ACCEPTED_IMAGE_TYPES = "image/png,image/jpeg,image/webp,image/gif";
const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024;

const FLAIR_OPTIONS = [
  "Diskusi",
  "Rekomendasi",
  "Pertanyaan",
  "Showcase",
  "Info",
  "Tips",
];

export default function CommunityPostCreateView({
  community,
  mode = "create",
  initialPost,
}: CommunityPostCreateViewProps) {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const createPostMutation = useCreateCommunityPost();
  const updatePostMutation = useUpdateCommunityPost();

  const isEditMode = mode === "edit";
  const isSubmitting = isEditMode
    ? updatePostMutation.isPending
    : createPostMutation.isPending;

  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [description, setDescription] = useState(initialPost?.content ?? "");
  const [coverImage, setCoverImage] = useState<string | null>(
    initialPost?.coverImageUrl ?? null
  );
  const [coverError, setCoverError] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>(initialPost?.tags ?? []);
  const [showFlairs, setShowFlairs] = useState(false);
  const [submitError, setSubmitError] = useState<string[] | null>(null);

  // Flair post lama yang tidak ada di katalog default tetap ditawarkan saat edit.
  const [extraFlairs] = useState<string[]>(() =>
    (initialPost?.tags ?? []).filter((tag) => !FLAIR_OPTIONS.includes(tag))
  );
  const flairChoices =
    extraFlairs.length > 0 ? [...FLAIR_OPTIONS, ...extraFlairs] : FLAIR_OPTIONS;

  const canSubmit =
    title.trim().length > 0 &&
    description.trim().length > 0 &&
    tags.length > 0;

  const toggleTag = (tag: string) => {
    setTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag]
    );
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleCoverFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setCoverError(null);

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setCoverError(
        "Ukuran file terlalu besar. Maksimal ukuran file adalah 4MB."
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCoverImage(reader.result);
      }
    };
    reader.onerror = () => {
      setCoverError("Gagal memuat gambar cover. Silakan coba lagi.");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCover = () => {
    setCoverError(null);
    setCoverImage(null);
  };

  /**
   * Jembatan tampilan sementara: sinkronkan ringkasan postingan ke localStorage
   * agar langsung tampil di feed komunitas (create menambah, edit mengganti).
   * TODO(langkah integrasi GET): hapus setelah feed komunitas membaca postingan
   * langsung dari mock server (GET /proxy/communities/:id/posts).
   */
  const syncPostToFeed = (dto: CommunityPostDto) => {
    const trimmedDescription = dto.content.trim();
    const post: CommunityPost = {
      id: Date.now(),
      mockPostId: dto.id,
      topic: community.name,
      publisher: dto.author.displayName,
      postDate: new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(dto.createdAt)),
      title: dto.title,
      description:
        trimmedDescription.length > 280
          ? `${trimmedDescription.slice(0, 280)}…`
          : trimmedDescription,
      ...(dto.coverImageUrl
        ? { imageUrl: dto.coverImageUrl, imageAlt: dto.imageCaption ?? dto.title }
        : {}),
      likesCount: dto.likesCount,
      commentsCount: dto.commentsCount,
      repostsCount: dto.repostsCount,
      isLiked: dto.isLiked,
    };

    upsertCommunityPost(community.id, post);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setSubmitError(null);

    const validation = validateCreateCommunityPost({
      title,
      content: description,
      flair: tags[0] ?? null,
      tags,
      coverImageUrl: coverImage,
      imageCaption: coverImage ? title.trim() : null,
    });

    if (!validation.success) {
      setSubmitError(validation.errors);
      return;
    }

    if (isEditMode) {
      if (!initialPost) return;
      updatePostMutation.mutate(
        {
          communityId: community.id,
          postId: initialPost.id,
          payload: validation.data,
        },
        {
          onSuccess: (res) => {
            syncPostToFeed(res.data);
            toast.success("Postingan berhasil diperbarui.");
            router.push(`/communities/${community.id}`);
          },
          onError: (error) => {
            setSubmitError(getErrorMessages(error));
          },
        }
      );
      return;
    }

    createPostMutation.mutate(
      { communityId: community.id, payload: validation.data },
      {
        onSuccess: (res) => {
          syncPostToFeed(res.data);
          toast.success("Postingan berhasil dibuat.");
          router.push(`/communities/${community.id}`);
        },
        onError: (error) => {
          setSubmitError(getErrorMessages(error));
        },
      }
    );
  };

  return (
    <div className="grid w-full grid-cols-1 gap-x-10 py-2 sm:py-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-x-12">
      <form onSubmit={handleSubmit} className="min-w-0">
        {/* Komunitas tujuan */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href={`/communities/${community.id}`}
            className="inline-flex h-11 min-w-0 items-center gap-2 rounded-full border border-[var(--dust)] px-3 transition-colors hover:bg-[var(--background-accent)]"
          >
            <img
              src={community.avatarUrl}
              alt=""
              className="h-7 w-7 shrink-0 rounded-full object-cover"
            />
            <span className="min-w-0 max-w-[220px] truncate font-sans text-[13px] font-semibold text-[var(--foreground)]">
              {community.name}
            </span>
          </Link>
        </div>

        {/* Judul */}
        <div className="mt-6">
          <label htmlFor="post-title" className="sr-only">
            Judul postingan
          </label>
          <input
            id="post-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Judul*"
            maxLength={TITLE_MAX_LENGTH}
            className="w-full border-b border-transparent bg-transparent pb-3 font-sans text-[24px] font-bold text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted)]/70 focus:border-[var(--dust)] sm:text-[28px]"
          />
          <div className="mt-1.5 flex items-center justify-between gap-3">
            <p className="font-sans text-[11px] text-[var(--muted)]">
              Judul postingan wajib diisi.
            </p>
            <span className="shrink-0 font-sans text-[11px] text-[var(--muted)]">
              {title.length}/{TITLE_MAX_LENGTH}
            </span>
          </div>
        </div>

        {/* Flair dan tag */}
        <div className="mt-5">
          <button
            type="button"
            onClick={() => setShowFlairs((current) => !current)}
            aria-expanded={showFlairs}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-full border px-4 font-sans text-[13px] font-semibold transition-colors cursor-pointer",
              tags.length > 0
                ? "border-[var(--primary)]/40 bg-[var(--primary-soft)] text-[var(--primary-text)]"
                : "border-[var(--dust)] text-[var(--foreground)] hover:bg-[var(--background-accent)]"
            )}
          >
            <Tag className="h-4 w-4" />
            Tambahkan flair dan tag
            <span className="text-[var(--primary)]" aria-hidden="true">
              *
            </span>
          </button>

          {showFlairs && (
            <div className="mt-3 flex flex-wrap gap-2">
              {flairChoices.map((flair) => {
                const isSelected = tags.includes(flair);

                return (
                  <button
                    key={flair}
                    type="button"
                    onClick={() => toggleTag(flair)}
                    aria-pressed={isSelected}
                    className={cn(
                      "rounded-full border px-3 py-1.5 font-sans text-[12px] font-medium transition-colors cursor-pointer",
                      isSelected
                        ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                        : "border-[var(--dust)] bg-white text-[var(--foreground)] hover:bg-[var(--background-accent)]"
                    )}
                  >
                    {flair}
                  </button>
                );
              })}
            </div>
          )}

          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-[var(--primary-soft)] px-2.5 py-1 font-sans text-[11px] font-semibold text-[var(--primary-text)]"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => toggleTag(tag)}
                    aria-label={`Hapus tag ${tag}`}
                    className="rounded-full p-0.5 transition-colors hover:bg-white/60 cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <p className="mt-1.5 font-sans text-[11px] text-[var(--muted)]">
            Wajib pilih minimal satu flair atau tag.
          </p>
        </div>

        {/* Lampirkan Gambar Cover */}
        <div className="mt-6">
          <p className="font-sans text-[13px] font-bold text-[var(--foreground)]">
            Gambar cover{" "}
            <span className="font-normal text-[var(--muted)]">(opsional)</span>
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_IMAGE_TYPES}
            onChange={handleCoverFileChange}
            className="hidden"
            aria-label="Lampirkan gambar cover"
          />

          <div className="mt-2">
            {coverImage ? (
              <div className="group relative w-full overflow-hidden rounded-xl border border-[var(--dust)]/70 bg-[var(--background-accent)]">
                <img
                  src={coverImage}
                  alt="Pratinjau gambar cover"
                  className="max-h-[360px] w-full object-cover"
                />
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={openFilePicker}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[var(--dust)] bg-[var(--background)]/95 px-3 font-sans text-xs font-semibold text-[var(--foreground)] shadow-xs transition-colors hover:bg-[var(--background-accent)] cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Ganti</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveCover}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[var(--failed)] px-3 font-sans text-xs font-semibold text-white shadow-xs transition-opacity hover:opacity-90 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={openFilePicker}
                className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--dust)] bg-white/60 px-4 py-7 text-center transition-colors hover:border-[var(--primary)]/60 hover:bg-[var(--background-accent)]/60"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-soft)] text-[var(--primary-text)]">
                  <ImagePlus className="h-5 w-5" />
                </div>
                <span className="font-sans text-sm font-semibold text-[var(--foreground)]">
                  Lampirkan gambar cover
                </span>
                <span className="font-sans text-xs text-[var(--muted)]">
                  Format PNG, JPEG, WEBP, atau GIF (maks. 4MB)
                </span>
              </button>
            )}

            {coverError && (
              <p className="mt-1.5 font-sans text-xs text-[var(--failed)]">
                {coverError}
              </p>
            )}
          </div>
        </div>

        {/* Isi postingan (Input deskripsi biasa) */}
        <div className="mt-6">
          <label
            htmlFor="post-description"
            className="font-sans text-[13px] font-bold text-[var(--foreground)]"
          >
            Isi postingan{" "}
            <span className="text-[var(--primary)]" aria-hidden="true">
              *
            </span>
          </label>

          <div className="mt-2 rounded-xl border border-[var(--dust)]/70 bg-white">
            <textarea
              id="post-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={7}
              placeholder="Tulis deskripsi atau isi postingan Anda..."
              className="w-full resize-y rounded-t-xl bg-transparent px-4 py-3 font-sans text-[15px] leading-relaxed text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]/70"
            />

            <div className="flex flex-col gap-3 border-t border-[var(--dust)]/50 px-4 py-3">
              {submitError && <FormAlert messages={submitError} />}

              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="inline-flex h-9 items-center justify-center rounded-lg bg-[var(--primary)] px-5 font-sans text-[13px] font-semibold text-white transition-colors hover:bg-[var(--primary-hover)] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isEditMode
                    ? isSubmitting
                      ? "Menyimpan..."
                      : "Simpan perubahan"
                    : isSubmitting
                    ? "Membuat..."
                    : "Posting"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      <PostGuidelinesSidebar community={community} />
    </div>
  );
}
