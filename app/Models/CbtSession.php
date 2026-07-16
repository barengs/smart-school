<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CbtSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam_id',
        'participant_id',
        'participant_type',
        'start_time',
        'end_time',
        'status',
        'final_score',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'final_score' => 'decimal:2',
    ];

    public function exam()
    {
        return $this->belongsTo(CbtExam::class, 'exam_id');
    }

    public function participant()
    {
        return $this->morphTo();
    }

    public function answers()
    {
        return $this->hasMany(CbtAnswer::class, 'session_id');
    }
}
