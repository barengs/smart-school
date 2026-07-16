<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ClassroomController extends Controller
{
    public function index()
    {
        return response()->json(\App\Models\Classroom::with(['teacher'])->orderBy('level')->orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'level' => 'required|string',
            'teacher_id' => 'nullable|exists:teachers,id',
        ]);
        $classroom = \App\Models\Classroom::create($validated);
        return response()->json($classroom, 201);
    }

    public function show(string $id)
    {
        return response()->json(\App\Models\Classroom::with(['teacher'])->findOrFail($id));
    }

    public function update(Request $request, string $id)
    {
        $classroom = \App\Models\Classroom::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'level' => 'sometimes|required|string',
            'teacher_id' => 'nullable|exists:teachers,id',
        ]);
        $classroom->update($validated);
        return response()->json($classroom);
    }

    public function destroy($id)
    {
        $classroom = \App\Models\Classroom::findOrFail($id);
        $classroom->delete();

        return response()->json(null, 204);
    }

    public function export()
    {
        return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\ClassroomExport(), 'Kelas_Rombel.xlsx');
    }

    public function template()
    {
        return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\ClassroomExport(true), 'Template_Import_Kelas_Rombel.xlsx');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:2048'
        ]);

        try {
            \Maatwebsite\Excel\Facades\Excel::import(new \App\Imports\ClassroomImport, $request->file('file'));
            return response()->json(['message' => 'Data kelas berhasil diimpor']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Gagal mengimpor data: ' . $e->getMessage()], 500);
        }
    }
}
