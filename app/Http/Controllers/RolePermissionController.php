<?php

namespace App\Http\Controllers;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\Request;

class RolePermissionController extends Controller
{
    public function roles()
    {
        return response()->json(Role::with('permissions')->get());
    }

    public function users()
    {
        return response()->json(User::with('roles')->get());
    }

    public function updateMatrix(Request $request)
    {
        $roleId = $request->input('role_id');
        $permissions = $request->input('permissions'); // array of permission names

        $role = Role::findOrFail($roleId);
        $role->syncPermissions($permissions);

        return response()->json(['message' => 'Matrix updated successfully']);
    }
}
