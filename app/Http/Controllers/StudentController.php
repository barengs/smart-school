<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index()
    {
        return response()->json(\App\Models\Student::with(['user', 'classrooms'])->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'nik' => 'nullable|string|size:16|unique:students',
            'nis' => 'nullable|string|unique:students',
            'nisn' => 'nullable|string',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'gender' => 'nullable|string',
            'birth_date' => 'nullable|date',
            'birth_place' => 'nullable|string',
            'father_name' => 'nullable|string',
            'father_nik' => 'nullable|string|size:16',
            'mother_name' => 'nullable|string',
            'mother_nik' => 'nullable|string|size:16',
            'parent_phone' => 'nullable|string',
        ]);
        $student = \App\Models\Student::create($validated);
        return response()->json($student, 201);
    }

    public function show(string $id)
    {
        return response()->json(\App\Models\Student::with(['user', 'classrooms'])->findOrFail($id));
    }

    public function update(Request $request, string $id)
    {
        $student = \App\Models\Student::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'user_id' => 'sometimes|required|exists:users,id',
            'nik' => 'nullable|string|size:16|unique:students,nik,' . $id,
            'nis' => 'nullable|string|unique:students,nis,' . $id,
            'nisn' => 'nullable|string',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'gender' => 'nullable|string',
            'birth_date' => 'nullable|date',
            'birth_place' => 'nullable|string',
            'father_name' => 'nullable|string',
            'father_nik' => 'nullable|string|size:16',
            'mother_name' => 'nullable|string',
            'mother_nik' => 'nullable|string|size:16',
            'parent_phone' => 'nullable|string',
        ]);
        
        $student->update($request->except(['name', 'user_id']));

        if ($request->has('name') && $student->user) {
            $student->user->update(['name' => $request->name]);
        }

        return response()->json($student);
    }

    public function destroy(string $id)
    {
        \App\Models\Student::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
