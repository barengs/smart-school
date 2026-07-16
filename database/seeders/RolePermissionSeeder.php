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
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        Permission::truncate();
        Role::truncate();
        \Illuminate\Support\Facades\DB::table('role_has_permissions')->truncate();
        \Illuminate\Support\Facades\DB::table('model_has_roles')->truncate();
        \Illuminate\Support\Facades\DB::table('model_has_permissions')->truncate();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        // Ambil ID menu (admin only)
        $menus = Menu::where('type', 'admin')->get()->keyBy('label');

        // Buat permissions
        $actions = ['view', 'create', 'update', 'delete', 'approve'];
        
        foreach ($menus as $label => $menu) {
            if ($menu->url === '#' || empty($menu->url)) {
                continue; // Skip creating permissions for parent menus without URL
            }
            foreach ($actions as $action) {
                // Ignore approve unless it's news or ppdb
                if ($action === 'approve' && !in_array($label, ['Manajemen Berita', 'Manajemen PPDB'])) {
                    continue;
                }
                Permission::firstOrCreate(['name' => $menu->url . '.' . $action, 'menu_id' => $menu->id]);
            }
        }

        // System permissions
        $manageSystem = Permission::firstOrCreate(['name' => 'manage-system']);

        // Roles
        $superAdmin = Role::firstOrCreate(['name' => 'Super Admin']);
        // Super Admin gets all menu permissions but NOT manage-system by default
        $superAdmin->givePermissionTo(Permission::where('name', '!=', 'manage-system')->get());

        $developer = Role::firstOrCreate(['name' => 'Developer']);
        $developer->givePermissionTo(Permission::all());

        $editor = Role::firstOrCreate(['name' => 'Editor Berita']);
        if (isset($menus['Manajemen Berita'])) {
            $editor->givePermissionTo([
                '/admin/news.view', 
                '/admin/news.create', 
                '/admin/news.update'
            ]);
        }

        $reviewer = Role::firstOrCreate(['name' => 'Reviewer PPDB']);
        if (isset($menus['Manajemen PPDB'])) {
            $reviewer->givePermissionTo([
                '/admin/ppdb.view', 
                '/admin/ppdb.update', 
                '/admin/ppdb.approve'
            ]);
        }
    }
}
