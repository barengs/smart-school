<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$parent = \App\Models\Menu::where('label', 'Akademik')->where('type', 'admin')->first();
if ($parent) {
    $existingGrades = \App\Models\Menu::where('url', '/admin/grades')->first();
    if (!$existingGrades) {
        \App\Models\Menu::create([
            'label' => 'Penilaian',
            'url' => '/admin/grades',
            'icon' => 'text_snippet',
            'type' => 'admin',
            'parent_id' => $parent->id,
            'sort_order' => 7
        ]);
        echo "Menu Penilaian added.\n";
    }

    $existingPromotions = \App\Models\Menu::where('url', '/admin/promotions')->first();
    if (!$existingPromotions) {
        \App\Models\Menu::create([
            'label' => 'Kenaikan Kelas',
            'url' => '/admin/promotions',
            'icon' => 'upgrade',
            'type' => 'admin',
            'parent_id' => $parent->id,
            'sort_order' => 8
        ]);
        echo "Menu Kenaikan Kelas added.\n";
    }
} else {
    echo "Parent Akademik not found.\n";
}
