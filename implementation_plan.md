# Sistem Informasi Sekolah (SIS) - Rencana Implementasi & Daftar Tugas

Dokumen ini menguraikan rencana implementasi langkah demi langkah untuk Sistem Informasi Sekolah berdasarkan blueprint.

## Catatan Penting
- **Database**: MySQL.
- **JWT**: `php-open-source-saver/jwt-auth`.
- **Seeder**: Dibuat terpisah berdasarkan modul. Seeder CMS akan menggunakan data yang tampak senormal/se-original mungkin.

## Daftar Tugas

### 1. Setup Proyek & Dependensi
- [ ] Instal Dependensi Frontend: `react`, `react-dom`, `react-router-dom`, `@vitejs/plugin-react`, `axios`, `tailwindcss`, `postcss`, `autoprefixer`.
- [ ] Instal Dependensi Backend: `php-open-source-saver/jwt-auth`, `spatie/laravel-permission`.
- [ ] Konfigurasi Vite untuk React dan TailwindCSS.
- [ ] Publish dan konfigurasi JWT serta Spatie Permission.

### 2. Migrasi Database, Model & Seeder
- [ ] **Spatie Overrides**: Tambahkan `menu_id` ke tabel `permissions` untuk Matrix Role Menu.
- [ ] **Menus**: Migrasi, Model, dan Seeder untuk struktur menu dinamis admin.
- [ ] **RBAC**: Seeder Role & Permission (Super Admin, Editor, Reviewer PPDB).
- [ ] **Users**: Seeder akun Super Admin dan beberapa akun dummy.
- [ ] **School Profiles**: Migrasi, Model, dan Seeder (tabel baris tunggal) dengan data sekolah normal.
- [ ] **CMS (Categories & News)**: Migrasi, Model, dan Seeder artikel realistik (bukan sekadar lorem ipsum).
- [ ] **Organization Structures**: Migrasi, Model, dan Seeder struktur guru/staf.
- [ ] **PPDB Registrations**: Migrasi, Model, dan Seeder data pendaftar simulasi.

### 3. Pengembangan API Backend (Laravel)
- [ ] **Autentikasi**: JWT Auth Controller (Login, Logout, Me).
- [ ] **Menu & Akses Dinamis**: Middleware pemeriksaan hak akses Matrix; endpoint untuk mengambil menu dinamis.
- [ ] **API Controllers**:
  - [ ] `ProfileController`
  - [ ] `NewsController`
  - [ ] `PPDBController`
  - [ ] `RolePermissionController`
- [ ] **Routes**: Konfigurasi `routes/api.php` dengan `auth:api` dan middleware matrix.

### 4. Pengembangan Frontend SPA (React)
- [ ] **Setup React**: Mount di `welcome.blade.php`.
- [ ] **Axios Interceptor**: Konfigurasi header Bearer JWT otomatis.
- [ ] **Router & Layout**:
  - [ ] Rute Publik (Home, Profil, Berita, PPDB).
  - [ ] Rute Admin (Login, Dashboard, Manajemen Modul) dengan Sidebar Dinamis.
- [ ] **UI Publik**:
  - [ ] Beranda
  - [ ] Profil Sekolah
  - [ ] Berita (Daftar & Detail)
  - [ ] Form PPDB
- [ ] **UI Admin (CMS)**:
  - [ ] Halaman Login
  - [ ] Form Profil Sekolah
  - [ ] Manajemen Berita (CRUD + Approve)
  - [ ] Manajemen PPDB (Verifikasi)
  - [ ] Manajemen Role, User & Matrix Menu

### 5. Penyelesaian
- [ ] Pengujian manual alur autentikasi dan matrix akses.
- [ ] Pengujian alur publikasi berita dan registrasi PPDB.
