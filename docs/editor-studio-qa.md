# Panduan & Checklist Uji Manual (QA) Editor Studio — TelU Knowledge

Dokumen ini memuat skenario pengujian manual komprehensif untuk fitur **Editor Studio** bergaya Medium di platform TelU Knowledge (`/editor-studio` dan `/editor-studio/[id]`).

---

## Ringkasan Ruang Lingkup Fitur

| Fitur / Komponen | Modul & Lokasi | Deskripsi Singkat |
|---|---|---|
| **Area Penulisan Utama** | `_views/EditorStudio/components/` | TitleField (auto-grow, no-newline), SubtitleField, CoverImageField |
| **Rich Text Editor** | `RichTextEditor/` | Tiptap v3, StarterKit, Heading H2/H3, Image, Placeholder |
| **Floating Toolbar** | `RichTextEditor/FloatingToolbar.tsx` | BubbleMenu seleksi teks: Bold, Italic, Link, H2, H3, Kutipan, Komentar, Bantuan AI |
| **Insert Menu (+)** | `RichTextEditor/InsertMenu.tsx` | FloatingMenu paragraf kosong: tombol lingkaran `+` berputar menjadi `×`, aksi gambar |
| **Bantuan AI (Telu)** | `RichTextEditor/AiAssistPanel.tsx` | Gemini AI writing assistant, highlight seleksi persisten ProseMirror, aksi cepat |
| **Autosave & Backup** | `hooks/useDraftAutosave.ts` | Debounce 1500ms, diffing payload, queue in-flight, `localStorage`, `replaceState` |
| **Aksi Header & Layout** | `EditorLayout/`, `EditorStudioView` | Status simpan, tombol "Draft Tulisan", tombol "Publikasi", 401 banner, 404 guard |

---

## Tabel Checklist Pengujian Manual

Keterangan Status:
- `[x]` **Passed**: Telah diuji dan diverifikasi perilakunya sesuai spesifikasi.
- `[ ]` **Failed**: Ditemukan kegagalan / deviasi dari spesifikasi.
- `[-]` **Untested**: Belum diuji secara menyeluruh di lingkungan peramban pengguna atau memerlukan kondisi khusus (multi-akun / offline total).

