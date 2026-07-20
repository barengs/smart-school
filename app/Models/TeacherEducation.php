<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeacherEducation extends Model
{
    protected $fillable = ['teacher_id', 'degree', 'institution', 'major', 'graduation_year', 'is_linear'];
    public function teacher() { return $this->belongsTo(Teacher::class); }
}
