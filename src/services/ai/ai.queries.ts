import { useMutation } from "@tanstack/react-query";
import { aiApi } from "./ai.api";
import type { AiAssistPayload } from "./ai.types";

export interface AiAssistMutationVariables extends AiAssistPayload {
  signal?: AbortSignal;
}

/**
 * Hook mutasi untuk bantuan penulisan AI (POST /proxy/ai/assist).
 * Menggunakan meta.skipAuthRedirect agar 401 saat menggunakan AI tidak memicu hard redirect.
 */
export function useAiAssist() {
  return useMutation({
    mutationFn: ({ signal, ...payload }: AiAssistMutationVariables) =>
      aiApi.assist(payload, { signal }),
    retry: false,
    meta: {
      skipAuthRedirect: true,
    },
  });
}
