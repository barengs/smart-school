<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentGrade extends Model
{
    protected $fillable = [
        'student_id', 'subject_id', 'semester_id', 'classroom_id',
        'assignment_score', 'midterm_score', 'final_score', 'final_grade'
    ];

    public function student() { return $this->belongsTo(Student::class); }
    public function subject() { return $this->belongsTo(Subject::class); }
    public function semester() { return $this->belongsTo(Semester::class); }
    public function classroom() { return $this->belongsTo(Classroom::class); }
}
