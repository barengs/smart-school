<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class TeacherController extends Controller
{
    public function index()
    {
        return response()->json(\App\Models\Teacher::with(['user', 'subjects'])->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'nip' => 'nullable|string|unique:teachers',
            'nuptk' => 'nullable|string',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'gender' => 'nullable|string',
            'subject_ids' => 'nullable|array',
            'subject_ids.*' => 'exists:subjects,id',
        ]);

        $teacher = DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make('password'),
            ]);

            $teacher = \App\Models\Teacher::create([
                'user_id' => $user->id,
                'nip' => $validated['nip'] ?? null,
                'nuptk' => $validated['nuptk'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'address' => $validated['address'] ?? null,
                'gender' => $validated['gender'] ?? null,
            ]);

            if (isset($validated['subject_ids'])) {
                $teacher->subjects()->sync($validated['subject_ids']);
            }

            return $teacher;
        });

        return response()->json($teacher->load('subjects'), 201);
    }

    public function show(string $id)
    {
        return response()->json(\App\Models\Teacher::with(['user', 'subjects'])->findOrFail($id));
    }

    public function update(Request $request, string $id)
    {
        $teacher = \App\Models\Teacher::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $teacher->user_id,
            'nip' => 'nullable|string|unique:teachers,nip,' . $id,
            'nuptk' => 'nullable|string',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'gender' => 'nullable|string',
            'subject_ids' => 'nullable|array',
            'subject_ids.*' => 'exists:subjects,id',
        ]);

        DB::transaction(function () use ($teacher, $validated) {
            $teacher->user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
            ]);

            $teacher->update([
                'nip' => $validated['nip'] ?? null,
                'nuptk' => $validated['nuptk'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'address' => $validated['address'] ?? null,
                'gender' => $validated['gender'] ?? null,
            ]);
            
            if (isset($validated['subject_ids'])) {
                $teacher->subjects()->sync($validated['subject_ids']);
            }
        });

        return response()->json($teacher->load('subjects'));
    }

    public function destroy(string $id)
    {
        \App\Models\Teacher::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
