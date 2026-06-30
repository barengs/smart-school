# Walkthrough Pembangunan Sistem Informasi Sekolah (SIS)

## Tahap 1 & 2: Inisialisasi & Database
- Setup Laravel 11 & React Vite TailwindCSS.
- Migrasi tabel `menus`, `school_profiles`, `categories`, `news`, `organization_structures`, dan `ppdb_registrations`.
- Modifikasi Spatie Permission untuk mendukung `menu_id` pada Matrix Role dinamis.
- Seeder data simulasi untuk semua entitas (menggunakan metode `firstOrCreate` agar aman dari error duplikasi saat dijalankan ulang).

## Tahap 3: API Backend
- Implementasi Autentikasi JWT Auth (`AuthController`).
- Pembuatan Middleware Matrix Role (`MatrixPermissionMiddleware`) untuk memverifikasi hak akses pada setiap route berdasarkan menu dan metode request.
- Pembuatan API Controllers (`ProfileController`, `NewsController`, `PPDBController`, `RolePermissionController`).
- Registrasi Endpoint pada `routes/api.php`.

## Tahap 4: Frontend SPA (React)
- Integrasi `React` dengan Vite dan setup entry point pada `welcome.blade.php`.
- Konfigurasi `app.jsx` dengan Axios interceptor untuk Bearer Token JWT.
- Konfigurasi React Router DOM dan Layout Publik & Admin.
- Pembuatan UI Publik berdasarkan referensi desain yang diberikan:
  - **Home (Beranda)**: Desain Hero Image besar, Quick Links (Info PPDB, Kalender, Profil), Section "Tentang Kami", dan Grid Berita Terbaru.
  - **Public News**: Tata letak baca berita lengkap dengan sidebar kategori dan berita populer.
  - **Form PPDB**: UI interaktif pendaftaran online dengan indikator Multi-step (Data Pribadi, Data Orang Tua, Selesai).
- Pembuatan UI Admin berdasarkan referensi desain:
  - **Admin Layout**: Sidebar dengan menu navigasi, header atas dengan notifikasi dan profil, area konten dinamis.
  - **Halaman Login**: Formulir otentikasi login admin yang simpel dengan logo Academia SIS.
  - **Dashboard**: Kartu metrik statistik (Total Pendaftar, Berita, Pengguna, Peran), Mockup Bar Chart, dan Feed Aktivitas Terbaru.
  - **Manajemen Berita**: Tabel interaktif dengan filter, search, label status (Published, Pending, Draft), avatar inisial penulis, dan action buttons.
  - **Role Matrix (Konfigurasi Hak Akses)**: UI tabel Matrix (Modul vs CRUD Approval) lengkap dengan Checkbox dan Select option untuk Role (misalnya: PPDB Reviewer, Editor Berita, Super Admin).
- Eksekusi `npm run build` sukses untuk menghasilkan bundel aset production.

Seluruh fase pengembangan utama dari blueprint Sistem Informasi Sekolah (Academia SIS) sudah direalisasikan dan diverifikasi kompilasinya.
