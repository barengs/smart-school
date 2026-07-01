<?php

namespace App\Http\Controllers;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\Request;

class RolePermissionController extends Controller
{
    public function getMatrix()
    {
        $menus = \App\Models\Menu::where('type', 'admin')->get();
        $roles = Role::with('permissions')->get();
        $matrix = [];
        
        foreach ($roles as $role) {
            $matrix[$role->name] = (object)[];
            foreach ($menus as $menu) {
                $matrix[$role->name]->{$menu->id} = [];
            }
            foreach ($role->permissions as $permission) {
                if ($permission->menu_id) {
                    $parts = explode('.', $permission->name);
                    $action = end($parts);
                    if ($action) {
                        $matrix[$role->name]->{$permission->menu_id}[] = $action;
                    }
                }
            }
        }

        return response()->json([
            'roles' => $roles,
            'menus' => $menus,
            'matrix' => $matrix
        ]);
    }

    public function users()
    {
        return response()->json(User::with('roles')->get());
    }

    public function updateMatrix(Request $request)
    {
        $roleName = $request->input('role');
        $permissionsMatrix = $request->input('permissions'); // { menuId: ['view', 'create'] }

        $role = Role::where('name', $roleName)->firstOrFail();
        
        $permissionNames = [];
        foreach ($permissionsMatrix as $menuId => $actions) {
            $menu = \App\Models\Menu::find($menuId);
            if ($menu) {
                foreach ($actions as $action) {
                    // Create if not exists to allow dynamic checking
                    $perm = Permission::firstOrCreate(['name' => $menu->url . '.' . $action, 'menu_id' => $menu->id]);
                    $permissionNames[] = $perm->name;
                }
            }
        }

        $role->syncPermissions($permissionNames);

        return response()->json(['message' => 'Matrix updated successfully']);
    }

    public function index()
    {
        return response()->json(Role::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:roles,name|max:255',
            'permissions' => 'nullable|array'
        ]);

        $role = Role::create(['name' => $validated['name']]);
        
        if (isset($validated['permissions'])) {
            $this->syncMatrixPermissions($role, $validated['permissions']);
        }

        return response()->json($role, 201);
    }

    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);

        if ($role->name === 'Super Admin' && $request->input('name') !== 'Super Admin') {
            return response()->json(['message' => 'Cannot rename Super Admin role'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $id,
            'permissions' => 'nullable|array'
        ]);

        $role->update(['name' => $validated['name']]);

        if (isset($validated['permissions'])) {
            $this->syncMatrixPermissions($role, $validated['permissions']);
        }

        return response()->json($role);
    }

    public function destroy($id)
    {
        $role = Role::findOrFail($id);
        
        if ($role->name === 'Super Admin') {
            return response()->json(['message' => 'Cannot delete Super Admin role'], 403);
        }

        $role->delete();
        return response()->json(null, 204);
    }

    private function syncMatrixPermissions($role, $permissionsMatrix)
    {
        $permissionNames = [];
        foreach ($permissionsMatrix as $menuId => $actions) {
            $menu = \App\Models\Menu::find($menuId);
            if ($menu) {
                foreach ($actions as $action) {
                    $perm = Permission::firstOrCreate(['name' => $menu->url . '.' . $action, 'menu_id' => $menu->id]);
                    $permissionNames[] = $perm->name;
                }
            }
        }
        $role->syncPermissions($permissionNames);
    }
}
