# Rencana Integrasi Frontend dan Backend API

Rencana ini bertujuan untuk menghubungkan antarmuka pengguna (React SPA) yang saat ini menggunakan data *dummy* statis dengan backend API Laravel untuk menampilkan dan mengirimkan data secara dinamis.

## Open Questions

- **Detail Berita (`/api/public/news/{slug}`)**: Saat ini *route* frontend menggunakan ID (`/news/:id`), sedangkan API menggunakan *slug*. Saya akan mengubah *routing* frontend agar menggunakan *slug* (`/news/:slug`) agar selaras dengan API dan lebih ramah SEO. Apakah disetujui?
- **Pemuatan Gambar**: Endpoint API mungkin mengembalikan URL relatif atau absolut untuk gambar. Apakah kita sudah menyiapkan mekanisme upload gambar (storage link), atau masih menggunakan URL bawaan dari seeder? (Saya akan menyesuaikan jika menggunakan `storage/`).

## Proposed Changes

### Komponen Publik

#### [MODIFY] [Home.jsx](file:///c:/Users/Della/Development/smartschool/resources/js/pages/public/Home.jsx)
- Menggunakan `useEffect` dan `axios` untuk memuat data profil sekolah (untuk teks pendaftaran/profil).
- Mengambil 4 berita terbaru dari endpoint `GET /api/public/news` dan menampilkannya di *grid*.

#### [MODIFY] [SchoolProfile.jsx](file:///c:/Users/Della/Development/smartschool/resources/js/pages/public/SchoolProfile.jsx)
- Mengambil data dari endpoint `GET /api/public/profile`.
- Menampilkan teks Sejarah, Visi, Misi yang diambil dari database (dari backend).

#### [MODIFY] [PublicNews.jsx](file:///c:/Users/Della/Development/smartschool/resources/js/pages/public/PublicNews.jsx)
- Mengambil daftar seluruh berita dari `GET /api/public/news`.
- Implementasi *loading state* dan mapping data ke dalam daftar kartu berita.
- Memperbarui tautan berita agar mengarah ke `/news/:slug`.

#### [MODIFY] [PublicNewsDetail.jsx](file:///c:/Users/Della/Development/smartschool/resources/js/pages/public/PublicNewsDetail.jsx)
- Mengambil data *slug* dari parameter URL (`useParams`).
- Memuat detail berita dari endpoint `GET /api/public/news/{slug}`.
- Menangani kondisi data tidak ditemukan (404).

#### [MODIFY] [PublicPPDB.jsx](file:///c:/Users/Della/Development/smartschool/resources/js/pages/public/PublicPPDB.jsx)
- Menangkap *value* dari seluruh form pendaftaran.
- Melakukan POST request ke `POST /api/public/ppdb`.
- Menampilkan nomor registrasi yang dikembalikan dari backend ke layar sukses.

### Komponen Admin

#### [MODIFY] [Login.jsx](file:///c:/Users/Della/Development/smartschool/resources/js/pages/admin/Login.jsx)
- Menangkap email dan password.
- Melakukan request ke `POST /api/auth/login`.
- Menyimpan *Bearer Token* di `localStorage`.
- *Redirect* ke `/admin` setelah berhasil masuk.
- Menampilkan pesan error jika otentikasi gagal.

#### [MODIFY] [router.jsx](file:///c:/Users/Della/Development/smartschool/resources/js/router.jsx)
- Mengubah rute berita detail dari `<Route path="/news/:id" ... />` menjadi `<Route path="/news/:slug" ... />`.

## Verification Plan

### Automated Tests
- Menjalankan `npm run build` untuk memastikan tidak ada kesalahan kompilasi pada komponen React yang diupdate.

### Manual Verification
- **Profil Sekolah**: Buka `/profile` dan pastikan data berasal dari database.
- **Berita**: Buka halaman Beranda dan `/news` untuk memastikan data berita dan tautan dinamis berfungsi dengan baik.
- **Form PPDB**: Lakukan pengisian form secara penuh dan periksa apakah data tersimpan di tabel `ppdb_registrations`.
- **Login Admin**: Masuk menggunakan akun admin untuk memastikan token JWT disimpan dan berhasil diarahkan ke dashboard admin.
