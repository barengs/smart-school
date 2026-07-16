<?php

namespace App\Imports;

use App\Models\Subject;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class SubjectImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        return Subject::updateOrCreate(
            ['code' => $row['kode_mata_pelajaran'] ?? $row['kode']],
            ['name' => $row['nama_mata_pelajaran'] ?? $row['nama']]
        );
    }
}
