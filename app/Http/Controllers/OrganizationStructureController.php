<?php

namespace App\Http\Controllers;

use App\Models\OrganizationStructure;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\OrganizationExport;
use App\Imports\OrganizationImport;

class OrganizationStructureController extends Controller
{
    public function index()
    {
        return response()->json(OrganizationStructure::orderBy('order_number')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:organization_structures,id',
            'image' => 'nullable|image|max:2048',
            'order_number' => 'integer',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('organizations', 'public');
            $validated['image_path'] = $path;
        }

        $item = OrganizationStructure::create($validated);
        return response()->json($item, 201);
    }

    public function show($id)
    {
        return response()->json(OrganizationStructure::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $item = OrganizationStructure::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:organization_structures,id',
            'image' => 'nullable|image|max:2048',
            'order_number' => 'integer',
        ]);

        if ($request->hasFile('image')) {
            if ($item->image_path && \Storage::disk('public')->exists($item->image_path)) {
                \Storage::disk('public')->delete($item->image_path);
            }
            $path = $request->file('image')->store('organizations', 'public');
            $validated['image_path'] = $path;
        }

        $item->update($validated);
        return response()->json($item);
    }

    public function destroy($id)
    {
        $item = OrganizationStructure::findOrFail($id);
        $item->delete();
        return response()->json(null, 204);
    }

    public function export()
    {
        return Excel::download(new OrganizationExport(), 'Struktur_Organisasi_' . date('Y-m-d') . '.xlsx');
    }

    public function template()
    {
        return Excel::download(new OrganizationExport(true), 'Template_Import_Organisasi.xlsx');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:2048'
        ]);

        try {
            Excel::import(new OrganizationImport, $request->file('file'));
            return response()->json(['message' => 'Data struktur organisasi berhasil diimpor']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Gagal mengimpor data: ' . $e->getMessage()], 500);
        }
    }
}
