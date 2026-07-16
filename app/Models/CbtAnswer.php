<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CbtAnswer extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'question_id',
        'option_id',
        'essay_answer',
        'score',
    ];

    protected $casts = [
        'score' => 'decimal:2',
    ];

    public function session()
    {
        return $this->belongsTo(CbtSession::class, 'session_id');
    }

    public function question()
    {
        return $this->belongsTo(CbtQuestion::class, 'question_id');
    }

    public function option()
    {
        return $this->belongsTo(CbtOption::class, 'option_id');
    }
}
