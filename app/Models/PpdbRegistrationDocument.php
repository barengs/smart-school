<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PpdbRegistrationDocument extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function registration()
    {
        return $this->belongsTo(PpdbRegistration::class, 'ppdb_registration_id');
    }

    public function documentRequirement()
    {
        return $this->belongsTo(PpdbDocumentRequirement::class, 'ppdb_document_requirement_id');
    }
}
