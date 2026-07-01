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

        // --- Menu Admin (Sidebar) ---
        Menu::create(['label' => 'Dashboard', 'url' => '/admin', 'icon' => 'dashboard', 'sort_order' => 1, 'type' => 'admin']);
        Menu::create(['label' => 'Manajemen PPDB', 'url' => '/admin/ppdb', 'icon' => 'how_to_reg', 'sort_order' => 2, 'type' => 'admin']);
        Menu::create(['label' => 'Master PPDB', 'url' => '/admin/master-ppdb', 'icon' => 'settings_accessibility', 'sort_order' => 3, 'type' => 'admin']);
        Menu::create(['label' => 'Struktur Organisasi', 'url' => '/admin/organization', 'icon' => 'school', 'sort_order' => 4, 'type' => 'admin']);
        Menu::create(['label' => 'Manajemen Berita', 'url' => '/admin/news', 'icon' => 'campaign', 'sort_order' => 5, 'type' => 'admin']);
        Menu::create(['label' => 'Kategori Berita', 'url' => '/admin/categories', 'icon' => 'category', 'sort_order' => 6, 'type' => 'admin']);
        Menu::create(['label' => 'Tag Berita', 'url' => '/admin/tags', 'icon' => 'tag', 'sort_order' => 7, 'type' => 'admin']);
        Menu::create(['label' => 'Halaman Dinamis', 'url' => '/admin/pages', 'icon' => 'article', 'sort_order' => 8, 'type' => 'admin']);
        Menu::create(['label' => 'Manajemen Menu', 'url' => '/admin/menus', 'icon' => 'menu', 'sort_order' => 9, 'type' => 'admin']);
        Menu::create(['label' => 'Role Matrix', 'url' => '/admin/rbac', 'icon' => 'admin_panel_settings', 'sort_order' => 10, 'type' => 'admin']);
        Menu::create(['label' => 'Profil Sekolah', 'url' => '/admin/profile', 'icon' => 'settings', 'sort_order' => 11, 'type' => 'admin']);
    }
}
