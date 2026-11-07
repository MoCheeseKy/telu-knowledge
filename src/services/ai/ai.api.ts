import { apiFetch } from "@/lib/api/client";
import type { ApiEnvelope } from "@/lib/api/types";
import type { AiAssistData, AiAssistPayload } from "./ai.types";

export interface AiAssistRequestOptions {
  signal?: AbortSignal;
}

/**
 * Meminta bantuan penulisan AI (POST /proxy/ai/assist).
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

export const aiApi = {
  assist: aiAssist,
};
