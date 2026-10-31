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
| `TRUSTED_IP_HEADER` | (Opsional) Header khusus reverse proxy tepercaya (misal `cf-connecting-ip`, `x-real-ip`). Jika diisi, IP klien diambil HANYA dari header ini. |
| `TRUSTED_PROXY_HOPS` | (Opsional, integer, default: `0`) Jumlah hop proxy tepercaya pada `X-Forwarded-For` (dihitung dari kanan). Digunakan jika `TRUSTED_IP_HEADER` kosong. |

### Panduan Deployment & Konfigurasi Proxy / IP Klien

Secara *default* (tanpa konfigurasi), Next.js BFF tidak meneruskan header IP apa pun dari request klien ke backend NestJS guna mencegah pemalsuan IP (*IP spoofing*) dan manipulasi rate-limit.

Saat melakukan deployment di balik reverse proxy atau hosting provider:
1. **Cloudflare**: Atur `TRUSTED_IP_HEADER=cf-connecting-ip`.
2. **Vercel**: Atur `TRUSTED_IP_HEADER=x-vercel-forwarded-for`.
3. **Nginx / Reverse Proxy**: Jika Nginx mengatur `X-Real-IP`, atur `TRUSTED_IP_HEADER=x-real-ip`. Jika Nginx menambahkan hop pada `X-Forwarded-For`, atur `TRUSTED_PROXY_HOPS=1`.
4. **Penting (Sinkronisasi dengan Backend)**: Konfigurasi proxy tepercaya pada frontend harus selaras dengan pengaturan `trust proxy` pada backend NestJS agar resolusi IP dan *throttling* konsisten.

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
