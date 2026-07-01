<?php

namespace App\Http\Controllers;

use App\Models\PpdbPath;
use Illuminate\Http\Request;

class PpdbPathController extends Controller
{
    public function index()
    {
        return response()->json(PpdbPath::orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:ppdb_paths',
            'description' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $path = PpdbPath::create($validated);
        return response()->json($path, 201);
    }

    public function show(string $id)
    {
        return response()->json(PpdbPath::findOrFail($id));
    }

    public function update(Request $request, string $id)
    {
        $path = PpdbPath::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255|unique:ppdb_paths,name,' . $id,
            'description' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $path->update($validated);
        return response()->json($path);
    }

    public function destroy(string $id)
    {
        PpdbPath::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