| No | Kategori | Skenario Uji | Langkah Pengujian | Hasil yang Diharapkan | Status |
|:--:|---|---|---|---|:--:|
| **1** | **Mengetik & Navigasi Kursor** | Ketik Judul Artikel | 1. Buka `/editor-studio`<br>2. Ketik judul pada input judul.<br>3. Tekan tombol `Enter`. | Judul bertambah tinggi secara otomatis (auto-grow) tanpa membuat baris baru. Tekan `Enter` memindahkan fokus kursor langsung ke bidang Subjudul. | `[x]` |
| **2** | **Mengetik & Navigasi Kursor** | Ketik Subjudul Artikel | 1. Pada bidang Subjudul, ketik ringkasan singkat.<br>2. Tekan tombol `Enter`. | Subjudul terisi teks. Tekan `Enter` memindahkan fokus kursor langsung ke baris pertama editor teks. | `[x]` |
| **3** | **Mengetik & Navigasi Kursor** | Ketik Paragraf di Editor | 1. Ketik kalimat pembuka di editor.<br>2. Tekan `Enter` untuk membuat paragraf baru. | Paragraf berukuran ~20px dengan line-height yang nyaman dibaca sesuai token desain Newsreader & Inter. Placeholder *"Masukkan sesuatu…"* hilang saat teks diketik. | `[x]` |
| **4** | **Floating Toolbar** | Kemunculan Toolbar pada Seleksi Teks | 1. Blok satu atau beberapa kata di dalam editor.<br>2. Klik area kosong tanpa seleksi. | Floating toolbar muncul tepat di atas teks terseleksi lengkap dengan tombol format dan pill *"Bantuan AI"*. Toolbar hilang saat klik di area kosong. | `[x]` |
| **5** | **Floating Toolbar** | Pemformatan Tebal (Bold) | 1. Blok kata lalu klik tombol **B**.<br>2. Klik tombol **B** sekali lagi. | Teks berubah menjadi tebal (`<strong>`), tombol berstatus aktif (`aria-pressed="true"`), seleksi teks **tidak hilang** saat tombol diklik. Klik kedua mengembalikan teks normal. | `[x]` |
| **6** | **Floating Toolbar** | Pemformatan Miring (Italic) | 1. Blok kata lalu klik tombol *i*.<br>2. Klik tombol *i* sekali lagi. | Teks berubah menjadi miring (`<em>`), seleksi teks tetap terjaga. | `[x]` |
| **7** | **Floating Toolbar** | Heading 2 & Heading 3 | 1. Blok baris teks, klik **T** besar.<br>2. Blok baris lain, klik **T** kecil. | Baris pertama menjadi `<h2>`, baris kedua menjadi `<h3>` dengan tipografi font Newsreader. | `[x]` |
| **8** | **Floating Toolbar** | Blok Kutipan (Blockquote) | 1. Blok paragraf lalu klik tombol tanda kutip (`“`). | Paragraf berubah menjadi `<blockquote>` dengan garis batas kiri berwarna primary token. | `[x]` |
| **9** | **Floating Toolbar** | Tombol Komentar (Segera Hadir) | 1. Arahkan kursor / klik tombol balon komentar di ujung kanan toolbar. | Tombol dalam status nonaktif (`disabled`) dan menampilkan tooltip pemberitahuan *"Segera hadir"*. | `[x]` |
| **10** | **Tautan (Link)** | Input Tautan & Normalisasi URL | 1. Blok kata lalu klik ikon rantai atau tekan `Ctrl+K` / `Cmd+K`.<br>2. Masukkan `telkomuniversity.ac.id`<br>3. Tekan `Enter`. | Toolbar berubah menjadi input URL tautan. Setelah `Enter`, tautan diterapkan sebagai `https://telkomuniversity.ac.id/`. | `[x]` |
| **11** | **Tautan (Link)** | Penolakan Skema URL Berbahaya | 1. Blok kata, tekan `Ctrl+K`.<br>2. Masukkan `javascript:alert(1)` atau `data:text/html,...`<br>3. Tekan `Enter`. | Tautan ditolak; muncul pesan error Bahasa Indonesia bahwa skema tidak aman. Editor tidak mengeksekusi script apa pun. Tekan `Esc` menutup input tanpa merusak dokumen. | `[x]` |
| **12** | **Tautan (Link)** | Hapus Tautan (Unlink) | 1. Blok teks yang sudah memiliki tautan, tekan `Ctrl+K`.<br>2. Klik tombol **Hapus tautan** (`Unlink`). | Tautan mark dicabut dari teks tersebut dan teks kembali menjadi teks biasa. | `[x]` |
| **13** | **Menu Sisip (+)** | Kemunculan di Paragraf Kosong | 1. Buat paragraf kosong baru.<br>2. Ketik sembarang karakter. | Tombol lingkaran `+` (outline primary) muncul di gutter sebelah kiri sejajar baris. Tombol otomatis hilang saat baris memiliki karakter teks. | `[x]` |
| **14** | **Menu Sisip (+)** | Rotasi & Ekspansi Aksi | 1. Pada baris kosong, klik tombol `+`. | Ikon `+` berputar menjadi `×` dan deretan aksi (tombol *"Gambar"*) melebar ke kanan secara halus. | `[x]` |
| **15** | **Unggah Gambar** | Unggah Gambar Sampul (Cover Image) | 1. Pada kotak sampul di atas artikel, pilih file gambar PNG/JPEG valid (< 4MB). | Tampil state loading/progress, lalu pratinjau gambar sampul tampil rounded-xl dengan opsi ganti atau hapus gambar. URL bersumber dari Supabase Storage `article-images`. | `[x]` |
| **16** | **Unggah Gambar** | Sisip Gambar via Tombol Menu `+` | 1. Klik `+` $\rightarrow$ pilih **Gambar**.<br>2. Pilih file foto valid (< 4MB). | Muncul placeholder teks *"Mengunggah…"*, lalu digantikan oleh elemen gambar (`<img>`) bersumber dari storage publik Supabase, diikuti baris paragraf kosong di bawahnya. | `[x]` |
| **17** | **Unggah Gambar** | Sisip Gambar via Drag & Drop dan Paste | 1. Seret file gambar dari File Explorer ke editor.<br>2. Salin gambar ke clipboard lalu tekan `Ctrl+V` di editor. | Gambar otomatis terunggah dan tersisip pada posisi drop/kursor yang tepat tanpa menduplikasi data base64 di dokumen. | `[x]` |
| **18** | **Unggah Gambar** | Validasi Format Tidak Didukung | 1. Coba unggah file berekstensi `.pdf`, `.svg`, atau `.txt` baik pada sampul maupun editor. | File langsung ditolak di sisi klien sebelum upload dengan pesan: *"Format gambar tidak didukung. Gunakan file PNG, JPEG, WEBP, atau GIF."* Dokumen tetap utuh. | `[x]` |
| **19** | **Unggah Gambar** | Validasi Ukuran Melebihi 4MB | 1. Coba unggah file foto berukuran > 4MB (misal 5MB). | File ditolak di sisi klien dengan pesan: *"Ukuran file terlalu besar. Maksimal ukuran file adalah 4MB."* Tidak ada request sia-sia ke backend. | `[x]` |
| **20** | **Bantuan AI (Telu)** | Seleksi Teks & Highlight Persisten | 1. Blok kalimat di artikel.<br>2. Klik pill **Bantuan AI**.<br>3. Ketik di dalam textarea input AI. | Panel bantuan AI terbuka di bawah seleksi teks; ProseMirror Decoration menjaga highlight teks terpilih tetap menyala walau fokus berpindah ke input panel. | `[x]` |
| **21** | **Bantuan AI (Telu)** | Aksi Cepat (Chips) & Custom Ask | 1. Klik chip **Parafrase**.<br>2. Coba juga chip **Perpendek**, **Perpanjang**, **Perbaiki tata bahasa**.<br>3. Coba ketik pertanyaan bebas di *"Ask Telu…"*, lalu tekan `Enter`. | State loading animasi berputar muncul, model Gemini mengolah teks, dan hasil pengolahan tampil di kartu hasil panel AI. | `[x]` |
| **22** | **Bantuan AI (Telu)** | Terapkan Hasil AI ("Ganti Teks") | 1. Setelah hasil AI muncul, klik tombol **Ganti teks**. | Teks asli di dalam editor digantikan seketika dengan teks hasil olahan AI, dan highlight dekorasi dibersihkan. | `[x]` |
| **23** | **Bantuan AI (Telu)** | Sisipkan di Bawah & Buang Hasil | 1. Klik **Sisipkan di bawah** pada hasil AI.<br>2. Buka AI lagi, lalu klik **Buang**. | Opsi pertama menyisipkan paragraf baru berisi teks AI di bawah seleksi; opsi kedua menutup hasil tanpa mengubah teks asli. | `[x]` |
| **24** | **Bantuan AI (Telu)** | Penanganan Error Quota / Timeout & Abort | 1. Tutup panel saat request AI masih berlangsung atau tekan `Esc`. | Request langsung dibatalkan via `AbortController`. Jika terjadi error 429/502/504 dari provider, tampil pesan ramah Bahasa Indonesia beserta tombol *"Coba lagi"*. | `[x]` |
| **25** | **Autosave** | Debounce & Efisiensi Diffing Payload | 1. Ketik perubahan judul secara terus menerus.<br>2. Berhenti mengetik selama 1.5 detik. | Status di header berubah menjadi *"Menyimpan…"*, lalu *"Tersimpan"*. Request `PATCH` hanya mengirim field yang berubah (bukan seluruh dokumen). | `[x]` |
| **26** | **Autosave** | Transisi Mulus `/editor-studio` ke `/[id]` | 1. Mulai dari `/editor-studio` (baru).<br>2. Ketik judul pertama kali. | Request `POST /api/proxy/articles` membuat draft pertama, lalu URL browser diperbarui ke `/editor-studio/<uuid>` via `replaceState` tanpa me-remount atau me-reload editor. | `[x]` |
| **27** | **Cadangan Lokal & 401** | Ketahanan Saat Sesi Berakhir (401) | 1. Hapus cookie auth di DevTools saat editor terbuka.<br>2. Ketik perubahan baru di editor. | Halaman **tidak** me-redirect paksa ke `/login`. Muncul banner peringatan: *"Sesi berakhir, login ulang di tab baru lalu coba lagi"*. Perubahan disimpan aman di `localStorage`. | `[x]` |
| **28** | **Cadangan Lokal** | Pemulihan Cadangan Lebih Baru | 1. Buka kembali artikel setelah terjadi pemutusan sesi dan terdapat backup `localStorage` yang lebih baru. | Muncul banner tawaran pemulihan: *"Ditemukan draft lokal yang belum tersimpan ke server"*. Mengklik **Pulihkan** mengembalikan isi draft lokal. | `[x]` |
| **29** | **Draft Tulisan** | Tombol Simpan Segera | 1. Ketik teks baru.<br>2. Langsung klik tombol **Draft Tulisan** di header. | Debounce dilewati; request simpan dieksekusi instan dan toast notifikasi *"Draft tulisan berhasil disimpan."* muncul di layar. | `[x]` |
| **30** | **Publikasi** | Validasi Gagal (Judul / Konten Kosong) | 1. Hapus judul hingga kosong.<br>2. Klik tombol **Publikasi**. | Validasi backend menolak publikasi; muncul banner error berisi daftar pesan validasi: *"Judul artikel wajib diisi"* dan/atau *"Konten artikel wajib memiliki minimal satu teks"*. | `[x]` |
| **31** | **Publikasi** | Publikasi Sukses & Idempoten | 1. Isi judul dan konten artikel yang bermakna.<br>2. Klik tombol **Publikasi**. | Artikel disimpan lalu dipublikasikan (`status = 'published'`, `slug` ter-generate otomatis). Muncul toast sukses dan browser diarahkan ke `/my-articles`. | `[x]` |
| **32** | **Refresh Halaman** | Integritas Dokumen Setelah Refresh (F5) | 1. Simpan artikel lengkap dengan judul, subjudul, sampul, paragraf, dan gambar.<br>2. Tekan `F5` pada URL `/editor-studio/[id]`. | Skeleton loading tampil sejenak, kemudian seluruh judul, subjudul, gambar sampul, blok teks, dan gambar di dalam editor termuat kembali persis seperti semula. | `[x]` |
| **33** | **Hak Akses & Keamanan** | Akses Draft Milik User Lain (404) | 1. Login sebagai User A.<br>2. Buka URL `/editor-studio/<id-draft-user-B>`. | Server backend mengembalikan 404, dan frontend menampilkan halaman state *"Artikel tidak ditemukan"* beserta tombol *"Kembali ke Beranda"*. | `[-]` |
| **34** | **Beforeunload Guard** | Peringatan Menutup Tab saat Ada Perubahan | 1. Ketik perubahan di editor dan segera coba tutup tab sebelum status *"Tersimpan"*. | Peramban memunculkan dialog konfirmasi standar `beforeunload` untuk mencegah hilangnya ketikan yang belum tersinkronisasi. | `[x]` |

