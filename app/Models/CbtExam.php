<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CbtExam extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'type',
        'start_time',
        'end_time',
        'duration_minutes',
        'randomize_questions',
        'is_active',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'randomize_questions' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function questions()
    {
        return $this->hasMany(CbtQuestion::class, 'exam_id');
    }

    public function participants()
    {
        return $this->hasMany(CbtParticipant::class, 'exam_id');
    }

    public function sessions()
    {
        return $this->hasMany(CbtSession::class, 'exam_id');
    }
}
