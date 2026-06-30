<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class NewsController extends Controller
{
    public function indexPublic()
    {
        return response()->json(News::where('status', 'published')->orderBy('published_at', 'desc')->get());
    }

    public function showPublic($slug)
    {
        return response()->json(News::where('slug', $slug)->where('status', 'published')->firstOrFail());
    }

    public function index()
    {
        return response()->json(News::with(['category', 'author'])->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $news = new News($request->all());
        $news->slug = Str::slug($request->title);
        $news->author_id = Auth::guard('api')->id();
        $news->status = 'pending_approval';
        $news->save();

        return response()->json($news, 201);
    }

    public function show($id)
    {
        return response()->json(News::with(['category', 'author'])->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $news = News::findOrFail($id);
        $news->fill($request->all());
        if ($request->has('title')) {
            $news->slug = Str::slug($request->title);
        }
        $news->save();

        return response()->json($news);
    }

    public function destroy($id)
    {
        News::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }

    public function approve($id)
    {
        $news = News::findOrFail($id);
        $news->status = 'published';
        $news->published_at = now();
        $news->save();

        return response()->json(['message' => 'Approved and published', 'data' => $news]);
    }
}
