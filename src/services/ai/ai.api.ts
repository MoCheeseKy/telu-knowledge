import { apiFetch } from "@/lib/api/client";
import type { ApiEnvelope } from "@/lib/api/api.types";
import type { AiAssistData, AiAssistPayload } from "./ai.types";

/**
 * Opsi permintaan untuk layanan bantuan penulisan AI.
 */
export interface AiAssistRequestOptions {
  signal?: AbortSignal;
}

/**
 * Meminta bantuan penulisan AI (POST /proxy/ai/assist).
 *
 * @param payload Data teks terpilih, jenis aksi, dan konteks penulisan.
 * @param options Opsi permintaan opsional termasuk `AbortSignal` untuk pembatalan.
 * @returns Envelope respons berisi hasil teks dari AI.
 */
export async function aiAssist(
  payload: AiAssistPayload,
  options?: AiAssistRequestOptions
): Promise<ApiEnvelope<AiAssistData>> {
  return apiFetch<AiAssistData>("/proxy/ai/assist", {
    method: "POST",
    body: payload,
    signal: options?.signal,
  });
}

/**
 * Kumpulan fungsi klien API untuk fitur bantuan penulisan AI.
 */
export const aiApi = {
  assist: aiAssist,
};
