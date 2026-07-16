<?php
// migrate_menus.php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Menu;

// Group 1: Berita
$berita = Menu::firstOrCreate(
    ['type' => 'admin', 'label' => 'Berita', 'url' => '#'],
    ['icon' => 'campaign', 'sort_order' => 10]
);
Menu::where('url', '/admin/news')->update(['parent_id' => $berita->id, 'sort_order' => 1]);
Menu::where('url', '/admin/categories')->update(['parent_id' => $berita->id, 'sort_order' => 2]);
Menu::where('url', '/admin/tags')->update(['parent_id' => $berita->id, 'sort_order' => 3]);

// Group 2: Master Data
$master = Menu::firstOrCreate(
    ['type' => 'admin', 'label' => 'Master Data', 'url' => '#'],
    ['icon' => 'database', 'sort_order' => 20]
);
Menu::where('url', '/admin/master-academic')->update(['parent_id' => $master->id, 'sort_order' => 1]);
// We don't have existing menus for batches, paths, docs yet in DB! 
// Let's create them!
Menu::firstOrCreate(
    ['type' => 'admin', 'label' => 'Master Akademik', 'url' => '/admin/master-academic'],
    ['icon' => 'school', 'parent_id' => $master->id, 'sort_order' => 1]
);
Menu::firstOrCreate(
    ['type' => 'admin', 'label' => 'Gelombang PPDB', 'url' => '/admin/master-ppdb/batches'],
    ['icon' => 'waves', 'parent_id' => $master->id, 'sort_order' => 2]
);
Menu::firstOrCreate(
    ['type' => 'admin', 'label' => 'Jalur Pendaftaran', 'url' => '/admin/master-ppdb/paths'],
    ['icon' => 'route', 'parent_id' => $master->id, 'sort_order' => 3]
);
Menu::firstOrCreate(
    ['type' => 'admin', 'label' => 'Syarat Dokumen', 'url' => '/admin/master-ppdb/docs'],
    ['icon' => 'description', 'parent_id' => $master->id, 'sort_order' => 4]
);
// Also remove old Master PPDB menu
Menu::where('url', '/admin/master-ppdb')->delete();


// Group 3: Halaman & Menu
$halaman = Menu::firstOrCreate(
    ['type' => 'admin', 'label' => 'Halaman', 'url' => '#'],
    ['icon' => 'article', 'sort_order' => 30]
);
Menu::where('url', '/admin/pages')->update(['parent_id' => $halaman->id, 'sort_order' => 1]);
Menu::where('url', '/admin/menus')->update(['parent_id' => $halaman->id, 'sort_order' => 2]);
Menu::where('url', '/admin/contacts')->update(['parent_id' => $halaman->id, 'sort_order' => 3]);

// Group 4: Pengaturan
$pengaturan = Menu::firstOrCreate(
    ['type' => 'admin', 'label' => 'Pengaturan', 'url' => '#'],
    ['icon' => 'settings', 'sort_order' => 90]
);
Menu::where('url', '/admin/rbac')->update(['parent_id' => $pengaturan->id, 'sort_order' => 1]);
Menu::where('url', '/admin/profile')->update(['parent_id' => $pengaturan->id, 'sort_order' => 2]);
Menu::where('url', '/admin/organization')->update(['parent_id' => $pengaturan->id, 'sort_order' => 3]);
Menu::where('url', '/admin/academic-calendar')->update(['parent_id' => $pengaturan->id, 'sort_order' => 4]);

// Set Dashboard as default (url '/') if needed, wait url is '/admin'. 
// Move Dashboard to top
Menu::where('url', '/admin')->update(['sort_order' => 1, 'parent_id' => null]);
// Move Manajemen PPDB to top (sort_order 2)
Menu::where('url', '/admin/ppdb')->update(['sort_order' => 2, 'parent_id' => null]);
// Move Akademik group to sort_order 3
Menu::where('label', 'Akademik')->update(['sort_order' => 3]);

echo "Menus migrated successfully.\n";
