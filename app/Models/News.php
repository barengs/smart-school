<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function category() { return $this->belongsTo(Category::class); }
    public function author() { return $this->belongsTo(User::class, 'author_id'); }

    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }
}
