<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TagController extends Controller
{
    public function index()
    {
        return response()->json(Tag::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:tags,name',
        ]);
        $validated['slug'] = Str::slug($validated['name']);

        $tag = Tag::create($validated);
        return response()->json($tag, 201);
    }

    public function show($id)
    {
        return response()->json(Tag::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $tag = Tag::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:tags,name,' . $id,
        ]);
        $validated['slug'] = Str::slug($validated['name']);
        $tag->update($validated);
        return response()->json($tag);
    }

    public function destroy($id)
    {
        Tag::destroy($id);
        return response()->json(null, 204);
    }
}
