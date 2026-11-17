import { z } from "zod";
import type { CreateCommunityPostPayload } from "./community-posts.types";

const TITLE_MAX_LENGTH = 300;

export const createCommunityPostSchema = z.object({
  title: z
    .string({ message: "Judul postingan wajib diisi" })
    .trim()
    .min(1, "Judul postingan wajib diisi")
    .max(TITLE_MAX_LENGTH, `Judul postingan maksimal ${TITLE_MAX_LENGTH} karakter`),
  content: z
    .string({ message: "Isi postingan wajib diisi" })
    .trim()
    .min(1, "Isi postingan wajib diisi"),
  flair: z.string().trim().min(1).nullable().optional(),
  tags: z
    .array(z.string().trim().min(1))
    .max(6, "Maksimal 6 flair atau tag")
    .optional(),
  coverImageUrl: z.string().nullable().optional(),
  imageCaption: z.string().trim().max(200).nullable().optional(),
});

/**
 * Validasi payload sebelum dikirim ke mock server / backend.
 */
export function validateCreateCommunityPost(
  payload: CreateCommunityPostPayload
):
  | { success: true; data: CreateCommunityPostPayload }
  | { success: false; errors: string[] } {
  const parsed = createCommunityPostSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.issues.map((issue) => issue.message),
    };
  }

  return { success: true, data: parsed.data };
}
