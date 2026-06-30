<?php

namespace Database\Seeders;

use App\Models\Menu;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Ambil ID menu
        $menus = Menu::all()->keyBy('name');

        // Buat permissions
        $actions = ['read', 'create', 'update', 'delete'];
        
        foreach ($menus as $name => $menu) {
            foreach ($actions as $action) {
                Permission::firstOrCreate(['name' => $menu->route_path . '.' . $action, 'menu_id' => $menu->id]);
            }
        }
        // Khusus approve berita & ppdb
        if (isset($menus['Manajemen Berita'])) {
            Permission::firstOrCreate(['name' => '/admin/news.approve', 'menu_id' => $menus['Manajemen Berita']->id]);
        }
        if (isset($menus['Data PPDB'])) {
            Permission::firstOrCreate(['name' => '/admin/ppdb.approve', 'menu_id' => $menus['Data PPDB']->id]);
        }

        // Roles
        $superAdmin = Role::firstOrCreate(['name' => 'Super Admin']);
        $superAdmin->givePermissionTo(Permission::all());

        $editor = Role::firstOrCreate(['name' => 'Editor Berita']);
        if (isset($menus['Manajemen Berita'])) {
            $editor->givePermissionTo(['/admin/news.read', '/admin/news.create', '/admin/news.update']);
        }

        $reviewer = Role::firstOrCreate(['name' => 'Reviewer PPDB']);
        if (isset($menus['Data PPDB'])) {
            $reviewer->givePermissionTo(['/admin/ppdb.read', '/admin/ppdb.update', '/admin/ppdb.approve']);
        }
    }
}
