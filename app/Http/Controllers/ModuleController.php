<?php

namespace App\Http\Controllers;

use App\Models\Module;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    public function index()
    {
        return response()->json(Module::with('menus')->orderBy('code')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:modules',
            'name' => 'required|string',
            'description' => 'nullable|string',
            'menu_ids' => 'nullable|array'
        ]);

        $module = Module::create($validated);
        
        if (isset($validated['menu_ids'])) {
            \App\Models\Menu::whereIn('id', $validated['menu_ids'])->update(['module' => $module->code]);
        }
        
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
            'menu_ids' => 'nullable|array'
        ]);

        $oldCode = $module->code;
        $module->update($validated);
        
        \App\Models\Menu::where('module', $oldCode)->update(['module' => null]);
        
        if (isset($validated['menu_ids']) && count($validated['menu_ids']) > 0) {
            \App\Models\Menu::whereIn('id', $validated['menu_ids'])->update(['module' => $module->code]);
        }
        
        return response()->json($module);
    }

    public function destroy(string $id)
    {
        Module::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
