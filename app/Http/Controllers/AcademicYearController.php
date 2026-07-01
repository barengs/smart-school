<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use Illuminate\Http\Request;

class AcademicYearController extends Controller
{
    public function index()
    {
        return response()->json(AcademicYear::orderBy('id', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:academic_years',
            'is_active' => 'boolean'
        ]);

        if ($request->is_active) {
            AcademicYear::where('is_active', true)->update(['is_active' => false]);
        }

        $academicYear = AcademicYear::create($validated);
        return response()->json($academicYear, 201);
    }

    public function show(string $id)
    {
        return response()->json(AcademicYear::findOrFail($id));
    }

    public function update(Request $request, string $id)
    {
        $academicYear = AcademicYear::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255|unique:academic_years,name,' . $id,
            'is_active' => 'boolean'
        ]);

        if (isset($validated['is_active']) && $validated['is_active']) {
            AcademicYear::where('id', '!=', $id)->update(['is_active' => false]);
        }

        $academicYear->update($validated);
        return response()->json($academicYear);
    }

    public function destroy(string $id)
    {
        AcademicYear::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
