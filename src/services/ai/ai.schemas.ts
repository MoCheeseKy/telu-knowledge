import { z } from "zod";

export const aiAssistActionSchema = z.enum(
  [
    "paraphrase",
    "shorten",
    "expand",
    "fix_grammar",
    "formal",
    "casual",
    "custom",
  ],
  {
    message: "Jenis aksi bantuan AI tidak valid",
  }
);

export const aiAssistSchema = z
  .object({
    action: aiAssistActionSchema,
    instruction: z
      .string({ message: "Instruksi harus berupa teks" })
      .trim()
      .max(500, "Instruksi maksimal 500 karakter")
      .optional(),
    selectedText: z
      .string({ message: "Teks terpilih wajib diisi" })
      .trim()
      .min(1, "Teks terpilih wajib diisi (minimal 1 karakter)")
      .max(4000, "Teks terpilih maksimal 4000 karakter"),
    contextBefore: z
      .string({ message: "Konteks sebelum harus berupa teks" })
      .max(1000, "Konteks sebelum maksimal 1000 karakter")
      .optional(),
    contextAfter: z
      .string({ message: "Konteks sesudah harus berupa teks" })
      .max(1000, "Konteks sesudah maksimal 1000 karakter")
      .optional(),
  })
  .refine(
    (data) =>
      data.action !== "custom" ||
      (typeof data.instruction === "string" &&
        data.instruction.trim().length > 0),
    {
      message: "Instruksi wajib diisi untuk aksi kustom",
      path: ["instruction"],
    }
  );

export type AiAssistInput = z.infer<typeof aiAssistSchema>;

