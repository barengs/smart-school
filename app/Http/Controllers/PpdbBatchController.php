<?php

namespace App\Http\Controllers;

use App\Models\PpdbBatch;
use Illuminate\Http\Request;

class PpdbBatchController extends Controller
{
    public function index()
    {
        return response()->json(PpdbBatch::with('academicYear')->orderBy('start_date', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'quota' => 'nullable|integer|min:1',
            'is_active' => 'boolean'
        ]);

        $batch = PpdbBatch::create($validated);
        return response()->json($batch->load('academicYear'), 201);
    }

    public function show(string $id)
    {
        return response()->json(PpdbBatch::with('academicYear')->findOrFail($id));
    }

    public function update(Request $request, string $id)
    {
        $batch = PpdbBatch::findOrFail($id);

        $validated = $request->validate([
            'academic_year_id' => 'sometimes|required|exists:academic_years,id',
            'name' => 'sometimes|required|string|max:255',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date|after_or_equal:start_date',
            'quota' => 'nullable|integer|min:1',
            'is_active' => 'boolean'
        ]);

        $batch->update($validated);
        return response()->json($batch->load('academicYear'));
    }

    public function destroy(string $id)
    {
        PpdbBatch::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
