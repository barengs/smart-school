<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Meeting extends Model
{
    protected $fillable = [
        'schedule_id', 'meeting_number', 'planned_date', 'planned_time',
        'actual_date', 'actual_time', 'type', 'topic', 'material',
        'lecturer_presence', 'notes', 'learning_method',
    ];

    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }
}
