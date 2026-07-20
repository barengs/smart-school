<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id', 'nip', 'nuptk', 'phone', 'address', 'gender',
        'nik', 'kk_number', 'birth_place', 'birth_date',
        'employment_status', 'nrg', 'base_administration',
        'certification_subject', 'ukg_score'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function subjects()
    {
        return $this->belongsToMany(Subject::class);
    }

    public function educations()
    {
        return $this->hasMany(TeacherEducation::class);
    }

    public function ranks()
    {
        return $this->hasMany(TeacherRank::class);
    }

    public function documents()
    {
        return $this->hasMany(TeacherDocument::class);
    }
}
