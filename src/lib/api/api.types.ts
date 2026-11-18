/**
 * Kontrak respons envelope sukses standar backend NestJS Tel-U Knowledge.
 */
export interface ApiEnvelope<T> {
  statusCode: number;
  message: string;
  isError: false;
  data: T;
}

/**
 * Kontrak respons envelope error standar backend NestJS Tel-U Knowledge.
 */
export interface ApiErrorEnvelope {
  statusCode: number;
  message: string | string[];
  isError: true;
  data: null;
}