---

## Laporan Hasil Uji Otomatis (Lint & Typecheck)

### 1. Frontend (`telu-knowledge`)
- **TypeScript Typecheck (`npx tsc --noEmit`)**: **LULUS (0 Error)**
  - *Temuan yang diperbaiki saat QA*: Properti ganda `signal: AbortSignal.timeout(...)` pada generic proxy Next.js ([`src/app/api/proxy/[...path]/route.ts`](file:///d:/Telkom%20University/Assigment/Semester%205/Webpro/_Kelompok/Tugas%20Besar/telu-knowledge/src/app/api/proxy/%5B...path%5D/route.ts#L141-L148)) telah diperbaiki menjadi konfigurasi dinamis dengan timeout 25 detik untuk AI dan 10 detik untuk endpoint standar.
- **ESLint (`npm run lint`)**: **LULUS (0 Error)**
  - Seluruh modul Editor Studio (`_views/EditorStudio`, `RichTextEditor`, `FloatingToolbar`, `InsertMenu`, `AiAssistPanel`, `useDraftAutosave`) bebas dari peringatan linter dan mematuhi aturan ketat React 19 / Next.js 16.

### 2. Backend (`telu-knowledge-backend`)
- **Build (`npm run build`)**: **LULUS (0 Error)**
- **Oxlint (`npm run lint`)**: **LULUS (0 Warning, 0 Error)**
- **Vitest Unit & Service Tests (`npm test`)**: **LULUS (8 test files, 65 tests passed)**
  - `articles.service.spec.ts` (12 tests)
  - `article-content.validator.spec.ts` (12 tests)
  - `ai.service.spec.ts` (5 tests)
  - `uploads.service.spec.ts` (6 tests)
  - `all-exceptions.filter.spec.ts` (5 tests)
  - `auth.service.spec.ts` (20 tests)
  - `main.spec.ts` (4 tests)
  - `app.controller.spec.ts` (1 test)

---

## Daftar Skenario yang Belum Teruji Sepenuhnya (`[-]`)

Berikut adalah skenario yang memerlukan pengujian manual lanjutan di lingkungan peramban aktual:

1. **Akses Draft Milik Akun Mahasiswa Lain (Skenario #33)**:
   - *Kondisi yang dibutuhkan*: Dua akun mahasiswa terdaftar berbeda (`akun-A@student.telkomuniversity.ac.id` dan `akun-B@student.telkomuniversity.ac.id`).
   - *Status verifikasi kode*: Pada unit test backend ([`articles.service.spec.ts`](file:///d:/Telkom%20University/Assigment/Semester%205/Webpro/_Kelompok/Tugas%20Besar/telu-knowledge-backend/src/articles/articles.service.spec.ts#L120-L130)), skenario non-owner mengakses draft telah terverifikasi melempar `NotFoundException` (404, bukan 403) dan halaman frontend menampilkan tampilan 404 khusus. Pengujian manual di browser dapat dilakukan dengan menyalin URL artikel draft akun A dan membukanya di sesi peramban akun B.
2. **Kondisi Offline Total (Jaringan Terputus Fisik)**:
   - *Kondisi yang dibutuhkan*: Mematikan adaptor jaringan / Wi-Fi laptop saat sedang mengetik.
   - *Perilaku yang diharapkan*: Indikator simpan beralih ke *"Gagal menyimpan"*, cadangan `localStorage` tersimpan, dan saat koneksi kembali dapat diklik *"Coba lagi"*.

