import type { components } from "@/lib/api/schema";

/**
 * Payload permintaan bantuan penulisan AI yang diturunkan langsung dari OpenAPI `schema.d.ts`.
 */
export type AiAssistPayload = components["schemas"]["AiAssistDto"];

/**
 * Jenis aksi bantuan penulisan AI yang tersedia pada `AiAssistPayload`.
 */
export type AiAssistAction = AiAssistPayload["action"];

/**
 * Data respons hasil bantuan penulisan AI dari OpenAPI `schema.d.ts`.
 */
export type AiAssistData = components["schemas"]["AiAssistDataDto"];

