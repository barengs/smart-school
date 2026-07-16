<?php
$akademik = \App\Models\Menu::where('label', 'Akademik')->first();
if ($akademik && !\App\Models\Menu::where('url', '/admin/grades')->exists()) {
    \App\Models\Menu::create([
        'label' => 'Manajemen Nilai',
        'url' => '/admin/grades',
        'icon' => 'fact_check',
        'sort_order' => 7,
        'type' => 'admin',
        'parent_id' => $akademik->id,
        'module' => 'AKADEMIK'
    ]);
    \App\Models\Menu::create([
        'label' => 'Kenaikan Kelas',
        'url' => '/admin/promotions',
        'icon' => 'trending_up',
        'sort_order' => 8,
        'type' => 'admin',
        'parent_id' => $akademik->id,
        'module' => 'AKADEMIK'
    ]);
    echo "Menus added.\n";
} else {
    echo "Akademik not found or menus already exist.\n";
}
