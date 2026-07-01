<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PpdbBatch extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function registrations()
    {
        return $this->hasMany(PpdbRegistration::class);
    }
}
