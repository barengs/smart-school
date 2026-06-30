<?php

namespace Database\Seeders;

use App\Models\Menu;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        $dashboard = Menu::firstOrCreate(
            ['route_path' => '/admin'],
            [
                'name' => 'Dashboard',
                'icon' => 'fas fa-tachometer-alt',
                'order_number' => 1,
            ]
        );

        $profil = Menu::firstOrCreate(
            ['route_path' => '/admin/profile'],
            [
                'name' => 'Profil Sekolah',
                'icon' => 'fas fa-school',
                'order_number' => 2,
            ]
        );

        $berita = Menu::firstOrCreate(
            ['route_path' => '/admin/news'],
            [
                'name' => 'Manajemen Berita',
                'icon' => 'fas fa-newspaper',
                'order_number' => 3,
            ]
        );

        $ppdb = Menu::firstOrCreate(
            ['route_path' => '/admin/ppdb'],
            [
                'name' => 'Data PPDB',
                'icon' => 'fas fa-users',
                'order_number' => 4,
            ]
        );

        $rbac = Menu::firstOrCreate(
            ['route_path' => '/admin/rbac'],
            [
                'name' => 'Manajemen Akses',
                'icon' => 'fas fa-user-shield',
                'order_number' => 5,
            ]
        );
    }
}
