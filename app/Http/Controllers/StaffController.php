<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Staff;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

class StaffController extends Controller
{
    public function index()
    {
        return response()->json(Staff::with(['user.roles'])->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'nullable|string|min:6',
            'nip' => 'nullable|string|unique:staff',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'gender' => 'nullable|string',
            'position' => 'nullable|string',
            'roles' => 'nullable|array',
            'roles.*' => 'exists:roles,name',
        ]);

        $staff = DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password'] ?? 'password123'),
            ]);

            if (isset($validated['roles'])) {
                $user->syncRoles($validated['roles']);
            }

            return Staff::create([
                'user_id' => $user->id,
                'nip' => $validated['nip'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'address' => $validated['address'] ?? null,
                'gender' => $validated['gender'] ?? null,
                'position' => $validated['position'] ?? null,
            ]);
        });

        return response()->json($staff->load('user.roles'), 201);
    }

    public function show(string $id)
    {
        return response()->json(Staff::with(['user.roles'])->findOrFail($id));
    }

    public function update(Request $request, string $id)
    {
        $staff = Staff::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $staff->user_id,
            'password' => 'nullable|string|min:6',
            'nip' => 'nullable|string|unique:staff,nip,' . $id,
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'gender' => 'nullable|string',
            'position' => 'nullable|string',
            'roles' => 'nullable|array',
            'roles.*' => 'exists:roles,name',
        ]);

        DB::transaction(function () use ($staff, $validated) {
            $userData = [
                'name' => $validated['name'],
                'email' => $validated['email'],
            ];
            if (!empty($validated['password'])) {
                $userData['password'] = Hash::make($validated['password']);
            }
            $staff->user->update($userData);

            if (isset($validated['roles'])) {
                $staff->user->syncRoles($validated['roles']);
            }

            $staff->update([
                'nip' => $validated['nip'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'address' => $validated['address'] ?? null,
                'gender' => $validated['gender'] ?? null,
                'position' => $validated['position'] ?? null,
            ]);
        });

        return response()->json($staff->load('user.roles'));
    }

    public function destroy(string $id)
    {
        $staff = Staff::findOrFail($id);
        $staff->user()->delete();
        return response()->json(null, 204);
    }
}
