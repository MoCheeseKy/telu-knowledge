import { z } from "zod";

/**
 * Memeriksa secara rekursif apakah dokumen JSON Tiptap memiliki
 * minimal satu node teks yang tidak kosong setelah di-trim.
 */
export function hasNonEmptyTiptapText(node: unknown): boolean {
  if (!node || typeof node !== "object") {
    return false;
  }

  const record = node as Record<string, unknown>;

  if (
    record.type === "text" &&
    typeof record.text === "string" &&
    record.text.trim().length > 0
  ) {
    return true;
  }

  if (Array.isArray(record.content)) {
    return record.content.some((child) => hasNonEmptyTiptapText(child));
  }

  return false;
}

export const articleTitleSchema = z
  .string({ message: "Judul artikel wajib diisi (minimal 1 karakter)" })
  .trim()
  .min(1, "Judul artikel wajib diisi (minimal 1 karakter)")
  .max(150, "Judul artikel maksimal 150 karakter");

export const articleSubtitleSchema = z
  .string({ message: "Subjudul artikel harus berupa teks" })
  .trim()
  .max(300, "Subjudul artikel maksimal 300 karakter")
  .nullable()
  .optional();

export const tiptapContentForPublishSchema = z
  .record(z.string(), z.unknown(), {
    message: "Konten artikel harus berupa dokumen JSON Tiptap yang valid",
  })
  .refine((doc) => doc.type === "doc" && Array.isArray(doc.content), {
    message: "Konten artikel harus berupa dokumen JSON Tiptap yang valid",
  })
  .refine((doc) => hasNonEmptyTiptapText(doc), {
    message:
      "Konten artikel wajib memiliki minimal satu teks yang tidak kosong",
  });

/**
 * Skema validasi sebelum mempublikasikan artikel di sisi client.
 */
export const publishArticleSchema = z.object({
  title: articleTitleSchema,
  subtitle: articleSubtitleSchema,
  content: tiptapContentForPublishSchema,
});

export type PublishArticleInput = z.infer<typeof publishArticleSchema>;

