import type { components } from "@/lib/api/schema";

/**
 * Tipe data layanan bantuan penulisan AI (Telu) yang diturunkan langsung
 * dari OpenAPI schema.d.ts.
 */
export type AiAssistPayload = components["schemas"]["AiAssistDto"];
export type AiAssistAction = AiAssistPayload["action"];
export type AiAssistData = components["schemas"]["AiAssistDataDto"];

