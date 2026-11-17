/**
 * Kontrak respons envelope standar backend NestJS Tel-U Knowledge.
 */

export interface ApiEnvelope<T> {
  statusCode: number;
  message: string;
  isError: false;
  data: T;
}

export interface ApiErrorEnvelope {
  statusCode: number;
  message: string | string[];
  isError: true;
  data: null;
}
