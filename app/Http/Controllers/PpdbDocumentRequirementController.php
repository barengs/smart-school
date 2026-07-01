<?php

namespace App\Http\Controllers;

use App\Models\PpdbDocumentRequirement;
use Illuminate\Http\Request;

class PpdbDocumentRequirementController extends Controller
{
    public function index()
    {
        return response()->json(PpdbDocumentRequirement::orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:ppdb_document_requirements',
            'description' => 'nullable|string',
            'is_required' => 'boolean'
        ]);

        $req = PpdbDocumentRequirement::create($validated);
        return response()->json($req, 201);
    }

    public function show(string $id)
    {
        return response()->json(PpdbDocumentRequirement::findOrFail($id));
    }

    public function update(Request $request, string $id)
    {
        $req = PpdbDocumentRequirement::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255|unique:ppdb_document_requirements,name,' . $id,
            'description' => 'nullable|string',
            'is_required' => 'boolean'
        ]);

        $req->update($validated);
        return response()->json($req);
    }

    public function destroy(string $id)
    {
        PpdbDocumentRequirement::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
