<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    use HasFactory;

    protected $fillable = [
        'label',
        'url',
        'icon',
        'parent_id',
        'sort_order',
        'type',
        'module'
    ];

    public function parent()
    {
        return $this->belongsTo(Menu::class, 'parent_id');
    }
}
