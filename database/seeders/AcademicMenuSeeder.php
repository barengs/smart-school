<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AcademicMenuSeeder extends Seeder
{
    public function run(): void
    {
        $parent = \App\Models\Menu::create([
            'label' => 'Akademik',
            'url' => '#',
            'icon' => 'school',
            'type' => 'admin',
            'sort_order' => 50
        ]);

        $menus = [
            ['label' => 'Mata Pelajaran', 'url' => '/admin/subjects', 'icon' => 'menu_book'],
            ['label' => 'Kelas & Rombel', 'url' => '/admin/classrooms', 'icon' => 'meeting_room'],
            ['label' => 'Jadwal Pelajaran', 'url' => '/admin/schedules', 'icon' => 'calendar_month'],
            ['label' => 'Data Guru', 'url' => '/admin/teachers', 'icon' => 'badge'],
            ['label' => 'Data Siswa', 'url' => '/admin/students', 'icon' => 'face'],
            ['label' => 'Presensi', 'url' => '/admin/attendance', 'icon' => 'fact_check'],
            ['label' => 'Penilaian', 'url' => '/admin/grades', 'icon' => 'text_snippet'],
            ['label' => 'Kenaikan Kelas', 'url' => '/admin/promotions', 'icon' => 'upgrade'],
        ];

        foreach ($menus as $idx => $menu) {
            \App\Models\Menu::create(array_merge($menu, [
                'parent_id' => $parent->id,
                'type' => 'admin',
                'sort_order' => $idx + 1
            ]));
        }
    }
}
