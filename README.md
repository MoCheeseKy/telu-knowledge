# Tel-U Knowledge - Frontend

Aplikasi frontend portal pengetahuan Telkom University berbasis Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui, dan TanStack Query v5.

---

## Memulai Pengembangan (Getting Started)

Jalankan development server:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

---

## Arsitektur Data Fetching & BFF (Backend-For-Frontend)

### Diagram Alur Permintaan

```
[Browser / Client Components]
             │
             │ Same-Origin fetch (/api/...)
             ▼
   [Next.js Route Handlers / BFF]  <─── httpOnly Cookies (tk_access, tk_refresh, tk_remember)
             │
             │ Server-to-Server fetch (Authorization: Bearer <token>)
             ▼
     [NestJS Backend API] (http://localhost:8000/api)
```

1. **Keamanan Token**: Token (`access_token` & `refresh_token`) **TIDAK PERNAH** disimpan di `localStorage`/`sessionStorage` dan tidak boleh diakses oleh JavaScript di browser. Token hanya disimpan dalam cookie `httpOnly`, `sameSite: "lax"`, `secure` (pada production) yang dikelola secara eksklusif oleh Route Handler Next.js.
2. **Same-Origin Requests**: Browser hanya memanggil endpoint Next.js Route Handler pada origin yang sama (`/api/...`).
3. **Server-to-Server Fetching**: Server Next.js membaca cookie `httpOnly` dan meneruskan token ke backend NestJS via header `Authorization: Bearer`.
4. **State Management**: State data server di sisi client dikelola menggunakan `@tanstack/react-query` v5.

---

## Alur Otentikasi Lengkap (Authentication Flow)

### 1. Registrasi Akun Baru
- Pengguna mengisi form di `/register` dengan email mahasiswa `@student.telkomuniversity.ac.id`.
- Permintaan dikirim ke BFF `POST /api/auth/register` -> Backend NestJS `POST /api/auth/register`.
- Backend mengembalikan status 201 `{ user: { ... } }` tanpa token (karena email wajib diverifikasi terlebih dahulu).
- Tampilan beralih ke state "Cek Email Anda" dengan opsi kirim ulang email verifikasi (cooldown 60 detik).

### 2. Verifikasi Email (`/auth/callback`)
- Pengguna menerima tautan verifikasi dari Supabase Auth (`AUTH_EMAIL_REDIRECT_URL`).
- Browser membuka `/auth/callback#access_token=...&type=signup` (atau `#error=...`).
- Komponen client di `/auth/callback` membaca hash URL di `useEffect`, segera membersihkan hash dari riwayat browser menggunakan `history.replaceState` untuk mencegah kebocoran token.
- Jika terdapat error pada hash (misal tautan kedaluwarsa): ditampilkan state error dengan form kirim ulang verifikasi.
- Jika verifikasi berhasil: ditampilkan notifikasi sukses dan tombol untuk mengarahkan pengguna ke halaman `/login`.

### 3. Login & Sesi
- Pengguna memasukkan email dan password di `/login`.
- BFF `POST /api/auth/login` memvalidasi kredensial ke backend.
- Pada respons 200, BFF mengatur cookie `httpOnly`:
  - `tk_access`: token akses JWT pendek.
  - `tk_refresh`: refresh token Supabase (berumur panjang jika rememberMe aktif, atau session cookie jika tidak).
  - `tk_remember`: flag boolean penanda status persistensi sesi.
- State login di TanStack Query di-cache pada query key `authKeys.me`.
- Pengguna diarahkan ke tujuan yang aman via `safeNextPath(next, "/home")`.

### 4. Refresh Token Otomatis & Penanganan 401
- Panggilan API browser melalui `apiFetch` secara otomatis menangani error 401 dengan memanggil `POST /api/auth/refresh` satu kali secara terkoordinasi (anti-race condition / token refresh lock).
- Jika refresh berhasil, cookie `tk_access` diperbarui secara transparan dan request awal dicoba ulang (*replay*).
- Jika token telah dicabut atau refresh gagal: pengguna diarahkan ke `/api/auth/session-expired`, semua cookie otentikasi dibersihkan, dan browser dialihkan ke `/login?next=...`.

### 5. Logout
- Pengguna menekan tombol "Keluar" di header atau sidebar.
- BFF memanggil `POST /api/auth/logout`, menghapus cookie `tk_access`, `tk_refresh`, dan `tk_remember`.
- TanStack Query cache dibersihkan (`queryClient.clear()`).
- Browser dialihkan ke `/login` dan melakukan `router.refresh()`.

### 6. Lupa Kata Sandi & Reset Password (`/forgot-password` & `/reset-password`)
- Pengguna memasukkan email di `/forgot-password`. BFF memanggil `POST /api/auth/forgot-password`.
- Tautan pemulihan dikirimkan Supabase ke inbox pengguna (`AUTH_RESET_REDIRECT_URL`).
- Pengguna membuka tautan `/reset-password#access_token=...&type=recovery`.
- Komponen client mengekstrak token ke memori React (`tokenRef`), segera menghapus hash dari URL, dan menampilkan form kata sandi baru.
- Submit form memanggil BFF `POST /api/auth/reset-password` dengan `{ password, token }`.
- Setelah 200 sukses, token di memori dibuang dan pengguna diarahkan untuk masuk kembali.

---

## Environment Variables & Deployment Checklist

Salin `.env.example` ke `.env`:

```bash
cp .env.example .env
```

