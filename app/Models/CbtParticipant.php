<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CbtParticipant extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam_id',
        'participant_id',
        'participant_type',
    ];

    public function exam()
    {
        return $this->belongsTo(CbtExam::class, 'exam_id');
    }

    public function participant()
    {
        return $this->morphTo();
    }
}
