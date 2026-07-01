<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json(Category::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string'
        ]);
        $validated['slug'] = Str::slug($validated['name']);

        $category = Category::create($validated);
        return response()->json($category, 201);
    }

    public function show($id)
    {
        return response()->json(Category::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $id,
            'description' => 'nullable|string'
        ]);
        if ($request->has('name')) {
            $validated['slug'] = Str::slug($validated['name']);
        }
        $category->update($validated);
        return response()->json($category);
    }

    public function destroy($id)
    {
        Category::destroy($id);
        return response()->json(null, 204);
    }
}
