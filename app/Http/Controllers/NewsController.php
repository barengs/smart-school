<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\NewsExport;

use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

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
        return response()->json(News::with(['category', 'author', 'tags'])->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $data = $request->except(['tags', 'image_path']);
        $news = new News($data);
        $news->slug = Str::slug($request->title);
        $news->author_id = Auth::guard('api')->id() ?? 1;
        $news->status = 'pending_approval';
        
        if ($request->hasFile('image_path')) {
            $file = $request->file('image_path');
            $filename = uniqid('news_') . '.webp';
            
            $manager = new ImageManager(new Driver());
            $image = $manager->read($file->getRealPath());
            
            // Encode to webp and save to public disk
            $path = 'news/' . $filename;
            \Illuminate\Support\Facades\Storage::disk('public')->put($path, (string) $image->toWebp(80));
            
            $news->image_path = $path;
        }

        $news->save();

        if ($request->has('tags')) {
            $tagIds = [];
            $inputTags = is_string($request->tags) ? json_decode($request->tags) : $request->tags;
            if (is_array($inputTags)) {
                foreach ($inputTags as $tag) {
                    if (is_numeric($tag)) {
                        $tagIds[] = (int) $tag;
                    } else {
                        // It's a new string tag, create it
                        $newTag = \App\Models\Tag::firstOrCreate(
                            ['slug' => Str::slug($tag)],
                            ['name' => $tag]
                        );
                        $tagIds[] = $newTag->id;
                    }
                }
            }
            $news->tags()->sync($tagIds);
        }

        return response()->json($news, 201);
    }

    public function show($id)
    {
        return response()->json(News::with(['category', 'author', 'tags'])->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $news = News::findOrFail($id);
        $data = $request->except(['tags', 'image_path']);
        $news->fill($data);
        if ($request->has('title')) {
            $news->slug = Str::slug($request->title);
        }

        if ($request->hasFile('image_path')) {
            $file = $request->file('image_path');
            $filename = uniqid('news_') . '.webp';
            
            $manager = new ImageManager(new Driver());
            $image = $manager->read($file->getRealPath());
            
            // Encode to webp and save to public disk
            $path = 'news/' . $filename;
            \Illuminate\Support\Facades\Storage::disk('public')->put($path, (string) $image->toWebp(80));
            
            $news->image_path = $path;
        }

        $news->save();

        if ($request->has('tags')) {
            $tagIds = [];
            $inputTags = is_string($request->tags) ? json_decode($request->tags) : $request->tags;
            if (is_array($inputTags)) {
                foreach ($inputTags as $tag) {
                    if (is_numeric($tag)) {
                        $tagIds[] = (int) $tag;
                    } else {
                        // It's a new string tag, create it
                        $newTag = \App\Models\Tag::firstOrCreate(
                            ['slug' => Str::slug($tag)],
                            ['name' => $tag]
                        );
                        $tagIds[] = $newTag->id;
                    }
                }
            }
            $news->tags()->sync($tagIds);
        }

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

    public function exportCsv()
    {
        return Excel::download(new NewsExport, 'Data_Berita_' . date('Y-m-d') . '.csv', \Maatwebsite\Excel\Excel::CSV);
    }
}
