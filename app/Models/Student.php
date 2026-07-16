<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'nik', 'nis', 'nisn', 'phone', 'address', 'gender', 'birth_date', 'birth_place', 'father_name', 'father_nik', 'mother_name', 'mother_nik', 'parent_phone'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function classrooms()
    {
        return $this->belongsToMany(Classroom::class, 'classroom_students')->withPivot('academic_year_id');
    }
}
