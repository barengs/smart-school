<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeacherRank extends Model
{
    protected $fillable = ['teacher_id', 'rank_group', 'tmt'];
    public function teacher() { return $this->belongsTo(Teacher::class); }
}
