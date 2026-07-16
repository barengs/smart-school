<?php

namespace App\Http\Controllers;

use App\Models\Semester;
use Illuminate\Http\Request;

class SemesterController extends Controller
{
    public function index(Request $request)
    {
        $query = Semester::with('academicYear');
        if ($request->has('academic_year_id') && $request->academic_year_id) {
            $query->where('academic_year_id', $request->academic_year_id);
        }
        return response()->json($query->orderBy('id', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'name' => 'required|string|max:100',
            'is_active' => 'boolean'
        ]);

        if ($validated['is_active'] ?? false) {
            Semester::where('academic_year_id', $validated['academic_year_id'])->update(['is_active' => false]);
            $validated['is_active'] = true;
        } else {
            $count = Semester::where('academic_year_id', $validated['academic_year_id'])->count();
            if ($count === 0) {
                $validated['is_active'] = true;
            } else {
                $validated['is_active'] = false;
            }
        }

        $semester = Semester::create($validated);
        return response()->json($semester->load('academicYear'), 201);
    }

    public function show($id)
    {
        return response()->json(Semester::with('academicYear')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $semester = Semester::findOrFail($id);
        
        $validated = $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'name' => 'required|string|max:100',
            'is_active' => 'boolean'
        ]);

        if (isset($validated['is_active'])) {
            if ($validated['is_active']) {
                Semester::where('academic_year_id', $validated['academic_year_id'])
                    ->where('id', '!=', $id)
                    ->update(['is_active' => false]);
            } else {
                $otherActiveExists = Semester::where('academic_year_id', $validated['academic_year_id'])
                    ->where('id', '!=', $id)
                    ->where('is_active', true)
                    ->exists();
                if (!$otherActiveExists) {
                    return response()->json(['message' => 'Minimal harus ada satu Semester yang aktif di tahun ajaran ini! Pilih Semester lain untuk diaktifkan terlebih dahulu.'], 422);
                }
            }
        }

        $semester->update($validated);
        return response()->json($semester->load('academicYear'));
    }

    public function destroy($id)
    {
        Semester::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