| Variabel | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `API_BASE_URL` | String | Ya | URL dasar backend NestJS (server-only, default: `http://localhost:8000`). Jangan tambahkan `/api` atau prefix `NEXT_PUBLIC`. |
| `APP_ORIGIN` | String | Ya | Origin publik frontend (default: `http://localhost:3000`). Digunakan untuk validasi header `Origin` (Same-Origin CSRF protection) dan basis URL redirect. |
| `TRUSTED_IP_HEADER` | String | Opsional | Header IP khusus dari reverse proxy tepercaya (misal `cf-connecting-ip`, `x-vercel-forwarded-for`, `x-real-ip`). Jika diisi, IP klien diambil HANYA dari header ini. |
| `TRUSTED_PROXY_HOPS` | Number | Opsional | Jumlah hop proxy tepercaya pada `X-Forwarded-For` (dihitung dari kanan, default: `0`). Digunakan hanya jika `TRUSTED_IP_HEADER` kosong. |

### Checklist Deployment Produksi
- [ ] **Kesesuaian `APP_ORIGIN`**: Pastikan `APP_ORIGIN` sama persis dengan origin domain publik produksi (misal `https://knowledge.telkomuniversity.ac.id`), termasuk protokol `https://`.
- [ ] **Cookie Secure**: Pada environment `NODE_ENV=production`, seluruh cookie auth (`tk_access`, `tk_refresh`, `tk_remember`) otomatis menggunakan flag `secure: true`. Pastikan HTTPS aktif secara menyeluruh.
- [ ] **Konfigurasi Proxy & IP Spoofing Prevention**:
  - Jika menggunakan Cloudflare: set `TRUSTED_IP_HEADER=cf-connecting-ip`.
  - Jika menggunakan Vercel: set `TRUSTED_IP_HEADER=x-vercel-forwarded-for`.
  - Jika menggunakan Nginx internal: set `TRUSTED_IP_HEADER=x-real-ip` atau set `TRUSTED_PROXY_HOPS=1`.
  - **Penting**: Konfigurasi proxy frontend harus selaras dengan pengaturan `trust proxy` pada backend NestJS agar bucket rate-limit per-IP berjalan konsisten.

---

## Checklist Pengaturan Supabase Manual

Sebelum menjalankan sistem otentikasi di lingkungan pengembangan maupun produksi, pastikan pengaturan berikut telah dikonfigurasi di dashboard Supabase:

1. **Aktifkan Konfirmasi Email**:
   - Buka menu **Authentication** -> **Providers** -> **Email**.
   - Pastikan opsi **"Confirm email"** aktif (*enabled*).
2. **Daftarkan Allow-List Redirect URL**:
   - Buka menu **Authentication** -> **URL Configuration**.
   - Atur **Site URL** ke origin frontend Anda (misal `http://localhost:3000` atau URL produksi).
   - Di bagian **Redirect URLs**, tambahkan:
     - `http://localhost:3000/auth/callback`
     - `http://localhost:3000/reset-password`
     - Domain produksi terkait: `https://<domain-produksi>/auth/callback` dan `https://<domain-produksi>/reset-password`.
3. **Konfigurasi Custom SMTP Server**:
   - Supabase project default memiliki kuota pengiriman email bawaan yang sangat rendah (sekitar 3-4 email per jam).
   - Buka menu **Authentication** -> **SMTP Settings**, aktifkan Custom SMTP dan hubungkan penyedia SMTP Anda (seperti Resend, Sendgrid, Mailgun, atau SMTP Telkom University).

---

## Panduan Menambah Hook Query & Mutasi Baru (`src/services/<domain>`)

Setiap modul fitur mengikuti struktur konvensi berikut:

```
src/services/<domain>/
├── <domain>.types.ts    # Interface model data & payload DTO
├── <domain>.schemas.ts  # Skema validasi Zod untuk validasi form & input
├── <domain>.api.ts      # Kumpulan fungsi fetcher client yang memanggil BFF via apiFetch()
└── <domain>.queries.ts  # TanStack Query custom hooks (useQuery & useMutation)
```

### Langkah Menambahkan Hook Baru pada `<domain>.queries.ts`:

1. **Definisikan Query Keys Factory**:
   ```ts
   // src/services/articles/articles.queries.ts
   export const articleKeys = {
     all: ["articles"] as const,
     lists: () => [...articleKeys.all, "list"] as const,
     list: (filters: string) => [...articleKeys.lists(), { filters }] as const,
     details: () => [...articleKeys.all, "detail"] as const,
     detail: (id: string) => [...articleKeys.details(), id] as const,
   };
   ```

2. **Buat Hook `useQuery`**:
   ```ts
   import { useQuery } from "@tanstack/react-query";
   import { articlesApi } from "./articles.api";

   export function useArticles(filters: string = "") {
     return useQuery({
       queryKey: articleKeys.list(filters),
       queryFn: () => articlesApi.getArticles(filters),
       staleTime: 60 * 1000, // 1 menit
     });
   }
   ```

3. **Buat Hook `useMutation` dengan Invalidation**:
   ```ts
   import { useMutation, useQueryClient } from "@tanstack/react-query";

   export function useCreateArticle() {
     const queryClient = useQueryClient();

     return useMutation({
       mutationFn: (payload: CreateArticlePayload) => articlesApi.createArticle(payload),
       onSuccess: () => {
         // Invalidate list artikel agar data terbaru langsung terambil
         queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
       },
     });
   }
   ```
