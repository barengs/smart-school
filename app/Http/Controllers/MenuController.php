<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public function index(Request $request)
    {
        $query = Menu::query();
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }
        
        $menus = $query->orderBy('sort_order')->get();
        
        // Filter out menus if module is required but not active
        $profile = \App\Models\SchoolProfile::with('service.modules')->first();
        $activeModules = [];
        if ($profile && $profile->service) {
            $activeModules = $profile->service->modules->pluck('code')->toArray();
        }
        
        $menus = $menus->filter(function ($menu) use ($activeModules, $request) {
            // Hide system management menus if user is not super admin
            if (in_array($menu->url, ['/admin/modules', '/admin/services'])) {
                if (!$request->user() || !$request->user()->can('manage-system')) {
                    return false;
                }
            }

            if (!$menu->module) {
                return true; // No module required, always show
            }

            // Developer bypasses module requirement
            if ($request->user() && $request->user()->can('manage-system')) {
                return true;
            }

            return in_array($menu->module, $activeModules);
        });

        return response()->json(array_values($menus->toArray()));
    }

    public function indexPublic()
    {
        return response()->json(Menu::where('type', 'front')->orderBy('sort_order')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'url' => 'required|string|max:255',
            'icon' => 'nullable|string|max:50',
            'sort_order' => 'integer',
            'type' => 'required|string|in:front,admin',
            'parent_id' => 'nullable|exists:menus,id',
            'module' => 'nullable|string'
        ]);

        $menu = Menu::create($validated);
        return response()->json($menu, 201);
    }

    public function show($id)
    {
        $menu = Menu::findOrFail($id);
        return response()->json($menu);
    }

    public function update(Request $request, $id)
    {
        $menu = Menu::findOrFail($id);

        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'url' => 'required|string|max:255',
            'icon' => 'nullable|string|max:50',
            'sort_order' => 'integer',
            'type' => 'required|string|in:front,admin',
            'parent_id' => 'nullable|exists:menus,id',
            'module' => 'nullable|string'
        ]);

        $menu->update($validated);
        return response()->json($menu);
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'menus' => 'required|array',
            'menus.*.id' => 'required|exists:menus,id',
            'menus.*.sort_order' => 'required|integer',
            'menus.*.parent_id' => 'nullable|exists:menus,id',
        ]);

        foreach ($request->menus as $item) {
            Menu::where('id', $item['id'])->update([
                'sort_order' => $item['sort_order'],
                'parent_id' => $item['parent_id'] ?? null
            ]);
        }

        return response()->json(['message' => 'Menus reordered successfully']);
    }

    public function destroy($id)
    {
        $menu = Menu::findOrFail($id);
        $menu->delete();
        return response()->json(null, 204);
    }
}
