<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PpdbRegistration extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function batch()
    {
        return $this->belongsTo(PpdbBatch::class, 'ppdb_batch_id');
    }

    public function path()
    {
        return $this->belongsTo(PpdbPath::class, 'ppdb_path_id');
    }

    public function documents()
    {
        return $this->hasMany(PpdbRegistrationDocument::class, 'ppdb_registration_id');
    }
}
