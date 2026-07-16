<?php

namespace App\Http\Controllers;

use App\Models\Module;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    public function index()
    {
        return response()->json(Module::orderBy('code')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:modules',
            'name' => 'required|string',
            'description' => 'nullable|string',
        ]);

        $module = Module::create($validated);
        return response()->json($module, 201);
    }

    public function show(string $id)
    {
        return response()->json(Module::findOrFail($id));
    }

    public function update(Request $request, string $id)
    {
        $module = Module::findOrFail($id);
        $validated = $request->validate([
            'code' => 'required|string|unique:modules,code,'.$id,
            'name' => 'required|string',
            'description' => 'nullable|string',
        ]);

        $module->update($validated);
        return response()->json($module);
    }

    public function destroy(string $id)
    {
        Module::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
