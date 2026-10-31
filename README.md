This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## Arsitektur Data Fetching & BFF (Backend-For-Frontend)

### Diagram Alur Permintaan

```
[Browser / Client Components]
             │
             │ Same-Origin fetch (/api/...)
             ▼
   [Next.js Route Handlers / BFF]  <─── httpOnly Cookies (tk_access, tk_refresh)
             │
             │ Server-to-Server fetch (Authorization: Bearer <token>)
             ▼
     [NestJS Backend API] (http://localhost:8000/api)
```

1. **Keamanan Token**: Token (`access_token` & `refresh_token`) **TIDAK PERNAH** disimpan di `localStorage`/`sessionStorage` dan tidak boleh diakses oleh JavaScript di browser. Token hanya disimpan dalam cookie `httpOnly`, `sameSite: "lax"` yang dikelola secara eksklusif oleh Route Handler Next.js.
2. **Same-Origin Requests**: Browser hanya memanggil endpoint Next.js Route Handler pada origin yang sama (`/api/...`).
3. **Server-to-Server Fetching**: Server Next.js membaca cookie `httpOnly` dan meneruskan token ke backend NestJS via header `Authorization: Bearer`.
4. **State Management**: State data server di sisi client dikelola menggunakan `@tanstack/react-query` v5.

---

## Environment Variables

Salin `.env.example` ke `.env`:

```bash
$ cp .env.example .env
```

| Variabel | Keterangan |
|---|---|
| `API_BASE_URL` | URL dasar backend NestJS (server-only, default: `http://localhost:8000`). Jangan tambahkan `/api` atau prefix `NEXT_PUBLIC`. |
| `APP_ORIGIN` | Origin frontend (default: `http://localhost:3000`). Digunakan untuk validasi header `Origin` (Same-Origin). |

---

## Sinkronisasi Tipe OpenAPI (`api:types`)

Untuk meregenerasi tipe TypeScript otomatis dari spesifikasi OpenAPI backend:

```bash
# Pastikan backend berjalan pada http://localhost:8000
$ npm run api:types
```

Hasil kompilasi akan ditulis langsung ke file `src/lib/api/schema.d.ts`.

---

## Panduan Menambah Service Baru (`src/services/<domain>`)

Setiap modul/domain fitur baru mengikuti struktur konvensi berikut:

```
src/services/<domain>/
├── <domain>.types.ts    # Definisi tipe request/response & interface model
├── <domain>.schemas.ts  # Skema validasi Zod untuk validasi form & input
└── <domain>.api.ts      # Kumpulan fungsi fetcher client yang memanggil BFF via apiFetch()
```

Contoh implementasi:

```ts
// src/services/articles/articles.api.ts
import { apiFetch } from "@/lib/api/client";
import type { ApiEnvelope } from "@/lib/api/types";
import type { Article } from "./articles.types";

export const articlesApi = {
  getArticles: () => apiFetch<Article[]>("/proxy/articles"),
  getArticleById: (id: string) => apiFetch<Article>(`/proxy/articles/${id}`),
};
```
