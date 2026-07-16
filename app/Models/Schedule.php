<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Observers\ScheduleObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;

#[ObservedBy([ScheduleObserver::class])]
class Schedule extends Model
{
    use HasFactory;
    protected $fillable = ['semester_id', 'classroom_id', 'subject_id', 'teacher_id', 'day', 'lesson_hour_id'];

    public function semester() { return $this->belongsTo(Semester::class); }
    public function classroom() { return $this->belongsTo(Classroom::class); }
    public function subject() { return $this->belongsTo(Subject::class); }
    public function teacher() { return $this->belongsTo(Teacher::class); }
    public function lessonHour() { return $this->belongsTo(LessonHour::class); }
    public function meetings() { return $this->hasMany(Meeting::class)->orderBy('meeting_number'); }

    /** Siswa di kelas ini via classroom_students */
    public function students()
    {
        return Student::whereHas('classrooms', fn($q) => $q->where('classrooms.id', $this->classroom_id));
    }
}
