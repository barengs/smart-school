<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeacherDocument extends Model
{
    protected $fillable = ['teacher_id', 'type', 'file_path', 'title'];
    public function teacher() { return $this->belongsTo(Teacher::class); }
}
