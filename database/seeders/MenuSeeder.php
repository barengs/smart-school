<?php

namespace Database\Seeders;

use App\Models\Menu;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        Menu::truncate();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        // --- Menu Publik (Front) ---
        Menu::create(['label' => 'Beranda', 'url' => '/', 'icon' => null, 'sort_order' => 1, 'type' => 'front']);
        Menu::create(['label' => 'Profil Sekolah', 'url' => '/profile', 'icon' => null, 'sort_order' => 2, 'type' => 'front']);
        Menu::create(['label' => 'Info PPDB', 'url' => '/info-ppdb', 'icon' => null, 'sort_order' => 3, 'type' => 'front']);
        Menu::create(['label' => 'Formulir Pendaftaran', 'url' => '/form-ppdb', 'icon' => null, 'sort_order' => 4, 'type' => 'front']);
        Menu::create(['label' => 'Berita', 'url' => '/news', 'icon' => null, 'sort_order' => 5, 'type' => 'front']);
        Menu::create(['label' => 'Kontak', 'url' => '/contact', 'icon' => null, 'sort_order' => 6, 'type' => 'front']);

        // --- Menu Admin (Sidebar) ---
        Menu::create(['label' => 'Dashboard', 'url' => '/admin', 'icon' => 'dashboard', 'sort_order' => 1, 'type' => 'admin']);

        // DATA MASTER (Parent)
        $master = Menu::create(['label' => 'Data Master', 'url' => '#', 'icon' => 'folder_shared', 'sort_order' => 2, 'type' => 'admin', 'module' => 'AKADEMIK']);
        Menu::create(['label' => 'Data Guru & Staff', 'url' => '/admin/teachers', 'icon' => 'badge', 'sort_order' => 1, 'type' => 'admin', 'parent_id' => $master->id, 'module' => 'AKADEMIK']);
        Menu::create(['label' => 'Data Siswa', 'url' => '/admin/students', 'icon' => 'face', 'sort_order' => 2, 'type' => 'admin', 'parent_id' => $master->id, 'module' => 'AKADEMIK']);
        Menu::create(['label' => 'Data Kelas', 'url' => '/admin/classrooms', 'icon' => 'meeting_room', 'sort_order' => 3, 'type' => 'admin', 'parent_id' => $master->id, 'module' => 'AKADEMIK']);

        // AKADEMIK (Parent)
        $akademik = Menu::create(['label' => 'Akademik', 'url' => '#', 'icon' => 'school', 'sort_order' => 3, 'type' => 'admin', 'module' => 'AKADEMIK']);
        Menu::create(['label' => 'Jadwal Pelajaran', 'url' => '/admin/schedules', 'icon' => 'event', 'sort_order' => 1, 'type' => 'admin', 'parent_id' => $akademik->id, 'module' => 'AKADEMIK']);
        Menu::create(['label' => 'Kehadiran', 'url' => '/admin/attendance', 'icon' => 'how_to_reg', 'sort_order' => 2, 'type' => 'admin', 'parent_id' => $akademik->id, 'module' => 'AKADEMIK']);
        Menu::create(['label' => 'Mata Pelajaran', 'url' => '/admin/subjects', 'icon' => 'menu_book', 'sort_order' => 3, 'type' => 'admin', 'parent_id' => $akademik->id, 'module' => 'AKADEMIK']);
        Menu::create(['label' => 'Jam Pelajaran', 'url' => '/admin/lesson-hours', 'icon' => 'schedule', 'sort_order' => 4, 'type' => 'admin', 'parent_id' => $akademik->id, 'module' => 'AKADEMIK']);
        Menu::create(['label' => 'Kalender Akademik', 'url' => '/admin/academic-calendar', 'icon' => 'calendar_month', 'sort_order' => 5, 'type' => 'admin', 'parent_id' => $akademik->id, 'module' => 'AKADEMIK']);
        Menu::create(['label' => 'Tahun Ajaran', 'url' => '/admin/academic-years', 'icon' => 'date_range', 'sort_order' => 6, 'type' => 'admin', 'parent_id' => $akademik->id, 'module' => 'AKADEMIK']);

        // PPDB (Parent)
        $ppdb = Menu::create(['label' => 'PPDB', 'url' => '#', 'icon' => 'group_add', 'sort_order' => 4, 'type' => 'admin', 'module' => 'PPDB']);
        Menu::create(['label' => 'Pendaftar Baru', 'url' => '/admin/ppdb', 'icon' => 'recent_actors', 'sort_order' => 1, 'type' => 'admin', 'parent_id' => $ppdb->id, 'module' => 'PPDB']);
        Menu::create(['label' => 'Gelombang (Batch)', 'url' => '/admin/ppdb/batches', 'icon' => 'layers', 'sort_order' => 2, 'type' => 'admin', 'parent_id' => $ppdb->id, 'module' => 'PPDB']);
        Menu::create(['label' => 'Jalur Pendaftaran', 'url' => '/admin/master-ppdb/paths', 'icon' => 'route', 'sort_order' => 3, 'type' => 'admin', 'parent_id' => $ppdb->id, 'module' => 'PPDB']);
        Menu::create(['label' => 'Syarat Dokumen', 'url' => '/admin/master-ppdb/docs', 'icon' => 'inventory_2', 'sort_order' => 4, 'type' => 'admin', 'parent_id' => $ppdb->id, 'module' => 'PPDB']);

        // CBT
        $cbt = Menu::create(['label' => 'Ujian (CBT)', 'url' => '#', 'icon' => 'computer', 'sort_order' => 5, 'type' => 'admin', 'module' => 'CBT']);
        Menu::create(['label' => 'Master Ujian', 'url' => '/admin/cbt/exams', 'icon' => 'quiz', 'sort_order' => 1, 'type' => 'admin', 'parent_id' => $cbt->id, 'module' => 'CBT']);

        // BERITA & INFORMASI (Parent)
        $berita = Menu::create(['label' => 'Berita & Info', 'url' => '#', 'icon' => 'campaign', 'sort_order' => 6, 'type' => 'admin', 'module' => 'BERITA']);
        Menu::create(['label' => 'Manajemen Berita', 'url' => '/admin/news', 'icon' => 'article', 'sort_order' => 1, 'type' => 'admin', 'parent_id' => $berita->id, 'module' => 'BERITA']);
        Menu::create(['label' => 'Kategori Berita', 'url' => '/admin/categories', 'icon' => 'category', 'sort_order' => 2, 'type' => 'admin', 'parent_id' => $berita->id, 'module' => 'BERITA']);
        Menu::create(['label' => 'Tag Berita', 'url' => '/admin/tags', 'icon' => 'tag', 'sort_order' => 3, 'type' => 'admin', 'parent_id' => $berita->id, 'module' => 'BERITA']);

        // HALAMAN DINAMIS
        Menu::create(['label' => 'Halaman Dinamis', 'url' => '/admin/pages', 'icon' => 'web', 'sort_order' => 6, 'type' => 'admin']);

        // KONTAK & LAYANAN PUBLIK
        Menu::create(['label' => 'Pesan Kontak', 'url' => '/admin/contacts', 'icon' => 'mail', 'sort_order' => 7, 'type' => 'admin']);

        // PENGATURAN & MASTER DATA (Parent)
        $pengaturan = Menu::create(['label' => 'Pengaturan', 'url' => '#', 'icon' => 'settings', 'sort_order' => 8, 'type' => 'admin']);
        Menu::create(['label' => 'Profil Sekolah', 'url' => '/admin/profile', 'icon' => 'account_balance', 'sort_order' => 1, 'type' => 'admin', 'parent_id' => $pengaturan->id]);
        Menu::create(['label' => 'Struktur Organisasi', 'url' => '/admin/organization', 'icon' => 'account_tree', 'sort_order' => 2, 'type' => 'admin', 'parent_id' => $pengaturan->id]);
        Menu::create(['label' => 'Manajemen Menu', 'url' => '/admin/menus', 'icon' => 'menu_open', 'sort_order' => 3, 'type' => 'admin', 'parent_id' => $pengaturan->id]);
        Menu::create(['label' => 'Role Matrix', 'url' => '/admin/rbac', 'icon' => 'admin_panel_settings', 'sort_order' => 4, 'type' => 'admin', 'parent_id' => $pengaturan->id]);
        
        // System / Developer Menus
        Menu::create(['label' => 'Daftar Modul', 'url' => '/admin/modules', 'icon' => 'extension', 'sort_order' => 5, 'type' => 'admin', 'parent_id' => $pengaturan->id]);
        Menu::create(['label' => 'Paket Layanan', 'url' => '/admin/services', 'icon' => 'package', 'sort_order' => 6, 'type' => 'admin', 'parent_id' => $pengaturan->id]);
    }
}
