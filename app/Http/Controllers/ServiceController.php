<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index()
    {
        return response()->json(Service::with('modules')->orderBy('code')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:services',
            'name' => 'required|string',
            'description' => 'nullable|string',
            'module_ids' => 'array',
            'module_ids.*' => 'exists:modules,id'
        ]);

        $service = Service::create($validated);
        
        if (isset($validated['module_ids'])) {
            $service->modules()->sync($validated['module_ids']);
        }

        return response()->json($service->load('modules'), 201);
    }

    public function show(string $id)
    {
        return response()->json(Service::with('modules')->findOrFail($id));
    }

    public function update(Request $request, string $id)
    {
        $service = Service::findOrFail($id);
        $validated = $request->validate([
            'code' => 'required|string|unique:services,code,'.$id,
            'name' => 'required|string',
            'description' => 'nullable|string',
            'module_ids' => 'array',
            'module_ids.*' => 'exists:modules,id'
        ]);

        $service->update($validated);

        if (isset($validated['module_ids'])) {
            $service->modules()->sync($validated['module_ids']);
        }

        return response()->json($service->load('modules'));
    }

    public function destroy(string $id)
    {
        Service::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
