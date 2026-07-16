<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SubjectController extends Controller
{
    public function index()
    {
        return response()->json(\App\Models\Subject::orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:subjects',
            'name' => 'required|string|max:255',
        ]);
        $subject = \App\Models\Subject::create($validated);
        return response()->json($subject, 201);
    }

    public function show(string $id)
    {
        return response()->json(\App\Models\Subject::findOrFail($id));
    }

    public function update(Request $request, string $id)
    {
        $subject = \App\Models\Subject::findOrFail($id);
        $validated = $request->validate([
            'code' => 'sometimes|required|string|unique:subjects,code,' . $id,
            'name' => 'sometimes|required|string|max:255',
        ]);
        $subject->update($validated);
        return response()->json($subject);
    }

    public function destroy($id)
    {
        $subject = \App\Models\Subject::findOrFail($id);
        $subject->delete();

        return response()->json(null, 204);
    }

    public function export()
    {
        return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\SubjectExport(), 'Mata_Pelajaran.xlsx');
    }

    public function template()
    {
        return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\SubjectExport(true), 'Template_Import_Mata_Pelajaran.xlsx');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:2048'
        ]);

        try {
            \Maatwebsite\Excel\Facades\Excel::import(new \App\Imports\SubjectImport, $request->file('file'));
            return response()->json(['message' => 'Data mata pelajaran berhasil diimpor']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Gagal mengimpor data: ' . $e->getMessage()], 500);
        }
    }
}
