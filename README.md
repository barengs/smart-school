# Sistem Informasi Sekolah (SIS) - SmartSchool

Proyek ini adalah Sistem Informasi Sekolah (SIS) berbasis **Hybrid Monolith** menggunakan **Laravel** sebagai backend API dan **React** sebagai frontend SPA.

## Fitur Utama

Sistem ini terdiri dari dua modul utama:

### A. Modul Publik (Front-End)
- **Beranda**: Menampilkan berita terbaru, sekilas info, tautan penting, dan profil singkat.
- **Profil Sekolah**: Menampilkan profil detail (visi, misi, sejarah, identitas lengkap) dan struktur organisasi.
- **Berita/Artikel**: Halaman dinamis untuk menampilkan daftar berita dan detail berita.
- **Halaman PPDB**: Informasi alur pendaftaran, persyaratan, dan form pendaftaran online sederhana.

### B. Modul Admin (Back-End / CMS)
- **Dashboard Admin**: Ringkasan statistik (jumlah pendaftar PPDB, jumlah berita, dll).
- **Manajemen Profil Sekolah**:
  - Pengaturan Identitas (Nama sekolah, NPSN, Alamat, Kontak, Logo, Favicon).
  - Pengaturan Visi & Misi.
  - Pengaturan Sejarah Sekolah.
- **Manajemen Berita (CMS)**:
  - Buat, edit, hapus, dan publikasi berita/artikel dengan fitur *Approval* oleh Editor Utama.
  - Kategori dan Tag berita.
  - Manajemen media (gambar/dokumen lampiran).
- **Manajemen Struktur Organisasi**: Menambah, mengedit, dan mengatur hierarki staf/guru.
- **Manajemen PPDB**:
  - Melihat daftar pendaftar.
  - Verifikasi data pendaftar.
  - Ubah status pendaftaran (Diterima, Ditolak, Proses).
- **Manajemen Role & User (RBAC - Matrix Role Menu)**:
  - Menu di sidebar panel admin menyesuaikan secara dinamis berdasarkan matriks hak akses pengguna (Create, Read, Update, Delete, Approval).

## Teknologi (Tech Stack)

- **Backend**: Laravel
- **Frontend**: React.js + react-router-dom
- **Autentikasi**: JWT (php-open-source-saver/jwt-auth)
- **Otorisasi**: spatie/laravel-permission (dikustomisasi untuk Matrix Menu)
- **Database**: MySQL
- **Styling**: Tailwind CSS
- **Bundler**: Vite

## Cara Menjalankan Proyek di Lokal

Ikuti langkah-langkah berikut untuk menjalankan proyek di komputer lokal:

### 1. Kloning Proyek
Pastikan Anda sudah berada di dalam folder proyek. Jika belum:
```bash
git clone <url-repo>
cd smartschool
```

### 2. Instalasi Dependensi Backend (PHP)
```bash
composer install
```

### 3. Konfigurasi Environment
Salin file `.env.example` menjadi `.env`.
```bash
cp .env.example .env
```
Sesuaikan konfigurasi database di file `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=smartschool
DB_USERNAME=root
DB_PASSWORD=
```

Generate application key dan JWT secret:
```bash
php artisan key:generate
php artisan jwt:secret
```

### 4. Migrasi & Seeder Database
Jalankan migrasi untuk membuat tabel beserta data awal (seeder):
```bash
php artisan migrate:fresh --seed
```

### 5. Instalasi Dependensi Frontend (Node.js)
```bash
npm install
```

### 6. Jalankan Server
Buka dua terminal terpisah.

**Terminal 1 (Backend Laravel):**
```bash
php artisan serve
```
Aplikasi backend berjalan di `http://localhost:8000`.

**Terminal 2 (Frontend Vite):**
```bash
npm run dev
```
Aset frontend akan dikompilasi secara dinamis oleh Vite.

Akses aplikasi di browser melalui URL: `http://localhost:8000`.
